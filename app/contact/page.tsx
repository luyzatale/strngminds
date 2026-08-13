import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import ContactForm from "@/components/ContactForm";
import {
  Constellation,
  Galaxy,
  NEBULA_CORE,
  NEBULA_INK,
  PINWHEEL_CORE,
  PINWHEEL_INK,
  PLUME_CORE,
  PLUME_INK,
  Starfield,
} from "@/components/Celestial";
import { FadeIn, Parallax, PointerField } from "@/components/Motion";
import { SpiralMark } from "@/components/Logo";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Request an hour with Strng Minds — a contemplative practice where philosophy, astronomy, psychology and symbolism meet.",
};

/**
 * The same sky, quieted down: a single galaxy at each far corner, one
 * constellation, and a thinner star field. The solar system stays on the
 * front page — here the form is the object.
 */
export default function ContactPage() {
  return (
    <>
      <PointerField />
      <Nav />

      <main
        id="main"
        className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-5 pb-24 pt-[calc(var(--nav-h)+clamp(2rem,8vh,5rem))] sm:px-10"
      >
        <Backdrop />

        <div className="relative z-10 mx-auto w-full max-w-[52rem]">
          <FadeIn delay={0.1}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                {/* Taller than the ring it replaces: that mark was square at
                    22px, and this one is 0.41 as wide as it is tall, so
                    matching its height would have left a sliver beside the
                    line. 30px puts the coil at about the ring's diameter. */}
                <SpiralMark size={30} className="text-ink-soft" />
                <p className="text-[0.62rem] uppercase tracking-[0.26em] text-ink-faint">
                  An hour, by arrangement
                </p>
              </div>

              <Link
                href="/"
                aria-label="Close and return to the front page"
                title="Close"
                className="-mr-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line text-ink-soft transition-[background-color,border-color,color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-line-strong hover:text-ink"
              >
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
                  <path
                    d="M3.4 3.4l9.2 9.2M12.6 3.4l-9.2 9.2"
                    stroke="currentColor"
                    strokeWidth="1.15"
                    strokeLinecap="round"
                  />
                </svg>
              </Link>
            </div>

            <h1 className="mt-8 max-w-[15ch] text-[clamp(2.2rem,5.4vw,3.6rem)] leading-[1.08] text-ink">
              Choose when we should speak.
            </h1>

            <p className="mt-7 max-w-[52ch] text-[1rem] leading-[1.9] text-ink-soft">
              Tell us a little, and name an hour that suits you. We keep few
              appointments, and we answer each one ourselves.
            </p>
          </FadeIn>

          <FadeIn delay={0.28} className="mt-16">
            <ContactForm />
          </FadeIn>
        </div>
      </main>
    </>
  );
}

/**
 * The sky behind the form.
 *
 * The one rule everything here obeys: the form is a column of reading matter
 * capped at 52rem and centred, so every galaxy is placed with its *core*
 * outside that column — in the margins beside it, or above and below it.
 * Only the faint outer halo is ever allowed to reach the text. That is why
 * each one is gated to the breakpoint at which its margin actually exists:
 * below `lg` there is no room beside the column, so the mid-sized ones are
 * simply not there, and a phone gets two at the top and bottom edges instead,
 * where the page's own padding leaves the text clear.
 */
