"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Dust } from "@/components/Celestial";
import { Reveal } from "@/components/Motion";
import { Eyebrow, Section } from "@/components/ui";

export default function Begin() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <Section id="begin" label="Begin" className="py-[clamp(6rem,14vh,11rem)]">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2.25rem] border border-line bg-paper-50/80 px-6 py-[clamp(4rem,9vh,7rem)] text-center backdrop-blur-[3px] sm:px-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 80% at 50% 0%, rgba(247,232,199,0.34) 0%, rgba(247,232,199,0.08) 42%, rgba(255,255,255,0) 72%)",
            }}
          />
          <Dust seed={404} count={9} />

          <div className="relative mx-auto max-w-[42rem]">
            <Eyebrow>Enrolment · Autumn cohort</Eyebrow>
            <h2 className="mt-7 text-[clamp(2.1rem,4.4vw,3.4rem)] leading-[1.1] text-ink">
              Begin where you actually are.
            </h2>
            <p className="mx-auto mt-7 max-w-[44ch] text-[0.98rem] leading-[1.9] text-ink-soft">
              Twelve people join each season. Leave an address and we will send
              the reading list, the schedule, and a single question to sit with
              before we speak.
            </p>

            <form
              className="mx-auto mt-11 flex w-full max-w-[30rem] flex-col gap-3 sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <label htmlFor="begin-email" className="sr-only">
                Email address
              </label>
              <input
                id="begin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="h-[3.35rem] flex-1 rounded-full border border-line-strong bg-paper px-6 text-[0.92rem] text-ink placeholder:text-ink-faint transition-colors duration-500 focus:border-gold focus:outline-none"
              />
              <button
                type="submit"
                className="h-[3.35rem] shrink-0 rounded-full bg-gold px-8 text-[0.82rem] tracking-[0.06em] text-ink transition-[background-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#e2cfae] hover:shadow-lift"
              >
                Request an invitation
              </button>
            </form>

            <div aria-live="polite" className="mt-6 min-h-[1.5rem]">
              <AnimatePresence>
                {sent && (
                  <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="text-[0.85rem] text-ink-soft"
                  >
                    Thank you. We will write within a few days — never more
                    often than that.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <p className="mt-2 text-[0.72rem] tracking-[0.06em] text-ink-faint">
              No newsletter. No predictions. One letter per season.
            </p>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
