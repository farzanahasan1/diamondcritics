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
  const latest = posts.slice(0, 8);

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="text-center px-6 py-24 sm:py-32 border-b border-gray-100">
        <p className="text-xs tracking-widest uppercase text-gray-400 mb-8">
          Objective Expertise
        </p>
        <h1 style={{ fontFamily: "var(--font-heading)" }} className="text-4xl sm:text-5xl lg:text-6xl font-normal text-black max-w-3xl mx-auto leading-tight">
          Stop overpaying for{" "}
          <em className="italic">"invisible" diamond features.</em>
        </h1>
        <p className="mt-8 text-base text-gray-500 max-w-xl mx-auto leading-relaxed">
          Confusing jargon is used to sell grades you can't see. We provide technical audits to help you save thousands without sacrificing brilliance.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-8 text-xs tracking-widest uppercase text-black">
          <Link href="/diamond-clarity-chart" className="border-b border-black pb-0.5 hover:text-gray-500 transition-colors">
            Diamond Audits
          </Link>
          <Link href="/lab-grown-vs-natural-diamond-price" className="border-b border-black pb-0.5 hover:text-gray-500 transition-colors">
            Natural vs Lab Comparison
          </Link>
          <Link href="/diamond-prices" className="border-b border-black pb-0.5 hover:text-gray-500 transition-colors">
            Market Value & Price Trends
          </Link>
        </div>
      </section>

      {/* ── Feature pillars ──────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-20 grid sm:grid-cols-2 gap-16">
        <div>
          <div className="w-8 h-px bg-black mb-6" />
          <h2 style={{ fontFamily: "var(--font-heading)" }} className="text-2xl font-normal mb-4">
            The Eye-Clean <em className="italic">Standard</em>
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            We analyze 4K 360-degree imagery to find SI1 and VS2 diamonds that are eye-clean, avoiding the "Flawless" markup.
          </p>
        </div>
        <div>
          <div className="w-8 h-px bg-black mb-6" />
          <h2 style={{ fontFamily: "var(--font-heading)" }} className="text-2xl font-normal mb-4">
            <em className="italic">Light</em> Performance
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            We critique table, crown, and pavilion angles to ensure maximum fire and brilliance beyond the basic certificate.
          </p>
        </div>
      </section>

      {/* ── Dark section: Expert Audits ───────────────────────── */}
      <section className="bg-black text-white py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs tracking-widest uppercase text-gray-500 text-center mb-4">
            Technical Audits
          </p>
          <h2 style={{ fontFamily: "var(--font-heading)" }} className="text-3xl sm:text-4xl font-normal text-center text-white mb-16">
            Expert Diamond <em className="italic">Audits</em>
          </h2>

          <div className="grid sm:grid-cols-3 gap-1">
            {[
              {
                label: "Mastering the 4Cs",
                href: "/diamond-4cs",
                img: "/images/infographic-for-diamond-4c-clarity.jpg",
              },
              {
                label: "Diamond Prices & Trends",
                href: "/diamond-prices",
                img: "/images/diamond-prices-2026-march-market-crash-report.jpg",
              },
              {
                label: "Clarity Grade Guides",
                href: "/diamond-clarity-chart",
                img: "/images/diamond-clarity-chart-beware-clouds-not-shown-milky.jpg",
              },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="relative aspect-[4/3] overflow-hidden bg-gray-900 group block">
                {item.img && (
                  <img
                    src={item.img}
                    alt={item.label}
                    className="w-full h-full object-cover opacity-40 group-hover:opacity-55 transition-opacity duration-500"
                  />
                )}
                <div className="absolute inset-0 flex items-end p-6">
                  <h3 style={{ fontFamily: "var(--font-heading)" }} className="text-white text-xl font-normal">
                    {item.label}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/category/diamond-buying-guides"
              className="inline-block border border-white text-white text-xs tracking-widest uppercase px-8 py-4 hover:bg-white hover:text-black transition-colors"
            >
              View All Guides
            </Link>
          </div>
        </div>
      </section>

      {/* ── Where to Buy ─────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 py-24">
        <h2 style={{ fontFamily: "var(--font-heading)" }} className="text-3xl sm:text-4xl font-normal text-center mb-16">
          Where to Buy <em className="italic">in 2026</em>
        </h2>

        <div className="border-t border-black">
          {/* Header row */}
          <div className="grid grid-cols-4 py-3 border-b border-gray-200">
            {["RETAILER", "THE VERDICT", "BEST FOR", "ACTION"].map((h) => (
              <span key={h} className="text-xs tracking-widest uppercase text-gray-400 font-medium">{h}</span>
            ))}
          </div>

          {/* Blue Nile row */}
          <div className="grid grid-cols-4 items-center py-7 border-b border-gray-100">
            <span style={{ fontFamily: "var(--font-heading)" }} className="text-2xl font-normal">Blue Nile</span>
            <span className="text-sm font-semibold text-green-700">4.6/5 – TRUSTED ORIGINAL</span>
            <span className="text-sm text-gray-500">Inventory Depth</span>
            <a
              href="https://www.bluenile.com/diamond-search?a_aid=69d7c31a91b8d&a_cid=55e51e63&chan=blue_nile_reviews"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-black text-white text-xs font-semibold tracking-widest uppercase px-5 py-3 hover:bg-gray-800 transition-colors w-fit"
            >
              Full Audit
            </a>
          </div>

          <div className="text-center mt-10">
            <Link
              href="/blue-nile-review"
              className="inline-block border border-black text-black text-xs tracking-widest uppercase px-8 py-4 hover:bg-black hover:text-white transition-colors"
            >
              View All Retailer Reviews
            </Link>
          </div>
        </div>
      </section>

      {/* ── Knowledge Hub ────────────────────────────────────── */}
      <section className="border-t border-gray-100 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 style={{ fontFamily: "var(--font-heading)" }} className="text-3xl sm:text-4xl font-normal text-center mb-16">
            Knowledge <em className="italic">Hub</em>
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {latest.map((post) => (
              <Link key={post.slug} href={`/${post.slug}`} className="group block">
                <div className="aspect-[4/3] bg-gray-100 overflow-hidden mb-4">
                  {post.featuredImage ? (
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <span style={{ fontFamily: "var(--font-heading)" }} className="text-3xl text-gray-300 italic">D◆</span>
                    </div>
                  )}
                </div>
                <span className="text-xs tracking-widest uppercase text-gray-400 block mb-1.5">
                  {categoryLabels[post.category] ?? post.category}
                </span>
                <h3 style={{ fontFamily: "var(--font-heading)" }} className="text-base font-normal text-black group-hover:text-gray-500 transition-colors leading-snug line-clamp-2">
                  {post.title}
                </h3>
              </Link>
            ))}
          </div>

          <div className="text-center mt-14">
            <Link
              href="/category/diamond-buying-guides"
              className="inline-block border border-black text-black text-xs tracking-widest uppercase px-8 py-4 hover:bg-black hover:text-white transition-colors"
            >
              View All Buying Guides
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
