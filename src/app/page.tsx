import Link from "next/link";
import { getAllPosts } from "@/lib/content";

const categoryLabels: Record<string, string> = {
  "diamond-buying-guides": "Diamond Buying Guides",
  "diamond-retailer-reviews": "Retailer Reviews",
  "gemstone-guides": "Gemstone Guides",
  "market-value-price-trends": "Market & Price Trends",
};

export default function HomePage() {
  const posts = getAllPosts();
  const [hero, ...rest] = posts;
  const featured = rest.slice(0, 6);
  const latest = rest.slice(6, 12);

  return (
    <div>
      {/* ── Announcement bar ─────────────────────────────── */}
      <div className="bg-black text-white text-center text-xs py-2.5 tracking-widest uppercase" style={{ fontFamily: "var(--font-poppins)" }}>
        Expert Diamond Advice — GIA-Backed · Data-Driven · Anti-Fluff
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Hero post ────────────────────────────────────── */}
        {hero && (
          <section className="py-12 border-b border-gray-100">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-xs font-semibold tracking-widest uppercase text-gray-400" style={{ fontFamily: "var(--font-poppins)" }}>
                  {categoryLabels[hero.category] ?? hero.category}
                </span>
                <h1 style={{ fontFamily: "var(--font-marcellus)" }} className="mt-3 text-4xl sm:text-5xl lg:text-6xl text-black leading-tight font-normal">
                  {hero.title}
                </h1>
                {hero.excerpt && (
                  <p className="mt-5 text-base text-gray-500 leading-relaxed max-w-lg" style={{ fontFamily: "var(--font-poppins)" }}>
                    {hero.excerpt}
                  </p>
                )}
                <div className="mt-8 flex items-center gap-6">
                  <Link
                    href={`/${hero.slug}`}
                    className="bg-black text-white text-xs font-semibold px-6 py-3.5 tracking-widest uppercase hover:bg-gray-800 transition-colors"
                    style={{ fontFamily: "var(--font-poppins)" }}
                  >
                    Read the Guide
                  </Link>
                  <span className="text-xs text-gray-400" style={{ fontFamily: "var(--font-poppins)" }}>
                    By Farzana Hasan · GIA Expert
                  </span>
                </div>
              </div>
              {hero.featuredImage ? (
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
                  <img
                    src={hero.featuredImage}
                    alt={hero.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center">
                  <span style={{ fontFamily: "var(--font-marcellus)" }} className="text-6xl text-gray-200">◆</span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── Trusted Retailer Banner ───────────────────────── */}
        <section className="py-10 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-xs tracking-widest uppercase text-gray-400 mb-1" style={{ fontFamily: "var(--font-poppins)" }}>Audited Retailer</p>
              <p style={{ fontFamily: "var(--font-marcellus)" }} className="text-2xl text-black">Blue Nile — Our Verified Pick</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://www.bluenile.com/diamond-search?a_aid=69d7c31a91b8d&a_cid=55e51e63&chan=blog-informational"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 border border-black px-5 py-3 hover:bg-black hover:text-white transition-colors group"
              >
                <span className="text-sm font-medium" style={{ fontFamily: "var(--font-poppins)" }}>Search Diamonds</span>
                <span className="text-xs text-gray-400 group-hover:text-gray-300">200,000+ stones →</span>
              </a>
              <Link
                href="/blue-nile-review"
                className="flex items-center gap-2 px-5 py-3 border border-gray-200 hover:border-black transition-colors text-sm"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                Read Our Audit →
              </Link>
            </div>
          </div>
        </section>

        {/* ── Featured grid ────────────────────────────────── */}
        {featured.length > 0 && (
          <section className="py-14 border-b border-gray-100">
            <div className="flex items-baseline justify-between mb-8">
              <h2 style={{ fontFamily: "var(--font-marcellus)" }} className="text-2xl font-normal text-black">
                Latest Guides
              </h2>
              <Link href="/category/diamond-buying-guides" className="text-xs tracking-widest uppercase text-gray-400 hover:text-black transition-colors" style={{ fontFamily: "var(--font-poppins)" }}>
                All Guides →
              </Link>
            </div>

            {/* Large + small 2-col layout */}
            <div className="grid lg:grid-cols-3 gap-0.5 bg-gray-100">
              {/* Big left card */}
              {featured[0] && (
                <div className="lg:col-span-2 bg-white group">
                  <Link href={`/${featured[0].slug}`} className="block">
                    <div className="aspect-[16/9] overflow-hidden bg-gray-50">
                      {featured[0].featuredImage ? (
                        <img src={featured[0].featuredImage} alt={featured[0].title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <span className="text-5xl text-gray-200" style={{ fontFamily: "var(--font-marcellus)" }}>◆</span>
                        </div>
                      )}
                    </div>
                    <div className="p-8">
                      <span className="text-xs tracking-widest uppercase text-gray-400" style={{ fontFamily: "var(--font-poppins)" }}>
                        {categoryLabels[featured[0].category] ?? featured[0].category}
                      </span>
                      <h3 style={{ fontFamily: "var(--font-marcellus)" }} className="mt-2 text-2xl text-black leading-snug group-hover:text-gray-600 transition-colors">
                        {featured[0].title}
                      </h3>
                      {featured[0].excerpt && (
                        <p className="mt-3 text-sm text-gray-500 line-clamp-2 leading-relaxed" style={{ fontFamily: "var(--font-poppins)" }}>
                          {featured[0].excerpt}
                        </p>
                      )}
                      <span className="mt-5 inline-block text-xs font-semibold tracking-widest uppercase text-black border-b border-black pb-0.5" style={{ fontFamily: "var(--font-poppins)" }}>
                        Read →
                      </span>
                    </div>
                  </Link>
                </div>
              )}

              {/* Small right column */}
              <div className="flex flex-col gap-0.5">
                {featured.slice(1, 4).map((post) => (
                  <Link key={post.slug} href={`/${post.slug}`}
                    className="bg-white p-6 flex gap-4 items-start group hover:bg-gray-50 transition-colors flex-1">
                    {post.featuredImage && (
                      <div className="w-20 h-20 flex-shrink-0 overflow-hidden bg-gray-100">
                        <img src={post.featuredImage} alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <span className="text-xs tracking-widest uppercase text-gray-400" style={{ fontFamily: "var(--font-poppins)" }}>
                        {categoryLabels[post.category] ?? post.category}
                      </span>
                      <h3 style={{ fontFamily: "var(--font-marcellus)" }} className="mt-1 text-base text-black leading-snug group-hover:text-gray-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Second row */}
            {featured.slice(4).length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-0.5 bg-gray-100 mt-0.5">
                {featured.slice(4).map((post) => (
                  <Link key={post.slug} href={`/${post.slug}`}
                    className="bg-white group block">
                    <div className="aspect-[3/2] overflow-hidden bg-gray-50">
                      {post.featuredImage ? (
                        <img src={post.featuredImage} alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full bg-gray-100" />
                      )}
                    </div>
                    <div className="p-6">
                      <span className="text-xs tracking-widest uppercase text-gray-400" style={{ fontFamily: "var(--font-poppins)" }}>
                        {categoryLabels[post.category] ?? post.category}
                      </span>
                      <h3 style={{ fontFamily: "var(--font-marcellus)" }} className="mt-1.5 text-lg text-black leading-snug group-hover:text-gray-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── Clarity Quick-Nav ─────────────────────────────── */}
        <section className="py-12 border-b border-gray-100">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-0.5 bg-gray-100">
            {[
              { label: "IF & FL", href: "/if-and-fl-diamond-clarity" },
              { label: "VVS1", href: "/vvs1-diamond-clarity" },
              { label: "VVS2", href: "/vvs2-diamond-clarity" },
              { label: "VS1", href: "/vs1-clarity-diamonds" },
              { label: "VS2", href: "/vs2-clarity-diamond" },
              { label: "SI", href: "/si-clarity-diamond" },
            ].map((item) => (
              <Link key={item.href} href={item.href}
                className="bg-white px-4 py-6 text-center hover:bg-black hover:text-white transition-colors group">
                <span style={{ fontFamily: "var(--font-marcellus)" }} className="text-2xl text-black group-hover:text-white block">
                  {item.label}
                </span>
                <span className="text-xs tracking-widest uppercase text-gray-400 group-hover:text-gray-300 mt-1 block" style={{ fontFamily: "var(--font-poppins)" }}>
                  Clarity
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── More posts ───────────────────────────────────── */}
        {latest.length > 0 && (
          <section className="py-14">
            <h2 style={{ fontFamily: "var(--font-marcellus)" }} className="text-2xl font-normal text-black mb-8">
              More Guides
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {latest.map((post) => (
                <Link key={post.slug} href={`/${post.slug}`} className="group block">
                  <div className="aspect-[4/3] overflow-hidden bg-gray-100 mb-4">
                    {post.featuredImage ? (
                      <img src={post.featuredImage} alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : <div className="w-full h-full bg-gray-50" />}
                  </div>
                  <span className="text-xs tracking-widest uppercase text-gray-400" style={{ fontFamily: "var(--font-poppins)" }}>
                    {categoryLabels[post.category] ?? post.category}
                  </span>
                  <h3 style={{ fontFamily: "var(--font-marcellus)" }} className="mt-1.5 text-base text-black group-hover:text-gray-600 transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
