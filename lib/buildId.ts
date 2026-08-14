import { execSync } from "node:child_process";

/**
 * A name for this build, resolved once at build time.
 *
 * Read by `next.config.ts` and handed to the bundler through `env`, which
 * inlines it as a literal into both the client bundle and the server one. That
 * inlining is the whole point: the running page and the `/version` route have
 * to agree on what "this build" means, and they are evaluated in different
 * processes — at build time in different processes again, since Turbopack
 * builds across workers. Anything computed fresh per process (a timestamp, a
 * random id) would disagree with itself and the page would reload forever.
 *
 * The commit sha is used because it is the one value that is identical in
 * every one of those processes and changes exactly when the site does. Hosts
 * that build from git expose it directly; locally it comes from git itself.
 *
 * The fallback is deliberately a constant rather than `Date.now()`. If the sha
 * cannot be found, every process agrees on "development" and the version check
 * simply never fires — which is the right failure, because the alternative is
 * processes disagreeing and reloading the page in a loop.
 */
export function resolveBuildId(): string {
  const fromHost =
    process.env.VERCEL_GIT_COMMIT_SHA ??
    process.env.CF_PAGES_COMMIT_SHA ??
    process.env.COMMIT_REF ??
    process.env.GITHUB_SHA;

  if (fromHost) return fromHost.slice(0, 12);

  try {
    return execSync("git rev-parse --short=12 HEAD", {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "development";
  }
}
