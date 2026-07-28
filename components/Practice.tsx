import { Reveal } from "@/components/Motion";
import { Eyebrow, FadedRule, Section } from "@/components/ui";

const STEPS = [
  {
    n: "01",
    title: "Orientation",
    body: "A long, unhurried conversation to establish where you actually stand — not where you intended to be. Nothing is prescribed in the first month.",
    meta: "90 minutes · once",
  },
  {
    n: "02",
    title: "Reflection",
    body: "Fortnightly sessions built around a single question, a text, and one observation drawn from the sky that fortnight. Written notes follow each session.",
    meta: "60 minutes · fortnightly",
  },
  {
    n: "03",
    title: "Integration",
    body: "The work leaves the room. Small practices, a reading path, and a quarterly review of what has actually changed in the way you live.",
    meta: "Ongoing · reviewed quarterly",
  },
];

export default function Practice() {
  return (
    <Section
      id="practice"
      label="The practice"
      className="py-[clamp(6rem,14vh,11rem)]"
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <Reveal className="max-w-[34rem]">
          <Eyebrow>The practice</Eyebrow>
          <h2 className="mt-7 text-[clamp(2rem,4.2vw,3.35rem)] leading-[1.1] text-ink">
            Three movements, held over time.
          </h2>
        </Reveal>
        <Reveal delay={0.1} className="max-w-[34ch]">
          <p className="text-[0.95rem] leading-[1.9] text-ink-soft">
            The structure is deliberately slow. Nothing here is designed to be
            finished in a weekend.
          </p>
        </Reveal>
      </div>

      <ol className="mt-20 grid gap-x-10 gap-y-16 md:grid-cols-3">
        {STEPS.map((s, i) => (
          <Reveal as="li" key={s.n} delay={0.08 * i} className="flex h-full flex-col">
            <FadedRule className="mb-9" />
            <div className="flex items-baseline gap-5">
              <span className="font-serif text-[0.95rem] italic tracking-[0.1em] text-gold-deep">
                {s.n}
              </span>
              <h3 className="text-[1.65rem] leading-tight text-ink">
                {s.title}
              </h3>
            </div>
            <p className="mt-6 text-[0.93rem] leading-[1.9] text-ink-soft">
              {s.body}
            </p>
            <p className="mt-auto pt-7 text-[0.72rem] uppercase tracking-[0.2em] text-ink-faint">
              {s.meta}
            </p>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
