import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter, Stalemate } from "next/font/google";
import MusicControls from "@/components/MusicControls";
import SmoothScroll from "@/components/SmoothScroll";
import { themeScript } from "@/components/ThemeToggle";
import "./globals.css";

/**
 * 700 exists only for the wordmark in the light theme, and it has to be a
 * really loaded weight rather than a heavier `font-weight` value: `body` sets
 * `font-synthesis-weight: none`, so asking for a weight that was never
 * fetched silently renders at the nearest one that was. Without this line the
 * logo would simply stay where it is and the change would appear to do
 * nothing. 700 is also the heaviest Cormorant Garamond ships — past this the
 * mark cannot get bolder without changing the face.
 */
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/**
 * The signature face, used in exactly one place: her name at the foot of
 * /about.
 *
 * Chosen rather than guessed. Twenty-four scripts were rendered against the
 * supplied signature; none of them is it — that is most likely a commercial
 * signature face or a scan of a real hand — so the shortlist was the eight
 * that share its description, thin and monoline and flowing, and Stalemate is
 * the one picked off that sheet. The sheet and the eight are kept in
 * creatives/signature-options/ so the choice can be revisited without redoing
 * the search.
 *
 * Sacramento was here briefly for the same job and was taken out again.
 */
const stalemate = Stalemate({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-stalemate",
  display: "swap",
});

const site = "https://strngminds.com";

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: {
    default: "Strng Minds",
    template: "%s · Strng Minds",
  },
  description:
    "A contemplative guidance practice where philosophy, astronomy, psychology and symbolism meet. No predictions — only better questions.",
  keywords: [
    "philosophy",
    "astronomy",
    "psychology",
    "symbolism",
    "personal growth",
    "contemplative practice",
  ],
  openGraph: {
    type: "website",
    url: site,
    siteName: "Strng Minds",
    title: "Strng Minds",
    description:
      "A contemplative guidance practice where philosophy, astronomy, psychology and symbolism meet.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Strng Minds",
    description:
      "A contemplative guidance practice where philosophy, astronomy, psychology and symbolism meet.",
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Strng Minds",
    statusBarStyle: "black-translucent",
  },
  icons: {
    /**
     * The tab icon is the spiral alone — black, on nothing. No plate behind
     * it, which is why these are PNG with an alpha channel rather than the
     * SVG that used to be here: the mark is a crop of the artwork, and the
     * artwork has no vector original to ship.
     *
     * Worth knowing: black on transparent is legible on a light tab strip and
     * close to invisible on a dark one, since there is no ground to separate
     * it from. That is the cost of dropping the plate.
     */
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.png", sizes: "96x96", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#08080d",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} ${stalemate.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="bg-paper text-ink antialiased">
        <SmoothScroll />
        <MusicControls />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[100] focus:rounded-full focus:border focus:border-line focus:bg-paper focus:px-5 focus:py-2.5 focus:text-sm focus:shadow-lift"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
