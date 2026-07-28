import { Constellation } from "@/components/Celestial";
import { Parallax, Reveal } from "@/components/Motion";
import { Button, Eyebrow, Section } from "@/components/ui";

export default function Essay() {
  return (
    <Section
      id="essay"
      label="From the journal"
      className="py-[clamp(6rem,14vh,11rem)]"
    >
      <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-24">
        <div>
          <Reveal>
            <Eyebrow>From the journal · No. 04</Eyebrow>
            <h2 className="mt-7 max-w-[16ch] text-[clamp(2rem,4.2vw,3.2rem)] leading-[1.12] text-ink">
              On orbits, and the patience they ask of us.
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-9 max-w-[52ch] text-[1rem] leading-[1.95] text-ink-soft">
              An orbit is not a circle drawn once. It is a compromise, renewed
              every instant, between falling and moving forward — and it is the
              compromise, not the resolution, that keeps the thing in the sky.
            </p>
          </Reveal>

          <Reveal delay={0.16}>
            <blockquote className="mt-11 border-l border-gold/70 pl-8">
              <p className="font-serif text-[clamp(1.35rem,2.2vw,1.8rem)] font-light italic leading-[1.5] text-ink">
                Most of what we call being stuck is simply an orbit we have not
                yet learned to recognise.
              </p>
            </blockquote>
          </Reveal>

          <Reveal delay={0.22}>
            <p className="mt-11 max-w-[52ch] text-[1rem] leading-[1.95] text-ink-soft">
              The question is rarely whether a life is repeating itself. It
              almost always is. The question is what it is repeating around —
              and whether that centre still deserves the gravity we have given
              it.
            </p>
            <div className="mt-12">
              <Button href="#begin" variant="quiet" arrow>
                Read the full essay
              </Button>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.12} className="relative">
          <Parallax strength={7} className="relative mx-auto max-w-[30rem]">
            <OrbitPortrait />
          </Parallax>
          <Parallax
            strength={5}
            invert
            className="absolute -right-6 -top-6 hidden opacity-80 lg:block"
          >
            <Constellation shape="cassiopeia" width={150} delay={4} />
          </Parallax>
        </Reveal>
      </div>
    </Section>
  );
}

/**
 * A single body on a true elliptical path — CSS `offset-path` does the
 * geometry, so the motion is genuinely elliptical rather than a squashed spin.
 */
function OrbitPortrait() {
  const path = "M 20,150 a 130,58 0 1,0 260,0 a 130,58 0 1,0 -260,0";

  return (
    <div className="relative aspect-square w-full" aria-hidden="true">
      <svg viewBox="0 0 300 300" className="absolute inset-0 h-full w-full">
        <defs>
          <radialGradient id="ess-sun">
            <stop offset="0%" stopColor="#fffaf0" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#f7e8c7" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="ess-earth" cx="34%" cy="28%" r="76%">
            <stop offset="0%" stopColor="#a9d2f0" />
            <stop offset="46%" stopColor="#4d8fc8" />
            <stop offset="100%" stopColor="#254a72" />
          </radialGradient>
          <radialGradient id="ess-earth-shade" cx="30%" cy="24%" r="78%">
            <stop offset="58%" stopColor="#120f0c" stopOpacity="0" />
            <stop offset="100%" stopColor="#120f0c" stopOpacity="0.55" />
          </radialGradient>
        </defs>

        <g
          fill="none"
          stroke="#d8c29a"
          strokeWidth="0.7"
          style={{ transformOrigin: "150px 150px" }}
        >
          <ellipse cx="150" cy="150" rx="130" ry="58" opacity="0.7" />
          <ellipse
            cx="150"
            cy="150"
            rx="98"
            ry="44"
            opacity="0.45"
            transform="rotate(-14 150 150)"
          />
          <ellipse
            cx="150"
            cy="150"
            rx="62"
            ry="28"
            opacity="0.3"
            transform="rotate(12 150 150)"
          />
        </g>

        <circle cx="150" cy="150" r="60" fill="url(#ess-sun)" />
        <circle cx="150" cy="150" r="6" fill="#f6d79a" />

        {/* Earth, travelling the outer ellipse once every three minutes.
            The offset path lives in SVG user units, so it scales with the box. */}
        <g
          style={{
            offsetPath: `path("${path}")`,
            offsetRotate: "0deg",
            offsetDistance: "0%",
            animation: "sm-path 186s linear infinite",
          }}
        >
          <circle cx="0" cy="0" r="9" fill="url(#ess-earth)" />
          <circle cx="0" cy="0" r="9" fill="url(#ess-earth-shade)" />
          <circle
            cx="-3.1"
            cy="-3.4"
            r="2.4"
            fill="#ffffff"
            opacity="0.35"
          />
        </g>
      </svg>
    </div>
  );
}
