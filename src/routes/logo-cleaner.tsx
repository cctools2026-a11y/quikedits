import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ToolPage, useRenderedUrl, Field, Range, ResultActions, baseName } from "@/components/ToolPage";
import { ctx2d, makeCanvas, trim } from "@/lib/compose";
import { alphaForDistance } from "@/lib/tool-sizes";

export const Route = createFileRoute("/logo-cleaner")({
  head: () => ({
    meta: [
      { title: "Remove Background from Logo or Signature — Free Transparent PNG" },
      { name: "description", content: "Make logos, signatures and stamps transparent. Sharp edges, instant, no AI download, nothing uploaded." },
      { property: "og:title", content: "Free Logo & Signature Background Remover" },
      { property: "og:description", content: "Transparent logos and signatures in seconds, right in your browser." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LogoCleaner,
});

function LogoCleaner() {
  const [tol, setTol] = useState(60);
  return (
    <ToolPage
      raw
      title={<>Transparent <span className="text-primary">logos &amp; signatures</span>.</>}
      intro="Best for flat graphics, logos and handwriting on plain paper. It works instantly, with no AI download."
    >
      {(items, reset) => {
        const it = items[0];
        return (
          <div className="grid gap-8 md:grid-cols-[300px_1fr]">
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

  return (
    <div>
      <div className="checkerboard rounded-2xl p-4">{url && <img src={url} alt="Transparent logo" className="mx-auto max-h-[60vh]" />}</div>
      <ResultActions url={url} name={`${name}-transparent.png`} label="Download transparent PNG" onReset={reset} />
    </div>
  );
}
