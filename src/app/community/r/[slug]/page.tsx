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
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_316px] gap-6">
      <div>
        {/* Community header */}
        <div className="bg-white border border-[#EDEFF1] rounded overflow-hidden mb-3">
          <div className="h-16 bg-gradient-to-r from-[#C6973E] to-[#8B6914]" />
          <div className="px-4 pb-3 flex items-center gap-3">
            <div className="-mt-5 w-14 h-14 rounded-full bg-white border-4 border-white flex items-center justify-center text-3xl shadow">
              💎
            </div>
            <div className="pt-2">
              <h1 className="font-bold text-xl text-gray-900">r/{slug}</h1>
              <p className="text-sm text-gray-500">{community.description}</p>
            </div>
            {user && (
              <Link
                href={`/community/r/${slug}/submit`}
                className="ml-auto text-sm px-4 py-2 bg-[#C6973E] text-white rounded-full font-semibold hover:bg-[#b08535] transition-colors"
              >
                + Create Post
              </Link>
            )}
          </div>
        </div>

        {/* Sort tabs */}
        <div className="flex items-center gap-1 mb-3 bg-white border border-[#EDEFF1] rounded p-2">
          {(['hot', 'new', 'top'] as const).map(s => (
            <Link
              key={s}
              href={`/community/r/${slug}?sort=${s}`}
              className={`px-3 py-1.5 rounded text-sm font-medium capitalize transition-colors ${
                sortMode === s ? 'bg-[#E8E8E8] text-gray-900' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {s === 'hot' ? '🔥 Hot' : s === 'new' ? '✨ New' : '📈 Top'}
            </Link>
          ))}
        </div>

        {/* Posts */}
        <div className="space-y-2">
          {posts.length === 0 ? (
            <div className="bg-white border border-[#EDEFF1] rounded p-10 text-center">
              <p className="text-3xl mb-2">💎</p>
              <p className="font-semibold text-gray-700 mb-2">No posts in r/{slug} yet</p>
              {user ? (
                <Link href={`/community/r/${slug}/submit`} className="inline-block px-5 py-2 bg-[#C6973E] text-white rounded font-semibold hover:bg-[#b08535]">
                  Create First Post
                </Link>
              ) : (
                <Link href="/community/register" className="inline-block px-5 py-2 bg-[#C6973E] text-white rounded font-semibold">
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
