import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Download, ImagePlus, Loader2, RotateCcw, ShieldCheck } from "lucide-react";
import { CompareSlider } from "@/components/CompareSlider";
import { SiteFooter } from "@/components/SiteFooter";
import { prepareImage, validateImageFile } from "@/lib/image-file";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cutout — Free Background Remover, 100% in Your Browser" },
      { name: "description", content: "Remove image backgrounds for free. Runs entirely on your device — no uploads, no accounts, transparent PNG download." },
      { property: "og:title", content: "Cutout — Free In-Browser Background Remover" },
      { property: "og:description", content: "Private, free background removal that never uploads your photos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Stage =
  | { kind: "idle" }
  | { kind: "working"; phase: "download" | "process"; pct: number }
  | { kind: "done" }
  | { kind: "error"; message: string };

function Index() {
  const [stage, setStage] = useState<Stage>({ kind: "idle" });
  const [file, setFile] = useState<File | null>(null);
  const [original, setOriginal] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [fast, setFast] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [drag, setDrag] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (stage.kind !== "working") return;
    const start = Date.now();
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - start) / 1000)), 1000);
    return () => clearInterval(t);
  }, [stage.kind]);

  useEffect(() => () => {
    if (original) URL.revokeObjectURL(original);
  }, [original]);
  useEffect(() => () => {
    if (result) URL.revokeObjectURL(result);
  }, [result]);

  async function run(f: File) {
    setResult(null);
    setElapsed(0);
    setStage({ kind: "working", phase: "download", pct: 0 });
    try {
      const { removeBackground } = await import("@imgly/background-removal");
      const input = await prepareImage(f);
      const blob = await removeBackground(input, {
        model: fast ? "isnet_quint8" : "isnet_fp16",
        output: { format: "image/png" },
        progress: (key, current, total) => {
          const pct = total ? Math.round((current / total) * 100) : 0;
          setStage({ kind: "working", phase: key.startsWith("fetch") ? "download" : "process", pct });
        },
      });
      setResult(URL.createObjectURL(blob));
      setStage({ kind: "done" });
    } catch (e) {
      console.error(e);
      const msg = e instanceof Error ? e.message : String(e);
      setStage({
        kind: "error",
        message: /memory|allocation/i.test(msg)
          ? "Your device ran out of memory. Try the faster model or a smaller image."
          : /fetch|network/i.test(msg)
            ? "Couldn't download the AI model. Check your connection and try again."
            : "Something went wrong while removing the background. Please try again.",
      });
    }
  }

  function pick(f: File | undefined) {
    if (!f) return;
    const err = validateImageFile(f);
    setFileError(err);
    if (err) return;
    setFile(f);
    setOriginal(URL.createObjectURL(f));
    void run(f);
  }

  function reset() {
    setFile(null);
    setOriginal(null);
    setResult(null);
    setStage({ kind: "idle" });
  }

  const downloadName = file ? file.name.replace(/\.[^.]+$/, "") + "-cutout.png" : "cutout.png";

  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5">
        <span className="font-display text-xl font-bold tracking-tight">cutout<span className="text-primary">.</span></span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground sm:text-sm">
          <ShieldCheck className="h-4 w-4" /> Photos never leave your device
        </span>
      </header>

      <main className="mx-auto max-w-5xl px-4">
        {stage.kind === "idle" && (
          <section className="pt-6 sm:pt-12">
            <h1 className="font-display max-w-2xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
              Remove backgrounds. <span className="text-primary">Free</span>, private, instant.
            </h1>
            <p className="mt-4 max-w-xl text-muted-foreground">
              AI runs right in your browser. No sign-up, no uploads, no limits.
            </p>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => { e.preventDefault(); setDrag(false); pick(e.dataTransfer.files[0]); }}
              className={`mt-8 flex w-full flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed px-6 py-16 text-center transition-colors sm:py-24 ${drag ? "border-primary bg-accent" : "border-border bg-card hover:border-primary/60"}`}
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <ImagePlus className="h-8 w-8" />
              </span>
              <span className="font-display text-xl font-semibold">Drop an image or click to upload</span>
              <span className="text-sm text-muted-foreground">JPG, PNG or WebP · up to 25 MB</span>
            </button>
            <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => { pick(e.target.files?.[0]); e.target.value = ""; }} />
            {fileError && <p role="alert" className="mt-4 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{fileError}</p>}
            <label className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" checked={fast} onChange={(e) => setFast(e.target.checked)} className="h-4 w-4 accent-primary" />
              Faster mode for older phones and laptops (slightly lower quality)
            </label>
          </section>
        )}

        {stage.kind === "working" && original && (
          <section className="grid gap-8 pt-6 md:grid-cols-2 md:items-center">
            <img src={original} alt="Your image" className="max-h-[60vh] w-full rounded-2xl border border-border object-contain opacity-60" />
            <div>
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <h2 className="font-display mt-4 text-2xl font-semibold">
                {stage.phase === "download" ? "Downloading AI model" : "Removing background"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {stage.phase === "download" ? "First time only — it's cached for next time." : "Working on your device…"}
              </p>
              <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${stage.pct}%` }} />
              </div>
              <p className="mt-2 text-sm tabular-nums text-muted-foreground">{stage.pct}% · {elapsed}s</p>
              {elapsed > 20 && (
                <p className="mt-4 text-sm text-muted-foreground">This can take up to a minute on older devices. Please keep this tab open.</p>
              )}
            </div>
          </section>
        )}

        {stage.kind === "error" && (
          <section className="mx-auto max-w-md pt-16 text-center">
            <h2 className="font-display text-2xl font-semibold">That didn't work</h2>
            <p className="mt-2 text-muted-foreground" role="alert">{stage.message}</p>
            <div className="mt-6 flex justify-center gap-3">
              {file && <button onClick={() => run(file)} className="rounded-full bg-primary px-5 py-2.5 font-medium text-primary-foreground">Try again</button>}
              <button onClick={reset} className="rounded-full border border-border px-5 py-2.5 font-medium">New image</button>
            </div>
            <label className="mt-5 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" checked={fast} onChange={(e) => setFast(e.target.checked)} className="h-4 w-4 accent-primary" />
              Use faster mode
            </label>
          </section>
        )}

        {stage.kind === "done" && original && result && (
          <section className="pt-4">
            <CompareSlider before={original} after={result} />
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a href={result} download={downloadName} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-lg font-semibold text-primary-foreground shadow-lg transition-transform hover:scale-[1.01]">
                <Download className="h-5 w-5" /> Download transparent PNG
              </a>
              <button onClick={reset} className="flex items-center justify-center gap-2 rounded-full border border-border px-6 py-4 font-medium hover:bg-accent">
                <RotateCcw className="h-4 w-4" /> New image
              </button>
            </div>
            <p className="mt-3 text-center text-xs text-muted-foreground">Drag the handle to compare. Processed entirely in your browser.</p>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
