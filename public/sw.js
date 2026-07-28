/**
 * The smallest service worker that makes the site installable — and one that
 * can never serve you yesterday's site.
 *
 * Chromium will only offer "Add to home screen" for a page that controls a
 * service worker with a fetch handler. This one keeps no cache of its own, and
 * for page navigations it goes to the network with the HTTP cache bypassed, so
 * a copy launched from the home screen shows the same thing a fresh browser
 * would. Everything else passes straight through: Next's build assets carry
 * content hashes in their names, so they are safe to cache and change name
 * whenever they change.
 */

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request, { cache: "no-store" }).catch(() => fetch(request)),
    );
    return;
  }

  event.respondWith(fetch(request));
});

/** Lets a running copy be told to step aside for a new one. */
self.addEventListener("message", (event) => {
  if (event.data === "skip-waiting") self.skipWaiting();
});
