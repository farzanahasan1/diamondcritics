import { createClient } from '@/lib/supabase/server'
import PostCard from '@/components/community/PostCard'
import CommunitySidebar from '@/components/community/CommunitySidebar'
import Link from 'next/link'
import type { Post } from '@/types/community'

type SortMode = 'hot' | 'new' | 'top'

function hotScore(score: number, createdAt: string) {
  const ageHours = (Date.now() - new Date(createdAt).getTime()) / 3600000
  return Math.log(Math.max(score, 1)) - ageHours / 45
}

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>
}) {
  const { sort } = await searchParams
  const sortMode: SortMode = sort === 'new' ? 'new' : sort === 'top' ? 'top' : 'hot'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch posts with author + community
  let query = supabase
    .from('posts')
    .select('*, author:profiles(id,username,avatar_url), community:communities(id,slug,name)')
    .eq('is_deleted', false)

  if (sortMode === 'new') query = query.order('created_at', { ascending: false })
  else if (sortMode === 'top') query = query.order('score', { ascending: false })
  else query = query.order('created_at', { ascending: false })

  const { data: rawPosts } = await query.limit(50)

  // Fetch user votes
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

  // Fetch communities for sidebar
  const { data: communities } = await supabase
    .from('communities')
    .select('*')
    .order('member_count', { ascending: false })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_316px] gap-6">
      {/* Main column */}
      <div>
        {/* Sort bar */}
        <div className="flex items-center gap-1 mb-3 bg-white border border-[#EDEFF1] rounded p-2">
          {(['hot', 'new', 'top'] as const).map(s => (
            <Link
              key={s}
              href={`/community?sort=${s}`}
              className={`px-3 py-1.5 rounded text-sm font-medium capitalize transition-colors ${
                sortMode === s ? 'bg-[#E8E8E8] text-gray-900' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
              }`}
            >
              {s === 'hot' ? '🔥 Hot' : s === 'new' ? '✨ New' : '📈 Top'}
            </Link>
          ))}
          {user && communities?.[0] && (
            <Link
              href={`/community/r/${communities[0].slug}/submit`}
              className="ml-auto text-sm px-3 py-1.5 bg-[#C6973E] text-white rounded font-semibold hover:bg-[#b08535] transition-colors"
            >
              + Create Post
            </Link>
          )}
        </div>

        {/* Posts */}
        <div className="space-y-2">
          {posts.length === 0 ? (
            <div className="bg-white border border-[#EDEFF1] rounded p-10 text-center">
              <p className="text-3xl mb-2">💎</p>
              <p className="font-semibold text-gray-700 mb-1">No posts yet</p>
              <p className="text-sm text-gray-500 mb-4">Be the first to share something in this community!</p>
              {user && communities?.[0] ? (
                <Link href={`/community/r/${communities[0].slug}/submit`} className="inline-block px-5 py-2 bg-[#C6973E] text-white rounded font-semibold hover:bg-[#b08535]">
                  Create First Post
                </Link>
              ) : (
                <Link href="/community/register" className="inline-block px-5 py-2 bg-[#C6973E] text-white rounded font-semibold hover:bg-[#b08535]">
                  Join & Post
                </Link>
              )}
            </div>
          ) : (
            posts.map(post => <PostCard key={post.id} post={post} userId={user?.id} />)
          )}
        </div>
      </div>

      {/* Sidebar */}
      <CommunitySidebar communities={communities ?? []} user={user} />
    </div>
  )
}
