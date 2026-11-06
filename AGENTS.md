<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules
- All image processing runs client-side via @imgly/background-removal, dynamically imported in handlers; no backend/database/serverless — keeps it free and static.
- Every page is prerendered (vite.config.ts `pages`); add new static routes there so Cloudflare Pages can serve them.
- App is AGPL-3.0 (LICENSE); keep the footer/license page attribution and source link (src/lib/site.ts) intact.
- AI model/runtime files are self-hosted in public/imgly (publicPath in src/routes/index.tsx), copied from IMG.LY's data CDN for the installed package version and SHA-256 verified; re-download them when upgrading @imgly/background-removal.
- Don't override zod to v4: @imgly/background-removal and TanStack depend on the v3 API.
- Tool pages share src/components/ToolPage.tsx (upload, progress, errors) and src/lib/compose.ts (edge refinement, compositing); new tools should reuse them and register in src/lib/tools.ts so they appear in the header and home page.
- Pre-processing crop/rotate lives in src/components/CropRotate.tsx, enabled per tool via ToolPage `crop` prop (list of crop shapes); math in src/lib/crop.ts is unit-tested.
