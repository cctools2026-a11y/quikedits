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
