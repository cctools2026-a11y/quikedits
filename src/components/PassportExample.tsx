import { useT } from "@/lib/use-i18n";
import { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CompareSlider } from "@/components/CompareSlider";
import { Field, Range, useRenderedUrl } from "@/components/ToolPage";
import { blobToCanvas, ctx2d, makeCanvas } from "@/lib/compose";
import { documentCrop } from "@/lib/passport-crop";
import { TOOL_MEDIA } from "@/lib/tool-media";
import { PASSPORT_SIZES, passportPx } from "@/lib/tool-sizes";

export type PassportSizeId = (typeof PASSPORT_SIZES)[number]["id"];

export function PassportSizeSelect({ value, onChange }: { value: PassportSizeId; onChange: (id: PassportSizeId) => void }) {
  const t = useT();
  return <div className="block text-sm font-medium">
    <span>{t("Document size")}</span>
    <Select value={value} onValueChange={(v) => {
      const selected = PASSPORT_SIZES.find((s) => s.id === v);
      if (selected) onChange(selected.id);
    }}>
      <SelectTrigger aria-label={t("Document size")} className="mt-2 h-12 w-full rounded-xl border-border bg-card px-4 text-base shadow-sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="rounded-xl border-border bg-card p-1 shadow-lg">
        {PASSPORT_SIZES.map((s) => (
          <SelectItem key={s.id} value={s.id} className="rounded-lg py-2.5 text-base focus:bg-primary/10 focus:text-foreground data-[state=checked]:font-semibold data-[state=checked]:text-primary">
            {t(s.label)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>;
}

export function PassportExample({ sizeId, onSizeChange }: { sizeId: PassportSizeId; onSizeChange: (id: PassportSizeId) => void }) {
  const t = useT();
  const [photos, setPhotos] = useState<HTMLCanvasElement[]>([]);
  const [error, setError] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [x, setX] = useState(50);
  const [y, setY] = useState(50);
  const preset = PASSPORT_SIZES.find((s) => s.id === sizeId) ?? PASSPORT_SIZES[1];
  const size = passportPx(preset);
  const loc = useLocale();
  const media = useMemo(() => mediaFor(useEnPathPassport(enPath), loc), [enPath, loc]);
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
  return <div className="mx-auto w-full max-w-sm space-y-4 rounded-[1.75rem] border-4 border-foreground bg-card p-4 shadow-float">
    <div className="overflow-hidden rounded-2xl">
      {before && after ? <CompareSlider before={before} after={after} beforeAlt={t("Asian teenage girl before document crop")} afterAlt={t("Asian teenage girl with white background")} /> : <div className="flex min-h-80 items-center justify-center bg-muted text-sm text-muted-foreground">{error ? t("Example could not load") : t("Loading example…")}</div>}
    </div>
    <PassportSizeSelect value={sizeId} onChange={onSizeChange} />
    <details className="group border-b border-border pb-3 text-sm">
      <summary className="cursor-pointer py-2 font-medium">{t("Adjust example crop")}</summary>
      <div className="space-y-4 pt-3">
        <Field label={t("Zoom: {n}%", { n: zoom })}><Range label={t("Example zoom")} value={zoom} min={100} max={180} onChange={setZoom} /></Field>
        <Field label={t("Horizontal position")}><Range label={t("Example horizontal position")} value={x} min={0} max={100} onChange={setX} /></Field>
        <Field label={t("Vertical position")}><Range label={t("Example vertical position")} value={y} min={0} max={100} onChange={setY} /></Field>
        <Button variant="outline" onClick={() => { setZoom(100); setX(50); setY(50); }}><RotateCcw />{t("Reset crop")}</Button>
      </div>
    </details>
    <p className="text-xs text-muted-foreground">{size.w} × {size.h} px · 300 dpi. Check your document’s official photo requirements.</p>
  </div>;
}