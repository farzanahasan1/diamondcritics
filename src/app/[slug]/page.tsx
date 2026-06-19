import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllPostSlugs,
  getAllPageSlugs,
  getPostBySlug,
  getPageBySlug,
  getRelatedPosts,
} from "@/lib/content";
import PostContent from "@/components/PostContent";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return [
    ...getAllPostSlugs().map((slug) => ({ slug })),
    ...getAllPageSlugs().map((slug) => ({ slug })),
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug) ?? getPageBySlug(slug);
  if (!post) return {};
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription,
    alternates: { canonical: `https://diamondcritics.com/${slug}` },
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription,
      url: `https://diamondcritics.com/${slug}`,
      type: "article",
      images: ("featuredImage" in post && post.featuredImage)
        ? [{ url: `https://diamondcritics.com${post.featuredImage}`, width: 1200, height: 630 }]
        : undefined,
    },
  };
}

const reviewSchemas: Record<string, object> = {
  "blue-nile-review": {
    "@context": "https://schema.org",
    "@type": "Review",
    "name": "Blue Nile Review 2026: Expert Diamond Audit",
    "datePublished": "2026-04-12",
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": "4.6",
      "bestRating": "5",
      "worstRating": "1",
    },
    "author": {
      "@type": "Person",
      "name": "Farzana Hasan",
      "jobTitle": "GIA-Certified Diamond Expert",
      "url": "https://diamondcritics.com/about-farzana",
    },
    "publisher": {
      "@type": "Organization",
      "name": "Diamond Critics",
      "url": "https://diamondcritics.com",
    },
    "itemReviewed": {
      "@type": "Product",
      "name": "Blue Nile Natural Diamonds",
      "brand": { "@type": "Brand", "name": "Blue Nile" },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.6",
        "reviewCount": "371",
      },
    },
    "reviewBody": "Blue Nile offers the world's largest GIA-certified diamond inventory. In 2026, following the 14% market correction, it remains the best portal for buyers who apply manual proportion filters. Beware the 'Astor' premium and VVS upgrade traps.",
    "url": "https://diamondcritics.com/blue-nile-review",
  },
};

export default async function SlugPage({ params }: Props) {
  const { slug } = await params;

  const post = getPostBySlug(slug);
  if (post) {
    const related = getRelatedPosts(slug, post.category, 3);
    const schema = reviewSchemas[slug];
    return (
      <>
        {schema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        )}
        <PostContent type="post" data={post} related={related} />
      </>
    );
  }

  const page = getPageBySlug(slug);
  if (page) return <PostContent type="page" data={page} />;

  notFound();
}
