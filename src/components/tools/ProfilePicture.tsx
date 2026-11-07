import { useT } from "@/lib/use-i18n";
import type { Preset } from "@/lib/tools";
import { ZoomView } from "@/components/ZoomView";
import { ToolLanding } from "@/components/ToolLanding";
import { useEffect, useState } from "react";
import { ZipButton, useUrlMap } from "@/components/ZipButton";
import { uniqueNames } from "@/lib/zip";
import { ToolPage, useRenderedUrl, Field, Range, Choice, ResultActions, baseName } from "@/components/ToolPage";
import { ColourSwatches } from "@/components/ColourSwatches";
import { ctx2d, makeCanvas } from "@/lib/compose";
import { PROFILE_SIZE } from "@/lib/tool-sizes";


const RINGS = [{ id: "none", label: "None" }, { id: "#FFFFFF", label: "White" }, { id: "#5865F2", label: "Blurple" }, { id: "#FF4FA3", label: "Pink" }] as const;
const SHAPES = [{ id: "circle", label: "Circle" }, { id: "square", label: "Square" }] as const;

export function ProfilePicture({ page = "/profile-picture", preset = {} }: { page?: string; preset?: Preset }) {
  const t = useT();
  const [colour, setColour] = useState(preset.colour ?? "#3B82F6");
  const [shape, setShape] = useState<"circle" | "square">(preset.shape ?? "circle");
  const [zoom, setZoom] = useState(90);
  const [ring, setRing] = useState(preset.ring ?? "none");
  const [urls, report] = useUrlMap();

  return (
    <ToolPage
      tool="/profile-picture"
      multiple={!!preset.multiple}
      page={page}
      below={<ToolLanding path={page} />}
      crop={[{ id: "square", label: "Square", ratio: 1 }, { id: "free", label: "Free", ratio: null }]}
      title={preset.title ?? <>{t("A sharp")} <span className="text-primary">{"profile picture"}</span> {t("in seconds.")}</>}
      intro={preset.intro ?? t("Upload a headshot. We replace the background with a solid colour and frame it for LinkedIn, CVs, Slack or team pages.")}
    >
      {(items, reset) => {
        const it = items[0];
        const names = uniqueNames(items.map((x) => `${baseName(x.file)}-profile.png`));
        return (
          <div className="tool-split grid gap-6 md:gap-8 md:grid-cols-[300px_1fr]">
            <aside className="space-y-6">
              <Field label={t("Background colour")}><ColourSwatches value={colour} onChange={setColour} /></Field>
              <Field label={t("Shape")}><Choice value={shape} onChange={setShape} options={SHAPES} /></Field>
              <Field label={`Size of person: ${zoom}%`}><Range label={t("Zoom")} value={zoom} min={50} max={150} onChange={setZoom} /></Field>
              {shape === "circle" && <Field label={t("Outline ring")}><Choice value={ring} onChange={setRing} options={RINGS} /></Field>}
            </aside>
            {preset.multiple && items.length > 1 ? (
              <div>
                <p className="mb-4 text-sm text-muted-foreground">Same background and framing for all {items.length} photos.</p>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {items.map((x, i) => <ProfileResult key={i} compact cut={x.cutout} name={names[i]!} onUrl={(u) => report(i, u)} {...{ colour, shape, zoom, ring, reset }} />)}
                </div>
                <div className="mt-6 space-y-3">
                  <ZipButton files={items.map((_, i) => ({ url: urls[i] ?? null, name: names[i]! }))} name="team-headshots.zip" />
                  <button onClick={reset} className="w-full rounded-full border border-border px-6 py-3 font-medium hover:bg-accent">{t("New photos")}</button>
                </div>
              </div>
            ) : <ProfileResult cut={it?.cutout ?? null} name={names[0] ?? "profile.png"} {...{ colour, shape, zoom, ring, reset }} />}
          </div>
        );
      }}
    </ToolPage>
  );
}

function ProfileResult({ cut, name, colour, shape, zoom, ring, reset, compact, onUrl }: { cut: HTMLCanvasElement | null; name: string; colour: string; shape: string; zoom: number; ring: string; reset: () => void; compact?: boolean; onUrl?: (u: string | null) => void }) {
  const t = useT();
  const url = useRenderedUrl(() => {
    if (!cut) return null;
    const S = PROFILE_SIZE;
    const c = makeCanvas(S, S);
    const ctx = ctx2d(c);
    if (shape === "circle") {
      ctx.beginPath();
      ctx.arc(S / 2, S / 2, S / 2, 0, Math.PI * 2);
      ctx.clip();
    }
    ctx.fillStyle = colour;
    ctx.fillRect(0, 0, S, S);
    const s = (S * (zoom / 100)) / Math.max(cut.width, cut.height * 0.8);
    const w = cut.width * s, h = cut.height * s;
    ctx.drawImage(cut, (S - w) / 2, Math.max(S - h, S * 0.06), w, h);
    if (shape === "circle" && ring !== "none") {
      const lw = S * 0.045;
      ctx.beginPath();
      ctx.arc(S / 2, S / 2, S / 2 - lw / 2, 0, Math.PI * 2);
      ctx.lineWidth = lw;
      ctx.strokeStyle = ring;
      ctx.stroke();
    }
    return c;
  }, [cut, colour, shape, zoom, ring]);
  useEffect(() => { onUrl?.(url); }, [url, onUrl]);
  if (compact) return url ? <a href={url} download={name} className="block"><img src={url} alt={name} className="w-full" /></a> : <div className="aspect-square animate-pulse rounded-full bg-muted" />;

  return (
    <div>
      <div className="checkerboard mx-auto max-w-md rounded-2xl p-4">
        {url && <ZoomView><img src={url} alt={t("Profile picture")} className="w-full" /></ZoomView>}
      </div>
      <ResultActions url={url} name={name} onReset={reset} />
    </div>
  );
}
