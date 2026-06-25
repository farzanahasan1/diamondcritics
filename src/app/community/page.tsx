import { createClient } from '@/lib/supabase/server'
import PostCard from '@/components/community/PostCard'
import CommunitySidebar from '@/components/community/CommunitySidebar'
import Link from 'next/link'
import type { Post } from '@/types/community'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Diamond Community — Ask, Share & Discover | DiamondCritics',
  description: 'Join the Diamond Community at DiamondCritics. Ask diamond questions, share engagement ring photos, get GIA-backed advice, and connect with diamond enthusiasts worldwide.',
  openGraph: {
    title: 'Diamond Community — DiamondCritics',
    description: 'The trusted community for diamond lovers. Ask questions, share finds, and get expert opinions.',
  },
}

type SortMode = 'hot' | 'new' | 'top'

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
  const sortMode: SortMode = sort === 'new' ? 'new' : sort === 'top' ? 'top' : 'hot'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let query = supabase
    .from('posts')
    .select('*, author:profiles(id,username,avatar_url), community:communities(id,slug,name)')
    .eq('is_deleted', false)

  if (sortMode === 'new') query = query.order('created_at', { ascending: false })
  else if (sortMode === 'top') query = query.order('score', { ascending: false })
  else query = query.order('created_at', { ascending: false })

  const { data: rawPosts } = await query.limit(50)

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

  const { data: communities } = await supabase
    .from('communities')
    .select('*')
    .order('member_count', { ascending: false })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
      <div>
        {/* Email confirmation banner */}
        {registered === '1' && (
          <div className="mb-4 px-4 py-3 rounded-lg text-sm flex items-start gap-3" style={{ background: '#fffbeb', border: '1px solid #fcd34d', color: '#92400e' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 mt-0.5">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,12 2,6"/>
            </svg>
            <div>
              <strong>Check your email.</strong> We sent you a confirmation link. Click it to activate your account, then log in.
            </div>
          </div>
        )}

        {/* Sort bar */}
        <div className="flex items-center gap-1 mb-3 rounded-lg px-3 py-2" style={{ background: '#fff', border: '1px solid #E2DDD7' }}>
          {(['hot', 'new', 'top'] as const).map(s => (
            <Link
              key={s}
              href={`/community?sort=${s}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
              style={sortMode === s
                ? { background: '#F0EDE8', color: '#18110A' }
                : { color: '#7a6f66' }
              }
            >
              {s === 'hot' && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2c0 6-6 8-6 14a6 6 0 0012 0c0-6-6-8-6-14z"/></svg>
              )}
              {s === 'new' && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              )}
              {s === 'top' && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
              )}
              <span className="capitalize">{s}</span>
            </Link>
          ))}
          {user && communities?.[0] && (
            <Link
              href={`/community/r/${communities[0].slug}/submit`}
              className="ml-auto flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-md font-semibold transition-colors"
              style={{ background: '#C6973E', color: '#fff' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Post
            </Link>
          )}
        </div>

        {/* Posts */}
        <div className="space-y-2">
          {posts.length === 0 ? (
            <div className="rounded-lg p-10 text-center" style={{ background: '#fff', border: '1px solid #E2DDD7' }}>
              <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #C6973E22, #C6973E44)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C6973E" strokeWidth="1.5">
                  <path d="M6 3L2 9l10 12L22 9l-4-6H6z"/><path d="M2 9h20M6 3l3 6m6-6l-3 6"/>
                </svg>
              </div>
              <p className="font-semibold mb-1" style={{ color: '#18110A', fontFamily: 'var(--font-ivy), Georgia, serif', fontSize: '1.1rem' }}>No posts yet</p>
              <p className="text-sm mb-5" style={{ color: '#9a8f87' }}>Be the first to share something in this community</p>
              {user && communities?.[0] ? (
                <Link href={`/community/r/${communities[0].slug}/submit`}
                  className="inline-block px-5 py-2 rounded-md text-sm font-semibold"
                  style={{ background: '#C6973E', color: '#fff' }}>
                  Create First Post
                </Link>
              ) : (
                <Link href="/community/register"
                  className="inline-block px-5 py-2 rounded-md text-sm font-semibold"
                  style={{ background: '#C6973E', color: '#fff' }}>
                  Join &amp; Post
                </Link>
              )}
            </div>
          ) : (
            posts.map(post => <PostCard key={post.id} post={post} userId={user?.id} />)
          )}
        </div>
      </div>

      <CommunitySidebar communities={communities ?? []} user={user} />
    </div>
  )
}
