import Scene from "@/components/Scene";
import {
  ARGENT_CORE,
  ARGENT_INK,
  BLOOM_CORE,
  BLOOM_INK,
  Constellation,
  Dust,
  EMBER_CORE,
  EMBER_INK,
  FORGE_CORE,
  FORGE_INK,
  JADE_CORE,
  JADE_INK,
  PINWHEEL_CORE,
  PINWHEEL_INK,
  PLUME_CORE,
  PLUME_INK,
  SEPIA_CORE,
  SEPIA_INK,
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
  type GalaxyShape,
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
          mounted directly rather than inside a wrapper.

          The caption is handed to Scene rather than positioned here, so it
          sits in the flow directly beneath the system. Anchored to the
          section's bottom edge — which is what it was — it drifted away from
          the system on a tall window and crowded it on a short one, because
          the system is centred and sized from the viewport while the caption
          was measured from the floor. Its colour stays put: `ink-faint` is
          already on the 4.5:1 floor against the ivory, so the quiet comes
          from size, spacing and position instead. */}
      <Scene
        caption={
          <p className="pointer-events-none mt-7 w-full whitespace-nowrap text-center text-[0.54rem] uppercase tracking-[0.26em] text-ink-faint sm:mt-8 sm:text-[0.6rem] sm:tracking-[0.32em]">
            Drag to turn
            <span className="sm:hidden"> · tap a planet</span>
            <span className="hidden sm:inline"> · hover a planet</span>
          </p>
        }
      />
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

type Tint =
  | "nebula"
  | "frost"
  | "verdant"
  | "ember"
  | "argent"
  | "bloom"
  | "plume"
  | "forge"
  | "pinwheel"
  | "sepia"
  | "jade";

const INK: Record<Tint, string[]> = {
  nebula: NEBULA_INK,
  frost: FROST_INK,
  verdant: VERDANT_INK,
  ember: EMBER_INK,
  argent: ARGENT_INK,
  bloom: BLOOM_INK,
  plume: PLUME_INK,
  forge: FORGE_INK,
  pinwheel: PINWHEEL_INK,
  sepia: SEPIA_INK,
  jade: JADE_INK,
};

