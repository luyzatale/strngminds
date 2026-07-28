/**
 * The smallest service worker that makes the site installable.
 *
 * Chromium will only offer "Add to home screen" for a page that controls a
 * service worker with a fetch handler. This one adds no caching strategy of
 * its own — it passes every request straight to the network — so the site
 * behaves exactly as it does without it, and nothing goes stale.
 */

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});
