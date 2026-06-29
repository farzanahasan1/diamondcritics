'use client'

import { useState, useTransition, useMemo } from 'react'
import Link from 'next/link'
import { createComment, deleteComment } from '@/app/community/actions'
import VoteButtons from './VoteButtons'
import ReportButton from './ReportButton'
import type { Comment } from '@/types/community'
import { timeAgo } from '@/lib/community/timeAgo'


const textareaStyle: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  border: '1.5px solid #E8E2DA', borderRadius: '8px',
  padding: '10px 14px', fontSize: '14px', color: '#1C1209',
  background: '#FAFAF9', outline: 'none', display: 'block',
  resize: 'vertical', lineHeight: 1.6, fontFamily: 'inherit',
  transition: 'border-color 0.15s',
}

interface ReplyFormProps {
  postId: string
  parentId: string
  onCancel: () => void
}

function ReplyForm({ postId, parentId, onCancel }: ReplyFormProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createComment(formData)
      if (result?.error) setError(result.error)
      else onCancel()
    })
  }

  return (
    <form action={handleSubmit} style={{ marginTop: '10px', marginLeft: '16px' }}>
      <input type="hidden" name="post_id" value={postId} />
      <input type="hidden" name="parent_id" value={parentId} />
      <textarea
        name="body"
        placeholder="Write a reply…"
        required
        rows={3}
        style={textareaStyle}
        onFocus={e => (e.target.style.borderColor = '#D4A843')}
        onBlur={e => (e.target.style.borderColor = '#E8E2DA')}
      />
      {error && <p style={{ fontSize: '12px', color: '#B91C1C', marginTop: '4px' }}>{error}</p>}
      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
        <button type="submit" disabled={isPending} style={{
          padding: '6px 16px', borderRadius: '6px', border: 'none',
          background: 'linear-gradient(145deg, #D4A843, #B8881E)',
          color: '#fff', fontSize: '12px', fontWeight: 600,
          cursor: isPending ? 'not-allowed' : 'pointer', opacity: isPending ? 0.6 : 1,
        }}>
          {isPending ? 'Posting…' : 'Reply'}
        </button>
        <button type="button" onClick={onCancel} style={{
          padding: '6px 14px', borderRadius: '6px',
          border: '1px solid #E2DDD7', background: 'transparent',
          color: '#7A6F66', fontSize: '12px', cursor: 'pointer',
        }}>
          Cancel
        </button>
      </div>
    </form>
  )
}

interface CommentNodeProps {
  comment: Comment
  postId: string
  userId?: string
  isAdmin?: boolean
  depth?: number
}

