"use client";

import { useSyncExternalStore } from "react";
import { useReducedMotion } from "framer-motion";
import { musicStore, TRACK } from "@/components/music-store";

/** Drives the player that lives in the root layout. */
export default function MusicButton() {
  const { ready, playing, failed } = useSyncExternalStore(
    musicStore.subscribe,
    musicStore.get,
    musicStore.getServer,
  );
  const reduced = useReducedMotion();

  if (failed) return null;

  return (
    <button
      type="button"
      onClick={() => (playing ? musicStore.pause() : musicStore.playFromTop(TRACK))}
      disabled={!ready}
      aria-pressed={playing}
      aria-label={playing ? "Pause the music" : "Play the music"}
      title={playing ? "Pause the music" : "Play the music"}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-line-strong text-ink transition-[background-color,border-color,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-gold hover:bg-ivory/20 disabled:opacity-40 sm:h-9 sm:w-9"
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
  );
}
