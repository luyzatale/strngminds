"use client";

import { useSyncExternalStore } from "react";
import { useReducedMotion } from "framer-motion";
import { musicStore } from "@/components/music-store";

/**
 * The music controls, sitting in the corner rather than in the bar: play or
 * pause, and start it over. They are mounted in the root layout beside the
 * player itself, so they neither move nor reset between pages.
 */

const BUTTON =
  "flex h-10 w-10 items-center justify-center rounded-full border border-line-strong bg-paper/70 text-ink backdrop-blur-md transition-[background-color,border-color,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-gold hover:bg-ivory/20 disabled:opacity-40";

export default function MusicControls() {
  const { ready, playing, failed } = useSyncExternalStore(
    musicStore.subscribe,
    musicStore.get,
    musicStore.getServer,
  );
  const reduced = useReducedMotion();

  if (failed) return null;

  return (
    <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2 sm:bottom-6 sm:right-6">
      <button
        type="button"
        onClick={() => musicStore.restart()}
        disabled={!ready}
        aria-label="Start the music again"
        title="Start again"
        className={BUTTON}
      >
        <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
          <path
            d="M13 8a5 5 0 1 1-1.6-3.66"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
          <path
            d="M13.4 2.2v2.9h-2.9"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <button
        type="button"
        onClick={() => musicStore.toggle()}
        disabled={!ready}
        aria-pressed={playing}
        aria-label={playing ? "Pause the music" : "Play the music"}
        title={playing ? "Pause the music" : "Play the music"}
        className={BUTTON}
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
    </div>
  );
}
