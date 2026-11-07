import { useT } from "@/lib/use-i18n";
import { useEffect, useRef, useState } from "react";
import { Minus, Plus, Undo2 } from "lucide-react";
import { ctx2d, makeCanvas, suggestionOverlay } from "@/lib/compose";
import { Field, Range } from "@/components/ToolPage";

/** Paint to keep (restore from the original photo) or remove parts of a cutout. */
export function TouchUp({ cut, source, onDone, onCancel }: {
  cut: HTMLCanvasElement; source: HTMLCanvasElement; onDone: (c: HTMLCanvasElement) => void; onCancel: () => void;
}) {
  const t = useT();
  const work = useRef<HTMLCanvasElement>(null as unknown as HTMLCanvasElement);
  const view = useRef<HTMLCanvasElement>(null);
  const history = useRef<ImageData[]>([]);
  const painting = useRef(false);
  const [mode, setMode] = useState<"keep" | "remove">("remove");
  const [size, setSize] = useState(30);
  const [zoom, setZoom] = useState(1);
  const [, force] = useState(0);
  const [hints, setHints] = useState(true);
  const overlay = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const w = makeCanvas(cut.width, cut.height);
    ctx2d(w).drawImage(cut, 0, 0);
    work.current = w;
    overlay.current = suggestionOverlay(cut);
    redraw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cut]);

  function redraw() {
    const v = view.current, w = work.current;
    if (!v || !w) return;
    v.width = w.width; v.height = w.height;
    const ctx = ctx2d(v);
    ctx.globalAlpha = 0.25;
    ctx.drawImage(source, 0, 0, w.width, w.height);
    ctx.globalAlpha = 1;
    ctx.drawImage(w, 0, 0);
    if (hintsRef.current && overlay.current) {
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(overlay.current, 0, 0, w.width, w.height);
    }
  }
  const hintsRef = useRef(hints);
  useEffect(() => { hintsRef.current = hints; redraw(); }, [hints]);

  function dab(e: React.PointerEvent) {
    const v = view.current!, b = v.getBoundingClientRect();
    const x = ((e.clientX - b.left) / b.width) * v.width, y = ((e.clientY - b.top) / b.height) * v.height;
    const r = (size / 1000) * Math.max(v.width, v.height);
    const ctx = ctx2d(work.current);
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    if (mode === "remove") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.fill();
    } else {
      ctx.clip();
      ctx.drawImage(source, 0, 0, v.width, v.height);
    }
    ctx.restore();
    redraw();
  }

  function down(e: React.PointerEvent) {
    const w = work.current;
    history.current.push(ctx2d(w).getImageData(0, 0, w.width, w.height));
    if (history.current.length > 20) history.current.shift();
    painting.current = true;
    (e.target as Element).setPointerCapture(e.pointerId);
    dab(e);
    force((n) => n + 1);
  }

  function undo() {
    const last = history.current.pop();
    if (last) { ctx2d(work.current).putImageData(last, 0, 0); redraw(); force((n) => n + 1); }
  }
  function resetAll() {
    const w = work.current;
    const ctx = ctx2d(w);
    ctx.clearRect(0, 0, w.width, w.height);
    ctx.drawImage(cut, 0, 0);
    history.current = [];
    redraw();
    force((n) => n + 1);
  }

  const btn = (on: boolean) => `rounded-full border px-4 py-2 text-sm font-medium ${on ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-accent"}`;

  return (
    <div className="mb-8 grid gap-6 md:grid-cols-[1fr_260px]">
      <div className="checkerboard max-h-[70vh] overflow-auto rounded-2xl p-2">
        <canvas
          ref={view}
          onPointerDown={down}
          onPointerMove={(e) => painting.current && dab(e)}
          onPointerUp={() => (painting.current = false)}
          className="mx-auto block touch-none"
          style={{ width: `${zoom * 100}%`, cursor: "crosshair" }}
        />
      </div>
      <aside className="space-y-5">
        <div>
          <h2 className="font-display text-xl font-semibold">{t("Touch up")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("Paint “Keep” on anything that should stay, “Remove” on anything that should go. The faded parts are what was removed.")}</p>
        </div>
        {overlay.current && (
          <div className="rounded-xl bg-accent p-3 text-sm text-accent-foreground">
            <p><span className="font-semibold">{t("Red")}</span>{t(": probably leftover background. Paint Remove.")}</p>
            <p className="mt-1"><span className="font-semibold">{t("Green")}</span>{t(": gaps inside your subject. Paint Keep if they should be filled.")}</p>
            <label className="mt-2 flex items-center gap-2"><input type="checkbox" checked={hints} onChange={(e) => setHints(e.target.checked)} className="accent-primary" /> {t("Show suggestions")}</label>
          </div>
        )}
        <div className="flex gap-2">
          <button type="button" aria-pressed={mode === "keep"} onClick={() => setMode("keep")} className={btn(mode === "keep")}>{t("Keep")}</button>
          <button type="button" aria-pressed={mode === "remove"} onClick={() => setMode("remove")} className={btn(mode === "remove")}>{t("Remove")}</button>
        </div>
        <Field label={`Brush size: ${size}`}><Range label={t("Brush size")} value={size} min={5} max={120} onChange={setSize} /></Field>
        <div className="flex flex-wrap gap-2">
          <button type="button" aria-label={t("Zoom out")} onClick={() => setZoom((z) => Math.max(1, z - 0.5))} className={btn(false)}><Minus className="h-4 w-4" /></button>
          <button type="button" aria-label={t("Zoom in")} onClick={() => setZoom((z) => Math.min(4, z + 0.5))} className={btn(false)}><Plus className="h-4 w-4" /></button>
          <button type="button" onClick={undo} disabled={!history.current.length} className={`${btn(false)} flex items-center gap-1.5 disabled:opacity-50`}><Undo2 className="h-4 w-4" /> {t("Undo")}</button>
          <button type="button" onClick={resetAll} className={btn(false)}>{t("Reset")}</button>
        </div>
        <div className="flex flex-col gap-2">
          <button type="button" onClick={() => onDone(work.current)} className="rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground">{t("Done")}</button>
          <button type="button" onClick={onCancel} className="rounded-full border border-border px-5 py-3 font-medium hover:bg-accent">{t("Cancel")}</button>
        </div>
      </aside>
    </div>
  );
}
