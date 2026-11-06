import { pass, refineAlpha } from "@/lib/colour-background";
import { analyseAlpha, componentSizes, findHoles } from "@/lib/photo-rules";

export function makeCanvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(w));
  c.height = Math.max(1, Math.round(h));
  return c;
}

export const ctx2d = (c: HTMLCanvasElement) => c.getContext("2d", { willReadFrequently: true })!;

export async function blobToCanvas(blob: Blob) {
  const bmp = await createImageBitmap(blob);
  const c = makeCanvas(bmp.width, bmp.height);
  ctx2d(c).drawImage(bmp, 0, 0);
  bmp.close();
  return c;
}

/** Crop a canvas to its non-transparent pixels. */
export function trim(src: HTMLCanvasElement) {
  const { width: w, height: h } = src;
  const d = ctx2d(src).getImageData(0, 0, w, h).data;
  let x0 = w, y0 = h, x1 = -1, y1 = -1;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++)
      if (d[(y * w + x) * 4 + 3]! > 12) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
  if (x1 < 0) return src;
  const out = makeCanvas(x1 - x0 + 1, y1 - y0 + 1);
  ctx2d(out).drawImage(src, -x0, -y0);
  return out;
}

/** Cutout with cleaned edges (old-background halo removed), trimmed to the subject. */
export async function refinedCutout(blob: Blob) {
  return trim(await refinedFull(blob));
}

/** Same as refinedCutout but keeps the full frame, aligned with the source photo. */
export async function refinedFull(blob: Blob) {
  const c = await blobToCanvas(blob);
  const { width: w, height: h } = c;
  const ctx = ctx2d(c);
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  const alpha = new Float32Array(w * h);
  for (let i = 0; i < alpha.length; i++) alpha[i] = d[i * 4 + 3]! / 255;
  const scale = Math.max(w, h) / 1000;
  const a = refineAlpha(alpha, w, h, Math.max(1, Math.round(1.5 * scale)), Math.max(1, Math.round(scale)));
  for (let i = 0; i < a.length; i++) d[i * 4 + 3] = Math.min(1, Math.max(0, (a[i]! - 0.1) / 0.8)) * 255;
  ctx.putImageData(img, 0, 0);
  return c;
}

/** Shrink alpha to a small grid for fast checks. */
function alphaGrid(src: HTMLCanvasElement, max = 200) {
  const s = Math.min(1, max / Math.max(src.width, src.height));
  const g = makeCanvas(src.width * s, src.height * s);
  const ctx = ctx2d(g);
  ctx.drawImage(src, 0, 0, g.width, g.height);
  const d = ctx.getImageData(0, 0, g.width, g.height).data;
  const a = new Uint8Array(g.width * g.height);
  for (let i = 0; i < a.length; i++) a[i] = d[i * 4 + 3]!;
  return { a, w: g.width, h: g.height };
}

export function analyseCanvas(src: HTMLCanvasElement) {
  const { a, w, h } = alphaGrid(src);
  return analyseAlpha(a, w, h);
}

/** Keep only the biggest connected piece of a cutout. */
export function keepLargest(src: HTMLCanvasElement) {
  const { a, w, h } = alphaGrid(src);
  const on = new Uint8Array(w * h);
  for (let i = 0; i < on.length; i++) on[i] = a[i]! > 40 ? 1 : 0;
  const { labels, labelsSize } = componentSizes(on, w, h);
  if (!labelsSize.length) return src;
  const big = labelsSize.indexOf(Math.max(...labelsSize)) + 1;
  const keep = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let k = 0;
    for (let dy = -1; dy <= 1 && !k; dy++) for (let dx = -1; dx <= 1; dx++) {
      const xx = x + dx, yy = y + dy;
      if (xx >= 0 && yy >= 0 && xx < w && yy < h && labels[yy * w + xx] === big) { k = 1; break; }
    }
    keep[y * w + x] = k;
  }
  const out = makeCanvas(src.width, src.height);
  const ctx = ctx2d(out);
  ctx.drawImage(src, 0, 0);
  const img = ctx.getImageData(0, 0, out.width, out.height);
  const sx = w / out.width, sy = h / out.height;
  for (let y = 0; y < out.height; y++) {
    const gy = Math.min(h - 1, Math.floor(y * sy));
    for (let x = 0; x < out.width; x++) if (!keep[gy * w + Math.min(w - 1, Math.floor(x * sx))]) img.data[(y * out.width + x) * 4 + 3] = 0;
  }
  ctx.putImageData(img, 0, 0);
  return out;
}

