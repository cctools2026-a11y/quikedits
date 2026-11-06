import { describe, expect, it } from "vitest";
import { alphaForDistance, fitContain, passportPx, PASSPORT_SIZES, sheetLayout } from "@/lib/tool-sizes";

describe("passport sizes at 300 dpi", () => {
  it("US is 2x2 in = 600x600 px", () => {
    expect(passportPx(PASSPORT_SIZES.find((s) => s.id === "us")!)).toEqual({ w: 600, h: 600 });
  });
  it("UK/EU is 35x45 mm = 413x531 px", () => {
    expect(passportPx(PASSPORT_SIZES.find((s) => s.id === "uk")!)).toEqual({ w: 413, h: 531 });
  });
});

describe("sheetLayout", () => {
  it("fits six 2x2 in photos on a 6x4 in sheet", () => {
    expect(sheetLayout(600, 600).positions).toHaveLength(6);
  });
  it("fits eight 35x45 mm photos on a 6x4 in sheet", () => {
    expect(sheetLayout(413, 531).positions).toHaveLength(8);
  });
});

describe("fitContain", () => {
  it("centres with padding", () => {
    expect(fitContain(100, 50, 200, 200, 10)).toEqual({ x: 10, y: 55, w: 180, h: 90 });
  });
});

describe("alphaForDistance", () => {
  it("makes background-coloured pixels transparent and distant ones opaque", () => {
    expect(alphaForDistance(5, 60)).toBe(0);
    expect(alphaForDistance(100, 60)).toBe(1);
  });
});
