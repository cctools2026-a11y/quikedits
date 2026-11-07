import { useT } from "@/lib/use-i18n";
import type { Preset } from "@/lib/tools";
import { ZoomView } from "@/components/ZoomView";
import { ToolLanding } from "@/components/ToolLanding";
import { useMemo, useState } from "react";
import { ToolPage, useRenderedUrl, Field, Range, Choice, ResultActions, baseName } from "@/components/ToolPage";
import { ctx2d, makeCanvas, trim } from "@/lib/compose";
import { alphaForDistance, inkAlpha } from "@/lib/tool-sizes";
import { cornersUneven } from "@/lib/photo-rules";
import { canDrawSignature } from "@/lib/signature-tools";


export function LogoCleaner({ page = "/logo-cleaner", preset = {} }: { page?: string; preset?: Preset }) {
  const t = useT();
  const [tol, setTol] = useState(preset.tol ?? 60);
  const [recolour, setRecolour] = useState<"original" | "black" | "white">(preset.recolour ?? "original");
  return (
    <ToolPage
      tool="/logo-cleaner"
      page={page}
      drawSignature={canDrawSignature(page)}
      below={<ToolLanding path={page} />}
      raw
      title={preset.title ?? <>{t("Transparent")} <span className="text-primary">logos &amp; signatures</span>.</>}
      intro={preset.intro ?? t("Best for flat graphics, logos and handwriting on plain paper. It works instantly, with no AI download.")}
    >
      {(items, reset) => {
        const it = items[0];
        return (
          <div className="tool-split grid gap-6 md:gap-8 md:grid-cols-[300px_1fr]">
            <aside className="space-y-6">
              <Field label={`Strength: ${tol}`}><Range label={t("Strength")} value={tol} min={15} max={180} onChange={setTol} /></Field>
              <p className="text-sm text-muted-foreground">Raise it if paper shadows remain; lower it if thin lines disappear.</p>
              <Field label={t("Colour")}><Choice value={recolour} onChange={setRecolour} options={[{ id: "original", label: "Original" }, { id: "black", label: t("All black") }, { id: "white", label: t("All white") }]} /></Field>
            </aside>
            <LogoResult src={it?.cutout ?? null} name={it ? baseName(it.file) : "logo"} tol={tol} reset={reset} recolour={recolour} ink={!!preset.ink} maxWidth={preset.maxWidth} />
          </div>
        );
      }}
    </ToolPage>
  );
}

function LogoResult({ src, name, tol, reset, recolour, ink, maxWidth }: { src: HTMLCanvasElement | null; name: string; tol: number; reset: () => void; recolour: string; ink: boolean; maxWidth?: number | undefined }) {
  const t = useT();
  const bgColour = useMemo(() => {
    if (!src) return [255, 255, 255];
    const { width: w, height: h } = src;
    const d = ctx2d(src).getImageData(0, 0, w, h).data;
    const pts = [0, w - 1, (h - 1) * w, h * w - 1];
    return [0, 1, 2].map((k) => pts.reduce((s, p) => s + d[p * 4 + k]!, 0) / pts.length);
  }, [src]);

  const url = useRenderedUrl(() => {
    if (!src) return null;
    const { width: w, height: h } = src;
    const c = makeCanvas(w, h);
    const ctx = ctx2d(c);
    const img = ctx2d(src).getImageData(0, 0, w, h);
    const d = img.data;
    const [br, bg, bb] = bgColour as [number, number, number];
    for (let p = 0; p < d.length; p += 4) {
      const dist = Math.hypot(d[p]! - br, d[p + 1]! - bg, d[p + 2]! - bb);
      const a = ink ? Math.min(alphaForDistance(dist, tol), inkAlpha(d[p]!, d[p + 1]!, d[p + 2]!, tol)) : alphaForDistance(dist, tol);
      d[p + 3] = d[p + 3]! * a;
      if (recolour !== "original") { const v = recolour === "white" ? 255 : 0; d[p] = v; d[p + 1] = v; d[p + 2] = v; }
    }
    ctx.putImageData(img, 0, 0);
    const trimmed = trim(c);
    if (!maxWidth || trimmed.width <= maxWidth) return t;
    const out = makeCanvas(maxWidth, Math.round((t.height / t.width) * maxWidth));
    const o = ctx2d(out);
    o.imageSmoothingQuality = "high";
    o.drawImage(trimmed, 0, 0, out.width, out.height);
    return out;
  }, [src, tol, bgColour, recolour, ink, maxWidth]);

  const uneven = useMemo(() => {
    if (!src) return false;
    const { width: w, height: h } = src;
    const d = ctx2d(src).getImageData(0, 0, w, h).data;
    return cornersUneven([0, w - 1, (h - 1) * w, h * w - 1].map((p) => [d[p * 4]!, d[p * 4 + 1]!, d[p * 4 + 2]!] as [number, number, number]));
  }, [src]);

  return (
    <div>
      {uneven && (
        <p role="status" className="mb-4 rounded-2xl border border-primary/40 bg-accent p-4 text-sm text-accent-foreground">
          The background isn't plain, so some of it may remain. Try a photo on white paper, or raise the strength.
        </p>
      )}
      <div className={`rounded-2xl p-4 ${recolour === "white" ? "bg-foreground" : "checkerboard"}`}>{url && <ZoomView><img src={url} alt={t("Transparent logo")} className="mx-auto max-h-[60vh]" /></ZoomView>}</div>
      <ResultActions url={url} name={`${name}-transparent.png`} label={t("Download transparent PNG")} onReset={reset} />
    </div>
  );
}
