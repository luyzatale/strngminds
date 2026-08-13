import { clsx } from "@/lib/clsx";

/**
 * Instagram and LinkedIn, drawn rather than fetched.
 *
 * Both are outlines in `currentColor` rather than the platforms' own brand
 * marks. Two reasons, and the first is the one that decided it: this site has
 * no colour outside the ink, the paper and a little gold, so a magenta
 * gradient and a Microsoft blue would be the loudest things on any page they
 * sat on. The second is that `currentColor` follows the theme for free, which
 * a supplied PNG would not.
 *
 * Stroke weight is 1.5 on a 24 box, which lands on the same hairline the rest
 * of the site's iconography uses at its own scale.
 */

const LINKS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/strng.minds/",
    /** the handle, for the accessible name — "Instagram" alone says nothing */
    handle: "@strng.minds",
    path: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/isabel-vanessaa/",
    handle: "Isabel Vanessa",
    path: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <path d="M7.6 10.6v6.2" />
        <circle cx="7.6" cy="7.4" r="1.05" fill="currentColor" stroke="none" />
        <path d="M11.4 16.8v-6.2M11.4 13.4a2.6 2.6 0 0 1 5.2 0v3.4" />
      </>
    ),
  },
];

export default function Social({
  className,
  size = 22,
}: {
  className?: string;
  /** the glyph's box in px; the tap target around it stays at least 44px */
  size?: number;
}) {
  return (
    <ul className={clsx("flex items-center gap-1", className)}>
      {LINKS.map((l) => (
        <li key={l.label}>
          <a
            href={l.href}
            target="_blank"
            rel="noreferrer noopener"
            /* The padding is the point: the glyph is 22px, which is too small
               to hit on a phone, so the anchor carries it out to 44. */
            className="flex h-11 w-11 items-center justify-center rounded-full text-ink-faint transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-ink focus-visible:text-ink"
          >
            <span className="sr-only">
              {l.label} — {l.handle} (opens in a new tab)
            </span>
            <svg
              viewBox="0 0 24 24"
              width={size}
              height={size}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              {l.path}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
