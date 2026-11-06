import { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CompareSlider } from "@/components/CompareSlider";
import { Field, Range, useRenderedUrl } from "@/components/ToolPage";
import { blobToCanvas, ctx2d, makeCanvas } from "@/lib/compose";
import { documentCrop } from "@/lib/passport-crop";
import { TOOL_MEDIA } from "@/lib/tool-media";
import { PASSPORT_SIZES, passportPx } from "@/lib/tool-sizes";

export type PassportSizeId = (typeof PASSPORT_SIZES)[number]["id"];

export function PassportSizeSelect({ value, onChange }: { value: PassportSizeId; onChange: (id: PassportSizeId) => void }) {
  return <label className="block text-sm font-medium">Document size
    <select aria-label="Document size" value={value} onChange={(e) => {
      const selected = PASSPORT_SIZES.find((s) => s.id === e.target.value);
      if (selected) onChange(selected.id);
    }} className="mt-2 h-11 w-full rounded-md border border-border bg-card px-3 text-foreground focus-visible:outline-ring">
      {PASSPORT_SIZES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
    </select>
  </label>;
}

export function PassportExample({ sizeId, onSizeChange }: { sizeId: PassportSizeId; onSizeChange: (id: PassportSizeId) => void }) {
  const [photos, setPhotos] = useState<HTMLCanvasElement[]>([]);
  const [error, setError] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [x, setX] = useState(50);
  const [y, setY] = useState(50);
  const preset = PASSPORT_SIZES.find((s) => s.id === sizeId) ?? PASSPORT_SIZES[1];
  const size = passportPx(preset);
  const media = TOOL_MEDIA["/passport-photo"];
  useEffect(() => {
    if (!media) return;
    let active = true;
    Promise.all([media.before, media.after].map(async (url) => {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Example unavailable");
      return blobToCanvas(await response.blob());
    })).then((result) => { if (active) setPhotos(result); }).catch(() => { if (active) setError(true); });
    return () => { active = false; };
  }, [media]);
  function draw(index: number) {
    const photo = photos[index];
    if (!photo) return null;
    const crop = documentCrop(photo.width, photo.height, size.w, size.h, zoom, x, y);
    const canvas = makeCanvas(size.w, size.h);
    ctx2d(canvas).drawImage(photo, crop.x, crop.y, crop.w, crop.h, 0, 0, size.w, size.h);
    return canvas;
  }
  const before = useRenderedUrl(() => draw(0), [photos, size.w, size.h, zoom, x, y]);
  const after = useRenderedUrl(() => draw(1), [photos, size.w, size.h, zoom, x, y]);
  return <div className="mx-auto w-full max-w-md space-y-4">
    <div className="mx-auto max-w-xs">
      {before && after ? <CompareSlider before={before} after={after} beforeAlt="Asian teenage girl before document crop" afterAlt="Asian teenage girl with white background" /> : <div className="flex min-h-80 items-center justify-center bg-muted text-sm text-muted-foreground">{error ? "Example could not load" : "Loading example…"}</div>}
    </div>
    <PassportSizeSelect value={sizeId} onChange={onSizeChange} />
    <details className="group border-b border-border pb-3 text-sm">
      <summary className="cursor-pointer py-2 font-medium">Adjust example crop</summary>
      <div className="space-y-4 pt-3">
        <Field label={`Zoom: ${zoom}%`}><Range label="Example zoom" value={zoom} min={100} max={180} onChange={setZoom} /></Field>
        <Field label="Horizontal position"><Range label="Example horizontal position" value={x} min={0} max={100} onChange={setX} /></Field>
        <Field label="Vertical position"><Range label="Example vertical position" value={y} min={0} max={100} onChange={setY} /></Field>
        <Button variant="outline" onClick={() => { setZoom(100); setX(50); setY(50); }}><RotateCcw />Reset crop</Button>
      </div>
    </details>
    <p className="text-xs text-muted-foreground">{size.w} × {size.h} px · 300 dpi. Check your document’s official photo requirements.</p>
  </div>;
}