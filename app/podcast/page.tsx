import type { Metadata } from "next";
import Image from "next/image";
import Nav from "@/components/Nav";
import { Constellation, Starfield } from "@/components/Celestial";
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

      {/* The galaxy field that used to fill both margins is gone, as it is on
          the front page. What it was arranged around still holds if it ever
          comes back: this column is 62rem rather than the contact page's 52,
          so the margins beside it only really open up past `xl`, and every
          core sat outside the column with only the outer halo reaching it.

          The constellation stays. It is drawn from stars. */}
      <Parallax strength={4} className="absolute bottom-[8vh] right-[3%] hidden xl:block">
        <Constellation shape="ursa" width={190} delay={7} />
      </Parallax>
    </div>
  );
}
