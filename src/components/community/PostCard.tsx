import Link from 'next/link'
import VoteButtons from './VoteButtons'
import type { Post } from '@/types/community'

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString()
}

interface Props {
  post: Post
  userId?: string
  compact?: boolean
}

export default function PostCard({ post, userId, compact = false }: Props) {
  if (post.is_deleted) return null

  const author = post.author
  const community = post.community
  const authorLabel = author?.username ? `u/${author.username}` : '[deleted]'

  return (
    <article
      className="flex rounded-xl overflow-hidden transition-all"
      style={{ background: '#fff', border: '1px solid #E2DDD7' }}
    >
      {/* Vote column */}
      <div className="flex-none w-10 flex flex-col items-center pt-2.5 px-1" style={{ background: '#FAF8F5', borderRight: '1px solid #E2DDD7' }}>
        <VoteButtons
          id={post.id}
          type="post"
          initialScore={post.score}
          initialVote={post.user_vote ?? 0}
          userId={userId}
          vertical={true}
        />
      </div>

      {/* Content */}
      <div className="flex-1 p-3 min-w-0">
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-1 text-xs mb-1.5" style={{ color: '#9a8f87' }}>
          {community && (
            <>
              <Link href={`/community/r/${community.slug}`} className="font-semibold hover:underline" style={{ color: '#18110A' }}>
                r/{community.slug}
              </Link>
              <span style={{ color: '#d0c8c0' }}>·</span>
            </>
          )}
          <span>
            Posted by{' '}
            <Link href={`/community/u/${author?.username}`} className="hover:underline" style={{ color: '#7a6f66' }}>
              {authorLabel}
            </Link>
          </span>
          <span style={{ color: '#d0c8c0' }}>·</span>
          <span>{timeAgo(post.created_at)}</span>
          {post.is_pinned && (
            <span className="font-medium" style={{ color: '#22a06b' }}>📌 Pinned</span>
          )}
        </div>

        {/* Title */}
        <Link href={`/community/post/${post.id}`}>
          <h2 className="text-base font-semibold leading-snug mb-1.5 hover:underline" style={{ color: '#18110A', fontFamily: 'var(--font-dm), system-ui, sans-serif', textDecorationColor: '#C6973E' }}>
            {post.title}
          </h2>
        </Link>

        {/* Body preview */}
        {!compact && post.type === 'text' && post.body && (
          <p className="text-sm line-clamp-2 mb-2" style={{ color: '#7a6f66' }}>{post.body}</p>
        )}

        {/* Link */}
        {post.type === 'link' && post.url && (
          <a
            href={post.url}
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="text-xs hover:underline block mb-2 truncate"
            style={{ color: '#C6973E' }}
          >
            🔗 {post.url}
          </a>
        )}

        {/* Image */}
        {post.type === 'image' && post.image_url && (
          <div className="mb-2">
            <img src={post.image_url} alt={post.title} className="max-h-96 rounded-lg object-contain" />
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center gap-2 text-xs" style={{ color: '#9a8f87' }}>
          <Link
            href={`/community/post/${post.id}`}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors"
            style={{ color: '#9a8f87' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
            {post.comment_count} {post.comment_count === 1 ? 'comment' : 'comments'}
          </Link>
          {post.type === 'link' && post.url && (
            <a
              href={post.url}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="flex items-center gap-1.5 px-2 py-1 rounded-md"
              style={{ color: '#9a8f87' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              Visit link
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
