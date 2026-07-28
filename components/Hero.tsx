import Scene from "@/components/Scene";
import { Constellation, Dust, Galaxy } from "@/components/Celestial";
import { FadeIn, Parallax } from "@/components/Motion";
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
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6 pb-16 pt-[var(--nav-h)] sm:px-10"
    >
      <h1 className="sr-only">
        Strng Minds — a contemplative practice where philosophy, astronomy,
        psychology and symbolism meet
      </h1>

      <HeroDecor />

      <FadeIn delay={0.2} y={18} className="relative z-10 w-full">
        <Scene />
      </FadeIn>

      <p className="pointer-events-none absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-[0.6rem] uppercase tracking-[0.3em] text-ink-faint">
        Drag to turn · hover a planet
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
const GALAXIES = (() => {
  const rnd = seeded(9137);
  const out: {
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
  }[] = [];

  let guard = 0;
  while (out.length < 9 && guard++ < 900) {
    const x = rnd();
    const y = rnd();
    // 0 at the sun, 1 in the corners
    const d = Math.hypot(x - 0.5, y - 0.5) / Math.SQRT1_2;
    if (d < 0.24) continue; // never on top of the sun
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

  // biggest first, so the breakpoint rules below drop the faintest ones on small screens
  return out.sort((a, b) => b.size - a.size);
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
            i < 2 ? "absolute" : i < 5 ? "absolute hidden sm:block" : "absolute hidden lg:block"
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
              style={{ opacity: g.opacity }}
            />
          </Parallax>
        </div>
      ))}

      <Parallax strength={6} className="absolute right-[2%] top-[26vh] hidden lg:block">
        <Constellation shape="cassiopeia" width={215} delay={2} />
      </Parallax>

      <Parallax
        strength={5}
        invert
        className="absolute bottom-[8vh] left-[2%] hidden lg:block"
      >
        <Constellation shape="ursa" width={240} delay={9} />
      </Parallax>
    </div>
  );
}
