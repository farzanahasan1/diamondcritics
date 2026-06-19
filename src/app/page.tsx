import Link from "next/link";
import { getAllPosts, getPostsByCategory } from "@/lib/content";

const catLabel: Record<string, string> = {
  "diamond-buying-guides": "Buying Guide",
  "diamond-retailer-reviews": "Retailer Review",
  "gemstone-guides": "Gemstone",
  "market-value-price-trends": "Market & Price",
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
        <div className="max-w-screen-xl mx-auto px-6 sm:px-8"
          style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "3rem", alignItems: "center" }}>

          {/* Left */}
          <div style={{ maxWidth: "600px" }}>
            <p style={{ fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#888", marginBottom: "1rem" }}>
              Expert Guides · GIA-Backed · Free Analysis
            </p>
            <h1 style={{ fontFamily: "var(--heading)", fontWeight: 300, lineHeight: 1.05, marginBottom: "0.25rem", color: "#111" }}>
              <span style={{ display: "block", fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)", letterSpacing: "-0.02em" }}>
                Buy Diamonds Smarter.
              </span>
              <span style={{ display: "block", fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)", letterSpacing: "-0.02em", fontStyle: "italic", color: "var(--gold)" }}>
                Save Thousands.
              </span>
            </h1>
            <p style={{ fontSize: "0.95rem", lineHeight: 1.75, color: "#555", margin: "1.25rem 0 2rem", maxWidth: "480px" }}>
              Expert guides on diamonds and the best deals from trusted retailers. By Farzana Hasan, GIA Expert.
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link href="/diamond-4cs"
                style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#111", color: "#fff", fontFamily: "var(--body)", fontSize: "0.8rem", fontWeight: 600, padding: "11px 22px", textDecoration: "none" }}>
                Diamond Buying Guide →
              </Link>
              <Link href="/lab-grown-vs-natural-diamond-price"
                style={{ display: "inline-flex", alignItems: "center", gap: "6px", border: "1px solid #ddd", color: "#333", fontFamily: "var(--body)", fontSize: "0.8rem", fontWeight: 500, padding: "11px 22px", textDecoration: "none", background: "#fff" }}>
                Lab vs Natural Diamond
              </Link>
            </div>
          </div>

          {/* Right: featured in + Blue Nile box */}
          <div style={{ minWidth: "260px" }} className="hidden lg:block">
            <p style={{ fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#bbb", marginBottom: "0.75rem" }}>
              As Seen In
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "1.5rem" }}>
              {["Forbes", "Business Insider", "Yahoo Finance", "MSN"].map((pub) => (
                <span key={pub}
                  style={{ fontSize: "0.75rem", fontFamily: "var(--heading)", fontStyle: "italic", color: "#999", padding: "4px 10px", border: "1px solid #eee" }}>
                  {pub}
                </span>
              ))}
            </div>
            <a href="https://www.bluenile.com/diamond-search?a_aid=69d7c31a91b8d&a_cid=55e51e63&chan=blog-informational"
              target="_blank" rel="noopener noreferrer"
              style={{ display: "block", background: "#111", padding: "1rem 1.25rem", textDecoration: "none" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <p style={{ fontFamily: "var(--body)", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#888", marginBottom: "4px" }}>
                    Recommended Retailer
                  </p>
                  <p style={{ fontFamily: "var(--heading)", fontSize: "1.1rem", fontWeight: 300, color: "#fff" }}>
                    Blue Nile — Vault Sale
                  </p>
                  <p style={{ fontFamily: "var(--body)", fontSize: "0.78rem", color: "var(--gold)", marginTop: "2px" }}>
                    Up to 40% off select diamonds
                  </p>
                </div>
                <span style={{ color: "#fff", fontSize: "1.2rem" }}>→</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ── Filter nav ───────────────────────────────────────── */}
      <div style={{ borderBottom: "1px solid #ebebeb", background: "#fafafa" }}>
        <div className="max-w-screen-xl mx-auto px-6 sm:px-8"
          style={{ display: "flex", alignItems: "center", gap: "0", height: "46px", overflowX: "auto" }}>
          <span style={{ fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#aaa", marginRight: "16px", whiteSpace: "nowrap" }}>
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
              style={{ fontSize: "0.78rem", color: "#555", padding: "0 14px", whiteSpace: "nowrap", textDecoration: "none", height: "100%", display: "flex", alignItems: "center", borderRight: "1px solid #ebebeb" }}
              className="hover:text-black transition-colors">
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Trusted Retailer ─────────────────────────────────── */}
      <section style={{ borderBottom: "1px solid #ebebeb", padding: "2.5rem 0" }}>
        <div className="max-w-screen-xl mx-auto px-6 sm:px-8">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
            <div>
              <p style={{ fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#aaa", marginBottom: "4px" }}>
                Trusted Retailer
              </p>
              <h2 style={{ fontFamily: "var(--heading)", fontSize: "1.5rem", fontWeight: 300, color: "#111" }}>
                Where to Buy Diamonds
              </h2>
            </div>
            <Link href="/blue-nile-review"
              style={{ fontSize: "0.78rem", color: "#888", textDecoration: "none" }}
              className="hidden sm:block">
              All Reviews →
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "12px" }}>
            {[
              { name: "Blue Nile", badge: "Best Overall", badgeColor: "#111", desc: "200,000+ GIA-certified diamonds online. Up to 40% less.", href: "/blue-nile-review", affiliate: "https://www.bluenile.com/diamond-search?a_aid=69d7c31a91b8d&a_cid=55e51e63&chan=blog-informational" },
            ].map((r) => (
              <div key={r.name} style={{ border: "1px solid #ebebeb", padding: "1.25rem", background: "#fafafa" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{ fontFamily: "var(--heading)", fontSize: "1.3rem", fontWeight: 300, color: "#111" }}>{r.name}</span>
                  <span style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#fff", background: r.badgeColor, padding: "3px 8px" }}>
                    {r.badge}
                  </span>
                </div>
                <p style={{ fontSize: "0.82rem", color: "#666", lineHeight: 1.6, marginBottom: "0.75rem" }}>{r.desc}</p>
                <div style={{ display: "flex", gap: "8px" }}>
                  <a href={r.affiliate} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#fff", background: "#111", padding: "7px 14px", textDecoration: "none" }}>
                    Shop →
                  </a>
                  <Link href={r.href}
                    style={{ fontSize: "0.72rem", fontWeight: 500, color: "#555", border: "1px solid #ddd", padding: "7px 14px", textDecoration: "none" }}>
                    Full Review
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Latest Guides — featured + filter tabs ───────────── */}
      <section style={{ borderBottom: "1px solid #ebebeb", padding: "2.5rem 0" }}>
        <div className="max-w-screen-xl mx-auto px-6 sm:px-8">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
            <div>
              <p style={{ fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#aaa", marginBottom: "4px" }}>
                Expert Content
              </p>
              <h2 style={{ fontFamily: "var(--heading)", fontSize: "1.5rem", fontWeight: 300, color: "#111" }}>
                Latest Guides
              </h2>
            </div>
          </div>

          {/* Filter tabs */}
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "1.75rem" }}>
            {["All", "Buying Guide", "Clarity", "Color", "Shapes", "Retailer Review", "Market & Price"].map((tab, i) => (
              <span key={tab}
                style={{
                  fontSize: "0.75rem",
                  padding: "5px 14px",
                  border: `1px solid ${i === 0 ? "#111" : "#ddd"}`,
                  background: i === 0 ? "#111" : "#fff",
                  color: i === 0 ? "#fff" : "#555",
                  cursor: "pointer",
                  userSelect: "none" as const,
                }}>
                {tab}
              </span>
            ))}
          </div>

          {/* Featured post — large */}
          {featured && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0", border: "1px solid #ebebeb", marginBottom: "1.5rem" }}
              className="block sm:grid">
              <div style={{ position: "relative", overflow: "hidden", aspectRatio: "3/2" }}>
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
                  {catLabel[featured.category] ?? featured.category} Guide
                </p>
                <h3 style={{ fontFamily: "var(--heading)", fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 300, color: "#111", lineHeight: 1.2, marginBottom: "1rem" }}>
                  {featured.title}
                </h3>
                {featured.excerpt && (
                  <p style={{ fontSize: "0.88rem", color: "#666", lineHeight: 1.75, marginBottom: "1.5rem" }}>
                    {featured.excerpt}
                  </p>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  {featured.publishedAt && (
                    <span style={{ fontSize: "0.75rem", color: "#bbb" }}>
                      {new Date(featured.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  )}
                  <Link href={`/${featured.slug}`}
                    style={{ fontSize: "0.8rem", fontWeight: 600, color: "#111", textDecoration: "none" }}>
                    Read guide →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* 3-col grid row 1 */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
            {grid1.map((p) => (
              <Link key={p.slug} href={`/${p.slug}`} style={{ textDecoration: "none", display: "block" }} className="group">
                <div style={{ position: "relative", overflow: "hidden", aspectRatio: "3/2", background: "#f0f0f0", marginBottom: "0.75rem" }}>
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
                  <p style={{ fontSize: "0.82rem", color: "#777", lineHeight: 1.65, marginBottom: "10px",
                    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
                    {p.excerpt}
                  </p>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  {p.publishedAt && (
                    <span style={{ fontSize: "0.72rem", color: "#bbb" }}>
                      {new Date(p.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  )}
                  <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#555" }}>Read →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── More Guides ──────────────────────────────────────── */}
      <section style={{ borderBottom: "1px solid #ebebeb", padding: "2.5rem 0" }}>
        <div className="max-w-screen-xl mx-auto px-6 sm:px-8">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
            {grid2.map((p) => (
              <Link key={p.slug} href={`/${p.slug}`} style={{ textDecoration: "none", display: "block" }}>
                <div style={{ position: "relative", overflow: "hidden", aspectRatio: "3/2", background: "#f0f0f0", marginBottom: "0.75rem" }}>
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
                  <p style={{ fontSize: "0.82rem", color: "#777", lineHeight: 1.65, marginBottom: "10px",
                    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
                    {p.excerpt}
                  </p>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  {p.publishedAt && (
                    <span style={{ fontSize: "0.72rem", color: "#bbb" }}>
                      {new Date(p.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  )}
                  <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#555" }}>Read →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── All Guides grid ──────────────────────────────────── */}
      {guides.length > 0 && (
        <section style={{ borderBottom: "1px solid #ebebeb", padding: "2.5rem 0" }}>
          <div className="max-w-screen-xl mx-auto px-6 sm:px-8">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <div>
                <p style={{ fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#aaa", marginBottom: "4px" }}>Diamond Guides</p>
                <h2 style={{ fontFamily: "var(--heading)", fontSize: "1.5rem", fontWeight: 300, color: "#111" }}>Browse All Guides</h2>
              </div>
              <Link href="/category/diamond-buying-guides"
                style={{ fontSize: "0.78rem", color: "#888", textDecoration: "none" }} className="hidden sm:block">
                All Guides →
              </Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.25rem" }}>
              {guides.map((p) => (
                <Link key={p.slug} href={`/${p.slug}`} style={{ textDecoration: "none", display: "block" }}>
                  <div style={{ position: "relative", overflow: "hidden", aspectRatio: "3/2", background: "#f0f0f0", marginBottom: "0.6rem" }}>
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

      {/* ── Dark CTA banner ──────────────────────────────────── */}
      <section style={{ background: "#111", padding: "0" }}>
        <div className="max-w-screen-xl mx-auto px-6 sm:px-8"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", alignItems: "stretch", minHeight: "220px" }}>
          <div style={{ padding: "3rem 0", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <p style={{ fontFamily: "var(--body)", fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#666", marginBottom: "0.5rem" }}>
              Interactive Tool
            </p>
            <h2 style={{ fontFamily: "var(--heading)", fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 300, color: "#fff", lineHeight: 1.2, marginBottom: "0.75rem" }}>
              Natural or Lab-Grown Diamond?{" "}
              <em style={{ fontStyle: "italic", color: "var(--gold)" }}>Can you tell?</em>
            </h2>
            <p style={{ fontSize: "0.85rem", color: "#888", lineHeight: 1.7, marginBottom: "1.5rem", maxWidth: "400px" }}>
              Same color. Same clarity. One costs $8,140 — the other $1,870. Read our full price breakdown and discover which is right for you.
            </p>
            <Link href="/lab-grown-vs-natural-diamond-price"
              style={{ display: "inline-block", background: "var(--gold)", color: "#111", fontFamily: "var(--body)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "11px 24px", textDecoration: "none", width: "fit-content" }}>
              Read the Full Breakdown →
            </Link>
          </div>
          <div style={{ position: "relative", overflow: "hidden" }} className="hidden sm:block">
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: "24px", padding: "2rem" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--heading)", fontSize: "4rem", color: "rgba(255,255,255,0.08)", fontWeight: 300, lineHeight: 1 }}>
                  EXCLUSIVE
                </div>
                <div style={{ fontFamily: "var(--heading)", fontSize: "5rem", color: "rgba(255,255,255,0.06)", fontWeight: 300, lineHeight: 1 }}>
                  SAVINGS
                </div>
                <a href="https://www.bluenile.com/diamond-search?a_aid=69d7c31a91b8d&a_cid=55e51e63&chan=blog-informational"
                  target="_blank" rel="noopener noreferrer"
                  style={{ display: "inline-block", fontFamily: "var(--body)", fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold)", marginTop: "1rem" }}>
                  Blue Nile — Up to 40% Off →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
