import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PostCard from '@/components/community/PostCard'
import CommunitySidebar from '@/components/community/CommunitySidebar'
import JoinButton from '@/components/community/JoinButton'
import Link from 'next/link'
import type { Post } from '@/types/community'
import type { Metadata } from 'next'
import { hotScore } from '@/lib/community/hotScore'

type SortMode = 'hot' | 'new' | 'top'

const SITE_URL = 'https://diamondcritics.com'

// Per-community SEO config — title, description, and keywords tailored to each community
const COMMUNITY_SEO: Record<string, { title: string; description: (m: number, p: number) => string; keywords: string[] }> = {
  diamonds: {
    title: 'r/diamonds — Diamond Advice, Prices & GIA Reviews | DiamondCritics',
    description: (m, p) =>
      `${m.toLocaleString()} members · ${p.toLocaleString()} posts. The go-to diamond community for GIA-certified advice, engagement ring prices, cut grades, and honest reviews. Ask an expert before you buy.`,
    keywords: ['diamond community', 'diamond advice', 'GIA diamond', 'diamond prices', 'engagement ring forum', 'diamond cut grade', 'buy diamond online'],
  },
  'lab-diamonds': {
    title: 'r/lab-diamonds — Lab Grown Diamond Community | DiamondCritics',
    description: (m, p) =>
      `${m.toLocaleString()} members · ${p.toLocaleString()} posts. Lab grown diamond advice, IGI vs GIA comparison, CVD vs HPHT discussion, and price comparisons from real buyers.`,
    keywords: ['lab grown diamond', 'lab diamond forum', 'CVD diamond', 'HPHT diamond', 'IGI diamond', 'lab diamond price'],
  },
  'engagement-rings': {
    title: 'r/engagement-rings — Ring Advice & Show & Tell | DiamondCritics',
    description: (m, p) =>
      `${m.toLocaleString()} members · ${p.toLocaleString()} posts. Engagement ring advice, show & tell, setting styles, and metal choices. Get feedback before you propose.`,
    keywords: ['engagement ring forum', 'engagement ring advice', 'ring setting', 'solitaire ring', 'halo ring', 'proposal ideas'],
  },
}

function communityMeta(slug: string, name: string, description: string | null, memberCount: number, postCount: number) {
  const custom = COMMUNITY_SEO[slug]
  const m = memberCount ?? 0
  const p = postCount ?? 0
  const title = custom?.title ?? `r/${slug} — ${name} | DiamondCritics Diamond Community`
  const desc  = custom
    ? custom.description(m, p)
    : `${m.toLocaleString()} members · ${p.toLocaleString()} posts. ${description ?? `Discuss ${name} with diamond enthusiasts and experts on DiamondCritics.`}`
  const keywords = custom?.keywords ?? [slug, name.toLowerCase(), 'diamond community', 'diamond forum']
  return { title, desc, keywords }
}

export async function generateMetadata({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ sort?: string }> }): Promise<Metadata> {
  const { slug } = await params
  const { sort } = await searchParams
  const supabase = await createClient()
  const { data: c } = await supabase
    .from('communities')
    .select('name, description, member_count, post_count')
    .eq('slug', slug)
    .single()
  if (!c) return {}

  const { title, desc, keywords } = communityMeta(slug, c.name, c.description, c.member_count ?? 0, c.post_count ?? 0)

  return {
    title,
    description: desc,
    keywords,
    alternates: { canonical: `${SITE_URL}/community/r/${slug}` },
    ...(sort && { robots: { index: false, follow: true } }),
    openGraph: {
      title,
      description: desc,
      url: `${SITE_URL}/community/r/${slug}`,
      type: 'website',
      siteName: 'DiamondCritics',
      images: [{ url: '/images/diamondcritics-og.png', width: 1200, height: 630, alt: `${c.name} — DiamondCritics Community` }],
    },
    twitter: { card: 'summary_large_image', title, description: desc },
  }
}

