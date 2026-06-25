import Link from 'next/link'
import type { Community } from '@/types/community'
import type { User } from '@supabase/supabase-js'

interface Props {
  communities: Community[]
  user: User | null
  activeCommunity?: Community | null
}

function formatCount(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

export default function CommunitySidebar({ communities, user, activeCommunity }: Props) {
  const featured = activeCommunity ?? communities[0]

  return (
    <aside className="space-y-3">
      {/* Featured community card */}
      {featured && (
        <div className="rounded-xl overflow-hidden" style={{ background: '#fff', border: '1px solid #E2DDD7' }}>
          {/* Banner */}
          <div className="h-14 relative" style={{ background: 'linear-gradient(135deg, #18110A 0%, #3d2a0e 50%, #18110A 100%)' }}>
            <div className="absolute inset-0 flex items-center px-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #C6973E, #e8bf6a)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinejoin="round">
                    <path d="M6 3L2 9l10 12L22 9l-4-6H6z"/><path d="M2 9h20M6 3l3 6m6-6l-3 6"/>
                  </svg>
                </div>
                <Link href={`/community/r/${featured.slug}`} className="font-semibold text-sm hover:underline" style={{ color: '#f5e6c8' }}>
                  r/{featured.slug}
                </Link>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-4">
            <p className="text-sm mb-4 leading-relaxed" style={{ color: '#5a504a' }}>{featured.description}</p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4 pb-4" style={{ borderBottom: '1px solid #E2DDD7' }}>
              <div>
                <div className="text-lg font-bold" style={{ color: '#18110A', fontFamily: 'var(--font-dm), system-ui, sans-serif' }}>
                  {formatCount(featured.member_count)}
                </div>
                <div className="text-xs" style={{ color: '#9a8f87' }}>Members</div>
              </div>
              <div>
                <div className="text-lg font-bold" style={{ color: '#18110A', fontFamily: 'var(--font-dm), system-ui, sans-serif' }}>
                  {formatCount(featured.post_count)}
                </div>
                <div className="text-xs" style={{ color: '#9a8f87' }}>Posts</div>
              </div>
            </div>

            {/* CTA */}
            {user ? (
              <Link
                href={`/community/r/${featured.slug}/submit`}
                className="flex items-center justify-center gap-2 w-full text-sm font-semibold py-2 rounded-lg transition-colors"
                style={{ background: '#C6973E', color: '#fff' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Create Post
              </Link>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/community/register"
                  className="flex items-center justify-center w-full text-sm font-semibold py-2 rounded-lg"
                  style={{ background: '#C6973E', color: '#fff' }}
                >
                  Join Community
                </Link>
                <Link
                  href="/community/login"
                  className="flex items-center justify-center w-full text-sm font-medium py-2 rounded-lg"
                  style={{ background: 'transparent', color: '#5a504a', border: '1px solid #E2DDD7' }}
                >
                  Log In
                </Link>
              </div>
            )}
          </div>

          {/* Rules */}
          {featured.rules && (
            <div className="px-4 pb-4" style={{ borderTop: '1px solid #E2DDD7', paddingTop: '1rem' }}>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#9a8f87' }}>Community Rules</h3>
              <ol className="space-y-2">
                {featured.rules.split('\n').filter(Boolean).map((rule, i) => (
                  <li key={i} className="flex gap-2.5 text-xs" style={{ color: '#5a504a' }}>
                    <span className="font-bold shrink-0 mt-0.5" style={{ color: '#C6973E' }}>{i + 1}.</span>
                    <span>{rule.replace(/^\d+\.\s*/, '')}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}

      {/* All communities */}
      {communities.length > 1 && (
        <div className="rounded-xl p-4" style={{ background: '#fff', border: '1px solid #E2DDD7' }}>
          <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#9a8f87' }}>Communities</h3>
          <ul className="space-y-1">
            {communities.map(c => (
              <li key={c.id}>
                <Link
                  href={`/community/r/${c.slug}`}
                  className="flex items-center justify-between text-sm py-1 transition-colors"
                  style={{ color: '#3d2a0e' }}
                >
                  <span className="font-medium">r/{c.slug}</span>
                  <span className="text-xs" style={{ color: '#9a8f87' }}>{formatCount(c.member_count)} members</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Expert resources */}
      <div className="rounded-xl p-4" style={{ background: '#fff', border: '1px solid #E2DDD7' }}>
        <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#9a8f87' }}>Expert Resources</h3>
        <ul className="space-y-2">
          {[
            { href: '/category/round-cut-diamond', label: 'Round Diamond Guide' },
            { href: '/category/diamond-buying-guides', label: 'Diamond Buying Guides' },
            { href: '/1-carat-round-diamond-price', label: '1ct Diamond Price Guide' },
          ].map(link => (
            <li key={link.href}>
              <Link href={link.href} className="flex items-center gap-2 text-sm transition-colors" style={{ color: '#C6973E' }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L9.09 8.26L2 9.27l5 4.87-1.18 6.88L12 17.77l6.18 3.25L17 14.14 22 9.27l-7.09-1.01L12 2z"/></svg>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <p className="text-xs mt-3 pt-3" style={{ color: '#c4bdb8', borderTop: '1px solid #E2DDD7' }}>Powered by DiamondCritics.com</p>
      </div>
    </aside>
  )
}
