import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { ALL_PATHS, alternates, EN_PATHS, enPathOf, localePath, PT_SLUGS, ES_SLUGS } from "@/lib/i18n";
import { TOOL_CONTENT } from "@/lib/tool-content";
import { TOOL_CONTENT_PT } from "@/lib/tool-content.pt";
import { PT_HERO } from "@/lib/hero.pt";
import { PT_UI } from "@/lib/strings/pt";
import { ES_UI } from "@/lib/strings/es";
import { TOOL_CONTENT_ES } from "@/lib/tool-content.es";
import { ES_HERO } from "@/lib/hero.es";
import { PHOTO_RULES } from "@/lib/photo-rules";
import { SUBTOOLS, TOOL_GROUPS, TOOLS } from "@/lib/tools";
import { toolHead } from "@/lib/seo";

const toolPaths = EN_PATHS.filter((p) => p !== "/license");

describe("Portuguese pages", () => {
  it("every English page has a unique Portuguese address under /pt/", () => {
    const urls = EN_PATHS.map((p) => localePath(p, "pt"));
    expect(new Set(urls).size).toBe(EN_PATHS.length);
    for (const u of urls) expect(u.startsWith("/workspace/pt/")).toBe(true);
    expect(localePath("/", "pt")).toBe("/workspace/pt/");
    expect(localePath("/passport-photo", "pt")).toBe("/workspace/pt/foto-para-passaporte");
  });

  it("Portuguese addresses map back to their English page", () => {
    for (const p of EN_PATHS) expect(enPathOf(localePath(p, "pt"))).toBe(p);
    expect(enPathOf("/workspace/pt")).toBe("/");
  });

  it("every Portuguese page has a route file", () => {
    for (const slug of Object.values(PT_SLUGS)) expect(existsSync(`src/routes/_authenticated/workspace.pt.${slug || "index"}.tsx`)).toBe(true);
    const ptFiles = readdirSync("src/routes/_authenticated").filter((f) => f.startsWith("workspace.pt."));
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

  it("every page has a workspace address in all three languages", () => {
    expect(ALL_PATHS.length).toBe(EN_PATHS.length * 3);
    expect(ALL_PATHS).toContain("/workspace/pt/fundo-branco");
  });
});

describe("search tags", () => {
  it("each language version lists every version plus x-default (English)", () => {
    expect(alternates("/white-background")).toEqual([
      { hreflang: "en", href: "https://quikedits.com/workspace/white-background" },
      { hreflang: "pt", href: "https://quikedits.com/workspace/pt/fundo-branco" },
      { hreflang: "es", href: "https://quikedits.com/workspace/es/fondo-blanco" },
      { hreflang: "x-default", href: "https://quikedits.com/workspace/white-background" },
    ]);
  });

  it("Portuguese pages point canonical at themselves, never at English", () => {
    const h = toolHead("/white-background", "pt");
    const canonical = h.links.find((l) => l.rel === "canonical");
    expect(canonical?.href).toBe("https://quikedits.com/workspace/pt/fundo-branco");
    expect(h.links.filter((l) => l.rel === "alternate").map((l) => ("hrefLang" in l ? l.hrefLang : ""))).toEqual(["en", "pt", "es", "x-default"]);
    expect(h.meta).toContainEqual({ property: "og:locale", content: "pt_BR" });
    expect(h.meta).toContainEqual({ property: "og:image", content: "https://quikedits.com/og/pt/white-background.jpg" });
  });

  it("sitemap lists only the public landing page, never the private workspace", () => {
    const xml = readFileSync("public/sitemap.xml", "utf8");
    expect(xml.match(/<loc>/g)?.length).toBe(1);
    expect(xml).toContain("<loc>https://quikedits.com/</loc>");
    expect(xml).not.toContain("/workspace");
  });

  it("robots.txt keeps search engines out of the workspace", () => {
    expect(readFileSync("public/robots.txt", "utf8")).toMatch(/^Disallow: \/workspace$/m);
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

describe("Spanish pages", () => {
  it("every English page has a unique Spanish address under /es/ that maps back", () => {
    const urls = EN_PATHS.map((p) => localePath(p, "es"));
    expect(new Set(urls).size).toBe(EN_PATHS.length);
    for (const u of urls) expect(u.startsWith("/workspace/es/")).toBe(true);
    expect(localePath("/", "es")).toBe("/workspace/es/");
    expect(localePath("/passport-photo", "es")).toBe("/workspace/es/foto-para-pasaporte");
    for (const p of EN_PATHS) expect(enPathOf(localePath(p, "es"))).toBe(p);
    expect(enPathOf("/workspace/es")).toBe("/");
  });

  it("every Spanish page has a route file, content, headline and share image", () => {
    for (const slug of Object.values(ES_SLUGS)) expect(existsSync(`src/routes/_authenticated/workspace.es.${slug || "index"}.tsx`)).toBe(true);
    expect(readdirSync("src/routes/_authenticated").filter((f) => f.startsWith("workspace.es.")).length).toBe(EN_PATHS.length);
    for (const p of toolPaths) {
      expect(TOOL_CONTENT_ES[p], p).toBeDefined();
      expect(ES_HERO[p], p).toBeDefined();
      expect(TOOL_CONTENT_ES[p]!.title).not.toBe(TOOL_CONTENT[p]!.title);
      expect(TOOL_CONTENT_ES[p]!.faqs.length).toBe(TOOL_CONTENT[p]!.faqs.length);
      expect(existsSync(`public/og/es/${p === "/" ? "home" : p.slice(1)}.jpg`), p).toBe(true);
    }
  });

  it("Spanish pages point canonical at themselves with Spanish locale", () => {
    const h = toolHead("/white-background", "es");
    expect(h.links.find((l) => l.rel === "canonical")?.href).toBe("https://quikedits.com/workspace/es/fondo-blanco");
    expect(h.meta).toContainEqual({ property: "og:locale", content: "es_LA" });
  });

  it("Spanish interface text covers every Portuguese key and keeps placeholders", () => {
    expect(Object.keys(PT_UI).filter((k) => !(k in ES_UI))).toEqual([]);
    for (const [en, es] of Object.entries(ES_UI)) for (const v of en.match(/\{\w+\}/g) ?? []) expect(es, en).toContain(v);
  });
});
