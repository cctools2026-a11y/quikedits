# Free In-Browser Background Remover

A single-page tool where all processing happens on the visitor's device using `@imgly/background-removal`. No backend, database, auth, storage, serverless functions or paid APIs, so there are no per-image costs.

## Features
- Large drag-and-drop / click upload zone (JPG, PNG, WebP; size limit with friendly error for unsupported or oversized files).
- Automatic background removal with staged progress: "Downloading AI model (first time only)" with percent bar, then "Removing background".
- Draggable before/after slider (mouse, touch, keyboard) over a checkerboard so transparency is visible.
- Prominent "Download transparent PNG" button and "New image" reset.
- Graceful handling for slow devices: large images downscaled before processing (max ~2048px long edge), an option to use the smaller/faster model, elapsed-time notice ("this can take up to a minute on older devices"), and a clear retry on failure or out-of-memory.
- Model cached in the browser after first load (library uses the browser cache; a note tells users repeat visits are faster).

## Licensing and attribution (AGPL-3.0)
- Footer and a dedicated "/license" page: states the app uses `@imgly/background-removal` (AGPL-3.0, by IMG.LY) and that this whole app is therefore offered under AGPL-3.0.
- "Source code" link to the public repository, plus a `LICENSE` file (full AGPL-3.0 text) in the project.
- Note that the model weights are fetched from IMG.LY's free public CDN by default; option to self-host them in the static site to remove that dependency.

## Static hosting on Cloudflare Pages
- Configure the app for static prerendered output (no server runtime), so the built folder deploys to Cloudflare Pages free tier.
- Include short deploy instructions (build command, output folder) on the license/about page or README.

## Open item
- AGPL requires a working link to the source. I'll use a placeholder repository link until you give me your public repo URL (e.g. from connecting GitHub).

## Technical details
- `bun add @imgly/background-removal`; dynamic import inside the processing handler only (browser-only library, keeps prerender safe).
- Progress via `progress(key, current, total)`: `fetch:*` → download, `compute:*` → inference.
- Canvas downscale helper, file validation helper (with unit tests for accepted types/size limit).
- Routes: `/` (tool), `/license` (AGPL notice, attribution, source link); each with its own head() metadata.
- Vite/TanStack Start static prerender/SPA mode; verify the build emits static files with no worker dependency.
- Distinct minimal design: warm off-white, near-black ink, one vivid accent; Space Grotesk + DM Sans via root head links; tokens in styles.css.
