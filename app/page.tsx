import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import { PointerField } from "@/components/Motion";

/**
 * MVP: the landing page is the hero — the solar system, the celestial backdrop
 * and the opening words.
 *
 * The remaining sections are already built and live in /components. To bring
 * one back, import it and drop it inside <main>, in this order:
 *
 *   Manifesto · Disciplines · Practice · Essay · Voices · Begin   (+ Footer)
 */
export default function Home() {
  return (
    <>
      <PointerField />
      <Nav />
      <main id="main">
        <Hero />
      </main>
    </>
  );
}
