import { expect, it } from "vitest";
import { canDrawSignature } from "./signature-tools";

it("allows drawing on every signature tool", () => {
  for (const page of ["/logo-cleaner", "/transparent-signature", "/email-signature"]) {
    expect(canDrawSignature(page)).toBe(true);
  }
});

it("does not offer signature drawing on logo-only or stamp jobs", () => {
  for (const page of ["/logo-to-png", "/recolour-logo", "/stamp-cleaner", "/"]) {
    expect(canDrawSignature(page)).toBe(false);
  }
});