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
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
      <div>
        {/* Community header */}
        <div className="rounded-xl overflow-hidden mb-3" style={{ background: '#fff', border: '1px solid #E2DDD7' }}>
          <div className="h-16 relative" style={{ background: 'linear-gradient(135deg, #18110A 0%, #3d2a0e 55%, #18110A 100%)' }}>
            <div className="absolute inset-0 flex items-end px-4 pb-0">
              <div className="-mb-5 w-14 h-14 rounded-full flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #C6973E, #e8bf6a)', outline: '3px solid #fff' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinejoin="round">
                  <path d="M6 3L2 9l10 12L22 9l-4-6H6z"/><path d="M2 9h20M6 3l3 6m6-6l-3 6"/>
                </svg>
              </div>
            </div>
          </div>
          <div className="px-4 pt-7 pb-4 flex items-end gap-3">
            <div className="flex-1">
              <h1 className="font-bold text-lg" style={{ color: '#18110A', fontFamily: 'var(--font-ivy), Georgia, serif' }}>r/{slug}</h1>
              <p className="text-sm" style={{ color: '#7a6f66' }}>{community.description}</p>
            </div>
            {user && (
              <Link
                href={`/community/r/${slug}/submit`}
                className="flex items-center gap-1.5 shrink-0 text-sm px-4 py-2 rounded-lg font-semibold"
                style={{ background: '#C6973E', color: '#fff' }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Post
              </Link>
            )}
          </div>
        </div>

        {/* Sort tabs */}
        <div className="flex items-center gap-1 mb-3 rounded-lg px-3 py-2" style={{ background: '#fff', border: '1px solid #E2DDD7' }}>
          {(['hot', 'new', 'top'] as const).map(s => (
            <Link
              key={s}
              href={`/community/r/${slug}?sort=${s}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
              style={sortMode === s
                ? { background: '#F0EDE8', color: '#18110A' }
                : { color: '#7a6f66' }
              }
            >
              {s === 'hot' && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2c0 6-6 8-6 14a6 6 0 0012 0c0-6-6-8-6-14z"/></svg>}
              {s === 'new' && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
              {s === 'top' && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>}
              <span className="capitalize">{s}</span>
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
