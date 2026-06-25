import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllPostSlugs,
  getAllPageSlugs,
  getPostBySlug,
  getPageBySlug,
  getRelatedPosts,
} from "@/lib/content";
import PostContent from "@/components/PostContent";
import CommunityWelcomePopup from "@/components/CommunityWelcomePopup";

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
  const post = getPostBySlug(slug);
  const data = post ?? getPageBySlug(slug);
  if (!data) return {};
  return {
    title: data.seoTitle || data.title,
    description: data.seoDescription,
    alternates: { canonical: `https://diamondcritics.com/${slug}` },
    twitter: { card: "summary_large_image" },
    openGraph: {
      title: data.seoTitle || data.title,
      description: data.seoDescription,
      url: `https://diamondcritics.com/${slug}`,
      type: "article",
      ...(post && {
        publishedTime: post.publishedAt,
        modifiedTime: post.updatedAt || post.publishedAt,
        images: post.featuredImage
          ? [{ url: `https://diamondcritics.com${post.featuredImage}`, width: 1500, height: 1000 }]
          : [{ url: "https://diamondcritics.com/images/diamondcritics-og.png", width: 1200, height: 630 }],
      }),
    },
  };
}

const categoryLabelsSchema: Record<string, string> = {
  "diamond-buying-guides": "Diamond Buying Guides",
  "diamond-retailer-reviews": "Retailer Reviews",
  "gemstone-guides": "Gemstone Guides",
  "market-value-price-trends": "Market & Price Trends",
  "round-cut-diamond": "Round Cut Diamond",
};

function extractFAQSchema(html: string): object | null {
  const faqMatch = html.match(/<h2[^>]*>[^<]*[Ff]requently[^<]*<\/h2>([\s\S]*?)(?:<h2|$)/);
  if (!faqMatch) return null;
  const faqHtml = faqMatch[1];
  const pairs: { question: string; answer: string }[] = [];
  const regex = /<h3[^>]*>([^<]+\?)<\/h3>\s*<p>([\s\S]*?)<\/p>/g;
  let match;
  while ((match = regex.exec(faqHtml)) !== null) {
    const question = match[1].trim();
    const answer = match[2].replace(/<[^>]+>/g, "").trim();
    if (question && answer) pairs.push({ question, answer });
  }
  if (pairs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": pairs.map(({ question, answer }) => ({
      "@type": "Question",
      "name": question,
      "acceptedAnswer": { "@type": "Answer", "text": answer },
    })),
  };
}

function buildBreadcrumbSchema(slug: string, category: string, title: string): object {
  const items: { name: string; url: string }[] = [
    { name: "Home", url: "https://diamondcritics.com" },
  ];
  if (category && categoryLabelsSchema[category]) {
    items.push({ name: categoryLabelsSchema[category], url: `https://diamondcritics.com/category/${category}` });
  }
  items.push({ name: title, url: `https://diamondcritics.com/${slug}` });
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map(({ name, url }, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": name,
      "item": url,
    })),
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
    const reviewSchema = reviewSchemas[slug];
    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": post.title,
      "description": post.seoDescription || post.excerpt,
      "datePublished": post.publishedAt,
      "dateModified": post.updatedAt || post.publishedAt,
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
        "logo": {
          "@type": "ImageObject",
          "url": "https://diamondcritics.com/apple-icon.jpg",
          "width": 180,
          "height": 180,
        },
      },
      ...(post.featuredImage && {
        "image": {
          "@type": "ImageObject",
          "url": `https://diamondcritics.com${post.featuredImage}`,
          "width": 1500,
          "height": 1000,
        },
      }),
      "url": `https://diamondcritics.com/${slug}`,
      "mainEntityOfPage": `https://diamondcritics.com/${slug}`,
    };
    const faqSchema = extractFAQSchema(post.contentHtml);
    const breadcrumbSchema = buildBreadcrumbSchema(slug, post.category, post.title);
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
        {reviewSchema && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }} />
        )}
        {faqSchema && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        )}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <PostContent type="post" data={post} related={related} />
        <CommunityWelcomePopup />
      </>
    );
  }

  const page = getPageBySlug(slug);
  if (page) return <PostContent type="page" data={page} />;

  redirect('/blog');
}
