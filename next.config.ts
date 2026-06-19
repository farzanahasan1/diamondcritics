import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "diamondcritics.com" },
    ],
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.diamondcritics.com" }],
        destination: "https://diamondcritics.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
