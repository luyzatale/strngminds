"use client";

import { useRef, useState, type CSSProperties, type PointerEvent } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

/**
 * The solar system.
 *
 * Orbital motion is pure CSS — every planet is a transform keyframe on the
 * compositor, so the system keeps turning without touching the main thread.
 * On top of that sits one interactive layer: dragging tilts and spins the
 * orbital *plane* in real 3D (`rotateX`/`rotateZ` under a perspective), and
 * each planet counter-rotates by the same amount so it stays a sphere facing
 * the viewer rather than being squashed into an ellipse.
 *
 * Geometry is expressed in percentages of the square container, which makes the
 * whole system responsive without a single media query.
 */

type Body = {
  name: string;
  /** orbital radius, % of container width */
  r: number;
  /** body diameter, % of container width */
  d: number;
  /** seconds per revolution */
  period: number;
  /** starting angle, degrees */
  start: number;
  /** the static sphere colour, including limb darkening */
  surface: string;
  /** tileable surface detail that scrolls, giving the body its spin */
  detail?: string;
  /** seconds per axial rotation */
  spin: number;
  /** Venus turns the other way */
  retrograde?: boolean;
  ring?: boolean;
  /** vertical float amplitude in px */
  float?: number;
};

/** Rocky bodies share a mottling; it only needs to survive being 20px wide. */
const CRATERED =
  "radial-gradient(ellipse 34% 26% at 24% 34%, rgba(0,0,0,0.32), transparent 70%)," +
  "radial-gradient(ellipse 28% 22% at 64% 62%, rgba(0,0,0,0.28), transparent 70%)," +
  "radial-gradient(ellipse 22% 18% at 88% 26%, rgba(255,255,255,0.24), transparent 70%)";

const SPHERE_LIGHT =
  "radial-gradient(circle at 33% 27%, rgba(255,255,255,0.44), rgba(255,255,255,0) 48%)";
const SPHERE_SHADE =
  "radial-gradient(circle at 72% 76%, rgba(18,16,14,0.5), rgba(18,16,14,0) 62%)";

