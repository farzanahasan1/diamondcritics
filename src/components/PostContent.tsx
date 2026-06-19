import Link from "next/link";
import type { Post, Page } from "@/lib/content";

const categoryLabels: Record<string, string> = {
  "diamond-buying-guides": "Diamond Buying Guides",
  "diamond-retailer-reviews": "Diamond Retailer Reviews",
  "gemstone-guides": "Gemstone Guides",
  "market-value-price-trends": "Market Value & Price Trends",
};

interface Props {
  type: "post" | "page";
  data: Post | Page;
}

export default function PostContent({ type, data }: Props) {
  const post = data as Post;

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-700">Home</Link>
        {type === "post" && post.category && (
          <>
            <span className="mx-2">›</span>
            <Link href={`/category/${post.category}`} className="hover:text-blue-700">
              {categoryLabels[post.category] ?? post.category}
            </Link>
          </>
        )}
        <span className="mx-2">›</span>
        <span className="text-gray-700">{data.title}</span>
      </nav>

      {/* Header */}
      <header className="mb-10">
        {type === "post" && post.category && (
          <Link
            href={`/category/${post.category}`}
            className="text-xs font-semibold text-blue-700 uppercase tracking-wide hover:underline"
          >
            {categoryLabels[post.category] ?? post.category}
          </Link>
        )}
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
          {data.title}
        </h1>
        {type === "post" && post.publishedAt && (
          <p className="mt-3 text-sm text-gray-500">
            By <strong>Farzana Hasan</strong>, GIA Expert ·{" "}
            {new Date(post.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}
      </header>

      {/* Featured image */}
      {type === "post" && post.featuredImage && (
        <img
          src={post.featuredImage}
          alt={data.title}
          className="w-full rounded-xl mb-10 object-cover max-h-96"
        />
      )}

      {/* Content */}
      <div
        className="prose prose-lg max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h3:text-xl prose-a:text-blue-700 prose-a:font-semibold prose-blockquote:border-blue-700 prose-blockquote:bg-blue-50 prose-blockquote:rounded-r-lg prose-blockquote:py-1 prose-table:text-sm"
        dangerouslySetInnerHTML={{ __html: data.content }}
      />

      {/* Farzana quote footer (posts only) */}
      {type === "post" && (
        <div className="mt-16 border-t pt-8">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Expert Verdict</p>
          <blockquote className="border-l-4 border-blue-700 pl-4 text-gray-700 italic">
            Always audit the stone individually — no grade replaces seeing the actual diamond.
            <footer className="mt-2 text-sm font-semibold not-italic text-gray-900">
              — Farzana Hasan, GIA Expert · DiamondCritics.com
            </footer>
          </blockquote>
        </div>
      )}
    </article>
  );
}
