# Meta layer transparency toggle (TASK 007)

## What was built or changed, file by file

- **`src/hooks/useMetaLayer.ts`** — Global transparency state via `useSyncExternalStore` and a module-level store (no Zustand dependency). Exports `isTransparent`, `toggleTransparent`, `setTransparent`, and `resetMetaLayerForTests`.
- **`src/hooks/useMetaLayer.test.tsx`** — Eight tests covering hook defaults, toggle/set APIs, shared global state, `TransparencyToggle` fixed-position rendering, click-to-toggle integration, and `ForensicCanvas` raw JSON swap/restore. Total suite: 31 tests.
- **`src/components/TransparencyToggle.tsx`** — Fixed bottom-right client button with `transform-gpu` / `translateZ(0)` hardware acceleration. Framer Motion `AnimatePresence` morphs eye ↔ code icons on state change.
- **`src/components/ForensicCanvas.tsx`** — Consumes `useMetaLayer`; early return when `isTransparent` bypasses polished narrative and visual pipeline with sudden utilitarian `<pre><code>` blocks (`forensic-raw-narrative` for title/context/constraint/intervention JSON, `forensic-raw-node` for active visual node JSON). No crossfade on transparency switch.

## What decisions were made and why

- **`useSyncExternalStore` over Context** — Provides global state without a provider wrapper or new dependencies; multiple consumers (`TransparencyToggle`, `ForensicCanvas`) stay in sync.
- **Early return in ForensicCanvas** — Cleanest bypass of architecture-mode `AnimatePresence`, images, and narrative markup without restructuring the polished branch.
- **Separate toggle component** — Fixed-position control decoupled from canvas layout; mount alongside canvas in page shell when `page.tsx` is in scope.
- **Tests before implementation** — Hook and integration tests written first; test file uses `.tsx` extension because JSX in `.ts` fails Vitest oxc parse.
- **Sudden raw aesthetic** — Transparency mode intentionally skips Framer Motion to contrast with polished and architecture crossfades.

## What was explicitly left out and why

- **`app/page.tsx`**, **`app/globals.css`**, **`tailwind.config.ts`** — Off limits per prompt; toggle and canvas not mounted in app shell.
- **Zustand** — Not in `package.json` and adding dependencies was out of scope; `useSyncExternalStore` satisfies global state requirement.
- **`ForensicCanvas.test.tsx` modifications** — Out of scope per prompt; transparency behavior covered in `useMetaLayer.test.tsx`.

## What is broken or incomplete

- `TransparencyToggle` and transparency-aware `ForensicCanvas` are implemented but not wired into the home page.
- Manual browser verification of icon morph and instant JSON swap pending `page.tsx` mount.

## What the next session should do first

- Mount `<TransparencyToggle />` and `<ForensicCanvas payload={truckerPathPayload} />` in `app/page.tsx`.
- Manually verify toggle updates canvas instantly and icon morphs eye → code.
- Confirm raw JSON updates when constraint selection changes while transparency is active.
