Session: 2026-06-24-task-007-meta-layer-transparency
Task type: feature
What worked: `useSyncExternalStore` with a module-level store gave global transparency state without Zustand or a Context provider; early return in `ForensicCanvas` cleanly bypassed architecture-mode `AnimatePresence` for a sudden raw aesthetic; integration tests in `useMetaLayer.test.tsx` covered toggle + canvas without touching `ForensicCanvas.test.tsx`.
What failed or required correction: Vitest oxc rejected JSX in `useMetaLayer.test.ts` — renamed to `.tsx`. Hook-only `.ts` tests must avoid JSX or use `createElement`.
Suggested rule: For global client state without new dependencies, prefer `useSyncExternalStore` + module store; co-locate meta-layer integration tests with the hook test file when component test files are off limits; use `.test.tsx` whenever tests render React components.

Session: 2026-06-24-task-006-local-asset-injection
Task type: feature
What worked: Mapping five narrative constraints to `/assets/truckerpath/` paths with a fixed `16/10` aspect-ratio `next/image` container eliminated layout shift; inner `AnimatePresence` on `node.id` gave subtle crossfades without disturbing the outer architecture-mode toggle; explicit `onError` fallback avoided `next/image` crashes on missing assets.
What failed or required correction: Browser verification blocked because `app/page.tsx` is off limits — satisfied via 23 passing unit tests, production build, and HTTP 200 asset serving. Screenshot filenames used Unicode narrow no-break spaces before `AM`, requiring shell globs (`Screenshot*10.11.54*`) for copy commands.
Suggested rule: When injecting `public/` assets from macOS screenshots, glob-copy by timestamp fragment rather than literal filenames; pair `next/image fill` with a fixed aspect-ratio parent for stable forensic canvas transitions.

Session: 2026-06-24-task-005-system-architecture-overlay
Task type: feature
What worked: Injecting the overlay via `AnimatePresence` inside the existing visual pane kept the x-ray feel without restructuring the split layout; hover-gated spacebar prevented global keyboard conflicts; extending `validateForensicPayload` with connection reference checks caught graph drift at module load.
What failed or required correction: Component tests using synchronous `getByTestId` after toggle failed because `AnimatePresence mode="wait"` defers the entering child until exit completes in jsdom — switched to `waitFor`. Required `systemArchitecture` on `ForensicPayload` broke the `validPayload` fixture in `forensic.test.ts` until a minimal graph was added.
Suggested rule: For Framer Motion `AnimatePresence mode="wait"` crossfades in component tests, always use `waitFor`/`findBy*` after toggle; when adding required schema fields, update all `ForensicPayload` test fixtures in the same commit.

Session: 2026-06-24-task-004-forensic-canvas
Task type: feature
What worked: Strict schema interfaces plus a throwing `validateForensicPayload` kept data and presentation cleanly separated; validating the Trucker Path payload at module load caught reference errors between constraints and visual nodes early.
What failed or required correction: Component tests using `getByRole("button", { name: constraint.label })` failed because accessible names concatenate label and description — switched to regex partial matching.
Suggested rule: For forensic canvas constraint buttons, query by regex on label only; keep image `src` blank with an explicit placeholder UI rather than rendering broken `<img>` tags.

Session: 2026-06-24-task-003-perspective-slider
Task type: feature
What worked: Writing audio hook tests before implementation caught Vitest constructor-mock requirements early; lazy AudioContext init cleanly satisfies autoplay policy without swallowing errors.
What failed or required correction: Vitest `vi.fn(() => obj)` cannot stand in for `new AudioContext()` — use a function constructor. Component tests needed `cleanup()` between renders to avoid duplicate button queries.
Suggested rule: For Web Audio hooks, always lazy-init on user gesture and chain `resume().then(schedule)` for suspended contexts; never construct AudioContext in `useEffect` on mount.

Task type: setup
What worked: Scaffolding a fresh create-next-app project and reverting the misplaced commit in thinktank cleanly separated foundation work from an existing app.
What failed or required correction: TASK 001 was initially committed into thinktank which already contained the full AI Action Journal site.
Suggested rule: Before initializing memory infrastructure, confirm the target repo is empty or explicitly designated as the portfolio foundation — never layer foundation commits onto an existing application repo.

Session: 2026-06-24-task-002-design-tokens
Task type: styling
What worked: Defining tokens in `:root` and mapping them through `tailwind.config.ts` with Tailwind v4's `@config` directive kept CSS variables and utility classes strictly aligned; a one-line `app/globals.css` import bridge wired tokens without touching layout.
What failed or required correction: Task specified `src/app/globals.css` but the create-next-app scaffold uses `app/` at repo root; layout already imports `app/globals.css`.
Suggested rule: When a task restricts edits to `src/app/globals.css`, check whether the scaffold uses `app/` or `src/app/` before writing — if layout imports from `app/`, either allow a one-line import bridge in `app/globals.css` or explicitly permit a layout import path change.
