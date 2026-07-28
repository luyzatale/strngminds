import Scene from "@/components/Scene";
import {
  Constellation,
  Dust,
  FROST_CORE,
  FROST_INK,
  Galaxy,
  NEBULA_CORE,
  NEBULA_INK,
  Nebulae,
  SOFT_CORE,
  SOFT_INK,
  SoftGalaxy,
  VERDANT_CORE,
  VERDANT_INK,
} from "@/components/Celestial";
import { Parallax } from "@/components/Motion";
import { round, seeded } from "@/lib/rand";

/**
 * The hero is a single viewport, and at this stage it is only the system:
 * the copy that used to sit in the middle has been cleared out so the object
 * carries the page on its own.
 */
export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-4 pb-24 pt-[var(--nav-h)] sm:px-10 sm:pb-16"
    >
      <h1 className="sr-only">
        Strng Minds — a contemplative practice where philosophy, astronomy,
        psychology and symbolism meet
      </h1>

      <HeroDecor />

      {/* Scene positions its own star layer against this section, so it is
          mounted directly rather than inside a wrapper. */}
      <Scene />

      {/* Lifted off the floor of the viewport and given back a little size and
          a little less tracking. It stays quiet, but it is now legible at a
          glance rather than on inspection.

          Now raised another 24px, which draws it up out of the floor of the
          viewport and into the composition — it belongs to the system above it
          rather than to the edge below it. Well clear of the corner controls,
          which reach only 56px up. */}
      <p className="pointer-events-none absolute bottom-24 left-1/2 z-10 w-full -translate-x-1/2 whitespace-nowrap text-center text-[0.62rem] uppercase tracking-[0.24em] text-ink-faint sm:bottom-[5.5rem] sm:text-[0.68rem] sm:tracking-[0.3em]">
        Drag to turn
        <span className="sm:hidden"> · tap a planet</span>
        <span className="hidden sm:inline"> · hover a planet</span>
      </p>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   The universe.

   Five layers, ordered by distance, and the ordering is the whole design.
   Everything about a body follows from how far away it is meant to be: how
   large it is drawn, how bright, how sharp, whether it is worth drawing as a
   spiral at all, and which of the three drifting layers carries it. Nothing
   is placed to fill a gap — the gaps are the point.
   ──────────────────────────────────────────────────────────── */

type Tint = "nebula" | "frost" | "verdant";

const INK: Record<Tint, string[]> = {
  nebula: NEBULA_INK,
  frost: FROST_INK,
  verdant: VERDANT_INK,
};

const CORE: Record<Tint, string[]> = {
  nebula: NEBULA_CORE,
  frost: FROST_CORE,
  verdant: VERDANT_CORE,
};

type Common = {
  /** percentages of the hero, so an arrangement holds at any screen size */
  x: number;
  y: number;
  size: number;
  tilt: number;
  flatten: number;
  opacity: number;
  /** unique — two galaxies sharing a seed are the same galaxy twice */
  seed: number;
};

/** Big enough that the arms resolve, so drawn dot by dot. */
type Spiral = Common & {
  kind: "spiral";
  duration: number;
  reverse: boolean;
  blur: number;
  tinted: Tint | null;
};

/** Too small for arms to mean anything, so drawn as light. */
type Soft = Common & {
  kind: "soft";
  ink: string;
  core: string;
  blur: number;
  /** whether it survives onto a phone, where the field is thinned out */
  phone: boolean;
};

type Body = Spiral | Soft;

/** 0 at the sun, 1 at a corner. The axis everything else hangs off. */
const depth = (x: number, y: number) =>
  Math.hypot(x - 0.5, y - 0.5) / Math.SQRT1_2;

/**
 * Three regions nothing is allowed into.
 *
 * Rejection sampling with a minimum gap gives an even spread, and an even
 * spread is the opposite of what deep space looks like — it reads as a texture
 * rather than a distance. These carve out the large bare areas that make the
 * populated ones feel populated. They are placed by hand and off-axis, so the
 * emptiness is asymmetric too.
 */
const VOIDS = [
  { x: 0.34, y: 0.16, r: 0.2 },
  { x: 0.68, y: 0.89, r: 0.18 },
  { x: 0.04, y: 0.85, r: 0.15 },
];

type Spot = { x: number; y: number };

