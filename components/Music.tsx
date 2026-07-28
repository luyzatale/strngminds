"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Background music, via Spotify's official embed.
 *
 * Browsers refuse to autoplay audio without a gesture, so playback starts from
 * the small control in the nav. The embed itself is kept mounted but invisible
 * at the author's request — re-parenting or unmounting it would tear down the
 * iframe mid-track, and display:none can suspend media, so it is held in the
 * viewport at zero opacity instead. (Spotify's embed terms expect their player
 * to be visible; that is a call for whoever ships this.)
 *
 * Listeners without a Spotify session get the track's 30-second preview;
 * logged-in listeners get the whole thing.
 */

const TRACK = "spotify:track:3h7nfJ5PIzaHqaEIzrIHsK";
const API = "https://open.spotify.com/embed/iframe-api/v1";

type Controller = {
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  destroy?: () => void;
  addListener: (event: string, cb: (e: { data: { isPaused: boolean } }) => void) => void;
};

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: {
      createController: (
        el: HTMLElement,
        opts: Record<string, unknown>,
        cb: (c: Controller) => void,
      ) => void;
    }) => void;
  }
}

export default function Music() {
  const holder = useRef<HTMLDivElement>(null);
  const controller = useRef<Controller | null>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const armed = useRef(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    let cancelled = false;

    window.onSpotifyIframeApiReady = (api) => {
      if (cancelled || !holder.current) return;
      api.createController(
        holder.current,
        { uri: TRACK, width: "100%", height: 80 },
        (c) => {
          if (cancelled) return;
          controller.current = c;
          c.addListener("playback_update", (e) => setPlaying(!e.data.isPaused));
          setReady(true);
        },
      );
    };

    const script = document.createElement("script");
    script.src = API;
    script.async = true;
    script.onerror = () => setFailed(true);
    document.body.appendChild(script);

    // If Spotify is unreachable, don't leave a dead control in the nav.
    const giveUp = window.setTimeout(() => {
      if (!controller.current) setFailed(true);
    }, 8000);

    return () => {
      cancelled = true;
      window.clearTimeout(giveUp);
      script.remove();
      delete window.onSpotifyIframeApiReady;

      // Leaving the page has to silence it. Spotify replaces our mount point
      // with its own iframe, so React's own removal cannot be relied on to
      // take the player with it — stop it, tear it down, and empty the node.
      try {
        controller.current?.pause();
        controller.current?.destroy?.();
      } catch {}
      controller.current = null;
      if (holder.current) holder.current.innerHTML = "";
    };
  }, []);

  /**
   * Autoplay.
   *
   * No browser will start audio on load without a gesture, and Spotify's embed
   * is no exception — so we ask once in case this visitor's engagement with the
   * origin has earned the privilege, and otherwise start on the very first
   * thing they do: a tap, a key, or a drag of the solar system. In practice the
   * music begins the moment they touch the page.
   */
  useEffect(() => {
    if (!ready || armed.current) return;
    armed.current = true;

    controller.current?.play();

    const events = ["pointerdown", "keydown", "touchstart"] as const;
    const start = () => {
      controller.current?.play();
      events.forEach((e) => window.removeEventListener(e, start));
    };
    events.forEach((e) => window.addEventListener(e, start, { passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, start));
  }, [ready]);

  /**
   * An episode has to win over the background track. We cannot read playback
   * out of a cross-origin embed, but we do not need to: clicking inside one
   * moves focus to that iframe and blurs the window, which is exactly the
   * moment to get out of the way.
   */
  useEffect(() => {
    const onBlur = () => {
      const el = document.activeElement as HTMLIFrameElement | null;
      if (el?.tagName === "IFRAME" && el.src?.includes("/embed/episode/")) {
        controller.current?.pause();
      }
    };
    window.addEventListener("blur", onBlur);
    return () => window.removeEventListener("blur", onBlur);
  }, []);

  const toggle = () => controller.current?.togglePlay();

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        disabled={!ready}
        aria-pressed={playing}
        aria-label={playing ? "Pause the music" : "Play the music"}
        title={playing ? "Pause the music" : "Play the music"}
        className={`flex h-9 w-9 items-center justify-center rounded-full border border-line-strong text-ink transition-[background-color,border-color,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-gold hover:bg-ivory/20 disabled:opacity-40 ${
          failed ? "hidden" : ""
        }`}
      >
        {/* three bars, moving only while something is actually playing */}
        <span className="flex h-3.5 w-3.5 items-end justify-center gap-[2px]">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-[2px] rounded-full bg-current"
              style={{
                height: playing ? "100%" : "38%",
                transformOrigin: "bottom",
                transition: "height 500ms cubic-bezier(0.22,1,0.36,1)",
                ...(playing && !reduced
                  ? {
                      animationName: "sm-eq",
                      animationDuration: `${900 + i * 260}ms`,
                      animationTimingFunction: "ease-in-out",
                      animationIterationCount: "infinite",
                      animationDelay: `${i * 130}ms`,
                    }
                  : {}),
              }}
            />
          ))}
        </span>
      </button>

      {/* One mount point, always present and never visible. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-0 left-0 z-[-1] h-[80px] w-[320px] overflow-hidden opacity-0"
      >
        <div ref={holder} />
      </div>
    </>
  );
}
