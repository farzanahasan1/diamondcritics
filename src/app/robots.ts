import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/keystatic/",
        "/api/",
        "/community/admin",
        "/community/login",
        "/community/register",
        "/community/auth/",
        "/community/r/*/submit",
        "/community/u/*/edit",
        "/community/saved",
        "/community/notifications",
        "/community/search",
      ],
    },
    sitemap: [
      "https://diamondcritics.com/sitemap.xml",
      "https://diamondcritics.com/image-sitemap.xml",
    ],
  };
}
