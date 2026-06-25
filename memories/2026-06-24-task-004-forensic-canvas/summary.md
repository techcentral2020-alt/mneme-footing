# Forensic canvas and schema (TASK 004)

## What was built or changed, file by file

- **`src/types/forensic.ts`** — Strict TypeScript interfaces for `Title`, `Context`, `SystemConstraints`, `Intervention`, and `VisualNodes` (image + diagram variants). Exports `validateForensicPayload` for runtime validation that throws on invalid data without swallowing errors.
- **`src/types/forensic.test.ts`** — Seven unit tests covering valid payloads, required fields, visual node variants, unknown types, constraint-to-node references, and Trucker Path payload conformance.
- **`src/data/truckerPath.ts`** — Validated Trucker Path revenue acceleration payload with placeholder image `src` values left blank for future injection.
- **`src/components/ForensicCanvas.tsx`** — Client component accepting a `ForensicPayload` prop; CSS grid split pane with narrative/constraints on the left and active visual node on the right; React state tracks selected constraint.
- **`src/components/ForensicCanvas.test.tsx`** — Three component tests for split pane layout, left rail population, and constraint click updating the visual pane.

## What decisions were made and why

- **Data/presentation separation** — `ForensicCanvas` accepts only the schema-typed payload; `truckerPath.ts` owns content. No narrative data embedded in the component.
- **Runtime validation in data layer** — `truckerPathPayload` is validated at module load via `validateForensicPayload`, catching schema drift early.
- **Discriminated visual nodes** — `type: "image" | "diagram"` supports image paths and textual diagram states; empty `src` renders a dashed placeholder instead of a broken image.
- **Constraint-driven visuals** — Each `SystemConstraint` references a `visualNodeId`; clicking a constraint button updates `activeConstraintId` and resolves the matching visual node.
- **Tests before implementation** — Schema and component tests written first; button queries use regex name matching because accessible names concatenate label + description.
- **No `page.tsx` mount** — Prompt marked `page.tsx` off limits; verification via 20 passing unit tests and production build.

## What was explicitly left out and why

- **`app/page.tsx`**, **`app/globals.css`**, **`tailwind.config.ts`** — Off limits per prompt; canvas not mounted in the app shell yet.
- **Real diagram/image assets** — Image `src` paths intentionally blank for future injection.
- **Browser-level split-pane QA** — Blocked by page mount restriction; grid layout and click-to-update behavior covered by component tests.

## What is broken or incomplete

- `ForensicCanvas` is implemented but not wired into the home page — next session should mount it once `page.tsx` is in scope.
- Image visual nodes show text placeholders until real asset paths are supplied.

## What the next session should do first

- Mount `ForensicCanvas` with `truckerPathPayload` in the appropriate page or layout.
- Manually verify split pane layout and constraint-to-visual interaction in the browser.
- Inject real image paths into `truckerPath.ts` when assets are available.
- Run `npm test` and `npm run build` before further portfolio work.
