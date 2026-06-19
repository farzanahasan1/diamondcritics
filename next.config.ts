import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "diamondcritics.com" },
    ],
  },
};

export default nextConfig;
