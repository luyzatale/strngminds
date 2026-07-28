"use client";

import { useRef } from "react";
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
 */
export default function Scene() {
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
        <Starfield seed={21} count={340} mobileCount={130} clear={0} drift={260} />
      </motion.div>

      {/* Nudged up a touch on phones: a mobile browser's own bar overlays the
          bottom of the visible area, so dead-centre in the viewport reads low
          on the screen. */}
      <FadeIn delay={0.2} y={18} className="relative z-10 -mt-[3svh] w-full sm:mt-0">
        {/* Neptune's centre is at 49.2% and it is ~2% wide, so the system
            paints out to ~51% — the box must leave room for that overhang. */}
        <div className="mx-auto w-[min(84vw,74svh)] sm:w-[min(90vw,80svh)]">
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
      </FadeIn>
    </>
  );
}

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));