const BODIES: Body[] = [
  {
    name: "Mercury",
    r: 11,
    d: 2.07,
    period: 154,
    start: 130,
    spin: 102,
    surface:
      "radial-gradient(circle at 38% 32%, #b9b3ac 0%, #8e8781 46%, #5f5952 100%)",
    detail: CRATERED,
  },
  {
    name: "Venus",
    r: 15.5,
    d: 2.99,
    period: 237,
    start: 40,
    spin: 144,
    retrograde: true,
    surface:
      "radial-gradient(circle at 36% 30%, #f2e2c2 0%, #dcc094 48%, #a98354 100%)",
    detail:
      "radial-gradient(ellipse 36% 22% at 26% 34%, rgba(255,255,255,0.42), transparent 70%)," +
      "radial-gradient(ellipse 30% 18% at 70% 66%, rgba(136,96,52,0.42), transparent 70%)",
  },
  {
    name: "Earth",
    r: 20.5,
    d: 3.52,
    period: 336,
    start: 200,
    spin: 48,
    surface:
      "radial-gradient(circle at 36% 30%, #8fc0e6 0%, #4d8fc8 52%, #2b5a86 100%)",
    detail:
      "radial-gradient(ellipse 30% 30% at 22% 44%, rgba(72,108,64,0.98), transparent 68%)," +
      "radial-gradient(ellipse 22% 34% at 56% 28%, rgba(84,118,70,0.95), transparent 68%)," +
      "radial-gradient(ellipse 20% 20% at 84% 66%, rgba(78,112,66,0.92), transparent 68%)," +
      "radial-gradient(ellipse 26% 14% at 40% 86%, rgba(255,255,255,0.38), transparent 70%)",
    float: 5,
  },
  {
    name: "Mars",
    r: 26,
    d: 2.68,
    period: 429,
    start: 118,
    spin: 53,
    surface:
      "radial-gradient(circle at 36% 30%, #c98a5e 0%, #a56b44 50%, #6f4127 100%)",
    detail: CRATERED,
  },
  {
    name: "Jupiter",
    r: 32,
    d: 5.81,
    period: 557,
    start: 85,
    spin: 29,
    surface:
      "repeating-linear-gradient(178deg," +
      "rgba(255,255,255,0.10) 0 6%," +
      "rgba(140,96,62,0.16) 6% 11%," +
      "rgba(255,255,255,0.06) 11% 19%," +
      "rgba(120,80,52,0.18) 19% 24%)," +
      "radial-gradient(circle at 36% 30%, #eddcc0 0%, #cda87c 44%, #9a6b41 78%, #6d4728 100%)",
    detail:
      "radial-gradient(ellipse 20% 13% at 30% 62%, rgba(164,74,44,0.95), transparent 66%)," +
      "radial-gradient(ellipse 34% 8% at 68% 38%, rgba(255,255,255,0.32), transparent 72%)," +
      "radial-gradient(ellipse 28% 7% at 14% 26%, rgba(84,52,32,0.48), transparent 72%)",
    float: 6,
  },
  {
    name: "Saturn",
    r: 38.2,
    d: 4.84,
    period: 723,
    start: 200,
    spin: 34,
    ring: true,
    surface:
      "repeating-linear-gradient(179deg," +
      "rgba(255,255,255,0.10) 0 9%," +
      "rgba(150,116,70,0.14) 9% 16%)," +
      "radial-gradient(circle at 36% 30%, #f3e3bf 0%, #d8bd85 46%, #a07f4c 100%)",
    detail:
      "radial-gradient(ellipse 34% 9% at 38% 56%, rgba(255,255,255,0.34), transparent 72%)," +
      "radial-gradient(ellipse 26% 8% at 78% 34%, rgba(122,90,50,0.42), transparent 72%)",
    float: 5,
  },
  {
    name: "Uranus",
    r: 43.8,
    d: 3.96,
    period: 928,
    start: 255,
    spin: 42,
    surface:
      "radial-gradient(circle at 36% 30%, #cdeaea 0%, #86c6c9 48%, #4b8f97 100%)",
    detail:
      "radial-gradient(ellipse 38% 16% at 30% 44%, rgba(255,255,255,0.34), transparent 70%)," +
      "radial-gradient(ellipse 26% 12% at 78% 66%, rgba(36,90,98,0.42), transparent 70%)",
    float: 4,
  },
  {
    name: "Neptune",
    r: 49.2,
    d: 3.74,
    period: 1152,
    start: 105,
    spin: 38,
    surface:
      "radial-gradient(circle at 36% 30%, #8fb2dc 0%, #4a76ab 46%, #2a4c76 100%)",
    detail:
      "radial-gradient(ellipse 22% 15% at 32% 58%, rgba(10,30,58,0.8), transparent 66%)," +
      "radial-gradient(ellipse 32% 10% at 70% 34%, rgba(255,255,255,0.34), transparent 70%)",
    float: 4,
  },
];

/** Tiny bodies drifting between the giants — the grit that sells the scale. */
const MINOR = [
  { r: 28.9, d: 0.37, period: 480, start: 340, o: 0.42 },
  { r: 29.4, d: 0.3, period: 419, start: 96, o: 0.34 },
  { r: 29.9, d: 0.26, period: 528, start: 188, o: 0.27 },
  { r: 41.2, d: 0.32, period: 832, start: 128, o: 0.25 },
  { r: 46.4, d: 0.26, period: 1024, start: 22, o: 0.22 },
];

/** Orbits share a slightly displaced focus, as real ellipses do. */
const focus = (i: number) => ({ x: i * 0.55, y: i * 0.3 });

const MAX_TILT = 74;
const preserve: CSSProperties = { transformStyle: "preserve-3d" };

