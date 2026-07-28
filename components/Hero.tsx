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
          glance rather than on inspection — and it no longer sits level with
          the music controls in the corner. */}
      <p className="pointer-events-none absolute bottom-12 left-1/2 z-10 w-full -translate-x-1/2 whitespace-nowrap text-center text-[0.62rem] uppercase tracking-[0.2em] text-ink-faint sm:bottom-16 sm:text-[0.68rem] sm:tracking-[0.26em]">
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
type Galaxy = {
  x: number;
  y: number;
  size: number;
  tilt: number;
  flatten: number;
  duration: number;
  reverse: boolean;
  strength: number;
  opacity: number;
  /** defocus in px — the far ones sit well behind the plane of focus */
  blur: number;
  /** 0 at the sun, 1 in the corners; the depth axis everything hangs off */
  d: number;
  seed: number;
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

const GALAXIES = (() => {
  const rnd = seeded(9137);
  const out = [] as Galaxy[];

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
   * Three of them carry the phone, and they are chosen one per vertical band
   * rather than by size alone — taking simply the largest three lands them all
   * in whichever half of the frame the seed happened to favour, and the field
   * reads bottom-heavy.
   */
  const bands: [number, number][] = [
    [0.19, 0.42],
    [0.42, 0.65],
    [0.65, 0.86],
  ];
  const onPhone = new Set<number>();
  for (const [lo, hi] of bands) {
    const i = out.findIndex(
      (g, idx) => !onPhone.has(idx) && g.y / 100 >= lo && g.y / 100 < hi,
    );
    if (i !== -1) onPhone.add(i);
  }

  /**
   * Four are painted from photographs — two violet, one blue-and-amber, one
   * teal — and each has to sit fully in frame: the biggest are pushed into the corners
   * and bleed off the edge, where a colour barely registers. They are also
   * kept apart, so a pair does not read as one patch of colour.
   */
  const tint = new Map<number, "nebula" | "frost" | "verdant">();
  const taken: { x: number; y: number }[] = [];

  /**
   * The teal one is placed rather than picked: it belongs to the left of the
   * system, so it takes the leftmost galaxy sitting at roughly the height of
   * the sun. It is forced into the phone set too, so it does not vanish on a
   * small screen along with the other large ones.
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
    onPhone.add(verdant.i);
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

  let extra = 0;
  return out.map((g, i) => {
    const tinted = tint.get(i) ?? null;
    if (onPhone.has(i)) return { ...g, tinted, tier: "phone" as const };
    extra += 1;
    return { ...g, tinted, tier: extra <= 3 ? ("sm" as const) : ("lg" as const) };
  });
})();

function HeroDecor() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <Dust seed={91} count={14} />

      {GALAXIES.map((g, i) => (
        <div
          key={g.seed}
          className={
            g.tier === "phone"
              ? "absolute"
              : g.tier === "sm"
                ? "absolute hidden sm:block"
                : "absolute hidden lg:block"
          }
          style={{
            left: `${g.x}%`,
            top: `${g.y}%`,
            transform: "translate(-50%, -50%)",
            /* Defocus sits out here rather than inside Galaxy, which already
               spends its own `filter` on the theme's brightness correction.
               The four painted ones keep most of their edge — they are the
               deliberate notes of colour in the field, and blurring them to
               the same degree as the rest would grey them out. */
            filter: `blur(${g.tinted ? round(g.blur * 0.4, 2) : g.blur}px)`,
          }}
        >
          <Parallax strength={g.strength} invert={i % 2 === 1}>
            <Galaxy
              seed={g.seed}
              size={g.size}
              tilt={g.tilt}
              flatten={g.flatten}
              duration={g.duration}
              reverse={g.reverse}
              ink={
                g.tinted === "nebula"
                  ? NEBULA_INK
                  : g.tinted === "frost"
                    ? FROST_INK
                    : g.tinted === "verdant"
                      ? VERDANT_INK
                      : undefined
              }
              core={
                g.tinted === "nebula"
                  ? NEBULA_CORE
                  : g.tinted === "frost"
                    ? FROST_CORE
                    : g.tinted === "verdant"
                      ? VERDANT_CORE
                      : undefined
              }
              style={{
                opacity: g.tinted
                  ? Math.min(0.56, g.opacity + 0.14)
                  : g.opacity,
              }}
            />
          </Parallax>
        </div>
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
