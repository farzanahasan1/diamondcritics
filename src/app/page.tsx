import Link from "next/link";
import { getAllPosts } from "@/lib/content";

const catLabel: Record<string, string> = {
  "diamond-buying-guides": "Buying Guide",
  "diamond-retailer-reviews": "Retailer Review",
  "gemstone-guides": "Gemstone",
  "market-value-price-trends": "Market & Price",
};

export default function HomePage() {
  const posts = getAllPosts();
  const hero = posts[0];
  const sidebar = posts.slice(1, 5);
  const grid = posts.slice(5, 13);

  return (
    <div style={{ background: "var(--cream)" }} className="min-h-screen">

      {/* ── Announcement bar ─────────────────────────────────── */}
      <div className="border-b border-gray-300 py-2 px-8" style={{ background: "#f0ede8" }}>
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <span className="text-xs tracking-widest uppercase hidden sm:block"
            style={{ fontFamily: "var(--body)", color: "var(--muted)", letterSpacing: "0.12em" }}>
            Expert Diamond Analysis · GIA-Backed · No Sponsored Content
          </span>
          <a href="https://www.bluenile.com/diamond-search?a_aid=69d7c31a91b8d&a_cid=55e51e63&chan=blog-informational"
            target="_blank" rel="noopener noreferrer"
            className="text-xs tracking-widest uppercase ml-auto sm:ml-0 hover:text-black transition-colors"
            style={{ fontFamily: "var(--body)", color: "var(--muted)", letterSpacing: "0.12em" }}>
            Shop Blue Nile — Up to 40% Less →
          </a>
        </div>
      </div>

      {/* ── Hero section ─────────────────────────────────────── */}
      {hero && (
        <section className="max-w-screen-xl mx-auto px-8 pt-16 pb-12">

          {/* Big number + category overline */}
          <div className="flex items-start gap-12 mb-3">
            <span className="text-sm font-light hidden lg:block"
              style={{ fontFamily: "var(--body)", color: "var(--muted)", minWidth: "2rem" }}>01</span>
            <div className="flex items-center gap-3">
              <span className="block w-8 h-px" style={{ background: "var(--ink)" }} />
              <p className="text-xs tracking-widest uppercase"
                style={{ fontFamily: "var(--body)", color: "var(--ink)", letterSpacing: "0.16em" }}>
                {catLabel[hero.category] ?? hero.category}
              </p>
            </div>
          </div>

          {/* Massive display headline */}
          <div className="pl-0 lg:pl-14 mb-10">
            <h1 className="font-light leading-none mb-0"
              style={{
                fontFamily: "var(--heading)",
                fontSize: "clamp(4rem, 10vw, 9rem)",
                letterSpacing: "-0.03em",
                lineHeight: 0.95,
                color: "var(--ink)",
              }}>
              {hero.title.split(":")[0]}
            </h1>
          </div>

          {/* Image left + text right */}
          <div className="pl-0 lg:pl-14 grid lg:grid-cols-[480px_1fr] gap-12 items-start">
            <div className="relative">
              {hero.featuredImage ? (
                <img src={hero.featuredImage} alt={hero.title}
                  className="w-full aspect-[4/3] object-cover"
                  fetchPriority="high" decoding="async" />
              ) : (
                <div className="w-full aspect-[4/3]" style={{ background: "#ddd" }} />
              )}
            </div>

            <div className="pt-2">
              <h2 className="font-light mb-6 leading-tight"
                style={{
                  fontFamily: "var(--heading)",
                  fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)",
                  color: "var(--ink)",
                }}>
                {hero.title}
              </h2>
              {hero.excerpt && (
                <p className="leading-relaxed mb-8"
                  style={{ fontFamily: "var(--body)", color: "#555", fontSize: "0.95rem", lineHeight: 1.8 }}>
                  {hero.excerpt}
                </p>
              )}
              <Link href={`/${hero.slug}`}
                className="inline-flex items-center gap-3 text-xs font-semibold tracking-widest uppercase px-8 py-4 text-white hover:opacity-80 transition-opacity"
                style={{ background: "var(--ink)", fontFamily: "var(--body)", letterSpacing: "0.18em" }}>
                Read the Full Audit
              </Link>
              <p className="mt-5 text-xs"
                style={{ fontFamily: "var(--heading)", fontStyle: "italic", color: "var(--muted)", fontSize: "0.95rem" }}>
                — An independent audit by Farzana
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ── Divider ──────────────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-8">
        <div className="border-t border-gray-300" />
      </div>

      {/* ── Next Articles sidebar-style row ──────────────────── */}
      {sidebar.length > 0 && (
        <section className="max-w-screen-xl mx-auto px-8 py-12">
          <div className="grid lg:grid-cols-[1fr_320px] gap-12">

            {/* Left: 3-col post grid */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <span className="block w-8 h-px" style={{ background: "var(--ink)" }} />
                <p className="text-xs tracking-widest uppercase"
                  style={{ fontFamily: "var(--body)", color: "var(--ink)", letterSpacing: "0.16em" }}>
                  Latest Audits
                </p>
              </div>
              <div className="grid sm:grid-cols-3 gap-8">
                {sidebar.slice(0, 3).map((p) => (
                  <Link key={p.slug} href={`/${p.slug}`} className="group block">
                    <div className="aspect-[3/2] overflow-hidden mb-4" style={{ background: "#ddd" }}>
                      {p.featuredImage && (
                        <img src={p.featuredImage} alt={p.title}
                          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
                          loading="lazy" decoding="async" />
                      )}
                    </div>
                    <p className="text-xs tracking-widest uppercase mb-2"
                      style={{ fontFamily: "var(--body)", color: "var(--muted)", letterSpacing: "0.12em" }}>
                      {catLabel[p.category] ?? p.category}
                    </p>
                    <h3 className="font-light leading-snug group-hover:opacity-60 transition-opacity line-clamp-2"
                      style={{ fontFamily: "var(--heading)", fontSize: "1.25rem", lineHeight: 1.25, color: "var(--ink)" }}>
                      {p.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>

            {/* Right: next articles list */}
            <div className="border-l border-gray-300 pl-10 hidden lg:block">
              <div className="flex items-center justify-between mb-6">
                <p className="text-xs tracking-widest uppercase font-semibold"
                  style={{ fontFamily: "var(--body)", color: "var(--ink)", letterSpacing: "0.18em" }}>
                  Next Articles
                </p>
                <Link href="/category/diamond-buying-guides"
                  className="text-xs" style={{ fontFamily: "var(--body)", color: "var(--muted)" }}>→</Link>
              </div>
              <div className="space-y-0 divide-y divide-gray-200">
                {sidebar.map((p) => (
                  <Link key={p.slug} href={`/${p.slug}`}
                    className="group flex items-center gap-4 py-4 hover:opacity-70 transition-opacity">
                    <div className="shrink-0 w-14 h-14 overflow-hidden" style={{ background: "#ddd" }}>
                      {p.featuredImage && (
                        <img src={p.featuredImage} alt={p.title}
                          className="w-full h-full object-cover" loading="lazy" decoding="async" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs tracking-widest uppercase mb-1"
                        style={{ fontFamily: "var(--body)", color: "var(--muted)", letterSpacing: "0.12em" }}>
                        {catLabel[p.category] ?? p.category}
                      </p>
                      <p className="font-light text-sm leading-tight line-clamp-2"
                        style={{ fontFamily: "var(--heading)", color: "var(--ink)", lineHeight: 1.3 }}>
                        {p.title}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Dark: Expert Audits ───────────────────────────────── */}
      <section className="py-20 px-8" style={{ background: "var(--ink)" }}>
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs tracking-widest uppercase mb-3"
                style={{ color: "var(--muted)", fontFamily: "var(--body)", letterSpacing: "0.16em" }}>
                Technical Audits
              </p>
              <h2 className="font-light text-white"
                style={{ fontFamily: "var(--heading)", fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>
                Expert Diamond{" "}
                <em className="italic" style={{ color: "var(--gold)" }}>Audits</em>
              </h2>
            </div>
            <Link href="/category/diamond-buying-guides"
              className="hidden sm:block text-xs tracking-widest uppercase border-b pb-0.5 transition-colors"
              style={{ color: "var(--muted)", borderColor: "var(--muted)", fontFamily: "var(--body)" }}>
              All Guides →
            </Link>
          </div>
          <div className="grid sm:grid-cols-3 gap-px" style={{ background: "#333" }}>
            {[
              { label: "Mastering the 4Cs", sub: "Carat · Cut · Color · Clarity", href: "/diamond-4cs", img: "/images/infographic-for-diamond-4c-clarity.avif" },
              { label: "Diamond Prices & Trends", sub: "2026 market data, crash analysis", href: "/diamond-prices", img: "/images/diamond-prices-2026-march-market-crash-report.avif" },
              { label: "Clarity Grade Audits", sub: "FL through SI — what to actually buy", href: "/diamond-clarity-chart", img: "/images/diamond-clarity-chart-beware-clouds-not-shown-milky.avif" },
            ].map((card) => (
              <Link key={card.href} href={card.href}
                className="relative group block overflow-hidden aspect-[4/3]"
                style={{ background: "#1a1a1a" }}>
                {card.img && (
                  <img src={card.img} alt={card.label}
                    className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-500"
                    loading="lazy" decoding="async" />
                )}
                <div className="relative h-full flex flex-col justify-end p-8">
                  <p className="text-xs tracking-widest uppercase mb-2"
                    style={{ color: "var(--gold)", fontFamily: "var(--body)" }}>{card.sub}</p>
                  <h3 className="font-light text-white leading-tight"
                    style={{ fontFamily: "var(--heading)", fontSize: "1.6rem" }}>{card.label}</h3>
                  <p className="mt-3 text-xs"
                    style={{ fontFamily: "var(--heading)", fontStyle: "italic", color: "rgba(255,255,255,0.4)" }}>
                    Read the audit →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Where to Buy ─────────────────────────────────────── */}
      <section className="py-20 px-8 border-b border-gray-300" style={{ background: "var(--cream)" }}>
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center gap-4 mb-3">
            <span className="block w-8 h-px" style={{ background: "var(--ink)" }} />
            <p className="text-xs tracking-widest uppercase"
              style={{ fontFamily: "var(--body)", color: "var(--muted)", letterSpacing: "0.16em" }}>
              Verified Retailer
            </p>
          </div>
          <h2 className="font-light mb-2"
            style={{ fontFamily: "var(--heading)", fontSize: "clamp(2.5rem, 5vw, 4rem)", lineHeight: 1 }}>
            Where to Buy <em className="italic" style={{ color: "var(--gold)" }}>in 2026</em>
          </h2>
          <p className="mb-12" style={{ fontFamily: "var(--heading)", fontStyle: "italic", color: "var(--muted)", fontSize: "1.05rem" }}>
            Based on price, selection &amp; verified customer experience
          </p>
          <div className="border-t border-b border-gray-300 divide-y divide-gray-200">
            <div className="grid grid-cols-4 py-3 gap-4">
              {["Retailer", "Verdict", "Best For", ""].map((h) => (
                <span key={h} className="text-xs tracking-widest uppercase"
                  style={{ color: "var(--muted)", fontFamily: "var(--body)", letterSpacing: "0.12em" }}>{h}</span>
              ))}
            </div>
            <div className="grid grid-cols-4 items-center py-7 gap-4">
              <span className="font-light" style={{ fontFamily: "var(--heading)", fontSize: "2rem" }}>Blue Nile</span>
              <div>
                <span className="text-xs font-semibold tracking-wide text-green-700">4.6 / 5</span>
                <p className="text-xs mt-0.5"
                  style={{ fontFamily: "var(--heading)", fontStyle: "italic", color: "var(--muted)" }}>
                  Trusted Original
                </p>
              </div>
              <span className="text-sm" style={{ color: "var(--muted)", fontFamily: "var(--body)" }}>Inventory Depth</span>
              <a href="https://www.bluenile.com/diamond-search?a_aid=69d7c31a91b8d&a_cid=55e51e63&chan=blue_nile_reviews"
                target="_blank" rel="noopener noreferrer"
                className="text-xs font-semibold tracking-widest uppercase px-5 py-3 text-white text-center hover:opacity-80 transition-opacity w-fit"
                style={{ background: "var(--ink)", fontFamily: "var(--body)" }}>
                Full Audit
              </a>
            </div>
          </div>
          <div className="mt-8">
            <Link href="/blue-nile-review"
              className="text-xs tracking-widest uppercase border-b pb-0.5 hover:opacity-60 transition-opacity"
              style={{ fontFamily: "var(--body)", borderColor: "var(--ink)", letterSpacing: "0.14em" }}>
              View All Retailer Reviews →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Knowledge Hub ────────────────────────────────────── */}
      {grid.length > 0 && (
        <section className="max-w-screen-xl mx-auto px-8 py-20">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-4 mb-3">
                <span className="block w-8 h-px" style={{ background: "var(--ink)" }} />
                <p className="text-xs tracking-widest uppercase"
                  style={{ fontFamily: "var(--body)", color: "var(--muted)", letterSpacing: "0.16em" }}>
                  Learn &amp; Compare
                </p>
              </div>
              <h2 className="font-light"
                style={{ fontFamily: "var(--heading)", fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: 1 }}>
                Knowledge <em className="italic" style={{ color: "var(--gold)" }}>Hub</em>
              </h2>
            </div>
            <Link href="/category/diamond-buying-guides"
              className="hidden sm:block text-xs tracking-widest uppercase border-b pb-0.5 hover:opacity-60 transition-opacity"
              style={{ fontFamily: "var(--body)", color: "var(--muted)", borderColor: "var(--muted)" }}>
              All Guides →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {grid.map((p) => (
              <Link key={p.slug} href={`/${p.slug}`} className="group block">
                <div className="aspect-[3/2] overflow-hidden mb-4" style={{ background: "#ddd" }}>
                  {p.featuredImage && (
                    <img src={p.featuredImage} alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
                      loading="lazy" decoding="async" />
                  )}
                </div>
                <p className="text-xs tracking-widest uppercase mb-2"
                  style={{ color: "var(--muted)", fontFamily: "var(--body)", letterSpacing: "0.12em" }}>
                  {catLabel[p.category] ?? p.category}
                </p>
                <h3 className="font-light leading-snug group-hover:opacity-60 transition-opacity line-clamp-2"
                  style={{ fontFamily: "var(--heading)", fontSize: "1.15rem", lineHeight: 1.3, color: "var(--ink)" }}>
                  {p.title}
                </h3>
              </Link>
            ))}
          </div>
          <div className="text-center mt-14">
            <Link href="/category/diamond-buying-guides"
              className="inline-block text-xs font-semibold tracking-widest uppercase border border-black px-10 py-4 hover:bg-black hover:text-white transition-colors"
              style={{ fontFamily: "var(--body)", letterSpacing: "0.16em" }}>
              View All Buying Guides
            </Link>
          </div>
        </section>
      )}

      {/* ── Bottom CTA ───────────────────────────────────────── */}
      <div className="py-14 px-8 border-t border-gray-300" style={{ background: "#f0ede8" }}>
        <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="font-light mb-1"
              style={{ fontFamily: "var(--heading)", fontSize: "clamp(1.5rem, 3vw, 2.2rem)" }}>
              Ready to find your{" "}
              <em className="italic" style={{ color: "var(--gold)" }}>perfect diamond?</em>
            </h3>
            <p className="text-sm" style={{ fontFamily: "var(--heading)", fontStyle: "italic", color: "var(--muted)" }}>
              We recommend Blue Nile — 40% less than mall jewellers, GIA-certified.
            </p>
          </div>
          <a href="https://www.bluenile.com/diamond-search?a_aid=69d7c31a91b8d&a_cid=55e51e63&chan=homepage-cta"
            target="_blank" rel="noopener noreferrer"
            className="shrink-0 text-xs font-semibold tracking-widest uppercase px-8 py-4 text-white hover:opacity-80 transition-opacity"
            style={{ background: "var(--ink)", fontFamily: "var(--body)", letterSpacing: "0.16em" }}>
            Shop Blue Nile →
          </a>
        </div>
      </div>

    </div>
  );
}
