// Pure locale/path helpers. No "@/" imports: vite.config.ts imports this file for prerendering.

export type Locale = "en" | "pt" | "es";
export const LOCALES: readonly Locale[] = ["en", "pt", "es"];
export const SITE_URL = "https://quikedits.com";
/** Private owner-only area: every tool page lives under this prefix. */
export const WORKSPACE = "/workspace";

/** hreflang code and URL prefix per locale. Add "pt-BR" -> "/pt/br" here later. */
export const LOCALE_INFO: Record<Locale, { hreflang: string; prefix: string; ogLocale: string; htmlLang: string }> = {
  en: { hreflang: "en", prefix: "/workspace", ogLocale: "en_US", htmlLang: "en" },
  pt: { hreflang: "pt", prefix: "/workspace/pt", ogLocale: "pt_BR", htmlLang: "pt" },
  es: { hreflang: "es", prefix: "/workspace/es", ogLocale: "es_LA", htmlLang: "es" },
};

/** Every English page path and its Portuguese slug (empty string = /pt/). */
export const PT_SLUGS = {
  "/": "",
  "/license": "licenca",
  "/colour-background": "fundo-colorido",
  "/product-photo": "foto-de-produto",
  "/passport-photo": "foto-para-passaporte",
  "/profile-picture": "foto-de-perfil",
  "/sticker-maker": "criar-figurinhas",
  "/photo-background": "trocar-fundo-da-foto",
  "/logo-cleaner": "logo-e-assinatura-sem-fundo",
  "/white-background": "fundo-branco",
  "/amazon-product-photo": "foto-de-produto-amazon",
  "/us-passport-photo": "foto-passaporte-eua",
  "/uk-passport-photo": "foto-passaporte-reino-unido",
  "/india-passport-photo": "foto-passaporte-india",
  "/linkedin-profile-photo": "foto-para-linkedin",
  "/whatsapp-sticker": "figurinha-whatsapp",
  "/transparent-signature": "assinatura-transparente",
  "/transparent-png-for-slides": "png-transparente-para-slides",
  "/remove-background-from-graphic": "remover-fundo-de-imagem-grafica",
  "/batch-remove-background": "remover-fundo-em-lote",
  "/cut-out-pet": "recortar-pet",
  "/cut-out-hair": "recortar-cabelo",
  "/black-background": "fundo-preto",
  "/brand-colour-background": "fundo-cor-da-marca",
  "/gradient-background": "fundo-degrade",
  "/virtual-background": "fundo-virtual-zoom-teams",
  "/holiday-background": "fundo-de-viagem",
  "/party-background": "fundo-de-festa",
  "/blur-background": "desfocar-fundo",
  "/ebay-etsy-product-photo": "foto-de-produto-ebay-etsy",
  "/shopify-product-photos": "fotos-de-produto-shopify",
  "/product-photo-shadow": "foto-de-produto-com-sombra",
  "/clothing-photo": "foto-de-roupa-para-vender",
  "/australia-passport-photo": "foto-passaporte-australia",
  "/schengen-visa-photo": "foto-visto-schengen",
  "/id-card-photo": "foto-para-documento",
  "/passport-photo-print-sheet": "folha-de-fotos-passaporte",
  "/cv-photo": "foto-para-curriculo",
  "/instagram-profile-picture": "foto-de-perfil-instagram",
  "/discord-avatar": "avatar-discord",
  "/team-headshots": "fotos-da-equipe",
  "/telegram-sticker": "figurinha-telegram",
  "/printable-sticker-sheet": "folha-de-adesivos-para-imprimir",
  "/pet-sticker": "figurinha-de-pet",
  "/slack-emoji": "emoji-slack-discord",
  "/email-signature": "assinatura-de-email",
  "/logo-to-png": "logo-png-transparente",
  "/recolour-logo": "mudar-cor-do-logo",
  "/stamp-cleaner": "carimbo-transparente",
} as const satisfies Record<string, string>;

export type EnPath = keyof typeof PT_SLUGS;
export const EN_PATHS = Object.keys(PT_SLUGS) as EnPath[];

