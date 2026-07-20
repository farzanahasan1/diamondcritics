import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getPostsByCategory, getPostsBySubcategory } from "@/lib/content";

const categoryLabels: Record<string, string> = {
  "diamond-buying-guides": "Diamond Buying Guides",
  "diamond-retailer-reviews": "Diamond Retailer Reviews",
  "blue-nile": "Blue Nile Reviews",
  "gemstone-guides": "Gemstone Guides",
  "market-value-price-trends": "Market Value & Price Trends",
  "round-cut-diamond": "Round Cut Diamond",
  "princess-cut-diamond": "Princess Cut Diamond",
  "oval-cut-diamond": "Oval Cut Diamond",
  "pear-cut-diamond": "Pear Cut Diamond",
  "cushion-cut-diamond": "Cushion Cut Diamond",
  "emerald-cut-diamond": "Emerald Cut Diamond",
};

const categoryDescriptions: Record<string, string> = {
  "diamond-buying-guides": "Data-backed guides on the 4 Cs, certifications, and what to actually look for before you buy.",
  "diamond-retailer-reviews": "Independent audits of online diamond retailers — pricing, inventory, and customer experience.",
  "blue-nile": "Independent audits of Blue Nile rings, earrings, bracelets, men's jewelry, and lab-grown collections with real prices.",
  "gemstone-guides": "Expert analysis of sapphires, rubies, emeralds, and other precious stones.",
  "market-value-price-trends": "Real price data, resale trends, and what's happening in the diamond market right now.",
  "round-cut-diamond": "Farzana Hasan's complete round brilliant guide series — 1ct price audit, settings comparison, hearts & arrows verdict, lab-grown savings, and round vs oval analysis.",
  "princess-cut-diamond": "Farzana Hasan's complete princess cut diamond series — 1ct price audit, corner clarity trap, ideal proportions, settings guide, and princess vs round analysis.",
  "oval-cut-diamond": "Farzana Hasan's complete oval cut diamond series — 1ct to 3ct price audits, the bow-tie effect explained, ideal L/W ratios, and real Blue Nile stone data.",
  "pear-cut-diamond": "Pear diamond buying guides by Farzana Hasan: solitaire settings from $1,255, three-stone rings from $1,820, ideal L/W ratios, bow-tie audit, and real Blue Nile prices by carat.",
  "cushion-cut-diamond": "Cushion cut diamond buying guides by Farzana Hasan: elongated vs standard cushion explained, real Blue Nile prices from $1,891 natural and $1,422 lab-grown, halo and solitaire settings, and carat-by-carat price audits.",
  "emerald-cut-diamond": "Emerald cut diamond buying guides by Farzana Hasan: the hall-of-mirrors effect explained, VS1 clarity rule, ideal L/W ratios, real certified market prices from 1ct to 5ct, settings, lab-grown savings, and every style covered.",
};

const categorySeoTitles: Record<string, string> = {
  "pear-cut-diamond": "Pear Cut Diamond: Buying Guides, Settings & Prices",
  "cushion-cut-diamond": "Cushion Cut Diamond: Buying Guides, Prices & Settings",
  "emerald-cut-diamond": "Emerald Cut Diamond: Buying Guides, Prices & Settings",
};

const SUBCATEGORY_SLUGS = new Set(["blue-nile"]);

const wrap: React.CSSProperties = {
  maxWidth: "1280px",
  margin: "0 auto",
  padding: "0 2rem",
};

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(categoryLabels).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const label = categoryLabels[slug];
  if (!label) return {};
  const description = categoryDescriptions[slug] ?? `Expert guides on ${label.toLowerCase()} by Farzana Hasan, GIA Expert.`;
  const seoTitle = categorySeoTitles[slug] ?? label;
  const ogImage =
    slug === "pear-cut-diamond"
      ? { url: "https://diamondcritics.com/images/pear-shaped-diamond-ring.avif", width: 1500, height: 1000 }
      : slug === "cushion-cut-diamond"
      ? { url: "https://diamondcritics.com/images/og/elongated-cushion-cut-diamond-featured.jpg", width: 1200, height: 630 }
      : slug === "emerald-cut-diamond"
      ? { url: "https://diamondcritics.com/images/Emerald-Cut-Diamond-The-Complete-2026-Buying-Guide-Hall-of-Mirrors-Prices-Clarity-Rules.avif", width: 1500, height: 1000 }
      : { url: "https://diamondcritics.com/images/diamondcritics-og.png", width: 1200, height: 630 };

  return {
    title: seoTitle,
    description,
    alternates: { canonical: `https://diamondcritics.com/category/${slug}` },
    openGraph: {
      title: `${seoTitle} | Diamond Critics`,
      description,
      url: `https://diamondcritics.com/category/${slug}`,
      type: "website",
      siteName: "Diamond Critics",
      images: [ogImage],
    },
    twitter: { card: "summary_large_image", title: seoTitle, description },
  };
}

const categoryH1s: Record<string, string> = {
  "pear-cut-diamond": "Pear Cut Diamond Rings: Complete Buying Guides",
  "cushion-cut-diamond": "Cushion Cut Diamond: Complete Buying Guides",
  "emerald-cut-diamond": "Emerald Cut Diamond: Complete Buying Guides",
};

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const label = categoryLabels[slug];
  if (!label) notFound();

  const posts = SUBCATEGORY_SLUGS.has(slug)
    ? getPostsBySubcategory(slug)
    : getPostsByCategory(slug);

  const h1 = categoryH1s[slug] ?? label;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://diamondcritics.com" },
      { "@type": "ListItem", position: 2, name: label, item: `https://diamondcritics.com/category/${slug}` },
    ],
  };

  return (
    <div style={{ fontFamily: "var(--body)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Dark hero ── */}
      <div style={{ background: "#141414", padding: "4rem 0 3.5rem" }}>
        <div style={wrap}>
          <nav aria-label="Breadcrumb" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", marginBottom: "2rem" }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>Home</Link>
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
            {h1}
          </h1>

          <p style={{ fontFamily: "var(--body)", fontSize: "1rem", color: "rgba(255,255,255,0.5)", maxWidth: "560px", lineHeight: 1.75 }}>
            {categoryDescriptions[slug]}
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
                    {label}
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
