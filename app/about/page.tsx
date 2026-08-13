import type { Metadata } from "next";
import Nav from "@/components/Nav";
import { Constellation, Starfield } from "@/components/Celestial";
import { FadeIn, Parallax, PointerField } from "@/components/Motion";
import { SpiralMark, WordmarkArt } from "@/components/Logo";
import { FadedRule } from "@/components/ui";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why Strng Minds exists, and how it works — across the mental, emotional, physical and energetic layers, with Isabel Vanessa.",
};

/**
 * The four layers, set apart from the prose because they are the one part of
 * this page that is a structure rather than a sentence. Kept as data so the
 * label and its line stay locked together at every width.
 */
const LAYERS = [
  {
    name: "Mental",
    body: "pattern recognition, rewiring the belief system",
  },
  {
    name: "Emotional",
    body: "feeling and releasing what you’ve learned to manage",
  },
  {
    name: "Physical",
    body: "releasing what’s trapped in the body, regulating the nervous system",
  },
  {
    name: "Energetic",
    body:
      "expanding the field you operate from, because change only understood " +
      "in the mind rarely lasts, change felt in the body does",
  },
];

/**
 * A reading page. No solar system and no galaxy field — the front page shed
 * its galaxies, and a wall of them behind a thousand words of prose would be
 * the wrong argument anyway. What is left is the star layer and one
 * constellation, far enough out of the column to stay out of the way.
 */
export default function AboutPage() {
  return (
    <>
      <PointerField />
      <Nav />

      <main
        id="main"
        className="relative min-h-[100svh] overflow-hidden px-5 pb-28 pt-[calc(var(--nav-h)+clamp(2rem,8vh,5rem))] sm:px-10"
      >
        <Backdrop />

        {/* 46rem rather than the contact page's 52rem. That page is a form
            with short lines; this one is continuous prose, and a measure much
            past 70 characters is where a reader starts losing the return
            sweep between lines. */}
        <div className="relative z-10 mx-auto w-full max-w-[46rem]">
          <FadeIn delay={0.1}>
            {/* The same pairing the contact page opens with: the mark at 30px
                in `ink-soft`, then the eyebrow. Identical values on purpose —
                the two inner pages should start the same way. */}
            <div className="flex items-center gap-3.5">
              <SpiralMark size={30} className="text-ink-soft" />
              <p className="text-[0.62rem] uppercase tracking-[0.26em] text-ink-faint">
                About
              </p>
            </div>

            <h1 className="mt-6 max-w-[18ch] text-[clamp(2.2rem,5.4vw,3.6rem)] leading-[1.08] text-ink">
              Embody your soul.
            </h1>

            <p className="mt-6 text-[0.95rem] leading-[1.9] text-ink-soft">
              <span className="font-serif text-[1.08rem] italic text-ink">
                Isabel Vanessa
              </span>{" "}
              · Transformational Coach
            </p>
          </FadeIn>

          <FadeIn delay={0.24} className="mt-14">
            <FadedRule />
          </FadeIn>

          {/* The opening is set a step larger than the body that follows it.
              It is the only part of this page written as a story rather than
              as an argument, and the size is what marks the change. */}
          <FadeIn delay={0.3} className="mt-14">
            <p className="text-[1.05rem] leading-[1.85] text-ink sm:text-[1.12rem]">
              I used to define my worth by how much I could produce and
              perform: overdoing, overachieving, losing myself in work and
              relationships that mirrored how little I believed I deserved at a
              deep subconscious level. I hit a genuine breaking point: the kind
              where the version of you that looks fine on the outside is
              quietly disappearing on the inside.
            </p>
          </FadeIn>

          <FadeIn delay={0.36} className="mt-12">
            <p className="font-serif text-[1.3rem] italic leading-[1.5] text-ink sm:text-[1.5rem]">
              That’s exactly why I became a transformational coach.
            </p>
          </FadeIn>

          <div className="mt-12 flex flex-col gap-7 text-[0.98rem] leading-[1.95] text-ink-soft">
            <FadeIn delay={0.42}>
              <p>
                Many people walk around in quiet crisis behind a functioning
                mask, performing “fine” while everything underneath is falling
                apart. That mask doesn’t protect you, it isolates you further.
                This is what{" "}
                <span className="tracking-[0.06em] text-ink">STRNG MINDS</span>{" "}
                exists to end.
              </p>
            </FadeIn>

            <FadeIn delay={0.46}>
              <p>
                My mission isn’t just individual transformation: it’s building a
                movement of conscious, healthy, strong people from the inside
                out. People who’ve stopped outsourcing their worth, stopped
                performing wholeness, and start actually{" "}
                <em className="font-serif text-[1.12em] not-italic tracking-[0.08em] text-ink">
                  living from it
                </em>
                . There’s a huge difference between performing and embodying.
                Every person I work with becomes part of that ripple: in their
                relationships, their teams, their companies, their lives.
              </p>
            </FadeIn>
          </div>

          {/* ── the four layers ── */}
          <FadeIn delay={0.5} className="mt-16">
            <p className="text-[0.98rem] leading-[1.95] text-ink-soft">
              My approach is unique because it doesn’t stop at the mind.{" "}
              <span className="tracking-[0.06em] text-ink">STRNG MINDS</span>{" "}
              works across four layers most coaching and mentoring never touch
              at once:
            </p>

            <FadedRule className="mt-10" />

            {/* A description list rather than a table of two columns: at 46rem
                a label column wide enough for "Energetic" leaves the lines
                beside it too short, and on a phone the two would have to stack
                anyway. Stacked at every width, the label reads as a heading
                for its line instead of as a cell. */}
            <dl className="mt-9 flex flex-col gap-8">
              {LAYERS.map((layer) => (
                <div key={layer.name}>
                  {/* `ink`, not `gold-deep`. Gold is the site's accent and was
                      the obvious choice here, but its light-theme value is
                      #bfa477, which lands about 1.9:1 on the parchment — far
                      under the 4.5:1 these labels need at 10px. Night was
                      fine; there are no `dark:` variants to fix only the day
                      with, so the token has to work in both. */}
                  <dt className="text-[0.62rem] uppercase tracking-[0.26em] text-ink">
                    {layer.name}
                  </dt>
                  <dd className="mt-3 text-[0.98rem] leading-[1.9] text-ink-soft">
                    {layer.body}
                  </dd>
                </div>
              ))}
            </dl>

            <FadedRule className="mt-11" />
          </FadeIn>

          <div className="mt-12 flex flex-col gap-7 text-[0.98rem] leading-[1.95] text-ink-soft">
            <FadeIn delay={0.54}>
              <p>
                I combine NLP, Positive Psychology, Neuroplasticity,
                Meditation, Breathwork, and Nervous System Regulation: a deep,
                radical, holistic approach where psychology and spirituality
                merge, instead of staying in separate rooms.
              </p>
            </FadeIn>

            <FadeIn delay={0.58}>
              <p>
                I work 1:1 with ambitious individuals: executives, founders,
                high-performers, and doctors ready to stop cycling through
                insight without integration, ready to build an inner state that
                can carry the life they’re creating.
              </p>
            </FadeIn>

            <FadeIn delay={0.62}>
              <p>
                I also bring this work into companies, through workshops for
                organizations who understand that a team’s real ceiling isn’t
                skill: it’s how much internal safety a person has within to
                embody their most authentic and healthy self.
              </p>
            </FadeIn>
          </div>

          <Signature />
        </div>
      </main>
    </>
  );
}

