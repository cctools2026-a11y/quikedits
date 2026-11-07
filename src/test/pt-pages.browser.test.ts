// Opens every /pt/ page in a real browser and checks that no English interface text is visible.
// Needs the dev server on http://localhost:8080; skipped when it isn't running.
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { chromium, type Browser } from "playwright-core";

import { EN_PATHS, localePath } from "@/lib/i18n";
import { PT_UI } from "@/lib/strings/pt";
import { TOOL_CONTENT } from "@/lib/tool-content";

const BASE = process.env["PT_TEST_URL"] ?? "http://localhost:8080";
const up = await fetch(BASE, { signal: AbortSignal.timeout(3000) }).then((r) => r.ok, () => false);

const norm = (s: string) => s.replace(/\s+/g, " ").trim().toLowerCase();
// English strings that have a different Portuguese translation; seeing one means a missed translation.
const ENGLISH = new Set(
  Object.entries(PT_UI).filter(([en, pt]) => norm(en) !== norm(pt) && /[a-z]{3}/i.test(en) && !en.includes("{")).map(([en]) => norm(en)),
);

describe.skipIf(!up)("every /pt/ page in a browser", () => {
  let browser: Browser;
  beforeAll(async () => { browser = await chromium.launch({ headless: true }); }, 60_000);
  afterAll(async () => { await browser?.close(); });

  for (const en of EN_PATHS) {
    const pt = localePath(en, "pt");
    it(`${pt} shows Portuguese text`, async () => {
      const page = await browser.newPage({ viewport: { width: 1280, height: 1800 }, locale: "pt-BR" });
      try {
        await page.goto(BASE + pt, { waitUntil: "networkidle" });
        expect(await page.getAttribute("html", "lang")).toBe("pt");
        const lines = (await page.locator("body").innerText()).split("\n").map(norm).filter(Boolean);

        const leftovers = lines.filter((l) => ENGLISH.has(l));
        expect(leftovers, `English text on ${pt}`).toEqual([]);

        const c = TOOL_CONTENT[en];
        if (c) for (const s of [c.title, ...c.faqs.map((f) => f.q)]) expect(lines, `English copy on ${pt}`).not.toContain(norm(s));
      } finally {
        await page.close();
      }
    }, 60_000);
  }
});
