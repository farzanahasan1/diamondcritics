import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/content";

const BASE = "https://diamondcritics.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts().map((p) => ({
    url: `${BASE}/${p.slug}`,
    lastModified: p.updatedAt ?? p.publishedAt ?? new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/about-farzana`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
    { url: `${BASE}/contact`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/diamond-price-calculator`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/diamond-resale-value-calculator`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];

  return [...staticPages, ...posts];
}
