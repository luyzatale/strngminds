"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export const THEME_KEY = "sm-theme";

/**
 * The script that runs before paint, so the page never flashes the wrong
 * theme. Kept here so the storage key and the toggle can never drift apart.
 */
export const themeScript = `(function(){try{var s=localStorage.getItem("${THEME_KEY}");document.documentElement.dataset.theme=s||"dark";}catch(e){document.documentElement.dataset.theme="dark";}})();`;

/**
 * The toggle is hidden, not removed.
 *
 * Flip this to `true` and the button comes back exactly as it was — the state,
 * the effect that arms the sunrise transition after first paint, and the
 * handler that writes the choice to storage are all untouched below.
 *
 * Two consequences worth knowing while it is `false`. The light theme itself
 * is not disabled: every token, and the whole dawn palette, is still there and
 * still switches on `[data-theme="light"]`. And `sm-theme` is still read
 * before paint, so anyone who chose light *before* this was hidden keeps
 * getting light, with nothing on screen to change it back. Clearing that key
 * for them would mean touching their stored preference, which this does not
 * do — say the word if the intent is to force everyone to night.
 */
const SHOW_TOGGLE = false;

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    // the page opens at night unless the visitor has said otherwise
    const current = (document.documentElement.dataset.theme as Theme) ?? "dark";
    setTheme(current);

    /**
     * Arm the sunrise, but only after the first paint has been committed.
     *
     * The transition that carries one theme into the other lives on
     * `:root[data-theme-ready]`. If that attribute were present from the
     * start, the theme script's own pre-paint work would qualify as a
     * change, and every visitor would sit through a six-second dawn on
     * arrival whether they asked for one or not. Two frames is enough for
     * the initial values to be the committed ones, so the first thing the
     * transition ever sees is a real click.
     */
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        document.documentElement.dataset.themeReady = "";
      }),
    );
    return () => cancelAnimationFrame(raf);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {}
    setTheme(next);
  };

  const dark = theme === "dark";

  if (!SHOW_TOGGLE) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light" : "Switch to dark"}
      title={dark ? "Switch to light" : "Switch to dark"}
      className="group relative flex h-9 w-9 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-line-strong/50 bg-surface text-ink transition-[background-color,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-gold hover:bg-ivory/25"
      style={{ boxShadow: "var(--control-shadow, none)" }}
    >
      {/* the glyph shows what you will get, not where you are */}
      <span className="relative block h-4 w-4">
        <svg
          viewBox="0 0 16 16"
          className="absolute inset-0 h-4 w-4 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            opacity: dark ? 1 : 0,
            transform: dark ? "none" : "rotate(-45deg) scale(0.7)",
          }}
          aria-hidden="true"
        >
          <circle cx="8" cy="8" r="3.1" fill="currentColor" />
          <circle
            cx="8"
            cy="8"
            r="6.2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="1 3.2"
            strokeLinecap="round"
            opacity="0.7"
          />
        </svg>
        <svg
          viewBox="0 0 16 16"
          className="absolute inset-0 h-4 w-4 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            opacity: dark ? 0 : 1,
            transform: dark ? "rotate(45deg) scale(0.7)" : "none",
          }}
          aria-hidden="true"
        >
          <path
            d="M10.9 1.6A7 7 0 1 0 10.9 14.4 8.2 8.2 0 0 1 10.9 1.6Z"
            fill="currentColor"
          />
        </svg>
      </span>
    </button>
  );
}
