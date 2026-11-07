import { useRef, useState } from "react";
import { Camera, ImagePlus } from "lucide-react";
import { CameraCapture } from "@/components/CameraCapture";
import { PhotoTips } from "@/components/PhotoTips";
import { SignatureDraw } from "@/components/SignatureDraw";
import { Button } from "@/components/ui/button";

/** Large photo upload and drop zone. */
export function UploadZone({ onFiles, multiple = false, tool, maxNote, drawSignature = false }: {
  onFiles: (files: File[]) => void; multiple?: boolean; tool: string; maxNote?: string | undefined; drawSignature?: boolean;
}) {
  const [drag, setDrag] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const [camera, setCamera] = useState(false);

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
        <span className="font-display text-xl font-semibold">{multiple ? t("Drop photos here or tap to upload") : t("Drop a photo here or tap to upload")}</span>
        <span className="text-sm text-muted-foreground">JPG, PNG or WebP · up to 25 MB{maxNote ? ` · ${maxNote}` : ""}</span>
      </button>
      <input ref={input} type="file" multiple={multiple} accept="image/jpeg,image/png,image/webp" className="hidden"
        onChange={(e) => { onFiles(Array.from(e.target.files ?? [])); e.target.value = ""; }} />
      {drawSignature ? (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Button variant="start-option" onClick={() => setCamera(true)}><Camera /> {t("Take a photo")}</Button>
          <SignatureDraw onFiles={onFiles} />
        </div>
      ) : <button type="button" onClick={() => setCamera(true)}
        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border-4 border-foreground bg-card px-5 py-2.5 font-display text-xl tracking-wide transition-colors hover:border-primary hover:bg-accent focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary">
        <Camera className="h-5 w-5" /> Or take a photo
      </button>}
      <CameraCapture open={camera} onOpenChange={setCamera} onCapture={(f) => onFiles([f])} />
      <PhotoTips tool={tool} />
    </div>
  );
}
