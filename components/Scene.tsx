"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import SolarSystem from "@/components/SolarSystem";
import { Starfield } from "@/components/Celestial";

/**
 * Holds the star field and the solar system together so that turning the
 * system moves the sky behind it — the same coupling the reference gets for
 * free from orbit controls moving the camera past a fixed star sphere.
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
      <motion.div className="pointer-events-none absolute inset-0 z-0" style={{ x, y }}>
        <Starfield seed={21} count={300} clear={0.04} />
      </motion.div>

      <div className="relative z-10 w-full">
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
      </div>
    </>
  );
}

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));
