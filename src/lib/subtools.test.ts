import { describe, expect, it } from "vitest";
import { padForFill, PASSPORT_SIZES, passportPx } from "@/lib/tool-sizes";
import { SUBTOOLS, TOOLS } from "@/lib/tools";
import { TOOL_CONTENT } from "@/lib/tool-content";

describe("sub-tool presets", () => {
  it("Amazon: product fills 85% of the frame", () => {
    expect(padForFill(85)).toBe(7.5);
    expect(100 - 2 * padForFill(85)).toBe(85);
  });
  it("India passport is 51 × 51 mm at 300 dpi", () => {
    const s = PASSPORT_SIZES.find((p) => p.id === "in")!;
    expect(passportPx(s)).toEqual({ w: 602, h: 602 });
  });
  it("US passport is 2 × 2 in (600 px at 300 dpi)", () => {
    expect(passportPx(PASSPORT_SIZES.find((p) => p.id === "us")!)).toEqual({ w: 600, h: 600 });
  });
  it("every sub-tool has a real parent and its own page content", () => {
    for (const s of SUBTOOLS) {
      expect(TOOLS.some((t) => t.to === s.parent)).toBe(true);
      expect(TOOL_CONTENT[s.to]).toBeDefined();
    }
  });
});

import { inkAlpha } from "@/lib/tool-sizes";
import { gridOnPage, PAGES } from "@/lib/sheets";
import { uniqueNames } from "@/lib/zip";

describe("phase 2 and 3 rules", () => {
  it("stamp cleaner keeps red ink and drops grey paper and black text", () => {
    expect(inkAlpha(200, 30, 40, 60)).toBe(1);
    expect(inkAlpha(240, 238, 235, 60)).toBe(0);
    expect(inkAlpha(20, 20, 22, 60)).toBe(0);
  });
  it("A4 sticker sheet fits 2 in stickers in a grid of 3 × 5", () => {
    const a4 = PAGES.find((p) => p.id === "a4")!;
    const g = gridOnPage(a4.w, a4.h, 600, 120, 60);
    expect([g.cols, g.rows]).toEqual([3, 5]);
  });
  it("batch downloads never repeat a file name", () => {
    expect(uniqueNames(["a.png", "a.png", "b.png", "a.png"])).toEqual(["a.png", "a-2.png", "b.png", "a-3.png"]);
  });
});
