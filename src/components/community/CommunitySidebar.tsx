import Link from 'next/link'
import type { Community } from '@/types/community'
import type { User } from '@supabase/supabase-js'

interface Props {
  communities: Community[]
  user: User | null
  activeCommunity?: Community | null
}

function fmt(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)
}

const card: React.CSSProperties = {
  background: '#ffffff',
  borderRadius: '12px',
  boxShadow: '0 1px 4px rgba(28,18,9,0.07), 0 4px 16px rgba(28,18,9,0.05)',
  overflow: 'hidden',
  marginBottom: '16px',
}

export default function CommunitySidebar({ communities, user, activeCommunity }: Props) {
  const featured = activeCommunity ?? communities[0]

  return (
    <aside style={{ width: '100%' }}>

      {featured && (
        <div style={card}>
          {/* Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #1C1209 0%, #3A2208 100%)',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
              background: 'linear-gradient(145deg, #D4A843, #B8881E)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path d="M5 2.5L2 7.5l8 10 8-10-3-5H5z" stroke="white" strokeWidth="1.4" strokeLinejoin="round"/>
                <path d="M2 7.5h16M5 2.5l2.5 5m5-5L10 7.5" stroke="white" strokeWidth="1.4" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <Link href={`/community/r/${featured.slug}`} style={{ color: '#F0D88A', fontWeight: 600, fontSize: '15px', textDecoration: 'none' }}>
                r/{featured.slug}
              </Link>
              <div style={{ color: 'rgba(240,216,138,0.5)', fontSize: '11px', marginTop: '1px' }}>Diamond Community</div>
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: '20px' }}>
            <p style={{ color: '#5A504A', fontSize: '13px', lineHeight: '1.6', marginBottom: '20px' }}>
              {featured.description}
            </p>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #EDE8E1' }}>
              {[
                { label: 'Members', value: fmt(featured.member_count) },
                { label: 'Posts', value: fmt(featured.post_count) },
              ].map(s => (
                <div key={s.label} style={{ background: '#FAF8F5', borderRadius: '8px', padding: '10px 12px' }}>
                  <div style={{ fontWeight: 700, fontSize: '20px', color: '#1C1209' }}>{s.value}</div>
                  <div style={{ fontSize: '11px', color: '#9A8F87', marginTop: '2px' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* CTA */}
            {user ? (
              <Link href={`/community/r/${featured.slug}/submit`} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                background: 'linear-gradient(145deg, #D4A843, #B8881E)',
                color: '#fff', fontWeight: 600, fontSize: '13px',
                padding: '10px 16px', borderRadius: '8px', textDecoration: 'none',
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Create Post
              </Link>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Link href="/community/register" style={{
                  display: 'block', textAlign: 'center',
                  background: 'linear-gradient(145deg, #D4A843, #B8881E)',
                  color: '#fff', fontWeight: 600, fontSize: '13px',
                  padding: '10px 16px', borderRadius: '8px', textDecoration: 'none',
                }}>
                  Join Community
                </Link>
                <Link href="/community/login" style={{
                  display: 'block', textAlign: 'center',
                  color: '#5A504A', fontWeight: 500, fontSize: '13px',
                  padding: '9px 16px', borderRadius: '8px', textDecoration: 'none',
                  border: '1.5px solid #EDE8E1',
                }}>
                  Log In
                </Link>
              </div>
            )}
          </div>

          {/* Rules */}
          {featured.rules && (
            <div style={{ borderTop: '1px solid #EDE8E1', padding: '16px 20px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: '#B0A89E', textTransform: 'uppercase', marginBottom: '12px' }}>
                Community Rules
              </div>
              <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {featured.rules.split('\n').filter(Boolean).map((rule, i) => (
                  <li key={i} style={{ display: 'flex', gap: '10px', fontSize: '13px', color: '#5A504A', lineHeight: '1.5' }}>
                    <span style={{ color: '#D4A843', fontWeight: 700, flexShrink: 0, minWidth: '16px' }}>{i + 1}.</span>
                    <span>{rule.replace(/^\d+\.\s*/, '')}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}

      {/* Expert resources */}
      <div style={card}>
        <div style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: '#B0A89E', textTransform: 'uppercase', marginBottom: '14px' }}>
            Expert Resources
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { href: '/category/round-cut-diamond', label: 'Round Diamond Guide' },
              { href: '/category/diamond-buying-guides', label: 'Diamond Buying Guides' },
              { href: '/1-carat-round-diamond-price', label: '1ct Diamond Price Guide' },
            ].map(link => (
              <Link key={link.href} href={link.href} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                color: '#D4A843', fontSize: '13px', textDecoration: 'none', fontWeight: 500,
              }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#D4A843', flexShrink: 0, display: 'inline-block' }} />
                {link.label}
              </Link>
            ))}
          </div>
          <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #EDE8E1', fontSize: '11px', color: '#C4BCB6' }}>
            Powered by DiamondCritics.com
          </div>
        </div>
      </div>

    </aside>
  )
}