/**
 * The sign-off: the name, the wordmark, the line — centred, after everything.
 *
 * Built rather than placed. The supplied signature is artwork sitting on a
 * photograph, and the photograph has to go: a page that repaints itself
 * between a near-black and a parchment cannot carry a fixed image of a room
 * behind its closing mark. Lifting the lettering off that photo is also not
 * the black-ground trick the wordmark allowed — there the ground was flat and
 * luminance alone separated it; here the letters cross pale wood and a dark
 * band in the same stroke, so no threshold cuts them cleanly.
 *
 * So the three lines are assembled from what is already exact. The wordmark is
 * the real artwork, masked and tinted like everywhere else, and the line
 * beneath it is the same live text the front page carries. Both sit on the
 * page's own ground and follow the theme.
 *
 * The name above them is the one part that is type rather than the delivered
 * script — see the note on it below.
 */
function Signature() {
  return (
    <FadeIn delay={0.7} className="mt-24 sm:mt-28">
      <FadedRule />

      <div className="mt-14 flex flex-col items-center text-center">
        {/*
          * The delivered signature sets this in a script face. The site loads
          * Cormorant Garamond and Inter and nothing else, so this is the
          * serif's italic — which is already how her name is set on the
          * podcast page, so it reads as the house style rather than as a
          * substitute. Matching the script exactly needs either the artwork
          * on a ground that can be cut out, or a script webfont added to the
          * two the site loads.
          */}
        <p className="font-serif text-[clamp(1.6rem,5vw,2.3rem)] italic leading-[1.2] text-ink">
          Isabel Vanessa
        </p>

        {/* Sized so the line below sits on one line beneath it and the two
            come out about the same width, which is the proportion the
            delivered artwork has. The wordmark is 5.08:1, so 4rem of height
            is roughly 325px of width — and the line, at 1rem of this serif,
            measures about the same. Below `sm` both give way and the line
            wraps, which is the only thing that fits. */}
        <WordmarkArt
          align="center"
          height="clamp(2rem,6.6vw,4rem)"
          className="mt-7"
        />

        <p className="mt-6 max-w-[46ch] text-balance font-serif text-[clamp(0.85rem,2.6vw,1rem)] leading-[1.7] tracking-[0.02em] text-ink-soft">
          Embody your soul. Master your mind. Lead your life.
        </p>
      </div>
    </FadeIn>
  );
}

function Backdrop() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <Starfield seed={311} count={420} mobileCount={160} clear={0} drift />

      {/* One detail, and it is gated to `xl` because that is the first width
          at which there is any margin beside a 46rem column to put it in. */}
      <Parallax strength={4} className="absolute right-[3%] top-[22vh] hidden xl:block">
        <Constellation shape="cassiopeia" width={112} delay={4} />
      </Parallax>

      <Parallax
        strength={4}
        invert
        className="absolute bottom-[10vh] left-[3%] hidden xl:block"
      >
        <Constellation shape="ursa" width={124} delay={11} />
      </Parallax>
    </div>
  );
}
