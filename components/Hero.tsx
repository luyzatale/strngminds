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
  SAFFRON_CORE,
  SAFFRON_INK,
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
  | "saffron"
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
  saffron: SAFFRON_INK,
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
  saffron: SAFFRON_CORE,
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
  /** bulge size against this morphology's default; 1 unless stated */
  bulge?: number;
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

/**
 * The composition.
 *
 * Every position here is authored. What was here before was a rejection
 * sampler with a minimum gap and a bias toward the frame, and it did what
 * samplers do: it filled the canvas evenly. Evenness is the one thing this
 * page cannot have — it reads as texture, and texture is what you get instead
 * of depth. A field of thirty-eight objects placed by rule became twenty
 * placed by eye, which is most of where the breathing room came from.
 *
 * The layout is regional. A dominant warm spiral holds the upper left and is
 * the only object allowed to be large. Three secondaries carry the middle
 * weight — the teal spiral on the left, the warm spiral on the right, the
 * edge-on emerging from the lower-right corner. Everything else is small,
 * softer and dimmer the further back it sits, and a wide margin around the
 * solar system is left completely empty: every object's disc clears the
 * outermost orbit, checked rather than assumed.
 *
 * `band` is which of the three drift layers carries it, and it follows
 * distance rather than position — near things drift furthest.
 */
type Band = "near" | "mid" | "far";

