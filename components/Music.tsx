"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Background music, via Spotify's official embed.
 *
 * Two constraints shape this: browsers refuse to autoplay audio without a
 * gesture, and Spotify's terms want their player visible rather than hidden in
 * a corner. So the nav carries a small control that starts and stops playback,
 * and the real player fades in at the foot of the page while it runs.
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
    };
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

      {/* One mount point, always present: re-parenting it would tear down the
          iframe mid-track. It simply fades out of the way when paused. */}
      <motion.div
        initial={false}
        animate={{
          opacity: playing && !failed ? 1 : 0,
          y: playing && !failed ? 0 : 14,
        }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden={!playing}
        className={`fixed bottom-6 left-6 z-40 w-[min(20rem,calc(100vw-3rem))] overflow-hidden rounded-2xl border border-line bg-paper/80 p-1.5 shadow-lift backdrop-blur-xl ${
          playing && !failed ? "" : "pointer-events-none"
        }`}
      >
        <div ref={holder} />
      </motion.div>
    </>
  );
}
