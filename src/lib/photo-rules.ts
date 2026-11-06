export type PhotoRules = { best: string; good: string[]; avoid: string[]; checkTop?: boolean };

export const PHOTO_RULES: Record<string, PhotoRules> = {
  "/": { best: "Best with one clear person, pet or object.", good: ["Subject in focus", "Clear gap from the background"], avoid: ["Crowds or scenery", "Screenshots or text"] },
  "/colour-background": { best: "Best with one person or object in focus.", good: ["Subject in focus", "Even light"], avoid: ["Busy group shots", "Blurry photos"] },
  "/product-photo": { best: "Best with one product filling most of the photo.", good: ["One product per photo", "Daylight, plain surface"], avoid: ["Several items scattered", "See-through glass"] },
  "/passport-photo": { best: "Best with one face, front-on, head and shoulders.", good: ["Face the camera", "Plain wall behind you", "No shadows on your face"], avoid: ["Side views", "Sunglasses or hats", "Other people in the photo"], checkTop: true },
  "/profile-picture": { best: "Best with one head-and-shoulders photo.", good: ["Head and shoulders", "Soft window light"], avoid: ["Full-body or far-away shots", "Group photos"], checkTop: true },
  "/sticker-maker": { best: "Best with a close-up of one person, pet or object.", good: ["Close-up", "Whole subject in the photo"], avoid: ["Wide scenes", "Tiny subjects"] },
  "/photo-background": { best: "Best with one person or object, plus a separate backdrop photo.", good: ["One person or object", "Similar light to your backdrop"], avoid: ["Group shots", "Scenery as the subject"] },
  "/logo-cleaner": { best: "Best with dark ink or a logo on plain, even paper or colour.", good: ["Dark ink on white paper", "Flat, no shadows"], avoid: ["Photos of people", "Patterned or creased paper"] },
};

export const SMALL_EDGE = 300;

export type Analysis = { coverage: number; pieces: number; largestShare: number; touchesTop: boolean };

/** Look at a cutout's alpha (0-255 per pixel) and describe what was kept. */
export function analyseAlpha(alpha: ArrayLike<number>, w: number, h: number, threshold = 40): Analysis {
  const on = new Uint8Array(w * h);
  let count = 0;
  for (let i = 0; i < on.length; i++) if (alpha[i]! > threshold) { on[i] = 1; count++; }
  const sizes = componentSizes(on, w, h).labelsSize;
  const minPiece = Math.max(2, count * 0.002);
  const real = sizes.filter((s) => s >= minPiece);
  const largest = Math.max(0, ...sizes);
  let top = 0;
  for (let x = 0; x < w; x++) top += on[x]!;
  return { coverage: count / (w * h), pieces: real.length, largestShare: count ? largest / count : 0, touchesTop: top > w * 0.08 };
}

/** 4-connected component labelling. Returns label per pixel (0 = empty) and size per label (index = label-1). */
export function componentSizes(on: Uint8Array, w: number, h: number) {
  const labels = new Int32Array(w * h);
  const labelsSize: number[] = [];
  const stack: number[] = [];
  for (let i = 0; i < on.length; i++) {
    if (!on[i] || labels[i]) continue;
    const id = labelsSize.length + 1;
    let size = 0;
    stack.push(i);
    labels[i] = id;
    while (stack.length) {
      const p = stack.pop()!;
      size++;
      const x = p % w, y = (p - x) / w;
      const n = [x > 0 ? p - 1 : -1, x < w - 1 ? p + 1 : -1, y > 0 ? p - w : -1, y < h - 1 ? p + w : -1];
      for (const q of n) if (q >= 0 && on[q] && !labels[q]) { labels[q] = id; stack.push(q); }
    }
    labelsSize.push(size);
  }
  return { labels, labelsSize };
}

export type Cue = { id: "empty" | "full" | "stray" | "top" | "small"; text: string };

export function cuesFor(tool: string, a: Analysis, small: boolean): Cue[] {
  const out: Cue[] = [];
  if (a.coverage < 0.03) out.push({ id: "empty", text: "We couldn't find a clear subject. Try a photo where the person or object stands out from the background." });
  else if (a.coverage > 0.9) out.push({ id: "full", text: "The background looks too similar to the subject, so little was removed. Try a plainer background." });
  if (a.coverage >= 0.03 && a.pieces > 1 && a.largestShare < 0.995) out.push({ id: "stray", text: "We found a few stray bits. Tap “Clean up stray bits” to keep only the main subject." });
  if (PHOTO_RULES[tool]?.checkTop && a.touchesTop && a.coverage >= 0.03) out.push({ id: "top", text: "Your head looks cut off at the top. Use a photo with space above your head." });
  if (small) out.push({ id: "small", text: "This photo is small, so the result may look soft." });
  return out;
}

/** Logo cleaner: are the four corners roughly one colour? */
export function cornersUneven(corners: [number, number, number][], limit = 40) {
  let max = 0;
  for (const a of corners) for (const b of corners) max = Math.max(max, Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]));
  return max > limit;
}
