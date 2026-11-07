import { useT } from "@/lib/use-i18n";
import type { Preset } from "@/lib/tools";
import { GRADIENTS, gradientCanvas, gradientCss } from "@/lib/gradients";
import { ZoomView } from "@/components/ZoomView";
import { ToolLanding } from "@/components/ToolLanding";
import { useMemo, useRef, useState } from "react";
import { Check, ImagePlus, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BACKGROUND_PRESETS } from "@/lib/background-presets";
import { foregroundColour, rankBackgrounds } from "@/lib/background-recommendations";
import { ToolPage, useRenderedUrl, Field, Range, ResultActions, baseName } from "@/components/ToolPage";
import { blobToCanvas, ctx2d, makeCanvas } from "@/lib/compose";
import { prepareImage, validateImageFile } from "@/lib/image-file";


export function PhotoBackground({ page = "/photo-background", preset = {} }: { page?: string; preset?: Preset }) {
  const t = useT();
  return (
    <ToolPage
      tool="/photo-background"
      page={page}
      below={<ToolLanding path={page} />}
      title={preset.title ?? <>{t("Put yourself")} <span className="text-primary">{"anywhere"}</span>.</>}
      intro={preset.intro ?? t("Upload your photo, then pick a playful background or add your own picture.")}
    >
      {(items, reset) => preset.blur
        ? <BlurResult full={items[0]?.full ?? null} source={items[0]?.source ?? null} name={items[0] ? baseName(items[0].file) : "photo"} reset={reset} />
        : <Composer cut={items[0]?.cutout ?? null} name={items[0] ? baseName(items[0].file) : "photo"} reset={reset} preset={preset} />}
    </ToolPage>
  );
}

function BlurResult({ full, source, name, reset }: { full: HTMLCanvasElement | null; source: HTMLCanvasElement | null; name: string; reset: () => void }) {
  const t = useT();
  const [amount, setAmount] = useState(12);
  const url = useRenderedUrl(() => {
    if (!full || !source) return null;
    const c = makeCanvas(source.width, source.height);
    const ctx = ctx2d(c);
    const px = Math.round((amount / 1000) * Math.max(c.width, c.height));
    // Draw slightly oversized so blurred edges don't fade to transparent.
    ctx.filter = `blur(${px}px)`;
    ctx.drawImage(source, -px * 2, -px * 2, c.width + px * 4, c.height + px * 4);
    ctx.filter = "none";
    ctx.drawImage(full, 0, 0, c.width, c.height);
    return c;
  }, [full, source, amount], "image/jpeg");
  return (
    <div className="tool-split grid gap-6 md:gap-8 md:grid-cols-[300px_1fr]">
      <aside className="space-y-6">
        <Field label={`Blur: ${amount}`}><Range label={t("Blur amount")} value={amount} min={2} max={40} onChange={setAmount} /></Field>
        <p className="text-sm text-muted-foreground">{t("Your subject stays sharp while the scene behind softens, like a portrait camera.")}</p>
      </aside>
      <div>
        {url ? <ZoomView><img src={url} alt={t("Photo with blurred background")} className="w-full rounded-2xl border border-border" /></ZoomView> : <div className="aspect-[4/3] animate-pulse rounded-2xl bg-muted" />}
        <ResultActions url={url} name={`${name}-blurred.jpg`} label={t("Download photo")} onReset={reset} />
      </div>
    </div>
  );
}

