# Browser-based Background Remover

A single-page tool at `/` that removes image backgrounds fully in the browser using `@imgly/background-removal`. No accounts, no server uploads, no paid APIs.

## User flow
1. Large drag-and-drop / click-to-upload zone (JPG, PNG, WebP; max ~20 MB). Unsupported types or oversized files show a clear inline error.
2. On upload, processing starts automatically. A progress panel shows stages: "Downloading AI model (first time only)" with percent bar, then "Removing background".
3. Result view:
   - Draggable before/after slider (mouse, touch, keyboard arrows) comparing original vs. result.
   - Background picker: Transparent (checkerboard), White, Solid colour (colour picker + swatches), Custom image upload (cover-fit behind subject).
   - Prominent "Download PNG" button — composites chosen background + cutout on a canvas at full resolution.
   - "New image" button to reset.
4. Errors during processing (model download failure, out of memory) show a friendly message with a "Try again" action.

## Design
Minimal, polished: warm off-white canvas, near-black ink, single vivid accent (electric lime/coral), display font Space Grotesk + body DM Sans. Mobile-first: stacked layout on phones, preview + controls side-by-side on desktop.

## Licensing note
`@imgly/background-removal` is AGPL-3.0. A short footer note will state processing is local and that commercial/closed-source deployment requires AGPL compliance (publishing source) or a commercial licence from IMG.LY. I will also point this out in chat.

## Technical details
- `bun add @imgly/background-removal`. Library touches browser APIs, so import it dynamically inside the process handler (never at module scope) to keep SSR safe.
- `removeBackground(file, { progress: (key, current, total) => ... })` — map `fetch:*` keys to download progress, `compute:*` to processing.
- Object URLs for original/result, revoked on reset.
- Components: `UploadZone`, `ProgressPanel`, `CompareSlider`, `BackgroundPicker`, `src/lib/compose.ts` (canvas export) and `src/lib/validate-file.ts`.
- Unit test for file validation (accepted types, size limit).
- Design tokens in `src/styles.css`; fonts via `<link>` in root head; route `head()` with unique title/description/og tags.
