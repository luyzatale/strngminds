import { Reveal } from "@/components/Motion";
import { Eyebrow, FadedRule, Section } from "@/components/ui";

const VOICES = [
  {
    quote:
      "I arrived wanting answers and left with a much better set of questions. A year on, the questions have aged better than any answer would have.",
    name: "A. Merrick",
    role: "Architect · Copenhagen",
  },
  {
    quote:
      "The astronomy was the surprise. Standing with something four billion years old rearranges what counts as urgent.",
    name: "R. Oyelaran",
    role: "Surgeon · Lisbon",
  },
  {
    quote:
      "Nothing about it felt mystical. It felt rigorous, and unusually kind — which turns out to be a rare combination.",
    name: "J. Novak",
    role: "Founder · Zürich",
  },
];

export default function Voices() {
  return (
    <Section id="voices" label="Voices" className="py-[clamp(6rem,14vh,11rem)]">
      <Reveal className="mx-auto max-w-[36rem] text-center">
        <Eyebrow>Voices</Eyebrow>
        <h2 className="mt-7 text-[clamp(1.9rem,3.8vw,3rem)] leading-[1.12] text-ink">
          Quiet notes from people mid-practice.
        </h2>
      </Reveal>

      <ul className="mt-20 grid gap-x-12 gap-y-14 md:grid-cols-3">
        {VOICES.map((v, i) => (
          <Reveal as="li" key={v.name} delay={0.08 * i} className="flex flex-col">
            <span
              aria-hidden="true"
              className="font-serif text-3xl leading-none text-gold"
            >
              &ldquo;
            </span>
            <blockquote className="mt-5 flex-1">
              <p className="font-serif text-[1.24rem] font-light leading-[1.62] text-ink">
                {v.quote}
              </p>
            </blockquote>
            <FadedRule className="mt-9 max-w-[4rem]" />
            <footer className="mt-5">
              <p className="text-[0.88rem] text-ink">{v.name}</p>
              <p className="mt-1 text-[0.78rem] tracking-[0.04em] text-ink-faint">
                {v.role}
              </p>
            </footer>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
