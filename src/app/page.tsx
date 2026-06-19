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
    <div style={{ background: "#e8e5df", minHeight: "100vh" }}>

      {/* ── Announcement bar ─────────────────────────────────── */}
      <div style={{ borderBottom: "1px solid #ccc", background: "#e0ddd7" }}>
        <div className="max-w-screen-2xl mx-auto px-8 py-2 flex items-center justify-between">
          <span className="text-xs tracking-widest uppercase hidden sm:block"
            style={{ fontFamily: "var(--body)", color: "#888", letterSpacing: "0.14em" }}>
            Expert Diamond Analysis · GIA-Backed · No Sponsored Content
          </span>
          <a href="https://www.bluenile.com/diamond-search?a_aid=69d7c31a91b8d&a_cid=55e51e63&chan=blog-informational"
            target="_blank" rel="noopener noreferrer"
            className="text-xs tracking-widest uppercase hover:text-black transition-colors ml-auto sm:ml-0"
            style={{ fontFamily: "var(--body)", color: "#888", letterSpacing: "0.14em" }}>
            Shop Blue Nile — Up to 40% Less →
          </a>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          HERO — Architecture Magazine 3-column layout
          [left-margin] [main: headline + image+text] [sidebar]
      ══════════════════════════════════════════════════════ */}
      {hero && (
        <div style={{ borderBottom: "1px solid #ccc" }}>
          <div className="max-w-screen-2xl mx-auto px-8 py-16"
            style={{ display: "grid", gridTemplateColumns: "64px 1fr 300px", gap: "0 40px", alignItems: "start" }}>

            {/* Col 1: number */}
            <div className="pt-2 hidden lg:block">
              <span className="text-sm font-light"
                style={{ fontFamily: "var(--body)", color: "#aaa" }}>01</span>
            </div>

            {/* Col 2: main content */}
            <div>
              {/* Category overline */}
              <div className="flex items-center gap-3 mb-4">
                <span style={{ display: "block", width: "32px", height: "1px", background: "#999" }} />
                <p className="text-xs tracking-widest uppercase"
                  style={{ fontFamily: "var(--body)", color: "#888", letterSpacing: "0.16em" }}>
                  {catLabel[hero.category] ?? hero.category}
                </p>
              </div>

              {/* BIG editorial headline */}
              <h1 style={{
                fontFamily: "var(--heading)",
                fontSize: "clamp(3.5rem, 7vw, 7rem)",
                fontWeight: 300,
                lineHeight: 0.95,
                letterSpacing: "-0.03em",
                color: "#111",
                marginBottom: "2.5rem",
              }}>
                {hero.title.split(":")[0].split("(")[0].trim()}
              </h1>

              {/* Image left + text right */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem", alignItems: "start" }}>
                <div>
                  {hero.featuredImage ? (
                    <img src={hero.featuredImage} alt={hero.title}
                      style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", display: "block" }}
                      fetchPriority="high" decoding="async" />
                  ) : (
                    <div style={{ width: "100%", aspectRatio: "4/5", background: "#ccc" }} />
                  )}
                </div>
                <div style={{ paddingTop: "0.5rem" }}>
                  <h2 style={{
                    fontFamily: "var(--heading)",
                    fontSize: "clamp(1.3rem, 2vw, 1.75rem)",
                    fontWeight: 300,
                    lineHeight: 1.2,
                    color: "#111",
                    marginBottom: "1.25rem",
                  }}>
                    {hero.title}
                  </h2>
                  {hero.excerpt && (
                    <p style={{
                      fontFamily: "var(--body)",
                      fontSize: "0.9rem",
                      lineHeight: 1.8,
                      color: "#555",
                      marginBottom: "2rem",
                    }}>
                      {hero.excerpt}
                    </p>
                  )}
                  <Link href={`/${hero.slug}`}
                    style={{
                      display: "inline-block",
                      background: "#111",
                      color: "#fff",
                      fontFamily: "var(--body)",
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      padding: "14px 32px",
                      textDecoration: "none",
                    }}>
                    Read the Full Audit
                  </Link>
                  <p style={{
                    fontFamily: "var(--heading)",
                    fontStyle: "italic",
                    fontSize: "0.95rem",
                    color: "#999",
                    marginTop: "1.25rem",
                  }}>
                    — An independent audit by Farzana
                  </p>
                </div>
              </div>
            </div>

            {/* Col 3: sidebar */}
            <div style={{ borderLeft: "1px solid #ccc", paddingLeft: "2rem" }} className="hidden lg:block">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                <p className="text-xs tracking-widest uppercase font-semibold"
                  style={{ fontFamily: "var(--body)", color: "#111", letterSpacing: "0.2em" }}>
                  Next Articles
                </p>
                <Link href="/category/diamond-buying-guides"
                  style={{ fontFamily: "var(--body)", color: "#999", fontSize: "0.8rem", textDecoration: "none" }}>→</Link>
              </div>
              <div>
                {sidebar.map((p) => (
                  <Link key={p.slug} href={`/${p.slug}`}
                    style={{ display: "flex", gap: "12px", padding: "14px 0", borderBottom: "1px solid #d5d2cc", textDecoration: "none" }}
                    className="group">
                    <div style={{ flexShrink: 0, width: "56px", height: "56px", overflow: "hidden", background: "#ccc" }}>
                      {p.featuredImage && (
                        <img src={p.featuredImage} alt={p.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          loading="lazy" decoding="async" />
                      )}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{
                        fontFamily: "var(--body)",
                        fontSize: "0.65rem",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "#999",
                        marginBottom: "4px",
                      }}>
                        {catLabel[p.category] ?? p.category}
                      </p>
                      <p style={{
                        fontFamily: "var(--heading)",
                        fontSize: "0.85rem",
                        fontWeight: 300,
                        lineHeight: 1.3,
                        color: "#111",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}>
                        {p.title}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Blue Nile affiliate in sidebar */}
              <div style={{ marginTop: "2rem", padding: "1.25rem", background: "#111" }}>
                <p style={{ fontFamily: "var(--body)", fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#888", marginBottom: "8px" }}>
                  Verified Retailer
                </p>
                <p style={{ fontFamily: "var(--heading)", fontSize: "1.1rem", fontWeight: 300, color: "#fff", marginBottom: "12px" }}>
                  Blue Nile — 40% Less Than Mall Prices
                </p>
                <a href="https://www.bluenile.com/diamond-search?a_aid=69d7c31a91b8d&a_cid=55e51e63&chan=homepage-sidebar"
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    display: "block",
                    textAlign: "center",
                    background: "var(--gold)",
                    color: "#111",
                    fontFamily: "var(--body)",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    padding: "10px",
                    textDecoration: "none",
                  }}>
                  Search Diamonds →
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── Mobile: latest posts (3-col, no sidebar) ─────────── */}
      <div className="lg:hidden" style={{ borderBottom: "1px solid #ccc" }}>
        <div className="max-w-screen-xl mx-auto px-6 py-12">
          <div className="grid sm:grid-cols-2 gap-8">
            {sidebar.slice(0, 4).map((p) => (
              <Link key={p.slug} href={`/${p.slug}`} className="group block" style={{ textDecoration: "none" }}>
                <div style={{ aspectRatio: "3/2", overflow: "hidden", background: "#ccc", marginBottom: "12px" }}>
                  {p.featuredImage && (
                    <img src={p.featuredImage} alt={p.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      loading="lazy" decoding="async" />
                  )}
                </div>
                <p style={{ fontFamily: "var(--body)", fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#888", marginBottom: "6px" }}>
                  {catLabel[p.category] ?? p.category}
                </p>
                <p style={{ fontFamily: "var(--heading)", fontSize: "1.1rem", fontWeight: 300, color: "#111", lineHeight: 1.3 }}>
                  {p.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Dark: Expert Audits ───────────────────────────────── */}
      <section style={{ background: "#111", padding: "5rem 2rem" }}>
        <div className="max-w-screen-xl mx-auto">
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "3rem" }}>
            <div>
              <p style={{ fontFamily: "var(--body)", fontSize: "0.7rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#666", marginBottom: "0.75rem" }}>
                Technical Audits
              </p>
              <h2 style={{ fontFamily: "var(--heading)", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 300, color: "#fff" }}>
                Expert Diamond{" "}
                <em style={{ fontStyle: "italic", color: "var(--gold)" }}>Audits</em>
              </h2>
            </div>
            <Link href="/category/diamond-buying-guides"
              style={{ fontFamily: "var(--body)", fontSize: "0.7rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "#666", borderBottom: "1px solid #666", paddingBottom: "2px", textDecoration: "none" }}
              className="hidden sm:block">
              All Guides →
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: "#333" }}>
            {[
              { label: "Mastering the 4Cs", sub: "Carat · Cut · Color · Clarity", href: "/diamond-4cs", img: "/images/infographic-for-diamond-4c-clarity.avif" },
              { label: "Diamond Prices & Trends", sub: "2026 market data, crash analysis", href: "/diamond-prices", img: "/images/diamond-prices-2026-march-market-crash-report.avif" },
              { label: "Clarity Grade Audits", sub: "FL through SI — what to buy", href: "/diamond-clarity-chart", img: "/images/diamond-clarity-chart-beware-clouds-not-shown-milky.avif" },
            ].map((card) => (
              <Link key={card.href} href={card.href}
                style={{ position: "relative", display: "block", overflow: "hidden", aspectRatio: "4/3", background: "#1a1a1a", textDecoration: "none" }}
                className="group">
                <img src={card.img} alt={card.label}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.3 }}
                  loading="lazy" decoding="async" />
                <div style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "2rem" }}>
                  <p style={{ fontFamily: "var(--body)", fontSize: "0.65rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "8px" }}>
                    {card.sub}
                  </p>
                  <h3 style={{ fontFamily: "var(--heading)", fontSize: "1.5rem", fontWeight: 300, color: "#fff", lineHeight: 1.2 }}>
                    {card.label}
                  </h3>
                  <p style={{ fontFamily: "var(--heading)", fontStyle: "italic", fontSize: "0.85rem", color: "rgba(255,255,255,0.35)", marginTop: "0.75rem" }}>
                    Read the audit →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Where to Buy ─────────────────────────────────────── */}
      <section style={{ background: "#e8e5df", borderTop: "1px solid #ccc", borderBottom: "1px solid #ccc", padding: "5rem 2rem" }}>
        <div className="max-w-screen-xl mx-auto">
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <span style={{ display: "block", width: "32px", height: "1px", background: "#999" }} />
            <p style={{ fontFamily: "var(--body)", fontSize: "0.7rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#999" }}>
              Verified Retailer
            </p>
          </div>
          <h2 style={{ fontFamily: "var(--heading)", fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 300, lineHeight: 1.0, marginBottom: "8px", color: "#111" }}>
            Where to Buy{" "}
            <em style={{ fontStyle: "italic", color: "var(--gold)" }}>in 2026</em>
          </h2>
          <p style={{ fontFamily: "var(--heading)", fontStyle: "italic", color: "#888", fontSize: "0.95rem", marginBottom: "3rem" }}>
            Based on price, selection &amp; verified customer experience
          </p>
          <div style={{ borderTop: "1px solid #ccc", borderBottom: "1px solid #ccc" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", padding: "10px 0" }}>
              {["Retailer", "Verdict", "Best For", ""].map((h) => (
                <span key={h} style={{ fontFamily: "var(--body)", fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#999" }}>{h}</span>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", padding: "28px 0", alignItems: "center", borderTop: "1px solid #ddd" }}>
              <span style={{ fontFamily: "var(--heading)", fontSize: "2rem", fontWeight: 300, color: "#111" }}>Blue Nile</span>
              <div>
                <span style={{ fontFamily: "var(--body)", fontSize: "0.75rem", fontWeight: 600, color: "#166534" }}>4.6 / 5</span>
                <p style={{ fontFamily: "var(--heading)", fontStyle: "italic", fontSize: "0.85rem", color: "#999", marginTop: "2px" }}>Trusted Original</p>
              </div>
              <span style={{ fontFamily: "var(--body)", fontSize: "0.9rem", color: "#666" }}>Inventory Depth</span>
              <a href="https://www.bluenile.com/diamond-search?a_aid=69d7c31a91b8d&a_cid=55e51e63&chan=blue_nile_reviews"
                target="_blank" rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  background: "#111",
                  color: "#fff",
                  fontFamily: "var(--body)",
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  padding: "10px 20px",
                  textDecoration: "none",
                  width: "fit-content",
                }}>
                Full Audit
              </a>
            </div>
          </div>
          <div style={{ marginTop: "2rem" }}>
            <Link href="/blue-nile-review"
              style={{ fontFamily: "var(--body)", fontSize: "0.7rem", letterSpacing: "0.16em", textTransform: "uppercase", borderBottom: "1px solid #111", paddingBottom: "2px", textDecoration: "none", color: "#111" }}>
              View All Retailer Reviews →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Knowledge Hub ────────────────────────────────────── */}
      {grid.length > 0 && (
        <section style={{ background: "#e8e5df", padding: "5rem 2rem" }}>
          <div className="max-w-screen-xl mx-auto">
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "3rem" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                  <span style={{ display: "block", width: "32px", height: "1px", background: "#999" }} />
                  <p style={{ fontFamily: "var(--body)", fontSize: "0.7rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#999" }}>
                    Learn &amp; Compare
                  </p>
                </div>
                <h2 style={{ fontFamily: "var(--heading)", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 300, lineHeight: 1.0, color: "#111" }}>
                  Knowledge{" "}
                  <em style={{ fontStyle: "italic", color: "var(--gold)" }}>Hub</em>
                </h2>
              </div>
              <Link href="/category/diamond-buying-guides"
                style={{ fontFamily: "var(--body)", fontSize: "0.7rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "#999", borderBottom: "1px solid #999", paddingBottom: "2px", textDecoration: "none" }}
                className="hidden sm:block">
                All Guides →
              </Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2rem" }} className="grid-cols-2-sm">
              {grid.map((p) => (
                <Link key={p.slug} href={`/${p.slug}`} className="group block" style={{ textDecoration: "none" }}>
                  <div style={{ aspectRatio: "3/2", overflow: "hidden", background: "#ccc", marginBottom: "1rem" }}>
                    {p.featuredImage && (
                      <img src={p.featuredImage} alt={p.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.7s" }}
                        loading="lazy" decoding="async" />
                    )}
                  </div>
                  <p style={{ fontFamily: "var(--body)", fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#999", marginBottom: "8px" }}>
                    {catLabel[p.category] ?? p.category}
                  </p>
                  <p style={{ fontFamily: "var(--heading)", fontSize: "1.1rem", fontWeight: 300, color: "#111", lineHeight: 1.3 }}>
                    {p.title}
                  </p>
                </Link>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: "3.5rem" }}>
              <Link href="/category/diamond-buying-guides"
                style={{
                  display: "inline-block",
                  border: "1px solid #111",
                  color: "#111",
                  fontFamily: "var(--body)",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  padding: "14px 40px",
                  textDecoration: "none",
                }}>
                View All Buying Guides
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Bottom CTA ───────────────────────────────────────── */}
      <div style={{ background: "#dedad3", borderTop: "1px solid #ccc", padding: "3.5rem 2rem" }}>
        <div className="max-w-screen-xl mx-auto"
          style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "2rem" }}>
          <div>
            <h3 style={{ fontFamily: "var(--heading)", fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 300, marginBottom: "4px", color: "#111" }}>
              Ready to find your{" "}
              <em style={{ fontStyle: "italic", color: "var(--gold)" }}>perfect diamond?</em>
            </h3>
            <p style={{ fontFamily: "var(--heading)", fontStyle: "italic", color: "#888", fontSize: "0.95rem" }}>
              We recommend Blue Nile — 40% less than mall jewellers, GIA-certified.
            </p>
          </div>
          <a href="https://www.bluenile.com/diamond-search?a_aid=69d7c31a91b8d&a_cid=55e51e63&chan=homepage-cta"
            target="_blank" rel="noopener noreferrer"
            style={{
              flexShrink: 0,
              display: "inline-block",
              background: "#111",
              color: "#fff",
              fontFamily: "var(--body)",
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              padding: "14px 32px",
              textDecoration: "none",
            }}>
            Shop Blue Nile →
          </a>
        </div>
      </div>

    </div>
  );
}
