import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    // the podcast artwork, served from Spotify's CDN so it tracks their cover
    remotePatterns: [
      { protocol: "https", hostname: "image-cdn-ak.spotifycdn.com" },
      { protocol: "https", hostname: "image-cdn-fa.spotifycdn.com" },
      { protocol: "https", hostname: "i.scdn.co" },
    ],
  },
  experimental: {
    optimizePackageImports: ["framer-motion"],
    // TypeScript 7 no longer exposes the legacy compiler API Next.js expects.
    useTypeScriptCli: true,
  },
};

export default nextConfig;
