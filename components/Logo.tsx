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

   The mark from the delivered wordmark, as a path rather than as a crop of
   the artwork. It had to be vector: in the supplied JPEG the spiral is only
   about 70x125px, so a 512px app icon cut from it would be visibly soft, and
   the same file has to serve a 22px mark beside a line of type.

   The curve is generated rather than eyeballed — a logarithmic spiral of 2.1
   turns running into a damped serpentine, with a half-width that decays along
   its length so the stroke tapers to a thread the way the original does. It
   was fitted against the artwork side by side at matched scale. Sampling is
   deliberately coarse: at every ninth point and one decimal the drawn result
   is indistinguishable from the fine version and less than half the bytes,
   while a coarser step starts to show flats in the innermost coil.

   `currentColor`, so it takes the ink of whatever it sits in and needs no
   per-theme handling.
   ──────────────────────────────────────────────────────────── */
const MARK_VIEWBOX = "24.8 7.4 47.8 115.4";
/** width / height of that box — the mark is tall and narrow, not square */
const MARK_RATIO = 47.8 / 115.4;
const MARK_PATH =
  "M50.3 96.6C49.7 96.6,48.1 96.6,47.1 96.9C46.1 97.2,45.1 97.8,44.2 98.5C43.4 99.2,42.7 100.2,42.2 101.3C41.7 102.3,41.4 103.6,41.4 104.8C41.5 106,41.7 107.3,42.2 108.4C42.8 109.5,43.6 110.6,44.5 111.5C45.5 112.3,46.8 113.1,48 113.4C49.3 113.8,50.8 114,52.2 113.8C53.6 113.6,55.1 113.1,56.3 112.3C57.5 111.6,58.7 110.5,59.5 109.2C60.4 108,61 106.4,61.3 104.8C61.5 103.3,61.5 101.5,61.1 99.9C60.7 98.4,59.8 96.7,58.8 95.4C57.7 94.1,56.2 92.8,54.6 92C53 91.2,51.1 90.7,49.3 90.6C47.4 90.6,45.3 90.9,43.5 91.6C41.7 92.3,39.9 93.5,38.5 95C37.1 96.5,35.9 98.4,35.2 100.4C34.5 102.4,34.1 104.7,34.3 106.9C34.5 109.1,35.2 111.6,36.3 113.6C37.5 115.6,39.2 117.6,41.1 119C43 120.4,45.5 121.6,48 122.1C50.5 122.7,53.3 122.7,55.9 122.2C58.5 121.6,61.3 120.4,63.5 118.8C65.7 117.1,67.9 114.8,69.3 112.3C70.7 109.7,71.7 106.6,72 103.6C72.2 100.6,71.9 97.1,70.8 94.1C69.7 91.1,67.9 88,65.6 85.6C63.3 83.1,60.2 80.9,56.9 79.6C53.7 78.3,49.8 77.6,46.1 77.7C42.4 77.9,35.6 79.7,34.9 80.5C34.2 81.4,40.1 83.2,42.1 83C44.1 82.9,46.5 81,46.8 79.6C47.1 78.3,45.3 76.2,43.8 75.1C42.3 74,39.7 73.6,37.6 72.9C35.5 72.2,32.8 71.5,31.3 70.9C29.7 70.3,28.8 69.6,28.3 69.4C27.9 69.2,27.9 70.1,28.6 69.9C29.2 69.6,30.8 68.7,32.3 68C33.8 67.3,36 66.6,37.6 65.8C39.2 65,41 64.4,41.8 63.3C42.6 62.2,42.8 60.2,42.3 59.1C41.8 58,40.2 57.3,38.9 56.5C37.6 55.7,35.8 55.1,34.6 54.4C33.4 53.7,32.1 53,31.5 52.6C30.9 52.1,30.9 52.2,31 51.9C31.1 51.6,31.4 51.2,32.2 50.6C32.9 50,34.2 49.2,35.3 48.5C36.3 47.8,37.7 47.1,38.5 46.2C39.3 45.3,40 44.2,40.1 43.2C40.2 42.2,39.5 41.1,38.8 40.2C38.2 39.4,37 38.7,36.2 38C35.3 37.3,34.3 36.6,33.7 36C33 35.4,32.6 34.9,32.5 34.5C32.3 34,32.4 33.6,32.7 33.1C33 32.5,33.6 31.8,34.2 31.1C34.8 30.4,35.8 29.7,36.4 28.9C37 28.2,37.6 27.4,37.9 26.5C38.1 25.7,38.1 24.8,37.9 24C37.6 23.1,37 22.4,36.5 21.7C36 20.9,35.2 20.3,34.7 19.6C34.2 18.9,33.7 18.3,33.4 17.6C33.1 17,33 16.4,33.1 15.8C33.1 15.1,33.4 14.5,33.7 13.8C34 13.1,34.6 12.4,35 11.7C35.4 10.9,35.9 10.1,36.1 9.5C36.4 8.9,36.4 8.3,36.5 8L36.2 8C36.1 8.2,36 8.8,35.8 9.3C35.5 9.9,35 10.7,34.5 11.4C34.1 12,33.5 12.7,33.1 13.5C32.7 14.2,32.3 14.9,32.2 15.7C32.1 16.4,32.2 17.3,32.5 18C32.8 18.8,33.3 19.6,33.8 20.3C34.3 21,35 21.8,35.5 22.4C35.9 23.1,36.4 23.8,36.5 24.4C36.7 25,36.7 25.4,36.4 26C36.2 26.6,35.7 27.2,35.1 27.8C34.6 28.5,33.7 29.1,33 29.8C32.3 30.6,31.4 31.3,31 32.1C30.6 33,30.3 34.1,30.5 35C30.7 35.9,31.4 36.8,32.1 37.6C32.9 38.4,34 39.1,34.8 39.8C35.6 40.5,36.6 41.3,37 41.8C37.5 42.4,37.7 42.6,37.6 43.1C37.6 43.5,37.3 43.8,36.7 44.3C36.1 44.8,34.9 45.5,33.9 46.2C32.8 46.9,31.4 47.5,30.4 48.3C29.5 49.2,28.3 50.2,28.1 51.2C28 52.3,28.7 53.8,29.5 54.8C30.3 55.8,31.9 56.4,33.2 57.2C34.5 57.9,36.3 58.7,37.4 59.3C38.4 59.9,39.2 60.7,39.6 60.9C39.9 61.2,40 60.6,39.4 60.9C38.8 61.2,37.6 62,36.2 62.6C34.8 63.3,32.6 64,30.9 64.7C29.3 65.4,27.2 65.8,26.3 67C25.4 68.2,24.8 70.5,25.4 71.7C26 72.9,28.1 73.6,29.9 74.4C31.8 75.2,34.5 75.9,36.5 76.6C38.5 77.3,41 78.4,42.1 78.6C43.2 78.9,43.3 78.2,43 78.3C42.8 78.4,41.8 78.2,40.7 79.2C39.7 80.2,35.8 83.8,36.7 84.3C37.6 84.7,43.1 82,46.2 81.9C49.3 81.8,52.6 82.5,55.3 83.6C58 84.7,60.6 86.5,62.5 88.5C64.4 90.5,65.8 93.1,66.7 95.5C67.5 98,67.8 100.7,67.6 103.2C67.4 105.6,66.5 108.1,65.4 110.1C64.3 112.1,62.6 113.9,60.8 115.1C59.1 116.4,57 117.3,55 117.7C53 118.1,50.8 118.1,49 117.7C47.1 117.3,45.3 116.4,43.9 115.3C42.5 114.2,41.2 112.8,40.4 111.3C39.6 109.9,39.1 108.1,39 106.6C38.9 105,39.2 103.4,39.6 102C40.1 100.6,41 99.3,41.9 98.3C42.9 97.3,44.1 96.5,45.3 96.1C46.5 95.6,47.8 95.4,49 95.5C50.2 95.5,51.4 95.9,52.4 96.4C53.4 96.9,54.3 97.6,55 98.4C55.6 99.2,56.1 100.2,56.3 101.2C56.6 102.1,56.6 103.1,56.4 104C56.3 104.9,55.9 105.7,55.5 106.4C55 107.1,54.3 107.7,53.7 108.1C53 108.5,52.3 108.8,51.6 108.9C50.9 109,50.1 108.9,49.5 108.7C48.9 108.5,48.3 108.1,47.8 107.8C47.4 107.4,47 106.8,46.8 106.3C46.5 105.8,46.4 105.3,46.4 104.8C46.4 104.3,46.6 103.7,46.7 103.3C46.9 102.9,47.2 102.5,47.5 102.2C47.8 102,48.2 101.8,48.6 101.6C49 101.5,49.6 101.6,49.7 101.6Z";

export function SpiralMark({
  size = 22,
  className,
}: {
  /** height in px; the width follows from the mark's own proportions */
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox={MARK_VIEWBOX}
      height={size}
      width={size * MARK_RATIO}
      className={clsx("shrink-0", className)}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d={MARK_PATH} />
    </svg>
  );
}

export function LogoLockup({ className }: { className?: string }) {
  return (
    <span
      /* The anchor around this already carries aria-label="Strng Minds — home",
         and that wins over anything in here, so this is decoration. */
      aria-hidden="true"
      className={clsx("block h-[1.35rem] sm:h-[1.6rem]", className)}
      style={{
        aspectRatio: `${WORDMARK.w} / ${WORDMARK.h}`,
        backgroundColor: "var(--color-ink)",
        WebkitMaskImage: "url(/logo-wordmark.png)",
        maskImage: "url(/logo-wordmark.png)",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskPosition: "left center",
        maskPosition: "left center",
      }}
    />
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
