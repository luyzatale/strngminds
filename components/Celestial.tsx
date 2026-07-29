import type { CSSProperties } from "react";
import { round, seeded } from "@/lib/rand";

/* ────────────────────────────────────────────────────────────
   Spiral galaxy — a logarithmic spiral of a few hundred dots.
   Generated once at build time from a fixed seed.
   ──────────────────────────────────────────────────────────── */

type Dot = { x: number; y: number; r: number; o: number; c: string };

const GALAXY_INK = ["#b7b3d6", "#c8c3e0", "#d8c29a", "#cfd2e4", "#e2dcc6"];

/**
 * One galaxy is painted from a photograph instead: violet arms with pink
 * star-forming knots, a warm gold core, and a blue-white haze at the rim.
 */
export const NEBULA_INK = [
  "#a687e2",
  "#bf8fe0",
  "#e579bd",
  "#8f7ed2",
  "#e0cb9a",
  "#cdd8f2",
];

export const NEBULA_CORE = ["#fff6e0", "#f0d9a4", "#a186dd"];

/**
 * And one from the second photograph: icy blue-white arms threaded with rust
 * dust lanes, around a core that burns amber.
 */
export const FROST_INK = [
  "#cfe3f6",
  "#a7cae9",
  "#8fb6dc",
  "#d9a367",
  "#bd7c42",
  "#f3e2c0",
];

export const FROST_CORE = ["#fffaf0", "#f7d693", "#d98f3f"];

/**
 * And a third: teal arms lit with cyan knots, around a core of pale cream.
 */
export const VERDANT_INK = [
  "#6fbfa8",
  "#8fd6bd",
  "#bfeae0",
  "#3f9184",
  "#e9dcb4",
  "#a7dcd0",
];

export const VERDANT_CORE = ["#fdf6dd", "#e9dcae", "#5fae9a"];

/**
 * How many dots a disc of this size is worth.
 *
 * Every dot is its own `<circle>`, so density is paid for in DOM nodes — and
 * once the galaxies came down to 72–202px, a flat 460 was drawing several
 * hundred elements per galaxy describing structure finer than a pixel. The
 * spiral is parameterised by `i / count`, so a sparser field is the same
 * spiral with fewer points on it, not a different shape.
 */
const dotsFor = (size: number) =>
  Math.max(150, Math.min(420, Math.round(size * 1.7)));

function galaxyDots(seed: number, count = 460, ink = GALAXY_INK): Dot[] {
  const rnd = seeded(seed);
  const dots: Dot[] = [];
  const arms = 2;

  for (let i = 0; i < count; i++) {
    const arm = i % arms;
    const t = (i / count) * 5.2 + 0.35;
    const theta = t * 2.1 + (arm * Math.PI * 2) / arms;
    const radius = 2.2 * Math.exp(0.34 * (t * 2.1));
    const spread = 1.4 + radius * 0.16;
    const jx = (rnd() - 0.5) * spread * 2;
    const jy = (rnd() - 0.5) * spread * 2;

    dots.push({
      x: round(50 + Math.cos(theta) * radius + jx, 2),
      y: round(50 + Math.sin(theta) * radius + jy, 2),
      r: round(0.22 + rnd() * 0.55, 2),
      o: round(0.12 + rnd() * 0.5 * (1 - radius / 46), 2),
      c: ink[Math.floor(rnd() * ink.length)],
    });
  }

  // A faint halo of field stars around the disc, scaled with it.
  for (let i = 0; i < Math.round(count * 0.2); i++) {
    const a = rnd() * Math.PI * 2;
    const rad = 12 + rnd() * 34;
    dots.push({
      x: round(50 + Math.cos(a) * rad, 2),
      y: round(50 + Math.sin(a) * rad, 2),
      r: round(0.14 + rnd() * 0.24, 2),
      o: round(0.06 + rnd() * 0.16, 2),
      c: ink[Math.floor(rnd() * ink.length)],
    });
  }

  return dots;
}

