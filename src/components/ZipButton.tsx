import { useCallback, useState } from "react";
import { FileArchive, Loader2 } from "lucide-react";
import { zipUrls } from "@/lib/zip";

/** Download every finished image at once as a ZIP. */
export function ZipButton({ files, name }: { files: { url: string | null; name: string }[]; name: string }) {
  const [busy, setBusy] = useState(false);
  const ready = files.filter((f): f is { url: string; name: string } => !!f.url);
  if (files.length < 2) return null;
  return (
    <button type="button" disabled={busy || ready.length < files.length}
      onClick={async () => {
        setBusy(true);
        try {
          const url = URL.createObjectURL(await zipUrls(ready));
          const a = document.createElement("a");
          a.href = url; a.download = name; a.click();
          setTimeout(() => URL.revokeObjectURL(url), 5000);
        } finally { setBusy(false); }
      }}
      className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-lg font-semibold text-primary-foreground shadow-lg disabled:opacity-50">
      {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <FileArchive className="h-5 w-5" />} Download all ({files.length}) as ZIP
    </button>
  );
}

/** Collect each batch item's finished URL so they can be zipped together. */
export function useUrlMap() {
  const [urls, setUrls] = useState<Record<number, string | null>>({});
  const report = useCallback((i: number, url: string | null) => setUrls((m) => (m[i] === url ? m : { ...m, [i]: url })), []);
  return [urls, report] as const;
}
