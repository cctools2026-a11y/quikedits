// Pure locale/path helpers. No "@/" imports: vite.config.ts imports this file for prerendering.

export type Locale = "en" | "pt";
export const LOCALES: readonly Locale[] = ["en", "pt"];
export const SITE_URL = "https://quikedits.com";

/** hreflang code and URL prefix per locale. Add "pt-BR" -> "/pt/br" here later. */
export const LOCALE_INFO: Record<Locale, { hreflang: string; prefix: string; ogLocale: string; htmlLang: string }> = {
  en: { hreflang: "en", prefix: "", ogLocale: "en_US", htmlLang: "en" },
  pt: { hreflang: "pt", prefix: "/pt", ogLocale: "pt_BR", htmlLang: "pt" },
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

/** URL of an English page in the given locale. */
export function localePath(en: string, locale: Locale): string {
  if (locale === "en") return en;
  const slug = (PT_SLUGS as Record<string, string>)[en];
  if (slug === undefined) return en;
  return slug ? `/pt/${slug}` : "/pt/";
}

export function localeOf(pathname: string): Locale {
  return pathname === "/pt" || pathname.startsWith("/pt/") ? "pt" : "en";
}

/** English page key for any URL (English or Portuguese). */
export function enPathOf(pathname: string): string {
  if (localeOf(pathname) === "en") return pathname;
  const slug = pathname.replace(/^\/pt\/?/, "").replace(/\/$/, "");
  const hit = Object.entries(PT_SLUGS).find(([, s]) => s === slug);
  return hit ? hit[0] : pathname;
}

/** All language versions of a page, for hreflang tags and the sitemap. */
export function alternates(en: string) {
  const list = LOCALES.map((l) => ({ hreflang: LOCALE_INFO[l].hreflang, href: `${SITE_URL}${localePath(en, l)}` }));
  return [...list, { hreflang: "x-default", href: `${SITE_URL}${en}` }];
}

/** Every URL to prerender, in all locales. */
export const ALL_PATHS: string[] = LOCALES.flatMap((l) => EN_PATHS.map((p) => localePath(p, l)));
