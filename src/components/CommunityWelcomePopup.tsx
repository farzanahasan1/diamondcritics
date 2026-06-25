'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const STORAGE_KEY = 'dc_community_popup_seen'

export default function CommunityWelcomePopup() {
  const [visible, setVisible] = useState(false)
  const [animateIn, setAnimateIn] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (localStorage.getItem(STORAGE_KEY)) return

    const timer = setTimeout(() => {
      setVisible(true)
      // Slight delay so CSS transition fires after mount
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimateIn(true)))
    }, 15000)

    return () => clearTimeout(timer)
  }, [])

  function dismiss() {
    setAnimateIn(false)
    setTimeout(() => {
      setVisible(false)
      localStorage.setItem(STORAGE_KEY, '1')
    }, 350)
  }

  if (!visible) return null

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={dismiss}
        style={{
          position: 'fixed', inset: 0, zIndex: 9998,
          background: 'rgba(28, 18, 9, 0.45)',
          backdropFilter: 'blur(3px)',
          opacity: animateIn ? 1 : 0,
          transition: 'opacity 0.35s ease',
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed', zIndex: 9999,
          bottom: '50%', left: '50%',
          transform: animateIn
            ? 'translate(-50%, 50%) scale(1)'
            : 'translate(-50%, 60%) scale(0.94)',
          opacity: animateIn ? 1 : 0,
          transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.35s ease',
          width: 'min(480px, calc(100vw - 32px))',
          background: '#FFFDF9',
          borderRadius: '20px',
          boxShadow: '0 8px 40px rgba(28,18,9,0.18), 0 2px 8px rgba(28,18,9,0.1)',
          overflow: 'hidden',
        }}
      >
        {/* Gold top bar */}
        <div style={{
          height: '4px',
          background: 'linear-gradient(90deg, #C6973E 0%, #E8B84B 50%, #C6973E 100%)',
        }} />

        <div style={{ padding: '28px 28px 24px' }}>
          {/* Diamond icon */}
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="22" cy="22" r="22" fill="#FEF3DA" />
              <path d="M14 18l8-7 8 7-8 13-8-13z" fill="#C6973E" opacity="0.25" />
              <path d="M14 18h16M22 11l-8 7 8 13 8-13-8-7z" stroke="#C6973E" strokeWidth="1.6" strokeLinejoin="round" fill="none" />
              <path d="M14 18l4-7h8l4 7" stroke="#C6973E" strokeWidth="1.6" strokeLinejoin="round" fill="none" />
            </svg>
          </div>

          {/* Headline */}
          <h2 style={{
            textAlign: 'center',
            fontSize: '20px',
            fontWeight: 700,
            color: '#1C1209',
            lineHeight: '1.3',
            marginBottom: '10px',
            fontFamily: 'var(--font-dm, system-ui, sans-serif)',
          }}>
            Welcome to the #1 Diamond Community
          </h2>

          {/* Body */}
          <p style={{
            textAlign: 'center',
            fontSize: '14px',
            color: '#7A6F66',
            lineHeight: '1.6',
            marginBottom: '22px',
          }}>
            Join thousands of diamond enthusiasts, buyers, and experts sharing honest advice — so you never overpay for a diamond again.
          </p>

          {/* Stats row */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '24px',
            marginBottom: '24px',
          }}>
            {[
              { value: '5,000+', label: 'Members' },
              { value: '10,000+', label: 'Discussions' },
              { value: '100%', label: 'Free' },
            ].map(({ value, label }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '17px', fontWeight: 700, color: '#C6973E' }}>{value}</div>
                <div style={{ fontSize: '11px', color: '#9A8F87', marginTop: '2px' }}>{label}</div>
              </div>
            ))}
          </div>

          {/* CTA button */}
          <Link
            href="/community"
            onClick={dismiss}
            style={{
              display: 'block',
              textAlign: 'center',
              background: 'linear-gradient(135deg, #C6973E 0%, #D4A843 100%)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '14px',
              padding: '13px 20px',
              borderRadius: '10px',
              textDecoration: 'none',
              boxShadow: '0 2px 8px rgba(198,151,62,0.35)',
              transition: 'opacity 0.15s',
            }}
          >
            Join the Community — It&apos;s Free
          </Link>

          {/* Dismiss link */}
          <button
            onClick={dismiss}
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'center',
              marginTop: '12px',
              fontSize: '12px',
              color: '#B0A69C',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            No thanks, I&apos;ll browse without joining
          </button>
        </div>
      </div>
    </>
  )
}
