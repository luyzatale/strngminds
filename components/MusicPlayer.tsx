"use client";

import { useEffect, useRef } from "react";
import { musicStore, type MusicController } from "@/components/music-store";

/**
 * The background track, mounted once in the root layout so that moving between
 * pages does not interrupt it. Nothing here is visible: the embed is held in
 * the viewport at zero opacity, because unmounting or re-parenting it would
 * tear down the iframe mid-track and `display: none` can suspend media.
 *
 * Browsers will not start audio on load without a gesture, so playback begins
 * at the visitor's first tap, key or drag.
 */

const TRACK = "spotify:track:3h7nfJ5PIzaHqaEIzrIHsK";
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
          c.addListener("playback_update", (e) =>
            musicStore.set({ playing: !e.data.isPaused }),
          );
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

    const events = ["pointerdown", "keydown", "touchstart"] as const;
    const onGesture = () => {
      musicStore.controller?.play();
      events.forEach((e) => window.removeEventListener(e, onGesture));
    };

    function start() {
      if (armed.current) return;
      armed.current = true;
      // ask once, in case this visitor has already earned the privilege
      musicStore.controller?.play();
      events.forEach((e) =>
        window.addEventListener(e, onGesture, { passive: true }),
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
      window.removeEventListener("blur", onBlur);
      events.forEach((e) => window.removeEventListener(e, onGesture));
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
