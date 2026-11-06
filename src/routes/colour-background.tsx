import { toolHead } from "@/lib/seo";
import { ToolLanding } from "@/components/ToolLanding";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Check, Download, ImagePlus, Loader2, RotateCcw } from "lucide-react";
import { CompareSlider } from "@/components/CompareSlider";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { prepareImage, validateImageFile } from "@/lib/image-file";
import { blobToCanvas, canvasToBlob } from "@/lib/compose";
import { PhotoTips } from "@/components/PhotoTips";
import { CutoutCues } from "@/components/CutoutCues";
import { compositeOnColour, isSolidHex, PALETTE } from "@/lib/colour-background";

export const Route = createFileRoute("/colour-background")({
  head: () => toolHead("/colour-background"),
  component: ColourTool,
});

type Stage =
  | { kind: "idle" }
  | { kind: "choose" }
  | { kind: "working"; phase: "download" | "process"; pct: number }
  | { kind: "done" }
  | { kind: "error"; message: string };

function ColourTool() {
  const [stage, setStage] = useState<Stage>({ kind: "idle" });
  const [file, setFile] = useState<File | null>(null);
  const [original, setOriginal] = useState<string | null>(null);
  const [cutout, setCutout] = useState<Blob | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [colour, setColour] = useState<string>("#FFFFFF");
  const [cutCanvas, setCutCanvas] = useState<HTMLCanvasElement | null>(null);
  const [src, setSrc] = useState<HTMLCanvasElement | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => () => { if (original) URL.revokeObjectURL(original); }, [original]);
  useEffect(() => () => { if (result) URL.revokeObjectURL(result); }, [result]);

  async function apply(c: string) {
    if (!file || !isSolidHex(c)) return;
    setColour(c);
    try {
      let cut = cutout;
      if (!cut) {
        setStage({ kind: "working", phase: "download", pct: 0 });
        const { removeBackground } = await import("@imgly/background-removal");
        const input = await prepareImage(file);
        cut = await removeBackground(input, {
          publicPath: `${window.location.origin}/imgly/`,
          model: "isnet_fp16",
          output: { format: "image/png" },
          progress: (key, current, total) => {
            const pct = total ? Math.round((current / total) * 100) : 0;
            setStage({ kind: "working", phase: key.startsWith("fetch") ? "download" : "process", pct });
          },
        });
        setCutout(cut);
        setCutCanvas(await blobToCanvas(cut));
        setSrc(await blobToCanvas(input));
      }
      const out = await compositeOnColour(cut, c);
      setResult(URL.createObjectURL(out));
      setStage({ kind: "done" });
    } catch (e) {
      console.error(e);
      const msg = e instanceof Error ? e.message : String(e);
      setStage({
        kind: "error",
        message: /memory|allocation/i.test(msg)
          ? "Your device ran out of memory. Try a smaller image."
          : /fetch|network/i.test(msg)
            ? "Couldn't download the AI model. Check your connection and try again."
            : "Something went wrong. Please try again.",
      });
    }
  }

  function pick(f: File | undefined) {
    if (!f) return;
    const err = validateImageFile(f);
    setFileError(err);
    if (err) return;
    setFile(f);
    setCutout(null);
    setResult(null);
    setOriginal(URL.createObjectURL(f));
    setStage({ kind: "choose" });
  }

  function reset() {
    setFile(null); setOriginal(null); setCutout(null); setResult(null);
    setStage({ kind: "idle" });
  }

  const downloadName = file ? file.name.replace(/\.[^.]+$/, "") + "-colour.png" : "colour-background.png";

  const palette = (
    <div>
      <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Background colour">
        {PALETTE.map((c) => (
          <button
            key={c}
            type="button"
            role="radio"
            aria-checked={result !== null && colour === c}
            aria-label={`Colour ${c}`}
            onClick={() => apply(c)}
            className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-border shadow-sm transition-transform hover:scale-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-ring"
            style={{ backgroundColor: c }}
          >
            {result && colour === c && <Check className="h-5 w-5 mix-blend-difference text-background" />}
          </button>
        ))}
        <label className="flex h-11 cursor-pointer items-center gap-2 rounded-full border-2 border-border px-3 text-sm font-medium">
          <input type="color" value={colour} onChange={(e) => apply(e.target.value)} className="h-6 w-6 cursor-pointer rounded-full border-0 bg-transparent p-0" aria-label="Custom colour" />
          Custom
        </label>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-5xl px-4">
        {stage.kind === "idle" && (
          <section className="pt-6 sm:pt-12">
            <h1 className="font-display max-w-2xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
              Put any photo on a <span className="text-primary">solid colour</span>.
            </h1>
            <p className="mt-4 max-w-xl text-muted-foreground">
              Upload a photo, pick a colour. We remove the background and fill it with your colour, right in your browser.
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
            <PhotoTips tool="/colour-background" />
          </section>
        )}
        {stage.kind === "idle" && <ToolLanding path="/colour-background" />}

        {stage.kind === "choose" && original && (
          <section className="grid gap-8 pt-6 md:grid-cols-2 md:items-center">
            <img src={original} alt="Your image" className="max-h-[60vh] w-full rounded-2xl border border-border object-contain" />
            <div>
              <h2 className="font-display text-2xl font-semibold">Choose a background colour</h2>
              <p className="mt-1 mb-5 text-sm text-muted-foreground">Tap a colour to start.</p>
              {palette}
              <button onClick={reset} className="mt-6 text-sm text-muted-foreground underline underline-offset-2">Choose a different photo</button>
            </div>
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
                {stage.phase === "download" ? "First time only — it's cached for next time." : "Then adding your colour…"}
              </p>
              <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${stage.pct}%` }} />
              </div>
              <p className="mt-2 text-sm tabular-nums text-muted-foreground">{stage.pct}%</p>
            </div>
          </section>
        )}

        {stage.kind === "error" && (
          <section className="mx-auto max-w-md pt-16 text-center">
            <h2 className="font-display text-2xl font-semibold">That didn't work</h2>
            <p className="mt-2 text-muted-foreground" role="alert">{stage.message}</p>
            <div className="mt-6 flex justify-center gap-3">
              {file && <button onClick={() => apply(colour)} className="rounded-full bg-primary px-5 py-2.5 font-medium text-primary-foreground">Try again</button>}
              <button onClick={reset} className="rounded-full border border-border px-5 py-2.5 font-medium">New image</button>
            </div>
          </section>
        )}

        {stage.kind === "done" && original && result && (
          <section className="pt-4">
            {cutCanvas && src && (
              <CutoutCues tool="/colour-background" cut={cutCanvas} source={src} onRetry={reset}
                onChange={async (c) => {
                  const b = await canvasToBlob(c);
                  setCutCanvas(c); setCutout(b);
                  setResult(URL.createObjectURL(await compositeOnColour(b, colour)));
                }} />
            )}
            <CompareSlider before={original} after={result} />
            <div className="mt-6">
              <p className="mb-3 text-sm font-medium">Try another colour</p>
              {palette}
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a href={result} download={downloadName} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-lg font-semibold text-primary-foreground shadow-lg transition-transform hover:scale-[1.01]">
                <Download className="h-5 w-5" /> Download PNG
              </a>
              <button onClick={reset} className="flex items-center justify-center gap-2 rounded-full border border-border px-6 py-4 font-medium hover:bg-accent">
                <RotateCcw className="h-4 w-4" /> New image
              </button>
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