/**
 * Scatter `count` positions under the field's rules.
 *
 * `edge` is the one that does the compositional work: a candidate survives
 * with probability `depth ^ edge`, so above 1 the population is pushed out
 * toward the frame and below 1 it is allowed to come inward. That is how the
 * field frames the system instead of ringing it — the big things stay out at
 * the border and only the faintest are permitted near the middle.
 */
function scatter(
  rnd: () => number,
  count: number,
  o: { gap: number; clear: number; edge: number; taken: Spot[] },
): Spot[] {
  const out: Spot[] = [];
  let guard = 0;

  while (out.length < count && guard++ < count * 400) {
    const x = rnd();
    const y = rnd();
    const d = depth(x, y);

    if (d < o.clear) continue; // never over the system
    if (y < 0.07 || y > 0.95) continue; // clear of the bar and of the hint
    if (rnd() > Math.pow(d, o.edge)) continue;
    if (VOIDS.some((v) => Math.hypot(v.x - x, v.y - y) < v.r)) continue;
    if (o.taken.some((t) => Math.hypot(t.x - x, t.y - y) < o.gap)) continue;

    out.push({ x, y });
    o.taken.push({ x, y });
  }

  return out;
}

/**
 * Layer 5 — the anchors. Three, placed by hand, because three objects that
 * carry a composition are not a job for a random number generator.
 *
 * Two of them sit on a diagonal, upper-right against mid-left, which balances
 * without symmetry; the third is smaller and quieter and sits low on the right
 * to stop that diagonal reading as a rule. They also carry three of the four
 * painted palettes, the teal one keeping its standing place at the left of the
 * system.
 *
 * The three are not on the same focus plane, and that is deliberate: the first
 * is fully sharp, the second slightly off, the third softer again. Anchors at
 * identical sharpness read as three stickers on one sheet of glass no matter
 * how their sizes vary, because focus is the cue the eye actually uses for
 * distance. Positions are fixed; only weight and focus move.
 */
const HEROES: Spiral[] = [
  { kind: "spiral", x: 83, y: 23, size: 193, tilt: -28, flatten: 0.4, opacity: 0.57, blur: 0, duration: 21600, reverse: false, tinted: "nebula", seed: 4101 },
  { kind: "spiral", x: 10, y: 50, size: 178, tilt: 16, flatten: 0.34, opacity: 0.54, blur: 0.3, duration: 25200, reverse: true, tinted: "verdant", seed: 4207 },
  { kind: "spiral", x: 86, y: 73, size: 158, tilt: -52, flatten: 0.44, opacity: 0.49, blur: 0.65, duration: 28800, reverse: false, tinted: "frost", seed: 4313 },
];

