import { useEffect, useRef, useState, type ReactNode } from "react";
import { ShareButton } from "@/components/ShareButton";
import { Download, Loader2, RotateCcw } from "lucide-react";
import { ToolHero, TrustStrip } from "@/components/ToolHero";
import { UploadZone } from "@/components/UploadZone";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { validateImageFile, prepareImage } from "@/lib/image-file";
import { friendlyError, removeBg, type Phase } from "@/lib/remove";
import { blobToCanvas, canvasToBlob, canvasUnder, refinedFull, trim } from "@/lib/compose";
import { CutoutCues } from "@/components/CutoutCues";
import { CropRotate, type CropAspect } from "@/components/CropRotate";

export type Item = { file: File; original: string; cutout: HTMLCanvasElement | null; error?: string | undefined; full?: HTMLCanvasElement | undefined; source?: HTMLCanvasElement | undefined };

type Stage =
  | { kind: "idle" }
  | { kind: "adjust"; index: number }
  | { kind: "working"; index: number; total: number; phase: Phase; pct: number }
  | { kind: "ready" }
  | { kind: "error"; message: string };

export const MAX_BATCH = 20;

export function ToolPage({
  title, intro, multiple = false, raw = false, children, below, crop, tool, example, page,
}: {
  /** Page path for hero media and breadcrumb (defaults to tool). */
  page?: string;
  /** Tool path, used for photo tips and result checks. */
  tool?: string;
  /** Show crop & rotate before processing, with these crop shapes. */
  crop?: CropAspect[];
  title: ReactNode;
  intro: string;
  multiple?: boolean;
  /** Skip the AI step and hand the plain image to the tool. */
  raw?: boolean;
  children: (items: Item[], reset: () => void) => ReactNode;
  below?: ReactNode;
  example?: ReactNode;
}) {
  const [stage, setStage] = useState<Stage>({ kind: "idle" });
  const [items, setItems] = useState<Item[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);

  async function run(list: Item[]) {
    const out = [...list];
    for (let i = 0; i < out.length; i++) {
      const it = out[i]!;
      if (it.cutout) continue;
      setStage({ kind: "working", index: i, total: out.length, phase: raw ? "process" : "download", pct: 0 });
      try {
        if (raw) {
          out[i] = { ...it, error: undefined, cutout: await blobToCanvas(await prepareImage(it.file)) };
        } else {
          const blob = await removeBg(it.file, (phase, pct) => setStage({ kind: "working", index: i, total: out.length, phase, pct }));
          const full = await refinedFull(blob);
          const source = await blobToCanvas(await prepareImage(it.file));
          out[i] = { ...it, error: undefined, full, source, cutout: trim(full) };
        }
      } catch (e) {
        console.error(e);
        if (out.length === 1) {
          setStage({ kind: "error", message: friendlyError(e) });
          return;
        }
        out[i] = { ...it, error: friendlyError(e) };
      }
      setItems([...out]);
    }
    setStage({ kind: "ready" });
  }

  function pick(files: File[]) {
    const arr = files.slice(0, multiple ? MAX_BATCH : 1);
    if (!arr.length) return;
    const bad = arr.map(validateImageFile).find(Boolean) ?? null;
    const ok = arr.filter((f) => !validateImageFile(f));
    setFileError(bad);
    if (!ok.length) return;
    const list = ok.map((f) => ({ file: f, original: URL.createObjectURL(f), cutout: null }));
    setItems(list);
    if (crop) setStage({ kind: "adjust", index: 0 });
    else void run(list);
  }

  function nextAdjust(index: number, file?: File) {
    const list = [...items];
    if (file) {
      URL.revokeObjectURL(list[index]!.original);
      list[index] = { file, original: URL.createObjectURL(file), cutout: null };
    }
    setItems(list);
    if (index + 1 < list.length) setStage({ kind: "adjust", index: index + 1 });
    else void run(list);
  }

  function reset() {
    items.forEach((i) => URL.revokeObjectURL(i.original));
    setItems([]);
    setStage({ kind: "idle" });
  }

  return (
    <div className="bg-mat min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4">
        {stage.kind === "idle" && (
          <>
            <ToolHero path={page ?? tool ?? "/"} title={title} intro={intro} example={example}>
              <UploadZone tool={tool ?? "/"} multiple={multiple} onFiles={pick} maxNote={multiple ? `up to ${MAX_BATCH} at once` : undefined} />
              {fileError && <p role="alert" className="mt-4 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{fileError}</p>}
            </ToolHero>
            <TrustStrip />
            {below}
          </>
        )}

        {stage.kind === "adjust" && crop && items[stage.index] && (
          <CropRotate
            key={stage.index}
            file={items[stage.index]!.file}
            aspects={crop}
            heading={items.length > 1 ? `Image ${stage.index + 1} of ${items.length}. Drag the box to frame it.` : undefined}
            onDone={(f) => nextAdjust(stage.index, f)}
            onSkip={() => nextAdjust(stage.index)}
            onSkipAll={items.length > 1 ? () => void run(items) : undefined}
          />
        )}

        {stage.kind === "working" && (
          <section className="grid gap-8 pt-6 md:grid-cols-2 md:items-center">
            <img src={items[stage.index]?.original} alt="Your image" className="max-h-[60vh] w-full rounded-2xl border border-border object-contain opacity-60" />
            <div>
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <h2 className="font-display mt-4 text-2xl font-semibold">
                {raw ? "Preparing image" : stage.phase === "download" ? "Downloading AI model" : "Removing background"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {stage.total > 1 && `Image ${stage.index + 1} of ${stage.total} · `}
                {stage.phase === "download" ? "First time only — it's cached for next time." : "Working on your device…"}
              </p>
              {!raw && (
                <>
                  <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${stage.pct}%` }} />
                  </div>
                  <p className="mt-2 text-sm tabular-nums text-muted-foreground">{stage.pct}%</p>
                </>
              )}
            </div>
          </section>
        )}

        {stage.kind === "error" && (
          <section className="mx-auto max-w-md pt-16 text-center">
            <h2 className="font-display text-2xl font-semibold">That didn't work</h2>
            <p className="mt-2 text-muted-foreground" role="alert">{stage.message}</p>
            <div className="mt-6 flex justify-center gap-3">
              <button onClick={() => run(items)} className="rounded-full bg-primary px-5 py-2.5 font-medium text-primary-foreground">Try again</button>
              <button onClick={reset} className="rounded-full border border-border px-5 py-2.5 font-medium">New image</button>
            </div>
          </section>
        )}

        {stage.kind === "ready" && (
          <section className="pt-2">
            {tool && items.map((it, i) => it.full && it.source && (
              <CutoutCues key={i} tool={tool} cut={it.full} source={it.source} label={items.length > 1 ? it.file.name : undefined}
                onRetry={items.length === 1 ? reset : undefined}
                onChange={(c) => setItems((prev) => prev.map((p, j) => (j === i ? { ...p, full: c, cutout: trim(c) } : p)))} />
            ))}
            {children(items, reset)}
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

/** Re-renders a canvas whenever inputs change and returns a downloadable URL. */
export function useRenderedUrl(render: () => HTMLCanvasElement | null, deps: unknown[], type = "image/png", maxBytes?: number) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    let made: string | null = null;
    const c = render();
    if (!c) { setUrl(null); return; }
    canvasUnder(c, type, maxBytes).then((b) => {
      if (cancelled) return;
      made = URL.createObjectURL(b);
      setUrl(made);
    });
    return () => { cancelled = true; if (made) URL.revokeObjectURL(made); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, type, maxBytes]);
  return url;
}

export function ResultActions({ url, name, onReset, label = "Download PNG" }: { url: string | null; name: string; onReset?: () => void; label?: string }) {
  return (
    <div className="result-actions sticky bottom-3 z-20 mt-6 flex flex-col gap-3 sm:static sm:flex-row">
      <a
        href={url ?? undefined}
        download={name}
        aria-disabled={!url}
        className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-lg font-semibold text-primary-foreground shadow-lg transition-transform hover:scale-[1.01] aria-disabled:opacity-50"
      >
        <Download className="h-5 w-5" /> {label}
      </a>
      <ShareButton url={url} name={name} />
      {onReset && (
        <button onClick={onReset} className="flex items-center justify-center gap-2 rounded-full border border-border px-6 py-4 font-medium hover:bg-accent">
          <RotateCcw className="h-4 w-4" /> New image
        </button>
      )}
    </div>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium">{label}</p>
      {children}
    </div>
  );
}

export function Range(props: { value: number; min: number; max: number; step?: number; onChange: (v: number) => void; label: string }) {
  return (
    <input type="range" aria-label={props.label} className="w-full accent-primary" min={props.min} max={props.max} step={props.step ?? 1} value={props.value} onChange={(e) => props.onChange(Number(e.target.value))} />
  );
}

export function Choice<T extends string>({ value, options, onChange }: { value: T; options: readonly { id: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button key={o.id} type="button" aria-pressed={value === o.id} onClick={() => onChange(o.id)}
          className={`rounded-full border px-3.5 py-2 text-sm ${value === o.id ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-accent"}`}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export const baseName = (f: File) => f.name.replace(/\.[^.]+$/, "");
