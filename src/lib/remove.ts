import { prepareImage } from "@/lib/image-file";

export type Phase = "download" | "process";

/** Runs the AI background removal on the visitor's device using the self-hosted model. */
export async function removeBg(file: File, onProgress: (phase: Phase, pct: number) => void, fast = false) {
  const { removeBackground } = await import("@imgly/background-removal");
  const input = await prepareImage(file);
  return removeBackground(input, {
    publicPath: `${window.location.origin}/imgly/`,
    model: fast ? "isnet_quint8" : "isnet_fp16",
    output: { format: "image/png" },
    progress: (key, current, total) =>
      onProgress(key.startsWith("fetch") ? "download" : "process", total ? Math.round((current / total) * 100) : 0),
  });
}

export function friendlyError(e: unknown) {
  const msg = e instanceof Error ? e.message : String(e);
  if (/memory|allocation/i.test(msg)) return "Your device ran out of memory. Try a smaller image.";
  if (/fetch|network/i.test(msg)) return "Couldn't download the AI model. Check your connection and try again.";
  return "Something went wrong. Please try again.";
}
