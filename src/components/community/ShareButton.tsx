'use client'

import { useState } from 'react'

interface Props { title: string }

export default function ShareButton({ title }: Props) {
  const [copied, setCopied] = useState(false)
  const [open, setOpen] = useState(false)

  function getUrl() {
    return typeof window !== 'undefined' ? window.location.href : ''
  }

  function copyLink() {
    navigator.clipboard.writeText(getUrl()).then(() => {
      setCopied(true)
      setTimeout(() => { setCopied(false); setOpen(false) }, 1800)
    })
  }

  const shareLinks = [
    {
      label: 'X / Twitter',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      href: () => `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(getUrl())}`,
    },
    {
      label: 'WhatsApp',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.115.554 4.1 1.523 5.822L0 24l6.335-1.508A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.015-1.376l-.36-.213-3.755.894.953-3.645-.234-.373A9.783 9.783 0 012.182 12C2.182 6.58 6.58 2.182 12 2.182S21.818 6.58 21.818 12 17.42 21.818 12 21.818z"/>
        </svg>
      ),
      href: () => `https://wa.me/?text=${encodeURIComponent(title + ' ' + getUrl())}`,
    },
    {
      label: 'Facebook',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      href: () => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getUrl())}`,
    },
  ]

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: '5px',
          fontSize: '12px', color: '#9A8F87', background: 'none', border: 'none',
          cursor: 'pointer', padding: '4px 8px', borderRadius: '6px',
          transition: 'background 0.12s, color 0.12s',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#F5F0EA'; (e.currentTarget as HTMLElement).style.color = '#3A2208' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'none'; (e.currentTarget as HTMLElement).style.color = '#9A8F87' }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
          <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/>
        </svg>
        Share
      </button>

      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 49 }} onClick={() => setOpen(false)} />
          <div style={{
            position: 'absolute', bottom: '100%', right: 0, marginBottom: '6px',
            background: '#fff', borderRadius: '10px', border: '1px solid #E2DDD7',
            boxShadow: '0 8px 24px rgba(28,18,9,0.12)', zIndex: 50,
            padding: '6px', minWidth: '160px',
          }}>
            {/* Copy link */}
            <button
              onClick={copyLink}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                padding: '8px 10px', borderRadius: '7px', border: 'none',
                background: copied ? '#F0FDF4' : 'transparent', cursor: 'pointer',
                fontSize: '13px', color: copied ? '#166534' : '#3A2208', fontWeight: 500,
                transition: 'background 0.12s',
              }}
              onMouseEnter={e => { if (!copied) (e.currentTarget as HTMLElement).style.background = '#F9F6F0' }}
              onMouseLeave={e => { if (!copied) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
            >
              {copied ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                </svg>
              )}
              {copied ? 'Link copied!' : 'Copy link'}
            </button>

            <div style={{ height: '1px', background: '#F0ECE5', margin: '4px 0' }} />

            {/* Social links */}
            {shareLinks.map(s => (
              <a
                key={s.label}
                href={s.href()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '8px 10px', borderRadius: '7px',
                  fontSize: '13px', color: '#3A2208', fontWeight: 500,
                  textDecoration: 'none', transition: 'background 0.12s',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#F9F6F0'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
              >
                {s.icon}
                {s.label}
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
