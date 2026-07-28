import { Reveal } from "@/components/Motion";
import { FadedRule, Section } from "@/components/ui";

export default function Manifesto() {
  return (
    <Section
      id="manifesto"
      label="What we believe"
      className="py-[clamp(7rem,17vh,13rem)]"
    >
      <div className="mx-auto max-w-[54rem] text-center">
        <Reveal>
          <p className="font-serif text-[clamp(1.75rem,3.4vw,2.85rem)] font-light leading-[1.34] text-ink">
            Nothing in the sky was ever in a hurry. The planets keep their
            appointments across centuries, and the whole arrangement holds
            without anyone insisting on it.
            <span className="text-ink-faint">
              {" "}
              A life can be read the same way — slowly, and with better
              instruments.
            </span>
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mt-14 flex flex-col items-center gap-8">
          <FadedRule className="max-w-[8rem]" />
          <p className="max-w-[42ch] text-[0.95rem] leading-[1.9] text-ink-soft">
            We are not in the business of prediction. We work with the oldest
            instruments available — reason, attention, image and time — and we
            use them to ask better questions about a single life.
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
