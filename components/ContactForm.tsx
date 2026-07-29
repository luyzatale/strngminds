"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * The form carries the same restraint as the page it sits on: hairline rules
 * instead of boxes, one gold action, and nothing that asks twice.
 */

const FIELD =
  "w-full border-0 border-b border-line-strong bg-transparent px-0 py-3 text-[0.95rem] text-ink placeholder:text-ink-faint/70 transition-colors duration-500 focus:border-gold focus:outline-none";

const LABEL =
  "block text-[0.62rem] uppercase tracking-[0.24em] text-ink-faint";

/** Tomorrow, so the picker never opens on a date that has passed. */
function tomorrow() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export default function ContactForm() {
  const reduced = useReducedMotion();
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="py-10"
      >
        <p className="font-serif text-[clamp(1.5rem,3vw,2.1rem)] font-light leading-[1.4] text-ink">
          Thank you. We have your request.
        </p>
        <p className="mt-5 max-w-[46ch] text-[0.95rem] leading-[1.9] text-ink-soft">
          We will confirm the hour within a day or two. If the time you chose is
          taken, we will offer the nearest one that is not.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-10 text-[0.8rem] tracking-[0.04em] text-ink-faint underline-offset-4 transition-colors duration-500 hover:text-ink hover:underline"
        >
          Send another
        </button>
      </motion.div>
    );
  }

  return (
    <form
      className="grid gap-x-10 gap-y-9 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <div className="sm:col-span-2">
        <label className={LABEL} htmlFor="c-name">
          Name
        </label>
        <input id="c-name" name="name" required autoComplete="name" className={FIELD} />
      </div>

      <div className="sm:col-span-2">
        <label className={LABEL} htmlFor="c-email">
          Email
        </label>
        <input
          id="c-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className={FIELD}
        />
      </div>

      <div>
        <label className={LABEL} htmlFor="c-date">
          Preferred date
        </label>
        <input
          id="c-date"
          name="date"
          type="date"
          required
          min={tomorrow()}
          defaultValue={tomorrow()}
          className={`${FIELD} [&::-webkit-calendar-picker-indicator]:opacity-45 [&::-webkit-calendar-picker-indicator]:hover:opacity-90`}
        />
      </div>

      <div>
        <label className={LABEL} htmlFor="c-time">
          Preferred hour
        </label>
        <input
          id="c-time"
          name="time"
          type="time"
          required
          defaultValue="18:00"
          step={1800}
          className={`${FIELD} [&::-webkit-calendar-picker-indicator]:opacity-45 [&::-webkit-calendar-picker-indicator]:hover:opacity-90`}
        />
      </div>

      <div className="sm:col-span-2">
        <label className={LABEL} htmlFor="c-note">
          What brings you here
        </label>
        <textarea
          id="c-note"
          name="note"
          rows={3}
          placeholder="A sentence is enough."
          className={`${FIELD} resize-none`}
        />
      </div>

      <div className="flex flex-col items-start gap-5 pt-2 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        {/* `ink-soft` rather than `ink-faint`: this is the smallest text on
            the page and it sits at the bottom of the column, which is where
            the light theme's falloff is deepest. Measured on the rendered
            page, 59% of its area was under 4.5:1 on the faint tier. */}
        <p className="max-w-[38ch] text-[0.74rem] leading-[1.8] tracking-[0.02em] text-ink-soft">
          Sessions run 60 minutes, by video or in person. Nothing is charged
          before the first conversation.
        </p>
        <button
          type="submit"
          className="inline-flex h-[3.1rem] shrink-0 items-center gap-2.5 rounded-full bg-gold px-8 text-[0.82rem] tracking-[0.06em] text-[var(--on-gold)] transition-[background-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#e2cfae] hover:shadow-lift"
        >
          Request the hour
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </form>
  );
}