const COMPOSED: (Body & { band: Band })[] = [
  /**
   * Every row below is measured off the approved frame rather than judged.
   * That frame is 1672px wide, so a position is its pixel centre over 1672
   * and 941, and a size is its pixel width scaled by 1440/1672 — which is
   * what makes each object land on the same fraction of the screen it
   * occupies in the reference.
   *
   * The correction that mattered was scale, not placement. Compared side by
   * side the positions were already within about a percent, but every galaxy
   * was between 1.4 and 1.8 times too large: the hero was 300 against a
   * measured 215, the right-hand spiral 175 against 116, the lower-right
   * edge-on 240 against 134. Oversized objects eat the gaps between them,
   * which is why the field read as fuller than the reference while holding
   * exactly the same number of things.
   */

  /* upper left — 195,185 @250 */
  { kind: "spiral", shape: "barred", band: "near", x: 11.7, y: 19.7, size: 215, tilt: -25, flatten: 0.44, opacity: 0.9, blur: 0, duration: 25200, reverse: false, tinted: "ember", seed: 9101 },

  /* mid left, the teal one — 225,460 @145 */
  { kind: "spiral", shape: "spiral", band: "mid", x: 13.5, y: 48.9, size: 125, tilt: -20, flatten: 0.4, opacity: 0.68, blur: 0.4, duration: 30600, reverse: true, tinted: "verdant", seed: 9207 },
  /**
   * lower left — 105,620. Repainted from a photograph of a many-armed spiral
   * seen almost face-on, replacing the inclined copper bar that was here.
   *
   * Four things had to move together, and the size is the one that is easy to
   * get wrong. Opening a disc from 0.42 flat to 0.85 nearly doubles its
   * height, so holding 151 would have put roughly 177x160px of galaxy here —
   * within a few percent of the hero at the top left, which is the only object
   * this composition allows to be large. At 118 it covers about 139x125 and
   * stays a secondary, while still being the biggest thing on the lower left.
   *
   * `multi` rather than the two-arm form because the reference is plainly a
   * grand design: four arms opening about three-quarters of a turn each, not
   * two wound round twice. That morphology comes with a deliberately small
   * bulge — sized so a four-arm glow cannot swallow the arms it sits inside —
   * and this galaxy's bulge is its loudest feature, so `bulge` widens this one
   * back out to roughly what the two-arm form carries. Per-instance: the other
   * three grand designs in the scene are untouched.
   */
  { kind: "spiral", shape: "multi", band: "mid", x: 6.3, y: 65.9, size: 130, tilt: -12, flatten: 0.72, opacity: 0.92, blur: 0.05, duration: 34200, reverse: false, tinted: "saffron", bulge: 1.15, seed: 9313 },
  /* small edge-on below centre left — 468,660 @65 */
  { kind: "spiral", shape: "edge", band: "far", x: 28, y: 70.1, size: 56, tilt: -34, flatten: 0.92, opacity: 0.55, blur: 0.7, duration: 39600, reverse: true, tinted: "sepia", seed: 9419 },
  /* the faint round one in the corner — 265,830 @75 */
  { kind: "spiral", shape: "lenticular", band: "far", x: 15.8, y: 88.2, size: 65, tilt: 22, flatten: 0.9, opacity: 0.42, blur: 1.2, duration: 43200, reverse: false, tinted: "argent", seed: 9521 },

  /* across the top — 530,130 @60 and 1000,158 @75 */
  { kind: "spiral", shape: "spiral", band: "far", x: 31.7, y: 13.8, size: 52, tilt: 40, flatten: 0.66, opacity: 0.5, blur: 0.8, duration: 36000, reverse: false, tinted: "nebula", seed: 9627 },
  { kind: "spiral", shape: "edge", band: "far", x: 59.8, y: 16.8, size: 65, tilt: -20, flatten: 0.9, opacity: 0.5, blur: 0.85, duration: 41400, reverse: true, tinted: "sepia", seed: 9733 },

  /* upper right — the violet spiral 1518,205 @110 and the cluster 1205,292 @65 */
  { kind: "spiral", shape: "multi", band: "mid", x: 90.8, y: 21.8, size: 95, tilt: -12, flatten: 0.92, opacity: 0.62, blur: 0.4, duration: 32400, reverse: false, tinted: "nebula", seed: 9839 },
  { kind: "spiral", shape: "cluster", band: "far", x: 72.1, y: 31, size: 56, tilt: 30, flatten: 0.94, opacity: 0.8, blur: 0.3, duration: 45000, reverse: true, tinted: "argent", seed: 9941 },

  /* right — warm spiral 1512,400 @135, thin edge-on 1400,522 @90 */
  { kind: "spiral", shape: "multi", band: "mid", x: 90.4, y: 42.5, size: 116, tilt: 30, flatten: 0.9, opacity: 0.66, blur: 0.35, duration: 28800, reverse: true, tinted: "forge", seed: 10047 },
  { kind: "spiral", shape: "edge", band: "mid", x: 83.7, y: 55.5, size: 78, tilt: -26, flatten: 0.94, opacity: 0.52, blur: 0.6, duration: 37800, reverse: false, tinted: "frost", seed: 10153 },
  /* lower right, warm and fully in frame — 1432,762 @155 */
  { kind: "spiral", shape: "edge", band: "near", x: 85.6, y: 81, size: 134, tilt: 26, flatten: 0.9, opacity: 0.82, blur: 0.15, duration: 27000, reverse: true, tinted: "forge", seed: 10259 },

  /* the two lower clusters — 568,822 @55 and 1163,727 @70 */
  { kind: "spiral", shape: "cluster", band: "far", x: 34, y: 87.4, size: 47, tilt: -40, flatten: 0.95, opacity: 0.74, blur: 0.3, duration: 46800, reverse: false, tinted: "argent", seed: 10361 },
  { kind: "spiral", shape: "cluster", band: "far", x: 69.6, y: 77.3, size: 60, tilt: 16, flatten: 0.94, opacity: 0.8, blur: 0.25, duration: 43800, reverse: true, tinted: "ember", seed: 10467 },

  /* ── and the atmosphere: six that barely exist, and are meant not to ── */
  { kind: "soft", band: "far", x: 24, y: 32, size: 62, tilt: -30, flatten: 0.7, opacity: 0.1, blur: 2.4, ink: SOFT_INK[1], core: SOFT_CORE[0], phone: false, seed: 10573 },
  { kind: "soft", band: "far", x: 46, y: 10, size: 50, tilt: 24, flatten: 0.75, opacity: 0.09, blur: 2.6, ink: SOFT_INK[3], core: SOFT_CORE[1], phone: false, seed: 10679 },
  { kind: "soft", band: "far", x: 78, y: 12, size: 44, tilt: -44, flatten: 0.72, opacity: 0.08, blur: 2.7, ink: SOFT_INK[0], core: SOFT_CORE[2], phone: false, seed: 10781 },
  { kind: "soft", band: "far", x: 95, y: 62, size: 52, tilt: 38, flatten: 0.68, opacity: 0.09, blur: 2.5, ink: SOFT_INK[4], core: SOFT_CORE[3], phone: false, seed: 10887 },
  { kind: "soft", band: "far", x: 52, y: 92, size: 46, tilt: -12, flatten: 0.76, opacity: 0.08, blur: 2.7, ink: SOFT_INK[2], core: SOFT_CORE[0], phone: false, seed: 10993 },
  { kind: "soft", band: "far", x: 8, y: 40, size: 40, tilt: 50, flatten: 0.8, opacity: 0.075, blur: 2.8, ink: SOFT_INK[5], core: SOFT_CORE[1], phone: false, seed: 11099 },
];