const { MEDIUM, SMALL, TINY } = (() => {
  const rnd = seeded(4703);
  const taken: Spot[] = HEROES.map((h) => ({ x: h.x / 100, y: h.y / 100 }));

  const mediumAt = scatter(rnd, 7, { gap: 0.2, clear: 0.44, edge: 1.2, taken });
  const smallAt = scatter(rnd, 12, { gap: 0.13, clear: 0.33, edge: 0.85, taken });
  const tinyAt = scatter(rnd, 30, { gap: 0.07, clear: 0.25, edge: 0.5, taken });

  /**
   * Layer 4 — the frame. Large enough to still be spirals, dim enough that
   * they register as structure rather than as objects. One of them carries the
   * second violet palette.
   */
  const MEDIUM: Spiral[] = mediumAt.map((s, i) => {
    const size = Math.round(122 + rnd() * 56);
    return {
      kind: "spiral" as const,
      x: round(s.x * 100, 2),
      y: round(s.y * 100, 2),
      size,
      tilt: Math.round(-70 + rnd() * 140),
      flatten: round(0.24 + rnd() * 0.28, 2),
      opacity: round(0.31 + rnd() * 0.13, 2),
      // focus follows size within the band too, not just between bands
      blur: round(1.6 - ((size - 122) / 56) * 0.8, 2),
      // an order of magnitude slower than the heroes, which are already slow
      duration: Math.round(32400 + rnd() * 12600),
      reverse: rnd() > 0.5,
      tinted: i === 0 ? ("nebula" as const) : null,
      seed: 5000 + i * 37,
    };
  });

  /**
   * Layer 3, near half — present, but only as much as a distant thing is.
   *
   * Note the flatten range, which is nothing like the spirals'. A galaxy drawn
   * at 0.2 flatten is a sliver, and a faint sliver at this size is a scratch
   * on the lens, not an object in space. Held between 0.45 and 0.85 they stay
   * round enough to read as things rather than as marks.
   */
  const SMALL: Soft[] = smallAt.map((s, i) => {
    const size = Math.round(58 + rnd() * 50);
    return {
      kind: "soft" as const,
      x: round(s.x * 100, 2),
      y: round(s.y * 100, 2),
      size,
      tilt: Math.round(-80 + rnd() * 160),
      flatten: round(0.45 + rnd() * 0.4, 2),
      opacity: round(0.13 + rnd() * 0.08, 2),
      blur: round(2.2 - ((size - 58) / 50) * 1.0, 2),
      ink: SOFT_INK[Math.floor(rnd() * SOFT_INK.length)],
      core: SOFT_CORE[Math.floor(rnd() * SOFT_CORE.length)],
      phone: i < 5,
      seed: 6000 + i * 41,
    };
  });

  /**
   * Layer 3, far half — the ones that are only ever seen by accident. At this
   * size and this opacity none of them is legible on its own; what they do is
   * make the count of things out there feel unbounded, which is the whole job.
   */
  const TINY: Soft[] = tinyAt.map((s, i) => {
    const size = Math.round(18 + rnd() * 30);
    return {
      kind: "soft" as const,
      x: round(s.x * 100, 2),
      y: round(s.y * 100, 2),
      size,
      tilt: Math.round(-90 + rnd() * 180),
      flatten: round(0.55 + rnd() * 0.35, 2),
      opacity: round(0.055 + rnd() * 0.055, 2),
      // the deepest plane: blurred past the point of having a shape at all
      blur: round(3.0 - ((size - 18) / 30) * 1.2, 2),
      ink: SOFT_INK[Math.floor(rnd() * SOFT_INK.length)],
      core: SOFT_CORE[Math.floor(rnd() * SOFT_CORE.length)],
      phone: i < 16,
      seed: 7000 + i * 43,
    };
  });

  return { MEDIUM, SMALL, TINY };
})();

/**
 * The phone's anchors, still composed by hand rather than sampled.
 *
 * The reasoning has not changed: percentages arranged for a landscape frame
 * come apart in portrait, and no subset of a landscape composition is a
 * portrait composition. What has changed is that only the anchors need this
 * treatment now — the small and tiny layers above are diffuse enough to be
 * texture rather than composition, so they carry over to both frames and only
 * get thinned.
 *
 * Five, descending the screen and alternating sides, each clear of the bar
 * above and the hint and controls below. The first and last are held at 17%
 * and 76% rather than nearer the edges: a percentage is a different number of
 * pixels on a 640-tall screen than a 932-tall one, and pushed further out the
 * short end of that range slid one under the bar and the other across the
 * hint.
 */
const PHONE: Body[] = [
  { kind: "soft", x: 24, y: 17, size: 70, tilt: -34, flatten: 0.5, opacity: 0.18, blur: 2.1, ink: SOFT_INK[1], core: SOFT_CORE[0], phone: true, seed: 8101 },
  { kind: "spiral", x: 79, y: 25, size: 116, tilt: 22, flatten: 0.42, opacity: 0.4, blur: 0.55, duration: 25200, reverse: true, tinted: "nebula", seed: 8207 },
  // left of the system, at the height of the sun
  { kind: "spiral", x: 15, y: 47, size: 120, tilt: -18, flatten: 0.38, opacity: 0.42, blur: 0.3, duration: 28800, reverse: false, tinted: "verdant", seed: 8313 },
  // the nearest and largest, set against the two on the left below it
  { kind: "spiral", x: 74, y: 69, size: 156, tilt: 41, flatten: 0.34, opacity: 0.45, blur: 0, duration: 21600, reverse: true, tinted: "frost", seed: 8419 },
  // pulled up from 76%: the hint moved closer to the system, and on a short
  // screen this was the one object with room to be crossed by it
  { kind: "soft", x: 26, y: 73, size: 100, tilt: -52, flatten: 0.42, opacity: 0.25, blur: 1.5, ink: SOFT_INK[2], core: SOFT_CORE[3], phone: true, seed: 8525 },
];

