# Switch to "Poster punch" fonts

- Page titles and section headings: **Bebas Neue** — tall, bold poster letters.
- Body text, buttons, menus, tips: **Barlow** — clean and easy to read.

## What changes
- Load both fonts in the site head.
- Set Barlow as the main text font and Bebas Neue as the heading font across every page.
- Retune the dramatic page title sizing (Bebas is narrower and taller) so titles stay big on desktop and never overflow on small phones.
- Keep the menu, buttons and small labels in Barlow for readability.
- Save the font choice to project memory.
- Check every page at desktop and phone widths.

## Technical details
- Google Fonts `<link>` in `src/routes/__root.tsx`; `--font-sans` / `--font-display` tokens in `src/styles.css`; adjust `.page-title` letter-spacing/size.
