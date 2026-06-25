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
    <article className="bg-white border border-[#EDEFF1] rounded hover:border-gray-400 transition-colors flex">
      {/* Vote column */}
      <div className="flex-none w-10 bg-[#F8F9FA] rounded-l flex flex-col items-center pt-2 px-1">
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
      <div className="flex-1 p-2 min-w-0">
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-1 text-xs text-gray-500 mb-1">
          {community && (
            <>
              <Link href={`/community/r/${community.slug}`} className="font-semibold text-gray-800 hover:underline">
                r/{community.slug}
              </Link>
              <span>•</span>
            </>
          )}
          <span>Posted by <Link href={`/community/u/${author?.username}`} className="hover:underline">{authorLabel}</Link></span>
          <span>•</span>
          <span>{timeAgo(post.created_at)}</span>
          {post.is_pinned && <span className="text-green-600 font-medium">📌 Pinned</span>}
        </div>

        {/* Title */}
        <Link href={`/community/post/${post.id}`}>
          <h2 className="text-base font-semibold text-gray-900 hover:text-[#C6973E] leading-snug mb-1">
            {post.title}
          </h2>
        </Link>

        {/* Body preview (text posts only) */}
        {!compact && post.type === 'text' && post.body && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">{post.body}</p>
        )}

        {/* Link preview */}
        {post.type === 'link' && post.url && (
          <a
            href={post.url}
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="text-xs text-blue-600 hover:underline block mb-1 truncate"
          >
            🔗 {post.url}
          </a>
        )}

        {/* Image preview */}
        {post.type === 'image' && post.image_url && (
          <div className="mb-2">
            <img src={post.image_url} alt={post.title} className="max-h-96 rounded object-contain" />
          </div>
        )}

        {/* Footer actions */}
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <Link href={`/community/post/${post.id}`} className="flex items-center gap-1 hover:bg-gray-100 px-1.5 py-1 rounded">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
            {post.comment_count} {post.comment_count === 1 ? 'comment' : 'comments'}
          </Link>
          {post.type === 'link' && post.url && (
            <a href={post.url} target="_blank" rel="nofollow noopener noreferrer" className="flex items-center gap-1 hover:bg-gray-100 px-1.5 py-1 rounded">
              Visit link
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