function HeroDecor() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Atmosphere, beneath everything. */}
      <div className="hidden sm:block">
        <Nebulae />
      </div>
      <div className="sm:hidden">
        <Nebulae phone />
      </div>

      {/* Layer 3 — the far field. Barely moves, because it is barely there. */}
      <div
        className="absolute inset-0"
        style={{
          animationName: "sm-layer-far",
          animationDuration: "calc(460s * var(--motion-scale, 1))",
          animationTimingFunction: "ease-in-out",
          animationIterationCount: "infinite",
        }}
      >
        {TINY.map((b) => (
          <GalaxyAt
            key={b.seed}
            b={b}
            className={b.phone ? "absolute" : "absolute hidden sm:block"}
          />
        ))}
      </div>

      {/* Layer 4 — the middle distance. */}
      <div
        className="absolute inset-0"
        style={{
          animationName: "sm-layer-mid",
          animationDuration: "calc(370s * var(--motion-scale, 1))",
          animationTimingFunction: "ease-in-out",
          animationIterationCount: "infinite",
        }}
      >
        {SMALL.map((b) => (
          <GalaxyAt
            key={b.seed}
            b={b}
            className={b.phone ? "absolute" : "absolute hidden sm:block"}
          />
        ))}
        {MEDIUM.map((b) => (
          <GalaxyAt key={b.seed} b={b} className="absolute hidden sm:block" />
        ))}
      </div>

      {/* Layer 5 — the anchors, and the only things given pointer parallax.
          Fifty springs for fifty specks would cost the main thread a great
          deal to say almost nothing; three is where it reads. */}
      <div
        className="absolute inset-0"
        style={{
          animationName: "sm-layer-near",
          animationDuration: "calc(290s * var(--motion-scale, 1))",
          animationTimingFunction: "ease-in-out",
          animationIterationCount: "infinite",
        }}
      >
        {HEROES.map((b, i) => (
          <GalaxyAt
            key={b.seed}
            b={b}
            className="absolute hidden sm:block"
            parallax={{ strength: 5, invert: i % 2 === 1 }}
          />
        ))}
        {PHONE.map((b) => (
          <GalaxyAt key={b.seed} b={b} className="absolute sm:hidden" />
        ))}
      </div>

      <Dust seed={91} count={9} />

      {/* Hidden details. Small enough and faint enough that they are found on
          a second look rather than seen on the first. */}
      <Parallax strength={4} className="absolute right-[2%] top-[26vh] hidden lg:block">
        <Constellation shape="cassiopeia" width={106} delay={2} />
      </Parallax>

      <Parallax
        strength={4}
        invert
        className="absolute bottom-[8vh] left-[2%] hidden lg:block"
      >
        <Constellation shape="ursa" width={118} delay={9} />
      </Parallax>
    </div>
  );
}

/** One galaxy, at one place, drawn whichever way its distance calls for. */
function GalaxyAt({
  b,
  className,
  parallax,
}: {
  b: Body;
  className: string;
  parallax?: { strength: number; invert: boolean };
}) {
  const inner =
    b.kind === "spiral" ? (
      <Galaxy
        seed={b.seed}
        size={b.size}
        tilt={b.tilt}
        flatten={b.flatten}
        duration={b.duration}
        reverse={b.reverse}
        ink={b.tinted ? INK[b.tinted] : undefined}
        core={b.tinted ? CORE[b.tinted] : undefined}
        style={{ opacity: b.opacity }}
      />
    ) : (
      <SoftGalaxy
        size={b.size}
        tilt={b.tilt}
        flatten={b.flatten}
        ink={b.ink}
        core={b.core}
        opacity={b.opacity}
      />
    );

  return (
    <div
      className={className}
      style={{
        left: `${b.x}%`,
        top: `${b.y}%`,
        transform: "translate(-50%, -50%)",
        /* Defocus sits out here rather than inside Galaxy, which already
           spends its own `filter` on the theme's brightness correction.

           Everything carries a blur now, graduated across five planes from
           the sharp foreground anchor down to the deep field. Focus is the
           cue the eye reads distance from, more than size is, and a field
           where everything is equally sharp stays flat however its sizes
           vary. The cost is bounded: these are small elements, static, and
           the drift lives on their parent, so each rasterises once and is
           then only translated.

           The extra term is the light theme's, where galaxies stop being
           luminous and become watercolour — every plane softened by the
           same amount, so the relative ordering of the five is untouched
           and the whole field simply sits further back. Zero in dark. */
        filter: `blur(calc(${b.blur}px + var(--galaxy-blur-extra, 0px)))`,
      }}
    >
      {parallax ? <Parallax {...parallax}>{inner}</Parallax> : inner}
    </div>
  );
}
