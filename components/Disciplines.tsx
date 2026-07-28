import { Reveal } from "@/components/Motion";
import { Starfield } from "@/components/Celestial";
import { Card, Eyebrow, Numeral, Section } from "@/components/ui";

const DISCIPLINES = [
  {
    numeral: "I",
    title: "Philosophy",
    body: "Ethics, metaphysics and the long argument about how to live. We read primary texts slowly, and we let them disagree with us.",
  },
  {
    numeral: "II",
    title: "Astronomy",
    body: "Real celestial mechanics — scale, distance, deep time. The sky used as an instrument for perspective rather than prophecy.",
  },
  {
    numeral: "III",
    title: "Psychology",
    body: "Depth psychology, cognition and attachment. What actually moves a person, and what only appears to move them.",
  },
  {
    numeral: "IV",
    title: "Symbolism",
    body: "Myth, archetype and image treated as a working language for everything the analytical mind cannot yet name.",
  },
  {
    numeral: "V",
    title: "Growth",
    body: "Practice above insight. Small, repeatable movements that keep their shape when the weather turns.",
  },
];

export default function Disciplines() {
  return (
    <Section
      id="disciplines"
      label="Disciplines"
      className="relative py-[clamp(6rem,14vh,11rem)]"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <Starfield seed={303} count={18} clear={0.42} />
      </div>

      <Reveal className="max-w-[38rem]">
        <Eyebrow>The five disciplines</Eyebrow>
        <h2 className="mt-7 text-[clamp(2rem,4.2vw,3.35rem)] leading-[1.1] text-ink">
          Five ways of looking at the same question.
        </h2>
        <p className="mt-7 max-w-[46ch] text-[0.98rem] leading-[1.9] text-ink-soft">
          Each discipline is incomplete on its own. Held together, they describe
          something closer to a whole person.
        </p>
      </Reveal>

      <ul className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {DISCIPLINES.map((d, i) => (
          <Reveal as="li" key={d.title} delay={0.06 * i} className="h-full">
            <Card as="div" className="flex h-full flex-col">
              <div className="flex items-baseline justify-between">
                <Numeral>{d.numeral}</Numeral>
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-gold/70"
                />
              </div>
              <h3 className="mt-9 text-[1.6rem] leading-tight text-ink">
                {d.title}
              </h3>
              <p className="mt-4 text-[0.93rem] leading-[1.85] text-ink-soft">
                {d.body}
              </p>
            </Card>
          </Reveal>
        ))}

        {/* the sixth cell is left almost empty on purpose */}
        <Reveal as="li" delay={0.36} className="hidden lg:block">
          <div className="flex h-full items-center justify-center rounded-[1.75rem] border border-dashed border-line p-11">
            <OrbitOrnament />
          </div>
        </Reveal>
      </ul>
    </Section>
  );
}

function OrbitOrnament() {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      aria-hidden="true"
      className="text-gold"
    >
      <circle cx="60" cy="60" r="46" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.5" />
      <circle cx="60" cy="60" r="30" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
      <circle cx="60" cy="60" r="15" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.3" />
      <circle cx="60" cy="60" r="3.2" fill="#f2c977" />
      <g style={{ transformOrigin: "60px 60px", animation: "sm-spin-slow 90s linear infinite" }}>
        <circle cx="60" cy="14" r="2.4" fill="#a56b44" opacity="0.75" />
      </g>
      <g style={{ transformOrigin: "60px 60px", animation: "sm-spin-slow 58s linear infinite reverse" }}>
        <circle cx="60" cy="30" r="1.9" fill="#4d8fc8" opacity="0.7" />
      </g>
    </svg>
  );
}
