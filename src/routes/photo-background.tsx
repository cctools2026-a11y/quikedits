import { toolHead } from "@/lib/seo";
import { ToolLanding } from "@/components/ToolLanding";
import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Check, ImagePlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BACKGROUND_PRESETS } from "@/lib/background-presets";
import { ToolPage, useRenderedUrl, Field, Range, ResultActions, baseName } from "@/components/ToolPage";
import { blobToCanvas, ctx2d, makeCanvas } from "@/lib/compose";
import { prepareImage, validateImageFile } from "@/lib/image-file";

export const Route = createFileRoute("/photo-background")({
  head: () => toolHead("/photo-background"),
  component: PhotoBackground,
});

function PhotoBackground() {
  return (
    <ToolPage
      tool="/photo-background"
      below={<ToolLanding path="/photo-background" />}
      title={<>Put yourself <span className="text-primary">anywhere</span>.</>}
      intro="Upload your photo, then pick a playful background or add your own picture."
    >
      {(items, reset) => <Composer cut={items[0]?.cutout ?? null} name={items[0] ? baseName(items[0].file) : "photo"} reset={reset} />}
    </ToolPage>
  );
}

function Composer({ cut, name, reset }: { cut: HTMLCanvasElement | null; name: string; reset: () => void }) {
  const [backdrop, setBackdrop] = useState<HTMLCanvasElement | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [scale, setScale] = useState(70);
  const [x, setX] = useState(50);
  const [y, setY] = useState(100);
  const ref = useRef<HTMLInputElement>(null);
  const request = useRef(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function loadBackdrop(load: () => Promise<Blob>, id: string) {
    const token = ++request.current;
    setErr(null);
    setLoading(true);
    try {
      const canvas = await blobToCanvas(await load());
      if (token !== request.current) return;
      setBackdrop(canvas);
      setSelected(id);
    } catch {
      if (token === request.current) setErr("Couldn't open that background. Please try again.");
    } finally {
      if (token === request.current) setLoading(false);
    }
  }

  async function pickBackdrop(f: File | undefined) {
    if (!f) return;
    const e = validateImageFile(f);
    setErr(e);
    if (!e) await loadBackdrop(() => prepareImage(f), "custom");
  }

  const url = useRenderedUrl(() => {
    if (!cut || !backdrop) return null;
    const c = makeCanvas(backdrop.width, backdrop.height);
    const ctx = ctx2d(c);
    ctx.drawImage(backdrop, 0, 0);
    const h = backdrop.height * (scale / 100);
    const w = (cut.width / cut.height) * h;
    ctx.drawImage(cut, (backdrop.width - w) * (x / 100), (backdrop.height - h) * (y / 100), w, h);
    return c;
  }, [cut, backdrop, scale, x, y]);

  return (
    <div className="grid gap-8 md:grid-cols-[300px_1fr]">
      <aside className="space-y-6">
        <div>
          <h2 className="font-display mb-3 text-lg font-semibold">Pick a background</h2>
          <div className="grid grid-cols-3 gap-2" role="group" aria-label="Playful background presets">
            {BACKGROUND_PRESETS.map((preset) => (
              <Button key={preset.id} variant="outline" aria-label={`Apply ${preset.name} background`} aria-pressed={selected === preset.id}
                className="relative h-auto flex-col gap-0 overflow-hidden p-0 whitespace-normal aria-pressed:border-primary aria-pressed:ring-2 aria-pressed:ring-primary"
                onClick={() => void loadBackdrop(async () => {
                  const response = await fetch(preset.src);
                  if (!response.ok) throw new Error("Background unavailable");
                  return response.blob();
                }, preset.id)}>
                <img src={preset.src} alt="" width={1024} height={1024} loading="lazy" className="aspect-square w-full object-cover" />
                <span className="py-2 text-xs">{preset.name}</span>
                {selected === preset.id && <span className="absolute right-1 top-1 rounded-full bg-primary p-1 text-primary-foreground"><Check /></span>}
              </Button>
            ))}
          </div>
        </div>
        <Button variant="outline" onClick={() => ref.current?.click()} className="h-auto w-full rounded-full px-4 py-3 whitespace-normal">
          <ImagePlus className="h-4 w-4" /> {backdrop ? "Change background photo" : "Choose background photo"}
        </Button>
        <input ref={ref} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => { void pickBackdrop(e.target.files?.[0]); e.target.value = ""; }} />
        {err && <p role="alert" className="text-sm text-destructive">{err}</p>}
        {loading && <p role="status" className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Opening background…</p>}
        <Field label={`Size: ${scale}%`}><Range label="Size" value={scale} min={10} max={120} onChange={setScale} /></Field>
        <Field label="Left / right"><Range label="Horizontal position" value={x} min={0} max={100} onChange={setX} /></Field>
        <Field label="Up / down"><Range label="Vertical position" value={y} min={0} max={100} onChange={setY} /></Field>
      </aside>
      <div>
        {url ? <img src={url} alt="Combined photo" className="w-full rounded-2xl border border-border" /> : (
          <div className="checkerboard flex min-h-64 items-center justify-center rounded-2xl p-6">
            {cut && <img src={cut.toDataURL()} alt="Your cutout" className="max-h-80" />}
          </div>
        )}
        <ResultActions url={loading ? null : url} name={`${name}-new-background.png`} onReset={reset} />
      </div>
    </div>
  );
}
