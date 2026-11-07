import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";
import { EN_PATHS, localePath } from "@/lib/i18n";
import { TOOL_CONTENT_PT } from "@/lib/tool-content.pt";
import { TOOL_CONTENT_ES } from "@/lib/tool-content.es";
import { translate } from "@/lib/use-i18n";

type Head = { meta?: Array<Record<string, string>>; links?: Array<Record<string, string>> };

const LANGS = [
  { l: "pt", og: "pt_BR", content: TOOL_CONTENT_PT, license: /Licença/ },
  { l: "es", og: "es_LA", content: TOOL_CONTENT_ES, license: /Licencia/ },
] as const;

// Match routes and call each page's head() directly: no loaders or rendering needed.
for (const { l, og, content, license } of LANGS) describe(`every /${l}/ page`, () => {
  const router = createRouter({ routeTree, context: { queryClient: new QueryClient() }, trailingSlash: "preserve" });

  for (const en of EN_PATHS) {
    const url = localePath(en, l);
    it(`${url} opens its own page`, () => {
      const match = router.matchRoutes(url).at(-1);
      expect(match?.routeId).not.toBe(rootRouteId);
      expect(match?.routeId.startsWith(`/${l}`)).toBe(true);

      const route = (router.routesById as unknown as Record<string, { options: { head?: (c: unknown) => Head } }>)[match!.routeId]!;
      const head = route.options.head!({} as never);
      const title = head.meta?.find((m) => "title" in m)?.["title"];
      const canonical = head.links?.find((x) => x["rel"] === "canonical")?.["href"];

      expect(canonical).toBe(`https://quikedits.com${url}`);
      expect(head.meta).toContainEqual({ property: "og:locale", content: og });
      if (content[en]) expect(title).toBe(content[en]!.title);
      else expect(title).toMatch(license);
    });
  }
});

describe("missing translations", () => {
  const missing = "A phrase nobody has translated yet";

  it("show the English text instead of a blank or a raw key", () => {
    expect(translate("pt", missing)).toBe(missing);
  });

  it("still fill in numbers and names", () => {
    expect(translate("pt", "Only {n} left for {name}", { n: 3, name: "Ana" })).toBe("Only 3 left for Ana");
  });

  it("use Portuguese or Spanish when a translation exists", () => {
    expect(translate("pt", "Share")).not.toBe("Share");
    expect(translate("es", "Share")).not.toBe("Share");
    expect(translate("es", missing)).toBe(missing);
    expect(translate("en", "Share")).toBe("Share");
  });
});
