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
  const secondaries = posts.slice(1, 4);
  const grid = posts.slice(4, 12);

  return (
    <>
      {/* ── Top bar ──────────────────────────────────────────── */}
      <div
        className="border-b border-gray-200 py-2.5 px-6"
        style={{ background: "var(--cream)" }}
      >
        <div
          className="max-w-screen-xl mx-auto flex items-center justify-between text-xs"
          style={{ fontFamily: "var(--body)", color: "var(--muted)", letterSpacing: "0.1em" }}
        >
          <span className="uppercase tracking-widest hidden sm:flex items-center gap-2">
            <em style={{ fontFamily: "var(--heading)", fontSize: "0.9rem", fontStyle: "italic", letterSpacing: 0 }}>Expert</em>
            <span>Diamond Analysis · GIA-Backed · No Sponsored Content</span>
          </span>
          <a
            href="https://www.bluenile.com/diamond-search?a_aid=69d7c31a91b8d&a_cid=55e51e63&chan=blog-informational"
            target="_blank"
            rel="noopener noreferrer"
            className="uppercase tracking-widest hover:text-black transition-colors ml-auto sm:ml-0"
          >
            Shop Blue Nile — Up to 40% Less →
          </a>
        </div>
      </div>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-6 sm:px-8 pt-16 pb-12 border-b border-gray-200">
        {hero ? (
          <div className="grid lg:grid-cols-[1fr_480px] gap-12 lg:gap-20 items-center">
            <div>
              {hero.category && (
                <div className="flex items-center gap-3 mb-6">
                  <span className="block w-8 h-px" style={{ background: "var(--gold)" }} />
                  <p
                    className="text-xs font-semibold tracking-widest uppercase"
                    style={{ color: "var(--gold)", fontFamily: "var(--body)" }}
                  >
                    {catLabel[hero.category] ?? hero.category}
                  </p>
                </div>
              )}
              <h1
                className="font-light leading-none mb-4"
                style={{
                  fontFamily: "var(--heading)",
                  fontSize: "clamp(2.6rem, 5.5vw, 4.8rem)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.08,
                }}
              >
                {hero.title}
              </h1>
              <p
                className="mb-7 text-sm"
                style={{
                  fontFamily: "var(--heading)",
                  fontStyle: "italic",
                  color: "var(--muted)",
                  fontSize: "1.15rem",
                  lineHeight: 1.5,
                }}
              >
                — An independent audit by{" "}
                <span style={{ color: "var(--ink)" }}>Farzana</span>
              </p>
              {hero.excerpt && (
                <p
                  className="text-base leading-relaxed mb-8 max-w-lg"
                  style={{ color: "var(--muted)", fontFamily: "var(--body)" }}
                >
                  {hero.excerpt}
                </p>
              )}
              <Link
                href={`/${hero.slug}`}
                className="inline-flex items-center gap-3 text-xs font-semibold tracking-widest uppercase border-b border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors"
                style={{ fontFamily: "var(--body)" }}
              >
                Read the Full Audit
              </Link>
            </div>
            <div className="relative">
              {hero.featuredImage ? (
                <img
                  src={hero.featuredImage}
                  alt={hero.title}
                  className="w-full aspect-[4/3] object-cover"
                  style={{ filter: "contrast(1.02)" }}
                />
              ) : (
                <div className="w-full aspect-[4/3] bg-gray-100 flex items-center justify-center">
                  <span
                    className="text-6xl"
                    style={{ fontFamily: "var(--heading)", color: "var(--border)", fontStyle: "italic" }}
                  >
                    ◆
                  </span>
                </div>
              )}
              {hero.featuredImage && (
                <div className="absolute -bottom-4 -left-4 w-24 h-24 border border-gray-200 -z-10 hidden lg:block" />
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <h1 style={{ fontFamily: "var(--heading)", fontSize: "4rem" }}>
              Diamond <em className="italic" style={{ color: "var(--gold)" }}>Critics</em>
            </h1>
          </div>
        )}
      </section>

      {/* ── Three secondary posts ─────────────────────────────── */}
      {secondaries.length > 0 && (
        <section className="max-w-screen-xl mx-auto px-6 sm:px-8 py-12 border-b border-gray-200">
          <div className="grid sm:grid-cols-3 gap-8 lg:gap-12">
            {secondaries.map((p) => (
              <Link key={p.slug} href={`/${p.slug}`} className="group block">
                <div className="aspect-[3/2] overflow-hidden bg-gray-100 mb-5">
                  {p.featuredImage ? (
                    <img
                      src={p.featuredImage}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full" style={{ background: "var(--cream)" }} />
                  )}
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="block w-5 h-px" style={{ background: "var(--gold)" }} />
                  <p
                    className="text-xs font-semibold tracking-widest uppercase"
                    style={{ color: "var(--gold)", fontFamily: "var(--body)" }}
                  >
                    {catLabel[p.category] ?? p.category}
                  </p>
                </div>
                <h2
                  className="font-light leading-snug group-hover:opacity-60 transition-opacity line-clamp-2"
                  style={{
                    fontFamily: "var(--heading)",
                    fontSize: "clamp(1.2rem, 2vw, 1.5rem)",
                    lineHeight: 1.2,
                  }}
                >
                  {p.title}
                </h2>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Pull quote strip ─────────────────────────────────── */}
      <div
        className="py-10 px-6 border-b border-gray-200"
        style={{ background: "var(--cream)" }}
      >
        <div className="max-w-screen-xl mx-auto text-center">
          <p
            style={{
              fontFamily: "var(--heading)",
              fontStyle: "italic",
              fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)",
              color: "var(--ink)",
              lineHeight: 1.5,
              letterSpacing: "-0.01em",
            }}
          >
            "The difference between a good diamond and a great one is invisible to most —
            <span style={{ color: "var(--gold)" }}> our audits make it visible."</span>
          </p>
          <p
            className="mt-3 text-xs tracking-widest uppercase"
            style={{ fontFamily: "var(--body)", color: "var(--muted)" }}
          >
            — Farzana, Founder &amp; Lead Analyst
          </p>
        </div>
      </div>

      {/* ── Dark: Expert Audits ───────────────────────────────── */}
      <section className="py-24 px-6 sm:px-8" style={{ background: "var(--ink)" }}>
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-end justify-between mb-14">
            <div>
              <p
                className="text-xs tracking-widest uppercase mb-3"
                style={{ color: "var(--muted)", fontFamily: "var(--body)" }}
              >
                Technical Audits
              </p>
              <h2
                className="font-light text-white"
                style={{ fontFamily: "var(--heading)", fontSize: "clamp(2rem, 4vw, 3.2rem)" }}
              >
                Expert Diamond{" "}
                <em className="italic" style={{ color: "var(--gold)" }}>
                  Audits
                </em>
              </h2>
            </div>
            <Link
              href="/category/diamond-buying-guides"
              className="hidden sm:block text-xs tracking-widest uppercase border-b pb-0.5 transition-colors"
              style={{ color: "var(--muted)", borderColor: "var(--muted)", fontFamily: "var(--body)" }}
            >
              All Guides →
            </Link>
          </div>

          <div className="grid sm:grid-cols-3 gap-px" style={{ background: "#333" }}>
            {[
              {
                label: "Mastering the 4Cs",
                sub: "Carat · Cut · Color · Clarity",
                href: "/diamond-4cs",
                img: "/images/infographic-for-diamond-4c-clarity.jpg",
              },
              {
                label: "Diamond Prices & Trends",
                sub: "2026 market data, crash analysis",
                href: "/diamond-prices",
                img: "/images/diamond-prices-2026-march-market-crash-report.jpg",
              },
              {
                label: "Clarity Grade Audits",
                sub: "FL through SI — what to actually buy",
                href: "/diamond-clarity-chart",
                img: "/images/diamond-clarity-chart-beware-clouds-not-shown-milky.jpg",
              },
            ].map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="relative group block overflow-hidden aspect-[4/3]"
                style={{ background: "#1a1a1a" }}
              >
                {card.img && (
                  <img
                    src={card.img}
                    alt={card.label}
                    className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-45 transition-opacity duration-500"
                  />
                )}
                <div className="relative h-full flex flex-col justify-end p-8">
                  <p
                    className="text-xs tracking-widest uppercase mb-2"
                    style={{ color: "var(--gold)", fontFamily: "var(--body)" }}
                  >
                    {card.sub}
                  </p>
                  <h3
                    className="font-light text-white leading-tight"
                    style={{ fontFamily: "var(--heading)", fontSize: "1.6rem" }}
                  >
                    {card.label}
                  </h3>
                  <p
                    className="mt-3 text-xs"
                    style={{
                      fontFamily: "var(--heading)",
                      fontStyle: "italic",
                      color: "rgba(255,255,255,0.4)",
                    }}
                  >
                    Read the audit →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Where to Buy ─────────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-6 sm:px-8 py-24 border-b border-gray-200">
        <div className="max-w-3xl mx-auto">
          <p
            className="text-xs tracking-widest uppercase mb-4 text-center"
            style={{ color: "var(--muted)", fontFamily: "var(--body)" }}
          >
            Verified Retailer
          </p>
          <h2
            className="font-light text-center mb-2"
            style={{ fontFamily: "var(--heading)", fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            Where to Buy <em className="italic" style={{ color: "var(--gold)" }}>in 2026</em>
          </h2>
          <p
            className="text-center mb-14 text-sm"
            style={{
              fontFamily: "var(--heading)",
              fontStyle: "italic",
              color: "var(--muted)",
              fontSize: "1.05rem",
            }}
          >
            Based on price, selection &amp; verified customer experience
          </p>

          <div className="border-t border-b border-gray-200 divide-y divide-gray-100">
            <div className="grid grid-cols-4 py-3 gap-4">
              {["Retailer", "Verdict", "Best For", ""].map((h) => (
                <span
                  key={h}
                  className="text-xs tracking-widest uppercase"
                  style={{ color: "var(--muted)", fontFamily: "var(--body)" }}
                >
                  {h}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-4 items-center py-7 gap-4">
              <span
                className="font-light"
                style={{ fontFamily: "var(--heading)", fontSize: "1.8rem" }}
              >
                Blue Nile
              </span>
              <div>
                <span className="text-xs font-semibold tracking-wide text-green-700">4.6 / 5</span>
                <p
                  className="text-xs mt-0.5"
                  style={{
                    color: "var(--muted)",
                    fontFamily: "var(--heading)",
                    fontStyle: "italic",
                  }}
                >
                  Trusted Original
                </p>
              </div>
              <span
                className="text-sm"
                style={{ color: "var(--muted)", fontFamily: "var(--body)" }}
              >
                Inventory Depth
              </span>
              <a
                href="https://www.bluenile.com/diamond-search?a_aid=69d7c31a91b8d&a_cid=55e51e63&chan=blue_nile_reviews"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold tracking-widest uppercase px-5 py-3 text-white text-center hover:opacity-80 transition-opacity w-fit"
                style={{ background: "var(--ink)", fontFamily: "var(--body)" }}
              >
                Full Audit
              </a>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              href="/blue-nile-review"
              className="text-xs tracking-widest uppercase border-b pb-0.5 hover:text-gray-500 transition-colors"
              style={{ fontFamily: "var(--body)", borderColor: "var(--ink)" }}
            >
              View All Retailer Reviews →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Knowledge Hub ────────────────────────────────────── */}
      {grid.length > 0 && (
        <section className="max-w-screen-xl mx-auto px-6 sm:px-8 py-24">
          <div className="flex items-end justify-between mb-14">
            <div>
              <p
                className="text-xs tracking-widest uppercase mb-2"
                style={{ fontFamily: "var(--body)", color: "var(--muted)" }}
              >
                Learn &amp; Compare
              </p>
              <h2
                className="font-light"
                style={{ fontFamily: "var(--heading)", fontSize: "clamp(2rem, 4vw, 3rem)" }}
              >
                Knowledge <em className="italic" style={{ color: "var(--gold)" }}>Hub</em>
              </h2>
            </div>
            <Link
              href="/category/diamond-buying-guides"
              className="hidden sm:block text-xs tracking-widest uppercase border-b pb-0.5 hover:text-gray-400 transition-colors"
              style={{ fontFamily: "var(--body)", color: "var(--muted)", borderColor: "var(--muted)" }}
            >
              All Guides →
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {grid.map((p) => (
              <Link key={p.slug} href={`/${p.slug}`} className="group block">
                <div className="aspect-[3/2] overflow-hidden bg-gray-100 mb-4">
                  {p.featuredImage ? (
                    <img
                      src={p.featuredImage}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full" style={{ background: "var(--cream)" }} />
                  )}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="block w-4 h-px" style={{ background: "var(--gold)" }} />
                  <p
                    className="text-xs font-semibold tracking-widest uppercase"
                    style={{ color: "var(--gold)", fontFamily: "var(--body)" }}
                  >
                    {catLabel[p.category] ?? p.category}
                  </p>
                </div>
                <h3
                  className="font-light leading-snug group-hover:opacity-60 transition-opacity line-clamp-2"
                  style={{ fontFamily: "var(--heading)", fontSize: "1.15rem", lineHeight: 1.3 }}
                >
                  {p.title}
                </h3>
              </Link>
            ))}
          </div>

          <div className="text-center mt-14">
            <Link
              href="/category/diamond-buying-guides"
              className="inline-block text-xs font-semibold tracking-widest uppercase border border-black px-10 py-4 hover:bg-black hover:text-white transition-colors"
              style={{ fontFamily: "var(--body)" }}
            >
              View All Buying Guides
            </Link>
          </div>
        </section>
      )}

      {/* ── Bottom CTA strip ─────────────────────────────────── */}
      <div className="py-16 px-6" style={{ background: "var(--cream)", borderTop: "1px solid var(--border)" }}>
        <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-8">
          <div>
            <h3
              className="font-light mb-1"
              style={{ fontFamily: "var(--heading)", fontSize: "clamp(1.5rem, 3vw, 2.2rem)" }}
            >
              Ready to find your{" "}
              <em className="italic" style={{ color: "var(--gold)" }}>
                perfect diamond?
              </em>
            </h3>
            <p
              className="text-sm"
              style={{ fontFamily: "var(--heading)", fontStyle: "italic", color: "var(--muted)" }}
            >
              We recommend Blue Nile — 40% less than mall jewellers, GIA-certified.
            </p>
          </div>
          <a
            href="https://www.bluenile.com/diamond-search?a_aid=69d7c31a91b8d&a_cid=55e51e63&chan=homepage-cta"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-xs font-semibold tracking-widest uppercase px-8 py-4 text-white hover:opacity-80 transition-opacity"
            style={{ background: "var(--ink)", fontFamily: "var(--body)" }}
          >
            Shop Blue Nile →
          </a>
        </div>
      </div>
    </>
  );
}
