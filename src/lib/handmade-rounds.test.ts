import { describe, expect, it } from "vitest";
import { pickRounds, score } from "./handmade-rounds";

describe("made by hand rounds", () => {
  it("plays 12 rounds per game", () => expect(pickRounds().length).toBe(12));
  it("score counts correct picks", () => expect(score([true, false, true, true])).toBe(3));
});
