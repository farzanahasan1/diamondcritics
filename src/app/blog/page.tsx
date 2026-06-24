import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "All Diamond Guides — Diamond Critics",
  description:
    "Every guide, review, and analysis by Farzana Hasan — GIA-certified diamond gemologist. Browse by category: round diamond, buying guides, retailer reviews, and more.",
  alternates: { canonical: "https://diamondcritics.com/blog" },
  openGraph: {
    title: "All Diamond Guides — Diamond Critics",
    description:
      "Every guide, review, and analysis by Farzana Hasan — GIA-certified diamond gemologist. Browse by category.",
    url: "https://diamondcritics.com/blog",
    type: "website",
    siteName: "Diamond Critics",
  },
};

const categoryLabels: Record<string, string> = {
  "round-cut-diamond": "Round Cut Diamond",
  "diamond-buying-guides": "Diamond Buying Guides",
  "diamond-retailer-reviews": "Retailer Reviews",
  "market-value-price-trends": "Market Value & Price Trends",
  "gemstone-guides": "Gemstone Guides",
};

const categoryDescriptions: Record<string, string> = {
  "round-cut-diamond":
    "The complete round brilliant series — price audits, color grades, clarity grades, settings, and lab vs natural comparisons.",
  "diamond-buying-guides":
    "Data-backed guides on the 4 Cs, certifications, and what to actually check before you buy.",
  "diamond-retailer-reviews":
    "Independent audits of Blue Nile, James Allen, and other online diamond retailers.",
  "market-value-price-trends":
    "Real price data, resale trends, and live market analysis.",
  "gemstone-guides":
    "Expert analysis of sapphires, rubies, emeralds, and other precious stones.",
};

const wrap: React.CSSProperties = {
  maxWidth: "1280px",
  margin: "0 auto",
  padding: "0 2rem",
};

export default function BlogPage() {
  const allPosts = getAllPosts();
  const totalCount = allPosts.length;

  // Group posts by category, preserving order within each group
  const grouped: Record<string, typeof allPosts> = {};
  for (const post of allPosts) {
    const cat = post.category || "diamond-buying-guides";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(post);
  }

  // Sort categories by number of posts descending
  const sortedCategories = Object.keys(grouped).sort(
    (a, b) => grouped[b].length - grouped[a].length
  );

  return (
    <div style={{ fontFamily: "var(--body)" }}>

      {/* ── Dark hero ── */}
      <div style={{ background: "#141414", padding: "4rem 0 3.5rem" }}>
        <div style={wrap}>
          <nav style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", marginBottom: "2rem" }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>Home</Link>
            <span>/</span>
            <span style={{ color: "rgba(255,255,255,0.55)" }}>All Guides</span>
          </nav>

          <p style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "1rem" }}>
            {totalCount} Guides · {sortedCategories.length} Categories
          </p>

          <h1 style={{
            fontFamily: "var(--heading)",
            fontWeight: 300,
            color: "#fff",
            fontSize: "clamp(2.2rem, 5vw, 3.75rem)",
            lineHeight: 1.08,
            letterSpacing: "-0.025em",
            maxWidth: "800px",
            marginBottom: "1.5rem",
          }}>
            All Guides & Reviews
          </h1>

          <p style={{ fontFamily: "var(--body)", fontSize: "1rem", color: "rgba(255,255,255,0.5)", maxWidth: "560px", lineHeight: 1.75 }}>
            Every guide written by Farzana Hasan, GIA-certified diamond gemologist. Independent analysis. No sponsored content.
          </p>
        </div>
      </div>

      {/* ── Category jump links ── */}
      <div style={{ background: "#fafafa", borderBottom: "1px solid #ebebeb", padding: "1.25rem 0" }}>
        <div style={{ ...wrap, display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#aaa" }}>
            Jump to:
          </span>
          {sortedCategories.map((cat) => (
            <a
              key={cat}
              href={`#${cat}`}
              style={{
                fontFamily: "var(--body)",
                fontSize: "0.8rem",
                color: "#555",
                textDecoration: "none",
                borderBottom: "1px solid #ddd",
                paddingBottom: "1px",
              }}
            >
              {categoryLabels[cat] ?? cat} ({grouped[cat].length})
            </a>
          ))}
        </div>
      </div>

      {/* ── Post sections by category ── */}
      <div style={{ background: "#fff", padding: "3rem 0 6rem" }}>
        <div style={wrap}>
          {sortedCategories.map((cat, i) => {
            const posts = grouped[cat];
            const label = categoryLabels[cat] ?? cat;
            const desc = categoryDescriptions[cat];

            return (
              <section
                key={cat}
                id={cat}
                style={{
                  borderTop: i === 0 ? "none" : "1px solid #ebebeb",
                  paddingTop: i === 0 ? "0" : "3.5rem",
                  marginTop: i === 0 ? "0" : "3.5rem",
                }}
              >
                {/* Category header */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "2rem", marginBottom: "2rem", flexWrap: "wrap" }}>
                  <div style={{ flex: "1 1 400px" }}>
                    <p style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.5rem" }}>
                      {posts.length} {posts.length === 1 ? "Guide" : "Guides"}
                    </p>
                    <h2 style={{
                      fontFamily: "var(--heading)",
                      fontWeight: 300,
                      fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                      color: "#111",
                      letterSpacing: "-0.02em",
                      lineHeight: 1.15,
                      marginBottom: desc ? "0.75rem" : 0,
                    }}>
                      {label}
                    </h2>
                    {desc && (
                      <p style={{ fontFamily: "var(--body)", fontSize: "0.88rem", color: "#777", lineHeight: 1.7, maxWidth: "560px" }}>
                        {desc}
                      </p>
                    )}
                  </div>
                  <Link
                    href={`/category/${cat}`}
                    style={{
                      alignSelf: "flex-end",
                      fontFamily: "var(--body)",
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "#111",
                      textDecoration: "none",
                      borderBottom: "1px solid #111",
                      paddingBottom: "2px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    View Category →
                  </Link>
                </div>

                {/* Post list — two columns */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "0",
                }}
                  className="blog-list-grid"
                >
                  {posts.map((post, idx) => (
                    <Link
                      key={post.slug}
                      href={`/${post.slug}`}
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: "0.75rem",
                        padding: "0.85rem 0",
                        borderTop: "1px solid #f0f0f0",
                        textDecoration: "none",
                        borderLeft: idx % 2 === 1 ? "none" : "none",
                      }}
                      className="blog-post-row"
                    >
                      <span style={{
                        fontFamily: "var(--body)",
                        fontSize: "0.65rem",
                        fontWeight: 600,
                        color: "#ccc",
                        minWidth: "28px",
                        flexShrink: 0,
                        letterSpacing: "0.04em",
                      }}>
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span style={{
                        fontFamily: "var(--body)",
                        fontSize: "0.88rem",
                        color: "#333",
                        lineHeight: 1.45,
                      }}
                        className="blog-post-title"
                      >
                        {post.title}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>

    </div>
  );
}
