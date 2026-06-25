import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/content";
import JamesAllenBanner from "@/components/JamesAllenBanner";

export const metadata: Metadata = {
  title: "Diamond Critics — Expert Diamond Buying Advice by Farzana Hasan",
  description: "GIA-backed diamond buying guides covering cut, clarity, color, and carat. Data-driven advice from Farzana Hasan, GIA Expert — so you never overpay for a diamond.",
  alternates: { canonical: "https://diamondcritics.com" },
  openGraph: {
    title: "Diamond Critics — Expert Diamond Buying Advice by Farzana Hasan",
    description: "GIA-backed diamond buying guides covering cut, clarity, color, and carat. Data-driven advice from Farzana Hasan, GIA Expert — so you never overpay for a diamond.",
    url: "https://diamondcritics.com",
    type: "website",
    images: [{ url: "/images/diamondcritics-og.png", width: 1200, height: 630, alt: "Diamond Critics" }],
  },
  twitter: { card: "summary_large_image" },
};

const catLabel: Record<string, string> = {
  "diamond-buying-guides": "Buying Guide",
  "diamond-retailer-reviews": "Retailer Review",
  "gemstone-guides": "Gemstone",
  "market-value-price-trends": "Market & Price",
  "round-cut-diamond": "Round Diamond",
};

const wrap: React.CSSProperties = {
  maxWidth: "1280px",
  margin: "0 auto",
  padding: "0 2rem",
};

