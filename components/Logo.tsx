import { clsx } from "@/lib/clsx";

/**
 * The mark is a thin ring — the same geometry as an orbit line — with a single
 * point of gold travelling it. The wordmark is set in the serif, wide-tracked.
 */
export function LogoMark({
  size = 38,
  animated = true,
  className,
}: {
  size?: number;
  animated?: boolean;
  className?: string;
}) {
  return (
    <span
      className={clsx("relative inline-block shrink-0", className)}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <span className="absolute inset-0 rounded-full border-[1.5px] border-ink/55" />
      <span
        className="absolute inset-0"
        style={
          animated
            ? {
                animation: "sm-spin-slow 46s linear infinite",
                transformOrigin: "50% 50%",
              }
            : undefined
        }
      >
        <span
          className="absolute left-1/2 top-0 rounded-full bg-gold-deep"
          style={{
            width: Math.max(2.5, size * 0.105),
            height: Math.max(2.5, size * 0.105),
            transform: "translate(-50%, -50%)",
          }}
        />
      </span>
    </span>
  );
}

/**
 * On a phone the two words stack, which both fits the bar and echoes the
 * circular emblem; from `sm` up they sit on one line at full size.
 *
 * Set small on purpose. A house that is sure of itself does not need its name
 * at the size of a headline, and the mark reads as more confident for being
 * quieter than the thing it introduces. The tracking comes in slightly with
 * the size: wide letterspacing that reads as air at 1.18rem reads as a gap at
 * 0.95rem.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={clsx(
        "flex flex-col whitespace-nowrap font-serif text-[0.7rem] font-medium uppercase leading-[1.06] tracking-[0.13em] text-ink",
        "sm:flex-row sm:gap-[0.32em] sm:text-[0.95rem] sm:leading-none sm:tracking-[0.2em]",
        className,
      )}
    >
      <span>Strng</span>
      <span>Minds</span>
    </span>
  );
}

export function LogoLockup({
  className,
  animated = true,
}: {
  className?: string;
  animated?: boolean;
}) {
  return (
    <span className={clsx("inline-flex items-center gap-2 sm:gap-2.5", className)}>
      <LogoMark animated={animated} size={22} />
      <Wordmark />
      <span className="sr-only">Strng Minds — home</span>
    </span>
  );
}

/** Full circular emblem: two stacked lines of serif caps inside the orbit ring. */
export function LogoEmblem({
  size = 168,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "relative inline-flex items-center justify-center rounded-full border border-ink/20",
        className,
      )}
      style={{ width: size, height: size }}
      role="img"
      aria-label="Strng Minds"
    >
      <span
        className="flex flex-col items-center font-serif uppercase leading-[1.24] text-ink"
        style={{ fontSize: size * 0.145, letterSpacing: "0.06em" }}
      >
        <span>Strng</span>
        <span>Minds</span>
      </span>
    </span>
  );
}
