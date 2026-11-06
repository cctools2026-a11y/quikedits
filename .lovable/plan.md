# Plan: a striking, consistent look for every page

Today every page is the same: a big heading, a dashed upload box and text sections. It works, but nothing shows what the tool actually does, and the pages feel alike. The goal is for each page to show the result before anyone uploads, while keeping the warm off-white and orange look and the current fonts.

## Visual direction: "the cut-out"
One idea runs through the whole site: things that were cut out and placed on top. That means:
- Soft paper-like background with a very faint grid, like a cutting mat.
- Cards with a crisp edge and a soft shadow, so they look like they were lifted off the page.
- The see-through checkerboard used as a design element (behind results, in badges, at the hero's edges).
- Orange kept for actions and highlights only, so download and upload buttons always stand out.
- Gentle motion: things slide and settle into place as you scroll; nothing flashy, and reduced for people who prefer less motion.

## Shared page layout (all 8 tools)
1. **Hero, two columns**: on the left a short heading, one-line promise, and the upload box. On the right a live "before / after" example you can drag, using a sample photo made for that tool (e.g. a sneaker on white for Product photos, a headshot in a circle for Profile picture). On phones the example sits below the upload box.
2. **"Try a sample" chips** under the upload box: tap a sample photo to see the tool work without using your own.
3. **Trust strip**: three small badges: "Free forever", "Never uploaded", "No sign-up".
4. **How it works** as a visual 3-step strip with small illustrations, linked by a dotted cutting line.
5. **Great for** as a picture grid (small photos per use case) instead of plain chips.
6. **Tips** shown as "Good photo / Avoid" side-by-side example thumbnails.
7. **Questions** in a cleaner two-column layout on desktop.
8. **More tools** as a gallery of cards, each with its own little preview picture, with a "Try next" tool first.
9. **Result screen**: larger preview on a bigger checkerboard, settings in a tidy panel on the side, a big download button that stays visible while scrolling on phones.

## Page by page: what makes each one different
| Page | Hero example | Accent touch |
|---|---|---|
| Home / Remove background | A pet that slides out of its background as you drag | A grid of all tools right under the hero |
| Colour background | The same portrait on a row of colours that changes on its own | Colour swatches as part of the design |
| Product photos | A trainer, a mug and a bag on clean white, laid out like a shop | Marketplace size labels (Amazon, Etsy) |
| Passport photo | A printed 6×4 sheet with a ruler and size marks | Small country flags for the size picker |
| Profile picture | Three circular headshots on different colours | A mock LinkedIn card preview |
| Sticker maker | Stickers scattered at angles with white outlines | A chat bubble showing the sticker in use |
| Photo background | A person on a beach, a city and space, side by side | A "drag me" hint on the cut-out |
| Logo & signature | A signature lifted off paper onto a document | A paper texture to the left, transparent to the right |

## Header and footer
- The header stays as it is now, with a slight blur when scrolling and a small "Free" badge by the logo.
- Footer: tools in columns by group, plus a short "Made to run on your device" note and the license links.

## What I need from you
- I'll create the sample and example photos with AI (people, pets, products). Say if you'd rather supply your own photos.
- Any brand colour beyond the current orange? If not, I'll keep it.

## Technical details
- New design tokens in `src/styles.css`: `--shadow-lift`, `--shadow-float`, a cutting-mat background pattern, checkerboard variants, motion durations; all colours in oklch, dark-mode values included.
- Shared components: `ToolHero` (two-column hero with the `CompareSlider` example), `SampleChips` (loads a bundled sample into the existing upload flow), `TrustStrip`, `StepStrip`, `UseCaseGrid`, `ToolCardGallery`. `ToolLanding` and `ToolPage` are rebuilt on these, so every tool picks them up.
- Per-tool hero images and use-case thumbnails generated as small optimised JPGs and PNG cut-outs in `src/assets/tools/<tool>/`, referenced from `tool-content.ts`.
- Sample photos run through the normal on-device flow, so they show real results.
- Scroll motion with CSS and IntersectionObserver only, respecting `prefers-reduced-motion`; no new animation library.
- Images lazy-load below the hero to keep pages fast; page titles and text stay as they are for search.
- Check with Playwright at phone and desktop sizes for every page.
