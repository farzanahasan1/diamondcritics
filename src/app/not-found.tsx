import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Not Found | Diamond Critics',
  description: 'The page you are looking for does not exist.',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '4rem 2rem',
      fontFamily: 'Georgia, serif',
    }}>
      <p style={{ fontSize: '5rem', fontWeight: 700, color: '#1a1a1a', margin: 0, lineHeight: 1 }}>404</p>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1a1a1a', margin: '1rem 0 0.5rem' }}>
        Page Not Found
      </h1>
      <p style={{ color: '#666', fontSize: '1rem', margin: '0 0 2rem', maxWidth: '400px' }}>
        This page doesn&apos;t exist. It may have been moved or the link may be incorrect.
      </p>
      <Link
        href="/"
        style={{
          display: 'inline-block',
          background: '#1a1a1a',
          color: '#fff',
          padding: '0.75rem 2rem',
          borderRadius: '4px',
          textDecoration: 'none',
          fontSize: '0.9rem',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        Back to Home
      </Link>
    </div>
  )
}
