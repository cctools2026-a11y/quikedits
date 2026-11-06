import { describe, expect, it } from "vitest";
import { analyseAlpha, cornersUneven, cuesFor } from "@/lib/photo-rules";

function mask(w: number, h: number, on: (x: number, y: number) => boolean) {
  const a = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) a[y * w + x] = on(x, y) ? 255 : 0;
  return a;
}
const ids = (tool: string, a: ReturnType<typeof analyseAlpha>, small = false) => cuesFor(tool, a, small).map((c) => c.id);

describe("cutout cues", () => {
  it("almost nothing kept → no clear subject", () => {
    expect(ids("/", analyseAlpha(mask(100, 100, (x, y) => x < 5 && y < 5), 100, 100))).toContain("empty");
  });
  it("almost everything kept → background too similar", () => {
    expect(ids("/", analyseAlpha(mask(100, 100, () => true), 100, 100))).toContain("full");
  });
  it("main subject plus scattered bits → stray", () => {
    const a = analyseAlpha(mask(100, 100, (x, y) => (x > 30 && x < 70 && y > 30 && y < 90) || (x > 85 && x < 90 && y > 10 && y < 15)), 100, 100);
    expect(ids("/", a)).toContain("stray");
  });
  it("one clean subject → no warnings", () => {
    expect(ids("/passport-photo", analyseAlpha(mask(100, 100, (x, y) => x > 30 && x < 70 && y > 20), 100, 100))).toEqual([]);
  });
  it("passport subject touching the top edge → cut off", () => {
    expect(ids("/passport-photo", analyseAlpha(mask(100, 100, (x) => x > 30 && x < 70), 100, 100))).toContain("top");
  });
  it("enclosed gap inside the subject → hole", () => {
    const a = analyseAlpha(mask(100, 100, (x, y) => x > 20 && x < 80 && y > 20 && y < 95 && !(x > 40 && x < 60 && y > 40 && y < 60)), 100, 100);
    expect(ids("/", a)).toContain("hole");
  });
  it("small photo → soft warning", () => {
    expect(ids("/", analyseAlpha(mask(10, 10, (x) => x > 3 && x < 7), 10, 10), true)).toContain("small");
  });
  it("logo corners of different colours are uneven", () => {
    expect(cornersUneven([[255, 255, 255], [250, 250, 250], [120, 110, 100], [255, 255, 255]])).toBe(true);
    expect(cornersUneven([[255, 255, 255], [250, 250, 250], [248, 248, 248], [255, 255, 255]])).toBe(false);
  });
});
