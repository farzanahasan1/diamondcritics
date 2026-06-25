'use client'

import { useState, useTransition } from 'react'
import { joinCommunity, leaveCommunity } from '@/app/community/actions'

interface Props {
  communityId: string
  initialIsMember: boolean
  userId: string | undefined
}

export default function JoinButton({ communityId, initialIsMember, userId }: Props) {
  const [isMember, setIsMember] = useState(initialIsMember)
  const [isPending, startTransition] = useTransition()

  if (!userId) {
    return (
      <a href="/community/register" style={{
        display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0,
        background: 'linear-gradient(145deg, #D4A843, #B8881E)',
        color: '#fff', fontWeight: 600, fontSize: '13px',
        padding: '9px 18px', borderRadius: '8px', textDecoration: 'none',
      }}>
        Join Community
      </a>
    )
  }

  function toggle() {
    startTransition(async () => {
      if (isMember) {
        setIsMember(false)
        const res = await leaveCommunity(communityId)
        if (res?.error) setIsMember(true)
      } else {
        setIsMember(true)
        const res = await joinCommunity(communityId)
        if (res?.error) setIsMember(false)
      }
    })
  }

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      style={{
        display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0, cursor: 'pointer', border: 'none',
        background: isMember
          ? 'transparent'
          : 'linear-gradient(145deg, #D4A843, #B8881E)',
        color: isMember ? '#7A6F66' : '#fff',
        fontWeight: 600, fontSize: '13px',
        padding: '9px 18px', borderRadius: '8px',
        outline: isMember ? '1px solid #D1C7BA' : 'none',
        opacity: isPending ? 0.6 : 1,
        transition: 'all 0.15s ease',
      }}
    >
      {isMember ? (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Joined
        </>
      ) : (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Join
        </>
      )}
    </button>
  )
}
