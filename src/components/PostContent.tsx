import Link from "next/link";
import Image from "next/image";
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
      {/* Blue Nile CTA */}
      <div className="border border-black p-6">
        <p className="text-xs tracking-widest uppercase text-gray-400 mb-2" style={{ fontFamily: "var(--font-poppins)" }}>
          Audited Retailer
        </p>
        <h3 style={{ fontFamily: "var(--font-marcellus)" }} className="text-xl text-black mb-3 leading-tight">
          Blue Nile Diamond Search
        </h3>
        <p className="text-sm text-gray-500 mb-5 leading-relaxed" style={{ fontFamily: "var(--font-poppins)" }}>
          200,000+ GIA-certified diamonds. Use our filters to find eye-clean stones under your budget.
        </p>
        <a
          href="https://www.bluenile.com/diamond-search?a_aid=69d7c31a91b8d&a_cid=55e51e63&chan=blog-informational"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-black text-white text-xs font-semibold text-center py-3.5 tracking-widest uppercase hover:bg-gray-800 transition-colors mb-3"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          Search Diamonds →
        </a>
        <p className="text-xs text-gray-400 text-center" style={{ fontFamily: "var(--font-poppins)" }}>
          Affiliate link — we earn a commission at no cost to you
        </p>
      </div>

      {/* Quick tools */}
      <div className="border border-gray-100 p-6">
        <p className="text-xs tracking-widest uppercase text-gray-400 mb-4" style={{ fontFamily: "var(--font-poppins)" }}>
          Quick Tools
        </p>
        <div className="space-y-2">
          {[
            { label: "Diamond Price Calculator", href: "/diamond-price-calculator" },
            { label: "Resale Value Calculator", href: "/diamond-resale-value-calculator" },
            { label: "Full Clarity Chart", href: "/diamond-clarity-chart" },
            { label: "Color Scale Guide", href: "/diamond-color-scale" },
          ].map((tool) => (
            <Link key={tool.href} href={tool.href}
              className="block text-sm text-gray-600 hover:text-black transition-colors py-1.5 border-b border-gray-50 last:border-0"
              style={{ fontFamily: "var(--font-poppins)" }}>
              {tool.label} →
            </Link>
          ))}
        </div>
      </div>

      {/* Farzana bio */}
      <div className="bg-gray-50 p-6">
        <p className="text-xs tracking-widest uppercase text-gray-400 mb-3" style={{ fontFamily: "var(--font-poppins)" }}>Written by</p>
        <p style={{ fontFamily: "var(--font-marcellus)" }} className="text-lg text-black mb-1">Farzana Hasan</p>
        <p className="text-xs text-gray-500 mb-3" style={{ fontFamily: "var(--font-poppins)" }}>GIA-Certified Diamond Expert</p>
        <p className="text-xs text-gray-500 leading-relaxed" style={{ fontFamily: "var(--font-poppins)" }}>
          Skeptical, data-backed diamond analysis. No sponsored content. No retailer partnerships beyond disclosed affiliates.
        </p>
        <Link href="/about-farzana" className="mt-3 inline-block text-xs font-semibold tracking-widest uppercase text-black border-b border-black" style={{ fontFamily: "var(--font-poppins)" }}>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-gray-400 mb-8" style={{ fontFamily: "var(--font-poppins)" }}>
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
            <span className="text-gray-600 line-clamp-1">{data.title}</span>
          </nav>

          <div className="max-w-3xl">
            {type === "post" && post.category && (
              <Link
                href={`/category/${post.category}`}
                className="text-xs font-semibold tracking-widest uppercase text-gray-400 hover:text-black transition-colors"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                {categoryLabels[post.category] ?? post.category}
              </Link>
            )}
            <h1 style={{ fontFamily: "var(--font-marcellus)" }} className="mt-3 text-3xl sm:text-4xl lg:text-5xl text-black font-normal leading-tight">
              {data.title}
            </h1>
            {type === "post" && (
              <div className="mt-5 flex items-center gap-4 text-xs text-gray-400" style={{ fontFamily: "var(--font-poppins)" }}>
                <span>By <strong className="text-black font-semibold">Farzana Hasan</strong> · GIA Expert</span>
                {post.publishedAt && (
                  <span>
                    {new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Featured image — full width */}
      {type === "post" && post.featuredImage && (
        <div className="w-full bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <img
              src={post.featuredImage}
              alt={data.title}
              className="w-full max-h-[480px] object-cover"
            />
          </div>
        </div>
      )}

      {/* Main content + sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-[1fr_320px] gap-16">
          {/* Article body */}
          <article>
            <div
              className="article-body"
              dangerouslySetInnerHTML={{ __html: data.contentHtml }}
            />

            {/* Farzana expert verdict */}
            {type === "post" && (
              <div className="mt-16 border-t border-gray-100 pt-10">
                <p className="text-xs tracking-widest uppercase text-gray-400 mb-4" style={{ fontFamily: "var(--font-poppins)" }}>
                  Expert Verdict
                </p>
                <blockquote className="!mt-0">
                  <p className="!not-italic">
                    Always audit the stone individually — no grade replaces seeing the actual diamond. The certificate tells you what to look for. Your eyes tell you whether to buy.
                  </p>
                  <footer className="mt-4 text-xs font-semibold tracking-wider uppercase text-gray-600 not-italic" style={{ fontFamily: "var(--font-poppins)" }}>
                    — Farzana Hasan, GIA Expert · DiamondCritics.com
                  </footer>
                </blockquote>
              </div>
            )}

            {/* Blue Nile CTA — inline for mobile */}
            <div className="mt-12 lg:hidden border border-black p-6">
              <p className="text-xs tracking-widest uppercase text-gray-400 mb-2" style={{ fontFamily: "var(--font-poppins)" }}>Audited Retailer</p>
              <h3 style={{ fontFamily: "var(--font-marcellus)" }} className="text-xl text-black mb-4">Search Blue Nile — 200,000+ GIA Diamonds</h3>
              <a
                href="https://www.bluenile.com/diamond-search?a_aid=69d7c31a91b8d&a_cid=55e51e63&chan=blog-informational"
                target="_blank" rel="noopener noreferrer"
                className="block w-full bg-black text-white text-xs font-semibold text-center py-3.5 tracking-widest uppercase"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                Search Diamonds →
              </a>
            </div>
          </article>

          {/* Sidebar — desktop only */}
          <aside className="hidden lg:block">
            <BlueNileSidebar />
          </aside>
        </div>

        {/* Related posts */}
        {related && related.length > 0 && (
          <section className="mt-20 pt-12 border-t border-gray-100">
            <h2 style={{ fontFamily: "var(--font-marcellus)" }} className="text-2xl font-normal text-black mb-8">
              Related Guides
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-0.5 bg-gray-100">
              {related.map((p) => (
                <Link key={p.slug} href={`/${p.slug}`} className="bg-white group block">
                  {p.featuredImage && (
                    <div className="aspect-[3/2] overflow-hidden bg-gray-50">
                      <img src={p.featuredImage} alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-6">
                    <span className="text-xs tracking-widest uppercase text-gray-400" style={{ fontFamily: "var(--font-poppins)" }}>
                      {categoryLabels[p.category] ?? p.category}
                    </span>
                    <h3 style={{ fontFamily: "var(--font-marcellus)" }} className="mt-1.5 text-lg text-black group-hover:text-gray-600 transition-colors line-clamp-2">
                      {p.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
