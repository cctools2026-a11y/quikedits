import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";
import { EN_PATHS, localePath } from "@/lib/i18n";
import { TOOL_CONTENT_PT } from "@/lib/tool-content.pt";
import { translate } from "@/lib/use-i18n";

type Head = { meta?: Array<Record<string, string>>; links?: Array<Record<string, string>> };

// Match routes and call each page's head() directly: no loaders or rendering needed.
describe("every /pt/ page", () => {
  const router = createRouter({ routeTree, context: { queryClient: new QueryClient() }, trailingSlash: "preserve" });

  for (const en of EN_PATHS) {
    const pt = localePath(en, "pt");
    it(`${pt} opens its own Portuguese page`, () => {
      const match = router.matchRoutes(pt).at(-1);
      expect(match?.routeId).not.toBe(rootRouteId);
      expect(match?.routeId.startsWith("/pt")).toBe(true);

      const route = (router.routesById as Record<string, { options: { head?: (c: unknown) => Head } }>)[match!.routeId]!;
      const head = route.options.head!({} as never);
      const title = head.meta?.find((m) => "title" in m)?.title;
      const canonical = head.links?.find((l) => l.rel === "canonical")?.href;

      expect(canonical).toBe(`https://quikedits.com${pt}`);
      expect(head.meta).toContainEqual({ property: "og:locale", content: "pt_BR" });
      if (TOOL_CONTENT_PT[en]) expect(title).toBe(TOOL_CONTENT_PT[en]!.title);
      else expect(title).toMatch(/Licença/);
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

  it("use Portuguese when a translation exists", () => {
    expect(translate("pt", "Share")).not.toBe("Share");
    expect(translate("en", "Share")).toBe("Share");
  });
});
