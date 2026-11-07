// Regenerates public/sitemap.xml from src/lib/i18n.ts: every page in every language, with hreflang alternates.
// Run: bun scripts/sitemap.ts
import { writeFileSync } from "node:fs";
import { alternates, EN_PATHS, LOCALES, localePath, SITE_URL } from "../src/lib/i18n";

const urls = LOCALES.flatMap((l) => EN_PATHS.map((p) => {
  const links = alternates(p).map((a) => `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${a.href}"/>`).join("\n");
  return `  <url>\n    <loc>${SITE_URL}${localePath(p, l)}</loc>\n${links}\n  </url>`;
}));
writeFileSync("public/sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join("\n")}\n</urlset>\n`);
console.log(`${urls.length} urls`);
