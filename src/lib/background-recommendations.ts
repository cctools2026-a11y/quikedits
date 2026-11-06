export type RGB = readonly [number, number, number];
export type BackgroundCandidate = { id: string; name: string; colour: RGB };

/** Alpha-weighted foreground colours; transparent/background pixels never contribute. */
export function foregroundColour(pixels: ArrayLike<number>): RGB | null {
  const bins = new Map<number, { sum: number[]; weight: number }>();
  for (let i = 0; i + 3 < pixels.length; i += 4) {
    const r = pixels[i] ?? 0, g = pixels[i + 1] ?? 0, b = pixels[i + 2] ?? 0;
    const alpha = pixels[i + 3] ?? 0;
    if (alpha < 128) continue;
    const key = (Math.floor(r / 64) << 4) + (Math.floor(g / 64) << 2) + Math.floor(b / 64);
    const bin = bins.get(key) ?? { sum: [0, 0, 0], weight: 0 };
    bin.sum[0] = (bin.sum[0] ?? 0) + r * alpha;
    bin.sum[1] = (bin.sum[1] ?? 0) + g * alpha;
    bin.sum[2] = (bin.sum[2] ?? 0) + b * alpha;
    bin.weight += alpha;
    bins.set(key, bin);
  }
  const dominant = [...bins.values()].sort((a, b) => b.weight - a.weight)[0];
  if (!dominant) return null;
  return [0, 1, 2].map((i) => Math.round((dominant.sum[i] ?? 0) / dominant.weight)) as [number, number, number];
}

export function rankBackgrounds<T extends BackgroundCandidate>(colour: RGB | null, candidates: readonly T[]) {
  if (!colour) return [];
  const luminance = (rgb: RGB) => rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
  return candidates.map((preset) => {
    const distance = Math.hypot(...colour.map((value, i) => value - (preset.colour[i] ?? 0)));
    const contrast = Math.abs(luminance(colour) - luminance(preset.colour));
    return { ...preset, score: distance + contrast * 0.5,
      reason: contrast > 80 ? "Light contrast helps your subject stand out." : "Contrasting colours help your subject stand out." };
  }).sort((a, b) => b.score - a.score);
}