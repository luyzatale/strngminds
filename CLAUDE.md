# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # http://localhost:3000
npm run build      # production build (Turbopack)
npm start          # serve the build
npm run typecheck  # tsc --noEmit
```

There is no test suite and no linter configured. `npm run typecheck` and a
successful `npm run build` are the only gates.

### Environment quirks that will otherwise cost you an hour

- **TypeScript 7 is installed**, and it no longer exposes the legacy compiler
  API Next.js expects. `next.config.ts` sets `experimental.useTypeScriptCli:
  true` to work around this. If a build dies at "Running TypeScript" with
  *"does not provide the compiler API"*, that flag has gone missing.
- **Builds fail on low memory.** A Turbopack panic ending in
  `PostCssTransformedAsset::process failed → An existing connection was
  forcibly closed` means the PostCSS worker was OOM-killed, not that the CSS is
  broken. Free RAM (leftover headless Chrome and stray `next start` processes
  are the usual culprits) and rebuild.
- **PowerShell pipelines kill long-running node.** `node script.mjs | Select-Object -First 3`
  terminates the process as soon as `Select-Object` is satisfied. Use
  `| Out-String` when the script must run to completion.
- Run builds through PowerShell, not the Bash tool — `next build` under Git Bash
  fails to spawn the TypeScript CLI (`spawn UNKNOWN`).

## Architecture

Next.js 16 App Router, React 19, Tailwind v4, Framer Motion. One route.
`README.md` covers the design rationale; this section covers the structure that
spans files.

### The page is currently the hero only

`app/page.tsx` mounts `Nav` + `Hero`. Seven finished sections (`Manifesto`,
`Disciplines`, `Practice`, `Essay`, `Voices`, `Begin`, `Footer`) sit written but
unmounted in `components/`. README's *"Adding the rest of the page"* lists the
order and the two switches that flip back on with them (`<Nav links={SECTION_LINKS} />`
and the hero's scroll cue / second button). Do not delete them as dead code.

### Who owns motion

The split is deliberate and load-bearing:

- **CSS keyframes** (all in `app/globals.css`, prefixed `sm-`) own everything
  perpetual — orbits, axial spin, the sun's breath, star pulse, dust. These run
  on the compositor and never touch the main thread.
- **Framer Motion** owns only what responds to a human: scroll reveals, pointer
  parallax, and the drag springs.

Consequence: `@media (prefers-reduced-motion)` in `globals.css` collapses every
CSS animation globally, so new perpetual motion added as a keyframe is covered
for free. Anything added through Framer must check `useReducedMotion()` itself.

### The solar system's 3D invariant

`components/SolarSystem.tsx` is a real 3D scene: `perspective` on the container,
`rotateX(tilt) rotateZ(spin)` on the orbital plane. Every planet and the sun
apply the **exact inverse** — `rotateZ(-spin) rotateX(-tilt)` — so they stay
spheres facing the viewer while the orbit rings become ellipses.

Two rules follow, and breaking either produces bugs that look like a rendering
glitch rather than a mistake:

1. `transformStyle: preserve-3d` must be unbroken from the plane down to each
   billboard. The `preserve` constant is spread onto every wrapper in that
   chain. A `filter`, `backdrop-filter`, or non-`visible` `overflow` anywhere on
   that path flattens the scene.
2. **The orbit keyframes own the `transform` property outright.** Anything that
   also needs `transform` for layout will be overwritten the instant the
   animation starts. Orbit boxes are therefore centred with `left`/`top`
   arithmetic, never a centring translate. This was a real bug: the rotating
   boxes lost their centring and every planet parked at 12 o'clock under reduced
   motion, because a finished 0.001ms animation reverts to the un-animated
   `transform`. Each animated element also carries a static `transform` matching
   its resting angle for exactly that reason.

Axial rotation is a doubled surface strip (200% wide) translated -50% per
revolution beneath a *fixed* specular highlight — the light must not travel with
the surface. Features have to be large and high-contrast; a first pass with
realistic subtle mottling animated correctly and was invisible at 22–36px.

### Sizing: container queries, not viewport units

The system is laid out in percentages of its own square container, and body
diameters use `cqw` (`containerType: inline-size` on the root). Mixing in `vmin`
or `vh` breaks the proportions at aspect ratios other than the one you tested.

### Determinism for SSR

`lib/rand.ts` is a seeded mulberry32. Every decorative field — stars, dust,
galaxy arms, the galaxy scatter in `Hero.tsx` — is generated from a fixed seed
so server and client markup match byte for byte. **Never use `Math.random()` in
render**; it produces a hydration mismatch and a visible re-shuffle.

### Theme

There are no `dark:` variants anywhere. Every Tailwind utility compiles to
`var(--color-*)`, so dark mode re-points those same tokens under
`:root[data-theme="dark"]` in `globals.css`. Add colours as tokens, not literals,
or they will not survive the theme switch. The `themeScript` string exported
from `ThemeToggle.tsx` runs inline in `<head>` before first paint and must stay
in sync with `THEME_KEY`.

### Scene coupling

`components/Scene.tsx` sits between `Hero` and `SolarSystem`: it owns the star
layer and receives the drag angles through `SolarSystem`'s `onTiltChange`
callback, throttled to one write per frame, so the sky parallaxes behind the
system. The stars deliberately have **fixed positions and one shared pulse** —
they do not drift or blink independently, matching the reference's drei
`<Stars>`. If asked to make stars "move", move the layer, not the points.

## Gotcha

Tailwind v4 translate utilities (`-translate-x-1/2`) compile to the `translate`
property, which **composes with** `transform` rather than replacing it. An
element that sets both is offset twice. Drive the offset from one place only.
