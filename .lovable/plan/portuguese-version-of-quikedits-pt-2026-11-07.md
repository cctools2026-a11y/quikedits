# Portuguese version of QuikEdits (/pt/)

## Goal
Every English page (home, 8 tools, 40 sub-tools, license) gets a Portuguese twin under `/pt/`, written for real Portuguese searches worldwide. The structure is ready for country folders later (`/pt/br/`, and optionally `/pt/pt/`).

## One honest correction first
No website can stop a page from showing outside a country. What `/pt/br/` will do is tell Google "this is the best version for Portuguese speakers in Brazil", so Brazilians see `/pt/br/` and everyone else who searches in Portuguese keeps seeing `/pt/`. That is the strongest signal available, and this plan sets it up correctly.

## What visitors will see
- A language switch in the header (EN / PT) that jumps to the same page in the other language.
- The whole page in Portuguese: menu, banner, upload area, tips, buttons, steps, FAQs, footer, "How is this free?", error messages.
- Portuguese share images (headline text translated) so WhatsApp/Facebook previews look native.
- No automatic redirects based on location or browser language (Google warns against this; it can hide pages from its crawler). A small, dismissible "Ver em português?" suggestion appears instead for Portuguese browsers on English pages.

## Web addresses
Translated, natural Portuguese slugs, because people search with those words:
```text
/remove-background          ->  /pt/                         (home)
/passport-photo             ->  /pt/foto-para-passaporte
/white-background           ->  /pt/fundo-branco
/whatsapp-sticker           ->  /pt/figurinha-whatsapp
/transparent-signature      ->  /pt/assinatura-transparente
... one mapping per page, 50 in total
```
Later: `/pt/br/foto-para-passaporte` etc. reuse the same slugs.

## Writing the Portuguese copy
- Neutral international Portuguese for `/pt/` (avoid words that only work in Brazil or only in Portugal, e.g. prefer "foto" + neutral phrasing; where unavoidable, Brazilian forms, since most searches worldwide are Brazilian).
- Same rules as English: plain, friendly, no keyword stuffing.
- Each title/description written from how people actually search in Portuguese (checked against keyword data, e.g. "remover fundo de imagem", "foto 3x4", "figurinha whatsapp"), not word-for-word translation.
- Country-specific pages get local relevance: e.g. Brazilian passport/RG 3x4 and 5x7 sizes can be added with `/pt/br/` later; US/UK passport pages stay but are translated.

## SEO checklist (applied to every page)
1. `<html lang="pt">` on Portuguese pages, `lang="en"` on English.
2. Self-referencing canonical on each page (never pointing PT to EN).
3. hreflang links on every page, both directions, all versions listing each other:
   - `en` -> English page, `pt` -> /pt/ page, `x-default` -> English page.
   - Later add `pt-BR` -> /pt/br/ page (and keep `pt` as the worldwide fallback).
4. Sitemap lists every URL with matching `xhtml:link` hreflang entries; a separate sitemap index keeps EN and PT sitemaps tidy.
5. Translated title, description, og:title, og:description, `og:locale = pt_BR`-free neutral `pt_PT`? -> use `og:locale: pt_BR` plus `og:locale:alternate: en_US` (Facebook only accepts country forms; BR is the widest audience).
6. Structured data in Portuguese: WebApplication (`inLanguage: "pt"`), BreadcrumbList with Portuguese names and /pt/ URLs, FAQ text translated.
7. Internal links stay within the language: menus, related tools, breadcrumbs and "More specific jobs" on PT pages link only to PT pages.
8. All pages prerendered as static HTML, like today, so crawlers see full Portuguese text.
9. Image alt text and file names for downloads translated (e.g. `foto-passaporte.png`).
10. robots.txt unchanged; English pages untouched, so current rankings are safe.
11. After publish: submit the new sitemap in Google Search Console (no country targeting set on the domain).

## Rollout
1. Language foundations: page mapping, translated interface text, language switch, hreflang/sitemap/head setup, home page in PT.
2. 8 main tools in PT.
3. 40 sub-tools + license page in PT, share images.
4. Checks: every page renders in PT, every hreflang pair points back, no English left on PT pages, sitemap valid.
5. Later (separate task): `/pt/br/` folder with Brazil-specific wording and sizes, adding `pt-BR` hreflang.

## Technical details
- `src/lib/i18n.ts`: `Locale` type (`en` | `pt`, extendable to `pt-BR`), `LOCALES`, `PAGE_SLUGS` map (English path -> per-locale slug), `localePath(path, locale)` and `alternates(path)`; unit-tested (every page has a PT slug, slugs unique, round-trips).
- UI strings: `src/lib/strings/en.ts` and `pt.ts` (typed so a missing PT key fails the build); `useT()` reads locale from the route.
- Content: `tool-content.ts` becomes per-locale (`TOOL_CONTENT.en`, `TOOL_CONTENT.pt`), same shape; tools.ts labels/blurbs localised.
- Routes: `src/routes/pt/*.tsx` thin files rendering the same tool components with `locale="pt"`; one implementation per tool kept.
- `toolHead(path, locale)` in seo.ts emits localised meta, canonical, hreflang `links` (`rel="alternate" hrefLang=...`), and JSON-LD with `inLanguage`.
- `__root.tsx` sets `lang` from the matched route.
- vite.config.ts prerender list generated from `PAGE_SLUGS` for both locales; sitemap generated from the same source to avoid drift.
- OG images: `public/og/pt/*.jpg` regenerated with Portuguese headlines.
- AGENTS.md rule: all locale paths and hreflang come from i18n.ts.