export default async function CommunityPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ sort?: string }>
}) {
  const { slug } = await params
  const { sort } = await searchParams
  const sortMode: SortMode = sort === 'new' ? 'new' : sort === 'top' ? 'top' : 'hot'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch community
  const { data: community } = await supabase
    .from('communities')
    .select('id,slug,name,description,rules,icon_url,banner_url,member_count,post_count,created_at')
    .eq('slug', slug)
    .single()

  if (!community) redirect('/community')

  // Check membership
  let isMember = false
  if (user) {
    const { data: membership } = await supabase
      .from('community_members')
      .select('user_id')
      .eq('community_id', community.id)
      .eq('user_id', user.id)
      .maybeSingle()
    isMember = !!membership
  }

  // Fetch posts (plain select — avoids FK constraint dependency)
  let query = supabase
    .from('posts')
    .select('id,community_id,author_id,title,body,url,image_url,link_preview_image,flair,type,score,comment_count,is_deleted,is_draft,is_pinned,created_at,updated_at')
    .eq('community_id', community.id)
    .eq('is_deleted', false)
    .eq('is_draft', false)

  if (sortMode === 'new') query = query.order('created_at', { ascending: false })
  else if (sortMode === 'top') query = query.order('score', { ascending: false })
  else query = query.order('created_at', { ascending: false })

  const { data: rawPostsData } = await query.limit(50)

  // Fetch authors separately
  const authorIds = [...new Set((rawPostsData ?? []).map(p => p.author_id).filter(Boolean))]
  type AuthorRow = { id: string; username: string; avatar_url: string | null }
  let authorsMap: Record<string, AuthorRow> = {}
  if (authorIds.length) {
    const { data: authors } = await supabase.from('profiles').select('id,username,avatar_url').in('id', authorIds)
    if (authors) authorsMap = Object.fromEntries(authors.map(a => [a.id, a]))
  }

  // User votes
  let userVotes: Record<string, -1 | 1> = {}
  if (user && rawPostsData?.length) {
    const { data: votes } = await supabase
      .from('post_votes')
      .select('post_id, vote')
      .eq('user_id', user.id)
      .in('post_id', rawPostsData.map(p => p.id))
    if (votes) userVotes = Object.fromEntries(votes.map(v => [v.post_id, v.vote]))
  }

  const rawPosts = (rawPostsData ?? []).map(p => ({
    ...p,
    author: authorsMap[p.author_id] ?? null,
    community: { id: community.id, slug: community.slug, name: community.name },
  }))

  let posts: Post[] = rawPosts.map(p => ({ ...p, user_vote: userVotes[p.id] ?? 0 })) as Post[]
  if (sortMode === 'hot') {
    posts = posts.sort((a, b) => hotScore(b.score, b.created_at) - hotScore(a.score, a.created_at))
  }

  const { data: allCommunities } = await supabase.from('communities').select('id,slug,name,description,icon_url,banner_url,member_count,post_count,created_at').order('member_count', { ascending: false })

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Community', item: `${SITE_URL}/community` },
      { '@type': 'ListItem', position: 2, name: community.name, item: `${SITE_URL}/community/r/${slug}` },
    ],
  }

  const forumSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebForum',
    name: slug === 'diamonds' ? 'Diamonds — DiamondCritics Community' : community.name,
    description: community.description ?? `Discussion forum for ${community.name} on DiamondCritics.`,
    url: `${SITE_URL}/community/r/${slug}`,
    inLanguage: 'en-US',
    about: { '@type': 'Thing', name: community.name },
    publisher: { '@type': 'Organization', name: 'DiamondCritics', url: SITE_URL },
    interactionStatistic: [
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/FollowAction',
        userInteractionCount: community.member_count ?? 0,
      },
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/WriteAction',
        userInteractionCount: community.post_count ?? 0,
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(forumSchema) }} />
    <div className="c-layout">
      <div>
        {/* Community header */}
        <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', marginBottom: '12px', boxShadow: '0 1px 4px rgba(28,18,9,0.07), 0 4px 16px rgba(28,18,9,0.05)' }}>
          <div style={{ background: 'linear-gradient(135deg, #1C1209 0%, #3A2208 100%)', padding: '20px 20px 28px', position: 'relative' }}>
            <div style={{ position: 'absolute', bottom: '-20px', left: '20px', width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(145deg, #D4A843, #B8881E)', display: 'flex', alignItems: 'center', justifyContent: 'center', outline: '3px solid #fff' }}>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M5 2.5L2 7.5l8 10 8-10-3-5H5z" stroke="white" strokeWidth="1.4" strokeLinejoin="round"/>
                <path d="M2 7.5h16M5 2.5l2.5 5m5-5L10 7.5" stroke="white" strokeWidth="1.4" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div style={{ padding: '28px 20px 16px', display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontFamily: 'var(--font-ivy, Georgia, serif)', fontSize: '18px', fontWeight: 600, color: '#1C1209', marginBottom: '3px' }}>r/{slug}</h1>
              <p style={{ fontSize: '13px', color: '#7A6F66', marginBottom: '4px' }}>{community.description}</p>
              <p style={{ fontSize: '12px', color: '#9A8F87' }}>
                <strong style={{ color: '#5A504A' }}>{(community.member_count ?? 0).toLocaleString()}</strong> members
                {community.post_count ? <> · <strong style={{ color: '#5A504A' }}>{community.post_count.toLocaleString()}</strong> posts</> : null}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              <JoinButton communityId={community.id} initialIsMember={isMember} userId={user?.id} />
              {user && (
                <Link href={`/community/r/${slug}/submit`} style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  background: 'linear-gradient(145deg, #D4A843, #B8881E)',
                  color: '#fff', fontWeight: 600, fontSize: '13px',
                  padding: '9px 16px', borderRadius: '8px', textDecoration: 'none',
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Create Post
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Sort tabs */}
        <div className="c-sort-bar" style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 4px rgba(28,18,9,0.07), 0 4px 16px rgba(28,18,9,0.05)', padding: '8px 12px', marginBottom: '12px' }}>
          {([{ key: 'hot', label: 'Hot', emoji: '🔥' }, { key: 'new', label: 'New', emoji: '✨' }, { key: 'top', label: 'Top', emoji: '📈' }] as const).map(tab => (
            <Link key={tab.key} href={`/community/r/${slug}?sort=${tab.key}`} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '7px 14px', borderRadius: '8px',
              fontSize: '13px', fontWeight: sortMode === tab.key ? 600 : 500,
              textDecoration: 'none',
              background: sortMode === tab.key ? '#F0E8D8' : 'transparent',
              color: sortMode === tab.key ? '#1C1209' : '#9A8F87',
            }}>
              <span>{tab.emoji}</span> {tab.label}
            </Link>
          ))}
        </div>

        {/* Posts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {posts.length === 0 ? (
            <div style={{ background: '#fff', border: '1px solid #E2DDD7', borderRadius: '12px', padding: '40px 24px', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(198,151,62,0.13), rgba(198,151,62,0.27))' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C6973E" strokeWidth="1.5" strokeLinejoin="round">
                  <path d="M6 3L2 9l10 12L22 9l-4-6H6z"/><path d="M2 9h20M6 3l3 6m6-6l-3 6"/>
                </svg>
              </div>
              <p style={{ fontWeight: 600, marginBottom: '4px', color: '#18110A', fontFamily: 'var(--font-ivy), Georgia, serif', fontSize: '1.05rem' }}>No posts in r/{slug} yet</p>
              <p style={{ fontSize: '13px', marginBottom: '16px', color: '#9A8F87' }}>Be the first to start the conversation</p>
              {user ? (
                <Link href={`/community/r/${slug}/submit`} style={{ display: 'inline-block', padding: '9px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, background: '#C6973E', color: '#fff', textDecoration: 'none' }}>
                  Create First Post
                </Link>
              ) : (
                <Link href="/community/register" style={{ display: 'inline-block', padding: '9px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, background: '#C6973E', color: '#fff', textDecoration: 'none' }}>
                  Join to Post
                </Link>
              )}
            </div>
          ) : (
            posts.map(post => <PostCard key={post.id} post={post} userId={user?.id} />)
          )}
        </div>
      </div>

      <CommunitySidebar communities={allCommunities ?? []} user={user} activeCommunity={community} />
    </div>
    </>
  )
}
