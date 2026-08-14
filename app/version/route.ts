/**
 * What build is deployed right now.
 *
 * Prerendered, because the answer is a literal that the bundler inlined at
 * build time — there is nothing to compute per request, and a static file is
 * the cheapest thing a phone waking from the app switcher can ask for. It stays
 * current because a new deploy replaces the file, not because it is recomputed.
 *
 * Freshness is asserted twice on purpose. The header here travels with the
 * response through any CDN in front of it; the matching rule in next.config.ts
 * covers the same path at the framework layer. A stale answer here is worse
 * than no answer, since it is the thing being trusted to detect staleness.
 */
export const dynamic = "force-static";

export function GET() {
  return Response.json(
    { id: process.env.NEXT_PUBLIC_BUILD_ID ?? "development" },
    {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    },
  );
}