function Backdrop() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Close to the front page's density now. Stars behind a reading
          column are a different question from galaxies behind one: a galaxy
          is a wash covering thousands of pixels, a star is two pixels, and
          measured against the text the whole field costs about a tenth of a
          percent of its area. Density here is free in a way size is not. */}
      <Starfield seed={404} count={430} mobileCount={165} clear={0} drift />

      {/**
        * The margins beside the column, and the point of these positions is
        * that they sit *in* the margin rather than off the edge of it. They
        * used to hang at -32 and -28, which put every core within about 40px
        * of the frame and made the field read as a border rather than as
        * space. The column is 52rem centred, so on a wide page there is a
        * genuine 300px of room on each side: these use it, at varied insets
        * and staggered heights, and only the two largest still bleed.
        *
        * Three carry the new morphologies — a lenticular, an interacting pair
        * and a grand design — so the inner pages show the same range the
        * front page does rather than six of one shape.
        */}

      {/* ── the left margin ─────────────────────────────── */}
      <Parallax strength={7} className="absolute -bottom-28 -left-24 hidden sm:block">
        <Galaxy seed={41} size={330} tilt={-18} flatten={0.32} duration={720} />
      </Parallax>

      <Parallax strength={6} invert className="absolute left-[3%] top-[9vh] hidden lg:block">
        <Galaxy
          seed={512}
          size={198}
          tilt={32}
          flatten={0.9}
          duration={940}
          shape="multi"
          ink={PINWHEEL_INK}
          core={PINWHEEL_CORE}
          style={{ opacity: 0.8 }}
        />
      </Parallax>

      <Parallax strength={4} className="absolute left-[7%] top-[45vh] hidden xl:block">
        <Galaxy
          seed={733}
          size={146}
          tilt={-52}
          flatten={0.95}
          duration={1180}
          reverse
          shape="peculiar"
          ink={PLUME_INK}
          core={PLUME_CORE}
          style={{ opacity: 0.62 }}
        />
      </Parallax>

      {/* ── the right margin is empty ────────────────────
             All three that were here are gone — the frost spiral bleeding off
             the top right, the verdant one low down, and the small lenticular
             that only ever appeared past `xl`. Two of them is what a laptop
             actually showed; the third is removed with them rather than left
             to reappear on a wider screen alone.

             The left margin below is untouched, so the field is deliberately
             one-sided now. ── */}

      {/* ── the phone ───────────────────────────────────────
             A phone has no margins to hide in: the column is the screen. So
             each of these hangs off the left or right edge with roughly half
             of it outside the viewport. The core — the bright part, and the
             part that would make text unreadable — never lands on the page
             at all, and what crosses the text is only the outer arm. That is
             what buys the opacity to actually see them: at 0.85 they read
             clearly while measuring 0% of any text box under 4.5:1.

             All four are anchored to `top`, so they land in the first screen
             rather than below the fold. ── */}
      <Parallax strength={4} className="absolute -left-24 top-[9vh] sm:hidden">
        <Galaxy
          seed={155}
          size={200}
          tilt={-30}
          flatten={0.36}
          duration={1100}
          style={{ opacity: 0.86 }}
        />
      </Parallax>

      <Parallax strength={4} invert className="absolute -right-28 top-[30vh] sm:hidden">
        <Galaxy
          seed={621}
          size={215}
          tilt={40}
          flatten={0.94}
          duration={1160}
          shape="peculiar"
          ink={PLUME_INK}
          core={PLUME_CORE}
          style={{ opacity: 0.85 }}
        />
      </Parallax>

      <Parallax strength={3} className="absolute -left-28 top-[58vh] sm:hidden">
        <Galaxy
          seed={877}
          size={210}
          tilt={18}
          flatten={0.92}
          duration={1210}
          reverse
          shape="multi"
          ink={PINWHEEL_INK}
          core={PINWHEEL_CORE}
          style={{ opacity: 0.84 }}
        />
      </Parallax>

      <Parallax strength={3} invert className="absolute -right-24 top-[82vh] sm:hidden">
        <Galaxy
          seed={318}
          size={195}
          tilt={28}
          flatten={0.3}
          duration={1240}
          reverse
          ink={NEBULA_INK}
          core={NEBULA_CORE}
          style={{ opacity: 0.85 }}
        />
      </Parallax>

      <Parallax strength={5} className="absolute bottom-[6vh] right-[4%] hidden xl:block">
        <Constellation shape="cassiopeia" width={160} delay={5} />
      </Parallax>
    </div>
  );
}
