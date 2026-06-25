
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