export default function SolarSystem({
  className,
  onTiltChange,
}: {
  className?: string;
  /** so the sky behind can lean with the plane */
  onTiltChange?: (tilt: number, spin: number) => void;
}) {
  const reduced = useReducedMotion();
  const scene = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [named, setNamed] = useState<string | null>(null);

  const tiltRaw = useMotionValue(0);
  const spinRaw = useMotionValue(0);
  const settle = { stiffness: 70, damping: 24, mass: 0.9 };
  const tilt = useSpring(tiltRaw, reduced ? { duration: 0 } : settle);
  const spin = useSpring(spinRaw, reduced ? { duration: 0 } : settle);

  // The plane, and its exact inverse for every body that must face the viewer.
  const negSpin = useTransform(spin, (v) => -v);
  const negTilt = useTransform(tilt, (v) => -v);
  const plane = useMotionTemplate`rotateX(${tilt}deg) rotateZ(${spin}deg)`;
  const billboard = useMotionTemplate`rotateZ(${negSpin}deg) rotateX(${negTilt}deg)`;

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    setNamed(null);
    drag.current = { x: e.clientX, y: e.clientY };
    setDragging(true);
    // synthetic pointers (tests, scripted input) have no capture target
    try {
      scene.current?.setPointerCapture(e.pointerId);
    } catch {}
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    drag.current = { x: e.clientX, y: e.clientY };

    const nextSpin = spinRaw.get() + dx * 0.32;
    const nextTilt = clamp(tiltRaw.get() + dy * 0.28, 0, MAX_TILT);
    spinRaw.set(nextSpin);
    tiltRaw.set(nextTilt);
    onTiltChange?.(nextTilt, nextSpin);
  };

  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    drag.current = null;
    setDragging(false);
    try {
      scene.current?.releasePointerCapture?.(e.pointerId);
    } catch {}
  };

  return (
    <div
      ref={scene}
      className={`relative aspect-square w-full touch-none select-none ${
        dragging ? "cursor-grabbing" : "cursor-grab"
      } ${className ?? ""}`}
      style={{ containerType: "inline-size", perspective: "1400px" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      role="group"
      aria-label="The solar system. Drag to tilt and turn the orbital plane."
    >
      <motion.div
        className="absolute inset-0"
        style={{ ...preserve, transform: plane }}
      >
        {/* ── Orbit rings + planets ─────────────────────────── */}
        {BODIES.map((b, i) => (
          <Orbit key={b.name} index={i} r={b.r} period={b.period} start={b.start}>
            {/* anchored at the top of the rotating box */}
            <div
              className="absolute left-1/2 top-0"
              style={{ ...preserve, transform: "translate(-50%, -50%)" }}
            >
              {/* counter-rotation keeps the light direction constant */}
              <div
                style={{
                  ...preserve,
                  transform: `rotate(${-b.start}deg)`,
                  animationName: "sm-orbit-counter",
                  animationDuration: `calc(${b.period}s * var(--motion-scale, 1))`,
                  animationTimingFunction: "linear",
                  animationIterationCount: "infinite",
                  ["--orbit-start" as string]: `${b.start}deg`,
                }}
              >
                <motion.div style={{ ...preserve, transform: billboard }}>
                  <div
                    style={{
                      animationName: "sm-float",
                      animationDuration: `calc(${29 + i * 5}s * var(--motion-scale, 1))`,
                      animationTimingFunction: "ease-in-out",
                      animationIterationCount: "infinite",
                      ["--float-d" as string]: `${b.float ?? 3}px`,
                    }}
                  >
                    <Planet
                      body={b}
                      active={named === b.name}
                      onEnter={() => setNamed(b.name)}
                      onLeave={() => setNamed((n) => (n === b.name ? null : n))}
                      onTap={() => setNamed((n) => (n === b.name ? null : b.name))}
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </Orbit>
        ))}

        {/* ── Minor bodies ──────────────────────────────────── */}
        {MINOR.map((m, i) => {
          const f = focus(4 + i * 0.2);
          return (
            <div
              key={`minor-${i}`}
              className="pointer-events-none absolute rounded-full"
              style={
                {
                  ...preserve,
                  width: `${m.r * 2}%`,
                  height: `${m.r * 2}%`,
                  left: `calc(50% + ${f.x}% - ${m.r}%)`,
                  top: `calc(50% + ${f.y}% - ${m.r}%)`,
                  transform: `rotate(${m.start}deg)`,
                  animationName: "sm-orbit",
                  animationDuration: `calc(${m.period}s * var(--motion-scale, 1))`,
                  animationTimingFunction: "linear",
                  animationIterationCount: "infinite",
                  ["--orbit-start" as string]: `${m.start}deg`,
                } as CSSProperties
              }
            >
              <div
                className="absolute left-1/2 top-0 rounded-full bg-terra"
                style={{
                  width: `${m.d}%`,
                  aspectRatio: "1",
                  opacity: m.o,
                  transform: "translate(-50%, -50%)",
                }}
              />
            </div>
          );
        })}

      </motion.div>

      {/* ── The sun ───────────────────────────────────────────
          Deliberately outside the plane. Billboarding it inside the 3D
          context produced exactly the same image, but a blurred layer in a
          preserve-3d subtree gets rasterised to its own texture and Chrome
          leaves the seam of that texture visible as a faint square. Nothing
          about the sun needs the plane's rotation, so it stays flat. */}
      <div className="pointer-events-none absolute left-1/2 top-1/2">
        {/* Four layers, and only the innermost is the body. Everything else
            here is light, not sun: each shell is wider and fainter than the
            last and the outermost reaches past the orbits entirely, because
            the point is that the surrounding space looks lit rather than that
            the sun looks large. Alphas stay low so it reads warm, not bright.

            The disc is held a little above Jupiter's diameter on purpose. The
            two are close enough now that letting the largest planet overtake
            the star would quietly invert the hierarchy of the whole scene. */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: "144cqw",
            height: "144cqw",
            background:
              "radial-gradient(circle, rgba(var(--sun-rgb), calc(0.07 * var(--sun-a))) 0%, rgba(var(--sun-rgb), calc(0.048 * var(--sun-a))) 18%, rgba(var(--sun-rgb), calc(0.029 * var(--sun-a))) 34%, rgba(var(--sun-rgb), calc(0.014 * var(--sun-a))) 52%, rgba(var(--sun-rgb), calc(0.005 * var(--sun-a))) 68%, rgba(var(--sun-rgb), 0) 84%)",
            animationName: "sm-breathe",
            animationDuration: "calc(37s * var(--motion-scale, 1))",
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
          }}
        />
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: "74cqw",
            height: "74cqw",
            background:
              "radial-gradient(circle, rgba(var(--sun-rgb), calc(0.2 * var(--sun-a))) 0%, rgba(var(--sun-rgb), calc(0.125 * var(--sun-a))) 26%, rgba(var(--sun-rgb), calc(0.062 * var(--sun-a))) 46%, rgba(var(--sun-rgb), calc(0.022 * var(--sun-a))) 64%, rgba(var(--sun-rgb), 0) 82%)",
            animationName: "sm-breathe",
            animationDuration: "calc(29s * var(--motion-scale, 1))",
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
          }}
        />
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: "21cqw",
            height: "21cqw",
            background:
              "radial-gradient(circle, rgba(255,247,228,0.88) 0%, rgba(250,224,163,0.48) 26%, rgba(240,206,142,0.21) 48%, rgba(240,206,142,0.07) 66%, rgba(240,206,142,0) 82%)",
            animationName: "sm-breathe",
            animationDuration: "calc(21s * var(--motion-scale, 1))",
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
          }}
        />
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: "6.2cqw",
            height: "6.2cqw",
            background:
              "radial-gradient(circle at 50% 46%, #ffffff 0%, #fff6dd 38%, #fbe0a4 72%, #f2c977 100%)",
            boxShadow: "0 0 34px 11px rgba(248,224,168,0.42)",
          }}
        />
      </div>
    </div>
  );
}

