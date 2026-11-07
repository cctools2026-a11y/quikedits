# Spanish version of QuikEdits (/es/)

## Goal
Every English page (home, 8 tools, 40 sub-tools, license) gets a Spanish twin under `/es/`, written for real Spanish searches worldwide. Same structure as `/pt/`, ready for country folders later (`/es/es/` Spain, `/es/mx/` Mexico, and more).

## One honest note
No website can stop a page from showing outside a country. Country folders tell Google "this is the best version for Spanish speakers in Mexico" (`es-MX`), so Mexicans see `/es/mx/`, Spaniards see `/es/es/`, and everyone else searching in Spanish keeps seeing `/es/`. That is the strongest signal available.

## What visitors will see
- The header language switch becomes EN / PT / ES, jumping to the same page in the chosen language.
- The whole page in Spanish: menu, banner, upload area, tips, buttons, steps, FAQs, footer, "How is this free?", error messages, licence page.
- Spanish share images so WhatsApp/Facebook previews look native.
- No automatic redirects. The existing dismissible language suggestion also offers "¿Ver en español?" for Spanish browsers.

## Web addresses
Natural Spanish slugs, because people search with those words:
```text
/remove-background      ->  /es/                       (home)
/passport-photo         ->  /es/foto-para-pasaporte
/white-background       ->  /es/fondo-blanco
/whatsapp-sticker       ->  /es/sticker-whatsapp
/transparent-signature  ->  /es/firma-transparente
... one mapping per page, 49 in total
```
Later: `/es/mx/foto-para-pasaporte` etc. reuse the same slugs.

## Writing the Spanish copy
- Neutral international Spanish for `/es/` (tú form, no vosotros, avoid words only used in Spain or only in Latin America; e.g. "foto", "celular/móvil" avoided in favour of "teléfono").
- Same rules as English: plain, friendly, no keyword stuffing.
- Titles/descriptions based on how people actually search in Spanish ("quitar fondo de imagen", "foto para pasaporte", "sticker para WhatsApp"), not word-for-word translation.
- Country-specific sizes (e.g. Mexican passport, Spanish DNI) saved for the later country folders.

## SEO checklist (every page)
1. `<html lang="es">` on Spanish pages.
2. Self-referencing canonical on each page.
3. hreflang on every page in all three languages, all pointing to each other: `en`, `pt`, `es`, `x-default` -> English. Later add `es-ES`, `es-MX` etc. while `es` stays the worldwide fallback.
4. Sitemap regenerated with `es` alternates for every URL.
5. Translated title, description, og:title, og:description; `og:locale: es_LA` with `en_US` / `pt_BR` alternates.
6. Structured data in Spanish (`inLanguage: "es"`, Spanish breadcrumbs and FAQ).
7. Internal links stay within Spanish: menus, related tools, breadcrumbs, sub-tool links.
8. All Spanish pages prerendered as static HTML.
9. Alt text and download file names translated.
10. English and Portuguese pages unchanged apart from gaining the `es` hreflang link.
11. After publish: resubmit the sitemap in Google Search Console.

## Rollout
1. Foundations: Spanish page mapping, interface text, language switch, head/hreflang/sitemap, home page.
2. 8 main tools in Spanish.
3. 40 sub-tools + licence page, Spanish share images.
4. Checks: existing Portuguese tests extended to Spanish — every `/es/` page loads Spanish content, hreflang pairs are reciprocal, browser test finds no English on Spanish pages, missing translations fall back to English safely.
5. Later (separate task): `/es/es/`, `/es/mx/` country folders.

## Technical details
- `src/lib/i18n.ts`: add `es` to `Locale`/`LOCALES`/locale meta, an `es` slug per page, and generalise path helpers (`localePath`, `localeOf`, `englishPath`) from hard-coded `/pt` to prefixes from locale meta; hreflang alternates list all locales.
- UI strings: `src/lib/strings/es.ts` keyed by English, same as `pt.ts`; `useT()` picks dictionary by locale.
- Content: `tool-content.es.ts`, `hero.es.ts`, plus Spanish entries wherever PT-specific data exists (presets, sizes, licence text).
- Routes: 49 thin `es.*.tsx` wrappers mirroring the `pt.*.tsx` ones.
- `seo.ts`, `__root.tsx`, `SiteHeader` switch, `LanguageHint` updated for three locales; prerender and `scripts/sitemap.ts` pick up `es` automatically via `ALL_PATHS`.
- OG images: `public/og/es/*.jpg` with Spanish headlines.
- Tests: generalise `i18n.test.ts`, `pt-routes.test.ts`, `pt-pages.browser.test.ts` to run per non-English locale.
- AGENTS.md: update the languages rule to cover any locale (not just pt).
