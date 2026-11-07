import { describe, expect, it } from "vitest";
import { TOOL_MEDIA, mediaFor } from "@/lib/tool-media";

const paths = Object.keys(TOOL_MEDIA);

describe("language-specific example photos", () => {
  it("covers all 48 pages", () => expect(paths.length).toBe(48));
  for (const loc of ["pt", "es"] as const) {
    it(`every ${loc} page has its own before and after photo`, () => {
      for (const p of paths) {
        const m = mediaFor(p, loc)!;
        expect(m.before, p).not.toBe(TOOL_MEDIA[p]!.before);
        expect(m.after, p).not.toBe(TOOL_MEDIA[p]!.after);
      }
    });
  }
  it("Portuguese and Spanish pages use different photos", () => {
    for (const p of paths) expect(mediaFor(p, "pt")!.before).not.toBe(mediaFor(p, "es")!.before);
  });
  it("English pages keep the English photos", () => {
    for (const p of paths) expect(mediaFor(p, "en")).toBe(TOOL_MEDIA[p]);
  });
});
