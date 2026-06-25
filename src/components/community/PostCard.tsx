import Link from 'next/link'
import VoteButtons from './VoteButtons'
import ReportButton from './ReportButton'
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
    <article style={{
      background: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 1px 4px rgba(28,18,9,0.07), 0 4px 16px rgba(28,18,9,0.05)',
      display: 'flex',
      overflow: 'hidden',
      transition: 'box-shadow 0.15s',
    }}>

      {/* Vote column */}
      <div style={{
        width: '44px', flexShrink: 0,
        background: '#FAF8F5',
        borderRight: '1px solid #EDE8E1',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '12px',
        paddingLeft: '4px',
        paddingRight: '4px',
      }}>
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
      <div style={{ flex: 1, padding: '12px 16px', minWidth: 0 }}>

        {/* Meta */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#9A8F87', marginBottom: '6px' }}>
          {community && (
            <>
              <Link href={`/community/r/${community.slug}`} style={{ fontWeight: 600, color: '#3A2208', textDecoration: 'none' }}>
                r/{community.slug}
              </Link>
              <span style={{ color: '#D4C8BE' }}>·</span>
            </>
          )}
          <span>
            Posted by{' '}
            <Link href={`/community/u/${author?.username}`} style={{ color: '#7A6F66', textDecoration: 'none' }}>
              {authorLabel}
            </Link>
          </span>
          <span style={{ color: '#D4C8BE' }}>·</span>
          <span>{timeAgo(post.created_at)}</span>
          {post.is_pinned && <span style={{ color: '#16A34A', fontWeight: 500 }}>📌 Pinned</span>}
        </div>

        {/* Title */}
        <Link href={`/community/post/${post.id}`} style={{ textDecoration: 'none' }}>
          <h2 style={{
            fontSize: '15px', fontWeight: 600, color: '#1C1209',
            lineHeight: '1.45', marginBottom: '6px',
            fontFamily: 'var(--font-dm, system-ui, sans-serif)',
          }}>
            {post.title}
          </h2>
        </Link>

        {/* Body preview */}
        {!compact && post.type === 'text' && post.body && (
          <p style={{
            fontSize: '13px', color: '#7A6F66', lineHeight: '1.55',
            marginBottom: '10px',
            overflow: 'hidden', maxHeight: '2.9em',
          }}>
            {post.body}
          </p>
        )}

        {/* Link */}
        {post.type === 'link' && post.url && (() => {
          const slug = !post.link_preview_image && post.url.startsWith('https://diamondcritics.com/')
            ? post.url.replace('https://diamondcritics.com/', '').split('?')[0].replace(/\/$/, '')
            : null
          const imgUrl = post.link_preview_image ?? (slug ? `https://diamondcritics.com/images/${slug}.avif` : null)
          const hostname = (() => { try { return new URL(post.url).hostname.replace(/^www\./, '') } catch { return post.url } })()
          return (
            <a href={post.url} target="_blank" rel="nofollow noopener noreferrer"
              style={{ display: 'block', textDecoration: 'none', marginBottom: '8px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #EDE8E1', background: '#FDF8EF' }}>
              {imgUrl && (
                <img
                  src={imgUrl}
                  alt={post.title}
                  style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', display: 'block' }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 10px' }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#C6973E" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
                  <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
                </svg>
                <span style={{ fontSize: '11px', color: '#C6973E', fontWeight: 600 }}>{hostname}</span>
              </div>
            </a>
          )
        })()}

        {/* Image */}
        {post.type === 'image' && post.image_url && (
          <div style={{ marginBottom: '10px' }}>
            <img src={post.image_url} alt={post.title} style={{ maxHeight: '384px', borderRadius: '8px', objectFit: 'contain' }} />
          </div>
        )}

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link href={`/community/post/${post.id}`} style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            fontSize: '12px', color: '#9A8F87', textDecoration: 'none',
            padding: '4px 8px', borderRadius: '6px',
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
            {post.comment_count} {post.comment_count === 1 ? 'comment' : 'comments'}
          </Link>
          {userId && userId !== post.author_id && (
            <ReportButton targetType="post" targetId={post.id} userId={userId} />
          )}
        </div>

      </div>
    </article>
  )
}
