import type { Metadata } from "next";
import Image from "next/image";
import Nav from "@/components/Nav";
import {
  ARGENT_CORE,
  ARGENT_INK,
  Constellation,
  FROST_CORE,
  FROST_INK,
  FORGE_CORE,
  FORGE_INK,
  Galaxy,
  JADE_CORE,
  JADE_INK,
  NEBULA_CORE,
  NEBULA_INK,
  SEPIA_CORE,
  SEPIA_INK,
  Starfield,
  VERDANT_CORE,
  VERDANT_INK,
} from "@/components/Celestial";
import EpisodeList from "@/components/EpisodeList";
import { FadeIn, Parallax, PointerField } from "@/components/Motion";
import { FadedRule } from "@/components/ui";
import { getEpisodes, SHOW_URL } from "@/lib/spotify";

/** 640px cover from Spotify's CDN — the show art, host included. */
const COVER =
  "https://image-cdn-ak.spotifycdn.com/image/ab6765630000ba8a4f41f6c32e5179ec8e15beaf";

/** The About text as it stands on Spotify. */
const ABOUT =
  "STRNG MINDS is the podcast for soul-driven rebels ready to break internal " +
  "limits and rise into their higher self. Hosted by psychological and " +
  "transformational life coach Isabel Vanessa, each episode explores mindset " +
  "mastery, subconscious reprogramming, universal laws, energy work, spiritual " +
  "psychology and soul-led leadership. This is where transformation meets " +
  "purpose, helping you to connect with your soul, transform your habits, " +
  "master your mind and lead your life.";

export const metadata: Metadata = {
  title: "Podcast",
  description:
    "The Strng Minds podcast, hosted by Isabel Vanessa — every episode, in full.",
};

/**
 * The episode list is fetched, not held here, so a newly published episode
 * appears without a deploy. This is how often the page goes back and asks.
 */
export const revalidate = 900;

/**
 * Every episode, each in its own Spotify player: a preview for listeners
 * without a Spotify session, the whole episode for those with one.
 *
 * Spotify's show embed only ever renders the newest episode, whatever size it
 * is given — which is why each episode gets its own compact player rather than
 * the page carrying one player for the show.
 */