const CORE: Record<Tint, string[]> = {
  nebula: NEBULA_CORE,
  frost: FROST_CORE,
  verdant: VERDANT_CORE,
  ember: EMBER_CORE,
  argent: ARGENT_CORE,
  bloom: BLOOM_CORE,
  plume: PLUME_CORE,
  forge: FORGE_CORE,
  pinwheel: PINWHEEL_CORE,
  sepia: SEPIA_CORE,
  jade: JADE_CORE,
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
  shape: GalaxyShape;
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

/** A placed object: normalised position, and its radius in nominal pixels. */
type Spot = { x: number; y: number; r: number };

/**
 * The frame the spacing arithmetic is done against.
 *
 * Positions are percentages, so they have no intrinsic size and no aspect —
 * but a rule about whether two discs collide is meaningless without both.
 * Every separation below is therefore computed as if the page were this,
 * which is exact at one shape of window and a good approximation at the rest.
 */
const NOMINAL = { w: 1440, h: 900 };

const apart = (a: Spot, b: Spot) =>
  Math.hypot((a.x - b.x) * NOMINAL.w, (a.y - b.y) * NOMINAL.h);

/**
 * Scatter one position per entry in `sizes`, under the field's rules.
 *
 * `edge` is the one that does the compositional work: a candidate survives
 * with probability `depth ^ edge`, so above 1 the population is pushed out
 * toward the frame and below 1 it is allowed to come inward. That is how the
 * field frames the system instead of ringing it — the big things stay out at
 * the border and only the faintest are permitted near the middle.
 *
 * Separation is size-aware, and it has to be. It used to be one normalised
 * number per layer, which knows neither how large the two objects are nor
 * that 0.2 of this frame is 288px across and 180px down. That held while
 * every mid-field galaxy was about 150px and broke as soon as they ran 90 to
 * 196 against heroes of 268 — one candidate cleared the rule by 0.011 and
 * still landed with its disc lying across the teal anchor's. Raising the
 * number instead was worse: at 0.27 the sampler could not place eight objects
 * at all and silently returned four, which is a defect that looks like a
 * design decision. Comparing radii costs nothing and cannot drift.
 */
function scatter(
  rnd: () => number,
  sizes: number[],
  o: { clear: number; edge: number; floor: number; taken: Spot[] },
): Spot[] {
  const out: Spot[] = [];
  let guard = 0;

  while (out.length < sizes.length && guard++ < sizes.length * 900) {
    const x = rnd();
    const y = rnd();
    const d = depth(x, y);

    if (d < o.clear) continue; // never over the system
    if (y < 0.07 || y > 0.95) continue; // clear of the bar and of the hint
    if (rnd() > Math.pow(d, o.edge)) continue;
    if (VOIDS.some((v) => Math.hypot(v.x - x, v.y - y) < v.r)) continue;

    /**
     * Two discs clear each other when their centres are further apart than
     * their radii together. The 0.9 is because a galaxy does not quite fill
     * its box — the arms fade before the edge — and `floor` keeps the small
     * layers from collapsing into clumps, since radii alone would let a pair
     * of 20px specks sit almost on top of each other.
     *
     * It was 0.84 until a near-face-on pair came within 5px of touching. The
     * nominal box is not the rendered one: rotation and flattening change it,
     * so the margin has to absorb the difference.
     */
    const spot = { x, y, r: sizes[out.length] / 2 };
    if (
      o.taken.some((t) => apart(spot, t) < Math.max((spot.r + t.r) * 0.9, o.floor))
    )
      continue;

    out.push(spot);
    o.taken.push(spot);
  }

  return out;
}

/**
 * Layer 5 — the anchors. Three, placed by hand, because three objects that
 * carry a composition are not a job for a random number generator.
 *
 * Two of them sit on a diagonal, upper-right against mid-left, which balances
 * without symmetry; the third sits low on the right to stop that diagonal
 * reading as a rule. They also carry three of the four painted palettes, the
 * teal one keeping its standing place at the left of the system.
 *
 * The sizes are 268, 176 and 128, and the irregularity is the point. They were
 * 193, 178 and 158 — steps of 0.92 and 0.89, which is a ramp rather than a
 * spread, and at that spacing three objects simply read as one size repeated.
 * Nothing in a real field is evenly graded, because apparent size comes from
 * distance and distance is not distributed politely. The steps here are 0.66
 * and 0.73, and the largest is over twice the smallest.
 *
 * Focus and weight follow size rather than being set separately, which is what
 * makes the variation read as distance instead of as three different-sized
 * stickers on one sheet of glass: the near one is fully sharp and the brightest,
 * and each step back is softer and dimmer. Positions are unchanged.
 */
const HEROES: Spiral[] = [
  { kind: "spiral", shape: "barred", x: 10, y: 50, size: 268, tilt: 16, flatten: 0.34, opacity: 0.6, blur: 0, duration: 25200, reverse: true, tinted: "verdant", seed: 4207 },
  { kind: "spiral", shape: "multi", x: 83, y: 23, size: 176, tilt: -28, flatten: 0.4, opacity: 0.5, blur: 0.4, duration: 21600, reverse: false, tinted: "nebula", seed: 4101 },
  // edge-on, so it keeps its own flatness rather than being squashed again
  { kind: "spiral", shape: "edge", x: 86, y: 73, size: 128, tilt: -52, flatten: 0.92, opacity: 0.43, blur: 0.75, duration: 28800, reverse: false, tinted: "frost", seed: 4313 },
];

/**
 * Written out rather than drawn from a range, for the reason the anchors
 * were: `122 + rnd() * 56` is a band whose ends are only 1.5 apart, and eight
 * objects inside it end up looking like eight of the same thing. These run 90
 * to 196 — better than two to one — with deliberately uneven steps.
 */
const MEDIUM_SIZE = [196, 90, 146, 116, 168, 100, 132, 178, 152];

/**
 * The right margin, placed by hand rather than scattered.
 *
 * Three objects down one edge is a decision about composition, and the
 * sampler has no way to make it — left to it, the first landed low on the
 * left where it read as an afterthought. These sit between the two anchors
 * already on that side, the violet at 23% and the edge-on at 73%.
 *
 * They were three grand designs in one palette, stepped only in size, and
 * that was not enough: size alone does not separate three objects when their
 * shape and colour are identical, so they read as one thing printed three
 * times. Each now differs in all three — a face-on spiral, a flat lens and a
 * ringed disc — and the temperature alternates down the margin so no two
 * neighbours are warm together.
 *
 * Two of those forms already appear elsewhere in the field, so they appear
 * here in colour nothing else carries: sepia for the lens, jade for the
 * rings. Repeating a morphology is fine on its own; repeating a morphology
 * together with its palette is what makes two objects read as one asset
 * placed twice.
 */
const RIGHT_MARGIN: Spiral[] = [
  { kind: "spiral", shape: "multi", x: 95, y: 38, size: 156, tilt: -14, flatten: 0.95, opacity: 0.57, blur: 0.35, duration: 34200, reverse: false, tinted: "pinwheel", seed: 6401 },
  { kind: "spiral", shape: "lenticular", x: 81, y: 52, size: 124, tilt: 26, flatten: 0.94, opacity: 0.5, blur: 0.7, duration: 39600, reverse: true, tinted: "sepia", seed: 6473 },
  { kind: "spiral", shape: "ringed", x: 93, y: 84, size: 140, tilt: -38, flatten: 0.62, opacity: 0.53, blur: 0.5, duration: 36000, reverse: false, tinted: "jade", seed: 6547 },
];

const { MEDIUM, SMALL, TINY } = (() => {
  const rnd = seeded(4703);

  /**
   * The anchors go in first and carry their real radii, so nothing is placed
   * across them. Sizes are now decided before positions for every layer,
   * because the spacing rule needs them.
   */
  const taken: Spot[] = [...HEROES, ...RIGHT_MARGIN].map((h) => ({
    x: h.x / 100,
    y: h.y / 100,
    r: h.size / 2,
  }));

  /**
   * The two soft layers are the blurred ones — gradient discs with no
   * structure, and the only things in the field whose whole job is to be
   * out of focus. At 12 and 30 they outnumbered everything drawn dot by dot
   * three to one, and a field where most objects are smudges reads as a
   * blurred field rather than a deep one.
   *
   * Thinned to 7 and 16, which is a little under half. Not removed: without
   * them the far distance has nothing in it at all, and the spirals lose the
   * thing that makes them read as near.
   */
  const smallSize = Array.from({ length: 7 }, () => Math.round(58 + rnd() * 50));
  const tinySize = Array.from({ length: 16 }, () => Math.round(18 + rnd() * 30));

  const mediumAt = scatter(rnd, MEDIUM_SIZE, {
    clear: 0.44,
    edge: 1.2,
    floor: 150,
    taken,
  });
  const smallAt = scatter(rnd, smallSize, {
    clear: 0.33,
    edge: 0.85,
    floor: 96,
    taken,
  });
  const tinyAt = scatter(rnd, tinySize, {
    clear: 0.25,
    edge: 0.5,
    floor: 52,
    taken,
  });

  /**
   * Layer 4 — the frame. Large enough to still be spirals, dim enough that
   * they register as structure rather than as objects.
   *
   * The morphologies are dealt out from a fixed list rather than drawn at
   * random, so every form the scene knows how to make is guaranteed to appear
   * exactly once across the seven — a random draw would leave one or two
   * missing and double up on another, which is how a field of six shapes ends
   * up looking like a field of four.
   *
   * Two of them carry the new palettes, both at this layer's low opacity. The
   * loud ones stay the three anchors; these are colour as variety, not as
   * another anchor.
   */
  const FORMS: GalaxyShape[] = [
    "spiral",
    "edge",
    "ringed",
    "irregular",
    "barred",
    "multi",
    "lenticular",
    "peculiar",
    // the barred one painted from its photograph; the grand designs that
    // went with it are placed by hand instead, up in RIGHT_MARGIN
    "barred",
  ];
  const MEDIUM_TINT: (Tint | null)[] = [
    "nebula",
    "argent",
    null,
    "bloom",
    "ember",
    null,
    null,
    "plume",
    "forge",
  ];

  /**
   * The two photographic ones are carried brighter than the layer they sit
   * in, because their colour is the point of them and this layer's 0.31–0.44
   * greys it out. They are held to the mid-field in every other respect —
   * size, position, focus — so what stands out about them is what they are
   * made of rather than how much room they take.
   *
   * They are also nearly face-on, which matters more than the brightness did.
   * This layer's flatten runs 0.24–0.52, and at that squash a spiral has no
   * spiral left in it: the first pass turned both photographs into featureless
   * lozenges. Their originals are seen from almost straight on, so they get
   * an inclination to match.
   */
  const MEDIUM_LIFT: Record<number, number> = { 8: 0.6 };
  const MEDIUM_FLAT: Record<number, number> = { 8: 0.82 };

  const MEDIUM: Spiral[] = mediumAt.map((s, i) => {
    const size = MEDIUM_SIZE[i];
    const shape = FORMS[i];
    const f = rnd();
    const o = rnd();
    return {
      kind: "spiral" as const,
      shape,
      x: round(s.x * 100, 2),
      y: round(s.y * 100, 2),
      size,
      tilt: Math.round(-70 + rnd() * 140),
      /* The two edge-on forms build their own flatness into the dots, so the
         wrapper must leave them alone — squashed again they become hairlines.
         The peculiar one likewise: its plumes are a shape, not a disc, and
         flattening turns them into a smear. */
      flatten:
        MEDIUM_FLAT[i] ??
        (shape === "edge" || shape === "lenticular" || shape === "peculiar"
          ? round(0.9 + f * 0.1, 2)
          : round(0.24 + f * 0.28, 2)),
      // drawn either way, so skipping it for the lifted two cannot shift the
      // sequence for everything after them
      opacity: MEDIUM_LIFT[i] ?? round(0.31 + o * 0.13, 2),
      // focus follows size here too: the largest are sharp, the smallest soft
      blur: round(1.55 - ((size - 90) / 106) * 1.25, 2),
      // an order of magnitude slower than the heroes, which are already slow
      duration: Math.round(32400 + rnd() * 12600),
      reverse: rnd() > 0.5,
      tinted: MEDIUM_TINT[i],
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
    const size = smallSize[i];
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
      phone: i < 4,
      seed: 6000 + i * 41,
    };
  });

  /**
   * Layer 3, far half — the ones that are only ever seen by accident. At this
   * size and this opacity none of them is legible on its own; what they do is
   * make the count of things out there feel unbounded, which is the whole job.
   */
  const TINY: Soft[] = tinyAt.map((s, i) => {
    const size = tinySize[i];
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
      phone: i < 10,
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
  // furthest of the three: smallest, softest, faintest
  { kind: "spiral", shape: "spiral", x: 79, y: 25, size: 98, tilt: 22, flatten: 0.42, opacity: 0.34, blur: 0.8, duration: 25200, reverse: true, tinted: "nebula", seed: 8207 },
  // the nearest, and left of the system at the height of the sun
  { kind: "spiral", shape: "barred", x: 15, y: 47, size: 176, tilt: -18, flatten: 0.38, opacity: 0.47, blur: 0, duration: 28800, reverse: false, tinted: "verdant", seed: 8313 },
  // between the two, low on the right, and seen edge-on
  { kind: "spiral", shape: "edge", x: 74, y: 69, size: 124, tilt: 41, flatten: 0.9, opacity: 0.4, blur: 0.45, duration: 21600, reverse: true, tinted: "frost", seed: 8419 },
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
        {/* Placed by hand, but they belong to this distance, so they drift
            with it rather than with the anchors. */}
        {RIGHT_MARGIN.map((b) => (
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
        shape={b.shape}
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

           The extra term belongs to the dawn theme, where galaxies stop
           being luminous and become watercolour. Every plane is softened by
           the same amount, so the ordering of the five is untouched and the
           whole field simply sits further back. Zero at night. */
        filter: `blur(calc(${b.blur}px * var(--galaxy-blur-scale, 1) + var(--galaxy-blur-extra, 0px)))`,
        /* and the whole field is a little more transparent by day, which is
           what "almost disappear into the background" costs — the faintest
           ones drop below the paper's own tonal variation and are gone */
        opacity: "var(--galaxy-alpha, 1)",
      }}
    >
      {parallax ? <Parallax {...parallax}>{inner}</Parallax> : inner}
    </div>
  );
}
