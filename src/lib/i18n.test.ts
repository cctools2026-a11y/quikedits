import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { ALL_PATHS, alternates, EN_PATHS, enPathOf, localePath, PT_SLUGS } from "@/lib/i18n";
import { TOOL_CONTENT } from "@/lib/tool-content";
import { TOOL_CONTENT_PT } from "@/lib/tool-content.pt";
import { PT_HERO } from "@/lib/hero.pt";
import { PT_UI } from "@/lib/strings/pt";
import { PHOTO_RULES } from "@/lib/photo-rules";
import { SUBTOOLS, TOOL_GROUPS, TOOLS } from "@/lib/tools";
import { toolHead } from "@/lib/seo";

const toolPaths = EN_PATHS.filter((p) => p !== "/license");

describe("Portuguese pages", () => {
  it("every English page has a unique Portuguese address under /pt/", () => {
    const urls = EN_PATHS.map((p) => localePath(p, "pt"));
    expect(new Set(urls).size).toBe(EN_PATHS.length);
    for (const u of urls) expect(u.startsWith("/pt/")).toBe(true);
    expect(localePath("/", "pt")).toBe("/pt/");
    expect(localePath("/passport-photo", "pt")).toBe("/pt/foto-para-passaporte");
  });

  it("Portuguese addresses map back to their English page", () => {
    for (const p of EN_PATHS) expect(enPathOf(localePath(p, "pt"))).toBe(p);
    expect(enPathOf("/pt")).toBe("/");
  });

  it("every Portuguese page has a route file", () => {
    for (const slug of Object.values(PT_SLUGS)) expect(existsSync(`src/routes/pt.${slug || "index"}.tsx`)).toBe(true);
    const ptFiles = readdirSync("src/routes").filter((f) => f.startsWith("pt."));
    expect(ptFiles.length).toBe(EN_PATHS.length);
  });

  it("every tool page has Portuguese content and headline", () => {
    for (const p of toolPaths) {
      expect(TOOL_CONTENT_PT[p], p).toBeDefined();
      expect(PT_HERO[p], p).toBeDefined();
      expect(TOOL_CONTENT_PT[p]!.title).not.toBe(TOOL_CONTENT[p]!.title);
      expect(TOOL_CONTENT_PT[p]!.faqs.length).toBe(TOOL_CONTENT[p]!.faqs.length);
    }
  });

  it("every page is prerendered in both languages", () => {
    expect(ALL_PATHS.length).toBe(EN_PATHS.length * 2);
    expect(ALL_PATHS).toContain("/pt/fundo-branco");
  });
});

describe("search tags", () => {
  it("each language version lists every version plus x-default (English)", () => {
    expect(alternates("/white-background")).toEqual([
      { hreflang: "en", href: "https://quikedits.com/white-background" },
      { hreflang: "pt", href: "https://quikedits.com/pt/fundo-branco" },
      { hreflang: "x-default", href: "https://quikedits.com/white-background" },
    ]);
  });

  it("Portuguese pages point canonical at themselves, never at English", () => {
    const h = toolHead("/white-background", "pt");
    const canonical = h.links.find((l) => l.rel === "canonical");
    expect(canonical?.href).toBe("https://quikedits.com/pt/fundo-branco");
    expect(h.links.filter((l) => l.rel === "alternate").map((l) => l.hrefLang)).toEqual(["en", "pt", "x-default"]);
    expect(h.meta).toContainEqual({ property: "og:locale", content: "pt_BR" });
    expect(h.meta).toContainEqual({ property: "og:image", content: "https://quikedits.com/og/pt/white-background.jpg" });
  });

  it("sitemap lists every page in both languages with alternates", () => {
    const xml = readFileSync("public/sitemap.xml", "utf8");
    for (const p of ALL_PATHS) expect(xml).toContain(`<loc>https://quikedits.com${p}</loc>`);
    expect(xml.match(/hreflang="pt"/g)?.length).toBe(ALL_PATHS.length);
  });

  it("every Portuguese page has its own share image", () => {
    for (const p of toolPaths) expect(existsSync(`public/og/pt/${p === "/" ? "home" : p.slice(1)}.jpg`), p).toBe(true);
  });
});

describe("Portuguese interface text", () => {
  const files = [...readdirSync("src/components").map((f) => `src/components/${f}`), ...readdirSync("src/components/tools").map((f) => `src/components/tools/${f}`)]
    .filter((f) => f.endsWith(".tsx"));

  it("every translated string in the interface has Portuguese", () => {
    const missing: string[] = [];
    for (const f of files) {
      const src = readFileSync(f, "utf8");
      for (const m of src.matchAll(/(?<![\w.])t\(("(?:[^"\\]|\\.)*")/g)) {
        const key = JSON.parse(m[1]!) as string;
        if (!(key in PT_UI)) missing.push(`${f}: ${key}`);
      }
    }
    expect(missing).toEqual([]);
  });

  it("menu, tool names and photo tips have Portuguese", () => {
    const keys = [
      ...TOOLS.flatMap((t) => [t.label, t.blurb, t.task]),
      ...SUBTOOLS.flatMap((s) => [s.label, s.blurb]),
      ...TOOL_GROUPS.map((g) => g.label),
      ...Object.values(PHOTO_RULES).flatMap((r) => [r.best, ...r.good, ...r.avoid]),
    ];
    expect(keys.filter((k) => !(k in PT_UI))).toEqual([]);
  });

  it("keeps placeholders like {n} in translations", () => {
    for (const [en, pt] of Object.entries(PT_UI)) {
      const vars = en.match(/\{\w+\}/g) ?? [];
      for (const v of vars) expect(pt, en).toContain(v);
    }
  });
});
