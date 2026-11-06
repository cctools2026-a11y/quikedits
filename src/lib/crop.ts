export type Rect = { x: number; y: number; w: number; h: number }; // normalised 0..1

/** Size of the box that holds a w×h image rotated by deg. */
export function rotatedSize(w: number, h: number, deg: number) {
  const r = (deg * Math.PI) / 180;
  const c = Math.abs(Math.cos(r)), s = Math.abs(Math.sin(r));
  return { w: Math.round(w * c + h * s), h: Math.round(w * s + h * c) };
}

/** Largest centred crop of the given pixel aspect (w/h) inside a W×H box; full box when aspect is null. */
export function initialRect(aspect: number | null, W: number, H: number): Rect {
  if (!aspect) return { x: 0, y: 0, w: 1, h: 1 };
  let wPx = W, hPx = W / aspect;
  if (hPx > H) { hPx = H; wPx = H * aspect; }
  const w = wPx / W, h = hPx / H;
  return { x: (1 - w) / 2, y: (1 - h) / 2, w, h };
}

export function rectToPixels(r: Rect, W: number, H: number) {
  return { x: Math.round(r.x * W), y: Math.round(r.y * H), w: Math.max(1, Math.round(r.w * W)), h: Math.max(1, Math.round(r.h * H)) };
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export function moveRect(r: Rect, dx: number, dy: number): Rect {
  return { ...r, x: clamp(r.x + dx, 0, 1 - r.w), y: clamp(r.y + dy, 0, 1 - r.h) };
}

/** Resize from a dragged corner; the opposite corner stays fixed. */
export function resizeRect(r: Rect, corner: "nw" | "ne" | "sw" | "se", px: number, py: number, aspect: number | null, W: number, H: number, min = 0.05): Rect {
  const ax = corner.includes("w") ? r.x + r.w : r.x;
  const ay = corner.includes("n") ? r.y + r.h : r.y;
  const sx = corner.includes("w") ? -1 : 1, sy = corner.includes("n") ? -1 : 1;
  const availX = sx > 0 ? 1 - ax : ax, availY = sy > 0 ? 1 - ay : ay;
  let w = clamp((clamp(px, 0, 1) - ax) * sx, min, availX);
  let h = clamp((clamp(py, 0, 1) - ay) * sy, min, availY);
  if (aspect) {
    const k = W / (aspect * H);
    h = w * k;
    if (h > availY) { h = availY; w = h / k; }
  }
  return { x: sx > 0 ? ax : ax - w, y: sy > 0 ? ay : ay - h, w, h };
}
