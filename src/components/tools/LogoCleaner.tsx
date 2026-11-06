import type { Preset } from "@/lib/tools";
import { ZoomView } from "@/components/ZoomView";
import { ToolLanding } from "@/components/ToolLanding";
import { useMemo, useState } from "react";
import { ToolPage, useRenderedUrl, Field, Range, ResultActions, baseName } from "@/components/ToolPage";
import { ctx2d, makeCanvas, trim } from "@/lib/compose";
import { alphaForDistance } from "@/lib/tool-sizes";
import { cornersUneven } from "@/lib/photo-rules";


export function LogoCleaner({ page = "/logo-cleaner", preset = {} }: { page?: string; preset?: Preset }) {
  const [tol, setTol] = useState(preset.tol ?? 60);
  return (
    <ToolPage
      tool="/logo-cleaner"
      page={page}
      below={<ToolLanding path={page} />}
      raw
      title={preset.title ?? <>Transparent <span className="text-primary">logos &amp; signatures</span>.</>}
      intro={preset.intro ?? "Best for flat graphics, logos and handwriting on plain paper. It works instantly, with no AI download."}
    >
      {(items, reset) => {
        const it = items[0];
        return (
          <div className="tool-split grid gap-6 md:gap-8 md:grid-cols-[300px_1fr]">
            <aside className="space-y-6">
              <Field label={`Strength: ${tol}`}><Range label="Strength" value={tol} min={15} max={180} onChange={setTol} /></Field>
              <p className="text-sm text-muted-foreground">Raise it if paper shadows remain; lower it if thin lines disappear.</p>
            </aside>
            <LogoResult src={it?.cutout ?? null} name={it ? baseName(it.file) : "logo"} tol={tol} reset={reset} />
          </div>
        );
      }}
    </ToolPage>
  );
}

function LogoResult({ src, name, tol, reset }: { src: HTMLCanvasElement | null; name: string; tol: number; reset: () => void }) {
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
      d[p + 3] = d[p + 3]! * alphaForDistance(dist, tol);
    }
    ctx.putImageData(img, 0, 0);
    return trim(c);
  }, [src, tol, bgColour]);

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
      <div className="checkerboard rounded-2xl p-4">{url && <ZoomView><img src={url} alt="Transparent logo" className="mx-auto max-h-[60vh]" /></ZoomView>}</div>
      <ResultActions url={url} name={`${name}-transparent.png`} label="Download transparent PNG" onReset={reset} />
    </div>
  );
}
