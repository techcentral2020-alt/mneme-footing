# UI refinement — sticky layout, typography, and control polish (TASK 009)

## What was built or changed, file by file

- **`app/page.tsx`** — Root shell now uses `h-screen` with `min-h-0 flex-1 overflow-hidden` on `<main>` so the canvas fills the viewport below the header and page-level document scroll is eliminated.
- **`src/components/ForensicCanvas.tsx`** — Shared `LAYOUT_CLASS` grid with `h-full min-h-0`; left narrative pane gets `overflow-y-auto` for independent scroll; right visual pane gets `lg:sticky lg:top-0 lg:self-start`. Removed card borders; active constraints use `bg-surface` + subtle shadow instead of inverted black fill; narrative/intervention copy uses `text-body` with `leading-[1.75]`; controls and image frames use whitespace and token colors.
- **`src/components/PerspectiveSlider.tsx`** — Scaled to `h-7 w-36`, removed border, glassmorphic `bg-white/35 backdrop-blur-md`, smaller centered labels.
- **`src/components/TransparencyToggle.tsx`** — Scaled to `h-8 w-8` rounded-full, removed border, glassmorphic backdrop blur, smaller icons.

## What decisions were made and why

- **Viewport-locked shell in `page.tsx`** — Sticky alone failed because the whole page scrolled; constraining height at the page shell and scrolling only the left rail is the reliable split-pane pattern.
- **`min-h-0` on grid children** — Required for `overflow-y-auto` to work inside CSS grid/flex; without it the left pane expands the grid instead of scrolling.
- **Sticky right pane as belt-and-suspenders** — `lg:sticky lg:self-start` keeps the visual column pinned on large breakpoints even if outer overflow behavior changes.
- **Semantic tokens over raw zinc** — `text-text-primary`, `text-text-secondary`, `bg-surface`, `text-h2`/`text-body` align with TASK 002 without touching globals.
- **Glass controls** — `bg-white/40 backdrop-blur-md` lets toggles recede; no borders per luxury/refined brief.
- **No React logic changes** — State, hooks, payloads, and event handlers untouched per prompt.

## What was explicitly left out and why

- **`src/hooks/**`, `src/data/**`** — Off limits per prompt.
- **`app/layout.tsx`, `globals.css`, `tailwind.config.ts`** — Off limits; tokens consumed via existing utilities only.
- **New tests** — Styling-only task; 32 existing tests unchanged and passing.

## What is broken or incomplete

- Nothing blocking. All 32 tests pass; dev server serves updated layout classes (`h-screen`, `overflow-y-auto`, `lg:sticky`).
- Mobile (`grid-cols-1`) stacks panes vertically with page scroll on small viewports — acceptable; sticky split targets `lg+`.

## What the next session should do first

- Manually verify sticky split-pane and glass controls in a real browser at `lg` breakpoint.
- Consider applying `text-display` / `text-h1` to portfolio hero copy if a landing section is added.
- Wire `PerspectiveSlider` state to conditional content when builder/story modes should affect rendering.
