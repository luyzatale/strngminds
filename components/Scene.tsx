"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import SolarSystem from "@/components/SolarSystem";
import { Starfield } from "@/components/Celestial";
import { FadeIn } from "@/components/Motion";

/**
 * Holds the star field and the solar system together so that turning the
 * system moves the sky behind it — the same coupling the reference gets for
 * free from orbit controls moving the camera past a fixed star sphere.
 *
 * The two are returned as siblings so the star layer sizes itself against the
 * hero section. Nested inside the system's own box it inherited that box's
 * square, and the stars sat in an island in the middle of the page — obvious
 * on a phone, where the system is a third of the viewport.
 *
 * `caption` sits in the flow directly beneath the system rather than being
 * positioned against the section. That is the whole point of it living here:
 * the system is centred and sized from the viewport, so a caption anchored to
 * the section's bottom edge drifted away from it on a tall window and crowded
 * it on a short one. Below the system, it is below the system at every size.
 */
/**
 * The solar system is hidden, not removed.
 *
 * Flip this to `true` and it comes back exactly as it was — SolarSystem, its
 * drag springs and the tilt callback that parallaxes the sky behind it are all
 * still here and still wired up. Nothing below this line was deleted for it.
 *
 * While it is `false` the star layer stays (it is a sibling, not a child) but
 * the system's square box goes with it, so the caption is the only thing in
 * the flow and falls to the middle of the viewport, which is where the line is
 * wanted while it stands alone. Flipping the switch back brings the box — and
 * with it the gap the caption used to sit under — back in one move. The one
 * other thing that stops is the drag parallax: `tilt` and `spin` are only ever
 * written by the system's own callback, so with nothing to drag they hold at
 * zero and the sky sits still.
 */
const SHOW_SYSTEM = false;

export default function Scene({ caption }: { caption?: ReactNode }) {
  const tilt = useMotionValue(0);
  const spin = useMotionValue(0);
  const soft = { stiffness: 38, damping: 20, mass: 1.1 };

  const x = useSpring(
    useTransform(spin, (s) => clamp(-s * 0.55, -70, 70)),
    soft,
  );
  const y = useSpring(
    useTransform(tilt, (t) => clamp(t * 0.4, -50, 50)),
    soft,
  );

  const last = useRef(0);

  return (
    <>
      {/* Overhangs the section by 15% on every side, so the parallax can run
          its full ±70px without dragging a bare edge into view. */}
      <motion.div
        className="pointer-events-none absolute -inset-[15%] z-0"
        style={{ x, y }}
      >
        {/* Sparser. The galaxies are meant to emerge from darkness, and at 560
            the field behind them was dense enough to read as noise rather than
            as sky. */}
        <Starfield seed={21} count={380} mobileCount={150} clear={0} drift />
      </motion.div>

      {/* No phone-specific nudge. There used to be a -3svh lift here, on the
          reasoning that a mobile browser's own bar overlays the bottom of the
          visible area and so dead-centre reads low — but the section is sized
          in `svh`, the *small* viewport height, which is already the height
          with those bars showing. The bar was being paid for twice, and the
          line sat above centre on a phone as a result. */}
      <FadeIn delay={0.2} y={18} className="relative z-10 w-full">
        {/* Neptune's centre is at 49.2% and it is ~1.7% wide, so the system
            paints out to ~50.9% — the box must leave room for that overhang.

            The system is deliberately given less of the viewport than it can
            take: at 72vw/64svh it clears a fifth of the width it used to fill,
            and that margin is the composition. It should read as suspended in
            space rather than fitted to the frame. A phone gives up less — the
            viewport is already tight there, and the same cut would leave the
            outer bodies too small to make out. */}
        {/* The box goes when the system does, so the caption is left alone in
            the flow and centres in the viewport. It also carries the gap the
            caption sits under, rather than the caption carrying it: that way
            the spacing belongs to the thing being spaced away from, and comes
            and goes with it. */}
        {SHOW_SYSTEM && (
          <div className="mx-auto mb-8 aspect-square w-[min(76vw,64svh)] sm:mb-10 sm:w-[min(72vw,64svh)]">
            <SolarSystem
              onTiltChange={(t, s) => {
                // one write per frame is plenty for a background layer
                const now = performance.now();
                if (now - last.current < 16) return;
                last.current = now;
                tilt.set(t);
                spin.set(s);
              }}
            />
          </div>
        )}
        {caption}
      </FadeIn>
    </>
  );
}

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));
