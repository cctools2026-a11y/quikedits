export const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const MAX_FILE_BYTES = 25 * 1024 * 1024;
export const MAX_EDGE = 2048;

export function validateImageFile(file: { type: string; size: number }): string | null {
  if (!(ACCEPTED_TYPES as readonly string[]).includes(file.type)) {
    return "Unsupported file. Please choose a JPG, PNG or WebP image.";
  }
  if (file.size > MAX_FILE_BYTES) {
    return "That image is larger than 25 MB. Please choose a smaller file.";
  }
  return null;
}

export function fitWithin(w: number, h: number, max = MAX_EDGE) {
  const scale = Math.min(1, max / Math.max(w, h));
  return { width: Math.round(w * scale), height: Math.round(h * scale), scaled: scale < 1 };
}

/** Downscale large images in the browser to keep memory use reasonable on slow devices. */
export async function prepareImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const { width, height, scaled } = fitWithin(bitmap.width, bitmap.height);
  if (!scaled) {
    bitmap.close();
    return file;
  }
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  return await new Promise<Blob>((res, rej) =>
    canvas.toBlob((b) => (b ? res(b) : rej(new Error("Could not prepare image"))), "image/png"),
  );
}
