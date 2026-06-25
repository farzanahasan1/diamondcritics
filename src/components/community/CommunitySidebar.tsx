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
    <aside className="space-y-4">
      {/* Featured community card */}
      {featured && (
        <div className="bg-white border border-[#EDEFF1] rounded overflow-hidden">
          <div className="h-12 bg-gradient-to-r from-[#C6973E] to-[#8B6914]" />
          <div className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">💎</span>
              <Link href={`/community/r/${featured.slug}`} className="font-bold text-gray-900 hover:underline">
                r/{featured.slug}
              </Link>
            </div>
            <p className="text-sm text-gray-600 mb-3">{featured.description}</p>
            <div className="flex gap-4 text-xs text-gray-500 mb-3">
              <div>
                <div className="font-bold text-gray-900 text-base">{formatCount(featured.member_count)}</div>
                Members
              </div>
              <div>
                <div className="font-bold text-gray-900 text-base">{formatCount(featured.post_count)}</div>
                Posts
              </div>
            </div>
            {user ? (
              <Link
                href={`/community/r/${featured.slug}/submit`}
                className="block w-full text-center bg-[#C6973E] text-white text-sm font-semibold py-2 rounded hover:bg-[#b08535] transition-colors"
              >
                + Create Post
              </Link>
            ) : (
              <Link
                href="/community/register"
                className="block w-full text-center bg-[#C6973E] text-white text-sm font-semibold py-2 rounded hover:bg-[#b08535] transition-colors"
              >
                Join Community
              </Link>
            )}
          </div>
          {featured.rules && (
            <div className="border-t border-[#EDEFF1] p-3">
              <h3 className="text-xs font-bold uppercase text-gray-500 mb-2">Community Rules</h3>
              <ol className="space-y-1">
                {featured.rules.split('\n').filter(Boolean).map((rule, i) => (
                  <li key={i} className="text-xs text-gray-700 flex gap-1.5">
                    <span className="font-bold text-[#C6973E] flex-none">{i + 1}.</span>
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
        <div className="bg-white border border-[#EDEFF1] rounded p-3">
          <h3 className="text-xs font-bold uppercase text-gray-500 mb-2">All Communities</h3>
          <ul className="space-y-1">
            {communities.map(c => (
              <li key={c.id}>
                <Link
                  href={`/community/r/${c.slug}`}
                  className="flex items-center justify-between text-sm text-gray-700 hover:text-[#C6973E] py-0.5"
                >
                  <span>r/{c.slug}</span>
                  <span className="text-xs text-gray-400">{formatCount(c.member_count)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* DiamondCritics promo */}
      <div className="bg-white border border-[#EDEFF1] rounded p-3 text-xs text-gray-500">
        <p className="font-semibold text-gray-700 mb-1">✨ Expert resources</p>
        <ul className="space-y-1">
          <li><Link href="/category/round-cut-diamond" className="text-[#C6973E] hover:underline">Round Diamond Guide</Link></li>
          <li><Link href="/category/diamond-buying-guides" className="text-[#C6973E] hover:underline">Diamond Buying Guides</Link></li>
          <li><Link href="/1-carat-round-diamond-price" className="text-[#C6973E] hover:underline">1ct Diamond Price Guide</Link></li>
        </ul>
        <p className="mt-2 text-gray-400">Powered by DiamondCritics.com</p>
      </div>
    </aside>
  )
}
