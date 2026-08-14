"use client";

import { useEffect } from "react";

const BUILD_ID = process.env.NEXT_PUBLIC_BUILD_ID;

/** Remembers which build we have already reloaded for, so a disagreement
 *  between the page and the server can cost at most one reload rather than
 *  a loop. Session storage, not local: a new tab should get a fresh chance. */
const SEEN_KEY = "sm-reloaded-for";

/**
 * Keeps a page that stays open from falling behind the deployed site.
 *
 * Nothing here helps a normal navigation — that already lands on the current
 * build, because the pages are served `max-age=0, must-revalidate` and the
 * service worker fetches navigations with the HTTP cache bypassed entirely.
 *
 * The case this exists for is a page that never navigates again: a copy
 * launched from a phone's home screen and then left in the app switcher for a
 * week, or a tab iOS Safari froze into its back/forward cache. Both are
 * resumed rather than reloaded, so no request is made and the old build simply
 * keeps running. The service worker cannot catch this either — it only learns
 * about new *workers*, and sw.js is the same handful of bytes from one deploy
 * to the next, so `updatefound` never fires for an ordinary release.
 *
 * So the page asks. On coming back to the foreground it fetches the build id
 * that is deployed and compares it to the one it was built with; if they
 * differ it reloads once, which lands it on the new build through the ordinary
 * fresh-navigation path above.
 *
 * Deliberately only on resume. Reloading a page while someone is reading it
 * would throw away their scroll position and the place they had got to, to
 * deliver a change they had not asked to see; on return from elsewhere there
 * is nothing to lose.
 */
export default function FreshBuild() {
  useEffect(() => {
    // Without an id there is nothing to compare, and `development` means the
    // sha could not be resolved — in both cases silence beats guessing.
    if (!BUILD_ID || BUILD_ID === "development") return;

    let stopped = false;

    const check = async () => {
      if (stopped || document.visibilityState !== "visible") return;

      let deployed: string | undefined;
      try {
        const res = await fetch("/version", { cache: "no-store" });
        if (!res.ok) return;
        deployed = (await res.json())?.id;
      } catch {
        // offline, or the endpoint is unreachable — a page that works is
        // worth more than a page that is current
        return;
      }

      if (!deployed || deployed === BUILD_ID) return;

      // If we have already reloaded for this id and are somehow still on the
      // old build, something upstream is serving two versions at once. Leave
      // it alone rather than reload against it forever.
      try {
        if (sessionStorage.getItem(SEEN_KEY) === deployed) return;
        sessionStorage.setItem(SEEN_KEY, deployed);
      } catch {
        // private mode: proceed, the `stopped` flag still bounds us to one
      }

      stopped = true;
      window.location.reload();
    };

    document.addEventListener("visibilitychange", check);

    // A back/forward-cache restore runs no effects and fires no
    // visibilitychange — `persisted` is the only signal that the page was
    // thawed rather than loaded.
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) check();
    };
    window.addEventListener("pageshow", onPageShow);

    return () => {
      stopped = true;
      document.removeEventListener("visibilitychange", check);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, []);

  return null;
}
