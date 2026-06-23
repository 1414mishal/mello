# NexStudio Agency Site — Design Spec

**Date:** 2026-06-21
**Status:** Awaiting user review

## Goal

Build a fresh, mobile-perfect agency marketing site modeled on the NexStudio
TailGrids template (https://nexstudio.demos.tailgrids.com/), integrating three
existing React WebGL/shader components into a proper shadcn project structure.

The existing `index.html` in the repo is an unrelated site (a doctor's practice
page) and is used only as a Tailwind styling reference. A brand-new homepage is
created — it does not modify that file.

## Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Component system:** shadcn structure with path aliases
  - `@/components/ui` → shared UI primitives + the three shader components
  - `@/lib/utils` → exports `cn()` (clsx + tailwind-merge)
- **3D / shaders:** `three` (npm) for the liquid-metal shader; the other two use
  the browser-native WebGL / Canvas 2D APIs (no extra deps).
- **Icons:** `lucide-react`

### Why `/components/ui`

This is the shadcn convention. `components.json` maps `aliases.ui` to this
folder; the shadcn CLI installs primitives here; and the demo imports
(`@/components/ui/shader-animation`, etc.) only resolve if the folder exists at
that alias. Keeping shared UI in one aliased location is what makes shadcn and
the provided demos resolve without edits.

## Components (placed verbatim in `/components/ui/`)

| File | Tech | Role |
|------|------|------|
| `shader-animation.tsx` | three.js | Dark liquid-metal hero background (matches screenshot) |
| `digital-aurora.tsx` | WebGL | Colorful aurora background for the final CTA |
| `flow-field-background.tsx` | Canvas 2D | Particle flow field behind the dark stats section |

### Integration fixes (minimal, to keep things working)

- `flow-field-background` demo passes a non-existent `scale` prop → drop it when
  using the component (the prop isn't in the component's interface).
- `digital-aurora.tsx` is plain JS (untyped props). Keep it functional; it lives
  in a `.tsx` file and compiles. No behavior change.
- Shaders are full-bleed background layers; foreground content sits above them
  with appropriate z-index and `pointer-events` handling.

## Shader placement (decided)

- **Hero:** `shader-animation` (dark liquid metal — matches the screenshot).
- **Stats / "A Team of Builders & Innovators":** `flow-field-background`.
- **Final CTA "Ready to build your next big idea?":** `digital-aurora`.
- All other sections stay clean/white like the template.

## Page sections (top → bottom)

1. **Sticky header** — `NexSTUDIO` logo, nav (PROJECTS / ABOUT / SERVICES /
   BLOG), black pill `GET STARTED`. Mobile: hamburger → slide-in/overlay menu.
2. **Hero** — `shader-animation` full-bleed background; headline "we combine
   creativity with engineering discipline to build products that users love".
3. **Stats** — dark section over `flow-field-background`: heading "A Team of
   Builders & Innovators", `4K+ Projects Delivered`, `$0M+ Revenue Generated`.
4. **Why Partner With Us** — 4-feature grid with lucide icons: Custom Solutions,
   Dedicated Support, Innovative Tech, Expert Team.
5. **Our Services** — numbered list (#1–#4): Web App Development, Mobile App
   Development, API & Backend Solutions, Maintenance & Growth.
6. **Projects** — card grid; images from Unsplash (stable, verified photo IDs).
7. **Client Reviews** — testimonial cards.
8. **Blogs** — blog card grid with images.
9. **CTA** — "Ready to build your next big idea?" over `digital-aurora`;
   `CONTACT US` button.
10. **Footer** — Use cases / Services / Resources / Contact link columns + large
    `NexSTUDIO` watermark; bottom bar with Terms / Privacy / Cookies + copyright.

## Mobile priority (high)

- Single-column stacking on phones; multi-column grids only at `md`+.
- Fluid typography via `clamp()` so headlines scale down cleanly.
- Tap targets ≥ 44px; hamburger nav for the header.
- No horizontal overflow (`overflow-x` guarded; full-bleed sections use viewport
  width safely).
- Shader performance on phones: cap device pixel ratio and/or reduce particle
  count / animation cost on small screens so it stays smooth.
- Verified visually at 375px width.

## File layout (new)

```
app/
  layout.tsx          # root layout, fonts, globals
  page.tsx            # the homepage ("new index file") composing all sections
  globals.css         # Tailwind directives + base tokens
components/
  ui/
    shader-animation.tsx
    digital-aurora.tsx
    flow-field-background.tsx
  site/               # page-specific section components (header, hero, footer…)
lib/
  utils.ts            # cn()
components.json       # shadcn config
tailwind.config.ts
tsconfig.json (paths: @/*)
package.json
```

## Out of scope (YAGNI)

- No backend, CMS, forms submission, or auth.
- Nav links and buttons are anchors/placeholders (no separate routed pages).
- No dark/light theme toggle (template is fixed light with dark sections).
- No automated test suite (static marketing site; verification is visual at
  desktop + 375px mobile).

## Verification

- `npm run build` succeeds (type-check + compile).
- Dev server renders all sections; three shaders animate.
- Visual check at desktop and 375px mobile: no overflow, readable type, working
  hamburger, smooth shaders.
