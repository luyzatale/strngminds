import type { ReactNode } from "react";
import { clsx } from "@/lib/clsx";

const base =
  "group inline-flex items-center justify-center gap-2.5 rounded-full text-[0.82rem] font-normal tracking-[0.06em] transition-[background-color,border-color,color,box-shadow,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform";

const sizes = {
  md: "h-11 px-6",
  lg: "h-[3.35rem] px-8",
} as const;

const variants = {
  gold: "bg-gold text-ink shadow-[0_1px_2px_rgba(25,25,25,0.04)] hover:bg-[#e2cfae] hover:shadow-lift",
  quiet:
    "bg-paper text-ink border border-line-strong hover:border-mute hover:bg-paper-100",
  bare: "text-ink-soft hover:text-ink",
} as const;

export function Button({
  href,
  children,
  variant = "gold",
  size = "md",
  className,
  arrow = false,
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
  arrow?: boolean;
}) {
  return (
    <a
      href={href}
      className={clsx(base, sizes[size], variants[variant], className)}
    >
      {children}
      {arrow && (
        <span
          aria-hidden="true"
          className="translate-x-0 text-[0.9em] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
        >
          →
        </span>
      )}
    </a>
  );
}

export function Card({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  return (
    <Tag
      className={clsx(
        "relative rounded-[1.75rem] border border-line bg-paper/70 p-9 shadow-lift backdrop-blur-[2px] transition-[box-shadow,border-color,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-line-strong hover:shadow-lift-hover sm:p-11",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={clsx(
        "text-[0.68rem] font-normal uppercase tracking-[0.26em] text-ink-faint",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function Numeral({ children }: { children: ReactNode }) {
  return (
    <span className="font-serif text-[0.95rem] italic tracking-[0.08em] text-gold-deep">
      {children}
    </span>
  );
}

/** A hairline that fades out at both ends — used instead of hard dividers. */
export function FadedRule({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={clsx("h-px w-full", className)}
      style={{
        background:
          "linear-gradient(90deg, rgba(234,234,234,0) 0%, rgba(218,218,218,0.9) 22%, rgba(218,218,218,0.9) 78%, rgba(234,234,234,0) 100%)",
      }}
    />
  );
}

export function Section({
  id,
  children,
  className,
  label,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  label?: string;
}) {
  return (
    <section
      id={id}
      aria-label={label}
      className={clsx(
        "relative mx-auto w-full max-w-[78rem] px-6 sm:px-10 lg:px-14",
        className,
      )}
    >
      {children}
    </section>
  );
}
