# Photo tips that open without shifting the banner

Right now, opening "Photo tips" adds text inside the banner. That pushes the upload box and the example photo around while it opens.

## New style
- "Photo tips" becomes a small link-style button under the upload box. It takes up the same space whether it's open or closed.
- Tapping or hovering it opens a floating card over the page (on desktop). The card has a short headline and two lists, "Works well" and "Avoid", and fades and slides in smoothly. Nothing on the page moves.
- On phones, the same tips slide up from the bottom of the screen in a panel, which is easier to read and close with one thumb.
- Close the card with the X button, by tapping outside it, or by pressing Esc.
- Styling matches the site: rounded white card, soft shadow, orange ticks, and a subtle grid pattern like the rest of the site's cards.

## Technical details
- Rewrite `PhotoTips.tsx`: desktop uses the shadcn Popover (side="bottom", align="start", max-w-md); on phone widths (useIsMobile) it uses a Drawer/Sheet from the bottom. Keep the PHOTO_RULES content. Keep the trigger accessible with aria-label and keyboard support.
- Check with Playwright at 1280px and 390px: measure the banner's height before and after opening and confirm it doesn't change.
