import { createClient } from '@/lib/supabase/server'
import PostCard from '@/components/community/PostCard'
import CommunitySidebar from '@/components/community/CommunitySidebar'
import Link from 'next/link'
import type { Post } from '@/types/community'
import type { Metadata } from 'next'

const SITE_URL = 'https://diamondcritics.com'

export const metadata: Metadata = {
  title: 'Diamond Community — Ask Diamond Questions & Get Expert Answers',
  description: 'Join the #1 diamond community. Ask questions about cut, clarity, color, carat and GIA reports. Get real answers from diamond experts, GIA graduates and experienced buyers before you spend thousands.',
  alternates: { canonical: `${SITE_URL}/community` },
  openGraph: {
    title: 'Diamond Community — Ask Questions, Get Expert Diamond Advice',
    description: 'The most trusted diamond community. Real answers from GIA-certified experts, jewelers and buyers on engagement rings, diamond prices and everything diamonds.',
    url: `${SITE_URL}/community`,
    type: 'website',
    images: [{ url: '/images/diamondcritics-og.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
}

const forumSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebForum',
  name: 'Diamond Community',
  alternateName: 'DiamondCritics Diamond Forum',
  description: 'The premier online diamond community where buyers, GIA-certified experts and professional jewelers discuss diamonds, engagement rings, and diamond prices. Get honest, expert advice before you buy.',
  url: `${SITE_URL}/community`,
  inLanguage: 'en-US',
  about: {
    '@type': 'Thing',
    name: 'Diamonds',
    sameAs: 'https://en.wikipedia.org/wiki/Diamond',
  },
  publisher: {
    '@type': 'Organization',
    name: 'DiamondCritics',
    url: SITE_URL,
  },
  keywords: 'diamond community, diamond forum, diamond advice, GIA diamond, engagement ring help, diamond price, buy diamond',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the best diamond cut to buy?',
      acceptedAnswer: { '@type': 'Answer', text: 'The round brilliant cut maximises light return and is the most popular choice. For the best value, look for GIA Excellent cut with a table between 54–58% and depth between 59–62.5%. Hearts and Arrows round diamonds represent the top tier.' },
    },
    {
      '@type': 'Question',
      name: 'How much does a 1 carat diamond cost?',
      acceptedAnswer: { '@type': 'Answer', text: 'A 1 carat round diamond costs between $3,200 and $12,000 depending on cut, color and clarity. A GIA Excellent G-VS2 round diamond typically costs around $5,500–$6,500 on Blue Nile. Lab-grown 1ct diamonds start around $1,500.' },
    },
    {
      '@type': 'Question',
      name: 'Is GIA better than IGI for diamond certification?',
      acceptedAnswer: { '@type': 'Answer', text: 'GIA (Gemological Institute of America) is the gold standard for natural diamonds — grading is stricter and more consistent. IGI is widely accepted for lab-grown diamonds where the price premium for GIA certification is less justified. For natural diamonds, always prefer GIA.' },
    },
    {
      '@type': 'Question',
      name: 'What diamond color grade should I buy?',
      acceptedAnswer: { '@type': 'Answer', text: 'G or H color is the sweet spot for round diamonds — they appear colorless to the naked eye but cost 20–30% less than D–F stones. In yellow or rose gold settings, you can go as low as J color since the metal masks any warmth.' },
    },
    {
      '@type': 'Question',
      name: 'Should I buy a natural or lab-grown diamond?',
      acceptedAnswer: { '@type': 'Answer', text: 'Lab-grown diamonds are chemically identical to natural diamonds and cost 60–80% less. A lab-grown 2ct D-VVS1 costs around $2,800 vs $25,000+ natural. The tradeoff is resale value — natural diamonds hold value better long-term. For pure sparkle per dollar, lab-grown wins.' },
    },
    {
      '@type': 'Question',
      name: 'What is the best place to buy diamonds online?',
      acceptedAnswer: { '@type': 'Answer', text: 'Blue Nile and James Allen are the two largest online diamond retailers with the best selection and competitive prices. Blue Nile offers the widest inventory; James Allen has 360° video on every stone. Both offer GIA-certified diamonds and free returns.' },
    },
  ],
}

