# Private workspace behind a mystery game landing page

## What visitors will see
- quikedits.com shows only a small, strange browser game. Players get "edit jobs" from worlds far from design, like re-seasoning soup, trimming a hedge into a shape, or editing a bird's song. Each job is a quick tap or drag challenge with a score and a silly result.
- There's no menu, no tool links and no mention of the photo tools. A tiny, unlabeled sign-in link sits in the footer.
- The old tool links (/sticker-maker, /pt/..., /es/..., and so on) go to the game, so nothing leaks.

## What only you can see
- Every tool, sub-tool and language version moves under **/workspace** (for example /workspace/sticker-maker, /workspace/pt/..., /workspace/es/...).
- Sign-in: you enter your email, and a 6-digit code is emailed to you every time. Only Contact@sashagusain.com is accepted. Any other email gets the same neutral "check your inbox" message, but no code is sent.
- A Sign out button inside the workspace.

## Hiding from Google
- Every workspace page and the sign-in page are marked "do not index", and robots.txt blocks /workspace.
- The sitemap only lists the landing page. The language alternates for tool pages and their share previews are removed from public pages.
- The plan to connect Google Search Console is dropped for now.

## Trade-offs
- The site stops being a pure static site. Sign-in needs Lovable Cloud, and the workspace pages are served on request instead of being prebuilt. Your photos are still processed only on your device.
- Sign-in codes come from Lovable's default sender until an email domain such as quikedits.com is set up for sending. That's optional and can be done later.
- The README and AGENTS rules about "no backend" and "all pages prerendered" will be updated to match.

## Technical details
- Enable Lovable Cloud, turn on email sign-in, and switch the sign-in email to a one-time code (signInWithOtp + verifyOtp, with shouldCreateUser limited to the owner). A server-side allowlist check runs before sending the code, and a server function confirms the owner email on every workspace load.
- Move the route files to `src/routes/_authenticated/workspace.*`, keeping the thin locale wrappers. Prefix `workspace` in i18n.ts paths, TOOLS/SUBTOOLS `to`, links and canonicals. Keep `ssr: false` for the gated tree.
- Add catch-all redirects from old paths to `/`. The prerender list becomes `/` plus the sign-in page.
- The game lives in `src/routes/index.tsx` plus `src/components/game/*`, uses the existing palette and fonts, and runs entirely in the browser.
- Update robots.txt, regenerate the sitemap from `scripts/sitemap.ts`, and update i18n and route tests for the new paths. Add a test that only the owner email is allowed.
- Add the new tasks to roadmap.md and update the memory for Portuguese SEO (now paused).
