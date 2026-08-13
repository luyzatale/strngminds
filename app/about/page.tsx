import type { Metadata } from "next";
import Nav from "@/components/Nav";
import { Constellation, Starfield } from "@/components/Celestial";
import { FadeIn, Parallax, PointerField } from "@/components/Motion";
import { SpiralMark, WordmarkArt } from "@/components/Logo";
import Social from "@/components/Social";
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
          * Stalemate, picked off the sheet in creatives/signature-options/
          * after twenty-four scripts were rendered against the supplied
          * signature and none of them was it.
          *
          * Three numbers, and all three are consequences of the face rather
          * than preferences. The size is up by half again on the serif italic
          * that was here: Stalemate is delicate and carries a small x-height
          * for its em, so the same point size reads a good deal smaller. The
          * rise is eight degrees rather than five — measured off the artwork
          * again, where the name climbs about 27px across its 220px width,
          * and the first pass under-read it. And it is set well under full
          * strength, which is most of why it reads as ink rather than as type.
          *
          * The strength is a theme token rather than a number, because the two
          * grounds do not have the same room to give. Ivory on near-black can
          * go to 42% and still measure about 4.6:1; ink on parchment is at the
          * large-text floor of 3:1 by 60% and fails below it. One shared value
          * would have meant either a night theme held back by the day's limit
          * or a day theme taken under it. See --signature-alpha in globals.css.
          *
          * The rotation is on an inner span so the <p> keeps an upright box:
          * rotating the block itself would tilt the space it occupies and push
          * the wordmark below it off centre. `inline-block` is required for
          * the transform to apply at all, and the `pb` gives the descenders
          * somewhere to go once they have swung down on the left.
          */}
        <p
          className="font-script text-[clamp(2.6rem,8vw,4rem)] leading-[1.15] text-ink"
          style={{ opacity: "var(--signature-alpha, 0.6)" }}
        >
          <span className="inline-block origin-center -rotate-[8deg] pb-1.5">
            Isabel Vanessa
          </span>
        </p>

        {/* Sized so the line below sits on one line beneath it and the two
            come out about the same width, which is the proportion the
            delivered artwork has. The wordmark is 5.08:1, so 4rem of height
            is roughly 325px of width — and the line, at 1rem of this serif,
            measures about the same. Below `sm` both give way and the line
            wraps, which is the only thing that fits. */}
        {/* Pulled up under the name. This was tried once before at a negative
            margin and rolled back for crowding — but that was the serif
            italic, whose descenders drop straight into the caps below.
            Stalemate's tail sweeps sideways off the final `a` instead, so the
            two close up without colliding. Kept positive all the same. */}
        <WordmarkArt
          align="center"
          height="clamp(2rem,6.6vw,4rem)"
          className="mt-1 sm:mt-0.5"
        />

        <p className="mt-6 max-w-[46ch] text-balance font-serif text-[clamp(0.85rem,2.6vw,1rem)] leading-[1.7] tracking-[0.02em] text-ink-soft">
          Embody your soul. Master your mind. Lead your life.
        </p>

        {/* Directly under the sign-off, which is the one place on the site
            where following her is the obvious next thing rather than a
            distraction from the enquiry. `-mb-3` takes back some of the 44px
            tap targets' own padding so the row does not read as detached. */}
        <Social className="mt-5 -mb-3" />
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