/** Every English page path and its Spanish slug (empty string = /es/). */
export const ES_SLUGS: Record<EnPath, string> = {
  "/": "",
  "/license": "licencia",
  "/colour-background": "fondo-de-color",
  "/product-photo": "foto-de-producto",
  "/passport-photo": "foto-para-pasaporte",
  "/profile-picture": "foto-de-perfil",
  "/sticker-maker": "crear-stickers",
  "/photo-background": "cambiar-fondo-de-foto",
  "/logo-cleaner": "logo-y-firma-sin-fondo",
  "/white-background": "fondo-blanco",
  "/amazon-product-photo": "foto-de-producto-amazon",
  "/us-passport-photo": "foto-pasaporte-estados-unidos",
  "/uk-passport-photo": "foto-pasaporte-reino-unido",
  "/india-passport-photo": "foto-pasaporte-india",
  "/linkedin-profile-photo": "foto-para-linkedin",
  "/whatsapp-sticker": "sticker-whatsapp",
  "/transparent-signature": "firma-transparente",
  "/transparent-png-for-slides": "png-transparente-para-presentaciones",
  "/remove-background-from-graphic": "quitar-fondo-de-grafico",
  "/batch-remove-background": "quitar-fondo-en-lote",
  "/cut-out-pet": "recortar-mascota",
  "/cut-out-hair": "recortar-cabello",
  "/black-background": "fondo-negro",
  "/brand-colour-background": "fondo-color-de-marca",
  "/gradient-background": "fondo-degradado",
  "/virtual-background": "fondo-virtual-zoom-teams",
  "/holiday-background": "fondo-de-vacaciones",
  "/party-background": "fondo-de-fiesta",
  "/blur-background": "desenfocar-fondo",
  "/ebay-etsy-product-photo": "foto-de-producto-ebay-etsy",
  "/shopify-product-photos": "fotos-de-producto-shopify",
  "/product-photo-shadow": "foto-de-producto-con-sombra",
  "/clothing-photo": "foto-de-ropa-para-vender",
  "/australia-passport-photo": "foto-pasaporte-australia",
  "/schengen-visa-photo": "foto-visa-schengen",
  "/id-card-photo": "foto-para-documento",
  "/passport-photo-print-sheet": "hoja-de-fotos-pasaporte",
  "/cv-photo": "foto-para-curriculum",
  "/instagram-profile-picture": "foto-de-perfil-instagram",
  "/discord-avatar": "avatar-discord",
  "/team-headshots": "fotos-del-equipo",
  "/telegram-sticker": "sticker-telegram",
  "/printable-sticker-sheet": "hoja-de-pegatinas-para-imprimir",
  "/pet-sticker": "sticker-de-mascota",
  "/slack-emoji": "emoji-slack-discord",
  "/email-signature": "firma-de-correo",
  "/logo-to-png": "logo-png-transparente",
  "/recolour-logo": "cambiar-color-del-logo",
  "/stamp-cleaner": "sello-transparente",
};

const SLUGS: Record<Exclude<Locale, "en">, Record<string, string>> = { pt: PT_SLUGS, es: ES_SLUGS };
const NON_EN = LOCALES.filter((l): l is Exclude<Locale, "en"> => l !== "en");

/** URL of an English page in the given locale. */
export function localePath(en: string, locale: Locale): string {
  if (locale === "en") return en === "/" ? `${WORKSPACE}/` : `${WORKSPACE}${en}`;
  const slug = SLUGS[locale][en];
  if (slug === undefined) return `${WORKSPACE}${en}`;
  const prefix = LOCALE_INFO[locale].prefix;
  return slug ? `${prefix}/${slug}` : `${prefix}/`;
}

export function localeOf(pathname: string): Locale {
  return NON_EN.find((l) => { const p = LOCALE_INFO[l].prefix; return pathname === p || pathname.startsWith(`${p}/`); }) ?? "en";
}

/** English page key for any URL (any language). */
export function enPathOf(pathname: string): string {
  const l = localeOf(pathname);
  if (l === "en") { const rest = pathname.startsWith(WORKSPACE) ? pathname.slice(WORKSPACE.length) : pathname; return rest || "/"; }
  const slug = pathname.slice(LOCALE_INFO[l].prefix.length).replace(/^\//, "").replace(/\/$/, "");
  const hit = Object.entries(SLUGS[l]).find(([, s]) => s === slug);
  return hit ? hit[0] : pathname;
}

/** All language versions of a page, for hreflang tags and the sitemap. */
export function alternates(en: string) {
  const list = LOCALES.map((l) => ({ hreflang: LOCALE_INFO[l].hreflang, href: `${SITE_URL}${localePath(en, l)}` }));
  return [...list, { hreflang: "x-default", href: `${SITE_URL}${localePath(en, "en")}` }];
}

/** Every URL to prerender, in all locales. */
export const ALL_PATHS: string[] = LOCALES.flatMap((l) => EN_PATHS.map((p) => localePath(p, l)));
