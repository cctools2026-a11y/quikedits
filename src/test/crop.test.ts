import { describe, expect, it } from "vitest";
import { initialRect, resizeRect, rotatedSize } from "@/lib/crop";

describe("crop", () => {
  it("rotating 90° swaps width and height", () => {
    expect(rotatedSize(400, 300, 90)).toEqual({ w: 300, h: 400 });
  });
  it("square crop on a 400x200 image is centred 200x200", () => {
    expect(initialRect(1, 400, 200)).toEqual({ x: 0.25, y: 0, w: 0.5, h: 1 });
  });
  it("locked-shape resize keeps the pixel aspect", () => {
    const r = resizeRect({ x: 0, y: 0, w: 0.5, h: 1 }, "se", 0.3, 0.9, 1, 400, 200);
    expect(r.w * 400).toBeCloseTo(r.h * 200);
  });
});