function CommentNode({ comment, postId, userId, isAdmin, depth = 0 }: CommentNodeProps) {
  const [showReply, setShowReply] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [isPending, startTransition] = useTransition()

  if (comment.is_deleted && (!comment.replies || comment.replies.length === 0)) return null

  const author = comment.author
  const canDelete = userId && (userId === comment.author_id || isAdmin)

  function handleDelete() {
    startTransition(async () => {
      await deleteComment(comment.id, postId)
    })
  }

  return (
    <div style={{ marginLeft: depth > 0 ? '20px' : 0, paddingLeft: depth > 0 ? '12px' : 0, borderLeft: depth > 0 ? '2px solid #EDE8E1' : 'none' }}>
      <div style={{ padding: '10px 0' }}>
        {comment.is_deleted ? (
          <p style={{ fontSize: '12px', color: '#B0A89E', fontStyle: 'italic' }}>[deleted]</p>
        ) : (
          <>
            {/* Author + meta */}
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px', marginBottom: '6px' }}>
              {author?.username
                ? <Link href={`/community/u/${author.username}`} style={{ fontSize: '12px', fontWeight: 700, color: '#3A2208', textDecoration: 'none' }}>u/{author.username}</Link>
                : <span style={{ fontSize: '12px', fontWeight: 700, color: '#3A2208' }}>u/[deleted]</span>}
              {author?.user_flair && (
                <span style={{ fontSize: '10px', fontWeight: 600, padding: '1px 7px', borderRadius: '20px', background: '#F5EDD8', color: '#92400E' }}>
                  {author.user_flair}
                </span>
              )}
              <span style={{ fontSize: '11px', color: '#B0A89E' }}>{timeAgo(comment.created_at)}</span>
              <button
                onClick={() => setCollapsed(c => !c)}
                aria-expanded={!collapsed}
                aria-label={collapsed ? 'Expand comment thread' : 'Collapse comment thread'}
                style={{ fontSize: '11px', color: '#B0A89E', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                [{collapsed ? '+' : '–'}]
              </button>
            </div>

            {!collapsed && (
              <>
                <div
                  className="c-comment-body"
                  dangerouslySetInnerHTML={{ __html: comment.body_html ?? comment.body }}
                  style={{ marginBottom: '8px' }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <VoteButtons
                    id={comment.id}
                    type="comment"
                    initialScore={comment.score}
                    initialVote={comment.user_vote ?? 0}
                    userId={userId}
                    vertical={false}
                  />
                  {userId && (
                    <button onClick={() => setShowReply(r => !r)} style={{ fontSize: '12px', color: '#9A8F87', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: 500 }}>
                      Reply
                    </button>
                  )}
                  {userId && userId !== comment.author_id && (
                    <ReportButton targetType="comment" targetId={comment.id} userId={userId} />
                  )}
                  {canDelete && (
                    <button onClick={handleDelete} disabled={isPending} style={{ fontSize: '12px', color: '#EF9999', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                      Delete
                    </button>
                  )}
                </div>
                {showReply && (
                  <ReplyForm postId={postId} parentId={comment.id} onCancel={() => setShowReply(false)} />
                )}
              </>
            )}
          </>
        )}
      </div>

      {!collapsed && comment.replies?.map(reply => (
        <CommentNode key={reply.id} comment={reply} postId={postId} userId={userId} isAdmin={isAdmin} depth={depth + 1} />
      ))}
    </div>
  )
}

interface TopLevelFormProps {
  postId: string
  userId?: string
}

function TopLevelCommentForm({ postId, userId }: TopLevelFormProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  if (!userId) {
    return (
      <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 4px rgba(28,18,9,0.07)', padding: '20px', textAlign: 'center' }}>
        <p style={{ fontSize: '13px', color: '#9A8F87', marginBottom: '12px' }}>Join the conversation</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
          <Link href="/community/login" style={{ padding: '8px 20px', borderRadius: '8px', background: 'linear-gradient(145deg, #D4A843, #B8881E)', color: '#fff', fontWeight: 600, fontSize: '13px', textDecoration: 'none' }}>
            Log In
          </Link>
          <Link href="/community/register" style={{ padding: '8px 20px', borderRadius: '8px', border: '1px solid #E2DDD7', color: '#5A504A', fontWeight: 500, fontSize: '13px', textDecoration: 'none' }}>
            Sign Up
          </Link>
        </div>
      </div>
    )
  }

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createComment(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        setError('')
        const form = document.getElementById('comment-form') as HTMLFormElement
        form?.reset()
      }
    })
  }

  return (
    <form id="comment-form" action={handleSubmit} style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 4px rgba(28,18,9,0.07)', padding: '16px' }}>
      <input type="hidden" name="post_id" value={postId} />
      <textarea
        name="body"
        placeholder="What are your thoughts?"
        required
        rows={4}
        style={textareaStyle}
        onFocus={e => (e.target.style.borderColor = '#D4A843')}
        onBlur={e => (e.target.style.borderColor = '#E8E2DA')}
      />
      {error && <p style={{ fontSize: '12px', color: '#B91C1C', marginTop: '6px' }}>{error}</p>}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
        <button type="submit" disabled={isPending} style={{
          padding: '9px 28px', borderRadius: '8px', border: 'none',
          background: isPending ? '#D4B87A' : 'linear-gradient(145deg, #D4A843, #B8881E)',
          color: '#fff', fontSize: '13px', fontWeight: 700,
          cursor: isPending ? 'not-allowed' : 'pointer', opacity: isPending ? 0.7 : 1,
          transition: 'opacity 0.15s',
        }}>
          {isPending ? 'Posting…' : 'Comment'}
        </button>
      </div>
    </form>
  )
}

type SortMode = 'best' | 'new' | 'top'

interface Props {
  comments: Comment[]
  postId: string
  userId?: string
  isAdmin?: boolean
}

export default function CommentSection({ comments, postId, userId, isAdmin }: Props) {
  const [sort, setSort] = useState<SortMode>('best')

  const topLevel = useMemo(() => {
    const copy = [...comments]
    if (sort === 'new') copy.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    else copy.sort((a, b) => b.score - a.score) // best + top both sort by score
    return copy
  }, [comments, sort])

  const SORTS: { key: SortMode; label: string }[] = [
    { key: 'best', label: 'Best' },
    { key: 'new',  label: 'New' },
    { key: 'top',  label: 'Top' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <TopLevelCommentForm postId={postId} userId={userId} />

      <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 4px rgba(28,18,9,0.07)', overflow: 'hidden' }}>
        {/* Sort bar */}
        {comments.length > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', padding: '10px 16px 0', borderBottom: '1px solid #F0ECE5', paddingBottom: '10px' }}>
            <span style={{ fontSize: '12px', color: '#9A8F87', marginRight: '6px' }}>Sort by:</span>
            {SORTS.map(s => (
              <button
                key={s.key}
                onClick={() => setSort(s.key)}
                style={{
                  padding: '4px 12px', borderRadius: '20px', border: 'none', cursor: 'pointer',
                  fontSize: '12px', fontWeight: 600,
                  background: sort === s.key ? 'linear-gradient(145deg, #D4A843, #B8881E)' : 'transparent',
                  color: sort === s.key ? '#fff' : '#7A6F66',
                  transition: 'all 0.12s',
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}

        {topLevel.length === 0 ? (
          <div style={{ padding: '32px 20px', textAlign: 'center' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#F5EDD8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C6973E" strokeWidth="1.5">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
            </div>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#3A2208', marginBottom: '4px' }}>No comments yet</p>
            <p style={{ fontSize: '12px', color: '#9A8F87' }}>Be the first to share your thoughts</p>
          </div>
        ) : (
          <div style={{ padding: '4px 16px' }}>
            {topLevel.map((comment, i) => (
              <div key={comment.id} style={{ borderBottom: i < topLevel.length - 1 ? '1px solid #F0ECE5' : 'none' }}>
                <CommentNode comment={comment} postId={postId} userId={userId} isAdmin={isAdmin} depth={0} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
