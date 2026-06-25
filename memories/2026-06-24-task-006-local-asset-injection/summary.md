# Local asset injection and image transitions (TASK 006)

## What was built or changed, file by file

- **`src/data/truckerPath.ts`** — Expanded from three placeholder constraints to five image-backed narrative steps mapped to `/assets/truckerpath/` paths (pipeline overview → team usage with 205 actions → action queue → AI recommendation → Sumter Hauling email draft). Rewrote context, constraint copy, intervention outcomes, and visual node definitions. Retained an unreferenced legacy diagram node so `forensic.test.ts` continues to expect both `image` and `diagram` variants.
- **`src/components/ForensicCanvas.tsx`** — Replaced `<img>` and dashed text placeholders with `next/image` (`fill`, `object-contain`) inside a fixed `16/10` aspect-ratio container. Added `VisualNodeImage` with `AnimatePresence mode="wait"` opacity crossfade keyed on `node.id`, plus explicit fallbacks for empty `src` and `onError` load failures.
- **`public/assets/truckerpath/`** — Injected five local screenshots as `pipeline-overview.png`, `team-usage.png`, `action-queue.jpg`, `ai-recommendation.jpg`, and `ai-draft.jpg`.

## What decisions were made and why

- **Fixed aspect-ratio container** — `aspect-[16/10]` with `Image fill` prevents layout shift during constraint transitions and while Framer Motion crossfades run.
- **Inner AnimatePresence for images** — Nested inside the outer architecture-mode `AnimatePresence` so constraint clicks crossfade screenshots independently of the x-ray overlay toggle.
- **Explicit load fallbacks** — Empty `src` or `onError` renders a dashed `VisualImageFallback` with `role="img"` instead of crashing `next/image` or swallowing errors.
- **Five-step narrative arc** — Constraints trace the visual proof from pipeline visibility through team activity volume down to AI-generated Sumter Hauling outreach.
- **Legacy diagram node** — Kept unreferenced to satisfy existing schema test fixture without modifying `forensic.test.ts`.
- **Browser QA deferred** — `app/page.tsx` off limits; verification satisfied by 23 passing unit tests, production build, and HTTP 200 asset serving.

## What was explicitly left out and why

- **`app/page.tsx`**, **`app/globals.css`**, **`tailwind.config.ts`** — Off limits per prompt; canvas not mounted in app shell (future task).
- **Source screenshots in `public/` root** — Left as originals; only normalized copies under `public/assets/truckerpath/` were committed.
- **New component tests for `next/image`** — Existing `ForensicCanvas.test.tsx` suite continued to pass without modification; file was out of scope.

## What is broken or incomplete

- `ForensicCanvas` with injected assets is implemented but not wired into the home page.
- Manual browser verification of image crossfades and architecture-mode toggle pending `page.tsx` mount.

## What the next session should do first

- Mount `ForensicCanvas` with `truckerPathPayload` in `app/page.tsx`.
- Manually verify pipeline-overview loads without layout shift, constraint clicks crossfade through all five screenshots, and Spacebar toggles architecture overlay.
- Consider removing duplicate source screenshots from `public/` root once asset paths are confirmed in browser.
