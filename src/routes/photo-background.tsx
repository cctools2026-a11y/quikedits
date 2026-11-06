import { toolHead } from "@/lib/seo";
import { ToolLanding } from "@/components/ToolLanding";
import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ImagePlus } from "lucide-react";
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
      title={<>Put yourself <span className="text-foreground">anywhere</span>.</>}
      intro="Upload the photo you want to cut out first. Then choose a second photo to use as the new background."
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

  async function pickBackdrop(f: File | undefined) {
    if (!f) return;
    const e = validateImageFile(f);
    setErr(e);
    if (!e) setBackdrop(await blobToCanvas(await prepareImage(f)));
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
        <button onClick={() => ref.current?.click()} className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 font-medium text-primary-foreground">
          <ImagePlus className="h-4 w-4" /> {backdrop ? "Change background photo" : "Choose background photo"}
        </button>
        <input ref={ref} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => { void pickBackdrop(e.target.files?.[0]); e.target.value = ""; }} />
        {err && <p role="alert" className="text-sm text-destructive">{err}</p>}
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
        <ResultActions url={url} name={`${name}-new-background.png`} onReset={reset} />
      </div>
    </div>
  );
}
