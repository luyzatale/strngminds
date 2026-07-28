import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import { themeScript } from "@/components/ThemeToggle";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const site = "https://strngminds.com";

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: {
    default: "Strng Minds — Guidance through philosophy, astronomy & the self",
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
    title: "Strng Minds — Guidance through philosophy, astronomy & the self",
    description:
      "A contemplative guidance practice where philosophy, astronomy, psychology and symbolism meet.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Strng Minds",
    description:
      "A contemplative guidance practice where philosophy, astronomy, psychology and symbolism meet.",
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="bg-paper text-ink antialiased">
        <SmoothScroll />
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
