import { describe, expect, it } from "vitest";
import { TOOLS } from "@/lib/tools";
import { TOOL_CONTENT } from "@/lib/tool-content";
import { toolHead } from "@/lib/seo";

describe("tool landing content", () => {
  it("every tool has content", () => {
    for (const t of TOOLS) expect(TOOL_CONTENT[t.to], t.to).toBeDefined();
  });
  it("titles are unique and under 60 characters", () => {
    const titles = TOOLS.map((t) => TOOL_CONTENT[t.to]!.title);
    expect(new Set(titles).size).toBe(titles.length);
    for (const t of titles) expect(t.length, t).toBeLessThanOrEqual(60);
  });
  it("descriptions are under 155 characters", () => {
    for (const t of TOOLS) expect(TOOL_CONTENT[t.to]!.description.length, t.to).toBeLessThanOrEqual(155);
  });
  it("canonical points at the page itself on quikedits.com", () => {
    expect(toolHead("/passport-photo").links[0]!.href).toBe("https://quikedits.com/passport-photo");
  });
});