/** Overlay showing likely mistakes: stray bits in red (remove), enclosed gaps in green (keep). */
export function suggestionOverlay(src: HTMLCanvasElement) {
  const { a, w, h } = alphaGrid(src);
  const on = new Uint8Array(w * h);
  let count = 0;
  for (let i = 0; i < on.length; i++) if ((on[i] = a[i]! > 40 ? 1 : 0)) count++;
  const { labels, labelsSize } = componentSizes(on, w, h);
  const big = labelsSize.indexOf(Math.max(0, ...labelsSize)) + 1;
  const holes = findHoles(on, w, h, Math.max(2, count * 0.002));
  const g = makeCanvas(w, h);
  const ctx = ctx2d(g);
  const img = ctx.createImageData(w, h);
  let any = false;
  for (let i = 0; i < on.length; i++) {
    const stray = on[i] && labels[i] !== big;
    const hole = !on[i] && holes.ids.has(holes.labels[i]!);
    if (!stray && !hole) continue;
    any = true;
    img.data.set(stray ? [239, 68, 68, 170] : [34, 197, 94, 170], i * 4);
  }
  ctx.putImageData(img, 0, 0);
  return any ? g : null;
}

/** Add a solid outline (sticker style) around a transparent cutout. */
export function withOutline(src: HTMLCanvasElement, r: number, colour: string) {
  if (r <= 0) return src;
  const w = src.width + r * 2;
  const h = src.height + r * 2;
  const base = makeCanvas(w, h);
  const bctx = ctx2d(base);
  bctx.drawImage(src, r, r);
  const img = bctx.getImageData(0, 0, w, h);
  const alpha = new Float32Array(w * h);
  for (let i = 0; i < alpha.length; i++) alpha[i] = img.data[i * 4 + 3]! / 255;
  let a = pass(pass(alpha, w, h, r, "max", true), w, h, r, "max", false);
  a = pass(pass(a, w, h, 1, "avg", true), w, h, 1, "avg", false);
  const cr = parseInt(colour.slice(1, 3), 16), cg = parseInt(colour.slice(3, 5), 16), cb = parseInt(colour.slice(5, 7), 16);
  for (let i = 0; i < a.length; i++) {
    img.data[i * 4] = cr; img.data[i * 4 + 1] = cg; img.data[i * 4 + 2] = cb;
    img.data[i * 4 + 3] = Math.min(1, a[i]! * 1.5) * 255;
  }
  const out = makeCanvas(w, h);
  const octx = ctx2d(out);
  octx.putImageData(img, 0, 0);
  octx.drawImage(src, r, r);
  return out;
}

export function canvasToBlob(c: HTMLCanvasElement, type = "image/png", quality = 0.95) {
  return new Promise<Blob>((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error("Could not create image"))), type, quality));
}

/** Lossy formats only: lower the quality step by step until the file fits under maxBytes. */
export async function canvasUnder(c: HTMLCanvasElement, type = "image/png", maxBytes?: number) {
  let q = 0.95;
  let b = await canvasToBlob(c, type, q);
  if (!maxBytes || type === "image/png") return b;
  while (b.size > maxBytes && q > 0.2) { q = Math.round((q - 0.1) * 100) / 100; b = await canvasToBlob(c, type, q); }
  return b;
}
