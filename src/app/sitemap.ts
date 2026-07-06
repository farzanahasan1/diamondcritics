import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/content";
import { createClient } from "@supabase/supabase-js";

const BASE = "https://diamondcritics.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  const categoryPages: MetadataRoute.Sitemap = [
    "oval-cut-diamond",
    "round-cut-diamond",
    "princess-cut-diamond",
    "diamond-buying-guides",
    "diamond-retailer-reviews",
    "blue-nile",
    "gemstone-guides",
    "market-value-price-trends",
  ].map((slug) => ({
    url: `${BASE}/category/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // ── Community pages ──────────────────────────────────────────────────────
  const communityStatic: MetadataRoute.Sitemap = [
    { url: `${BASE}/community`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
  ];

  let communitySubPages: MetadataRoute.Sitemap = [];
  let communityPosts: MetadataRoute.Sitemap = [];

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Subcommunities (r/[slug])
    const { data: communities } = await supabase
      .from("communities")
      .select("slug, updated_at")
      .order("member_count", { ascending: false });

    if (communities) {
      communitySubPages = communities.map((c) => ({
        url: `${BASE}/community/r/${c.slug}`,
        lastModified: c.updated_at ?? new Date(),
        changeFrequency: "daily" as const,
        priority: 0.7,
      }));
    }

    // Public posts (not deleted, not draft)
    const { data: dbPosts } = await supabase
      .from("posts")
      .select("id, updated_at, created_at")
      .eq("is_deleted", false)
      .eq("is_draft", false)
      .order("created_at", { ascending: false })
      .limit(1000);

    if (dbPosts) {
      const now = Date.now()
      communityPosts = dbPosts.map((p) => {
        const ageMs = now - new Date(p.created_at ?? 0).getTime()
        const ageDays = ageMs / 86_400_000
        const changeFrequency =
          ageDays < 2   ? 'hourly'  as const :
          ageDays < 14  ? 'daily'   as const :
          ageDays < 90  ? 'weekly'  as const :
                          'monthly' as const
        return {
          url: `${BASE}/community/post/${p.id}`,
          lastModified: p.updated_at ?? p.created_at ?? new Date(),
          changeFrequency,
          priority: ageDays < 7 ? 0.8 : 0.6,
        }
      })
    }
  } catch {
    // Supabase unavailable at build time — community URLs omitted gracefully
  }

  return [
    ...staticPages,
    ...categoryPages,
    ...posts,
    ...communityStatic,
    ...communitySubPages,
    ...communityPosts,
  ];
}
