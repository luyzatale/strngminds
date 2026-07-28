/**
 * Deterministic pseudo-randomness.
 *
 * Every decorative field (stars, dust, galaxy arms) is generated from a fixed
 * seed so the server and the client render byte-identical markup — random()
 * would cause hydration mismatches and a flash of re-positioned stars.
 */
export function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    // mulberry32
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const round = (n: number, p = 3) => Number(n.toFixed(p));
