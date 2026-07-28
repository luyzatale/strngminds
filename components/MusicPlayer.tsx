"use client";

import { useEffect, useRef } from "react";
import { musicStore, TRACK, type MusicController } from "@/components/music-store";

/**
 * The background track, mounted once in the root layout so that moving between
 * pages does not interrupt it. Nothing here is visible: the embed is held in
 * the viewport at zero opacity, because unmounting or re-parenting it would
 * tear down the iframe mid-track and `display: none` can suspend media.
 *
 * Browsers will not start audio on load without a gesture, so playback begins
 * at the visitor's first tap, key or drag.
 */

const API = "https://open.spotify.com/embed/iframe-api/v1";

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: {
      createController: (
        el: HTMLElement,
        opts: Record<string, unknown>,
        cb: (c: MusicController) => void,
      ) => void;
    }) => void;
  }
}

export default function MusicPlayer() {
  const holder = useRef<HTMLDivElement>(null);
  const armed = useRef(false);
  const retry = useRef(0);

  useEffect(() => {
    let cancelled = false;

    window.onSpotifyIframeApiReady = (api) => {
      if (cancelled || !holder.current) return;
      api.createController(
        holder.current,
        { uri: TRACK, width: "100%", height: 80 },
        (c) => {
          if (cancelled) return;
          musicStore.controller = c;
          c.addListener("playback_update", (e) => {
            if (typeof e.data.position === "number") {
              musicStore.reportPosition(e.data.position);
            }
            musicStore.set({ playing: !e.data.isPaused });
          });
          musicStore.set({ ready: true });
          start();
        },
      );
    };

    const script = document.createElement("script");
    script.src = API;
    script.async = true;
    script.onerror = () => musicStore.set({ failed: true });
    document.body.appendChild(script);

    // If Spotify is unreachable, don't leave a dead control in the bar.
    const giveUp = window.setTimeout(() => {
      if (!musicStore.controller) musicStore.set({ failed: true });
    }, 8000);

    /** every route into playback rewinds first; the store owns that */
    const fromTheTop = () => musicStore.playFromTop(TRACK);

    const events = ["pointerdown", "keydown", "touchstart"] as const;
    const onGesture = () => {
      events.forEach((e) =>
        window.removeEventListener(e, onGesture, { capture: true }),
      );
      /**
       * Only start it if it is not already going. The embed reports one
       * transient `isPaused: false` with `duration: 0` while it is still
       * warming up, so a flag set from that event wrongly concludes the track
       * is under way and the first tap does nothing — the state the store
       * holds by now is the settled one.
       */
      if (musicStore.get().playing) return;

      /**
       * Ask more than once. The embed can still be settling when the tap
       * lands, and a single request at exactly the wrong moment is quietly
       * dropped — so try again a few times while the gesture's activation is
       * still good, and stop the moment it takes.
       */
      fromTheTop();
      let tries = 0;
      retry.current = window.setInterval(() => {
        if (musicStore.get().playing || ++tries > 5) {
          window.clearInterval(retry.current);
          retry.current = 0;
          return;
        }
        fromTheTop();
      }, 450);
    };

    function start() {
      if (armed.current) return;
      armed.current = true;
      // ask once, in case this visitor has already earned the privilege
      fromTheTop();
      // Capture phase: tapping a planet stops propagation so the drag does not
      // start, which would otherwise swallow the very first gesture on a phone.
      events.forEach((e) =>
        window.addEventListener(e, onGesture, { passive: true, capture: true }),
      );
    }

    /**
     * An episode has to win over the background track. Playback inside a
     * cross-origin embed cannot be read, but clicking into one moves focus to
     * that iframe and blurs the window — which is the moment to get out of
     * the way. Navigating to the page does nothing; only pressing play does.
     */
    const onBlur = () => {
      const el = document.activeElement as HTMLIFrameElement | null;
      if (el?.tagName === "IFRAME" && el.src?.includes("/embed/episode/")) {
        musicStore.controller?.pause();
      }
    };
    window.addEventListener("blur", onBlur);

    return () => {
      cancelled = true;
      window.clearTimeout(giveUp);
      if (retry.current) window.clearInterval(retry.current);
      window.removeEventListener("blur", onBlur);
      events.forEach((e) =>
        window.removeEventListener(e, onGesture, { capture: true }),
      );
      script.remove();
      delete window.onSpotifyIframeApiReady;
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed bottom-0 left-0 z-[-1] h-[80px] w-[320px] overflow-hidden opacity-0"
    >
      <div ref={holder} />
    </div>
  );
}
