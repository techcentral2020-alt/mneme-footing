# Implement semantic design tokens (TASK 002)

## What was built or changed, file by file

- **`src/app/globals.css`** — Canonical token source. Cleared default Next template styles; kept only `@import "tailwindcss"`, `@config`, and `:root` custom properties for colors, base-8 spacing (`--space-1` through `--space-10`), and typography (`display`, `h1`–`h3`, `body`, `small`).
- **`tailwind.config.ts`** — New Tailwind v4 JS config loaded via `@config`. Maps `theme.extend.colors`, `spacing`, and `fontSize` directly to the `:root` CSS variables for strict alignment.
- **`app/globals.css`** — Reduced to a one-line `@import "../src/app/globals.css"` bridge so `app/layout.tsx` (unchanged) continues to load tokens. Required because this scaffold uses `app/` at repo root, not `src/app/`.

## What decisions were made and why

- **Monochrome palette + `#4a6278` accent** — Neutral grays for background/surface/text/border with a single muted blue-gray accent for engineered emphasis without breaking monochrome restraint.
- **Base-8 spacing** — `--space-n` = `n × 0.5rem` (8px grid at default 16px root).
- **Typography as size + line-height + letter-spacing triplets** — Each scale step has three CSS variables; `tailwind.config.ts` `fontSize` tuples reference all three for consistent utilities.
- **Tailwind v4 `@config` directive** — Project ships Tailwind 4.x (CSS-first). JS config is loaded from `src/app/globals.css` via `@config "../../tailwind.config.ts"` rather than a v3-style default config discovery.
- **`app/globals.css` import bridge** — Task specified only `src/app/globals.css` and `tailwind.config.ts`, but layout imports `./globals.css` from `app/`. A minimal import bridge was necessary for dev/build verification without touching layout files.

## What was explicitly left out and why

- React components and `app/layout.tsx` — per task constraints.
- `@theme inline` block from the Next template — replaced by explicit `:root` tokens + `tailwind.config.ts` mapping per acceptance criteria.
- Dark-mode token variants — task called for a monochrome palette without specifying theme switching; prior template dark-mode media query removed with default styles.
- Vitest scaffolding and `package.json` changes present in the working tree — unrelated to TASK 002; left unstaged.

## What is broken or incomplete

- Nothing blocking. Build and dev server verified; compiled CSS contains `:root` variables and utilities mapping to them (e.g. `p-1` → `var(--space-1)`, `text-background` → `var(--color-background)`).
- Custom typography utilities (`text-display`, `text-h1`, etc.) are defined in config but not yet used in components — expected; no component changes in this task.

## What the next session should do first

- Apply semantic token classes in portfolio UI components (background, surface, typography scale).
- Decide whether to migrate layout import to `src/app/globals.css` directly and remove the `app/globals.css` bridge.
- Consider dark-mode token pairs if the portfolio needs theme switching.
