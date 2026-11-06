export const PALETTE = [
  "#FFFFFF", "#000000", "#F5F0E8", "#9CA3AF", "#EF4444", "#F97316",
  "#FACC15", "#22C55E", "#14B8A6", "#3B82F6", "#6366F1", "#EC4899",
] as const;

/** Only solid 6-digit hex colours are allowed as backgrounds. */
export function isSolidHex(c: string) {
  return /^#[0-9a-fA-F]{6}$/.test(c);
}

/** Separable min (erode) or box-average filter over a w×h channel. */
function pass(src: Float32Array, w: number, h: number, r: number, mode: "min" | "avg", horiz: boolean) {
  const out = new Float32Array(src.length);
  const len = horiz ? w : h;
  const lines = horiz ? h : w;
  for (let l = 0; l < lines; l++) {
    for (let i = 0; i < len; i++) {
      let acc = mode === "min" ? Infinity : 0;
      let n = 0;
      for (let k = Math.max(0, i - r); k <= Math.min(len - 1, i + r); k++) {
        const v = src[horiz ? l * w + k : k * w + l];
        if (mode === "min") acc = Math.min(acc, v);
        else acc += v;
        n++;
      }
      out[horiz ? l * w + i : i * w + l] = mode === "min" ? acc : acc / n;
    }
  }
  return out;
}

/**
 * Clean up the mask edge: shrink it slightly to cut off the leftover halo of the
 * old background, then soften so the edge blends smoothly into the new colour.
 */
export function refineAlpha(alpha: Float32Array, w: number, h: number, erode: number, feather: number) {
  let a = alpha;
  if (erode > 0) a = pass(pass(a, w, h, erode, "min", true), w, h, erode, "min", false);
  if (feather > 0) a = pass(pass(a, w, h, feather, "avg", true), w, h, feather, "avg", false);
  return a;
}

/** Paint the cutout over a single solid colour and return a PNG blob. */
export async function compositeOnColour(cutout: Blob, colour: string): Promise<Blob> {
  if (!isSolidHex(colour)) throw new Error("Invalid colour");
  const bmp = await createImageBitmap(cutout);
  const { width: w, height: h } = bmp;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(bmp, 0, 0);
  bmp.close();

  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  const alpha = new Float32Array(w * h);
  for (let i = 0; i < alpha.length; i++) alpha[i] = d[i * 4 + 3] / 255;
  const scale = Math.max(w, h) / 1000;
  const a = refineAlpha(alpha, w, h, Math.max(1, Math.round(1.5 * scale)), Math.max(1, Math.round(scale)));

  const br = parseInt(colour.slice(1, 3), 16);
  const bg = parseInt(colour.slice(3, 5), 16);
  const bb = parseInt(colour.slice(5, 7), 16);
  for (let i = 0; i < a.length; i++) {
    // Hardens mid-tones a little so stray semi-transparent fringe disappears.
    const t = Math.min(1, Math.max(0, (a[i] - 0.1) / 0.8));
    const p = i * 4;
    d[p] = d[p] * t + br * (1 - t);
    d[p + 1] = d[p + 1] * t + bg * (1 - t);
    d[p + 2] = d[p + 2] * t + bb * (1 - t);
    d[p + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return await new Promise<Blob>((res, rej) =>
    canvas.toBlob((b) => (b ? res(b) : rej(new Error("Could not create image"))), "image/png"),
  );
}
