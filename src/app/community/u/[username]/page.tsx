import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import PostCard from '@/components/community/PostCard'
import type { Post } from '@/types/community'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params
  return { title: `u/${username} — Diamond Community` }
}

export default async function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()

  if (!profile) notFound()

  // Fetch user badges
  const { data: userBadges } = await supabase
    .from('user_badges')
    .select('*, badge:badges(*)')
    .eq('user_id', profile.id)

  // Fetch user's recent posts
  const { data: rawPosts } = await supabase
    .from('posts')
    .select('*, author:profiles(id,username,avatar_url), community:communities(id,slug,name)')
    .eq('author_id', profile.id)
    .eq('is_deleted', false)
    .order('created_at', { ascending: false })
    .limit(20)

  // User votes if viewing own profile
  let userVotes: Record<string, -1 | 1> = {}
  if (user && rawPosts?.length) {
    const { data: votes } = await supabase
      .from('post_votes')
      .select('post_id, vote')
      .eq('user_id', user.id)
      .in('post_id', rawPosts.map(p => p.id))
    if (votes) userVotes = Object.fromEntries(votes.map(v => [v.post_id, v.vote]))
  }

  const posts: Post[] = (rawPosts ?? []).map(p => ({ ...p, user_vote: userVotes[p.id] ?? 0 }))
  const totalKarma = profile.post_karma + profile.comment_karma
  const isOwnProfile = user?.id === profile.id

  const joinDate = new Date(profile.created_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
      {/* Posts */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Posts by u/{username}
        </h2>
        <div className="space-y-2">
          {posts.length === 0 ? (
            <div className="bg-white border border-[#EDEFF1] rounded p-8 text-center text-gray-400">
              No posts yet.
            </div>
          ) : (
            posts.map(post => <PostCard key={post.id} post={post} userId={user?.id} />)
          )}
        </div>
      </div>

      {/* Profile sidebar */}
      <aside className="space-y-4">
        {/* Profile card */}
        <div className="bg-white border border-[#EDEFF1] rounded overflow-hidden">
          <div className="h-16 bg-gradient-to-r from-[#C6973E] to-[#8B6914]" />
          <div className="px-4 pb-4">
            {/* Avatar */}
            <div className="-mt-8 mb-3">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={username}
                  className="w-16 h-16 rounded-full border-4 border-white object-cover shadow"
                />
              ) : (
                <div className="w-16 h-16 rounded-full border-4 border-white bg-[#C6973E] flex items-center justify-center text-white text-2xl font-bold shadow">
                  {username[0].toUpperCase()}
                </div>
              )}
            </div>

            <h1 className="font-bold text-lg text-gray-900">u/{username}</h1>
            {profile.display_name && (
              <p className="text-sm text-gray-500">{profile.display_name}</p>
            )}

            {/* Badges */}
            {userBadges && userBadges.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {userBadges.map((ub: { badge: { id: string; icon: string; name: string; color: string }; badge_id: string }) => (
                  <span
                    key={ub.badge_id}
                    title={ub.badge.name}
                    className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium text-white"
                    style={{ backgroundColor: ub.badge.color }}
                  >
                    {ub.badge.icon} {ub.badge.name}
                  </span>
                ))}
              </div>
            )}

            {profile.bio && (
              <p className="text-sm text-gray-600 mt-3">{profile.bio}</p>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-[#EDEFF1]">
              <div className="text-center">
                <div className="font-bold text-gray-900 text-xl">{totalKarma.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Karma</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-900 text-xl">{posts.length}</div>
                <div className="text-xs text-gray-500">Posts</div>
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-3">🎂 Joined {joinDate}</p>

            {profile.is_banned && (
              <div className="mt-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1">
                ⚠️ This account has been suspended
              </div>
            )}

            {isOwnProfile && (
              <Link
                href={`/community/u/${username}/edit`}
                className="block w-full text-center mt-3 text-sm py-1.5 border border-[#C6973E] text-[#C6973E] rounded font-semibold hover:bg-amber-50"
              >
                Edit Profile
              </Link>
            )}
          </div>
        </div>

        <div className="bg-white border border-[#EDEFF1] rounded p-3">
          <p className="text-xs text-gray-500">
            🔒 <strong>Privacy:</strong> Only your username is public. Your email is never visible to anyone.
          </p>
        </div>
      </aside>
    </div>
  )
}
