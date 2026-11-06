export const PRINT_DPI = 300;
export const mmToPx = (mm: number, dpi = PRINT_DPI) => Math.round((mm / 25.4) * dpi);

export const PRODUCT_SIZES = [
  { id: "square", label: "Square 1:1 (Amazon, eBay, Etsy, Shopify)", w: 2000, h: 2000 },
  { id: "landscape", label: "Landscape 4:3", w: 2000, h: 1500 },
  { id: "portrait", label: "Portrait 4:5 (Instagram)", w: 1600, h: 2000 },
] as const;

export const PASSPORT_SIZES = [
  { id: "us", label: "USA (2 × 2 in)", wMm: 50.8, hMm: 50.8 },
  { id: "uk", label: "UK, EU, Australia (35 × 45 mm)", wMm: 35, hMm: 45 },
  { id: "ca", label: "Canada (50 × 70 mm)", wMm: 50, hMm: 70 },
  { id: "cn", label: "China (33 × 48 mm)", wMm: 33, hMm: 48 },
  { id: "in", label: "India (51 × 51 mm)", wMm: 51, hMm: 51 },
  { id: "id", label: "ID photo (30 × 40 mm)", wMm: 30, hMm: 40 },
] as const;

/** Padding per side (percent) so the subject's longest side fills `fill` percent of the frame. */
export const padForFill = (fill: number) => (100 - fill) / 2;

export const passportPx = (s: { wMm: number; hMm: number }) => ({ w: mmToPx(s.wMm), h: mmToPx(s.hMm) });

/** 6 × 4 in print sheet at 300 dpi. */
export const SHEET = { w: 1800, h: 1200 };

export function sheetLayout(pw: number, ph: number, sw = SHEET.w, sh = SHEET.h) {
  const cols = Math.floor(sw / pw);
  const rows = Math.floor(sh / ph);
  const ox = Math.round((sw - cols * pw) / 2);
  const oy = Math.round((sh - rows * ph) / 2);
  const positions: { x: number; y: number }[] = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) positions.push({ x: ox + c * pw, y: oy + r * ph });
  return { cols, rows, positions };
}

/** Fit a source box inside a target box with padding, centred. */
export function fitContain(sw: number, sh: number, bw: number, bh: number, pad = 0) {
  const s = Math.min((bw - 2 * pad) / sw, (bh - 2 * pad) / sh);
  const w = sw * s;
  const h = sh * s;
  return { x: (bw - w) / 2, y: (bh - h) / 2, w, h };
}

/** Logo cleaner: how opaque a pixel is, given its colour distance from the background. */
export function alphaForDistance(dist: number, tolerance: number) {
  const lo = tolerance * 0.6;
  if (dist <= lo) return 0;
  if (dist >= tolerance) return 1;
  return (dist - lo) / (tolerance - lo);
}

export const STICKER_SIZE = 512;
export const PROFILE_SIZE = 1000;
