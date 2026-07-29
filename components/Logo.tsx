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

export function LogoLockup({
  className,
  animated = true,
}: {
  className?: string;
  animated?: boolean;
}) {
  return (
    <span className={clsx("inline-flex items-center gap-2 sm:gap-2.5", className)}>
      <LogoMark animated={animated} size={22} />
      <Wordmark />
      <span className="sr-only">Strng Minds — home</span>
    </span>
  );
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
