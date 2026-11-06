import { useRef, useState } from "react";
import { ImagePlus } from "lucide-react";

/** Large photo upload and drop zone. */
export function UploadZone({ onFiles, multiple = false, maxNote }: {
  onFiles: (files: File[]) => void; multiple?: boolean; tool: string; maxNote?: string | undefined;
}) {
  const [drag, setDrag] = useState(false);
  const input = useRef<HTMLInputElement>(null);

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
    </div>
  );
}