function Orbit({
  index,
  r,
  children,
  period,
  start,
}: {
  index: number;
  r: number;
  period: number;
  start: number;
  children?: React.ReactNode;
}) {
  const f = focus(index);
  /**
   * Centred with `left`/`top` rather than a translate, because the orbit
   * keyframes own the `transform` property outright — a centring translate
   * there would be overwritten the moment the animation starts.
   */
  const box: CSSProperties = {
    width: `${r * 2}%`,
    height: `${r * 2}%`,
    left: `calc(50% + ${f.x}% - ${r}%)`,
    top: `calc(50% + ${f.y}% - ${r}%)`,
  };

  return (
    <>
      {/* The ring should be discovered rather than announced: a hairline at the
          very bottom of the brightness scale, below the stars and well below
          the bodies it carries.

          The 0.5px stroke is a progressive refinement, not the mechanism.
          Measured: at a device pixel ratio of 1 the used border width is
          rounded back up to 1px, so only retina screens actually get a
          thinner line — which is most phones and most current laptops, but
          not all of them. The reduction that everybody sees is the 9% alpha.
          Where the ring reads at all it is because the sun's glow is behind
          it, which is the intended relationship. */}
      <div
        className="pointer-events-none absolute rounded-full border-[0.5px]"
        style={{ ...box, ...preserve, borderColor: "var(--orbit-line)" }}
      />
      <div
        className="pointer-events-none absolute rounded-full"
        style={
          {
            ...box,
            ...preserve,
            "--orbit-start": `${start}deg`,
            // the resting position, used when animation is suppressed
            transform: `rotate(${start}deg)`,
            animationName: "sm-orbit",
            animationDuration: `calc(${period}s * var(--motion-scale, 1))`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
          } as CSSProperties
        }
      >
        {children}
      </div>
    </>
  );
}