const inBand = (b: Band) => COMPOSED.filter((g) => g.band === b);
const FAR = inBand("far");
const MID = inBand("mid");
const NEAR = inBand("near");

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
  /**
   * The phone used to show three of the eight forms — a plain spiral, a bar
   * and an edge-on — which meant every morphology added since existed only
   * on a desktop. Four of the newer ones are here now: a grand design in the
   * photographic palette, an interacting pair, a lens and the bar that was
   * already here. The teal bar keeps its place at the left of the system,
   * which is the one position on this screen that was ever asked for.
   */
  { kind: "spiral", shape: "multi", x: 79, y: 25, size: 112, tilt: 22, flatten: 0.9, opacity: 0.38, blur: 0.65, duration: 25200, reverse: true, tinted: "pinwheel", seed: 8207 },
  /**
   * The teal bar, lifted out of the solar system.
   *
   * It used to sit at 15,47 — beside the system, which is where it was
   * originally asked for. That reads on a desktop and does not read here: the
   * system takes 76vw of a phone, so "beside" leaves about 45px of margin and
   * the galaxy was crossing the outer orbits, with Neptune passing through it.
   *
   * Measured, the only band clear of the system on every phone is the strip
   * between the bar and the system's top edge, and on a 375x667 screen that
   * strip is 84px tall — the system's own square starts at y142. The lower
   * band is taller but already carries the pair and the lens.
   *
   * So the tilt does the work rather than the size. At -18deg this galaxy's
   * bounding box was 118px tall, half of that coming from the rotation of a
   * disc only 67px thick; at -7deg it is 70px, which fits the strip with room
   * either side while the object stays 145px wide and still the anchor of the
   * upper left. The size comes down only enough to keep that width honest.
   */
  { kind: "spiral", shape: "barred", x: 18, y: 14.5, size: 140, tilt: -7, flatten: 0.38, opacity: 0.47, blur: 0, duration: 28800, reverse: false, tinted: "verdant", seed: 8313 },
  { kind: "spiral", shape: "peculiar", x: 74, y: 69, size: 132, tilt: 41, flatten: 0.94, opacity: 0.42, blur: 0.45, duration: 21600, reverse: true, tinted: "plume", seed: 8419 },
  // pulled up from 76%: the hint moved closer to the system, and on a short
  // screen this was the one object with room to be crossed by it
  { kind: "spiral", shape: "lenticular", x: 26, y: 73, size: 118, tilt: -52, flatten: 0.93, opacity: 0.36, blur: 0.7, duration: 33000, reverse: false, tinted: "sepia", seed: 8525 },
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
        {FAR.map((b) => (
          <GalaxyAt key={b.seed} b={b} className="absolute hidden sm:block" />
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
        {MID.map((b) => (
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
        {NEAR.map((b, i) => (
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
        coreScale={b.bulge}
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
