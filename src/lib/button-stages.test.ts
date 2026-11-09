import { describe, expect, it } from "vitest";
import { STAGES, isLast, nextStage } from "./button-stages";

describe("button stages", () => {
  it("has about twenty stages", () => expect(STAGES.length).toBe(20));
  it("stops at the final stage", () => {
    let i = 0;
    for (let n = 0; n < 50; n++) i = nextStage(i);
    expect(i).toBe(19);
    expect(isLast(i)).toBe(true);
  });
});
