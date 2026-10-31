import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export", // static export for easy GitHub Pages or Vercel static hosting
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
