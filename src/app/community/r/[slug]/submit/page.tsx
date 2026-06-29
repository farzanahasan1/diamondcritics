'use client'

import React, { useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createPost } from '@/app/community/actions'
import Link from 'next/link'
import { use } from 'react'

export default function SubmitPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [type, setType] = useState<'text' | 'link' | 'image'>('text')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  // Image upload state
  const [imagePreview, setImagePreview] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imageUploading, setImageUploading] = useState(false)
  const [imageError, setImageError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  function switchType(t: 'text' | 'link' | 'image') {
    setType(t)
    setError('')
    if (t !== 'image') {
      setImagePreview('')
      setImageUrl('')
      setImageError('')
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setImageError('')
    setImageUrl('')
    setImagePreview('')

    if (file.size > 1_048_576) {
      setImageError('Image must be under 1 MB. Please choose a smaller file.')
      e.target.value = ''
      return
    }
    if (!file.type.startsWith('image/')) {
      setImageError('Please select a valid image file (JPEG, PNG, WEBP, or GIF).')
      e.target.value = ''
      return
    }

    // Show local preview immediately
    setImagePreview(URL.createObjectURL(file))
    setImageUploading(true)

    const fd = new FormData()
    fd.append('file', file)

    try {
      const res = await fetch('/api/community/upload-image', { method: 'POST', body: fd })
      const json = await res.json()
      if (!res.ok || json.error) {
        setImageError(json.error || 'Upload failed. Please try again.')
        setImagePreview('')
      } else {
        setImageUrl(json.url)
      }
    } catch {
      setImageError('Network error. Please try again.')
      setImagePreview('')
    } finally {
      setImageUploading(false)
    }
  }

  function removeImage() {
    setImagePreview('')
    setImageUrl('')
    setImageError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleSubmit(formData: FormData) {
    formData.set('community', slug)
    formData.set('type', type)
    if (type === 'image') formData.set('image_url', imageUrl)
    startTransition(async () => {
      const result = await createPost(formData)
      if (result?.error) setError(result.error)
    })
  }

  const TABS: { key: 'text' | 'link' | 'image'; label: string; icon: React.ReactNode }[] = [
    {
      key: 'text',
      label: 'Text',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      ),
    },
    {
      key: 'link',
      label: 'Link',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
        </svg>
      ),
    },
    {
      key: 'image',
      label: 'Image',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
        </svg>
      ),
    },
  ]

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

      <div className="c-layout-submit">

        {/* ── Form card ── */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E2DDD7', overflow: 'hidden' }}>

          {/* Type tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #EDEFF1' }}>
            {TABS.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => switchType(key)}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  fontSize: '13px',
                  fontWeight: 600,
                  border: 'none',
                  borderBottom: type === key ? '2px solid #C6973E' : '2px solid transparent',
                  color: type === key ? '#C6973E' : '#9A8F87',
                  background: type === key ? 'rgba(198,151,62,0.05)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                {icon}
                {label}
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

            {/* Body */}
            {type === 'text' && (
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
            )}

            {/* URL */}
            {type === 'link' && (
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

            {/* Image upload */}
            {type === 'image' && (
              <div>
                {!imagePreview ? (
                  /* Drop zone */
                  <label
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      padding: '36px 20px',
                      border: '2px dashed #E2DDD7',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      background: '#FDFBF8',
                      transition: 'border-color 0.15s, background 0.15s',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = '#C6973E'
                      ;(e.currentTarget as HTMLElement).style.background = 'rgba(198,151,62,0.04)'
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = '#E2DDD7'
                      ;(e.currentTarget as HTMLElement).style.background = '#FDFBF8'
                    }}
                  >
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#C6973E" strokeWidth="1.5" strokeLinecap="round">
                      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
                    </svg>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: '#3A2208', marginBottom: '3px' }}>
                        Click to choose an image
                      </p>
                      <p style={{ fontSize: '12px', color: '#9A8F87' }}>
                        JPEG, PNG, WEBP, or GIF · Max 1 MB
                      </p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                  </label>
                ) : (
                  /* Preview */
                  <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', border: '1px solid #E2DDD7', background: '#F5F0EB' }}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{ width: '100%', maxHeight: '320px', objectFit: 'contain', display: 'block' }}
                    />
                    {imageUploading && (
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'rgba(28,18,9,0.45)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexDirection: 'column', gap: '10px',
                      }}>
                        <div style={{
                          width: '32px', height: '32px', borderRadius: '50%',
                          border: '3px solid rgba(255,255,255,0.3)',
                          borderTopColor: '#fff',
                          animation: 'spin 0.7s linear infinite',
                        }} />
                        <span style={{ color: '#fff', fontSize: '13px', fontWeight: 600 }}>Uploading…</span>
                      </div>
                    )}
                    {!imageUploading && imageUrl && (
                      <div style={{
                        position: 'absolute', top: '10px', right: '10px',
                        background: 'rgba(22,163,74,0.9)', borderRadius: '20px',
                        padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '5px',
                      }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                          <path d="M20 6L9 17l-5-5"/>
                        </svg>
                        <span style={{ color: '#fff', fontSize: '11px', fontWeight: 600 }}>Uploaded</span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={removeImage}
                      style={{
                        position: 'absolute', top: '10px', left: '10px',
                        background: 'rgba(28,18,9,0.65)', border: 'none', borderRadius: '20px',
                        padding: '4px 10px', color: '#fff', fontSize: '11px', fontWeight: 600,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
                      }}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M18 6L6 18M6 6l12 12"/>
                      </svg>
                      Remove
                    </button>
                  </div>
                )}

                {imageError && (
                  <p style={{ fontSize: '12px', color: '#DC2626', marginTop: '8px', fontWeight: 500 }}>{imageError}</p>
                )}
                <p style={{ fontSize: '11px', color: '#B8B0A8', marginTop: '6px' }}>
                  1 image per post · Images are removed after 90 days
                </p>

                <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
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
                disabled={isPending || imageUploading || (type === 'image' && !imageUrl)}
                style={{
                  padding: '9px 28px',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#fff',
                  background: (isPending || imageUploading || (type === 'image' && !imageUrl))
                    ? '#D4B87A'
                    : 'linear-gradient(145deg, #D4A843, #B8881E)',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: (isPending || imageUploading || (type === 'image' && !imageUrl)) ? 'not-allowed' : 'pointer',
                  opacity: (isPending || imageUploading || (type === 'image' && !imageUrl)) ? 0.7 : 1,
                  transition: 'opacity 0.15s',
                }}
              >
                {imageUploading ? 'Uploading…' : isPending ? 'Posting…' : 'Post'}
              </button>
            </div>
          </form>
        </div>

        {/* ── Sidebar ── */}
        <div className="c-sidebar" style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E2DDD7', padding: '18px' }}>
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
