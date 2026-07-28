"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * Add to home screen.
 *
 * Chromium fires `beforeinstallprompt`, which we hold onto and replay when the
 * button is pressed. iOS Safari has no such event and never will, so there the
 * button opens a short instruction instead — that is the only way to reach the
 * home screen on iOS. Anywhere else, and once installed, it removes itself.
 */

type InstallEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function InstallButton() {
  const [deferred, setDeferred] = useState<InstallEvent | null>(null);
  const [ios, setIos] = useState(false);
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  // Chromium only offers the install prompt to a page controlled by a service
  // worker with a fetch handler, and only over https (or localhost).
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as InstallEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", () => setDeferred(null));

    const ua = window.navigator.userAgent;
    const isIos = /iPad|iPhone|iPod/.test(ua);
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // iOS reports it here instead
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    setIos(isIos && !standalone);

    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = () => setOpen(false);
    document.addEventListener("keydown", onKey);
    // let the current click finish before arming the dismissal
    const t = window.setTimeout(() => document.addEventListener("click", onClick), 0);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
      window.clearTimeout(t);
    };
  }, [open]);

  if (!deferred && !ios) return null;

  const press = async () => {
    if (deferred) {
      await deferred.prompt();
      const { outcome } = await deferred.userChoice;
      if (outcome === "accepted") setDeferred(null);
      return;
    }
    setOpen((v) => !v);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={press}
        aria-label="Add Strng Minds to your home screen"
        title="Add to home screen"
        aria-expanded={ios ? open : undefined}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-line-strong text-ink transition-[background-color,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-gold hover:bg-ivory/20 sm:h-9 sm:w-9"
      >
        {/* a phone, with the arrow of an install */}
        <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true" fill="none">
          <rect
            x="4.3"
            y="1.6"
            width="7.4"
            height="12.8"
            rx="1.6"
            stroke="currentColor"
            strokeWidth="1"
          />
          <path
            d="M8 5.4v4.2M6.4 8l1.6 1.6L9.6 8"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M6.9 12.4h2.2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </button>

      <AnimatePresence>
        {open && ios && (
          <motion.div
            role="dialog"
            aria-label="Add to home screen"
            initial={reduced ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="fixed inset-x-4 top-[calc(var(--nav-h)+0.5rem)] z-50 rounded-2xl border border-line bg-paper/90 p-5 text-left shadow-lift backdrop-blur-xl sm:absolute sm:inset-x-auto sm:right-0 sm:top-[calc(100%+0.75rem)] sm:w-[16rem]"
          >
            <p className="text-[0.62rem] uppercase tracking-[0.24em] text-ink-faint">
              On iPhone
            </p>
            <p className="mt-3 text-[0.85rem] leading-[1.75] text-ink-soft">
              Tap <span className="text-ink">Share</span> in the toolbar, then{" "}
              <span className="text-ink">Add to Home Screen</span>.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
