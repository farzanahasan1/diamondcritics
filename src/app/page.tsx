import Link from "next/link";
import { getAllPosts } from "@/lib/content";

const categoryLabels: Record<string, string> = {
  "diamond-buying-guides": "Diamond Buying Guides",
  "diamond-retailer-reviews": "Diamond Retailer Reviews",
  "gemstone-guides": "Gemstone Guides",
  "market-value-price-trends": "Market Value & Price Trends",
};

export default function HomePage() {
  const posts = getAllPosts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <section className="mb-16 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          Expert Diamond Buying Advice
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Data-backed guides on diamond clarity, color, cut, and value — by{" "}
          <strong>Farzana Hasan</strong>, GIA Expert.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/diamond-4cs" className="bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors">
            The Diamond 4Cs
          </Link>
          <Link href="/diamond-clarity-chart" className="border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            Clarity Chart
          </Link>
          <Link href="/diamond-prices" className="border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            Diamond Prices
          </Link>
          <Link href="/blue-nile-review" className="border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            Blue Nile Review
          </Link>
        </div>
      </section>

      {/* Posts grid */}
      {posts.length > 0 ? (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Latest Guides</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article key={post.slug} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                {post.featuredImage && (
                  <img src={post.featuredImage} alt={post.title} className="w-full h-48 object-cover" />
                )}
                <div className="p-6">
                  <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                    {categoryLabels[post.category] ?? post.category}
                  </span>
                  <h3 className="mt-2 text-lg font-bold text-gray-900 leading-snug">
                    <Link href={`/${post.slug}`} className="hover:text-blue-700 transition-colors">
                      {post.title}
                    </Link>
                  </h3>
                  {post.excerpt && (
                    <p className="mt-2 text-sm text-gray-600 line-clamp-3">{post.excerpt}</p>
                  )}
                  <Link href={`/${post.slug}`} className="mt-4 inline-block text-sm font-medium text-blue-700 hover:underline">
                    Read guide →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : (
        <section className="text-center py-20 text-gray-400">
          <p className="text-lg">Content is being imported. Check back soon.</p>
        </section>
      )}
    </div>
  );
}