type SortMode = 'hot' | 'new' | 'top' | 'feed'

function hotScore(score: number, createdAt: string) {
  const ageHours = (Date.now() - new Date(createdAt).getTime()) / 3600000
  return Math.log(Math.max(score, 1)) - ageHours / 45
}

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; registered?: string }>
}) {
  const { sort, registered } = await searchParams
  const sortMode: SortMode = sort === 'new' ? 'new' : sort === 'top' ? 'top' : sort === 'feed' ? 'feed' : 'hot'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch joined community IDs for "My Feed"
  let joinedCommunityIds: string[] = []
  if (user && sortMode === 'feed') {
    const { data: memberships } = await supabase
      .from('community_members')
      .select('community_id')
      .eq('user_id', user.id)
    joinedCommunityIds = (memberships ?? []).map(m => m.community_id)
  }

  // ─── Standard fetch (hot / new / top) ───────────────────────────────────────
  let rawPostsData: Omit<Post, 'author' | 'community' | 'user_vote'>[] = []
  let feedPrecomputedVotes: Record<string, number> = {}

  if (sortMode !== 'feed') {
    let query = supabase.from('posts').select('*').eq('is_deleted', false).eq('is_draft', false)
    if (sortMode === 'new') query = query.order('created_at', { ascending: false })
    else if (sortMode === 'top') query = query.order('score', { ascending: false })
    else query = query.order('created_at', { ascending: false })
    const { data } = await query.limit(50)
    rawPostsData = data ?? []
  }

  // ─── Feed algorithm ──────────────────────────────────────────────────────────
  // Signals: hot score × community affinity × freshness boost × seen penalty
  // Diversity cap: max 4 posts per community so the feed feels varied
  if (sortMode === 'feed' && user && joinedCommunityIds.length > 0) {
    const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 3600000).toISOString()

    // Pull a wide candidate set — 200 posts from the last 14 days
    const { data: candidates } = await supabase
      .from('posts').select('*')
      .in('community_id', joinedCommunityIds)
      .eq('is_deleted', false)
      .eq('is_draft', false)
      .gte('created_at', fourteenDaysAgo)
      .order('created_at', { ascending: false })
      .limit(200)

    if (candidates?.length) {
      // Fetch user votes on the entire candidate set
      const { data: voteRows } = await supabase
        .from('post_votes').select('post_id, vote')
        .eq('user_id', user.id)
        .in('post_id', candidates.map(p => p.id))

      feedPrecomputedVotes = Object.fromEntries((voteRows ?? []).map(v => [v.post_id, v.vote]))

      // Community affinity: count upvotes per community within the candidate set
      // (communities the user engages with most get boosted)
      const rawAffinity: Record<string, number> = {}
      for (const post of candidates) {
        if (feedPrecomputedVotes[post.id] === 1) {
          rawAffinity[post.community_id] = (rawAffinity[post.community_id] ?? 0) + 1
        }
      }
      const maxAff = Math.max(...Object.values(rawAffinity), 1)
      const communityAffinity: Record<string, number> = {}
      for (const id in rawAffinity) communityAffinity[id] = rawAffinity[id] / maxAff

      // Multi-signal score for each candidate post
      const computeScore = (post: (typeof candidates)[0]): number => {
        const ageHours = (Date.now() - new Date(post.created_at).getTime()) / 3600000

        // Quality × time decay (log base-2 so score differences feel proportional)
        const hot = Math.log2(Math.max(post.score, 1)) - ageHours / 36

        // How much does the user engage with this community? (0 → 1.5 bonus)
        const affinity = (communityAffinity[post.community_id] ?? 0) * 1.5

        // Already voted = de-prioritise (user already saw it)
        const seen = feedPrecomputedVotes[post.id] !== undefined ? -1.5 : 0

        // Brand-new posts get a small boost so they surface before getting votes
        const freshBoost = ageHours < 3 ? 0.8 : ageHours < 12 ? 0.3 : 0

        return hot + affinity + seen + freshBoost
      }

      const scored = candidates
        .map(p => ({ post: p, score: computeScore(p) }))
        .sort((a, b) => b.score - a.score)

      // Diversity pass: cap at 4 posts per community so one community can't dominate
      const commCounts: Record<string, number> = {}
      for (const { post } of scored) {
        const n = commCounts[post.community_id] ?? 0
        if (n < 4) {
          rawPostsData.push(post)
          commCounts[post.community_id] = n + 1
        }
        if (rawPostsData.length >= 50) break
      }
    }
  }

  // Fetch authors and communities separately (avoids FK constraint dependency)
  const authorIds = [...new Set((rawPostsData ?? []).map(p => p.author_id).filter(Boolean))]
  const communityIds = [...new Set((rawPostsData ?? []).map(p => p.community_id).filter(Boolean))]

  type AuthorRow = { id: string; username: string; avatar_url: string | null }
  type CommunityRow = { id: string; slug: string; name: string }
  let authorsMap: Record<string, AuthorRow> = {}
  if (authorIds.length) {
    const { data: authors } = await supabase.from('profiles').select('id,username,avatar_url').in('id', authorIds)
    if (authors) authorsMap = Object.fromEntries(authors.map(a => [a.id, a]))
  }

  let communitiesMap: Record<string, CommunityRow> = {}
  if (communityIds.length) {
    const { data: comms } = await supabase.from('communities').select('id,slug,name').in('id', communityIds)
    if (comms) communitiesMap = Object.fromEntries(comms.map(c => [c.id, c]))
  }

  let userVotes: Record<string, -1 | 1> = {}
  if (sortMode === 'feed') {
    // Algorithm already fetched votes for the full candidate set — reuse them
    userVotes = feedPrecomputedVotes as Record<string, -1 | 1>
  } else if (user && rawPostsData.length) {
    const { data: votes } = await supabase
      .from('post_votes').select('post_id, vote')
      .eq('user_id', user.id)
      .in('post_id', rawPostsData.map(p => p.id))
    if (votes) userVotes = Object.fromEntries(votes.map(v => [v.post_id, v.vote]))
  }

  const rawPosts = (rawPostsData ?? []).map(p => ({
    ...p,
    author: authorsMap[p.author_id] ?? null,
    community: communitiesMap[p.community_id] ?? null,
  }))

  let posts: Post[] = rawPosts.map(p => ({ ...p, user_vote: userVotes[p.id] ?? 0 }))
  if (sortMode === 'hot') {
    posts = posts.sort((a, b) => hotScore(b.score, b.created_at) - hotScore(a.score, a.created_at))
  }
  // 'feed' order preserved from algorithm (diversity-sorted scored list)
  // 'new' and 'top' order preserved from DB query

  const { data: communities } = await supabase
    .from('communities').select('*').order('member_count', { ascending: false })

  const sortTabs: { key: SortMode; label: string; emoji: string; authRequired?: boolean }[] = [
    { key: 'hot', label: 'Hot', emoji: '🔥' },
    { key: 'new', label: 'New', emoji: '✨' },
    { key: 'top', label: 'Top', emoji: '📈' },
    { key: 'feed', label: 'My Feed', emoji: '🏠', authRequired: true },
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(forumSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    <div className="c-layout">

      {/* ── Main column ── */}
      <div>

        {/* SEO hero — visible H1 for "diamond community" keyword */}
        <div style={{
          background: 'linear-gradient(135deg, #1C1209 0%, #3A2208 100%)',
          borderRadius: '14px',
          padding: '24px 28px',
          marginBottom: '14px',
          boxShadow: '0 2px 12px rgba(28,18,9,0.18)',
        }}>
          <h1 style={{ fontFamily: 'var(--font-ivy, Georgia, serif)', fontSize: '22px', fontWeight: 700, color: '#F0D88A', marginBottom: '8px', lineHeight: 1.3 }}>
            Diamond Community
          </h1>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, maxWidth: '520px' }}>
            The trusted place to ask diamond questions and get real answers. Cut grades, GIA vs IGI, price checks, engagement ring advice — from experts who know diamonds.
          </p>
          {!user && (
            <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
              <a href="/community/register" style={{
                fontSize: '13px', fontWeight: 600, padding: '8px 18px', borderRadius: '8px', textDecoration: 'none',
                background: 'linear-gradient(145deg, #D4A843, #B8881E)', color: '#fff',
              }}>Join Free</a>
              <a href="/community/login" style={{
                fontSize: '13px', fontWeight: 500, padding: '8px 18px', borderRadius: '8px', textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)',
              }}>Log In</a>
            </div>
          )}
        </div>

        {/* Email confirmation banner */}
        {registered === '1' && (
          <div style={{
            background: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: '10px',
            padding: '12px 16px', marginBottom: '16px',
            display: 'flex', alignItems: 'flex-start', gap: '10px',
            fontSize: '13px', color: '#92400E',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: '1px' }}>
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,12 2,6"/>
            </svg>
            <span><strong>Check your email.</strong> We sent you a confirmation link. Click it to activate your account, then log in.</span>
          </div>
        )}

        {/* Sort bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 1px 4px rgba(28,18,9,0.07), 0 4px 16px rgba(28,18,9,0.05)',
          padding: '8px 12px',
          marginBottom: '12px',
        }}>
          <div className="c-sort-bar" style={{ flex: 1, minWidth: 0 }}>
            {sortTabs.filter(tab => !tab.authRequired || user).map(tab => (
              <Link key={tab.key} href={`/community?sort=${tab.key}`} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '7px 14px', borderRadius: '8px',
                fontSize: '13px', textDecoration: 'none',
                whiteSpace: 'nowrap', flexShrink: 0,
                background: sortMode === tab.key ? '#F0E8D8' : 'transparent',
                color: sortMode === tab.key ? '#1C1209' : '#9A8F87',
                fontWeight: sortMode === tab.key ? 600 : 500,
              }}>
                <span>{tab.emoji}</span>
                {tab.label}
              </Link>
            ))}
          </div>

          {user && communities?.[0] && (
            <Link href={`/community/r/${communities[0].slug}/submit`} style={{
              flexShrink: 0,
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'linear-gradient(145deg, #D4A843, #B8881E)',
              color: '#fff', fontWeight: 600, fontSize: '13px',
              padding: '7px 14px', borderRadius: '8px', textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Create Post
            </Link>
          )}
        </div>

        {/* Posts */}
        {posts.length === 0 ? (
          <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 1px 4px rgba(28,18,9,0.07), 0 4px 16px rgba(28,18,9,0.05)',
            padding: '64px 32px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            textAlign: 'center',
          }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '16px', marginBottom: '20px',
              background: 'linear-gradient(145deg, #F5EDD8, #EDD8AA)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {sortMode === 'feed' ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B8881E" strokeWidth="1.5">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
                  <path d="M5 2.5L2 7.5l8 10 8-10-3-5H5z" stroke="#B8881E" strokeWidth="1.4" strokeLinejoin="round"/>
                  <path d="M2 7.5h16M5 2.5l2.5 5m5-5L10 7.5" stroke="#B8881E" strokeWidth="1.4" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <p style={{ fontFamily: 'var(--font-ivy, Georgia, serif)', fontSize: '18px', color: '#1C1209', marginBottom: '8px' }}>
              {sortMode === 'feed' ? 'Your feed is empty' : 'No posts yet'}
            </p>
            <p style={{ fontSize: '13px', color: '#9A8F87', marginBottom: '24px' }}>
              {sortMode === 'feed'
                ? 'Join some communities and their posts will appear here'
                : 'Be the first to share something in this community'}
            </p>
            <Link
              href={sortMode === 'feed' ? '/community?sort=hot' : (user && communities?.[0] ? `/community/r/${communities[0].slug}/submit` : '/community/register')}
              style={{
                display: 'inline-block',
                background: 'linear-gradient(145deg, #D4A843, #B8881E)',
                color: '#fff', fontWeight: 600, fontSize: '13px',
                padding: '10px 24px', borderRadius: '8px', textDecoration: 'none',
              }}>
              {sortMode === 'feed' ? 'Browse Communities' : (user ? 'Create First Post' : 'Join & Post')}
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {posts.map(post => <PostCard key={post.id} post={post} userId={user?.id} />)}
          </div>
        )}
      </div>

      {/* ── Sidebar ── */}
      <CommunitySidebar communities={communities ?? []} user={user} />
    </div>
    </>
  )
}
