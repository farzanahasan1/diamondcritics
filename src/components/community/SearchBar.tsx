'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Sync input if URL q param changes (e.g. browser back/forward)
  useEffect(() => {
    setQuery(searchParams.get('q') ?? '')
  }, [searchParams])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    router.push(`/community/search?q=${encodeURIComponent(q)}`)
  }

  return (
    <form onSubmit={handleSubmit} style={{ position: 'relative', flexShrink: 1 }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: focused ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.07)',
        border: focused ? '1px solid rgba(212,168,67,0.6)' : '1px solid rgba(255,255,255,0.1)',
        borderRadius: '8px',
        padding: '0 10px',
        gap: '7px',
        transition: 'all 0.15s',
        width: focused ? '220px' : '180px',
      }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={focused ? '#D4A843' : 'rgba(255,255,255,0.35)'} strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, transition: 'stroke 0.15s' }}>
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search community…"
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#fff',
            fontSize: '13px',
            width: '100%',
            padding: '7px 0',
            fontFamily: 'inherit',
          }}
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); inputRef.current?.focus() }}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'rgba(255,255,255,0.35)', flexShrink: 0, lineHeight: 1 }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        )}
      </div>
    </form>
  )
}
