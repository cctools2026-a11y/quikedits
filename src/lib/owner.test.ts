import { describe, expect, it } from "vitest";
import { isOwnerEmail } from "./owner";

describe("workspace owner", () => {
  it("accepts Contact@sashagusain.com in any letter case", () => {
    expect(isOwnerEmail("Contact@sashagusain.com")).toBe(true);
    expect(isOwnerEmail("  contact@SASHAGUSAIN.com ")).toBe(true);
  });
  it("rejects every other email", () => {
    expect(isOwnerEmail("someone@sashagusain.com")).toBe(false);
    expect(isOwnerEmail("contact@sashagusain.co")).toBe(false);
    expect(isOwnerEmail("")).toBe(false);
    expect(isOwnerEmail(null)).toBe(false);
  });
});
