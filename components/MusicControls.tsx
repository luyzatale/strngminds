"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useReducedMotion } from "framer-motion";
import { musicStore } from "@/components/music-store";

/**
 * The music controls, sitting in the corner rather than in the bar: play or
 * pause, and start it over. They are mounted in the root layout beside the
 * player itself, so they neither move nor reset between pages.
 */

/**
 * Quieter than they were, in two ways: smaller, and resting below full
 * opacity so they recede until the pointer finds them. They stay 36px on a
 * phone — the one place where the diameter is also the tap target — and take
 * the full reduction from `sm` up, where a cursor makes 32px ample.
 */
const BUTTON =
  "flex h-9 w-9 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-line-strong/70 bg-paper/60 text-ink-soft opacity-70 backdrop-blur-md transition-[background-color,border-color,opacity,color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-gold hover:bg-ivory/20 hover:text-ink hover:opacity-100 focus-visible:opacity-100 disabled:opacity-40";

/**
 * The controls are hidden, not removed.
 *
 * Flip this to `true` and the pair comes back exactly as they were. Everything
 * below is untouched: the store subscription, the restart and play handlers,
 * and the blur listener that ducks the background sound when an episode embed
 * takes focus.
 *
 * Note what this does *not* do — the music itself is unaffected. The <audio>
 * element lives in the root layout beside this component, not inside it, so it
 * still loads and still obeys the store. This hides the way a visitor turns it
 * off, which is worth knowing if it is ever set to autoplay.
 */
const SHOW_CONTROLS = false;

export default function MusicControls() {
  const { ready, playing, failed } = useSyncExternalStore(
    musicStore.subscribe,
    musicStore.get,
    musicStore.getServer,
  );
  const reduced = useReducedMotion();

  /**
   * An episode has to win over the background sound. Playback inside a
   * cross-origin embed cannot be read, but clicking into one moves focus to
   * that iframe and blurs the window, which is the moment to get out of the
   * way. Navigating to the page does nothing; only pressing play does.
   */
  useEffect(() => {
    const onBlur = () => {
      const el = document.activeElement as HTMLIFrameElement | null;
      if (el?.tagName === "IFRAME" && el.src?.includes("/embed/episode/")) {
        musicStore.pause();
      }
    };
    window.addEventListener("blur", onBlur);
    return () => window.removeEventListener("blur", onBlur);
  }, []);

  if (failed || !SHOW_CONTROLS) return null;

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
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
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
        <span className="flex h-3 w-3 items-end justify-center gap-[2px]">
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
