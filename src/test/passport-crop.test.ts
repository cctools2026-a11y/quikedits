import { describe, expect, it } from "vitest";
import { documentCrop } from "@/lib/passport-crop";
import { PASSPORT_SIZES, passportPx } from "@/lib/tool-sizes";

describe("document cropping", () => {
  it("crops a portrait to a centred square without stretching", () => {
    expect(documentCrop(720, 928, 600, 600)).toEqual({ x: 0, y: 104, w: 720, h: 720 });
  });
  it("zooms and positions the crop within source bounds", () => {
    expect(documentCrop(720, 928, 600, 600, 200, 100, 0)).toEqual({ x: 360, y: 0, w: 360, h: 360 });
  });
  it.each(PASSPORT_SIZES)("preserves the $label aspect ratio within the source", (preset) => {
    const size = passportPx(preset);
    const crop = documentCrop(720, 928, size.w, size.h, 130, 30, 70);
    expect(crop.w / crop.h).toBeCloseTo(size.w / size.h);
    expect(crop.x + crop.w).toBeLessThanOrEqual(720);
    expect(crop.y + crop.h).toBeLessThanOrEqual(928);
  });
  it("exports a 30 × 40 mm ID photo at 300 dpi", () => {
    const preset = PASSPORT_SIZES.find((s) => s.id === "id");
    expect(preset).toBeDefined();
    if (preset) expect(passportPx(preset)).toEqual({ w: 354, h: 472 });
  });
});