export default async function PodcastPage() {
  const episodes = await getEpisodes();

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
                  Podcast
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
            <p className="mt-12 max-w-[62ch] text-[0.98rem] leading-[1.95] text-ink-soft">
              {ABOUT}
            </p>
          </FadeIn>

          <FadeIn delay={0.36} className="mt-16">
            <div className="flex items-baseline justify-between gap-6">
              <h2 className="text-[0.62rem] uppercase tracking-[0.26em] text-ink-faint">
                Episodes
              </h2>
              <span className="text-[0.62rem] uppercase tracking-[0.26em] text-ink-faint">
                {episodes.length}
              </span>
            </div>
            <FadedRule className="mt-5" />

            <EpisodeList episodes={episodes} />

            <p className="mt-8 text-[0.72rem] leading-[1.8] tracking-[0.02em] text-ink-faint">
              With a Spotify session you hear each episode in full; without one,
              Spotify offers a preview.{" "}
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
      <Starfield seed={77} count={440} mobileCount={170} clear={0} drift />

      {/* Same rule as the contact page — every core outside the reading
          column — but this column is 62rem rather than 52rem, so the margins
          beside it only really open up past `xl`. Below that the extra
          galaxies stay off, and a phone gets two at the top and bottom edges
          where the page's own padding leaves the text clear. */}
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

      {/**
        * The inner ones now sit inside the margin rather than off the edge of
        * it, and they are staggered down the page — 8, 34, 50 and 56vh — so
        * the field reads as spread rather than as a pair of borders. This
        * column is 62rem, which leaves only about 220px each side on a wide
        * page, so these are sized to fit that rather than pushed out of it:
        * the two that bleed are the two large corner ones, deliberately.
        *
        * Three carry the new morphologies, as on the contact page.
        */}
      <Parallax strength={6} invert className="absolute left-[1%] top-[8vh] hidden xl:block">
        <Galaxy
          seed={318}
          size={190}
          tilt={-34}
          flatten={0.93}
          duration={980}
          shape="lenticular"
          ink={SEPIA_INK}
          core={SEPIA_CORE}
          style={{ opacity: 0.8 }}
        />
      </Parallax>

      <Parallax strength={5} className="absolute right-[2%] bottom-[18vh] hidden lg:block">
        <Galaxy
          seed={470}
          size={214}
          tilt={38}
          flatten={0.34}
          duration={1040}
          ink={VERDANT_INK}
          core={VERDANT_CORE}
          style={{ opacity: 0.78 }}
        />
      </Parallax>

      <Parallax strength={4} className="absolute left-[3%] top-[56vh] hidden xl:block">
        <Galaxy
          seed={655}
          size={150}
          tilt={20}
          flatten={0.95}
          duration={1220}
          reverse
          shape="peculiar"
          ink={JADE_INK}
          core={JADE_CORE}
          style={{ opacity: 0.62 }}
        />
      </Parallax>

      {/* This page scrolls, so anything hung off `bottom` lands well below
          the fold. The upper band carries the first screen. */}
      <Parallax strength={5} className="absolute right-[4%] top-[50vh] hidden lg:block">
        <Galaxy
          seed={733}
          size={168}
          tilt={-22}
          flatten={0.3}
          duration={1080}
          ink={FROST_INK}
          core={FROST_CORE}
          style={{ opacity: 0.75 }}
        />
      </Parallax>

      <Parallax strength={4} invert className="absolute right-[1%] top-[32vh] hidden xl:block">
        <Galaxy
          seed={882}
          size={162}
          tilt={-58}
          flatten={0.92}
          duration={1300}
          shape="multi"
          ink={FORGE_INK}
          core={FORGE_CORE}
          style={{ opacity: 0.6 }}
        />
      </Parallax>

      {/* ── the phone ───────────────────────────────────────
             These used to hang half outside the viewport, every centre pinned
             to 0% or 100%. Measured, they sat at x = 102, -2, 100 and 0 — four
             objects on two vertical lines, which is why they read as clustered
             against the edges rather than spread through the frame however
             far apart their heights were.

             They now zigzag across it: 15%, 34%, 56%, 78% down and alternating
             sides, with none of them touching an edge. Bringing the cores on
             screen is what costs, so they are smaller and considerably
             fainter than the 0.85 they carried while half of each was hidden —
             the text measurement below is what set those numbers. ── */}
      <Parallax strength={4} invert className="absolute left-[55%] top-[6vh] sm:hidden">
        <Galaxy
          seed={191}
          size={152}
          tilt={34}
          flatten={0.9}
          duration={1120}
          shape="edge"
          ink={FROST_INK}
          core={FROST_CORE}
          style={{ opacity: 0.55 }}
        />
      </Parallax>

      <Parallax strength={3} className="absolute left-[7%] top-[26vh] sm:hidden">
        <Galaxy
          seed={806}
          size={130}
          tilt={-44}
          flatten={0.55}
          duration={1200}
          shape="ringed"
          ink={VERDANT_INK}
          core={VERDANT_CORE}
          style={{ opacity: 0.5 }}
        />
      </Parallax>

      <Parallax strength={4} className="absolute left-[11%] top-[70vh] sm:hidden">
        <Galaxy
          seed={559}
          size={134}
          tilt={22}
          flatten={0.86}
          duration={1320}
          reverse
          shape="irregular"
          style={{ opacity: 0.52 }}
        />
      </Parallax>

      <Parallax strength={3} invert className="absolute left-[58%] top-[48vh] sm:hidden">
        <Galaxy
          seed={244}
          size={142}
          tilt={-26}
          flatten={0.45}
          duration={1260}
          reverse
          shape="barred"
          ink={NEBULA_INK}
          core={NEBULA_CORE}
          style={{ opacity: 0.54 }}
        />
      </Parallax>

      <Parallax strength={4} className="absolute bottom-[8vh] right-[3%] hidden xl:block">
        <Constellation shape="ursa" width={190} delay={7} />
      </Parallax>
    </div>
  );
}
