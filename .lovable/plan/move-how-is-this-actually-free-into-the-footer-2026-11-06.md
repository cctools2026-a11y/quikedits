# Move "How is this actually free?" into the footer

## What changes
- Remove the "How it's free" link from the top menu (desktop and phone).
- Remove the "How it's free" link at the bottom of each tool page's content, since it jumps to a section that's moving.
- Remove the "How is this actually free?" section from the home page.
- Add that section to the top of the footer on every page, with the same four numbered steps and the slow-connection note. On a computer the steps sit in a row of four, on a phone they stack, and the section matches the footer's look.

## Technical details
- Move `FREE_STEPS` and `HowItsFree` out of `src/routes/index.tsx` into `src/components/HowItsFree.tsx`, keeping `id="how-free"`, and render it in `SiteFooter.tsx`.
- Delete the link in `SiteHeader.tsx` (line 53) and the link in `ToolLanding.tsx` (line 88), plus any unused imports they leave behind.
- Check the home page and one tool page with Playwright at 1280px and 390px.
