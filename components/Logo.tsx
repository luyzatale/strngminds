import { clsx } from "@/lib/clsx";

/**
 * The mark is a thin ring — the same geometry as an orbit line — with a single
 * point of gold travelling it. The wordmark is set in the serif, wide-tracked.
 */
export function LogoMark({
  size = 38,
  animated = true,
  className,
}: {
  size?: number;
  animated?: boolean;
  className?: string;
}) {
  return (
    <span
      className={clsx("relative inline-block shrink-0", className)}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {/* The ring carries its own weight per theme for the same reason the
          wordmark does. At 55% it sat comfortably beside a 500 serif; beside
          a 600 one on parchment it reads as the weaker half of a lockup that
          is meant to be one mark. */}
      <span
        className="absolute inset-0 rounded-full border-[1.5px] border-ink"
        style={{ opacity: "var(--logo-ring-o, 0.55)" }}
      />
      <span
        className="absolute inset-0"
        style={
          animated
            ? {
                animation: "sm-spin-slow 46s linear infinite",
                transformOrigin: "50% 50%",
              }
            : undefined
        }
      >
        {/* The travelling point. Both the diameter and the colour are scaled
            per theme rather than raised outright: on parchment `gold-deep` is
            a hairline token and sat too close to the paper to be seen going
            round, but against black the old 2.5px in pale gold already read
            perfectly well, and that theme is the reference. Light gets a
            third again the size and a deeper gold; night keeps exactly what
            it had. */}
        <span
          className="absolute left-1/2 top-0 rounded-full"
          style={{
            width: `calc(${Math.max(2.5, size * 0.105)}px * var(--logo-dot-scale, 1))`,
            height: `calc(${Math.max(2.5, size * 0.105)}px * var(--logo-dot-scale, 1))`,
            backgroundColor: "var(--logo-dot, #e4d1ac)",
            transform: "translate(-50%, -50%)",
          }}
        />
      </span>
    </span>
  );
}

/**
 * On a phone the two words stack, which both fits the bar and echoes the
 * circular emblem; from `sm` up they sit on one line at full size.
 *
 * Set small on purpose. A house that is sure of itself does not need its name
 * at the size of a headline, and the mark reads as more confident for being
 * quieter than the thing it introduces. The tracking comes in slightly with
 * the size: wide letterspacing that reads as air at 1.18rem reads as a gap at
 * 0.95rem.
 *
 * The weight is a token rather than a utility because the two themes need
 * different ones. A serif at 500 has enough presence against a dark ground;
 * on parchment the same strokes thin out, and the mark reads lighter than it
 * did at night for no reason the eye can name. 700 by day — the heaviest
 * Cormorant Garamond ships — restores it. Night stays at 500.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={clsx(
        "flex flex-col whitespace-nowrap font-serif text-[0.7rem] uppercase leading-[1.06] tracking-[0.13em] text-ink",
        "sm:flex-row sm:gap-[0.32em] sm:text-[0.95rem] sm:leading-none sm:tracking-[0.2em]",
        className,
      )}
      /**
       * The stroke is here because 700 is the end of the road for this face —
       * Cormorant Garamond ships nothing heavier, so `font-weight` has no
       * further to go. Painting a hairline outline in the text's own colour
       * thickens every stem without swapping the typeface, which is the one
       * thing that must not change. Kept to a third of a pixel: past about
       * 0.5px the counters in S and G start to silt up at this size.
       */
      style={{
        fontWeight: "var(--logo-weight, 500)",
        WebkitTextStrokeWidth: "var(--logo-stroke, 0px)",
        WebkitTextStrokeColor: "currentColor",
      }}
    >
      <span>Strng</span>
      <span>Minds</span>
    </span>
  );
}

