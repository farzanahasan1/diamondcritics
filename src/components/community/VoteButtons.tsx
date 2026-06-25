'use client'

import { useState, useTransition } from 'react'
import { votePost, voteComment } from '@/app/community/actions'
import { useRouter } from 'next/navigation'

interface Props {
  id: string
  type: 'post' | 'comment'
  initialScore: number
  initialVote: -1 | 0 | 1
  userId?: string
  vertical?: boolean
}

export default function VoteButtons({ id, type, initialScore, initialVote, userId, vertical = true }: Props) {
  const [score, setScore] = useState(initialScore)
  const [userVote, setUserVote] = useState<-1 | 0 | 1>(initialVote)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleVote(v: 1 | -1) {
    if (!userId) { router.push('/community/login'); return }
    const prevVote = userVote
    const prevScore = score
    const newVote = userVote === v ? 0 : v
    setScore(s => s + (newVote - userVote))
    setUserVote(newVote as -1 | 0 | 1)
    startTransition(async () => {
      const action = type === 'post' ? votePost : voteComment
      const result = await action(id, v)
      if (result?.error) {
        setScore(prevScore)
        setUserVote(prevVote)
      }
    })
  }

  const upActive = userVote === 1
  const downActive = userVote === -1

  if (vertical) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
        <button
          onClick={() => handleVote(1)}
          disabled={isPending}
          title="Upvote"
          style={{
            background: upActive ? '#FEF3DA' : 'transparent',
            border: 'none', borderRadius: '6px',
            padding: '6px 8px', cursor: isPending ? 'default' : 'pointer',
            color: upActive ? '#C6973E' : '#C4B9AD',
            transition: 'background 0.15s, color 0.15s',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onMouseEnter={e => { if (!upActive) (e.currentTarget as HTMLButtonElement).style.color = '#C6973E' }}
          onMouseLeave={e => { if (!upActive) (e.currentTarget as HTMLButtonElement).style.color = '#C4B9AD' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={upActive ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.2">
            <path d="M12 4l8 8H4z" />
          </svg>
        </button>
        <button
          onClick={() => handleVote(-1)}
          disabled={isPending}
          title="Downvote"
          style={{
            background: downActive ? '#EEF0FF' : 'transparent',
            border: 'none', borderRadius: '6px',
            padding: '6px 8px', cursor: isPending ? 'default' : 'pointer',
            color: downActive ? '#6576FF' : '#C4B9AD',
            transition: 'background 0.15s, color 0.15s',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onMouseEnter={e => { if (!downActive) (e.currentTarget as HTMLButtonElement).style.color = '#6576FF' }}
          onMouseLeave={e => { if (!downActive) (e.currentTarget as HTMLButtonElement).style.color = '#C4B9AD' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={downActive ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.2">
            <path d="M12 20l-8-8h16z" />
          </svg>
        </button>
      </div>
    )
  }

  // Horizontal — inline footer buttons with labels
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <button
        onClick={() => handleVote(1)}
        disabled={isPending}
        style={{
          background: upActive ? '#FEF3DA' : 'transparent',
          border: 'none', borderRadius: '6px',
          padding: '5px 10px', cursor: isPending ? 'default' : 'pointer',
          color: upActive ? '#C6973E' : '#9A8F87',
          display: 'flex', alignItems: 'center', gap: '5px',
          fontSize: '12px', fontWeight: 600,
          transition: 'background 0.15s, color 0.15s',
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill={upActive ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5">
          <path d="M12 4l8 8H4z" />
        </svg>
        Upvote
      </button>
      <button
        onClick={() => handleVote(-1)}
        disabled={isPending}
        style={{
          background: downActive ? '#EEF0FF' : 'transparent',
          border: 'none', borderRadius: '6px',
          padding: '5px 10px', cursor: isPending ? 'default' : 'pointer',
          color: downActive ? '#6576FF' : '#9A8F87',
          display: 'flex', alignItems: 'center', gap: '5px',
          fontSize: '12px', fontWeight: 600,
          transition: 'background 0.15s, color 0.15s',
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill={downActive ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5">
          <path d="M12 20l-8-8h16z" />
        </svg>
        Downvote
      </button>
    </div>
  )
}
