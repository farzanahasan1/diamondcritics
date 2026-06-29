'use client'

import { useState, useTransition } from 'react'
import { toggleSavePost } from '@/app/community/actions'

interface Props {
  postId: string
  userId: string
  initialSaved?: boolean
}

export default function SaveButton({ postId, userId, initialSaved = false }: Props) {
  const [saved, setSaved] = useState(initialSaved)
  const [isPending, startTransition] = useTransition()

  function handleToggle() {
    if (!userId) return
    const next = !saved
    setSaved(next)
    startTransition(async () => {
      const result = await toggleSavePost(postId)
      if (result?.error) setSaved(!next) // revert on error
    })
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      title={saved ? 'Unsave post' : 'Save post'}
      style={{
        display: 'flex', alignItems: 'center', gap: '5px',
        fontSize: '12px',
        color: saved ? '#B8881E' : '#9A8F87',
        background: 'none', border: 'none',
        cursor: isPending ? 'not-allowed' : 'pointer',
        padding: '4px 8px', borderRadius: '6px',
        transition: 'background 0.12s, color 0.12s',
        opacity: isPending ? 0.6 : 1,
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#F5F0EA'; (e.currentTarget as HTMLElement).style.color = saved ? '#B8881E' : '#3A2208' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'none'; (e.currentTarget as HTMLElement).style.color = saved ? '#B8881E' : '#9A8F87' }}
    >
      <svg
        width="13" height="13" viewBox="0 0 24 24"
        fill={saved ? 'currentColor' : 'none'}
        stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
      </svg>
      {saved ? 'Saved' : 'Save'}
    </button>
  )
}
