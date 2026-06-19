import Link from "next/link";
import type { Post, Page, PostMeta } from "@/lib/content";
import DiamondQuiz from "@/components/DiamondQuiz";
import ReadingProgress from "@/components/ReadingProgress";

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

const wrap: React.CSSProperties = {
  maxWidth: "1280px",
  margin: "0 auto",
  padding: "0 2rem",
};

function BlueNileSidebar() {
  return (
    <div>

      {/* Blue Nile box */}
      <div style={{ border: "1px solid #e5e5e3", padding: "1.5rem", background: "#fff", marginBottom: "1.5rem" }}>
        <p style={{ fontFamily: "var(--body)", fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#888", marginBottom: "6px" }}>
          Audited Retailer
        </p>
        <h3 style={{ fontFamily: "var(--heading)", fontSize: "1.25rem", fontWeight: 300, color: "#111", marginBottom: "4px", lineHeight: 1.2 }}>
          Blue Nile Diamond Search
        </h3>
        <p style={{ fontFamily: "var(--heading)", fontStyle: "italic", color: "var(--gold)", fontSize: "0.9rem", marginBottom: "0.75rem" }}>
          200,000+ GIA-certified stones
        </p>
        <p style={{ fontFamily: "var(--body)", fontSize: "0.82rem", color: "#888", lineHeight: 1.6, marginBottom: "1.25rem" }}>
          Use filters to find eye-clean diamonds under your budget.
        </p>
        <a href="https://www.bluenile.com/diamond-search?a_aid=69d7c31a91b8d&a_cid=55e51e63&chan=blog-informational"
          target="_blank" rel="noopener noreferrer"
          style={{ display: "block", width: "100%", background: "#141414", color: "#fff", fontFamily: "var(--body)", fontSize: "0.72rem", fontWeight: 600, textAlign: "center", padding: "13px", textDecoration: "none", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "10px" }}>
          Search Diamonds →
        </a>
        <p style={{ fontFamily: "var(--body)", fontSize: "0.72rem", color: "#bbb", textAlign: "center" }}>
          Affiliate link — no extra cost to you
        </p>
      </div>

      {/* Quick Tools */}
      <div style={{ border: "1px solid #f0f0f0", padding: "1.5rem", marginBottom: "1.5rem" }}>
        <p style={{ fontFamily: "var(--body)", fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#aaa", marginBottom: "1rem" }}>
          Quick Tools
        </p>
        <div>
          {[
            { label: "Diamond Price Calculator", href: "/diamond-price-calculator" },
            { label: "Resale Value Calculator", href: "/diamond-resale-value-calculator" },
            { label: "Full Clarity Chart", href: "/diamond-clarity-chart" },
            { label: "Color Scale Guide", href: "/diamond-color-scale" },
          ].map((tool) => (
            <Link key={tool.href} href={tool.href}
              style={{ display: "block", fontFamily: "var(--body)", fontSize: "0.85rem", color: "#777", padding: "10px 0", textDecoration: "none", borderBottom: "1px solid #f5f5f5" }}>
              {tool.label} →
            </Link>
          ))}
        </div>
      </div>

      {/* Author */}
      <div style={{ padding: "1.5rem", background: "var(--cream)" }}>
        <p style={{ fontFamily: "var(--body)", fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#aaa", marginBottom: "0.75rem" }}>
          Written by
        </p>
        <p style={{ fontFamily: "var(--heading)", fontSize: "1.15rem", fontWeight: 300, color: "#111", marginBottom: "3px" }}>
          Farzana Hasan
        </p>
        <p style={{ fontFamily: "var(--heading)", fontStyle: "italic", color: "var(--gold)", fontSize: "0.82rem", marginBottom: "0.75rem" }}>
          GIA-Certified Diamond Expert
        </p>
        <p style={{ fontFamily: "var(--body)", fontSize: "0.78rem", color: "#888", lineHeight: 1.6, marginBottom: "0.75rem" }}>
          Skeptical, data-backed diamond analysis. No sponsored content.
        </p>
        <Link href="/about-farzana"
          style={{ fontFamily: "var(--body)", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#111", textDecoration: "none", borderBottom: "1px solid #111", paddingBottom: "2px" }}>
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
    <div style={{ fontFamily: "var(--body)" }}>

      {/* Reading progress bar — posts only */}
      {type === "post" && <ReadingProgress />}

      {/* ── Dark hero ─────────────────────────────────────── */}
      <div style={{ background: "#141414", padding: "4rem 0 3.5rem" }}>
        <div style={wrap}>

          {/* Breadcrumb */}
          <nav style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "var(--body)", fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", marginBottom: "2rem" }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>Home</Link>
            {type === "post" && post.category && (
              <>
                <span>/</span>
                <Link href={`/category/${post.category}`} style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>
                  {categoryLabels[post.category] ?? post.category}
                </Link>
              </>
            )}
            <span>/</span>
            <span style={{ color: "rgba(255,255,255,0.55)" }}>{data.title}</span>
          </nav>

          {/* Category badge + read time */}
          {type === "post" && post.category && (
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "2rem" }}>
              <span style={{ fontFamily: "var(--body)", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#fff", border: "1px solid #444", padding: "4px 12px" }}>
                {catShort[post.category] ?? post.category}
              </span>
              <span style={{ fontFamily: "var(--body)", fontSize: "0.72rem", color: "rgba(255,255,255,0.4)" }}>
                {readTime} min read
              </span>
            </div>
          )}

          {/* Big white heading */}
          <h1 style={{
            fontFamily: "var(--heading)",
            fontWeight: 300,
            color: "#fff",
            lineHeight: 1.05,
            letterSpacing: "-0.025em",
            fontSize: "clamp(2.2rem, 5vw, 4rem)",
            maxWidth: "900px",
            marginBottom: "2rem",
          }}>
            {data.title}
          </h1>

          {/* Excerpt */}
          {type === "post" && post.excerpt && (
            <p style={{
              fontFamily: "var(--body)",
              fontSize: "1.05rem",
              color: "rgba(255,255,255,0.6)",
              lineHeight: 1.75,
              maxWidth: "640px",
              marginBottom: "2.5rem",
            }}>
              {post.excerpt}
            </p>
          )}

          {/* Divider */}
          <div style={{ borderTop: "1px solid #333", marginBottom: "2rem" }} />

          {/* Author + date */}
          {type === "post" && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "40px", height: "40px", background: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--body)", fontSize: "0.85rem", fontWeight: 600, color: "#fff", flexShrink: 0 }}>
                  F
                </div>
                <div>
                  <p style={{ fontFamily: "var(--heading)", fontSize: "0.95rem", fontWeight: 300, color: "#fff" }}>Farzana Hasan</p>
                  <p style={{ fontFamily: "var(--body)", fontSize: "0.72rem", color: "rgba(255,255,255,0.4)" }}>
                    GIA-Certified Diamond Expert · DiamondCritics.com
                  </p>
                </div>
              </div>
              {post.publishedAt && (
                <p style={{ fontFamily: "var(--body)", fontSize: "0.72rem", color: "rgba(255,255,255,0.4)" }}>
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric", month: "long", day: "numeric"
                  })}
                </p>
              )}
            </div>
          )}

        </div>
      </div>

      {/* ── Article body + sidebar ───────────────────────── */}
      <div style={{ background: "#fff", padding: "4rem 0 5rem" }}>
        <div style={wrap}>
          <div className="article-grid">

            {/* Main article */}
            <article>
              {(() => {
                const html = data.contentHtml;
                // Find the first <h2 to split intro from body
                const h2Index = html.indexOf("<h2");
                if (type === "post" && h2Index > 0) {
                  const intro = html.slice(0, h2Index);
                  const body = html.slice(h2Index);
                  return (
                    <>
                      <div className="prose-article" dangerouslySetInnerHTML={{ __html: intro }} />
                      <DiamondQuiz />
                      <div className="prose-article" dangerouslySetInnerHTML={{ __html: body }} />
                    </>
                  );
                }
                return <div className="prose-article" dangerouslySetInnerHTML={{ __html: html }} />;
              })()}

              {/* Expert verdict */}
              {type === "post" && (
                <div style={{ marginTop: "4rem", borderTop: "1px solid #f0f0f0", paddingTop: "2.5rem" }}>
                  <p style={{ fontFamily: "var(--body)", fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#888", marginBottom: "1rem" }}>
                    Expert Verdict
                  </p>
                  <blockquote>
                    <p>
                      Always audit the stone individually — no grade replaces seeing the actual diamond.
                      The certificate tells you what to look for. Your eyes tell you whether to buy.
                    </p>
                  </blockquote>
                  <p style={{ marginTop: "1rem", fontFamily: "var(--heading)", fontStyle: "italic", fontSize: "0.85rem", color: "#888" }}>
                    — Farzana Hasan, GIA Expert · DiamondCritics.com
                  </p>
                </div>
              )}

              {/* Blue Nile CTA — mobile only */}
              <div className="article-mobile-cta" style={{ marginTop: "3rem", border: "1px solid #111", padding: "1.5rem" }}>
                <p style={{ fontFamily: "var(--body)", fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#888", marginBottom: "8px" }}>
                  Audited Retailer
                </p>
                <h3 style={{ fontFamily: "var(--heading)", fontSize: "1.25rem", fontWeight: 300, color: "#111", marginBottom: "1rem" }}>
                  Search Blue Nile — 200,000+ GIA Diamonds
                </h3>
                <a href="https://www.bluenile.com/diamond-search?a_aid=69d7c31a91b8d&a_cid=55e51e63&chan=blog-informational"
                  target="_blank" rel="noopener noreferrer"
                  style={{ display: "block", width: "100%", background: "#141414", color: "#fff", fontFamily: "var(--body)", fontSize: "0.72rem", fontWeight: 600, textAlign: "center", padding: "13px", textDecoration: "none", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                  Search Diamonds →
                </a>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="article-sidebar-wrap" style={{ position: "sticky", top: "6rem" }}>
              <BlueNileSidebar />
            </aside>

          </div>

          {/* Related posts */}
          {related && related.length > 0 && (
            <section style={{ marginTop: "5rem", paddingTop: "3rem", borderTop: "1px solid #f0f0f0" }}>
              <h2 style={{ fontFamily: "var(--heading)", fontWeight: 300, fontSize: "clamp(1.5rem, 3vw, 2.2rem)", marginBottom: "2.5rem", color: "#111" }}>
                Related <em style={{ fontStyle: "italic", color: "var(--gold)" }}>Guides</em>
              </h2>
              <div className="related-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem" }}>
                {related.map((p) => (
                  <Link key={p.slug} href={`/${p.slug}`} style={{ textDecoration: "none", display: "block" }}>
                    {p.featuredImage && (
                      <div style={{ aspectRatio: "3/2", overflow: "hidden", marginBottom: "1rem", background: "#f0f0f0" }}>
                        <img src={p.featuredImage} alt={p.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                          loading="lazy" decoding="async" />
                      </div>
                    )}
                    <p style={{ fontFamily: "var(--body)", fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "8px" }}>
                      {categoryLabels[p.category] ?? p.category}
                    </p>
                    <h3 style={{ fontFamily: "var(--heading)", fontWeight: 300, fontSize: "1.15rem", color: "#111", lineHeight: 1.3 }}>
                      {p.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </section>
          )}

        </div>
      </div>

    </div>
  );
}
