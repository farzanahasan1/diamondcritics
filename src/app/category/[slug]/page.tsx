import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getPostsByCategory } from "@/lib/content";

const categoryLabels: Record<string, string> = {
  "diamond-buying-guides": "Diamond Buying Guides",
  "diamond-retailer-reviews": "Diamond Retailer Reviews",
  "gemstone-guides": "Gemstone Guides",
  "market-value-price-trends": "Market Value & Price Trends",
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
  return {
    title: `${label} — Diamond Critics`,
    description: `Expert guides on ${label.toLowerCase()} by Farzana Hasan, GIA Expert.`,
    alternates: { canonical: `https://diamondcritics.com/category/${slug}` },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const label = categoryLabels[slug];
  if (!label) notFound();

  const posts = getPostsByCategory(slug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{label}</h1>
      <p className="text-gray-500 mb-10">{posts.length} guide{posts.length !== 1 ? "s" : ""}</p>

      {posts.length === 0 ? (
        <p className="text-gray-400">No posts in this category yet.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.slug} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
              {post.featuredImage && (
                <img src={post.featuredImage} alt={post.title} className="w-full h-48 object-cover" />
              )}
              <div className="p-6">
                <h2 className="text-lg font-bold text-gray-900">
                  <Link href={`/${post.slug}`} className="hover:text-blue-700 transition-colors">
                    {post.title}
                  </Link>
                </h2>
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
      )}
    </div>
  );
}
