import Scene from "@/components/Scene";
import {
  Constellation,
  Dust,
  FROST_CORE,
  FROST_INK,
  Galaxy,
  NEBULA_CORE,
  NEBULA_INK,
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

          4.5rem, not less: the corner controls reach 56px up from the bottom,
          and on anything narrower than about 430px this line is wide enough to
          run underneath them. Clearing them vertically is the only fix that
          holds at every width, since the line is centred and the controls are
          not. */}
      <p className="pointer-events-none absolute bottom-[4.5rem] left-1/2 z-10 w-full -translate-x-1/2 whitespace-nowrap text-center text-[0.62rem] uppercase tracking-[0.2em] text-ink-faint sm:bottom-16 sm:text-[0.68rem] sm:tracking-[0.26em]">
        Drag to turn
        <span className="sm:hidden"> · tap a planet</span>
        <span className="hidden sm:inline"> · hover a planet</span>
      </p>
    </section>
  );
}

/**
 * Galaxies are scattered from a fixed seed rather than placed by hand, so the
 * field reads as aleatory. Distance from the sun is the depth axis, and three
 * properties hang off it together — size, opacity and focus. What drifts in
 * among the orbits is small, faint and slightly soft; what sits in the corners
 * is larger and sharper, and still nowhere near bright enough to argue with
 * the centre.
 *
 * The sizes are three fixed values rather than a continuum. A smooth ramp
 * produces nine galaxies that all look like the same object at slightly
 * different distances; three separated scales produce a near, a middle and a
 * far population, which is what actually reads as depth.
 */
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

/** Everything needed to paint one galaxy in one place. */
type Placed = {
  /** percentages of the hero, so the arrangement holds at any screen height */
  x: number;
  y: number;
  size: number;
  tilt: number;
  flatten: number;
  duration: number;
  reverse: boolean;
  opacity: number;
  /** defocus in px — the far ones sit well behind the plane of focus */
  blur: number;
  tinted: Tint | null;
  seed: number;
};

/** The scattered ones carry three terms the composed ones have no use for. */
type Scattered = Placed & {
  strength: number;
  /** 0 at the sun, 1 in the corners; the depth axis everything hangs off */
  d: number;
  tier: "sm" | "lg";
};

/** Small, medium, large. */
const GALAXY_SCALE = [72, 124, 202];
/**
 * The far population is the least in focus, in the same order — but only just.
 * A heavier hand here (1.4px on a 72px disc built from sub-pixel dots) erases
 * the spiral entirely and leaves a grey smudge, which reads as a smear on the
 * glass rather than as a distant object. Depth is carried by size and opacity;
 * blur only confirms it.
 */
const GALAXY_BLUR = [0.9, 0.5, 0.2];

