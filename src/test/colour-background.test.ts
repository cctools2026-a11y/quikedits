import { describe, expect, it } from "vitest";
import { isSolidHex, refineAlpha } from "@/lib/colour-background";

describe("isSolidHex", () => {
  it("only accepts solid hex colours", () => {
    expect(isSolidHex("#3B82F6")).toBe(true);
    expect(isSolidHex("linear-gradient(red, blue)")).toBe(false);
  });
});

describe("refineAlpha", () => {
  it("shrinks the mask edge by the erode radius", () => {
    const a = new Float32Array([0, 1, 1, 1, 1]);
    const out = refineAlpha(a, 5, 1, 1, 0);
    expect(Array.from(out)).toEqual([0, 0, 1, 1, 1]);
  });
});
