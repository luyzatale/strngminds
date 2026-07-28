"use client";

import { useEffect, type ReactNode } from "react";
import {
  motion,
  motionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type Transition,
} from "framer-motion";

/** Normalised pointer position, -1 → 1 on each axis. Shared by every layer. */
const pointerX = motionValue(0);
const pointerY = motionValue(0);

export const calm: Transition = {
  duration: 1.05,
  ease: [0.22, 1, 0.36, 1],
};

/** Mounted once, near the root. Nothing renders. */
export function PointerField() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)");
    if (reduced.matches || coarse.matches) return;

    let raf = 0;
    const onMove = (e: PointerEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        pointerX.set((e.clientX / window.innerWidth) * 2 - 1);
        pointerY.set((e.clientY / window.innerHeight) * 2 - 1);
        raf = 0;
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}

/**
 * Mouse parallax. `strength` is the maximum travel in px — kept in the 4–10
 * range everywhere, so the page breathes rather than slides.
 */
export function Parallax({
  strength = 6,
  invert = false,
  className,
  children,
}: {
  strength?: number;
  invert?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const reduced = useReducedMotion();
  const s = reduced ? 0 : invert ? -strength : strength;
  const spring = { stiffness: 42, damping: 18, mass: 0.7 };
  const x = useSpring(useTransform(pointerX, (v) => v * s), spring);
  const y = useSpring(useTransform(pointerY, (v) => v * s), spring);

  return (
    <motion.div style={{ x, y }} className={className}>
      {children}
    </motion.div>
  );
}

/** Scroll-in reveal: a short rise and a slow fade. Used sparingly and once. */
export function Reveal({
  delay = 0,
  y = 20,
  className,
  as = "div",
  children,
}: {
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "span" | "p";
  children: ReactNode;
}) {
  const reduced = useReducedMotion();
  const Tag = motion[as] as typeof motion.div;

  return (
    <Tag
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -12% 0px" }}
      transition={{ ...calm, delay }}
    >
      {children}
    </Tag>
  );
}

/** Word-by-word entrance for the one heading that deserves it. */
export function RevealWords({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  const words = text.split(" ");

  return (
    <span className={className}>
      {words.map((w, i) => (
        <span key={i}>
          <span className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            initial={reduced ? false : { y: "62%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{
              duration: 1.15,
              ease: [0.22, 1, 0.36, 1],
              delay: delay + i * 0.075,
            }}
          >
            {w}
          </motion.span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}

/** Fades in on mount — for elements that sit above the fold. */
export function FadeIn({
  delay = 0,
  y = 14,
  className,
  children,
}: {
  delay?: number;
  y?: number;
  className?: string;
  children: ReactNode;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...calm, delay }}
    >
      {children}
    </motion.div>
  );
}
