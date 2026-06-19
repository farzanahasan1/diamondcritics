import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDir = path.join(process.cwd(), "content/posts");
const pagesDir = path.join(process.cwd(), "content/pages");

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
  content: string;
}

export interface PageMeta {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
}

export interface Page extends PageMeta {
  content: string;
}

function readDir(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".mdoc") || f.endsWith(".mdx") || f.endsWith(".md"));
}

export function getAllPostSlugs(): string[] {
  return readDir(postsDir).map((f) => f.replace(/\.(mdoc|mdx|md)$/, ""));
}

export function getAllPageSlugs(): string[] {
  return readDir(pagesDir).map((f) => f.replace(/\.(mdoc|mdx|md)$/, ""));
}

function readFile(dir: string, slug: string): { data: Record<string, any>; content: string } | null {
  const extensions = [".mdoc", ".mdx", ".md"];
  for (const ext of extensions) {
    const filePath = path.join(dir, `${slug}${ext}`);
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(raw);
      return { data, content };
    }
  }
  return null;
}

export function getPostBySlug(slug: string): Post | null {
  const result = readFile(postsDir, slug);
  if (!result) return null;
  const { data, content } = result;
  return {
    slug,
    title: data.title ?? slug,
    excerpt: data.excerpt ?? "",
    publishedAt: data.publishedAt ?? "",
    category: data.category ?? "diamond-buying-guides",
    seoTitle: data.seoTitle ?? data.title ?? slug,
    seoDescription: data.seoDescription ?? data.excerpt ?? "",
    featuredImage: data.featuredImage ?? "",
    content,
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

export function getPageBySlug(slug: string): Page | null {
  const result = readFile(pagesDir, slug);
  if (!result) return null;
  const { data, content } = result;
  return {
    slug,
    title: data.title ?? slug,
    seoTitle: data.seoTitle ?? data.title ?? slug,
    seoDescription: data.seoDescription ?? "",
    content,
  };
}
