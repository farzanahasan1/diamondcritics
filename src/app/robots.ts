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
    ],
    },
    sitemap: "https://diamondcritics.com/sitemap.xml",
  };
}
