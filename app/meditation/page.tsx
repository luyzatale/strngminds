import type { Metadata } from "next";
import Image from "next/image";
import Nav from "@/components/Nav";
import { Constellation, Galaxy, Starfield } from "@/components/Celestial";
import { FadeIn, Parallax, PointerField } from "@/components/Motion";

const SHOW_ID = "1RiUyEr5E585brB4cuq2X9";
const SHOW_URL = `https://open.spotify.com/show/${SHOW_ID}`;
/** 640px cover from Spotify's CDN — the show art, host included. */
const COVER =
  "https://image-cdn-ak.spotifycdn.com/image/ab6765630000ba8a4f41f6c32e5179ec8e15beaf";

export const metadata: Metadata = {
  title: "Meditation",
  description:
    "The Strng Minds podcast, hosted by Isabel Vanessa — every episode, in full.",
};

/**
 * The episode list is Spotify's own embed rather than a copy of it. Listing
 * the episodes ourselves would need the Web API and credentials, and any list
 * we hard-coded would be wrong the day a new episode lands. The embed always
 * carries every episode and plays them: a preview for listeners without a
 * Spotify session, the whole thing for those with one.
 */
export default function MeditationPage() {
  return (
    <>
      <PointerField />
      <Nav />

      <main
        id="main"
        className="relative min-h-[100svh] overflow-hidden px-5 pb-24 pt-[calc(var(--nav-h)+clamp(1.5rem,6vh,4rem))] sm:px-10"
      >
        <Backdrop />

        <div className="relative z-10 mx-auto w-full max-w-[62rem]">
          <FadeIn delay={0.1}>
            <div className="flex flex-col items-start gap-9 sm:flex-row sm:items-end sm:gap-12">
              <div className="relative shrink-0 overflow-hidden rounded-[1.5rem] border border-line shadow-lift">
                <Image
                  src={COVER}
                  alt="Strng Minds podcast artwork, with host Isabel Vanessa"
                  width={640}
                  height={640}
                  priority
                  sizes="(min-width: 640px) 15rem, 11rem"
                  className="h-[11rem] w-[11rem] object-cover sm:h-[15rem] sm:w-[15rem]"
                />
              </div>

              <div>
                <p className="text-[0.62rem] uppercase tracking-[0.26em] text-ink-faint">
                  Podcast · every episode
                </p>
                <h1 className="mt-6 text-[clamp(2.2rem,5.4vw,3.6rem)] leading-[1.06] text-ink">
                  Meditation
                </h1>
                <p className="mt-5 text-[0.95rem] leading-[1.9] text-ink-soft">
                  Hosted by{" "}
                  <span className="font-serif text-[1.08rem] italic text-ink">
                    Isabel Vanessa
                  </span>
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.24}>
            <p className="mt-12 max-w-[54ch] text-[1rem] leading-[1.95] text-ink-soft">
              Long-form conversations on the mind and how to live with it. Sit
              with one at a time; they are not built to be finished in an
              afternoon.
            </p>
          </FadeIn>

          <FadeIn delay={0.36} className="mt-14">
            <div className="overflow-hidden rounded-[1.5rem] border border-line bg-paper-50/40 p-2 shadow-lift backdrop-blur-[3px] sm:p-3">
              <iframe
                title="Strng Minds — every episode"
                src={`https://open.spotify.com/embed/show/${SHOW_ID}?theme=0`}
                width="100%"
                height="560"
                loading="lazy"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                style={{ border: 0, borderRadius: "1.1rem", display: "block" }}
              />
            </div>

            <p className="mt-6 text-[0.72rem] leading-[1.8] tracking-[0.02em] text-ink-faint">
              Episodes play here. With a Spotify session you hear them in full;
              without one, Spotify offers a preview.{" "}
              <a
                href={SHOW_URL}
                target="_blank"
                rel="noreferrer"
                className="text-ink-soft underline-offset-4 transition-colors duration-500 hover:text-ink hover:underline"
              >
                Open the show on Spotify
              </a>
              .
            </p>
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
      <Starfield seed={77} count={150} mobileCount={60} clear={0} />

      {/* far corners only: everything between them is reading matter */}
      <Parallax strength={7} className="absolute -right-40 top-[12vh] hidden sm:block">
        <Galaxy seed={53} size={320} tilt={-16} flatten={0.32} duration={760} />
      </Parallax>

      <Parallax
        strength={5}
        invert
        className="absolute -bottom-36 -left-36 hidden lg:block"
      >
        <Galaxy seed={12} size={280} tilt={22} flatten={0.3} duration={900} reverse />
      </Parallax>

      <Parallax strength={4} className="absolute bottom-[8vh] right-[3%] hidden xl:block">
        <Constellation shape="ursa" width={190} delay={7} />
      </Parallax>
    </div>
  );
}
