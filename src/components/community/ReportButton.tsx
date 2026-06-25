'use client'

import { useState, useTransition, useRef, useEffect } from 'react'
import { reportContent } from '@/app/community/actions'
import { REPORT_REASONS } from '@/lib/community/moderation'
import type { ReportReason } from '@/lib/community/moderation'

interface Props {
  targetType: 'post' | 'comment' | 'user'
  targetId: string
  userId?: string
}

export default function ReportButton({ targetType, targetId, userId }: Props) {
  const [open, setOpen] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  if (!userId) return null
  if (done) {
    return <span style={{ fontSize: '11px', color: '#16A34A' }}>Reported</span>
  }

  function handleReport(reason: ReportReason) {
    startTransition(async () => {
      const result = await reportContent(targetType, targetId, reason)
      if (result?.error) {
        setError(result.error)
        setTimeout(() => setError(''), 3000)
      } else {
        setDone(true)
      }
      setOpen(false)
    })
  }

  return (
    <div ref={menuRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setOpen(o => !o)}
        disabled={isPending}
        title="Report"
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '2px 6px', borderRadius: '4px',
          fontSize: '11px', color: '#9A8F87',
          display: 'flex', alignItems: 'center', gap: '3px',
          opacity: isPending ? 0.5 : 1,
        }}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
          <line x1="4" y1="22" x2="4" y2="15"/>
        </svg>
        Report
      </button>

      {error && (
        <span style={{ fontSize: '11px', color: '#EF4444', marginLeft: '4px' }}>{error}</span>
      )}

      {open && (
        <div style={{
          position: 'absolute', bottom: '100%', left: 0,
          background: '#fff',
          border: '1px solid #EDE8E1',
          borderRadius: '8px',
          boxShadow: '0 4px 16px rgba(28,18,9,0.12)',
          zIndex: 50,
          minWidth: '190px',
          padding: '4px 0',
          marginBottom: '4px',
        }}>
          <p style={{ fontSize: '11px', fontWeight: 600, color: '#9A8F87', padding: '6px 12px 4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Report reason
          </p>
          {REPORT_REASONS.map(r => (
            <button
              key={r.value}
              onClick={() => handleReport(r.value)}
              disabled={isPending}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '7px 12px', fontSize: '13px', color: '#3A2208',
                background: 'none', border: 'none', cursor: 'pointer',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#FAF8F5')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >
              {r.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