const GALAXIES: Scattered[] = (() => {
  const rnd = seeded(9137);
  const out = [] as Omit<Scattered, "tinted" | "tier">[];

  let guard = 0;
  while (out.length < 9 && guard++ < 900) {
    const x = rnd();
    const y = rnd();
    // 0 at the sun, 1 in the corners
    const d = Math.hypot(x - 0.5, y - 0.5) / Math.SQRT1_2;
    if (d < 0.24) continue; // never on top of the sun
    if (y < 0.17 || y > 0.9) continue; // clear of the bar and of the hint
    if (out.some((g) => Math.hypot(g.x / 100 - x, g.y / 100 - y) < 0.17)) continue;

    /**
     * Every `rnd()` below is drawn in the same order and the same number of
     * times as before, deliberately: the scatter, the teal galaxy's place to
     * the left of the system and the phone selection are all downstream of
     * this sequence, and a single extra draw would reshuffle a composition
     * that is already settled. Size and blur are assigned after the loop,
     * from depth, without consuming any randomness.
     */
    out.push({
      x: round(x * 100, 2),
      y: round(y * 100, 2),
      size: 0, // assigned below
      tilt: Math.round(-60 + rnd() * 120),
      flatten: round(0.26 + rnd() * 0.28, 2),
      // slow enough that catching it moving takes deliberate attention
      duration: Math.round(900 + rnd() * 800),
      reverse: rnd() > 0.5,
      strength: Math.round(3 + rnd() * 4),
      // the corners top out at 45%; the near-centre ones sit at a third of that
      opacity: round(0.12 + d * 0.33, 2),
      blur: 0, // assigned below
      d: round(d, 3),
      seed: 7 + Math.floor(rnd() * 900),
    });
  }

  /**
   * Three populations of three, split by rank rather than by a threshold on
   * `d`. A threshold is the obvious way to do it and it does not work: this
   * scatter's distances cluster in the middle, and cutting at 0.44/0.70 put
   * seven of the nine in one band — nine galaxies at one size, which is
   * exactly the flat field the three scales exist to break up. Ranking
   * guarantees the near, middle and far groups all actually exist, and since
   * the rank is on distance from the sun the large ones still land outside.
   */
  const byDepth = [...out].sort((a, b) => a.d - b.d);
  byDepth.forEach((g, i) => {
    const band = Math.min(2, Math.floor((i * 3) / byDepth.length));
    g.size = GALAXY_SCALE[band];
    g.blur = GALAXY_BLUR[band];
  });

  out.sort((a, b) => b.size - a.size);

  /**
   * Four are painted from photographs — two violet, one blue-and-amber, one
   * teal — and each has to sit fully in frame: the biggest are pushed into the corners
   * and bleed off the edge, where a colour barely registers. They are also
   * kept apart, so a pair does not read as one patch of colour.
   */
  const tint = new Map<number, Tint>();
  const taken: { x: number; y: number }[] = [];

  /**
   * The teal one is placed rather than picked: it belongs to the left of the
   * system, so it takes the leftmost galaxy sitting at roughly the height of
   * the sun.
   */
  const verdant = out
    .map((g, i) => ({ g, i }))
    .filter(
      ({ g }) =>
        g.x / 100 >= 0.06 &&
        g.x / 100 <= 0.3 &&
        g.y / 100 >= 0.3 &&
        g.y / 100 <= 0.72,
    )
    .sort((a, b) => a.g.x - b.g.x)[0];

  if (verdant) {
    tint.set(verdant.i, "verdant");
    taken.push({ x: verdant.g.x / 100, y: verdant.g.y / 100 });
  }

  for (let i = 0; i < out.length && tint.size < 4; i++) {
    if (tint.has(i)) continue;
    const g = out[i];
    const x = g.x / 100;
    const y = g.y / 100;
    if (x < 0.14 || x > 0.86 || y < 0.18 || y > 0.82) continue;
    // the scatter already keeps them 0.17 apart, so this only stops a pair
    // landing shoulder to shoulder
    if (taken.some((t) => Math.hypot(t.x - x, t.y - y) < 0.18)) continue;
    const nebulas = [...tint.values()].filter((t) => t === "nebula").length;
    tint.set(i, nebulas < 2 ? "nebula" : "frost");
    taken.push({ x, y });
  }

  /**
   * The painted four are the point of the field, so they come in as soon as
   * this set does; two plain ones join them to keep the colour from reading as
   * the whole story, and the remaining three wait for a large screen.
   */
  let plain = 0;
  return out.map((g, i) => {
    const tinted = tint.get(i) ?? null;
    if (!tinted) plain += 1;
    return {
      ...g,
      tinted,
      opacity: tinted ? Math.min(0.56, g.opacity + 0.14) : g.opacity,
      tier: tinted || plain <= 2 ? ("sm" as const) : ("lg" as const),
    };
  });
})();

