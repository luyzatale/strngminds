"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { calm } from "@/components/Motion";
import type { Episode } from "@/lib/spotify";
import { clsx } from "@/lib/clsx";

/** Five players a page — past that the column is longer than a phone screen. */
const PER_PAGE = 5;

/**
 * The show, five episodes at a time, newest first.
 *
 * Only the current page is mounted. Each player is a Spotify iframe that opens
 * its own connection, so keeping twenty of them alive to hide fifteen would
 * cost real network for nothing; paging unmounts them instead. The trade is
 * that a player stops when you page away from it, which is the behaviour you
 * would want anyway.
 */
export default function EpisodeList({ episodes }: { episodes: Episode[] }) {
  const [page, setPage] = useState(0);
  const reduced = useReducedMotion();

  const pages = Math.max(1, Math.ceil(episodes.length / PER_PAGE));
  // Guards the case where the list shrinks under a stale page index.
  const current = Math.min(page, pages - 1);
  const start = current * PER_PAGE;
  const shown = episodes.slice(start, start + PER_PAGE);

  return (
    <>
      <div className="relative mt-8">
        <AnimatePresence mode="wait" initial={false}>
          <motion.ul
            key={current}
            className="flex flex-col gap-2.5"
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 1 } : { opacity: 0, y: -10 }}
            transition={{ ...calm, duration: 0.45 }}
          >
            {shown.map((ep) => (
              <li
                key={ep.id}
                className="overflow-hidden rounded-[0.95rem] border border-line bg-paper-50/40 p-1 shadow-lift backdrop-blur-[3px] transition-[border-color] duration-500 hover:border-line-strong"
              >
                {/* Spotify's embed picks its layout from the height it is
                    given. At 152 it draws the full card — big artwork, date,
                    a save row and a scrubber — which is most of a phone
                    screen for one episode. At 80 it draws the compact row:
                    thumbnail, title, play. Same player, half the height. */}
                <iframe
                  title={`${ep.n} — ${ep.title}`}
                  src={`https://open.spotify.com/embed/episode/${ep.id}?theme=0`}
                  width="100%"
                  height="80"
                  loading="lazy"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  style={{ border: 0, borderRadius: "0.7rem", display: "block" }}
                />
              </li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>

      {pages > 1 && (
        <nav
          aria-label="Episode pages"
          className="mt-9 flex items-center justify-between gap-6"
        >
          <Arrow
            direction="prev"
            disabled={current === 0}
            onClick={() => setPage(current - 1)}
          />

          {/* The range rather than the page number: on a list this short, "6–10
              of 12" tells you where you are and how much is left, which a bare
              "2 / 3" does not. */}
          <p
            aria-live="polite"
            className="text-[0.62rem] uppercase tracking-[0.26em] text-ink-faint"
          >
            {start + 1}–{start + shown.length} of {episodes.length}
          </p>

          <Arrow
            direction="next"
            disabled={current === pages - 1}
            onClick={() => setPage(current + 1)}
          />
        </nav>
      )}
    </>
  );
}

function Arrow({
  direction,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  const next = direction === "next";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={next ? "Older episodes" : "Newer episodes"}
      className={clsx(
        "group flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line bg-paper-50/40 text-ink-soft backdrop-blur-[3px]",
        "transition-[border-color,color,opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        disabled
          ? "cursor-default opacity-30"
          : "hover:border-line-strong hover:text-ink",
      )}
    >
      <span
        aria-hidden="true"
        className={clsx(
          "text-[0.95rem] leading-none transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          !disabled && (next ? "group-hover:translate-x-1" : "group-hover:-translate-x-1"),
        )}
      >
        {next ? "→" : "←"}
      </span>
    </button>
  );
}