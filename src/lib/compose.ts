import { pass, refineAlpha } from "@/lib/colour-background";

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
  return trim(c);
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

export function canvasToBlob(c: HTMLCanvasElement, type = "image/png") {
  return new Promise<Blob>((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error("Could not create image"))), type, 0.95));
}
