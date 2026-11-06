/** Crop a full-frame portrait without stretching or leaving empty borders. */
export function documentCrop(sw: number, sh: number, tw: number, th: number, zoom = 100, x = 50, y = 50) {
  const scale = Math.max(tw / sw, th / sh) * Math.max(1, zoom / 100);
  const w = tw / scale;
  const h = th / scale;
  return { x: (sw - w) * Math.max(0, Math.min(100, x)) / 100, y: (sh - h) * Math.max(0, Math.min(100, y)) / 100, w, h };
}