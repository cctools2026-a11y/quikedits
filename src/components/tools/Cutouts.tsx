import { useT } from "@/lib/use-i18n";
import type { Preset } from "@/lib/tools";
import { useEffect } from "react";
import { Download } from "lucide-react";
import { ZoomView } from "@/components/ZoomView";
import { ToolLanding } from "@/components/ToolLanding";
import { ShareButton } from "@/components/ShareButton";
import { ToolPage, useRenderedUrl, ResultActions, baseName, type Item } from "@/components/ToolPage";
import { ZipButton, useUrlMap } from "@/components/ZipButton";
import { ctx2d, makeCanvas, trim } from "@/lib/compose";
import { uniqueNames } from "@/lib/zip";
import { alphaForDistance } from "@/lib/tool-sizes";

/** Transparent cut-outs for one or many photos, with optional AI-free mode for flat graphics. */
export function Cutouts({ page, preset = {} }: { page: string; preset?: Preset }) {
  const t = useT();
  return (
    <ToolPage
      tool="/"
      page={page}
      raw={!!preset.raw}
      multiple={!!preset.multiple}
      below={<ToolLanding path={page} />}
      title={preset.title ?? t("Remove the background")}
      intro={preset.intro ?? t("Upload a photo and get a transparent PNG.")}
    >
      {(items, reset) => {
        const names = uniqueNames(items.map((x) => `${baseName(x.file)}-cutout.png`));
        return <CutoutList items={items} names={names} reset={reset} preset={preset} />;
      }}
    </ToolPage>
  );
}

function CutoutList({ items, names, reset, preset }: { items: Item[]; names: string[]; reset: () => void; preset: Preset }) {
  const t = useT();
  const [urls, report] = useUrlMap();
  if (items.length === 1) return <One item={items[0]!} name={names[0]!} preset={preset} onUrl={() => {}} reset={reset} />;
  return (
    <div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => <One key={i} compact item={it} name={names[i]!} preset={preset} onUrl={(u) => report(i, u)} />)}
      </div>
      <div className="mt-6 space-y-3">
        <ZipButton files={items.map((_, i) => ({ url: urls[i] ?? null, name: names[i]! }))} name="cutouts.zip" />
        <button onClick={reset} className="w-full rounded-full border border-border px-6 py-3 font-medium hover:bg-accent">{t("New images")}</button>
      </div>
    </div>
  );
}

function One({ item, name, preset, onUrl, reset, compact }: { item: Item; name: string; preset: Preset; onUrl: (u: string | null) => void; reset?: (() => void) | undefined; compact?: boolean }) {
  const t = useT();
  const url = useRenderedUrl(() => {
    let cut = item.cutout;
    if (!cut) return null;
    if (preset.raw) cut = flatCut(cut, preset.tol ?? 50);
    const max = preset.maxSide;
    if (!max || Math.max(cut.width, cut.height) <= max) return cut;
    const k = max / Math.max(cut.width, cut.height);
    const c = makeCanvas(Math.round(cut.width * k), Math.round(cut.height * k));
    const ctx = ctx2d(c);
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(cut, 0, 0, c.width, c.height);
    return c;
  }, [item.cutout, preset.raw, preset.tol, preset.maxSide]);
  useEffect(() => { onUrl(url); }, [url, onUrl]);

  if (item.error) return <p className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive">{item.file.name}: {item.error}</p>;
  if (compact) return (
    <figure className="rounded-2xl border border-border bg-card p-3">
      <div className="checkerboard rounded-xl p-2">{url ? <img src={url} alt={item.file.name} className="mx-auto max-h-64" /> : <div className="aspect-square animate-pulse rounded-xl bg-muted" />}</div>
      <figcaption className="mt-3 flex items-center justify-between gap-2 text-sm">
        <span className="truncate text-muted-foreground">{item.file.name}</span>
        <a href={url ?? undefined} download={name} className="flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-4 py-2 font-medium text-primary-foreground"><Download className="h-4 w-4" /> {t("PNG")}</a>
        <ShareButton compact url={url} name={name} />
      </figcaption>
    </figure>
  );
  return (
    <div>
      <div className="checkerboard rounded-2xl p-4">{url && <ZoomView><img src={url} alt={t("Your cut-out")} className="mx-auto max-h-[60vh]" /></ZoomView>}</div>
      <ResultActions url={url} name={name} label={t("Download transparent PNG")} {...(reset ? { onReset: reset } : {})} />
    </div>
  );
}

/** Flat graphics: clear the colour found in the corners. */
function flatCut(src: HTMLCanvasElement, tol: number) {
  const { width: w, height: h } = src;
  const img = ctx2d(src).getImageData(0, 0, w, h);
  const d = img.data;
  const pts = [0, w - 1, (h - 1) * w, h * w - 1];
  const [br, bg, bb] = [0, 1, 2].map((k) => pts.reduce((s, p) => s + d[p * 4 + k]!, 0) / 4) as [number, number, number];
  for (let p = 0; p < d.length; p += 4) d[p + 3] = d[p + 3]! * alphaForDistance(Math.hypot(d[p]! - br, d[p + 1]! - bg, d[p + 2]! - bb), tol);
  const c = makeCanvas(w, h);
  ctx2d(c).putImageData(img, 0, 0);
  return trim(c);
}
