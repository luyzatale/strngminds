"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LogoLockup } from "@/components/Logo";
import InstallButton from "@/components/InstallButton";
import Music from "@/components/Music";
import ThemeToggle from "@/components/ThemeToggle";
import { clsx } from "@/lib/clsx";

type Link = { href: string; label: string };

/** The full menu, for when the sections below the fold are mounted. */
export const SECTION_LINKS: Link[] = [
  { href: "#disciplines", label: "Disciplines" },
  { href: "#practice", label: "Practice" },
  { href: "#essay", label: "Journal" },
  { href: "#voices", label: "Voices" },
];

const CONTACT = "/contact";

/** The centred tabs, in the manner of the reference. */
const TABS: Link[] = [
  { href: "/", label: "Home" },
  { href: "/meditation", label: "Meditation" },
];

export default function Nav({ links = [] }: { links?: Link[] }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
        scrolled ? "bg-paper/72 backdrop-blur-xl backdrop-saturate-150" : "bg-transparent",
      )}
    >
      <nav
        aria-label="Primary"
        className="relative mx-auto flex h-[var(--nav-row)] w-full max-w-[110rem] items-center justify-between gap-3 px-5 sm:px-10 lg:px-14"
      >
        <a href="/" className="relative -m-2 p-2" aria-label="Strng Minds — home">
          <LogoLockup />
        </a>

        {links.length > 0 && (
          <ul className="hidden items-center gap-9 md:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="group relative text-[0.82rem] tracking-[0.02em] text-ink-soft transition-colors duration-500 hover:text-ink"
                >
                  <span>{l.label}</span>
                  <span className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-gold-deep/70 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>
        )}

        <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
          <InstallButton />
          <Music />
          <ThemeToggle />

          <a
            href={CONTACT}
            className="inline-flex h-10 items-center rounded-full border border-line-strong px-3.5 text-[0.74rem] tracking-[0.04em] text-ink transition-[background-color,border-color] duration-500 hover:border-gold hover:bg-ivory/20 sm:h-9 sm:px-5 sm:text-[0.8rem]"
          >
            Contact
          </a>

          {links.length > 0 && (
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="-mr-2 ml-1 flex h-10 w-10 items-center justify-center md:hidden"
            >
              <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
              <span className="relative block h-3 w-5" aria-hidden="true">
                <span
                  className={clsx(
                    "absolute left-0 block h-px w-full bg-ink transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    open ? "top-1.5 rotate-45" : "top-0",
                  )}
                />
                <span
                  className={clsx(
                    "absolute left-0 block h-px w-full bg-ink transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    open ? "top-1.5 -rotate-45" : "top-3",
                  )}
                />
              </span>
            </button>
          )}
        </div>
      </nav>

      {/* Centred over the bar from md up; a row of its own on a phone, where
          the logo and the controls already fill the width. */}
      <div className="pointer-events-none md:absolute md:inset-x-0 md:top-0 md:flex md:h-[var(--nav-row)] md:items-center md:justify-center">
        <ul className="pointer-events-auto flex items-center justify-center gap-1.5 pb-2.5 md:gap-2 md:pb-0">
          {TABS.map((t) => {
            const active = pathname === t.href;
            return (
              <li key={t.href}>
                <a
                  href={t.href}
                  aria-current={active ? "page" : undefined}
                  className={clsx(
                    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[0.62rem] uppercase tracking-[0.2em] transition-[background-color,border-color,color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:text-[0.66rem] sm:tracking-[0.24em]",
                    active
                      ? "border-gold/50 bg-ivory/10 text-ink"
                      : "border-transparent text-ink-faint hover:text-ink",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={clsx(
                      "h-1 w-1 rounded-full transition-colors duration-500",
                      active ? "bg-gold-deep" : "bg-mute",
                    )}
                  />
                  {t.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      {/* The rule the rest of the bar will hang from — full bleed, with a
          second, fainter line beneath it. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0">
        <div className="h-px w-full bg-line-strong/70" />
        <div className="mt-[5px] h-px w-full bg-line/60" />
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 top-[var(--nav-h)] z-40 bg-paper/95 backdrop-blur-xl md:hidden"
          >
            <ul className="flex flex-col gap-1 px-6 pt-10 sm:px-10">
              {links.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={reduced ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.06 * i,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-line py-5 font-serif text-3xl font-light text-ink"
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
