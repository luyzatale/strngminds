import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["framer-motion"],
    // TypeScript 7 no longer exposes the legacy compiler API Next.js expects.
    useTypeScriptCli: true,
  },
};

export default nextConfig;
