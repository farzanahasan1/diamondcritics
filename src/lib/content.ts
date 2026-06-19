import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

const postsDir = path.join(process.cwd(), "content/posts");
const pagesDir = path.join(process.cwd(), "content/pages");

// Configure marked for clean, safe output
marked.use({
  gfm: true,
  breaks: false,
});

export interface PostMeta {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  category: string;
  seoTitle: string;
  seoDescription: string;
  featuredImage: string;
}

export interface Post extends PostMeta {
  contentHtml: string;
}

export interface PageMeta {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
}

export interface Page extends PageMeta {
  contentHtml: string;
}

function readDir(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.match(/\.(mdoc|mdx|md)$/));
}

export function getAllPostSlugs(): string[] {
  return readDir(postsDir).map((f) => f.replace(/\.(mdoc|mdx|md)$/, ""));
}

export function getAllPageSlugs(): string[] {
  return readDir(pagesDir).map((f) => f.replace(/\.(mdoc|mdx|md)$/, ""));
}

function readFile(
  dir: string,
  slug: string
): { data: Record<string, any>; contentHtml: string } | null {
  const exts = [".mdoc", ".mdx", ".md"];
  for (const ext of exts) {
    const filePath = path.join(dir, `${slug}${ext}`);
    if (!fs.existsSync(filePath)) continue;
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);
    const contentHtml = marked(content) as string;
    return { data, contentHtml };
  }
  return null;
}

export function getPostBySlug(slug: string): Post | null {
  const result = readFile(postsDir, slug);
  if (!result) return null;
  const { data, contentHtml } = result;
  return {
    slug,
    title: data.title ?? slug,
    excerpt: data.excerpt ?? "",
    publishedAt: data.publishedAt ?? "",
    category: data.category ?? "diamond-buying-guides",
    seoTitle: data.seoTitle ?? data.title ?? slug,
    seoDescription: data.seoDescription ?? data.excerpt ?? "",
    featuredImage: data.featuredImage ?? "",
    contentHtml,
  };
}

export function getPageBySlug(slug: string): Page | null {
  const result = readFile(pagesDir, slug);
  if (!result) return null;
  const { data, contentHtml } = result;
  return {
    slug,
    title: data.title ?? slug,
    seoTitle: data.seoTitle ?? data.title ?? slug,
    seoDescription: data.seoDescription ?? "",
    contentHtml,
  };
}

export function getAllPosts(): PostMeta[] {
  return getAllPostSlugs()
    .map((slug) => getPostBySlug(slug))
    .filter(Boolean)
    .sort((a, b) => (a!.publishedAt < b!.publishedAt ? 1 : -1)) as PostMeta[];
}

export function getPostsByCategory(category: string): PostMeta[] {
  return getAllPosts().filter((p) => p.category === category);
}

export function getRelatedPosts(currentSlug: string, category: string, count = 3): PostMeta[] {
  return getAllPosts()
    .filter((p) => p.slug !== currentSlug && p.category === category)
    .slice(0, count);
}
