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
    if (!userId) {
      router.push('/community/login')
      return
    }

    const newVote = userVote === v ? 0 : v
    const scoreDelta = newVote - userVote
    setScore(s => s + scoreDelta)
    setUserVote(newVote as -1 | 0 | 1)

    startTransition(async () => {
      const action = type === 'post' ? votePost : voteComment
      await action(id, v)
    })
  }

  const upActive = userVote === 1
  const downActive = userVote === -1

  if (vertical) {
    return (
      <div className="flex flex-col items-center gap-0.5 min-w-[32px]">
        <button
          onClick={() => handleVote(1)}
          disabled={isPending}
          className={`p-1 rounded transition-colors hover:bg-orange-50 ${upActive ? 'text-[#C6973E]' : 'text-gray-400 hover:text-[#C6973E]'}`}
          aria-label="Upvote"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={upActive ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5">
            <path d="M12 4l8 8H4z" />
          </svg>
        </button>
        <span className={`text-xs font-bold leading-none ${upActive ? 'text-[#C6973E]' : downActive ? 'text-[#6576FF]' : 'text-gray-700'}`}>
          {score}
        </span>
        <button
          onClick={() => handleVote(-1)}
          disabled={isPending}
          className={`p-1 rounded transition-colors hover:bg-indigo-50 ${downActive ? 'text-[#6576FF]' : 'text-gray-400 hover:text-[#6576FF]'}`}
          aria-label="Downvote"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={downActive ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5">
            <path d="M12 20l-8-8h16z" />
          </svg>
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => handleVote(1)}
        disabled={isPending}
        className={`p-1 rounded transition-colors ${upActive ? 'text-[#C6973E]' : 'text-gray-400 hover:text-[#C6973E]'}`}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill={upActive ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5">
          <path d="M12 4l8 8H4z" />
        </svg>
      </button>
      <span className={`text-xs font-bold ${upActive ? 'text-[#C6973E]' : downActive ? 'text-[#6576FF]' : 'text-gray-700'}`}>
        {score}
      </span>
      <button
        onClick={() => handleVote(-1)}
        disabled={isPending}
        className={`p-1 rounded transition-colors ${downActive ? 'text-[#6576FF]' : 'text-gray-400 hover:text-[#6576FF]'}`}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill={downActive ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5">
          <path d="M12 20l-8-8h16z" />
        </svg>
      </button>
    </div>
  )
}
