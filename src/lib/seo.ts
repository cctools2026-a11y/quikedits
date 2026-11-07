import { TOOL_CONTENT } from "@/lib/tool-content";
import { TOOL_CONTENT_PT } from "@/lib/tool-content.pt";
import { TOOL_CONTENT_ES } from "@/lib/tool-content.es";
import { subtool } from "@/lib/tools";
import { alternates, LOCALE_INFO, LOCALES, localePath, SITE_URL, type Locale } from "@/lib/i18n";

export { SITE_URL };
export const SITE_NAME = "QuikEdits";

export const contentFor = (locale: Locale) => ({ en: TOOL_CONTENT, pt: TOOL_CONTENT_PT, es: TOOL_CONTENT_ES })[locale];

/** hreflang alternates (every language + x-default) and a self-referencing canonical. */
export function langLinks(path: string, locale: Locale) {
  return [
    { rel: "canonical", href: `${SITE_URL}${localePath(path, locale)}` },
    ...alternates(path).map((a) => ({ rel: "alternate", hrefLang: a.hreflang, href: a.href })),
  ];
}

function ogLocales(locale: Locale) {
  return [
    { property: "og:locale", content: LOCALE_INFO[locale].ogLocale },
    ...LOCALES.filter((l) => l !== locale).map((l) => ({ property: "og:locale:alternate", content: LOCALE_INFO[l].ogLocale })),
  ];
}

export function toolHead(path: string, locale: Locale = "en") {
  const c = contentFor(locale)[path]!;
  const url = `${SITE_URL}${localePath(path, locale)}`;
  const slug = path === "/" ? "home" : path.slice(1);
  const image = `${SITE_URL}/og/${locale === "en" ? "" : `${locale}/`}${slug}.jpg`;
  const lang = LOCALE_INFO[locale].hreflang;
  const home = `${SITE_URL}${localePath("/", locale)}`;
  const app = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: c.name,
    url,
    image,
    inLanguage: lang,
    description: c.description,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any (web browser)",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };
  const sub = subtool(path);
  const parent = sub && contentFor(locale)[sub.parent];
  const crumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: SITE_NAME, item: home },
      ...(path === "/" ? [] : sub && parent
        ? [{ "@type": "ListItem", position: 2, name: parent.name, item: `${SITE_URL}${localePath(sub.parent, locale)}` }, { "@type": "ListItem", position: 3, name: c.name, item: url }]
        : [{ "@type": "ListItem", position: 2, name: c.name, item: url }]),
    ],
  };
  const site = { "@context": "https://schema.org", "@type": "WebSite", name: SITE_NAME, url: home, inLanguage: lang };
  return {
    meta: [
      { title: c.title },
      { name: "description", content: c.description },
      { property: "og:title", content: c.ogTitle },
      { property: "og:description", content: c.ogDescription },
      { property: "og:url", content: url },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: SITE_NAME },
      ...ogLocales(locale),
      { property: "og:image", content: image },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: c.ogTitle },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: c.ogTitle },
      { name: "twitter:description", content: c.ogDescription },
      { name: "twitter:image", content: image },
      { name: "twitter:image:alt", content: c.ogTitle },
    ],
    links: langLinks(path, locale),
    scripts: [app, crumbs, ...(path === "/" ? [site] : [])].map((j) => ({ type: "application/ld+json", children: JSON.stringify(j) })),
  };
}

const LICENSE_META: Record<Locale, { title: string; description: string; og: string }> = {
  en: { title: "License & Source Code — QuikEdits", description: "QuikEdits is free software under the GNU AGPL-3.0. Attribution, licensing and source code.", og: "AGPL-3.0 licensing, IMG.LY attribution and full source code for QuikEdits." },
  es: { title: "Licencia y código fuente — QuikEdits", description: "QuikEdits es software libre bajo la GNU AGPL-3.0. Atribución, licencia y código fuente.", og: "Licencia AGPL-3.0, atribución a IMG.LY y el código fuente completo de QuikEdits." },
  pt: { title: "Licença e Código-Fonte — QuikEdits", description: "O QuikEdits é software livre sob a GNU AGPL-3.0. Atribuição, licença e código-fonte.", og: "Licença AGPL-3.0, atribuição à IMG.LY e o código-fonte completo do QuikEdits." },
};

export function licenseHead(locale: Locale) {
  const m = LICENSE_META[locale];
  return {
    meta: [
      { title: m.title },
      { name: "description", content: m.description },
      { property: "og:title", content: m.title },
      { property: "og:description", content: m.og },
      { property: "og:url", content: `${SITE_URL}${localePath("/license", locale)}` },
      { property: "og:type", content: "website" },
      ...ogLocales(locale),
      { name: "twitter:card", content: "summary" },
    ],
    links: langLinks("/license", locale),
  };
}
