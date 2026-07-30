import type { Metadata } from "next";
import Image from "next/image";
import Nav from "@/components/Nav";
import {
  ARGENT_CORE,
  ARGENT_INK,
  Constellation,
  FROST_CORE,
  FROST_INK,
  Galaxy,
  NEBULA_CORE,
  NEBULA_INK,
  PINWHEEL_CORE,
  PINWHEEL_INK,
  PLUME_CORE,
  PLUME_INK,
  Starfield,
  VERDANT_CORE,
  VERDANT_INK,
} from "@/components/Celestial";
import { FadeIn, Parallax, PointerField } from "@/components/Motion";
import { FadedRule } from "@/components/ui";

const SHOW_ID = "1RiUyEr5E585brB4cuq2X9";
const SHOW_URL = `https://open.spotify.com/show/${SHOW_ID}`;
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

/**
 * Spotify's show embed only ever renders the newest episode, whatever size it
 * is given — so each episode gets its own compact player instead. The ids come
 * from the public show page; add a line here when a new episode lands.
 */
const EPISODES = [
  { id: "5Mgr3vhGIlLLqNT1RnKzem", n: "04", title: "Self-Sabotage: why we do it & how to stop it" },
  { id: "5w8OF4hncsDqMFzaUWvJDa", n: "03", title: "Becoming your Higher Self" },
  { id: "0phFg9T4kohROnXpifWita", n: "02", title: "Soul-led Leadership: leading from inner power, not performance" },
  { id: "3IyLgdt0pEysei6csJL5m2", n: "01", title: "Ego vs Soul — who is leading your life?" },
];

export const metadata: Metadata = {
  title: "Meditation",
  description:
    "The Strng Minds podcast, hosted by Isabel Vanessa — every episode, in full.",
};

/**
 * Every episode, each in its own Spotify player: a preview for listeners
 * without a Spotify session, the whole episode for those with one.
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
                {EPISODES.length}
              </span>
            </div>
            <FadedRule className="mt-5" />

            <ul className="mt-8 flex flex-col gap-4">
              {EPISODES.map((ep) => (
                <li
                  key={ep.id}
                  className="overflow-hidden rounded-[1.25rem] border border-line bg-paper-50/40 p-1.5 shadow-lift backdrop-blur-[3px] transition-[border-color] duration-500 hover:border-line-strong"
                >
                  <iframe
                    title={`${ep.n} — ${ep.title}`}
                    src={`https://open.spotify.com/embed/episode/${ep.id}?theme=0`}
                    width="100%"
                    height="152"
                    loading="lazy"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    style={{ border: 0, borderRadius: "0.95rem", display: "block" }}
                  />
                </li>
              ))}
            </ul>

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
          ink={ARGENT_INK}
          core={ARGENT_CORE}
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
          ink={PLUME_INK}
          core={PLUME_CORE}
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
          ink={PINWHEEL_INK}
          core={PINWHEEL_CORE}
          style={{ opacity: 0.6 }}
        />
      </Parallax>

      {/* ── the phone ───────────────────────────────────────
             Same treatment as the contact page: no margins exist at this
             width, so each one hangs half outside the viewport. The bright
             core stays off-screen and only the outer arm crosses the text,
             which is what makes 0.85 affordable here. Anchored to `top`
             throughout — this page is several screens tall, and anything on
             `bottom` would sit below all of them. ── */}
      <Parallax strength={4} invert className="absolute -right-28 top-[8vh] sm:hidden">
        <Galaxy
          seed={191}
          size={210}
          tilt={34}
          flatten={0.34}
          duration={1120}
          ink={FROST_INK}
          core={FROST_CORE}
          style={{ opacity: 0.85 }}
        />
      </Parallax>

      <Parallax strength={3} className="absolute -left-28 top-[36vh] sm:hidden">
        <Galaxy
          seed={806}
          size={205}
          tilt={-44}
          flatten={0.32}
          duration={1200}
          ink={VERDANT_INK}
          core={VERDANT_CORE}
          style={{ opacity: 0.84 }}
        />
      </Parallax>

      <Parallax strength={4} className="absolute -left-24 top-[90vh] sm:hidden">
        <Galaxy
          seed={559}
          size={190}
          tilt={22}
          flatten={0.34}
          duration={1320}
          reverse
          style={{ opacity: 0.83 }}
        />
      </Parallax>

      <Parallax strength={3} invert className="absolute -right-24 top-[64vh] sm:hidden">
        <Galaxy
          seed={244}
          size={195}
          tilt={-26}
          flatten={0.3}
          duration={1260}
          reverse
          ink={NEBULA_INK}
          core={NEBULA_CORE}
          style={{ opacity: 0.85 }}
        />
      </Parallax>

      <Parallax strength={4} className="absolute bottom-[8vh] right-[3%] hidden xl:block">
        <Constellation shape="ursa" width={190} delay={7} />
      </Parallax>
    </div>
  );
}
