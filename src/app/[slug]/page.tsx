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
    },
  };
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params;

  const post = getPostBySlug(slug);
  if (post) {
    const related = getRelatedPosts(slug, post.category, 3);
    return <PostContent type="post" data={post} related={related} />;
  }

  const page = getPageBySlug(slug);
  if (page) return <PostContent type="page" data={page} />;

  notFound();
}
