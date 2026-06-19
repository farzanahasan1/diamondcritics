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
  updatedAt: string;
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

// ── Dynamic shortcodes ────────────────────────────────────────
// Usage in any .mdoc file: {{month}}, {{year}}, {{month_year}}, {{date}}
// Posts using shortcodes automatically get dateModified = today (signals freshness to Google)
const _now = new Date();
const SHORTCODE_MAP: Record<string, string> = {
  "{{year}}":       _now.getFullYear().toString(),
  "{{month}}":      _now.toLocaleString("en-US", { month: "long" }),
  "{{month_year}}": _now.toLocaleString("en-US", { month: "long", year: "numeric" }),
  "{{date}}":       _now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
};
const SHORTCODE_RE = /\{\{(year|month|month_year|date)\}\}/g;

function applyShortcodes(text: string): string {
  return text.replace(SHORTCODE_RE, (match) => SHORTCODE_MAP[match] ?? match);
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

const publicImagesDir = path.join(process.cwd(), "public/images");

function decodeEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'");
}

function toAvif(src: string): string {
  if (!src) return src;
  const avifPath = src.replace(/\.(jpe?g|png|webp)$/i, ".avif");
  const filename = path.basename(avifPath);
  if (fs.existsSync(path.join(publicImagesDir, filename))) return avifPath;
  return src;
}

function rewriteContentImages(html: string): string {
  return html.replace(
    /(<img[^>]+src=")([^"]+)"/gi,
    (_match, prefix, src) => `${prefix}${toAvif(src)}"`
  );
}

// Automatically appends affiliate ID to every Blue Nile link in a post.
// Works whether the link was pasted from Blue Nile's site or typed manually.
// Uses chan=blue_nile_reviews for review posts, chan=blog-informational for everything else.
function addBluenileAffiliate(html: string, category = ""): string {
  const chan = category === "diamond-retailer-reviews" ? "blue_nile_reviews" : "blog-informational";
  return html.replace(
    /href="(https?:\/\/(?:www\.)?bluenile\.com[^"]*)"/gi,
    (_, url: string) => {
      if (url.includes("a_aid=")) return `href="${url}"`; // already tagged
      const sep = url.includes("?") ? "&" : "?";
      return `href="${url}${sep}a_aid=69d7c31a91b8d&a_cid=55e51e63&chan=${chan}"`;
    }
  );
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
    // Auto-set updatedAt for posts using shortcodes (signals freshness to Google each rebuild)
    if (SHORTCODE_RE.test(content)) {
      SHORTCODE_RE.lastIndex = 0; // reset after .test()
      if (!data.updatedAt) data.updatedAt = _now.toISOString().slice(0, 10);
    }
    // Apply shortcodes, then ensure blank line before headings
    const processed = applyShortcodes(content).replace(/([^\n])\n(#{1,6} )/g, "$1\n\n$2");
    // Apply shortcodes to frontmatter text fields too
    for (const key of ["title", "excerpt", "seoTitle", "seoDescription"]) {
      if (typeof data[key] === "string") data[key] = applyShortcodes(data[key]);
    }
    const contentHtml = addBluenileAffiliate(
      rewriteContentImages(marked(processed) as string),
      data.category
    );
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
    title: decodeEntities(data.title ?? slug),
    excerpt: decodeEntities(data.excerpt ?? ""),
    publishedAt: data.publishedAt ?? "",
    updatedAt: data.updatedAt ?? "",
    category: data.category ?? "diamond-buying-guides",
    seoTitle: decodeEntities(data.seoTitle ?? data.title ?? slug),
    seoDescription: decodeEntities(data.seoDescription ?? data.excerpt ?? ""),
    featuredImage: toAvif(data.featuredImage ?? ""),
    contentHtml,
  };
}

export function getPageBySlug(slug: string): Page | null {
  const result = readFile(pagesDir, slug);
  if (!result) return null;
  const { data, contentHtml } = result;
  return {
    slug,
    title: decodeEntities(data.title ?? slug),
    seoTitle: decodeEntities(data.seoTitle ?? data.title ?? slug),
    seoDescription: decodeEntities(data.seoDescription ?? ""),
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
