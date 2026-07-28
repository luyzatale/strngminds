# Strng Minds

A contemplative landing page for a guidance practice built on philosophy,
astronomy, psychology and symbolism.

## Run

```bash
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the build
```

## Where things are

| Path | What |
| --- | --- |
| `app/page.tsx` | The page. Currently the hero only — the MVP. |
| `app/globals.css` | Palette, type, and every keyframe used on the page. |
| `components/SolarSystem.tsx` | The centrepiece. Pure CSS animation, server-rendered. |
| `components/Celestial.tsx` | Galaxies, constellations, star field, dust. |
| `components/Scene.tsx` | Couples the star field to the solar system's drag. |
| `components/Music.tsx` | Spotify embed + the play/pause control in the nav. |
| `components/Motion.tsx` | Reveals, mouse parallax, the shared pointer field. |
| `components/Hero.tsx` | Composition of the above plus the words. |
| `components/ThemeToggle.tsx` | Light/dark switch + the no-flash boot script. |
| `components/Nav.tsx`, `Logo.tsx`, `ui.tsx` | Chrome and primitives. |

## Adding the rest of the page

The remaining sections are already written and sit unused in `components/`.
Import them into `app/page.tsx` inside `<main>`, in this order:

```tsx
<Manifesto /> <Disciplines /> <Practice /> <Essay /> <Voices /> <Begin />
```

…then `<Footer />` after `</main>`. Two things switch back on with them:

- `app/page.tsx` — pass the menu: `<Nav links={SECTION_LINKS} />`
- `components/Hero.tsx` — uncomment the `<ScrollCue />` block and add the
  second, quiet hero button (`What we study` → `#disciplines`)

## Notes on the design

- **Two themes, one palette.** Every utility compiles to `var(--color-*)`, so
  dark mode is a re-pointing of the same tokens under `:root[data-theme=dark]`
  in `globals.css` — no `dark:` variants anywhere. The choice is stored in
  `localStorage` and applied by an inline script before first paint; with no
  stored choice the page follows the system and keeps following it.
- **The stars, as the reference has them.** philosphere uses drei's `<Stars>`:
  positions are fixed, and a single `time` uniform scales every point together
  (`3 + sin(t · 0.3)`). So ours don't drift or blink independently either —
  one shared 21s pulse, fixed varied brightness, a soft radial fade. They move
  only when the scene in front of them moves, which `Scene.tsx` wires up from
  the drag. `--star-scale` lifts them 2.2× in the dark.
- **The galaxy field** is scattered from a fixed seed in `Hero.tsx` rather than
  positioned by hand, with two rules that keep it from fighting the centre: a
  galaxy's size and its opacity both grow with the square of its distance from
  the middle. The ones that land among the orbits are small and nearly
  transparent; the big ones sit out at the corners. Change the seed to reshuffle
  the whole field.
- **Music.** Browsers will not autoplay audio and Spotify's terms want their
  player visible, so playback starts from the nav control and the real embed
  fades in at bottom-left while it runs. Without a Spotify session the embed
  plays the track's 30-second preview; signed in, the whole thing. If the
  Spotify API cannot be reached the control removes itself.
- **Dragging the plane.** The system is a real 3D scene: a `perspective` on the
  container, `rotateX`/`rotateZ` on the orbital plane, and the exact inverse
  (`rotateZ(-spin) rotateX(-tilt)`) on every planet and on the sun so they stay
  spheres facing the viewer while the orbits become ellipses. Tilt is clamped
  to 74°; both axes are spring-damped. Hovering or focusing a planet names it.
- **Axial rotation.** Each body's surface detail sits on a doubled strip at 200%
  width that translates exactly -50% per revolution — seamless, and one full set
  of features spans the visible face. The specular highlight and terminator are
  held still on top, so the planet turns *under* its own light rather than the
  light travelling with the surface, which is what kills the illusion. Features
  have to be large and high-contrast to read at 22–36px: a first pass with
  subtle mottling animated correctly but was invisible on screen. Periods keep
  the real order (Jupiter 18s, Saturn 21s, Neptune 24s, Uranus 26s, Earth 30s,
  Mars 33s, Mercury 64s) and Venus runs retrograde, as it does.
- **Orbital phase.** Each planet's `start` angle in `SolarSystem.tsx` is chosen
  so nothing rests on top of the type. Periods run 96–720s, so the arrangement
  a visitor first sees is essentially the composed one.
- **Motion is CSS.** Orbits, twinkle, drift and the sun's breath are keyframes
  on the compositor. Framer Motion only handles reveals and pointer parallax.
- **Reduced motion** is honoured everywhere: animations collapse, Lenis and the
  parallax switch off, the drag springs become instant, and planets park at
  their composed positions.

### Careful with

Tailwind v4 translate utilities (`-translate-x-1/2`) compile to the `translate`
property, which **composes with** `transform` rather than replacing it. Any
element that also sets `transform` inline will be shifted twice — drive the
offset from one place only.

## Colour

Paper `#FFFFFF · #FCFCFC · #FAFAFA · #F7F7F5` · lines `#EAEAEA · #DADADA ·
#BDBDBD` · gold `#D8C29A` · ivory `#F7E8C7` · cosmos `#325E91` · earth
`#4D8FC8` · terra `#A56B44`. Ink is `#191919 / #4A4A4A / #767676` — the faint
tone is set at 4.5:1 on white so small type still passes AA.

One token exists only to survive both themes: `--galaxy-filter`, a small
contrast lift so the pale galaxies register on white. It sits in `globals.css`
alongside the palette.
