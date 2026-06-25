# System architecture x-ray overlay (TASK 005)

## What was built or changed, file by file

- **`src/types/forensic.ts`** — Added `SystemNode` interface (`id`, `label`, `type`, `connections`) and required `systemArchitecture` array on `ForensicPayload`. Added `validateSystemArchitecture` with connection reference checks; throws on invalid data without swallowing errors.
- **`src/types/forensic.test.ts`** — Extended `validPayload` fixture with a three-node architecture graph so existing schema tests continue to pass.
- **`src/data/truckerPath.ts`** — Injected five-node revenue pipeline graph: field activity → CRM signals → manual forecast (bottleneck) → unified revenue console (intervention) → forecast confidence.
- **`src/components/SystemArchitectureOverlay.tsx`** — New client component mapping `SystemNode[]` into a vertical flex graph with Framer Motion staggered entry. Bottleneck nodes use amber warning styling; intervention nodes use `accent` token; stable nodes use `border`/`surface`/`text-primary` tokens.
- **`src/components/ForensicCanvas.tsx`** — Added `isArchitectureMode` state, icon-only toggle button (top-right of visual pane), window `keydown` listener for Spacebar when visual pane is hovered, and `AnimatePresence` crossfade between `VisualNodePanel` and `SystemArchitectureOverlay`.
- **`src/components/ForensicCanvas.test.tsx`** — Three new tests for default standard view, toggle-to-overlay crossfade, and spacebar toggle while hovering. Total suite: 23 tests.

## What decisions were made and why

- **Right-pane injection point** — Wrapped existing `VisualNodePanel` in `AnimatePresence` inside the visual pane `div`, keeping the narrative left rail untouched so the overlay reads as an x-ray of the canvas, not a separate page.
- **Hover-gated spacebar** — `isVisualPaneHovered` state via `onMouseEnter`/`onMouseLeave` prevents global spacebar from hijacking scroll elsewhere on the page.
- **Amber for bottleneck** — No `--color-warning` token exists yet (globals/tailwind off limits); amber classes provide semantic warning distinction until a formal token is added in a future styling task.
- **Tests before implementation** — Toggle and spacebar tests written first; `waitFor` required because `AnimatePresence mode="wait"` defers overlay mount until exit animation completes in jsdom.
- **Schema fixture update** — `forensic.test.ts` required a minimal `systemArchitecture` array when the field became required on `ForensicPayload`.

## What was explicitly left out and why

- **`app/page.tsx`**, **`app/globals.css`**, **`tailwind.config.ts`** — Off limits per prompt; ForensicCanvas still not mounted in the app shell.
- **Formal warning/error design token** — Not present in existing token set; bottleneck styled with Tailwind amber utilities as interim semantic warning.
- **Browser-level manual QA** — Blocked by page mount restriction; behavior verified via 23 passing unit tests and production build.

## What is broken or incomplete

- `ForensicCanvas` with architecture mode is implemented but not wired into the home page — mount when `page.tsx` is in scope.
- Bottleneck styling uses amber utilities rather than a canonical `--color-warning` token.

## What the next session should do first

- Mount `ForensicCanvas` with `truckerPathPayload` in the appropriate page or layout.
- Manually verify toggle icon, crossfade, spacebar hover behavior, and bottleneck/intervention color distinction in the browser.
- Consider adding `--color-warning` to the design token set if amber utilities are too ad hoc.
