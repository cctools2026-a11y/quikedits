import { useRef, useState } from "react";
import { ImagePlus, Loader2, Wand2 } from "lucide-react";
import { sampleFile, TOOL_MEDIA } from "@/lib/tool-media";

/** Large drop zone plus a "try a sample" button that feeds the bundled example photo. */
export function UploadZone({ onFiles, multiple = false, tool, maxNote }: {
  onFiles: (files: File[]) => void; multiple?: boolean; tool: string; maxNote?: string | undefined;
}) {
  const [drag, setDrag] = useState(false);
  const [loading, setLoading] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const sample = TOOL_MEDIA[tool];

  async function trySample() {
    setLoading(true);
    try { onFiles([await sampleFile(tool)]); } finally { setLoading(false); }
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => input.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); onFiles(Array.from(e.dataTransfer.files)); }}
        className={`group relative flex w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-3xl border-2 border-dashed px-6 py-12 text-center shadow-lift transition-all sm:py-14 ${drag ? "scale-[1.01] border-primary bg-accent" : "border-border bg-card hover:-translate-y-0.5 hover:border-primary/60"}`}
      >
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-float transition-transform group-hover:-rotate-6 group-hover:scale-105">
          <ImagePlus className="h-8 w-8" />
        </span>
        <span className="font-display text-xl font-semibold">{multiple ? "Drop photos here or tap to upload" : "Drop a photo here or tap to upload"}</span>
        <span className="text-sm text-muted-foreground">JPG, PNG or WebP · up to 25 MB{maxNote ? ` · ${maxNote}` : ""}</span>
      </button>
      <input ref={input} type="file" multiple={multiple} accept="image/jpeg,image/png,image/webp" className="hidden"
        onChange={(e) => { onFiles(Array.from(e.target.files ?? [])); e.target.value = ""; }} />
      {sample && (
        <button type="button" onClick={trySample} disabled={loading}
          className="mt-3 inline-flex items-center gap-2 rounded-full border border-border bg-card py-1.5 pl-1.5 pr-4 text-sm font-medium shadow-lift transition-colors hover:border-primary/60 disabled:opacity-60">
          <img src={sample.before} alt="" width={28} height={28} className="h-7 w-7 rounded-full object-cover" />
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4 text-primary" />}
          No photo handy? Try ours
        </button>
      )}
    </div>
  );
}
