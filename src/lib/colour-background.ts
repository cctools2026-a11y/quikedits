export const PALETTE = [
  "#FFFFFF", "#000000", "#F5F0E8", "#9CA3AF", "#EF4444", "#F97316",
  "#FACC15", "#22C55E", "#14B8A6", "#3B82F6", "#6366F1", "#EC4899",
] as const;

/** Only solid 6-digit hex colours are allowed as backgrounds. */
export function isSolidHex(c: string) {
  return /^#[0-9a-fA-F]{6}$/.test(c);
}

/** Paint the cutout over a single solid colour and return a PNG blob. */
export async function compositeOnColour(cutout: Blob, colour: string): Promise<Blob> {
  if (!isSolidHex(colour)) throw new Error("Invalid colour");
  const bmp = await createImageBitmap(cutout);
  const canvas = document.createElement("canvas");
  canvas.width = bmp.width;
  canvas.height = bmp.height;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = colour;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bmp, 0, 0);
  bmp.close();
  return await new Promise<Blob>((res, rej) =>
    canvas.toBlob((b) => (b ? res(b) : rej(new Error("Could not create image"))), "image/png"),
  );
}
