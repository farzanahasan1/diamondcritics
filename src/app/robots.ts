import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/keystatic/",
        "/api/",
        "/community/",
      ],
    },
    sitemap: [
      "https://diamondcritics.com/sitemap.xml",
      "https://diamondcritics.com/image-sitemap.xml",
    ],
  };
}