function Planet({
  body,
  active,
  onEnter,
  onLeave,
  onTap,
}: {
  body: Body;
  active: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onTap: () => void;
}) {
  return (
    <div className="pointer-events-none relative">
      <div
        className="pointer-events-auto relative overflow-hidden rounded-full outline-offset-4"
        role="img"
        tabIndex={0}
        aria-label={body.name}
        onPointerEnter={(e) => e.pointerType === "mouse" && onEnter()}
        onPointerLeave={(e) => e.pointerType === "mouse" && onLeave()}
        onPointerDown={(e) => {
          if (e.pointerType === "mouse") return;
          // a tap names the body instead of starting a drag
          e.stopPropagation();
          onTap();
        }}
        onFocus={onEnter}
        onBlur={onLeave}
        style={{
          width: `${body.d}cqw`,
          height: `${body.d}cqw`,
          backgroundImage: body.surface,
          /* Safe here, and only here: the billboard's preserve-3d chain ends
             above this element, so a filter cannot flatten the scene. On
             paper the spheres need to sit down into the page rather than
             glow off it — the same colours, a little deeper and a little
             more separated. `none` in dark. */
          filter: "var(--planet-filter, none)",
          boxShadow: active
            ? "inset -2px -3px 6px rgba(20,16,12,0.28), 0 0 0 6px color-mix(in oklab, var(--color-gold) 22%, transparent), 0 6px 16px -6px rgba(25,25,25,0.45)"
            : "inset -2px -3px 6px rgba(20,16,12,0.28), 0 4px 10px -4px rgba(25,25,25,0.4)",
          transition: "box-shadow 500ms cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {/* the surface itself, carried past on a doubled strip */}
        {body.detail && (
          <span
            className="absolute inset-y-0 left-0 flex w-[200%]"
            style={{
              animationName: "sm-surface",
              animationDuration: `calc(${body.spin}s * var(--motion-scale, 1))`,
              animationTimingFunction: "linear",
              animationIterationCount: "infinite",
              animationDirection: body.retrograde ? "reverse" : "normal",
            }}
          >
            <span
              className="h-full w-1/2 shrink-0"
              style={{ backgroundImage: body.detail, backgroundSize: "100% 100%" }}
            />
            <span
              className="h-full w-1/2 shrink-0"
              style={{ backgroundImage: body.detail, backgroundSize: "100% 100%" }}
            />
          </span>
        )}
        {/* light and terminator stay where they are, so the body turns under them */}
        <span
          className="absolute inset-0 block"
          style={{ backgroundImage: `${SPHERE_LIGHT}, ${SPHERE_SHADE}` }}
        />
      </div>

      {body.ring && (
        <>
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 rounded-[50%] border border-gold-deep/40"
            style={{
              width: `${body.d * 2.15}cqw`,
              height: `${body.d * 0.62}cqw`,
              transform: "translate(-50%, -50%) rotate(-16deg)",
            }}
          />
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 rounded-[50%] border border-gold/28"
            style={{
              width: `${body.d * 1.72}cqw`,
              height: `${body.d * 0.48}cqw`,
              transform: "translate(-50%, -50%) rotate(-16deg)",
            }}
          />
        </>
      )}

      {/* The name. It gets a generous fixed width centred by margin rather than
          a shrink-to-fit box: an absolutely positioned auto-width element is
          capped at (containing block − left), which here is half a planet, so
          the text would be laid out in ~20px and spill out of its own box. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-full z-20 -ml-[7rem] w-[14rem] whitespace-nowrap pt-3 text-center transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          opacity: active ? 1 : 0,
          transform: `translateY(${active ? "0px" : "-4px"})`,
        }}
      >
        <span className="block font-serif text-[0.98rem] tracking-[0.12em] text-ink">
          {body.name}
        </span>
      </div>
    </div>
  );
}

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));
