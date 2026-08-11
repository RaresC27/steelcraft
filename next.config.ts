import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: [
      "image/avif",
      "image/webp",
    ],

    remotePatterns: [
      {
        protocol: "https",
        hostname:
          "*.public.blob.vercel-storage.com",
      },
    ],

    deviceSizes: [
      360,
      390,
      430,
      640,
      768,
      1024,
      1280,
      1536,
    ],

    imageSizes: [
      48,
      64,
      80,
      120,
      160,
      240,
      320,
    ],

    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;