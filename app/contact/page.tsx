import type { Metadata } from "next";
import Nav from "@/components/Nav";
import ContactForm from "@/components/ContactForm";
import { Constellation, Galaxy, Starfield } from "@/components/Celestial";
import { FadeIn, Parallax, PointerField } from "@/components/Motion";
import { LogoMark } from "@/components/Logo";

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
                <LogoMark size={22} />
                <p className="text-[0.62rem] uppercase tracking-[0.26em] text-ink-faint">
                  An hour, by arrangement
                </p>
              </div>

              <a
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
              </a>
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

function Backdrop() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <Starfield seed={404} count={120} clear={0} />

      {/* below the bar, never behind the wordmark */}
      <Parallax strength={8} className="absolute -left-32 top-[26vh]">
        <Galaxy seed={41} size={340} tilt={-18} flatten={0.34} duration={720} />
      </Parallax>

      <Parallax
        strength={6}
        invert
        className="absolute -bottom-28 -right-28 hidden sm:block"
      >
        <Galaxy seed={88} size={300} tilt={24} flatten={0.3} duration={880} reverse />
      </Parallax>

      <Parallax strength={5} className="absolute right-[4%] top-[16vh] hidden lg:block">
        <Constellation shape="cassiopeia" width={170} delay={5} />
      </Parallax>
    </div>
  );
}
