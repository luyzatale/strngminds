import type { NextConfig } from "next";
import { resolveBuildId } from "./lib/buildId";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /**
   * Inlined as a literal into the client bundle and the server one alike, so
   * a running page can be asked whether it is still the build that is
   * deployed. See lib/buildId.ts for why it has to be inlined rather than
   * read at runtime.
   */
  env: {
    NEXT_PUBLIC_BUILD_ID: resolveBuildId(),
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // the podcast artwork, served from Spotify's CDN so it tracks their cover
    remotePatterns: [
      { protocol: "https", hostname: "image-cdn-ak.spotifycdn.com" },
      { protocol: "https", hostname: "image-cdn-fa.spotifycdn.com" },
      { protocol: "https", hostname: "i.scdn.co" },
    ],
  },
  /**
   * Pages, the manifest and the worker are always revalidated, so a copy
   * launched from a phone's home screen cannot show an older build. Build
   * assets under /_next/static are content-hashed and left alone.
   */
  async headers() {
    const fresh = {
      key: "Cache-Control",
      value: "public, max-age=0, must-revalidate",
    };
    return [
      { source: "/", headers: [fresh] },
      { source: "/about", headers: [fresh] },
      { source: "/contact", headers: [fresh] },
      { source: "/podcast", headers: [fresh] },
      { source: "/manifest.webmanifest", headers: [fresh] },
      // The one answer that must never come from a cache at any layer: it is
      // what decides whether the page holding it is out of date.
      {
        source: "/version",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
        ],
      },
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
    ];
  },
  /**
   * The podcast page lived at /meditation until it was renamed. Anything
   * already shared, bookmarked or indexed under the old path still resolves —
   * permanent, so crawlers move their record across rather than keep both.
   */
  async redirects() {
    return [{ source: "/meditation", destination: "/podcast", permanent: true }];
  },
  experimental: {
    optimizePackageImports: ["framer-motion"],
    // TypeScript 7 no longer exposes the legacy compiler API Next.js expects.
    useTypeScriptCli: true,
  },
};

export default nextConfig;
