'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { editPost, toggleDraft, deletePost } from '@/app/community/actions'

interface PostActionsProps {
  postId: string
  postTitle: string
  postBody: string | null
  postType: 'text' | 'link' | 'image'
  postUrl: string | null
  isDraft: boolean
}

export default function PostActions({ postId, postTitle, postBody, postType, postUrl, isDraft }: PostActionsProps) {
  const router = useRouter()
  const [mode, setMode] = useState<'idle' | 'edit' | 'deleteConfirm'>('idle')
  const [title, setTitle] = useState(postTitle)
  const [body, setBody] = useState(postBody ?? '')
  const [url, setUrl] = useState(postUrl ?? '')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function reset() {
    setTitle(postTitle)
    setBody(postBody ?? '')
    setUrl(postUrl ?? '')
    setError(null)
    setMode('idle')
  }

  function handleEdit() {
    setError(null)
    startTransition(async () => {
      const result = await editPost(postId, title, body, url)
      if (result?.error) {
        setError(result.error)
      } else {
        setMode('idle')
        router.refresh()
      }
    })
  }

  function handleToggleDraft() {
    startTransition(async () => {
      await toggleDraft(postId, !isDraft)
      router.refresh()
    })
  }

  function handleDelete() {
    startTransition(async () => {
      await deletePost(postId)
    })
  }

  if (mode === 'edit') {
    return (
      <div style={{ padding: '16px 20px', borderTop: '1px solid #F0EBE3', background: '#FDFBF7' }}>
        <p style={{ fontSize: '12px', fontWeight: 600, color: '#7A6F66', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Edit Post
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div>
            <label style={{ fontSize: '12px', color: '#9A8F87', display: 'block', marginBottom: '4px' }}>Title</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              maxLength={300}
              style={{
                width: '100%', padding: '8px 12px', borderRadius: '8px',
                border: '1px solid #EDE8E1', fontSize: '14px', color: '#1C1209',
                background: '#fff', outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
          {postType === 'text' && (
            <div>
              <label style={{ fontSize: '12px', color: '#9A8F87', display: 'block', marginBottom: '4px' }}>Body</label>
              <textarea
                value={body}
                onChange={e => setBody(e.target.value)}
                rows={6}
                style={{
                  width: '100%', padding: '8px 12px', borderRadius: '8px',
                  border: '1px solid #EDE8E1', fontSize: '14px', color: '#1C1209',
                  background: '#fff', outline: 'none', resize: 'vertical', boxSizing: 'border-box',
                  fontFamily: 'inherit',
                }}
              />
            </div>
          )}
          {postType === 'link' && (
            <div>
              <label style={{ fontSize: '12px', color: '#9A8F87', display: 'block', marginBottom: '4px' }}>URL</label>
              <input
                value={url}
                onChange={e => setUrl(e.target.value)}
                type="url"
                style={{
                  width: '100%', padding: '8px 12px', borderRadius: '8px',
                  border: '1px solid #EDE8E1', fontSize: '14px', color: '#1C1209',
                  background: '#fff', outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>
          )}
          {error && (
            <p style={{ fontSize: '12px', color: '#DC2626', margin: 0 }}>{error}</p>
          )}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleEdit}
              disabled={isPending}
              style={{
                fontSize: '13px', fontWeight: 600, padding: '7px 18px', borderRadius: '8px',
                background: 'linear-gradient(145deg, #D4A843 0%, #B8881E 100%)', color: '#fff',
                border: 'none', cursor: isPending ? 'not-allowed' : 'pointer',
                opacity: isPending ? 0.7 : 1,
              }}
            >
              {isPending ? 'Saving…' : 'Save changes'}
            </button>
            <button
              onClick={reset}
              disabled={isPending}
              style={{
                fontSize: '13px', padding: '7px 14px', borderRadius: '8px',
                background: 'transparent', color: '#9A8F87',
                border: '1px solid #EDE8E1', cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (mode === 'deleteConfirm') {
    return (
      <div style={{
        padding: '12px 16px', borderTop: '1px solid #F5F0EA',
        background: '#FFF8F8', display: 'flex', alignItems: 'center',
        gap: '12px', flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: '13px', color: '#7A6F66' }}>Delete this post permanently?</span>
        <button
          onClick={handleDelete}
          disabled={isPending}
          style={{
            fontSize: '13px', fontWeight: 600, padding: '6px 16px', borderRadius: '8px',
            background: '#DC2626', color: '#fff', border: 'none',
            cursor: isPending ? 'not-allowed' : 'pointer', opacity: isPending ? 0.7 : 1,
          }}
        >
          {isPending ? 'Deleting…' : 'Yes, delete'}
        </button>
        <button
          onClick={() => setMode('idle')}
          style={{
            fontSize: '13px', padding: '6px 14px', borderRadius: '8px',
            background: 'transparent', color: '#9A8F87',
            border: '1px solid #EDE8E1', cursor: 'pointer',
          }}
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginLeft: 'auto' }}>
      {isDraft && (
        <span style={{
          fontSize: '11px', fontWeight: 600, color: '#B8881E',
          background: 'rgba(212,168,67,0.12)', padding: '3px 8px',
          borderRadius: '6px', border: '1px solid rgba(212,168,67,0.3)',
          marginRight: '6px',
        }}>
          Draft
        </span>
      )}
      <button
        onClick={() => setMode('edit')}
        style={{ fontSize: '12px', color: '#9A8F87', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: '6px' }}
      >
        Edit
      </button>
      <span style={{ color: '#D4C8BE', fontSize: '12px' }}>·</span>
      <button
        onClick={handleToggleDraft}
        disabled={isPending}
        style={{ fontSize: '12px', color: '#B8881E', background: 'none', border: 'none', cursor: isPending ? 'not-allowed' : 'pointer', padding: '4px 8px', borderRadius: '6px', opacity: isPending ? 0.6 : 1 }}
      >
        {isDraft ? 'Publish' : 'Save as Draft'}
      </button>
      <span style={{ color: '#D4C8BE', fontSize: '12px' }}>·</span>
      <button
        onClick={() => setMode('deleteConfirm')}
        style={{ fontSize: '12px', color: '#EF9999', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: '6px' }}
      >
        Delete
      </button>
    </div>
  )
}
