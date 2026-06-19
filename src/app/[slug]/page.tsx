import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllPostSlugs, getAllPageSlugs, getPostBySlug, getPageBySlug } from "@/lib/content";
import PostContent from "@/components/PostContent";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const postSlugs = getAllPostSlugs().map((slug) => ({ slug }));
  const pageSlugs = getAllPageSlugs().map((slug) => ({ slug }));
  return [...postSlugs, ...pageSlugs];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug) ?? getPageBySlug(slug);
  if (!post) return {};
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription,
    alternates: { canonical: `https://diamondcritics.com/${slug}` },
  };
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params;

  const post = getPostBySlug(slug);
  if (post) return <PostContent type="post" data={post} />;

  const page = getPageBySlug(slug);
  if (page) return <PostContent type="page" data={page} />;

  notFound();
}
