import Link from "next/link";
import type { Post, Page, PostMeta } from "@/lib/content";

const categoryLabels: Record<string, string> = {
  "diamond-buying-guides": "Diamond Buying Guides",
  "diamond-retailer-reviews": "Retailer Reviews",
  "gemstone-guides": "Gemstone Guides",
  "market-value-price-trends": "Market & Price Trends",
};

interface Props {
  type: "post" | "page";
  data: Post | Page;
  related?: PostMeta[];
}

function BlueNileSidebar() {
  return (
    <div className="sticky top-24 space-y-6">
      <div className="border border-black p-6">
        <p
          className="text-xs tracking-widest uppercase mb-2"
          style={{ fontFamily: "var(--body)", color: "var(--muted)" }}
        >
          Audited Retailer
        </p>
        <h3
          className="text-xl mb-1 leading-tight"
          style={{ fontFamily: "var(--heading)", fontWeight: 300 }}
        >
          Blue Nile Diamond Search
        </h3>
        <p
          className="text-xs mb-1"
          style={{
            fontFamily: "var(--heading)",
            fontStyle: "italic",
            color: "var(--muted)",
            fontSize: "0.95rem",
          }}
        >
          200,000+ GIA-certified stones
        </p>
        <p
          className="text-sm mb-5 leading-relaxed mt-3"
          style={{ color: "var(--muted)", fontFamily: "var(--body)" }}
        >
          Use our filters to find eye-clean diamonds under your budget.
        </p>
        <a
          href="https://www.bluenile.com/diamond-search?a_aid=69d7c31a91b8d&a_cid=55e51e63&chan=blog-informational"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-white text-xs font-semibold text-center py-3.5 tracking-widest uppercase hover:opacity-80 transition-opacity mb-3"
          style={{ background: "var(--ink)", fontFamily: "var(--body)" }}
        >
          Search Diamonds →
        </a>
        <p
          className="text-xs text-center"
          style={{ color: "var(--muted)", fontFamily: "var(--body)" }}
        >
          Affiliate link — no extra cost to you
        </p>
      </div>

      <div className="border border-gray-100 p-6">
        <p
          className="text-xs tracking-widest uppercase mb-4"
          style={{ fontFamily: "var(--body)", color: "var(--muted)" }}
        >
          Quick Tools
        </p>
        <div className="space-y-2">
          {[
            { label: "Diamond Price Calculator", href: "/diamond-price-calculator" },
            { label: "Resale Value Calculator", href: "/diamond-resale-value-calculator" },
            { label: "Full Clarity Chart", href: "/diamond-clarity-chart" },
            { label: "Color Scale Guide", href: "/diamond-color-scale" },
          ].map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="block text-sm hover:text-black transition-colors py-1.5 border-b border-gray-50 last:border-0"
              style={{ color: "var(--muted)", fontFamily: "var(--body)" }}
            >
              {tool.label} →
            </Link>
          ))}
        </div>
      </div>

      <div className="p-6" style={{ background: "var(--cream)" }}>
        <p
          className="text-xs tracking-widest uppercase mb-3"
          style={{ fontFamily: "var(--body)", color: "var(--muted)" }}
        >
          Written by
        </p>
        <p
          className="text-lg mb-0.5"
          style={{ fontFamily: "var(--heading)", fontWeight: 300 }}
        >
          Farzana Hasan
        </p>
        <p
          className="text-xs mb-3"
          style={{
            fontFamily: "var(--heading)",
            fontStyle: "italic",
            color: "var(--gold)",
          }}
        >
          GIA-Certified Diamond Expert
        </p>
        <p
          className="text-xs leading-relaxed"
          style={{ color: "var(--muted)", fontFamily: "var(--body)" }}
        >
          Skeptical, data-backed diamond analysis. No sponsored content. No retailer partnerships beyond disclosed affiliates.
        </p>
        <Link
          href="/about-farzana"
          className="mt-3 inline-block text-xs font-semibold tracking-widest uppercase border-b"
          style={{ fontFamily: "var(--body)", borderColor: "var(--ink)" }}
        >
          Full Bio →
        </Link>
      </div>
    </div>
  );
}

