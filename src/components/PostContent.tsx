import Link from "next/link";
import type { Post, Page, PostMeta } from "@/lib/content";

const categoryLabels: Record<string, string> = {
  "diamond-buying-guides": "Diamond Buying Guides",
  "diamond-retailer-reviews": "Retailer Reviews",
  "gemstone-guides": "Gemstone Guides",
  "market-value-price-trends": "Market & Price Trends",
};

const catShort: Record<string, string> = {
  "diamond-buying-guides": "Guide",
  "diamond-retailer-reviews": "Review",
  "gemstone-guides": "Gemstone",
  "market-value-price-trends": "Market",
};

interface Props {
  type: "post" | "page";
  data: Post | Page;
  related?: PostMeta[];
}

function estimateReadTime(html: string): number {
  const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

function BlueNileSidebar() {
  return (
    <div className="sticky top-24 space-y-6">
      <div className="border border-gray-200 p-6" style={{ background: "#fff" }}>
        <p className="text-xs tracking-widest uppercase mb-2"
          style={{ fontFamily: "var(--body)", color: "var(--muted)", letterSpacing: "0.14em" }}>
          Audited Retailer
        </p>
        <h3 className="font-light text-xl mb-1 leading-tight"
          style={{ fontFamily: "var(--heading)" }}>
          Blue Nile Diamond Search
        </h3>
        <p className="text-xs mb-1"
          style={{ fontFamily: "var(--heading)", fontStyle: "italic", color: "var(--gold)", fontSize: "0.95rem" }}>
          200,000+ GIA-certified stones
        </p>
        <p className="text-sm mb-5 leading-relaxed mt-3"
          style={{ color: "var(--muted)", fontFamily: "var(--body)" }}>
          Use filters to find eye-clean diamonds under your budget.
        </p>
        <a href="https://www.bluenile.com/diamond-search?a_aid=69d7c31a91b8d&a_cid=55e51e63&chan=blog-informational"
          target="_blank" rel="noopener noreferrer"
          className="block w-full text-white text-xs font-semibold text-center py-3.5 tracking-widest uppercase hover:opacity-80 transition-opacity mb-3"
          style={{ background: "var(--ink)", fontFamily: "var(--body)", letterSpacing: "0.14em" }}>
          Search Diamonds →
        </a>
        <p className="text-xs text-center" style={{ color: "var(--muted)", fontFamily: "var(--body)" }}>
          Affiliate link — no extra cost to you
        </p>
      </div>

      <div className="border border-gray-100 p-6">
        <p className="text-xs tracking-widest uppercase mb-4"
          style={{ fontFamily: "var(--body)", color: "var(--muted)", letterSpacing: "0.14em" }}>
          Quick Tools
        </p>
        <div className="space-y-0 divide-y divide-gray-100">
          {[
            { label: "Diamond Price Calculator", href: "/diamond-price-calculator" },
            { label: "Resale Value Calculator", href: "/diamond-resale-value-calculator" },
            { label: "Full Clarity Chart", href: "/diamond-clarity-chart" },
            { label: "Color Scale Guide", href: "/diamond-color-scale" },
          ].map((tool) => (
            <Link key={tool.href} href={tool.href}
              className="block text-sm py-2.5 hover:text-black transition-colors"
              style={{ color: "var(--muted)", fontFamily: "var(--body)" }}>
              {tool.label} →
            </Link>
          ))}
        </div>
      </div>

      <div className="p-6" style={{ background: "var(--cream)" }}>
        <p className="text-xs tracking-widest uppercase mb-3"
          style={{ fontFamily: "var(--body)", color: "var(--muted)", letterSpacing: "0.14em" }}>
          Written by
        </p>
        <p className="text-lg mb-0.5 font-light" style={{ fontFamily: "var(--heading)" }}>Farzana Hasan</p>
        <p className="text-xs mb-3"
          style={{ fontFamily: "var(--heading)", fontStyle: "italic", color: "var(--gold)" }}>
          GIA-Certified Diamond Expert
        </p>
        <p className="text-xs leading-relaxed" style={{ color: "var(--muted)", fontFamily: "var(--body)" }}>
          Skeptical, data-backed diamond analysis. No sponsored content.
        </p>
        <Link href="/about-farzana"
          className="mt-3 inline-block text-xs font-semibold tracking-widest uppercase border-b"
          style={{ fontFamily: "var(--body)", borderColor: "var(--ink)", letterSpacing: "0.14em" }}>
          Full Bio →
        </Link>
      </div>
    </div>
  );
}

export default function PostContent({ type, data, related }: Props) {
  const post = data as Post;
  const readTime = estimateReadTime(data.contentHtml);

  return (
    <>
      {/* ── Dark hero header — no featured image ─────────────── */}
      <div style={{ background: "var(--ink)" }} className="px-8 pt-16 pb-14">
        <div className="max-w-screen-xl mx-auto">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs mb-8"
            style={{ fontFamily: "var(--body)", color: "rgba(255,255,255,0.35)" }}>
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            {type === "post" && post.category && (
              <>
                <span>/</span>
                <Link href={`/category/${post.category}`} className="hover:text-white transition-colors">
                  {categoryLabels[post.category] ?? post.category}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="line-clamp-1" style={{ color: "rgba(255,255,255,0.55)" }}>{data.title}</span>
          </nav>

          {/* Category badge + read time */}
          {type === "post" && post.category && (
            <div className="flex items-center gap-4 mb-8">
              <span className="inline-block border border-gray-600 text-white text-xs font-semibold tracking-widest uppercase px-3 py-1"
                style={{ fontFamily: "var(--body)", letterSpacing: "0.16em" }}>
                {catShort[post.category] ?? post.category}
              </span>
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--body)" }}>
                {readTime} min read
              </span>
            </div>
          )}

          {/* Big white heading */}
          <h1 className="font-light text-white leading-none mb-8"
            style={{
              fontFamily: "var(--heading)",
              fontSize: "clamp(2.2rem, 5vw, 4.5rem)",
              letterSpacing: "-0.025em",
              lineHeight: 1.05,
              maxWidth: "900px",
            }}>
            {data.title}
          </h1>

          {/* Excerpt */}
          {type === "post" && post.excerpt && (
            <p className="mb-10 max-w-2xl"
              style={{
                fontFamily: "var(--body)",
                color: "rgba(255,255,255,0.6)",
                fontSize: "1.05rem",
                lineHeight: 1.75,
              }}>
              {post.excerpt}
            </p>
          )}

          {/* Divider */}
          <div className="border-t border-gray-700 mb-8" />

          {/* Author + date */}
          {type === "post" && (
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center text-sm font-semibold text-white"
                  style={{ background: "var(--gold)", fontFamily: "var(--body)" }}>
                  F
                </div>
                <div>
                  <p className="text-sm text-white font-light" style={{ fontFamily: "var(--heading)" }}>
                    Farzana Hasan
                  </p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--body)" }}>
                    GIA-Certified Diamond Expert · DiamondCritics.com
                  </p>
                </div>
              </div>
              {post.publishedAt && (
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--body)" }}>
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric", month: "long", day: "numeric"
                  })}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Article body + sidebar ───────────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-8 py-14" style={{ background: "#fff" }}>
        <div className="grid lg:grid-cols-[1fr_300px] gap-16">
          <article>
            <div className="prose-article" dangerouslySetInnerHTML={{ __html: data.contentHtml }} />

            {/* Expert verdict */}
            {type === "post" && (
              <div className="mt-16 border-t border-gray-100 pt-10">
                <p className="text-xs tracking-widest uppercase mb-4"
                  style={{ fontFamily: "var(--body)", color: "var(--muted)", letterSpacing: "0.14em" }}>
                  Expert Verdict
                </p>
                <blockquote>
                  <p>
                    Always audit the stone individually — no grade replaces seeing the actual diamond.
                    The certificate tells you what to look for. Your eyes tell you whether to buy.
                  </p>
                </blockquote>
                <p className="mt-4 text-xs"
                  style={{ fontFamily: "var(--heading)", fontStyle: "italic", color: "var(--muted)" }}>
                  — Farzana Hasan, GIA Expert · DiamondCritics.com
                </p>
              </div>
            )}

            {/* Blue Nile CTA — mobile only */}
            <div className="mt-12 lg:hidden border border-black p-6">
              <p className="text-xs tracking-widest uppercase mb-2"
                style={{ fontFamily: "var(--body)", color: "var(--muted)" }}>
                Audited Retailer
              </p>
              <h3 className="text-xl mb-4 font-light" style={{ fontFamily: "var(--heading)" }}>
                Search Blue Nile — 200,000+ GIA Diamonds
              </h3>
              <a href="https://www.bluenile.com/diamond-search?a_aid=69d7c31a91b8d&a_cid=55e51e63&chan=blog-informational"
                target="_blank" rel="noopener noreferrer"
                className="block w-full text-white text-xs font-semibold text-center py-3.5 tracking-widest uppercase hover:opacity-80 transition-opacity"
                style={{ background: "var(--ink)", fontFamily: "var(--body)" }}>
                Search Diamonds →
              </a>
            </div>
          </article>

          <aside className="hidden lg:block">
            <BlueNileSidebar />
          </aside>
        </div>

        {/* Related posts */}
        {related && related.length > 0 && (
          <section className="mt-20 pt-12 border-t border-gray-100">
            <h2 className="font-light mb-10"
              style={{ fontFamily: "var(--heading)", fontSize: "clamp(1.5rem, 3vw, 2.2rem)" }}>
              Related <em className="italic" style={{ color: "var(--gold)" }}>Guides</em>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((p) => (
                <Link key={p.slug} href={`/${p.slug}`} className="group block">
                  {p.featuredImage && (
                    <div className="aspect-[3/2] overflow-hidden mb-4" style={{ background: "#f0f0f0" }}>
                      <img src={p.featuredImage} alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
                        loading="lazy" decoding="async" />
                    </div>
                  )}
                  <p className="text-xs tracking-widest uppercase mb-2"
                    style={{ color: "var(--gold)", fontFamily: "var(--body)", letterSpacing: "0.12em" }}>
                    {categoryLabels[p.category] ?? p.category}
                  </p>
                  <h3 className="font-light leading-snug group-hover:opacity-60 transition-opacity line-clamp-2"
                    style={{ fontFamily: "var(--heading)", fontSize: "1.2rem", lineHeight: 1.3 }}>
                    {p.title}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