/**
 * The delivered wordmark, as artwork rather than as type.
 *
 * It arrived as white-on-black JPEG, which cannot sit on the parchment theme —
 * it would be a black plate in the corner of an ivory page. So the luminance is
 * carried as an alpha channel in public/logo-wordmark.png and the file is used
 * as a *mask* rather than as an image: the colour underneath is `--color-ink`,
 * so the mark takes whichever ink the active theme defines and needs no second
 * asset and no `dark:` variant. The black ground is gone, not hidden.
 *
 * The PNG is the wordmark band of the original only — the tagline beneath it is
 * set as live text under the system in Hero, where it can wrap and be read.
 */
const WORDMARK = { w: 665, h: 131 } as const;

/* ────────────────────────────────────────────────────────────
   The spiral.

   The mark from the delivered wordmark, and it is a crop of the artwork
   rather than a curve of my own. A generated one was tried first — a
   logarithmic spiral running into a damped serpentine — and fitted against
   the original side by side it was close but not the same object: the coil
   came out smaller and tighter, the serpentine wider and more angular, and
   there was a visible kink where the two met that the real mark does not
   have. Close is the wrong target for a logo.

   So the same treatment as the wordmark above: the artwork's luminance is
   carried as alpha in public/logo-mark.png and the file is used as a mask,
   painted here in `currentColor` so it takes the ink of whatever it sits in.

   The source is small — 50x123px in the supplied JPEG — so the PNG is stored
   at 4x, smoothed on the way up. That is enough for the 22-30px mark beside a
   line of type and for the app icons; it is the ceiling on how crisp a large
   icon can be, and lifting it needs the mark from its vector original.
   ──────────────────────────────────────────────────────────── */
const MARK = { w: 224, h: 516 } as const;

export function SpiralMark({
  size = 22,
  className,
}: {
  /** height in px; the width follows from the mark's own proportions */
  size?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={clsx("block shrink-0", className)}
      style={{
        height: size,
        width: size * (MARK.w / MARK.h),
        backgroundColor: "currentColor",
        WebkitMaskImage: "url(/logo-mark.png)",
        maskImage: "url(/logo-mark.png)",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}

/**
 * The wordmark on its own, at whatever height the caller sets.
 *
 * `height` is a CSS length rather than a number so a caller can hand it a
 * clamp and let the mark scale with the viewport; the width follows from the
 * artwork's proportions. `align` moves the mask within its box — the bar wants
 * it flush left, a centred lockup wants it centred.
 */
export function WordmarkArt({
  height,
  align = "left",
  className,
}: {
  /** omit to size it from `className` instead — an inline height would win */
  height?: string;
  align?: "left" | "center";
  className?: string;
}) {
  const pos = align === "center" ? "center" : "left center";
  return (
    <span
      aria-hidden="true"
      className={clsx("block", className)}
      style={{
        ...(height ? { height } : null),
        aspectRatio: `${WORDMARK.w} / ${WORDMARK.h}`,
        backgroundColor: "var(--color-ink)",
        WebkitMaskImage: "url(/logo-wordmark.png)",
        maskImage: "url(/logo-wordmark.png)",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskPosition: pos,
        maskPosition: pos,
      }}
    />
  );
}

export function LogoLockup({ className }: { className?: string }) {
  /* The anchor around this already carries aria-label="Strng Minds — home",
     and that wins over anything in here, so this is decoration. */
  return <WordmarkArt className={clsx("h-[1.35rem] sm:h-[1.6rem]", className)} />;
}

/** Full circular emblem: two stacked lines of serif caps inside the orbit ring. */
export function LogoEmblem({
  size = 168,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "relative inline-flex items-center justify-center rounded-full border border-ink/20",
        className,
      )}
      style={{ width: size, height: size }}
      role="img"
      aria-label="Strng Minds"
    >
      <span
        className="flex flex-col items-center font-serif uppercase leading-[1.24] text-ink"
        style={{ fontSize: size * 0.145, letterSpacing: "0.06em" }}
      >
        <span>Strng</span>
        <span>Minds</span>
      </span>
    </span>
  );
}