export function Galaxy({
  seed = 7,
  size = 300,
  tilt = -24,
  flatten = 0.44,
  duration = 420,
  reverse = false,
  /** dot colours; NEBULA_INK for the violet one */
  ink = GALAXY_INK,
  /** the three inner stops of the core glow */
  core = ["#fff8e6", "#f3e6c8", "#ded9ef"],
  className,
  style,
}: {
  seed?: number;
  size?: number;
  tilt?: number;
  flatten?: number;
  duration?: number;
  reverse?: boolean;
  ink?: string[];
  core?: string[];
  className?: string;
  style?: CSSProperties;
}) {
  const dots = galaxyDots(seed, dotsFor(size), ink);
  const id = `gx-${seed}`;

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        filter:
          "brightness(var(--galaxy-bright, 1)) saturate(var(--galaxy-sat, 1)) contrast(var(--galaxy-contrast, 1)) sepia(var(--galaxy-sepia, 0))",
        ...style,
      }}
      aria-hidden="true"
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `rotate(${tilt}deg) scaleY(${flatten})`,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            animationName: "sm-spin-slow",
            animationDuration: `${duration}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            animationDirection: reverse ? "reverse" : "normal",
          }}
        >
          <svg viewBox="0 0 100 100" width="100%" height="100%" role="presentation">
            <defs>
              <radialGradient id={`${id}-core`}>
                <stop offset="0%" stopColor={core[0]} stopOpacity="0.95" />
                <stop offset="26%" stopColor={core[1]} stopOpacity="0.55" />
                <stop offset="58%" stopColor={core[2]} stopOpacity="0.24" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="34" fill={`url(#${id}-core)`} />
            {dots.map((d, i) => (
              <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={d.c} opacity={d.o} />
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Distant galaxies — the ones too small to draw dot by dot.
   ──────────────────────────────────────────────────────────── */

/** Single colours, drawn from the same palette the dot fields use. */
export const SOFT_INK = [
  "#b7b3d6",
  "#cfd2e4",
  "#d8c29a",
  "#c8c3e0",
  "#e2dcc6",
  "#bdb9d2",
];

export const SOFT_CORE = ["#efeaf6", "#fff8e8", "#e8eaf4", "#f4eee2"];

/**
 * A galaxy at 20–120px, rendered as two stacked gradients instead of several
 * hundred `<circle>` elements.
 *
 * This is the whole reason the field can hold fifty objects rather than a
 * dozen. Below roughly 120px a spiral is not legible — the arms fall under a
 * pixel and every dot the SVG version draws is describing structure nobody can
 * resolve. A flattened disc with a brighter core is indistinguishable at that
 * size and costs two nodes.
 *
 * There is deliberately no `blur()` here either. The brief for these is "heavy
 * blur, barely visible", but a filter would force a rendering context for each
 * one, and forty of those is a real cost on a phone. Gentle gradient stops are
 * already soft — the blur is baked into the paint rather than applied over it.
 */
export function SoftGalaxy({
  size,
  tilt = -20,
  flatten = 0.4,
  ink = SOFT_INK[0],
  core = SOFT_CORE[0],
  opacity = 0.2,
  className,
  style,
}: {
  size: number;
  tilt?: number;
  flatten?: number;
  ink?: string;
  core?: string;
  opacity?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        opacity,
        filter:
          "brightness(var(--galaxy-bright, 1)) saturate(var(--galaxy-sat, 1)) contrast(var(--galaxy-contrast, 1)) sepia(var(--galaxy-sepia, 0))",
        ...style,
      }}
      aria-hidden="true"
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          transform: `rotate(${tilt}deg) scaleY(${flatten})`,
          /**
           * Both stops are deliberately weak and the falloff deliberately
           * long. A first pass used a bright core with a short falloff, and
           * at these sizes that does not read as a distant galaxy at all — it
           * reads as lens flare, a hard bright lozenge scratched across the
           * frame. What a far galaxy actually looks like is a smudge you are
           * not sure you saw. No stop here goes above 40% alpha, and the
           * outer one runs all the way to 86% of the radius before it
           * vanishes, so there is no edge anywhere to catch the eye.
           */
          background: [
            `radial-gradient(closest-side circle at 50% 50%, ${core}52 0%, ${core}1f 30%, ${core}00 54%)`,
            `radial-gradient(closest-side circle at 50% 50%, ${ink}45 0%, ${ink}24 34%, ${ink}0f 60%, ${ink}00 86%)`,
          ].join(","),
        }}
      />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Nebulae — atmosphere rather than objects.
   ──────────────────────────────────────────────────────────── */

type Cloud = { x: number; y: number; w: number; h: number; c: string; o: number; tilt: number };

/**
 * Four clouds, and the whole intent is that you cannot quite tell they are
 * there. They are not blurred either — at 5–9% alpha over 600–900px, the
 * gradient's own falloff is far softer than any filter would make it, and
 * layers this large are exactly where a `blur()` gets expensive.
 *
 * Colours are the existing tokens and nothing else: paper white, the warm
 * ivory, and the earth blue pulled right down.
 */
const CLOUDS: Cloud[] = [
  { x: 74, y: 18, w: 940, h: 580, c: "--neb-1", o: 0.05, tilt: -18 },
  { x: 16, y: 62, w: 860, h: 700, c: "--neb-2", o: 0.034, tilt: 24 },
  { x: 58, y: 88, w: 980, h: 520, c: "--neb-3", o: 0.03, tilt: -8 },
  { x: 30, y: 12, w: 700, h: 540, c: "--neb-4", o: 0.038, tilt: 32 },
];

export function Nebulae({ phone = false }: { phone?: boolean }) {
  const clouds = phone ? CLOUDS.slice(0, 2) : CLOUDS;

  return (
    <div
      className="pointer-events-none absolute inset-0"
      /* `scale` rather than a transform: each cloud's own transform is
         already owned by its drift keyframe, and this is a separate
         property that composes with it instead of fighting it. */
      style={{
        display: "var(--nebula-show, block)",
        scale: "var(--neb-scale, 1)",
      }}
      aria-hidden="true"
    >
      {clouds.map((c, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${c.x}%`,
            top: `${c.y}%`,
            width: c.w,
            height: c.h,
            marginLeft: -c.w / 2,
            marginTop: -c.h / 2,
            background: `radial-gradient(closest-side ellipse at 50% 50%, color-mix(in srgb, var(${c.c}) calc(${c.o * 100}% * var(--neb-a, 1)), transparent) 0%, color-mix(in srgb, var(${c.c}) calc(${round(c.o * 45, 3)}% * var(--neb-a, 1)), transparent) 38%, transparent 76%)`,
            // the tilt lives on an inner property-free element's own transform,
            // and the drift keyframe below owns the wrapper's
            rotate: `${c.tilt}deg`,
            animationName: "sm-nebula-drift",
            animationDuration: `calc(${420 + i * 90}s * var(--motion-scale, 1))`,
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
            animationDirection: "alternate",
          }}
        />
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Constellations — four-point sparkles joined by hairlines.
   ──────────────────────────────────────────────────────────── */

const SHAPES: Record<string, { pts: [number, number][]; edges: [number, number][] }> = {
  // A W, in the manner of Cassiopeia
  cassiopeia: {
    pts: [
      [6, 26],
      [26, 8],
      [48, 34],
      [70, 12],
      [92, 40],
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
    ],
  },
  // A dipper, in the manner of Ursa Major
  ursa: {
    pts: [
      [4, 44],
      [22, 30],
      [40, 40],
      [56, 26],
      [70, 44],
      [88, 40],
      [76, 62],
      [56, 64],
      [40, 40],
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
      [6, 7],
      [7, 8],
    ],
  },
};

function sparklePath(x: number, y: number, s: number) {
  return `M ${x} ${y - s} Q ${x + s * 0.24} ${y - s * 0.24} ${x + s} ${y} Q ${
    x + s * 0.24
  } ${y + s * 0.24} ${x} ${y + s} Q ${x - s * 0.24} ${y + s * 0.24} ${x - s} ${y} Q ${
    x - s * 0.24
  } ${y - s * 0.24} ${x} ${y - s} Z`;
}

export function Constellation({
  shape,
  width = 240,
  delay = 0,
  className,
  style,
}: {
  shape: keyof typeof SHAPES;
  width?: number;
  delay?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const { pts, edges } = SHAPES[shape];
  const rnd = seeded(shape.length * 977);

  return (
    <div
      className={className}
      /* The keyframe is authored at the dawn theme's level and this wrapper
         scales it back for night. Two nested opacities multiply, which is
         the only way to give one keyframe two resting levels without
         duplicating it per theme. */
      style={{ width, opacity: "var(--constellation-boost, 1)", ...style }}
      aria-hidden="true"
    >
      <div
        style={{
          animationName: "sm-constellation",
          animationDuration: "calc(17s * var(--motion-scale, 1))",
          animationTimingFunction: "ease-in-out",
          animationIterationCount: "infinite",
          animationDelay: `${delay}s`,
        }}
      >
        <svg viewBox="0 0 100 72" width="100%" role="presentation">
          <g
            stroke="var(--constellation-ink, #d8c29a)"
            strokeWidth="0.26"
            opacity="0.45"
            fill="none"
          >
            {edges.map(([a, b], i) => (
              <line
                key={i}
                x1={pts[a][0]}
                y1={pts[a][1]}
                x2={pts[b][0]}
                y2={pts[b][1]}
              />
            ))}
          </g>
          {pts.map(([x, y], i) => {
            const s = 1.1 + rnd() * 1.1;
            return (
              <path
                key={i}
                d={sparklePath(x, y, s)}
                fill="var(--constellation-ink, #d8c29a)"
                opacity={round(0.34 + rnd() * 0.3, 2)}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Star field — modelled on drei's <Stars>, which is what the
   reference uses: fixed positions, varied fixed brightness, a
   soft radial fade, and one shared clock pulsing every point's
   size together. Nothing drifts; the field only moves when the
   scene in front of it is moved.
   ──────────────────────────────────────────────────────────── */


/** 2*PI / 0.3, the reference's cycle at its own speed setting. */
const BREATH = 21;

export function Starfield({
  seed = 21,
  count = 260,
  /** how many survive on a phone; the rest are hidden below `sm` */
  mobileCount,
  /** normalised radius around the centre kept clear of stars */
  clear = 0.05,
  /** whether the field travels rightwards; the pace is --star-drift */
  drift = false,
  className,
}: {
  seed?: number;
  count?: number;
  mobileCount?: number;
  clear?: number;
  drift?: boolean;
  className?: string;
}) {
  const onPhone = mobileCount ?? count;
  const rnd = seeded(seed);
  const stars: {
    x: number;
    y: number;
    s: number;
    o: number;
    gold: boolean;
    sparkle: boolean;
    dur: number;
    delay: number;
  }[] = [];

  /**
   * Space is not evenly sprinkled, and an even sprinkle is the one thing that
   * reads instantly as generated. Five centres take two thirds of the field
   * between them, each draw pulled toward its centre by a power curve so the
   * density falls off smoothly and never draws an edge you could point at.
   *
   * Two details do most of the work. The radii vary widely — a tight knot and
   * a loose drift are different objects, and a row of equal-sized clusters is
   * just a coarser grid. And the centres are weighted, so some are markedly
   * richer than others; picking between them uniformly gave five clusters of
   * the same brightness, which reads as deliberate placement.
   */
  const clusters = Array.from({ length: 5 }, () => ({
    x: rnd(),
    y: rnd(),
    r: 0.07 + rnd() * 0.21,
    w: 0.45 + rnd() * 1.55,
  }));
  const totalWeight = clusters.reduce((s, c) => s + c.w, 0);

  /**
   * And three regions nothing is allowed into at all. The gaps between
   * clusters give small irregularities; these give the sky somewhere to be
   * properly empty, which is what makes the populated parts feel populated.
   */
  const voids = [
    { x: 0.21, y: 0.71, r: 0.16 },
    { x: 0.79, y: 0.29, r: 0.14 },
    { x: 0.47, y: 0.08, r: 0.12 },
  ];

  let guard = 0;
  while (stars.length < count && guard++ < count * 60) {
    let x: number;
    let y: number;

    if (rnd() < 0.68) {
      let pick = rnd() * totalWeight;
      let c = clusters[0];
      for (const k of clusters) {
        pick -= k.w;
        if (pick <= 0) {
          c = k;
          break;
        }
      }
      const rad = c.r * Math.pow(rnd(), 1.9);
      const a = rnd() * Math.PI * 2;
      x = c.x + Math.cos(a) * rad;
      // slightly elongated, so a cluster never resolves into a disc
      y = c.y + Math.sin(a) * rad * 1.35;
      if (x < 0 || x > 1 || y < 0 || y > 1) continue;
    } else {
      x = rnd();
      y = rnd();
    }

    if (voids.some((v) => Math.hypot(v.x - x, v.y - y) < v.r)) continue;
    if (Math.hypot(x - 0.5, y - 0.5) < clear) continue;
    /**
     * How near the star is: 0 is far back in the field, 1 is close. Size and
     * brightness both follow it, and follow it together — that single shared
     * term is what turns a scatter of points at unrelated opacities into
     * something with depth. The field is mostly small and mostly faint, with
     * only a handful near enough to read as bright.
     */
    const near = rnd();
    stars.push({
      x: round(x * 100, 2),
      y: round(y * 100, 2),
      // (0.5 + 0.5 * random) * factor, as in the reference, at a smaller factor
      s: round((0.42 + 0.58 * near) * 1.6, 2),
      o: round(0.05 + near * 0.2, 2),
      gold: rnd() > 0.62,
      // roughly one in fourteen catches the light; the rest are fixed points
      sparkle: rnd() > 0.93,
      dur: round(6 + rnd() * 9, 2),
      delay: round(rnd() * 18, 2),
    });
  }

  /**
   * Every star breathes on the same clock, as the reference does — its shader
   * scales point size by (3 + sin(time)) from a single uniform, so the field
   * pulses together rather than each star blinking on its own schedule. The
   * breath lives on the outer element and any sparkle on the inner one, since
   * two animations cannot both own `transform`.
   */
  const field = stars.map((st, i) => (
    <span
      key={i}
      className={`absolute ${i < onPhone ? "" : "hidden sm:block"}`}
      style={{
        left: `${st.x}%`,
        top: `${st.y}%`,
        width: st.s,
        height: st.s,
        animationName: "sm-star-breath",
        animationDuration: `${BREATH}s`,
        animationTimingFunction: "ease-in-out",
        animationIterationCount: "infinite",
      }}
    >
      <span
        className="block h-full w-full rounded-full"
        style={{
          opacity: `calc(${st.o} * var(--star-scale, 1))`,
          /* A star is light at night and a particle by day — a luminous dot
             cannot exist over ivory, but a grain of warm dust can. The two
             tokens carry that switch; the shape is identical. */
          background: st.gold
            ? "radial-gradient(circle, var(--star-warm) 0%, color-mix(in srgb, var(--star-warm) 55%, transparent) 45%, transparent 100%)"
            : "radial-gradient(circle, var(--star-cool) 0%, color-mix(in srgb, var(--star-cool) 50%, transparent) 45%, transparent 100%)",
          ...(st.sparkle
            ? {
                ["--star-o" as string]: st.o,
                animationName: "sm-sparkle",
                animationDuration: `${st.dur}s`,
                animationTimingFunction: "ease-in-out",
                animationIterationCount: "infinite",
                animationDelay: `${st.delay}s`,
              }
            : null),
        }}
      />
    </span>
  ));

  if (!drift) {
    return (
      <div
        className={`pointer-events-none absolute inset-0 ${className ?? ""}`}
        aria-hidden="true"
      >
        {field}
      </div>
    );
  }

  // Two copies side by side, travelling from -50% to 0: as the first slides
  // out to the right the second takes its place, and the loop cannot be seen.
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}
      aria-hidden="true"
    >
      <div
        className="absolute inset-y-0 left-0 flex w-[200%]"
        style={{
          animationName: "sm-drift-right",
          animationDuration: "calc(var(--star-drift) * var(--motion-scale, 1))",
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
        }}
      >
        <div className="relative h-full w-1/2">{field}</div>
        <div className="relative h-full w-1/2">{field}</div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Dust — a handful of motes drifting upward, barely visible.
   ──────────────────────────────────────────────────────────── */

export function Dust({
  seed = 55,
  count = 14,
  className,
}: {
  seed?: number;
  count?: number;
  className?: string;
}) {
  const rnd = seeded(seed);
  const motes = Array.from({ length: count }, () => ({
    x: round(rnd() * 100, 2),
    y: round(rnd() * 100, 2),
    s: round(1 + rnd() * 1.6, 2),
    o: round(0.16 + rnd() * 0.24, 2),
    dx: round((rnd() - 0.5) * 34, 1),
    dy: round(-26 - rnd() * 48, 1),
    dur: round(26 + rnd() * 34, 1),
    delay: round(rnd() * 26, 1),
  }));

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}
      aria-hidden="true"
    >
      {motes.map((m, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-gold"
          style={
            {
              left: `${m.x}%`,
              top: `${m.y}%`,
              width: m.s,
              height: m.s,
              animationName: "sm-drift",
              animationDuration: `${m.dur}s`,
              animationTimingFunction: "linear",
              animationIterationCount: "infinite",
              animationDelay: `${m.delay}s`,
              "--dust-x": `${m.dx}px`,
              "--dust-y": `${m.dy}px`,
              "--dust-o": m.o,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
