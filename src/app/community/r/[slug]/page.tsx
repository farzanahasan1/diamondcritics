import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import PostCard from '@/components/community/PostCard'
import CommunitySidebar from '@/components/community/CommunitySidebar'
import Link from 'next/link'
import type { Post } from '@/types/community'
import type { Metadata } from 'next'

type SortMode = 'hot' | 'new' | 'top'

function hotScore(score: number, createdAt: string) {
  const ageHours = (Date.now() - new Date(createdAt).getTime()) / 3600000
  return Math.log(Math.max(score, 1)) - ageHours / 45
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: community } = await supabase.from('communities').select('name, description').eq('slug', slug).single()
  if (!community) return {}
  return {
    title: `r/${slug} — Diamond Community`,
    description: community.description ?? `Diamond community discussion at r/${slug}.`,
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
    .select('*')
    .eq('slug', slug)
    .single()

  if (!community) notFound()

  // Fetch posts
  let query = supabase
    .from('posts')
    .select('*, author:profiles(id,username,avatar_url), community:communities(id,slug,name)')
    .eq('community_id', community.id)
    .eq('is_deleted', false)

  if (sortMode === 'new') query = query.order('created_at', { ascending: false })
  else if (sortMode === 'top') query = query.order('score', { ascending: false })
  else query = query.order('created_at', { ascending: false })

  const { data: rawPosts } = await query.limit(50)

  // User votes
  let userVotes: Record<string, -1 | 1> = {}
  if (user && rawPosts?.length) {
    const { data: votes } = await supabase
      .from('post_votes')
      .select('post_id, vote')
      .eq('user_id', user.id)
      .in('post_id', rawPosts.map(p => p.id))
    if (votes) userVotes = Object.fromEntries(votes.map(v => [v.post_id, v.vote]))
  }

  let posts: Post[] = (rawPosts ?? []).map(p => ({ ...p, user_vote: userVotes[p.id] ?? 0 }))
  if (sortMode === 'hot') {
    posts = posts.sort((a, b) => hotScore(b.score, b.created_at) - hotScore(a.score, a.created_at))
  }

  const { data: allCommunities } = await supabase.from('communities').select('*').order('member_count', { ascending: false })

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px' }}>
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
              <p style={{ fontSize: '13px', color: '#7A6F66' }}>{community.description}</p>
            </div>
            {user && (
              <Link href={`/community/r/${slug}/submit`} style={{
                display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0,
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

        {/* Sort tabs */}
        <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 4px rgba(28,18,9,0.07), 0 4px 16px rgba(28,18,9,0.05)', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
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
        <div className="space-y-2">
          {posts.length === 0 ? (
            <div className="rounded-xl p-10 text-center" style={{ background: '#fff', border: '1px solid #E2DDD7' }}>
              <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #C6973E22, #C6973E44)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C6973E" strokeWidth="1.5" strokeLinejoin="round">
                  <path d="M6 3L2 9l10 12L22 9l-4-6H6z"/><path d="M2 9h20M6 3l3 6m6-6l-3 6"/>
                </svg>
              </div>
              <p className="font-semibold mb-1" style={{ color: '#18110A', fontFamily: 'var(--font-ivy), Georgia, serif', fontSize: '1.05rem' }}>No posts in r/{slug} yet</p>
              <p className="text-sm mb-4" style={{ color: '#9a8f87' }}>Be the first to start the conversation</p>
              {user ? (
                <Link href={`/community/r/${slug}/submit`} className="inline-block px-5 py-2 rounded-lg text-sm font-semibold" style={{ background: '#C6973E', color: '#fff' }}>
                  Create First Post
                </Link>
              ) : (
                <Link href="/community/register" className="inline-block px-5 py-2 rounded-lg text-sm font-semibold" style={{ background: '#C6973E', color: '#fff' }}>
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
  )
}
