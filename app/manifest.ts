import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Strng Minds",
    short_name: "Strng Minds",
    description:
      "A contemplative practice where philosophy, astronomy, psychology and symbolism meet.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#08080d",
    theme_color: "#08080d",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
