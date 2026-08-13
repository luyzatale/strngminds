import Scene from "@/components/Scene";
import { Constellation, Dust, Nebulae } from "@/components/Celestial";
import { Parallax } from "@/components/Motion";

/**
 * The hero is a single viewport: the system, and the line beneath it.
 *
 * The galaxy field that used to surround it — twenty-six objects composed by
 * hand off an approved frame, plus a separate five-object arrangement for
 * portrait — has been taken out. The sky it left behind is the star layer,
 * which lives in Scene, plus the three layers below that were never galaxies:
 * the nebulae, the dust and the two constellations. If the field is ever
 * wanted back, it is in the history rather than gone — see the commit that
 * removed it, or the backup-2026-08-13 tag.
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

          The line is handed to Scene rather than positioned here, so it sits
          in the flow directly beneath the system. Anchored to the section's
          bottom edge — which is what the old drag hint was — it drifts away
          from the system on a tall window and crowds it on a short one,
          because the system is centred and sized from the viewport while the
          floor is not.

          The hint that used to sit under this line is gone. The system is
          still draggable and its planets still answer to a pointer; it simply
          no longer says so. */}
      <Scene
        caption={
          <>
            {/* The headline the wordmark carries in the artwork, set as live
                text so it wraps, scales and can be read aloud — the nav mark
                is a mask and says nothing to a screen reader. */}
            <p className="pointer-events-none mt-8 w-full text-balance px-2 text-center font-serif text-[clamp(0.98rem,3.6vw,1.32rem)] leading-[1.62] tracking-[0.015em] text-ink sm:mt-10 sm:px-0">
              Embody your soul. Master your mind. Lead your life.
            </p>
          </>
        }
      />
    </section>
  );
}

/**
 * What is left of the sky once the galaxies are gone.
 *
 * The three drift layers that carried them — `sm-layer-far`, `-mid`, `-near`,
 * running at 460s, 370s and 290s — went with them: they existed to move the
 * galaxies at three different rates, and an empty animated box is just a
 * composited layer doing nothing. The stars have their own parallax in Scene,
 * driven by the drag rather than by a timer.
 */
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

      <Dust seed={91} count={9} />

      {/* Hidden details. Small enough and faint enough that they are found on
          a second look rather than seen on the first. These are drawn from
          stars, so they stay. */}
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
