# Background Removal Scenarios and Tool Roadmap

The site has two tools today: **Remove background** (transparent PNG) and **Colour background** (solid colour). Below are the main reasons people remove photo backgrounds, grouped by who they are, with the tool or page each one suggests. Everything still runs free on the visitor's own device.

## 1. Online sellers (eBay, Etsy, Amazon, Shopify, Facebook Marketplace)
- Product photos on pure white, which Amazon and eBay often require.
- Consistent backgrounds across a whole catalogue.
- Square crops with even padding around the product.
- **Suggested tool:** "Product photo maker": white background, auto-centre, square or marketplace sizes, batch of several images.

## 2. ID, passport and visa photos
- Plain white or light grey background, fixed size (e.g. 35x45 mm, 2x2 in), head centred.
- **Suggested tool:** "Passport photo" preset: country sizes, white/grey background, a printable sheet of copies.

## 3. Professional profiles (LinkedIn, CVs, company websites, ID badges)
- Clean headshot on a brand or neutral colour.
- Matching team photos on one background colour.
- **Suggested tool:** "Profile picture maker": colour background (existing tool), circle/square crop, LinkedIn size.

## 4. Social media and creators
- Profile pictures, YouTube thumbnails, stickers (WhatsApp, Telegram), memes, Instagram posts.
- Cutouts to place onto other images.
- **Suggested tools:** "Sticker maker" (cutout + white outline, WhatsApp sticker size), "Add photo background" (place the cutout on another uploaded photo; image only, not gradients).

## 5. Design and marketing
- Cutouts for flyers, posters, presentations, ads, menus and websites.
- Logos and signatures with the background removed.
- **Suggested tool:** "Logo/signature cleaner": tuned for flat graphics and handwriting on paper.

## 6. Personal and fun
- Pet photos, family portraits, greeting cards, collages, swapping holiday backdrops.
- **Covered by:** existing tools plus "Add photo background".

## 7. Real estate, cars and classifieds
- Cars on a clean backdrop for listings; furniture for resale.
- **Covered by:** Product photo maker.

## 8. Education and work documents
- Diagrams, objects or people for school projects, reports and slides.
- **Covered by:** existing transparent PNG tool.

## Suggested build order
1. Product photo maker (largest audience, white background + sizing).
2. Passport/ID photo (high search demand, clear rules).
3. Profile picture maker (mostly reuses Colour background).
4. Sticker maker.
5. Add photo background.
6. Logo/signature cleaner.
7. Batch processing for several images at once (helps sellers).

Each tool gets its own page with its own search title and description, linked from the top menu, so people searching for that specific need find the site.

## Technical details
- Each tool is a new prerendered route, added to the `pages` list in vite.config.ts.
- Share one removal helper (dynamic `@imgly/background-removal` import, self-hosted model) and one compositing helper (edge refinement, solid colour, image backdrop, padding, outline).
- Passport sizes and marketplace sizes kept as data tables with unit tests for the dimensions.
- Logo/signature cleaner can use simple colour thresholding instead of the AI model, which is faster and gives sharper edges for flat graphics.
- Batch mode processes images one at a time to avoid running out of memory on phones.
