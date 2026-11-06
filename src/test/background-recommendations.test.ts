import { describe, expect, it } from "vitest";
import { foregroundColour, rankBackgrounds } from "../lib/background-recommendations";

describe("on-device background recommendations", () => {
  it("ignores invisible background colours", () => {
    expect(foregroundColour([255, 0, 0, 0, 20, 80, 140, 255])).toEqual([20, 80, 140]);
  });
  it("uses the dominant foreground colour rather than mixing unrelated colours", () => {
    expect(foregroundColour([200, 100, 20, 255, 200, 100, 20, 255, 0, 0, 255, 255])).toEqual([200, 100, 20]);
  });
  it("prefers a contrasting background over matching the subject", () => {
    const ranked = rankBackgrounds([250, 220, 10], [
      { id: "yellow", name: "Yellow", colour: [250, 220, 10] },
      { id: "teal", name: "Teal", colour: [20, 130, 150] },
    ]);
    expect(ranked[0]?.id).toBe("teal");
  });
  it("does not invent a recommendation for an empty cutout", () => {
    expect(foregroundColour([0, 0, 0, 0])).toBeNull();
    expect(rankBackgrounds(null, [{ id: "teal", name: "Teal", colour: [20, 130, 150] }])).toEqual([]);
  });
});