/**
 * The phone is composed by hand rather than sampled from the set above, and
 * that is the whole point. Those nine positions were arranged for a landscape
 * frame; replayed as percentages into 390×844 they fall apart — the galaxy at
 * x=8% loses half its width off the left edge, two of the three visible ones
 * stack up on the right, and the top third of the screen empties out entirely.
 * No subset of a landscape composition is a portrait composition.
 *
 * So: five, descending the screen and alternating sides, each one clear of the
 * bar above and the hint and controls below. Weight is balanced across the
 * centre line rather than counted — three on the left against two on the
 * right, but the right pair carries the largest of the five. The teal one
 * keeps its standing instruction to sit at the left of the system; on a frame
 * this narrow that means overlapping the outer orbits, which is what depth
 * looks like when there is no room beside the object.
 */
const PHONE_GALAXIES: Placed[] = [
  /**
   * The first and last are held at 17% and 76% rather than pushed nearer the
   * edges. A percentage is a different number of pixels on a 640-tall screen
   * than on a 932-tall one, and at 14/82 the short end of that range slid the
   * top galaxy under the bar and the bottom one across the hint. These two
   * bounds clear both at every height in between.
   */
  // far, small, and barely there — it only has to stop the top from being bare
  { x: 24, y: 17, size: 78, tilt: -34, flatten: 0.36, duration: 1300, reverse: false, opacity: 0.26, blur: 0.9, tinted: null, seed: 311 },
  { x: 79, y: 25, size: 118, tilt: 22, flatten: 0.42, duration: 1050, reverse: true, opacity: 0.42, blur: 0.5, tinted: "nebula", seed: 428 },
  // left of the system, at the height of the sun
  { x: 15, y: 47, size: 118, tilt: -18, flatten: 0.38, duration: 1450, reverse: false, opacity: 0.44, blur: 0.5, tinted: "verdant", seed: 573 },
  // the nearest and largest, set against the two on the left below it
  { x: 74, y: 69, size: 170, tilt: 41, flatten: 0.34, duration: 1180, reverse: true, opacity: 0.4, blur: 0.2, tinted: "frost", seed: 664 },
  { x: 26, y: 76, size: 118, tilt: -52, flatten: 0.3, duration: 1600, reverse: false, opacity: 0.34, blur: 0.5, tinted: null, seed: 742 },
];

function HeroDecor() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <Dust seed={91} count={14} />

      {/* The two arrangements swap over wholesale at `sm`; neither is a subset
          of the other. Below that the phone gets no pointer parallax either —
          PointerField switches itself off for a coarse pointer, so it would be
          five springs animating nothing. */}
      {PHONE_GALAXIES.map((g) => (
        <GalaxyAt key={g.seed} g={g} className="absolute sm:hidden" />
      ))}

      {GALAXIES.map((g, i) => (
        <GalaxyAt
          key={g.seed}
          g={g}
          className={
            g.tier === "sm"
              ? "absolute hidden sm:block"
              : "absolute hidden lg:block"
          }
          parallax={{ strength: g.strength, invert: i % 2 === 1 }}
        />
      ))}

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

/** One galaxy, at one place, however it got there. */
function GalaxyAt({
  g,
  className,
  parallax,
}: {
  g: Placed;
  className: string;
  parallax?: { strength: number; invert: boolean };
}) {
  const body = (
    <Galaxy
      seed={g.seed}
      size={g.size}
      tilt={g.tilt}
      flatten={g.flatten}
      duration={g.duration}
      reverse={g.reverse}
      ink={g.tinted ? INK[g.tinted] : undefined}
      core={g.tinted ? CORE[g.tinted] : undefined}
      style={{ opacity: g.opacity }}
    />
  );

  return (
    <div
      className={className}
      style={{
        left: `${g.x}%`,
        top: `${g.y}%`,
        transform: "translate(-50%, -50%)",
        /* Defocus sits out here rather than inside Galaxy, which already
           spends its own `filter` on the theme's brightness correction. The
           painted ones keep most of their edge — they are the deliberate notes
           of colour in the field, and blurring them to the same degree as the
           rest would grey them out. */
        filter: `blur(${g.tinted ? round(g.blur * 0.4, 2) : g.blur}px)`,
      }}
    >
      {parallax ? <Parallax {...parallax}>{body}</Parallax> : body}
    </div>
  );
}
