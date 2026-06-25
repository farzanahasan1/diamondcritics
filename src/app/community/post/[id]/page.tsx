import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import CommentSection from '@/components/community/CommentSection'
import VoteButtons from '@/components/community/VoteButtons'
import CommunitySidebar from '@/components/community/CommunitySidebar'
import type { Comment, Post } from '@/types/community'
import type { Metadata } from 'next'

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return days < 30 ? `${days}d ago` : new Date(dateStr).toLocaleDateString()
}

function nestComments(flat: Comment[]): Comment[] {
  const map: Record<string, Comment> = {}
  const roots: Comment[] = []
  flat.forEach(c => { map[c.id] = { ...c, replies: [] } })
  flat.forEach(c => {
    if (c.parent_id && map[c.parent_id]) {
      map[c.parent_id].replies!.push(map[c.id])
    } else {
      roots.push(map[c.id])
    }
  })
  return roots
}

const SITE_URL = 'https://diamondcritics.com'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data: post } = await supabase
    .from('posts')
    .select('title, body, url, created_at, author:profiles(username)')
    .eq('id', id)
    .single()
  if (!post) return {}
  const description = post.body
    ? post.body.slice(0, 155).replace(/\s+/g, ' ').trim() + (post.body.length > 155 ? '…' : '')
    : `Diamond community discussion: ${post.title}. Join DiamondCritics to share your knowledge and get expert answers.`
  return {
    title: `${post.title} — Diamond Community`,
    description,
    alternates: { canonical: `${SITE_URL}/community/post/${id}` },
    openGraph: {
      title: post.title,
      description,
      url: `${SITE_URL}/community/post/${id}`,
      type: 'article',
      publishedTime: post.created_at,
    },
  }
}

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch post
  const { data: postRaw } = await supabase
    .from('posts')
    .select('*, author:profiles(id,username,avatar_url,is_admin), community:communities(*)')
    .eq('id', id)
    .single()

  if (!postRaw || postRaw.is_deleted) notFound()

  // User vote on post
  let postUserVote: -1 | 0 | 1 = 0
  if (user) {
    const { data: v } = await supabase
      .from('post_votes')
      .select('vote')
      .eq('post_id', id)
      .eq('user_id', user.id)
      .maybeSingle()
    postUserVote = (v?.vote as -1 | 1) ?? 0
  }

  const post: Post = { ...postRaw, user_vote: postUserVote }

  // Fetch profile for admin check
  let isAdmin = false
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()
    isAdmin = profile?.is_admin ?? false
  }

  // Fetch all comments
  const { data: flatComments } = await supabase
    .from('comments')
    .select('*, author:profiles(id,username,avatar_url)')
    .eq('post_id', id)
    .order('created_at', { ascending: true })

  // User votes on comments
  let commentVotes: Record<string, -1 | 1> = {}
  if (user && flatComments?.length) {
    const { data: cv } = await supabase
      .from('comment_votes')
      .select('comment_id, vote')
      .eq('user_id', user.id)
      .in('comment_id', flatComments.map(c => c.id))
    if (cv) commentVotes = Object.fromEntries(cv.map(v => [v.comment_id, v.vote]))
  }

  const commentsWithVotes: Comment[] = (flatComments ?? []).map(c => ({
    ...c,
    user_vote: commentVotes[c.id] ?? 0,
  }))

  const nestedComments = nestComments(commentsWithVotes)

  // Sidebar communities
  const { data: communities } = await supabase.from('communities').select('*').order('member_count', { ascending: false })
  const activeCommunity = communities?.find(c => c.id === post.community_id) ?? null

  const author = post.author
  const community = post.community as { slug: string; name: string } | null

  const postSchema = {
    '@context': 'https://schema.org',
    '@type': 'DiscussionForumPosting',
    headline: post.title,
    url: `${SITE_URL}/community/post/${id}`,
    datePublished: post.created_at,
    author: {
      '@type': 'Person',
      name: author?.username ? `u/${author.username}` : 'DiamondCritics Member',
      url: author?.username ? `${SITE_URL}/community/u/${author.username}` : undefined,
    },
    publisher: { '@type': 'Organization', name: 'DiamondCritics', url: SITE_URL },
    ...(post.body && { text: post.body.slice(0, 500) }),
    ...(post.url && { sharedContent: { '@type': 'WebPage', url: post.url } }),
    isPartOf: {
      '@type': 'WebForum',
      name: 'Diamond Community',
      url: `${SITE_URL}/community`,
    },
    interactionStatistic: {
      '@type': 'InteractionCounter',
      interactionType: 'https://schema.org/CommentAction',
      userInteractionCount: post.comment_count,
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Community', item: `${SITE_URL}/community` },
      ...(community ? [{ '@type': 'ListItem', position: 2, name: community.name, item: `${SITE_URL}/community/r/${community.slug}` }] : []),
      { '@type': 'ListItem', position: community ? 3 : 2, name: post.title, item: `${SITE_URL}/community/post/${id}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(postSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_316px] gap-6">
      <div className="min-w-0">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-500 mb-3 flex items-center gap-1 flex-wrap">
          <Link href="/community" className="hover:underline">Community</Link>
          <span>›</span>
          {community && (
            <>
              <Link href={`/community/r/${community.slug}`} className="text-[#C6973E] hover:underline font-medium">
                r/{community.slug}
              </Link>
              <span>›</span>
            </>
          )}
          <span className="truncate max-w-[200px] sm:max-w-none">{post.title}</span>
        </nav>

        {/* Post card */}
        <article className="bg-white border border-[#EDEFF1] rounded mb-4">
          <div className="flex">
            {/* Vote column */}
            <div className="flex-none w-10 sm:w-12 bg-[#F8F9FA] rounded-l flex flex-col items-center pt-3 px-1">
              <VoteButtons
                id={post.id}
                type="post"
                initialScore={post.score}
                initialVote={post.user_vote ?? 0}
                userId={user?.id}
                vertical={true}
              />
            </div>

            {/* Post content */}
            <div className="flex-1 p-3 sm:p-4 min-w-0">
              {/* Meta */}
              <div className="flex items-center gap-1.5 flex-wrap text-xs text-gray-500 mb-2">
                {community && (
                  <>
                    <Link href={`/community/r/${community.slug}`} className="font-bold text-gray-800 hover:underline">
                      r/{community.slug}
                    </Link>
                    <span>•</span>
                  </>
                )}
                <span>
                  Posted by{' '}
                  <Link href={`/community/u/${author?.username}`} className="hover:underline">
                    u/{author?.username ?? '[deleted]'}
                  </Link>
                </span>
                <span>•</span>
                <span>{timeAgo(post.created_at)}</span>
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight mb-3">
                {post.title}
              </h1>

              {/* Body */}
              {post.type === 'text' && post.body && (
                <div className="text-gray-800 text-sm sm:text-base leading-relaxed whitespace-pre-wrap mb-3">
                  {post.body}
                </div>
              )}

              {/* Link */}
              {post.type === 'link' && post.url && (
                <a
                  href={post.url}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline bg-blue-50 px-3 py-2 rounded mb-3"
                >
                  🔗 {post.url}
                </a>
              )}

              {/* Image */}
              {post.type === 'image' && post.image_url && (
                <div className="mb-3">
                  <img src={post.image_url} alt={post.title} className="max-w-full rounded" />
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center gap-3 text-xs text-gray-500 pt-2 border-t border-[#EDEFF1]">
                <span className="flex items-center gap-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                  </svg>
                  {post.comment_count} comments
                </span>
                {(user?.id === post.author_id || isAdmin) && (
                  <form action={async () => {
                    'use server'
                    const { deletePost } = await import('@/app/community/actions')
                    await deletePost(id)
                  }}>
                    <button type="submit" className="text-red-400 hover:text-red-600">
                      Delete
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </article>

        {/* Comments */}
        <CommentSection
          comments={nestedComments}
          postId={id}
          userId={user?.id}
          isAdmin={isAdmin}
        />
      </div>

      {/* Sidebar */}
      <CommunitySidebar communities={communities ?? []} user={user} activeCommunity={activeCommunity} />
    </div>
    </>
  )
}
