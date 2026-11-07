import { useT } from "@/lib/use-i18n";
import { ZoomView } from "@/components/ZoomView";
import { ShareButton } from "@/components/ShareButton";
import { ToolLanding, ToolPicker } from "@/components/ToolLanding";
import { useEffect, useRef, useState } from "react";
import { Download, ImagePlus, Loader2, RotateCcw } from "lucide-react";
import { CompareSlider } from "@/components/CompareSlider";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { prepareImage, validateImageFile } from "@/lib/image-file";
import { blobToCanvas, canvasToBlob } from "@/lib/compose";
import { ToolHero, TrustStrip } from "@/components/ToolHero";
import { UploadZone } from "@/components/UploadZone";
import { CutoutCues } from "@/components/CutoutCues";


type Stage =
  | { kind: "idle" }
  | { kind: "working"; phase: "download" | "process"; pct: number }
  | { kind: "done" }
  | { kind: "error"; message: string };

export function RemoveBackground() {
  const t = useT();
  const [stage, setStage] = useState<Stage>({ kind: "idle" });
  const [file, setFile] = useState<File | null>(null);
  const [original, setOriginal] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [fast, setFast] = useState(false);
  const [cut, setCut] = useState<HTMLCanvasElement | null>(null);
  const [src, setSrc] = useState<HTMLCanvasElement | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [fileError, setFileError] = useState<string | null>(null);

  useEffect(() => {
    if (stage.kind !== "working") return;
    const start = Date.now();
    const timer = setInterval(() => setElapsed(Math.floor((Date.now() - start) / 1000)), 1000);
    return () => clearInterval(timer);
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
        // Model files are self-hosted (verified against IMG.LY's published SHA-256 hashes).
        publicPath: `${window.location.origin}/imgly/`,
        model: fast ? "isnet_quint8" : "isnet_fp16",
        output: { format: "image/png" },
        progress: (key, current, total) => {
          const pct = total ? Math.round((current / total) * 100) : 0;
          setStage({ kind: "working", phase: key.startsWith("fetch") ? "download" : "process", pct });
        },
      });
      setCut(await blobToCanvas(blob));
      setSrc(await blobToCanvas(input));
      setResult(URL.createObjectURL(blob));
      setStage({ kind: "done" });
    } catch (e) {
      console.error(e);
      const msg = e instanceof Error ? e.message : String(e);
      setStage({
        kind: "error",
        message: /memory|allocation/i.test(msg)
          ? t("Your device ran out of memory. Try the faster model or a smaller image.")
          : /fetch|network/i.test(msg)
            ? t("Couldn't download the AI model. Check your connection and try again.")
            : t("Something went wrong while removing the background. Please try again."),
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
    <div className="bg-mat min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-5xl px-4">
        {stage.kind === "idle" && (
          <ToolHero path="/" title={<>{t("Remove any background.")} <span className="text-primary">{t("Free")}</span>{t(", private, instant.")}</>} intro={t("The AI runs right in your browser. No sign-up, no uploads, no limits.")}>
            <UploadZone tool="/" onFiles={(f) => pick(f[0])} />
            {fileError && <p role="alert" className="mt-4 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{t(fileError)}</p>}
            <label className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" checked={fast} onChange={(e) => setFast(e.target.checked)} className="h-4 w-4 accent-primary" />
              {t("Faster mode for older phones and laptops (slightly lower quality)")}
            </label>
          </ToolHero>
        )}
        {stage.kind === "idle" && <TrustStrip />}
        {stage.kind === "idle" && <ToolPicker />}
        {stage.kind === "idle" && <ToolLanding path="/" home />}

        {stage.kind === "working" && original && (
          <section className="grid gap-8 pt-6 md:grid-cols-2 md:items-center">
            <img src={original} alt={t("Your image")} className="max-h-[60vh] w-full rounded-2xl border border-border object-contain opacity-60" />
            <div>
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <h2 className="font-display mt-4 text-2xl font-semibold">
                {stage.phase === "download" ? t("Downloading AI model") : t("Removing background")}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {stage.phase === "download" ? t("First time only — it's cached for next time.") : t("Working on your device…")}
              </p>
              <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${stage.pct}%` }} />
              </div>
              <p className="mt-2 text-sm tabular-nums text-muted-foreground">{stage.pct}% · {elapsed}s</p>
              {elapsed > 20 && (
                <p className="mt-4 text-sm text-muted-foreground">{t("This can take up to a minute on older devices. Please keep this tab open.")}</p>
              )}
            </div>
          </section>
        )}

        {stage.kind === "error" && (
          <section className="mx-auto max-w-md pt-16 text-center">
            <h2 className="font-display text-2xl font-semibold">{t("That didn't work")}</h2>
            <p className="mt-2 text-muted-foreground" role="alert">{t(stage.message)}</p>
            <div className="mt-6 flex justify-center gap-3">
              {file && <button onClick={() => run(file)} className="rounded-full bg-primary px-5 py-2.5 font-medium text-primary-foreground">{t("Try again")}</button>}
              <button onClick={reset} className="rounded-full border border-border px-5 py-2.5 font-medium">{t("New image")}</button>
            </div>
            <label className="mt-5 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" checked={fast} onChange={(e) => setFast(e.target.checked)} className="h-4 w-4 accent-primary" />
              {t("Use faster mode")}
            </label>
          </section>
        )}

        {stage.kind === "done" && original && result && (
          <section className="pt-4">
            {cut && src && (
              <CutoutCues tool="/" cut={cut} source={src} onRetry={reset}
                onChange={(c) => { setCut(c); void canvasToBlob(c).then((b) => setResult(URL.createObjectURL(b))); }} />
            )}
            <ZoomView><CompareSlider before={original} after={result} /></ZoomView>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a href={result} download={downloadName} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-lg font-semibold text-primary-foreground shadow-lg transition-transform hover:scale-[1.01]">
                <Download className="h-5 w-5" /> {t("Download transparent PNG")}
              </a>
              <ShareButton url={result} name={downloadName} />
              <button onClick={reset} className="flex items-center justify-center gap-2 rounded-full border border-border px-6 py-4 font-medium hover:bg-accent">
                <RotateCcw className="h-4 w-4" /> {t("New image")}
              </button>
            </div>
            <p className="mt-3 text-center text-xs text-muted-foreground">{t("Drag the handle to compare. Processed entirely in your browser.")}</p>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}


