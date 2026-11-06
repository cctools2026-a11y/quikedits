import { TOOL_CONTENT } from "@/lib/tool-content";

export const SITE_URL = "https://quikedits.com";
export const SITE_NAME = "QuikEdits";

export function toolHead(path: string) {
  const c = TOOL_CONTENT[path]!;
  const url = `${SITE_URL}${path === "/" ? "/" : path}`;
  const image = `${SITE_URL}/og/${path === "/" ? "home" : path.slice(1)}.jpg`;
  const app = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: c.name,
    url,
    image,
    description: c.description,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any (web browser)",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };
  const crumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: SITE_NAME, item: `${SITE_URL}/` },
      ...(path === "/" ? [] : [{ "@type": "ListItem", position: 2, name: c.name, item: url }]),
    ],
  };
  const site = { "@context": "https://schema.org", "@type": "WebSite", name: SITE_NAME, url: `${SITE_URL}/` };
  return {
    meta: [
      { title: c.title },
      { name: "description", content: c.description },
      { property: "og:title", content: c.ogTitle },
      { property: "og:description", content: c.ogDescription },
      { property: "og:url", content: url },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:locale", content: "en_US" },
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
    links: [{ rel: "canonical", href: url }],
    scripts: [app, crumbs, ...(path === "/" ? [site] : [])].map((j) => ({ type: "application/ld+json", children: JSON.stringify(j) })),
  };
}
