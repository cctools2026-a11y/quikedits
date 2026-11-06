export const GRADIENTS = [
  { id: "g-sunset", name: "Sunset", stops: ["#FF9A8B", "#FF6A88", "#FFD86F"] },
  { id: "g-mint", name: "Mint fizz", stops: ["#A8F0D1", "#7FD8F5"] },
  { id: "g-candy", name: "Candy", stops: ["#FBC2EB", "#A6C1EE"] },
  { id: "g-lemon", name: "Lemonade", stops: ["#FFF3B0", "#FFB5C2"] },
  { id: "g-ocean", name: "Ocean", stops: ["#2E3192", "#1BFFFF"] },
  { id: "g-peach", name: "Peach", stops: ["#FFECD2", "#FCB69F"] },
] as const;

/** Paint a diagonal gradient onto a fresh canvas. */
export function gradientCanvas(stops: readonly string[], w = 2000, h = 2000) {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const ctx = c.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, w, h);
  stops.forEach((s, i) => g.addColorStop(i / Math.max(1, stops.length - 1), s));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  return c;
}

export const gradientCss = (stops: readonly string[]) => `linear-gradient(135deg, ${stops.join(", ")})`;
