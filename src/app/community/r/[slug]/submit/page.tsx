'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createPost } from '@/app/community/actions'
import Link from 'next/link'
import { use } from 'react'

export default function SubmitPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [type, setType] = useState<'text' | 'link'>('text')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    formData.set('community', slug)
    formData.set('type', type)
    startTransition(async () => {
      const result = await createPost(formData)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>
      {/* Page header */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontFamily: 'var(--font-ivy, Georgia, serif)', fontSize: '22px', fontWeight: 600, color: '#1C1209', marginBottom: '4px' }}>
          Create a Post
        </h1>
        <p style={{ fontSize: '13px', color: '#9A8F87' }}>
          Posting in{' '}
          <Link href={`/community/r/${slug}`} style={{ color: '#C6973E', fontWeight: 600, textDecoration: 'none' }}>
            r/{slug}
          </Link>
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 272px', gap: '16px', alignItems: 'start' }}>

        {/* ── Form card ── */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E2DDD7', overflow: 'hidden' }}>

          {/* Type tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #EDEFF1' }}>
            {(['text', 'link'] as const).map(t => (
              <button
                key={t}
                onClick={() => setType(t)}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  fontSize: '13px',
                  fontWeight: 600,
                  border: 'none',
                  borderBottom: type === t ? '2px solid #C6973E' : '2px solid transparent',
                  color: type === t ? '#C6973E' : '#9A8F87',
                  background: type === t ? 'rgba(198,151,62,0.05)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                {t === 'text' ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Text
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
                    </svg>
                    Link
                  </>
                )}
              </button>
            ))}
          </div>

          <form action={handleSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Title */}
            <div>
              <input
                name="title"
                type="text"
                placeholder="Title"
                required
                maxLength={300}
                style={{
                  width: '100%',
                  border: '1px solid #E2DDD7',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  fontSize: '15px',
                  fontWeight: 500,
                  color: '#1C1209',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.15s',
                }}
                onFocus={e => (e.target.style.borderColor = '#C6973E')}
                onBlur={e => (e.target.style.borderColor = '#E2DDD7')}
              />
              <p style={{ fontSize: '11px', color: '#B8B0A8', marginTop: '4px' }}>300 characters max</p>
            </div>

            {/* Body / URL */}
            {type === 'text' ? (
              <textarea
                name="body"
                placeholder="Share your question or thoughts… (optional)"
                rows={10}
                style={{
                  width: '100%',
                  border: '1px solid #E2DDD7',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  fontSize: '14px',
                  color: '#1C1209',
                  resize: 'vertical',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  lineHeight: 1.6,
                  transition: 'border-color 0.15s',
                }}
                onFocus={e => (e.target.style.borderColor = '#C6973E')}
                onBlur={e => (e.target.style.borderColor = '#E2DDD7')}
              />
            ) : (
              <div>
                <input
                  name="url"
                  type="url"
                  placeholder="https://…"
                  required
                  style={{
                    width: '100%',
                    border: '1px solid #E2DDD7',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    fontSize: '14px',
                    color: '#1C1209',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                    transition: 'border-color 0.15s',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#C6973E')}
                  onBlur={e => (e.target.style.borderColor = '#E2DDD7')}
                />
                <p style={{ fontSize: '11px', color: '#B8B0A8', marginTop: '4px' }}>Paste a full URL including https://</p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div style={{ padding: '10px 14px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', fontSize: '13px', color: '#DC2626' }}>
                {error}
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '6px', borderTop: '1px solid #F5F0EB' }}>
              <button
                type="button"
                onClick={() => router.back()}
                style={{
                  padding: '9px 20px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#7A6F66',
                  background: 'transparent',
                  border: '1px solid #E2DDD7',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                style={{
                  padding: '9px 28px',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#fff',
                  background: isPending ? '#D4B87A' : 'linear-gradient(145deg, #D4A843, #B8881E)',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: isPending ? 'not-allowed' : 'pointer',
                  opacity: isPending ? 0.7 : 1,
                  transition: 'opacity 0.15s',
                }}
              >
                {isPending ? 'Posting…' : 'Post'}
              </button>
            </div>
          </form>
        </div>

        {/* ── Sidebar ── */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E2DDD7', padding: '18px' }}>
          <h3 style={{ fontFamily: 'var(--font-ivy, Georgia, serif)', fontSize: '15px', fontWeight: 600, color: '#1C1209', marginBottom: '14px' }}>
            Posting guidelines
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              ['Be specific', 'Include carat weight, shape, and the specific question you have.'],
              ['Add grades', 'Cut, color, and clarity grades help members give accurate advice.'],
              ['GIA/IGI reports', 'Share your report number for verification or authenticity questions.'],
              ['No self-promotion', 'No spam, dealer advertising, or retailer referral links.'],
              ['Be respectful', 'This community helps real buyers — treat every question with care.'],
            ].map(([title, desc], i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '22px', height: '22px', borderRadius: '50%',
                  background: 'linear-gradient(145deg, #F5EDD8, #EDD8AA)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, marginTop: '1px',
                }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#B8881E' }}>{i + 1}</span>
                </div>
                <div>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: '#2D2318', marginBottom: '2px' }}>{title}</p>
                  <p style={{ fontSize: '12px', color: '#7A6F66', lineHeight: 1.5 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
