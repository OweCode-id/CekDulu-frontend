import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.tokopedia.net",
      },
      {
        protocol: "https",
        hostname: "**.tokopedia.com",
      },
    ],
  },
};

export default nextConfig;
