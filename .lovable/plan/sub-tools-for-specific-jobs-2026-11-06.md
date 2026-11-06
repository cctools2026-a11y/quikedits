# Sub-tools for specific jobs

Each current tool becomes a "parent" with focused sub-tools. A sub-tool is a landing page with the right defaults already set: size, colour, outline and file name. That way the user only does one thing, which is upload. Everything stays free and works on the device, with no new AI services.

## 1. Remove background
- **Transparent PNG for slides**: trims tightly and exports at slide-friendly sizes.
- **Remove background from a screenshot or graphic**: uses the clean-edge (no AI) path for flat images.
- **Batch remove backgrounds**: several photos at once, downloaded as a ZIP.
- **Cut out a pet**: tips and edge settings tuned for fur.
- **Cut out hair cleanly**: softer edges plus the touch-up brush opens straight away.

## 2. Colour background
- **White background photo**: pure white, nothing to pick.
- **Black background photo**: high-contrast portrait or product shot.
- **Brand colour background**: paste a hex code and it's remembered on the device.
- **Gradient background**: two-colour gradients, presets only.

## 3. Photo background
- **Zoom / Teams virtual background**: 1920x1080 export with the person placed correctly.
- **Put me on a holiday background**: the beach, city and mountain presets.
- **Birthday or party photo**: confetti and balloon presets.
- **Blur the background**: keeps the original scene but blurs it, for a portrait look.

## 4. Product photos
- **Amazon product photo**: 2000x2000, pure white, product fills 85% of the frame.
- **eBay / Etsy listing photo**: each marketplace's size and margin rules.
- **Shopify product images**: square, consistent padding across a batch.
- **Product shadow**: adds a soft shadow under the product on white.
- **Depop / Vinted clothing photo**: flat-lay, square, plain light background.

## 5. Passport photo
One page per document, each with the correct size, head height and background colour:
- **US passport (2x2 in)**, **UK passport (35x45 mm)**, **India passport (51x51 mm)**, **Australia passport (35x45 mm)**, **Schengen visa (35x45 mm)**.
- **Driving licence / ID card photo**: generic 35x45 mm.
- **Print sheet at home**: 4x6 in sheet with several copies to cut out.

## 6. Profile picture
- **LinkedIn profile photo**: 400x400, circle preview, neutral colours.
- **CV / resume photo**: passport-style framing, white or light grey.
- **Instagram / TikTok profile picture**: circle crop, bold colours.
- **Discord / gaming avatar**: circle with an outline ring.
- **Team headshots**: batch with the same background and framing for a website "About us" page.

## 7. Sticker maker
- **WhatsApp sticker**: 512x512 WebP under 100 KB, with a white outline.
- **Telegram sticker**: 512 px on the longest side, PNG or WebP.
- **Printable sticker sheet**: several stickers on A4 or Letter with cut lines.
- **Pet sticker**: outline plus a playful drop shadow.
- **Emoji / Slack emoji**: 128x128, trimmed tight.

## 8. Logo & signature
- **Transparent signature for documents**: removes paper texture and outputs dark ink.
- **Signature for email**: small PNG at the right width for an email signature.
- **Logo to transparent PNG**: removes a white or flat background.
- **Recolour logo**: makes it all-white or all-black for dark or light backgrounds.
- **Stamp / seal cleaner**: keeps red or blue ink only.

## Rollout order
1. Highest search demand, almost no new code (just presets): white background, Amazon product photo, US, UK and India passport, LinkedIn photo, WhatsApp sticker, transparent signature.
2. Small new features: Zoom background, blur background, product shadow, gradient, recolour logo.
3. Larger features: batch ZIP, printable sticker sheet, team headshots, stamp cleaner.

## Menu and navigation
- The Tools menu still shows the 8 parent tools. Each one gets a "Popular jobs" list of 3 or 4 sub-tools under it.
- Each parent page gets a "More specific jobs" row of cards linking to its sub-tools.
- Each sub-tool page shows a small trail back to its parent (for example: Passport photo > UK passport).

## Technical details
- Add a `SUBTOOLS` registry (in `src/lib/tools.ts`) with each sub-tool's parent, path, label, job, and a `preset` object (size, colour, outline, crop shape, export format, file name).
- Parent tool route components take an optional `preset` prop. Sub-tool routes are thin wrappers, for example `src/routes/passport-photo.uk.tsx`, which render the parent with that preset.
- Landing copy, FAQs and search details for each sub-tool go in `tool-content.ts`. Each sub-tool also gets `toolHead()`, a sitemap entry, a prerender entry in `vite.config.ts`, and its own sharing image.
- Size and margin rules are pure functions with unit tests (for example, the product fills 85% of the frame, and passport head heights).
- New exports (WebP under 100 KB, ZIP, print sheets) stay in the browser. Only small libraries are needed, such as fflate for ZIP.
