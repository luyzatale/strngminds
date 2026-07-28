import { LogoEmblem } from "@/components/Logo";
import { Reveal } from "@/components/Motion";
import { FadedRule, Section } from "@/components/ui";

const COLUMNS = [
  {
    heading: "Practice",
    links: [
      { href: "#practice", label: "How it works" },
      { href: "#disciplines", label: "Disciplines" },
      { href: "#begin", label: "Enrolment" },
    ],
  },
  {
    heading: "Reading",
    links: [
      { href: "#essay", label: "Journal" },
      { href: "#essay", label: "Reading list" },
      { href: "#voices", label: "Voices" },
    ],
  },
  {
    heading: "House",
    links: [
      { href: "#manifesto", label: "What we believe" },
      { href: "#begin", label: "Contact" },
      { href: "#top", label: "Back to top" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative pb-14 pt-[clamp(4rem,10vh,8rem)]">
      <Section>
        <FadedRule />
        <Reveal className="grid gap-14 pt-16 lg:grid-cols-[1.1fr_1.4fr]">
          <div className="flex flex-col items-start gap-8">
            <LogoEmblem size={148} />
            <p className="max-w-[34ch] text-[0.9rem] leading-[1.9] text-ink-soft">
              A contemplative guidance practice. Philosophy, astronomy,
              psychology and symbolism, held together by attention.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {COLUMNS.map((c) => (
              <div key={c.heading}>
                <h2 className="font-sans text-[0.68rem] uppercase tracking-[0.24em] text-ink-faint">
                  {c.heading}
                </h2>
                <ul className="mt-6 space-y-3.5">
                  {c.links.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        className="text-[0.9rem] text-ink-soft transition-colors duration-500 hover:text-ink"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="mt-20 flex flex-col gap-4 text-[0.76rem] tracking-[0.04em] text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Strng Minds. All rights reserved.</p>
          <p className="sm:text-right">
            Made slowly, under a shared sky.
          </p>
        </div>
      </Section>
    </footer>
  );
}