export default function PostContent({ type, data, related }: Props) {
  const post = data as Post;

  return (
    <>
      {/* Article header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-screen-xl mx-auto px-6 sm:px-8 py-12">
          <nav
            className="flex items-center gap-2 text-xs mb-8"
            style={{ fontFamily: "var(--body)", color: "var(--muted)" }}
          >
            <Link href="/" className="hover:text-black transition-colors">Home</Link>
            {type === "post" && post.category && (
              <>
                <span>/</span>
                <Link href={`/category/${post.category}`} className="hover:text-black transition-colors">
                  {categoryLabels[post.category] ?? post.category}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="line-clamp-1" style={{ color: "var(--ink)" }}>{data.title}</span>
          </nav>

          <div className="max-w-3xl">
            {type === "post" && post.category && (
              <div className="flex items-center gap-3 mb-5">
                <span className="block w-8 h-px" style={{ background: "var(--gold)" }} />
                <Link
                  href={`/category/${post.category}`}
                  className="text-xs font-semibold tracking-widest uppercase hover:text-black transition-colors"
                  style={{ fontFamily: "var(--body)", color: "var(--gold)" }}
                >
                  {categoryLabels[post.category] ?? post.category}
                </Link>
              </div>
            )}
            <h1
              className="font-light leading-tight mb-4"
              style={{
                fontFamily: "var(--heading)",
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              {data.title}
            </h1>
            {type === "post" && (
              <div
                className="flex flex-wrap items-center gap-4 text-xs"
                style={{ fontFamily: "var(--body)", color: "var(--muted)" }}
              >
                <span>
                  By{" "}
                  <em
                    style={{
                      fontFamily: "var(--heading)",
                      fontStyle: "italic",
                      color: "var(--ink)",
                      fontSize: "1rem",
                    }}
                  >
                    Farzana Hasan
                  </em>{" "}
                  · GIA Expert
                </span>
                {post.publishedAt && (
                  <span>
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Featured image */}
      {type === "post" && post.featuredImage && (
        <div className="w-full" style={{ background: "var(--cream)" }}>
          <div className="max-w-screen-xl mx-auto">
            <img
              src={post.featuredImage}
              alt={data.title}
              className="w-full max-h-[520px] object-cover"
            />
          </div>
        </div>
      )}

      {/* Main content + sidebar */}
      <div className="max-w-screen-xl mx-auto px-6 sm:px-8 py-14">
        <div className="grid lg:grid-cols-[1fr_300px] gap-16">
          <article>
            <div className="prose-article" dangerouslySetInnerHTML={{ __html: data.contentHtml }} />

            {type === "post" && (
              <div className="mt-16 border-t border-gray-100 pt-10">
                <p
                  className="text-xs tracking-widest uppercase mb-4"
                  style={{ fontFamily: "var(--body)", color: "var(--muted)" }}
                >
                  Expert Verdict
                </p>
                <blockquote>
                  <p>
                    Always audit the stone individually — no grade replaces seeing the actual diamond. The certificate tells you what to look for. Your eyes tell you whether to buy.
                  </p>
                </blockquote>
                <p
                  className="mt-4 text-xs"
                  style={{
                    fontFamily: "var(--heading)",
                    fontStyle: "italic",
                    color: "var(--muted)",
                  }}
                >
                  — Farzana Hasan, GIA Expert · DiamondCritics.com
                </p>
              </div>
            )}

            {/* Blue Nile CTA — mobile only */}
            <div className="mt-12 lg:hidden border border-black p-6">
              <p
                className="text-xs tracking-widest uppercase mb-2"
                style={{ fontFamily: "var(--body)", color: "var(--muted)" }}
              >
                Audited Retailer
              </p>
              <h3
                className="text-xl mb-4"
                style={{ fontFamily: "var(--heading)", fontWeight: 300 }}
              >
                Search Blue Nile — 200,000+ GIA Diamonds
              </h3>
              <a
                href="https://www.bluenile.com/diamond-search?a_aid=69d7c31a91b8d&a_cid=55e51e63&chan=blog-informational"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-white text-xs font-semibold text-center py-3.5 tracking-widest uppercase hover:opacity-80 transition-opacity"
                style={{ background: "var(--ink)", fontFamily: "var(--body)" }}
              >
                Search Diamonds →
              </a>
            </div>
          </article>

          <aside className="hidden lg:block">
            <BlueNileSidebar />
          </aside>
        </div>

        {related && related.length > 0 && (
          <section className="mt-20 pt-12 border-t border-gray-100">
            <h2
              className="font-light mb-10"
              style={{
                fontFamily: "var(--heading)",
                fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
              }}
            >
              Related <em className="italic" style={{ color: "var(--gold)" }}>Guides</em>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((p) => (
                <Link key={p.slug} href={`/${p.slug}`} className="group block">
                  {p.featuredImage && (
                    <div className="aspect-[3/2] overflow-hidden bg-gray-100 mb-4">
                      <img
                        src={p.featuredImage}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="block w-4 h-px" style={{ background: "var(--gold)" }} />
                    <span
                      className="text-xs tracking-widest uppercase"
                      style={{ color: "var(--gold)", fontFamily: "var(--body)" }}
                    >
                      {categoryLabels[p.category] ?? p.category}
                    </span>
                  </div>
                  <h3
                    className="font-light leading-snug group-hover:opacity-60 transition-opacity line-clamp-2"
                    style={{ fontFamily: "var(--heading)", fontSize: "1.2rem", lineHeight: 1.3 }}
                  >
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
