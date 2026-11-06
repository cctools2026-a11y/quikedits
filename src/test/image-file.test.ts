import { describe, expect, it } from "vitest";
import { fitWithin, validateImageFile } from "@/lib/image-file";

describe("validateImageFile", () => {
  it("accepts jpg, png and webp", () => {
    for (const type of ["image/jpeg", "image/png", "image/webp"]) {
      expect(validateImageFile({ type, size: 1000 })).toBeNull();
    }
  });
  it("rejects other types", () => {
    expect(validateImageFile({ type: "image/gif", size: 1000 })).toMatch(/Unsupported/);
  });
  it("rejects files over 25 MB", () => {
    expect(validateImageFile({ type: "image/png", size: 25 * 1024 * 1024 + 1 })).toMatch(/25 MB/);
  });
});

describe("fitWithin", () => {
  it("downscales the long edge to 2048", () => {
    expect(fitWithin(4096, 2048)).toEqual({ width: 2048, height: 1024, scaled: true });
  });
  it("leaves small images alone", () => {
    expect(fitWithin(800, 600).scaled).toBe(false);
  });
});
