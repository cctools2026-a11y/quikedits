import { zipSync } from "fflate";

/** Pack finished image URLs into a single ZIP blob, in the browser. */
export async function zipUrls(files: { url: string; name: string }[]) {
  const entries: Record<string, Uint8Array> = {};
  const used = new Set<string>();
  for (const f of files) {
    let n = f.name, i = 2;
    while (used.has(n)) n = f.name.replace(/(\.[a-z]+)$/i, `-${i++}$1`);
    used.add(n);
    entries[n] = new Uint8Array(await (await fetch(f.url)).arrayBuffer());
  }
  return new Blob([zipSync(entries, { level: 0 })], { type: "application/zip" });
}

/** Unique file names for a batch. */
export function uniqueNames(names: string[]) {
  const seen = new Map<string, number>();
  return names.map((n) => {
    const c = seen.get(n) ?? 0;
    seen.set(n, c + 1);
    return c ? n.replace(/(\.[a-z]+)$/i, `-${c + 1}$1`) : n;
  });
}