export default function HomePage() {
  const all = getAllPosts();
  const featured = all[0];
  const grid1 = all.slice(1, 4);
  const grid2 = all.slice(4, 7);
  const guides = all.slice(7, 15);

  return (
    <div style={{ background: "#fff", fontFamily: "var(--body)" }}>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section style={{ borderBottom: "1px solid #ebebeb", padding: "3.5rem 0 3rem" }}>
        <div style={{ ...wrap, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "3rem", flexWrap: "wrap" }}>

          {/* Left */}
          <div style={{ flex: "1 1 400px", maxWidth: "580px" }}>
            <p style={{ fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#888", marginBottom: "1rem" }}>
              Expert Guides · GIA-Backed · Free Analysis
            </p>
            <h1 style={{ fontFamily: "var(--heading)", fontWeight: 300, lineHeight: 1.05, marginBottom: "0.25rem", color: "#111" }}>
              <span style={{ display: "block", fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)", letterSpacing: "-0.02em" }}>
                Diamond Reviews &amp; Buying Guides.
              </span>
              <span style={{ display: "block", fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)", letterSpacing: "-0.02em", fontStyle: "italic", color: "var(--gold)" }}>
                Save Thousands.
              </span>
            </h1>
            <p style={{ fontSize: "0.95rem", lineHeight: 1.75, color: "#555", margin: "1.25rem 0 2rem", maxWidth: "480px" }}>
              Expert diamond reviews, clarity guides, color grading, and price comparisons. GIA-backed analysis by Farzana Hasan — trusted by buyers in the US, UK, Canada, and Australia.
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link href="/diamond-4cs"
                style={{ display: "inline-flex", alignItems: "center", background: "#111", color: "#fff", fontFamily: "var(--body)", fontSize: "0.8rem", fontWeight: 600, padding: "11px 22px", textDecoration: "none" }}>
                Diamond Buying Guide →
              </Link>
              <Link href="/lab-grown-vs-natural-diamond-price"
                style={{ display: "inline-flex", alignItems: "center", border: "1px solid #ddd", color: "#333", fontFamily: "var(--body)", fontSize: "0.8rem", fontWeight: 500, padding: "11px 22px", textDecoration: "none", background: "#fff" }}>
                Lab vs Natural Diamond
              </Link>
            </div>
          </div>

          {/* Right */}
          <div style={{ flex: "0 0 260px" }}>
            <p style={{ fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#bbb", marginBottom: "0.75rem" }}>
              As Seen In
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "1.5rem" }}>
              {["Forbes", "Business Insider", "Yahoo Finance", "MSN"].map((pub) => (
                <span key={pub} style={{ fontSize: "0.75rem", fontFamily: "var(--heading)", fontStyle: "italic", color: "#999", padding: "4px 10px", border: "1px solid #eee" }}>
                  {pub}
                </span>
              ))}
            </div>
            <a href="https://www.bluenile.com/diamond-search?a_aid=69d7c31a91b8d&a_cid=55e51e63&chan=blog-informational"
              target="_blank" rel="noopener noreferrer"
              style={{ display: "block", background: "#111", padding: "1rem 1.25rem", textDecoration: "none" }}>
              <p style={{ fontFamily: "var(--body)", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#888", marginBottom: "4px" }}>
                Recommended Retailer
              </p>
              <p style={{ fontFamily: "var(--heading)", fontSize: "1.05rem", fontWeight: 300, color: "#fff" }}>
                Blue Nile — Vault Sale
              </p>
              <p style={{ fontFamily: "var(--body)", fontSize: "0.78rem", color: "var(--gold)", marginTop: "2px" }}>
                Up to 40% off select diamonds →
              </p>
            </a>
          </div>
        </div>
      </section>

      {/* ── Filter nav ───────────────────────────────────────── */}
      <div style={{ borderBottom: "1px solid #ebebeb", background: "#fafafa" }}>
        <div style={{ ...wrap, display: "flex", alignItems: "center", height: "46px", overflowX: "auto", gap: "0" }}>
          <span style={{ fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#aaa", marginRight: "16px", whiteSpace: "nowrap", flexShrink: 0 }}>
            Explore
          </span>
          {[
            { label: "Guides", href: "/category/diamond-buying-guides" },
            { label: "Clarity", href: "/diamond-clarity-chart" },
            { label: "Color", href: "/diamond-color-scale" },
            { label: "Shapes", href: "/diamond-shapes-guide" },
            { label: "Reviews", href: "/category/diamond-retailer-reviews" },
            { label: "Prices", href: "/diamond-prices" },
            { label: "Lab vs Natural", href: "/lab-grown-vs-natural-diamond-price" },
            { label: "4Cs Guide", href: "/diamond-4cs" },
          ].map((item) => (
            <Link key={item.href} href={item.href}
              style={{ fontSize: "0.78rem", color: "#555", padding: "0 14px", whiteSpace: "nowrap", textDecoration: "none", height: "100%", display: "flex", alignItems: "center", borderRight: "1px solid #ebebeb", flexShrink: 0 }}>
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── James Allen Sale Banner ──────────────────────────── */}
      <div style={{ background: "#000" }}>
        <JamesAllenBanner />
      </div>

      {/* ── Trusted Retailer ─────────────────────────────────── */}
      <section style={{ borderBottom: "1px solid #ebebeb", padding: "3rem 0" }}>
        <div style={wrap}>

          {/* Section header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.75rem" }}>
            <div>
              <p style={{ fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#aaa", marginBottom: "4px" }}>
                Trusted Retailer
              </p>
              <h2 style={{ fontFamily: "var(--heading)", fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)", fontWeight: 300, color: "#111" }}>
                Where to Buy Diamonds
              </h2>
            </div>
            <Link href="/blue-nile-review" style={{ fontSize: "0.78rem", color: "#888", textDecoration: "none" }}>
              All Reviews →
            </Link>
          </div>

          {/* Featured retailer card */}
          <div style={{ border: "1px solid #e0e0e0", background: "#fff", display: "grid", gridTemplateColumns: "1fr 1fr", overflow: "hidden" }} className="retailer-card">

            {/* Left — dark brand panel */}
            <div style={{ background: "#141414", padding: "2.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <picture>
                  <source srcSet="/images/BLUE-NILE-JEWELRY-PNG-LOGO.avif" type="image/avif" />
                  <img src="/images/BLUE-NILE-JEWELRY-PNG-LOGO.png" alt="Blue Nile"
                    style={{ height: "36px", width: "auto", display: "block", filter: "brightness(0) invert(1)", marginBottom: "1.5rem" }}
                    loading="lazy" decoding="async" />
                </picture>
                <p style={{ fontFamily: "var(--body)", fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.5rem" }}>
                  Expert Score
                </p>
                <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "0.5rem" }}>
                  <span style={{ fontFamily: "var(--heading)", fontSize: "2.5rem", fontWeight: 300, color: "#fff", lineHeight: 1 }}>4.6</span>
                  <span style={{ fontFamily: "var(--body)", fontSize: "0.8rem", color: "#555" }}>/ 5.0</span>
                </div>
                <div style={{ color: "var(--gold)", fontSize: "1.1rem", letterSpacing: "2px", marginBottom: "1rem" }}>★★★★★</div>
                <p style={{ fontFamily: "var(--body)", fontSize: "0.72rem", color: "#555" }}>
                  Audited by Farzana Hasan, GIA Expert
                </p>
              </div>
              <div style={{ marginTop: "2rem" }}>
                <span style={{ fontFamily: "var(--body)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#111", background: "var(--gold)", padding: "4px 10px" }}>
                  Best Overall 2026
                </span>
              </div>
            </div>

            {/* Right — details panel */}
            <div style={{ padding: "2.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontFamily: "var(--body)", fontSize: "0.95rem", color: "#444", lineHeight: 1.7, marginBottom: "1.75rem" }}>
                  The world's largest GIA-certified diamond inventory. Since the 14% market correction, Blue Nile offers Oval and Cushion cuts thousands below Round Brilliant floor prices.
                </p>

                {/* Stats row */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: "#ebebeb", border: "1px solid #ebebeb", marginBottom: "1.75rem" }}>
                  {[
                    { value: "200K+", label: "GIA Diamonds" },
                    { value: "40%", label: "Below Mall" },
                    { value: "4.6★", label: "Expert Score" },
                  ].map((stat) => (
                    <div key={stat.label} style={{ background: "#fff", padding: "1rem", textAlign: "center" }}>
                      <p style={{ fontFamily: "var(--heading)", fontSize: "1.3rem", fontWeight: 300, color: "#111", marginBottom: "3px" }}>{stat.value}</p>
                      <p style={{ fontFamily: "var(--body)", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#aaa" }}>{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <a href="https://www.bluenile.com/diamond-search?a_aid=69d7c31a91b8d&a_cid=55e51e63&chan=blue_nile_reviews"
                  target="_blank" rel="noopener noreferrer"
                  style={{ background: "#141414", color: "#fff", fontFamily: "var(--body)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", padding: "12px 24px", textDecoration: "none" }}>
                  Shop Blue Nile →
                </a>
                <Link href="/blue-nile-review"
                  style={{ border: "1px solid #ddd", color: "#555", fontFamily: "var(--body)", fontSize: "0.75rem", fontWeight: 500, padding: "12px 20px", textDecoration: "none" }}>
                  Read Full Review
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Latest Guides ────────────────────────────────────── */}
      <section style={{ borderBottom: "1px solid #ebebeb", padding: "2.5rem 0" }}>
        <div style={wrap}>
          <div style={{ marginBottom: "1.25rem" }}>
            <p style={{ fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#aaa", marginBottom: "4px" }}>Expert Content</p>
            <h2 style={{ fontFamily: "var(--heading)", fontSize: "1.5rem", fontWeight: 300, color: "#111" }}>Latest Guides</h2>
          </div>

          {/* Filter tabs */}
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "1.75rem" }}>
            {["All", "Buying Guide", "Clarity", "Color", "Shapes", "Retailer Review", "Market & Price"].map((tab, i) => (
              <span key={tab} style={{ fontSize: "0.75rem", padding: "5px 14px", border: `1px solid ${i === 0 ? "#111" : "#ddd"}`, background: i === 0 ? "#111" : "#fff", color: i === 0 ? "#fff" : "#555", cursor: "pointer" }}>
                {tab}
              </span>
            ))}
          </div>

          {/* Featured post — entire card is clickable */}
          {featured && (
            <Link href={`/${featured.slug}`} className="home-featured-card" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", border: "1px solid #ebebeb", marginBottom: "2rem", textDecoration: "none", color: "inherit" }}>
              <div style={{ overflow: "hidden", aspectRatio: "3/2" }}>
                {featured.featuredImage ? (
                  <img src={featured.featuredImage} alt={featured.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    fetchPriority="high" decoding="async" />
                ) : (
                  <div style={{ width: "100%", height: "100%", background: "#f0f0f0" }} />
                )}
              </div>
              <div style={{ padding: "2.5rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <p style={{ fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.75rem" }}>
                  {catLabel[featured.category] ?? featured.category}
                </p>
                <h3 style={{ fontFamily: "var(--heading)", fontSize: "clamp(1.3rem, 2.2vw, 1.9rem)", fontWeight: 300, color: "#111", lineHeight: 1.2, marginBottom: "1rem" }}>
                  {featured.title}
                </h3>
                {featured.excerpt && (
                  <p style={{ fontSize: "0.87rem", color: "#666", lineHeight: 1.75, marginBottom: "1.5rem" }}>
                    {featured.excerpt}
                  </p>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  {featured.publishedAt && (
                    <span style={{ fontSize: "0.75rem", color: "#bbb" }}>
                      {new Date(featured.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  )}
                  <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#111" }}>
                    Read guide →
                  </span>
                </div>
              </div>
            </Link>
          )}

          {/* 3-col grid */}
          <div className="home-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
            {grid1.map((p) => (
              <Link key={p.slug} href={`/${p.slug}`} style={{ textDecoration: "none", display: "block" }}>
                <div style={{ overflow: "hidden", aspectRatio: "3/2", background: "#f0f0f0", marginBottom: "0.75rem" }}>
                  {p.featuredImage && (
                    <img src={p.featuredImage} alt={p.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      loading="lazy" decoding="async" />
                  )}
                </div>
                <p style={{ fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "6px" }}>
                  {catLabel[p.category] ?? p.category}
                </p>
                <h3 style={{ fontFamily: "var(--heading)", fontSize: "1.05rem", fontWeight: 300, color: "#111", lineHeight: 1.3, marginBottom: "8px" }}>
                  {p.title}
                </h3>
                {p.excerpt && (
                  <p style={{ fontSize: "0.82rem", color: "#777", lineHeight: 1.65, marginBottom: "10px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
                    {p.excerpt}
                  </p>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  {p.publishedAt && <span style={{ fontSize: "0.72rem", color: "#bbb" }}>{new Date(p.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>}
                  <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#555" }}>Read →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── More Guides row 2 ────────────────────────────────── */}
      <section style={{ borderBottom: "1px solid #ebebeb", padding: "2.5rem 0" }}>
        <div style={wrap}>
          <div className="home-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
            {grid2.map((p) => (
              <Link key={p.slug} href={`/${p.slug}`} style={{ textDecoration: "none", display: "block" }}>
                <div style={{ overflow: "hidden", aspectRatio: "3/2", background: "#f0f0f0", marginBottom: "0.75rem" }}>
                  {p.featuredImage && (
                    <img src={p.featuredImage} alt={p.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      loading="lazy" decoding="async" />
                  )}
                </div>
                <p style={{ fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "6px" }}>
                  {catLabel[p.category] ?? p.category}
                </p>
                <h3 style={{ fontFamily: "var(--heading)", fontSize: "1.05rem", fontWeight: 300, color: "#111", lineHeight: 1.3, marginBottom: "8px" }}>
                  {p.title}
                </h3>
                {p.excerpt && (
                  <p style={{ fontSize: "0.82rem", color: "#777", lineHeight: 1.65, marginBottom: "10px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
                    {p.excerpt}
                  </p>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  {p.publishedAt && <span style={{ fontSize: "0.72rem", color: "#bbb" }}>{new Date(p.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>}
                  <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#555" }}>Read →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Browse All Guides ────────────────────────────────── */}
      {guides.length > 0 && (
        <section style={{ borderBottom: "1px solid #ebebeb", padding: "2.5rem 0" }}>
          <div style={wrap}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <div>
                <p style={{ fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#aaa", marginBottom: "4px" }}>Diamond Guides</p>
                <h2 style={{ fontFamily: "var(--heading)", fontSize: "1.5rem", fontWeight: 300, color: "#111" }}>Browse All Guides</h2>
              </div>
              <Link href="/category/diamond-buying-guides" style={{ fontSize: "0.78rem", color: "#888", textDecoration: "none" }}>All Guides →</Link>
            </div>
            <div className="home-grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.25rem" }}>
              {guides.map((p) => (
                <Link key={p.slug} href={`/${p.slug}`} style={{ textDecoration: "none", display: "block" }}>
                  <div style={{ overflow: "hidden", aspectRatio: "3/2", background: "#f0f0f0", marginBottom: "0.6rem" }}>
                    {p.featuredImage && (
                      <img src={p.featuredImage} alt={p.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        loading="lazy" decoding="async" />
                    )}
                  </div>
                  <p style={{ fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "5px" }}>
                    {catLabel[p.category] ?? p.category}
                  </p>
                  <p style={{ fontFamily: "var(--heading)", fontSize: "0.95rem", fontWeight: 300, color: "#111", lineHeight: 1.3 }}>
                    {p.title}
                  </p>
                </Link>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
              <Link href="/category/diamond-buying-guides"
                style={{ display: "inline-block", border: "1px solid #111", color: "#111", fontFamily: "var(--body)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", padding: "12px 36px", textDecoration: "none" }}>
                View All Buying Guides
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Dark CTA ─────────────────────────────────────────── */}
      <section style={{ background: "#111" }}>
        <div className="home-cta-grid" style={{ ...wrap, display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "200px" }}>
          <div style={{ padding: "3rem 0", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <p style={{ fontFamily: "var(--body)", fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#666", marginBottom: "0.5rem" }}>
              Interactive Tool
            </p>
            <h2 style={{ fontFamily: "var(--heading)", fontSize: "clamp(1.3rem, 2.5vw, 1.9rem)", fontWeight: 300, color: "#fff", lineHeight: 1.2, marginBottom: "0.75rem" }}>
              Natural or Lab-Grown?{" "}
              <em style={{ fontStyle: "italic", color: "var(--gold)" }}>Can you tell?</em>
            </h2>
            <p style={{ fontSize: "0.85rem", color: "#888", lineHeight: 1.7, marginBottom: "1.5rem" }}>
              Same color. Same clarity. One costs $8,140 — the other $1,870. Discover which is right for you.
            </p>
            <Link href="/lab-grown-vs-natural-diamond-price"
              style={{ display: "inline-block", background: "var(--gold)", color: "#111", fontFamily: "var(--body)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "11px 24px", textDecoration: "none", width: "fit-content" }}>
              Read the Full Breakdown →
            </Link>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontFamily: "var(--heading)", fontSize: "3.5rem", fontWeight: 300, color: "rgba(255,255,255,0.06)", lineHeight: 1, letterSpacing: "-0.02em" }}>EXCLUSIVE</p>
              <p style={{ fontFamily: "var(--heading)", fontSize: "4.5rem", fontWeight: 300, color: "rgba(255,255,255,0.06)", lineHeight: 1, letterSpacing: "-0.02em" }}>SAVINGS</p>
              <a href="https://www.bluenile.com/diamond-search?a_aid=69d7c31a91b8d&a_cid=55e51e63&chan=homepage-cta"
                target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-block", fontFamily: "var(--body)", fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold)", marginTop: "1rem", textDecoration: "none" }}>
                Blue Nile — Up to 40% Off →
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
