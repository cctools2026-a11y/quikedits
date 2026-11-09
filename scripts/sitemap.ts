// Regenerates public/sitemap.xml. Only the public landing page is listed; the owner-only /workspace is never in the sitemap.
// Run: bun scripts/sitemap.ts
import { writeFileSync } from "node:fs";
import { SITE_URL } from "../src/lib/i18n";

writeFileSync("public/sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${SITE_URL}/</loc>\n  </url>\n</urlset>\n`);
console.log("1 url");
