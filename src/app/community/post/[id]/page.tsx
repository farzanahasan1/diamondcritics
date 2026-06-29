import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import CommentSection from '@/components/community/CommentSection'
import VoteButtons from '@/components/community/VoteButtons'
import CommunitySidebar from '@/components/community/CommunitySidebar'
import LinkPreviewImg from '@/components/community/LinkPreviewImg'
import PostActions from '@/components/community/PostActions'
import ShareButton from '@/components/community/ShareButton'
import SaveButton from '@/components/community/SaveButton'
import type { Comment, Post } from '@/types/community'
import { FLAIR_OPTIONS } from '@/types/community'
import type { Metadata } from 'next'
import { renderMarkdown } from '@/lib/community/markdown'
import { timeAgo } from '@/lib/community/timeAgo'

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
    twitter: { card: 'summary_large_image' },
  }
}

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch post (plain select — avoids FK constraint dependency)
  const { data: postRaw } = await supabase
    .from('posts')
    .select('id,community_id,author_id,title,body,url,image_url,link_preview_image,flair,type,score,comment_count,is_deleted,is_draft,is_pinned,created_at,updated_at')
    .eq('id', id)
    .single()

  if (!postRaw || postRaw.is_deleted) redirect('/community')

  // Check admin + draft access before doing any more work
  let isAdmin = false
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single()
    isAdmin = profile?.is_admin ?? false
  }
  const isOwner = user?.id === postRaw.author_id
  if (postRaw.is_draft && !isOwner && !isAdmin) redirect('/community')

  // Fetch author and community separately
  const [{ data: postAuthor }, { data: postCommunity }] = await Promise.all([
    postRaw.author_id
      ? supabase.from('profiles').select('id,username,avatar_url,is_admin').eq('id', postRaw.author_id).single()
      : Promise.resolve({ data: null }),
    postRaw.community_id
      ? supabase.from('communities').select('id,slug,name,description,rules,icon_url,banner_url,member_count,post_count,created_at').eq('id', postRaw.community_id).single()
      : Promise.resolve({ data: null }),
  ])

  const postRawEnriched = { ...postRaw, author: postAuthor, community: postCommunity }

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

  const post: Post = { ...postRawEnriched, user_vote: postUserVote }

  // Fetch comments — keep deleted ones that have replies (needed for nesting UI)
  const { data: flatCommentsData } = await supabase
    .from('comments')
    .select('id, post_id, author_id, parent_id, body, score, is_deleted, created_at')
    .eq('post_id', id)
    .order('created_at', { ascending: true })

  // Fetch comment authors separately
  const commentAuthorIds = [...new Set((flatCommentsData ?? []).map(c => c.author_id).filter(Boolean))]
  type AuthorRow = { id: string; username: string; avatar_url: string | null }
  let commentAuthorsMap: Record<string, AuthorRow> = {}
  if (commentAuthorIds.length) {
    const { data: cAuthors } = await supabase.from('profiles').select('id,username,avatar_url').in('id', commentAuthorIds)
    if (cAuthors) commentAuthorsMap = Object.fromEntries(cAuthors.map(a => [a.id, a]))
  }
  const flatComments = (flatCommentsData ?? []).map(c => ({ ...c, author: commentAuthorsMap[c.author_id] ?? null }))

  // User votes on comments
  let commentVotes: Record<string, -1 | 0 | 1> = {}
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
    body_html: renderMarkdown(c.body ?? ''),
  }))

  const nestedComments = nestComments(commentsWithVotes)

  // Sidebar communities
  const { data: communities } = await supabase.from('communities').select('id,slug,name,description,icon_url,banner_url,member_count,post_count,created_at').order('member_count', { ascending: false })
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
    <div className="c-layout-post">
      <div style={{ minWidth: 0 }}>

        {/* Breadcrumb */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap', fontSize: '12px', color: '#9A8F87', marginBottom: '12px' }}>
          <Link href="/community" style={{ color: '#9A8F87', textDecoration: 'none' }}>Community</Link>
          <span style={{ color: '#D4C8BE' }}>›</span>
          {community && (
            <>
              <Link href={`/community/r/${community.slug}`} style={{ color: '#C6973E', fontWeight: 600, textDecoration: 'none' }}>
                r/{community.slug}
              </Link>
              <span style={{ color: '#D4C8BE' }}>›</span>
            </>
          )}
          <span style={{ color: '#B0A89E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px' }}>{post.title}</span>
        </nav>

        {/* Post card */}
        <article style={{
          background: '#fff',
          borderRadius: '12px',
          boxShadow: '0 1px 4px rgba(28,18,9,0.07), 0 4px 16px rgba(28,18,9,0.05)',
          overflow: 'hidden',
          marginBottom: '16px',
        }}>
          <div>

            {/* Post content */}
            <div style={{ padding: '16px 20px 12px', minWidth: 0 }}>

              {/* Meta */}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#9A8F87', marginBottom: '8px' }}>
                {community && (
                  <>
                    <Link href={`/community/r/${community.slug}`} style={{ fontWeight: 700, color: '#3A2208', textDecoration: 'none' }}>
                      r/{community.slug}
                    </Link>
                    <span style={{ color: '#D4C8BE' }}>·</span>
                  </>
                )}
                <span>
                  Posted by{' '}
                  {author?.username
                    ? <Link href={`/community/u/${author.username}`} style={{ color: '#7A6F66', textDecoration: 'none', fontWeight: 500 }}>u/{author.username}</Link>
                    : <span style={{ color: '#7A6F66', fontWeight: 500 }}>u/[deleted]</span>}
                </span>
                <span style={{ color: '#D4C8BE' }}>·</span>
                <span>{timeAgo(post.created_at)}</span>
                {post.is_pinned && <span style={{ color: '#16A34A', fontWeight: 600, fontSize: '11px' }}>📌 Pinned</span>}
              </div>

              {/* Flair */}
              {post.flair && (() => {
                const f = FLAIR_OPTIONS.find(o => o.value === post.flair)
                return f ? (
                  <span style={{
                    display: 'inline-block',
                    padding: '3px 11px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 700,
                    background: f.bg,
                    color: f.color,
                    marginBottom: '10px',
                  }}>
                    {f.label}
                  </span>
                ) : null
              })()}

              {/* Title */}
              <h1 style={{ fontFamily: 'var(--font-ivy, Georgia, serif)', fontSize: '22px', fontWeight: 600, color: '#1C1209', lineHeight: 1.35, marginBottom: '14px' }}>
                {post.title}
              </h1>

              {/* Body */}
              {post.body && (
                <div
                  className="c-post-body"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body) }}
                  style={{ marginBottom: '16px' }}
                />
              )}

              {/* Link */}
              {post.type === 'link' && post.url && (() => {
                // Use stored OG image, or derive from diamondcritics slug as fallback
                const slug = !post.link_preview_image && post.url.startsWith('https://diamondcritics.com/')
                  ? post.url.replace('https://diamondcritics.com/', '').split('?')[0].replace(/\/$/, '')
                  : null
                const imgUrl = post.link_preview_image ?? (slug ? `https://diamondcritics.com/images/${slug}.avif` : null)
                const hostname = (() => { try { return new URL(post.url).hostname.replace(/^www\./, '') } catch { return post.url } })()
                return (
                  <a
                    href={post.url}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    style={{
                      display: 'block', textDecoration: 'none', marginBottom: '14px',
                      borderRadius: '10px', overflow: 'hidden',
                      border: '1px solid #EDE8E1',
                      background: '#FDF8EF',
                    }}
                  >
                    {imgUrl && <LinkPreviewImg src={imgUrl} alt={post.title} />}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px' }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#C6973E" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
                        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
                      </svg>
                      <span style={{ fontSize: '13px', color: '#C6973E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {hostname}
                      </span>
                      <span style={{ fontSize: '12px', color: '#B0A89E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                        — {post.title}
                      </span>
                    </div>
                  </a>
                )
              })()}

              {/* Image — fetchpriority high because it's often the LCP element */}
              {post.type === 'image' && post.image_url && (
                <div style={{ marginBottom: '14px' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.image_url} alt={post.title} fetchPriority="high" decoding="async" style={{ maxWidth: '100%', borderRadius: '8px', display: 'block' }} />
                </div>
              )}

            </div>
          </div>

          {/* Footer: votes + comments */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            padding: '8px 16px',
            borderTop: '1px solid #F5F0EA',
            background: '#FAFAF8',
          }}>
            <VoteButtons
              id={post.id}
              type="post"
              initialScore={post.score}
              initialVote={post.user_vote ?? 0}
              userId={user?.id}
              vertical={false}
            />
            <div style={{ width: '1px', height: '16px', background: '#EDE8E1', margin: '0 4px' }} />
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#9A8F87' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
              {post.comment_count} {post.comment_count === 1 ? 'comment' : 'comments'}
            </span>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
              {user && <SaveButton postId={post.id} userId={user.id} />}
              <ShareButton title={post.title} />
              {(isOwner || isAdmin) && (
                <PostActions
                  postId={post.id}
                  postTitle={post.title}
                  postBody={post.body}
                  postType={post.type}
                  postUrl={post.url}
                  isDraft={post.is_draft ?? false}
                />
              )}
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
