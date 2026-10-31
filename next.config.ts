import type { NextConfig } from "next";

const isGhPages = process.env.NEXT_PUBLIC_BASE_PATH !== undefined;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: isGhPages ? "/memeginarium" : "",
  assetPrefix: isGhPages ? "/memeginarium/" : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
