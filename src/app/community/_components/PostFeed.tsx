import { createClient } from '@/lib/supabase/server'
import PostCard from '@/components/community/PostCard'
import Link from 'next/link'
import type { Post } from '@/types/community'
import { hotScore } from '@/lib/community/hotScore'

type SortMode = 'hot' | 'new' | 'top' | 'feed'
type AuthorRow = { id: string; username: string; avatar_url: string | null }
type CommunityRow = { id: string; slug: string; name: string }

export default async function PostFeed({
  sortMode,
  userId,
}: {
  sortMode: SortMode
  userId?: string
}) {
  const supabase = await createClient()

  // ── Feed algorithm ─────────────────────────────────────────────────────────
  let rawPostsData: Omit<Post, 'author' | 'community' | 'user_vote'>[] = []
  let feedPrecomputedVotes: Record<string, number> = {}

  if (sortMode === 'feed' && userId) {
    const { data: memberships } = await supabase
      .from('community_members').select('community_id').eq('user_id', userId)
    const joinedIds = (memberships ?? []).map(m => m.community_id)

    if (joinedIds.length > 0) {
      const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 3_600_000).toISOString()
      const { data: candidates } = await supabase
        .from('posts')
        .select('id,community_id,author_id,title,body,url,image_url,link_preview_image,flair,type,score,comment_count,is_deleted,is_draft,is_pinned,created_at,updated_at')
        .in('community_id', joinedIds)
        .eq('is_deleted', false).eq('is_draft', false)
        .gte('created_at', fourteenDaysAgo)
        .order('created_at', { ascending: false })
        .limit(200)

      if (candidates?.length) {
        const { data: voteRows } = await supabase
          .from('post_votes').select('post_id, vote')
          .eq('user_id', userId)
          .in('post_id', candidates.map(p => p.id))
        feedPrecomputedVotes = Object.fromEntries((voteRows ?? []).map(v => [v.post_id, v.vote]))

        const rawAffinity: Record<string, number> = {}
        for (const post of candidates) {
          if (feedPrecomputedVotes[post.id] === 1)
            rawAffinity[post.community_id] = (rawAffinity[post.community_id] ?? 0) + 1
        }
        const maxAff = Math.max(...Object.values(rawAffinity), 1)
        const communityAffinity: Record<string, number> = {}
        for (const id in rawAffinity) communityAffinity[id] = rawAffinity[id] / maxAff

        const computeScore = (p: (typeof candidates)[0]): number => {
          const ageHours = (Date.now() - new Date(p.created_at).getTime()) / 3_600_000
          const hot = Math.log2(Math.max(p.score, 1)) - ageHours / 36
          const affinity = (communityAffinity[p.community_id] ?? 0) * 1.5
          const seen = feedPrecomputedVotes[p.id] !== undefined ? -1.5 : 0
          const freshBoost = ageHours < 3 ? 0.8 : ageHours < 12 ? 0.3 : 0
          return hot + affinity + seen + freshBoost
        }

        const scored = candidates.map(p => ({ post: p, score: computeScore(p) })).sort((a, b) => b.score - a.score)
        const commCounts: Record<string, number> = {}
        for (const { post } of scored) {
          const n = commCounts[post.community_id] ?? 0
          if (n < 4) { rawPostsData.push(post); commCounts[post.community_id] = n + 1 }
          if (rawPostsData.length >= 50) break
        }
      }
    }
  } else {
    let query = supabase
      .from('posts')
      .select('id,community_id,author_id,title,body,url,image_url,link_preview_image,flair,type,score,comment_count,is_deleted,is_draft,is_pinned,created_at,updated_at')
      .eq('is_deleted', false).eq('is_draft', false)
    if (sortMode === 'new') query = query.order('created_at', { ascending: false })
    else if (sortMode === 'top') query = query.order('score', { ascending: false })
    else query = query.order('created_at', { ascending: false })
    const { data } = await query.limit(50)
    rawPostsData = data ?? []
  }

  // ── Secondary fetches — all in parallel ────────────────────────────────────
  const authorIds     = [...new Set(rawPostsData.map(p => p.author_id).filter(Boolean))]
  const communityIds  = [...new Set(rawPostsData.map(p => p.community_id).filter(Boolean))]
  const needVotes     = sortMode !== 'feed' && !!userId && rawPostsData.length > 0

  const [authorsResult, commsResult, votesResult] = await Promise.all([
    authorIds.length
      ? supabase.from('profiles').select('id,username,avatar_url').in('id', authorIds)
      : Promise.resolve({ data: null }),
    communityIds.length
      ? supabase.from('communities').select('id,slug,name').in('id', communityIds)
      : Promise.resolve({ data: null }),
    needVotes
      ? supabase.from('post_votes').select('post_id,vote').eq('user_id', userId!).in('post_id', rawPostsData.map(p => p.id))
      : Promise.resolve({ data: null }),
  ])

  const authorsMap: Record<string, AuthorRow> = authorsResult.data
    ? Object.fromEntries(authorsResult.data.map((a: AuthorRow) => [a.id, a]))
    : {}
  const communitiesMap: Record<string, CommunityRow> = commsResult.data
    ? Object.fromEntries(commsResult.data.map((c: CommunityRow) => [c.id, c]))
    : {}

  let userVotes: Record<string, -1 | 1> = {}
  if (sortMode === 'feed') {
    userVotes = feedPrecomputedVotes as Record<string, -1 | 1>
  } else if (votesResult.data) {
    userVotes = Object.fromEntries(votesResult.data.map((v: { post_id: string; vote: -1 | 1 }) => [v.post_id, v.vote]))
  }

  let posts: Post[] = rawPostsData.map(p => ({
    ...p,
    author: authorsMap[p.author_id] ?? null,
    community: communitiesMap[p.community_id] ?? null,
    user_vote: userVotes[p.id] ?? 0,
  }))
  if (sortMode === 'hot') {
    posts = posts.sort((a, b) => hotScore(b.score, b.created_at) - hotScore(a.score, a.created_at))
  }

  // ── Render ────────────────────────────────────────────────────────────────
  if (posts.length === 0) {
    return (
      <div className="c-empty-state">
        <div className="c-empty-state__icon">
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
        <p className="c-empty-state__title">
          {sortMode === 'feed' ? 'Your feed is empty' : 'No posts yet'}
        </p>
        <p className="c-empty-state__desc">
          {sortMode === 'feed'
            ? 'Join some communities and their posts will appear here'
            : 'Be the first to share something in this community'}
        </p>
        <Link
          href={sortMode === 'feed' ? '/community?sort=hot' : (userId ? '/community/r/diamonds/submit' : '/community/register')}
          className="c-btn c-btn-primary"
        >
          {sortMode === 'feed' ? 'Browse Communities' : (userId ? 'Create First Post' : 'Join & Post')}
        </Link>
      </div>
    )
  }

  return (
    <div className="c-post-list">
      {posts.map(post => <PostCard key={post.id} post={post} userId={userId} />)}
    </div>
  )
}
