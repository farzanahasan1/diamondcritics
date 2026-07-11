import type { Metadata } from "next";
import Link from "next/link";
import { getPostsBySubcategory } from "@/lib/content";

const label = "Blue Nile Reviews";
const description =
  "Independent audits of Blue Nile rings, earrings, bracelets, men's jewelry, and lab-grown collections with real prices.";

const wrap: React.CSSProperties = {
  maxWidth: "1280px",
  margin: "0 auto",
  padding: "0 2rem",
};

export const metadata: Metadata = {
  title: "Blue Nile Reviews: Rings, Diamonds & Lab-Grown Prices",
  description,
  alternates: { canonical: "https://diamondcritics.com/category/diamond-retailer-reviews/blue-nile" },
  openGraph: {
    title: "Blue Nile Reviews: Rings, Diamonds & Lab-Grown Prices | Diamond Critics",
    description,
    url: "https://diamondcritics.com/category/diamond-retailer-reviews/blue-nile",
    type: "website",
    siteName: "Diamond Critics",
    images: [{ url: "https://diamondcritics.com/images/diamondcritics-og.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Blue Nile Reviews: Rings, Diamonds & Lab-Grown Prices", description },
};

export default function BlueNileSubcategoryPage() {
  const posts = getPostsBySubcategory("blue-nile");

  return (
    <div style={{ fontFamily: "var(--body)" }}>

      {/* ── Dark hero ── */}
      <div style={{ background: "#141414", padding: "4rem 0 3.5rem" }}>
        <div style={wrap}>
          <nav style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", marginBottom: "2rem" }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>Home</Link>
            <span>/</span>
            <Link href="/category/diamond-retailer-reviews" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>Diamond Retailer Reviews</Link>
            <span>/</span>
            <span style={{ color: "rgba(255,255,255,0.55)" }}>{label}</span>
          </nav>

          <p style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "1rem" }}>
            {posts.length} {posts.length === 1 ? "Guide" : "Guides"}
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
            {label}
          </h1>

          <p style={{ fontFamily: "var(--body)", fontSize: "1rem", color: "rgba(255,255,255,0.5)", maxWidth: "560px", lineHeight: 1.75 }}>
            {description}
          </p>
        </div>
      </div>

      {/* ── Post grid ── */}
      <div style={{ background: "#fff", padding: "4rem 0 6rem" }}>
        <div style={wrap}>
          {posts.length === 0 ? (
            <p style={{ color: "#aaa", fontFamily: "var(--body)" }}>No guides in this category yet.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2.5rem" }} className="cat-grid">
              {posts.map((post) => (
                <Link key={post.slug} href={`/${post.slug}`} style={{ textDecoration: "none", display: "block" }}>
                  {post.featuredImage ? (
                    <div style={{ aspectRatio: "3/2", overflow: "hidden", marginBottom: "1.25rem", background: "#f5f5f5" }}>
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.4s ease" }}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  ) : (
                    <div style={{ aspectRatio: "3/2", background: "#141414", marginBottom: "1.25rem" }} />
                  )}

                  <p style={{ fontFamily: "var(--body)", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.5rem" }}>
                    Blue Nile
                  </p>

                  <h2 style={{ fontFamily: "var(--heading)", fontWeight: 300, fontSize: "clamp(1.1rem, 2vw, 1.35rem)", color: "#111", lineHeight: 1.3, marginBottom: "0.75rem" }}>
                    {post.title}
                  </h2>

                  {post.excerpt && (
                    <p style={{ fontFamily: "var(--body)", fontSize: "0.85rem", color: "#777", lineHeight: 1.65, marginBottom: "1rem",
                      display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {post.excerpt}
                    </p>
                  )}

                  <span style={{ fontFamily: "var(--body)", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#111", borderBottom: "1px solid #111", paddingBottom: "2px" }}>
                    Read Guide →
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
