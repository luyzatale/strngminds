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

      <p className="pointer-events-none absolute bottom-7 left-1/2 z-10 w-full -translate-x-1/2 whitespace-nowrap text-center text-[0.55rem] uppercase tracking-[0.22em] text-ink-faint sm:bottom-8 sm:text-[0.6rem] sm:tracking-[0.3em]">
        Drag to turn
        <span className="sm:hidden"> · tap a planet</span>
        <span className="hidden sm:inline"> · hover a planet</span>
      </p>
    </section>
  );
}

/**
 * Galaxies are scattered from a fixed seed rather than placed by hand, so the
 * field reads as aleatory. Two rules keep it from fighting the centrepiece:
 * a galaxy's size grows with the square of its distance from the middle, and
 * so does its opacity — the ones that drift in among the orbits are small and
 * nearly transparent, the big ones stay out at the corners.
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
  seed: number;
};

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

    out.push({
      x: round(x * 100, 2),
      y: round(y * 100, 2),
      size: Math.round(58 + d * d * 320),
      tilt: Math.round(-60 + rnd() * 120),
      flatten: round(0.26 + rnd() * 0.28, 2),
      duration: Math.round(520 + rnd() * 520),
      reverse: rnd() > 0.5,
      strength: Math.round(4 + rnd() * 6),
      opacity: round(0.26 + d * 0.74, 2),
      seed: 7 + Math.floor(rnd() * 900),
    });
  }

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
                opacity: g.tinted ? Math.min(1, g.opacity + 0.25) : g.opacity,
              }}
            />
          </Parallax>
        </div>
      ))}

      <Parallax strength={6} className="absolute right-[2%] top-[26vh] hidden lg:block">
        <Constellation shape="cassiopeia" width={145} delay={2} />
      </Parallax>

      <Parallax
        strength={5}
        invert
        className="absolute bottom-[8vh] left-[2%] hidden lg:block"
      >
        <Constellation shape="ursa" width={160} delay={9} />
      </Parallax>
    </div>
  );
}
