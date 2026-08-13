"use client";

import { useEffect, useState } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LogoLockup } from "@/components/Logo";
import InstallButton from "@/components/InstallButton";
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

/** Centred tabs from md up; the same list behind one button on a phone. */
const TABS: Link[] = [
  { href: "/", label: "Home" },
  { href: "/podcast", label: "Podcast" },
  { href: "/about", label: "About" },
];

const MENU: Link[] = [...TABS, { href: CONTACT, label: "Contact" }];

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

  // never leave the drawer open behind a new page
  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <header
        className={clsx(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
        scrolled || open
          ? "bg-paper/72 backdrop-blur-xl backdrop-saturate-150"
          : "bg-transparent",
      )}
    >
      <nav
        aria-label="Primary"
        className="relative mx-auto flex h-[var(--nav-row)] w-full max-w-[110rem] items-center justify-between gap-3 px-5 sm:px-10 lg:px-14"
      >
        <NextLink href="/" className="relative -m-2 p-2" aria-label="Strng Minds — home">
          <LogoLockup />
        </NextLink>

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
          <ThemeToggle />

          {/* The contact pill is a phone's worth of width on its own, so on a
              phone it lives in the menu with everything else. */}
          <NextLink
            href={CONTACT}
            className="hidden h-8 items-center rounded-full border border-line-strong/50 bg-surface px-3.5 text-[0.74rem] tracking-[0.04em] text-ink-soft transition-[background-color,border-color,color] duration-500 hover:border-gold/70 hover:bg-ivory/25 hover:text-ink md:inline-flex"
            style={{ boxShadow: "var(--control-shadow, none)" }}
          >
            Contact
          </NextLink>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line-strong/50 bg-surface text-ink transition-[background-color,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-gold hover:bg-ivory/25 md:hidden"
            style={{ boxShadow: "var(--control-shadow, none)" }}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span className="relative block h-3 w-4" aria-hidden="true">
              <span
                className={clsx(
                  "absolute left-0 block h-px w-full bg-current transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  open ? "top-1.5 rotate-45" : "top-0",
                )}
              />
              <span
                className={clsx(
                  "absolute left-0 block h-px w-full bg-current transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  open ? "top-1.5 opacity-0" : "top-1.5",
                )}
              />
              <span
                className={clsx(
                  "absolute left-0 block h-px w-full bg-current transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  open ? "top-1.5 -rotate-45" : "top-3",
                )}
              />
            </span>
          </button>
        </div>
      </nav>

      {/* Centred over the bar, from md up only. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 hidden h-[var(--nav-row)] items-center justify-center md:flex">
        <ul className="pointer-events-auto flex items-center justify-center gap-2">
          {TABS.map((t) => (
            <li key={t.href}>
              <NextLink
                href={t.href}
                aria-current={pathname === t.href ? "page" : undefined}
                className={clsx(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[0.62rem] uppercase tracking-[0.2em] transition-[background-color,border-color,color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  // the active state is a whisper, not a highlight
                  pathname === t.href
                    ? "border-gold/[0.18] bg-ivory/[0.035] text-ink-soft"
                    : "border-transparent text-ink-faint hover:text-ink-soft",
                )}
              >
                <span
                  aria-hidden="true"
                  className={clsx(
                    "h-[3px] w-[3px] rounded-full transition-colors duration-500",
                    pathname === t.href ? "bg-gold-deep" : "bg-mute",
                  )}
                />
                {t.label}
              </NextLink>
            </li>
          ))}
        </ul>
      </div>

      {/* The rule the rest of the bar will hang from — full bleed, with a
          second, fainter line beneath it. Both are pulled down: the bar is
          fourth in the reading order and a hard edge across the full width is
          the loudest thing it can do. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0">
        <div className="h-px w-full bg-line-strong/45" />
        <div className="mt-[5px] h-px w-full bg-line/35" />
      </div>

      </header>

      {/* Outside the header on purpose. The bar carries a backdrop-filter once
          it is scrolled or open, and that makes it the containing block for
          any fixed child — which left this panel resolving `bottom: 0` against
          a 68px bar, and painting nothing at all. */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            /* explicit edges: `inset-0` plus a `top` override left the panel
               with no height at all, so it painted nothing while its links
               spilled out and floated over the page */
            className="fixed bottom-0 left-0 right-0 top-[var(--nav-row)] z-40 overflow-y-auto md:hidden"
            style={{ backgroundColor: "var(--color-paper)" }}
          >
            <ul className="flex flex-col px-5 pt-6">
              {MENU.map((l, i) => {
                const active = pathname === l.href;
                return (
                  <motion.li
                    key={l.href}
                    initial={reduced ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.7,
                      delay: 0.05 * i,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <NextLink
                      href={l.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className="flex items-center gap-4 border-b border-line py-5"
                    >
                      <span
                        aria-hidden="true"
                        className={clsx(
                          "h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-500",
                          active ? "bg-gold-deep" : "bg-mute/60",
                        )}
                      />
                      {/* The register the rest of the site navigates in.
                          These were Cormorant Light at 1.4rem — display type,
                          and the lightest weight of it, which is the setting
                          that face is least sure in at a size this large on a
                          phone. Every other navigational thing here is small
                          uppercase sans on wide tracking: the desktop tabs at
                          0.62rem/0.2em, the eyebrows, the field labels. This
                          is that, opened up enough to stay comfortable as a
                          touch target. */}
                      <span
                        className={clsx(
                          "font-sans text-[0.82rem] uppercase leading-none tracking-[0.24em]",
                          active ? "text-ink" : "text-ink-soft",
                        )}
                      >
                        {l.label}
                      </span>
                    </NextLink>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
