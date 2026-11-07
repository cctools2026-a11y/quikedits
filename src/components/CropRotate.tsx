import { useEffect, useMemo, useRef, useState } from "react";
import { RotateCcw, RotateCw } from "lucide-react";
import { prepareImage } from "@/lib/image-file";
import { initialRect, moveRect, rectToPixels, resizeRect, rotatedSize, type Rect } from "@/lib/crop";
import { Choice, Field, Range } from "@/components/ToolPage";

export type CropAspect = { id: string; label: string; ratio: number | null };
type Corner = "nw" | "ne" | "sw" | "se";

export function CropRotate({ file, aspects, heading, onDone, onSkip, onSkipAll }: {
  file: File; aspects: CropAspect[]; heading?: string | undefined;
  onDone: (f: File) => void; onSkip: () => void; onSkipAll?: (() => void) | undefined;
}) {
  const [bmp, setBmp] = useState<ImageBitmap | null>(null);
  const [quarter, setQuarter] = useState(0);
  const [fine, setFine] = useState(0);
  const [aspectId, setAspectId] = useState(aspects[0]?.id ?? "free");
  const [rect, setRect] = useState<Rect>({ x: 0, y: 0, w: 1, h: 1 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ mode: "move" | Corner; sx: number; sy: number; start: Rect } | null>(null);

  const ratio = aspects.find((a) => a.id === aspectId)?.ratio ?? null;
  const angle = quarter * 90 + fine;

  useEffect(() => {
    let alive = true;
    prepareImage(file).then(createImageBitmap).then((b) => { if (alive) setBmp(b); });
    return () => { alive = false; };
  }, [file]);

  const size = useMemo(() => (bmp ? rotatedSize(bmp.width, bmp.height, angle) : { w: 1, h: 1 }), [bmp, angle]);

  useEffect(() => { setRect(initialRect(ratio, size.w, size.h)); }, [ratio, size.w, size.h]);

  useEffect(() => {
    const c = canvasRef.current;
    if (!bmp || !c) return;
    draw(c, bmp, angle, size);
  }, [bmp, angle, size]);

  function point(e: React.PointerEvent) {
    const b = boxRef.current!.getBoundingClientRect();
    return { x: (e.clientX - b.left) / b.width, y: (e.clientY - b.top) / b.height };
  }
  function down(mode: "move" | Corner) {
    return (e: React.PointerEvent) => {
      e.stopPropagation();
      (e.target as Element).setPointerCapture(e.pointerId);
      const p = point(e);
      drag.current = { mode, sx: p.x, sy: p.y, start: rect };
    };
  }
  function move(e: React.PointerEvent) {
    const d = drag.current;
    if (!d) return;
    const p = point(e);
    setRect(d.mode === "move" ? moveRect(d.start, p.x - d.sx, p.y - d.sy) : resizeRect(d.start, d.mode, p.x, p.y, ratio, size.w, size.h));
  }

  async function apply() {
    if (!bmp) return;
    const full = document.createElement("canvas");
    draw(full, bmp, angle, size);
    const px = rectToPixels(rect, size.w, size.h);
    const out = document.createElement("canvas");
    out.width = px.w; out.height = px.h;
    out.getContext("2d")!.drawImage(full, px.x, px.y, px.w, px.h, 0, 0, px.w, px.h);
    const blob = await new Promise<Blob>((res, rej) => out.toBlob((b) => (b ? res(b) : rej(new Error("crop failed"))), "image/png"));
    onDone(new File([blob], file.name, { type: "image/png" }));
  }

  const corners: Corner[] = ["nw", "ne", "sw", "se"];
  return (
    <section className="grid gap-8 pt-6 md:grid-cols-[1fr_300px]">
      <div className="flex justify-center rounded-2xl bg-muted p-3">
        <div ref={boxRef} className="relative inline-block touch-none select-none" onPointerMove={move} onPointerUp={() => (drag.current = null)}>
          <canvas ref={canvasRef} className="block max-h-[65vh] max-w-full" />
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute shadow-[0_0_0_9999px_hsl(0_0%_0%/0.5)]" style={{ left: `${rect.x * 100}%`, top: `${rect.y * 100}%`, width: `${rect.w * 100}%`, height: `${rect.h * 100}%` }} />
          </div>
          <div
            onPointerDown={down("move")}
            className="absolute cursor-move border-2 border-primary-foreground outline outline-1 outline-primary"
            style={{ left: `${rect.x * 100}%`, top: `${rect.y * 100}%`, width: `${rect.w * 100}%`, height: `${rect.h * 100}%` }}
          >
            {corners.map((c) => (
              <span key={c} onPointerDown={down(c)} aria-label={`Resize ${c}`}
                className={`absolute h-5 w-5 rounded-full border-2 border-primary-foreground bg-primary ${c.includes("n") ? "-top-2.5" : "-bottom-2.5"} ${c.includes("w") ? "-left-2.5" : "-right-2.5"} ${c === "nw" || c === "se" ? "cursor-nwse-resize" : "cursor-nesw-resize"}`} />
            ))}
          </div>
        </div>
      </div>
      <aside className="space-y-6">
        <div>
          <h2 className="font-display text-2xl font-semibold">Crop &amp; straighten</h2>
          <p className="mt-1 text-sm text-muted-foreground">{heading ?? t("Drag the box to frame your photo.")}</p>
        </div>
        <Field label={t("Rotate")}>
          <div className="flex gap-2">
            <button type="button" onClick={() => setQuarter((q) => (q + 3) % 4)} className="flex items-center gap-1.5 rounded-full border border-border px-3.5 py-2 text-sm hover:bg-accent"><RotateCcw className="h-4 w-4" /> {t("Left")}</button>
            <button type="button" onClick={() => setQuarter((q) => (q + 1) % 4)} className="flex items-center gap-1.5 rounded-full border border-border px-3.5 py-2 text-sm hover:bg-accent"><RotateCw className="h-4 w-4" /> {t("Right")}</button>
          </div>
        </Field>
        <Field label={`Straighten: ${fine > 0 ? "+" : ""}${fine}°`}><Range label={t("Straighten")} value={fine} min={-15} max={15} step={0.5} onChange={setFine} /></Field>
        {aspects.length > 1 && <Field label={t("Crop shape")}><Choice value={aspectId} onChange={setAspectId} options={aspects} /></Field>}
        <div className="flex flex-col gap-2">
          <button type="button" onClick={apply} disabled={!bmp} className="rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground disabled:opacity-50">{t("Continue")}</button>
          <button type="button" onClick={onSkip} className="rounded-full border border-border px-5 py-3 font-medium hover:bg-accent">{t("Use as is")}</button>
          {onSkipAll && <button type="button" onClick={onSkipAll} className="text-sm text-muted-foreground underline">{t("Skip the rest")}</button>}
        </div>
      </aside>
    </section>
  );
}

function draw(c: HTMLCanvasElement, bmp: ImageBitmap, angle: number, size: { w: number; h: number }) {
  c.width = size.w; c.height = size.h;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, size.w, size.h);
  ctx.translate(size.w / 2, size.h / 2);
  ctx.rotate((angle * Math.PI) / 180);
  ctx.drawImage(bmp, -bmp.width / 2, -bmp.height / 2);
}
