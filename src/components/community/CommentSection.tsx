'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { createComment, deleteComment } from '@/app/community/actions'
import VoteButtons from './VoteButtons'
import ReportButton from './ReportButton'
import type { Comment } from '@/types/community'

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
    <form action={handleSubmit} className="mt-2 ml-4">
      <input type="hidden" name="post_id" value={postId} />
      <input type="hidden" name="parent_id" value={parentId} />
      <textarea
        name="body"
        placeholder="Write a reply..."
        required
        className="w-full border border-gray-300 rounded p-2 text-sm resize-none focus:outline-none focus:border-[#C6973E] min-h-[80px]"
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      <div className="flex gap-2 mt-1">
        <button
          type="submit"
          disabled={isPending}
          className="text-xs bg-[#C6973E] text-white px-3 py-1.5 rounded font-semibold hover:bg-[#b08535] disabled:opacity-50"
        >
          {isPending ? 'Posting…' : 'Reply'}
        </button>
        <button type="button" onClick={onCancel} className="text-xs text-gray-500 hover:text-gray-800 px-3 py-1.5 rounded">
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
    <div className={`${depth > 0 ? 'ml-4 pl-3 border-l-2 border-[#EDEFF1]' : ''}`}>
      <div className="py-1.5">
        {comment.is_deleted ? (
          <p className="text-xs text-gray-400 italic">[deleted]</p>
        ) : (
          <>
            {/* Author + meta */}
            <div className="flex items-center gap-1.5 flex-wrap mb-1">
              <Link href={`/community/u/${author?.username}`} className="text-xs font-bold text-gray-800 hover:underline">
                u/{author?.username ?? '[deleted]'}
              </Link>
              <span className="text-xs text-gray-400">{timeAgo(comment.created_at)}</span>
              <button
                onClick={() => setCollapsed(c => !c)}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                [{collapsed ? '+' : '–'}]
              </button>
            </div>

            {!collapsed && (
              <>
                <p className="text-sm text-gray-800 whitespace-pre-wrap mb-1.5">{comment.body}</p>
                <div className="flex items-center gap-3">
                  <VoteButtons
                    id={comment.id}
                    type="comment"
                    initialScore={comment.score}
                    initialVote={comment.user_vote ?? 0}
                    userId={userId}
                    vertical={false}
                  />
                  {userId && (
                    <button
                      onClick={() => setShowReply(r => !r)}
                      className="text-xs text-gray-500 hover:text-gray-800"
                    >
                      Reply
                    </button>
                  )}
                  {userId && userId !== comment.author_id && (
                    <ReportButton targetType="comment" targetId={comment.id} userId={userId} />
                  )}
                  {canDelete && (
                    <button
                      onClick={handleDelete}
                      disabled={isPending}
                      className="text-xs text-red-400 hover:text-red-600"
                    >
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

      {/* Replies */}
      {!collapsed && comment.replies?.map(reply => (
        <CommentNode
          key={reply.id}
          comment={reply}
          postId={postId}
          userId={userId}
          isAdmin={isAdmin}
          depth={depth + 1}
        />
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
      <div className="bg-white border border-[#EDEFF1] rounded p-4 text-center text-sm text-gray-500">
        <Link href="/community/login" className="text-[#C6973E] font-semibold hover:underline">Log in</Link> or{' '}
        <Link href="/community/register" className="text-[#C6973E] font-semibold hover:underline">sign up</Link> to comment
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
    <form id="comment-form" action={handleSubmit} className="bg-white border border-[#EDEFF1] rounded p-3">
      <input type="hidden" name="post_id" value={postId} />
      <textarea
        name="body"
        placeholder="What are your thoughts?"
        required
        className="w-full border border-gray-300 rounded p-2.5 text-sm resize-none focus:outline-none focus:border-[#C6973E] min-h-[100px]"
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      <div className="flex justify-end mt-2">
        <button
          type="submit"
          disabled={isPending}
          className="text-sm bg-[#C6973E] text-white px-4 py-1.5 rounded font-semibold hover:bg-[#b08535] disabled:opacity-50 transition-colors"
        >
          {isPending ? 'Posting…' : 'Comment'}
        </button>
      </div>
    </form>
  )
}

interface Props {
  comments: Comment[]
  postId: string
  userId?: string
  isAdmin?: boolean
}

export default function CommentSection({ comments, postId, userId, isAdmin }: Props) {
  const topLevel = comments.filter(c => !c.parent_id)

  return (
    <div className="space-y-4">
      <TopLevelCommentForm postId={postId} userId={userId} />

      <div className="bg-white border border-[#EDEFF1] rounded divide-y divide-[#EDEFF1]">
        {topLevel.length === 0 ? (
          <p className="text-sm text-gray-400 p-4 text-center">No comments yet. Be the first!</p>
        ) : (
          topLevel.map(comment => (
            <div key={comment.id} className="px-4 py-2">
              <CommentNode
                comment={comment}
                postId={postId}
                userId={userId}
                isAdmin={isAdmin}
                depth={0}
              />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