function Composer({ cut, name, reset, preset }: { cut: HTMLCanvasElement | null; name: string; reset: () => void; preset: Preset }) {
  const t = useT();
  const choices = useMemo(() => [
    ...(preset.gradients ? GRADIENTS.map((g) => ({ id: g.id, name: g.name, src: "", css: gradientCss(g.stops), colour: [0, 0, 0] as const, stops: g.stops })) : []),
    ...BACKGROUND_PRESETS.filter((b) => !preset.backdrops || preset.backdrops.includes(b.id)).map((b) => ({ ...b, css: "", stops: null })),
  ], [preset.gradients, preset.backdrops]);
  const [backdrop, setBackdrop] = useState<HTMLCanvasElement | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [scale, setScale] = useState(70);
  const [x, setX] = useState(50);
  const [y, setY] = useState(100);
  const ref = useRef<HTMLInputElement>(null);
  const request = useRef(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const recommendations = useMemo(() => {
    if (!cut) return [];
    const sample = makeCanvas(64, 64);
    const context = ctx2d(sample);
    context.drawImage(cut, 0, 0, 64, 64);
    return preset.gradients ? [] : rankBackgrounds(foregroundColour(context.getImageData(0, 0, 64, 64).data), choices);
  }, [cut, choices, preset.gradients]);
  const suggested = recommendations[0];

  function applyPreset(choice: (typeof choices)[number]) {
    if (choice.stops) { setBackdrop(gradientCanvas(choice.stops)); setSelected(choice.id); return; }
    return loadBackdrop(async () => {
      const response = await fetch(choice.src);
      if (!response.ok) throw new Error("Background unavailable");
      return response.blob();
    }, choice.id);
  }

  async function loadBackdrop(load: () => {t("Promise")}<Blob>, id: string) {
    const token = ++request.current;
    setErr(null);
    setLoading(true);
    try {
      const canvas = await blobToCanvas(await load());
      if (token !== request.current) return;
      setBackdrop(canvas);
      setSelected(id);
    } catch {
      if (token === request.current) setErr(t("Couldn't open that background. Please try again."));
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
    const W = preset.canvas?.w ?? backdrop.width, H = preset.canvas?.h ?? backdrop.height;
    const c = makeCanvas(W, H);
    const ctx = ctx2d(c);
    const k = Math.max(W / backdrop.width, H / backdrop.height); // cover
    ctx.drawImage(backdrop, (W - backdrop.width * k) / 2, (H - backdrop.height * k) / 2, backdrop.width * k, backdrop.height * k);
    const h = H * (scale / 100);
    const w = (cut.width / cut.height) * h;
    ctx.drawImage(cut, (W - w) * (x / 100), (H - h) * (y / 100), w, h);
    return c;
  }, [cut, backdrop, scale, x, y, preset.canvas?.w, preset.canvas?.h]);

  return (
    <div className="tool-split grid gap-6 md:gap-8 md:grid-cols-[300px_1fr]">
      <aside className="space-y-6">
        {suggested && <section aria-label={t("Background recommendation")} className="space-y-2 border-b border-border pb-5">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold"><Sparkles className="h-4 w-4 text-primary" /> Suggested: {suggested.name}</h2>
          <p className="text-sm text-muted-foreground">{suggested.reason}</p>
          <Button onClick={() => void applyPreset(suggested)} disabled={loading} className="w-full">
            <Check /> {t("Apply suggested background")}
          </Button>
        </section>}
        <div>
          <h2 className="font-display mb-3 text-lg font-semibold">{t("Pick a background")}</h2>
          <div className="grid grid-cols-3 gap-2" role="group" aria-label={t("Playful background presets")}>
            {choices.map((preset) => (
              <Button key={preset.id} variant="outline" aria-label={`Apply ${preset.name} background`} aria-pressed={selected === preset.id}
                className="relative h-auto flex-col gap-0 overflow-hidden p-0 whitespace-normal aria-pressed:border-primary aria-pressed:ring-2 aria-pressed:ring-primary"
                onClick={() => void applyPreset(preset)}>
                {preset.stops ? <span className="block aspect-square w-full" style={{ backgroundImage: preset.css }} /> : <img src={preset.src} alt="" width={1024} height={1024} loading="lazy" className="aspect-square w-full object-cover" />}
                <span className="py-2 text-xs">{preset.name}</span>
                {selected === preset.id && <span className="absolute right-1 top-1 rounded-full bg-primary p-1 text-primary-foreground"><Check /></span>}
              </Button>
            ))}
          </div>
        </div>
        <Button variant="outline" onClick={() => ref.current?.click()} className="h-auto w-full rounded-full px-4 py-3 whitespace-normal">
          <ImagePlus className="h-4 w-4" /> {backdrop ? t("Change background photo") : t("Choose background photo")}
        </Button>
        <input ref={ref} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => { void pickBackdrop(e.target.files?.[0]); e.target.value = ""; }} />
        {err && <p role="alert" className="text-sm text-destructive">{err}</p>}
        {loading && <p role="status" className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> {t("Opening background…")}</p>}
        <Field label={`Size: ${scale}%`}><Range label={t("Size")} value={scale} min={10} max={120} onChange={setScale} /></Field>
        <Field label={t("Left / right")}><Range label={t("Horizontal position")} value={x} min={0} max={100} onChange={setX} /></Field>
        <Field label={t("Up / down")}><Range label={t("Vertical position")} value={y} min={0} max={100} onChange={setY} /></Field>
      </aside>
      <div>
        {url ? <ZoomView><img src={url} alt={t("Combined photo")} className="w-full rounded-2xl border border-border" /></ZoomView> : (
          <div className="checkerboard flex min-h-64 items-center justify-center rounded-2xl p-6">
            {cut && <img src={cut.toDataURL()} alt={t("Your cutout")} className="max-h-80" />}
          </div>
        )}
        <ResultActions url={loading ? null : url} name={`${name}-new-background.png`} onReset={reset} />
      </div>
    </div>
  );
}
