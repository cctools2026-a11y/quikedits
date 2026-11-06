# Plan: make every tool page work well in search

The site has 8 tools, each on its own page. Each page already has a title and description, but almost none of the page itself is readable text below the upload box, and nothing links the pages together except the menu. Search engines (and visitors) need more to go on: what the tool does, who it's for, how to use it, and where to go next.

## Writing style for every page
- Plain words, short sentences, talking to "you". Readable for a 12-year-old or a non-native English speaker.
- Lead with the result someone wants ("A passport photo you can print at home"), not the technology.
- Mention the search phrase naturally once or twice (title, heading, one sentence). No keyword lists, no repeated phrases.
- Be honest about limits (e.g. "check your country's official rules", "very fine hair may look rough").

## What each tool page gets (below the upload box, shown before upload)
1. **Clear heading and one-line promise** (kept short, already there; tidied so each page has exactly one main heading).
2. **"How it works" in 3 steps** with small icons: Upload, Adjust, Download. Wording specific to each tool.
3. **"Great for" list**: 4 to 6 real situations, e.g. Product photos: "eBay and Amazon listings", "Etsy shop", "Facebook Marketplace".
4. **"Why it's free and private"**: one short shared block (photos never leave your device, no sign-up, no watermark), linking to the longer explanation on the home page.
5. **Tips for best results**: 3 to 4 practical tips (good light, plain background, face the camera).
6. **Common questions**: 4 to 5 short questions and answers per tool (Is it really free? What sizes? Can I use it on my phone? Is my photo uploaded?). These show as an expandable list.
7. **"More free tools"**: cards for the other 7 tools, each with a one-line plain description, so visitors see everything the app can do. A "Most useful next" pick appears first (e.g. Passport points to Profile picture).

## Home page
- Keep the remover and "How is this actually free?" section.
- Add a clear "Pick the tool for your job" grid near the top with all 8 tools described by the task ("I need a photo for my passport"), not by feature.
- Add the same "Great for", tips and questions sections.

## Behind-the-scenes search basics (all pages)
- Unique title (under 60 characters) and description (under 155 characters) per page, written for people, plus matching share titles.
- A canonical address and share address for each page on quikedits.com.
- Structured data so Google understands each page: the site, each tool as a free web app, and breadcrumbs.
- A sitemap listing all 9 pages, referenced from robots.txt.
- A share image (1200 x 630) for link previews, one per tool if approved (I'd create them; ask before generating).
- Check headings are in order, all images have descriptions, and links have meaningful text.
- Footer gets a simple list of all tools as well.

## One thing to confirm
The site name shown in titles and the logo is "Cutout", but the address is quikedits.com. For search and trust these should match. Unless you say otherwise I'll switch the name to **QuikEdits** everywhere.

## Technical details
- New `src/lib/tool-content.ts`: per-tool data (steps, great-for, tips, FAQs, related tool), keyed by route, alongside `TOOLS` in `src/lib/tools.ts` (add short task-style descriptions there).
- New `src/components/ToolLanding.tsx`: renders the sections from that data; passed to `ToolPage` via its existing `below` prop so it only shows in the idle state. FAQs use native `<details>` (no JS, prerendered).
- New `src/lib/seo.ts` helper `toolHead(path)` building meta, canonical (`https://quikedits.com/...`), og:url, og:type, twitter:card and JSON-LD (`WebApplication` with `offers` price 0, `BreadcrumbList`; `WebSite` + `Organization` on home). Each route's `head()` uses it.
- `public/sitemap.xml` with all 9 prerendered paths; add `Sitemap:` line to robots.txt.
- Root `__root.tsx` keeps sitewide defaults only (og:site_name, no canonical/og:image).
- Footer tool list in `SiteFooter.tsx`; header unchanged.
- Unit test: every tool in `TOOLS` has content, a unique title under 60 chars and description under 155 chars.
- No change to how tools process images.
