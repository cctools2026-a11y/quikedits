import type { Preset } from "@/lib/tools";
import { ZoomView } from "@/components/ZoomView";
import { ToolLanding } from "@/components/ToolLanding";
import { useState } from "react";
import { ToolPage, useRenderedUrl, Field, Range, Choice, ResultActions, baseName } from "@/components/ToolPage";
import { ColourSwatches } from "@/components/ColourSwatches";
import { ctx2d, makeCanvas } from "@/lib/compose";
import { PROFILE_SIZE } from "@/lib/tool-sizes";


const SHAPES = [{ id: "circle", label: "Circle" }, { id: "square", label: "Square" }] as const;

export function ProfilePicture({ page = "/profile-picture", preset = {} }: { page?: string; preset?: Preset }) {
  const [colour, setColour] = useState(preset.colour ?? "#3B82F6");
  const [shape, setShape] = useState<"circle" | "square">(preset.shape ?? "circle");
  const [zoom, setZoom] = useState(90);

  return (
    <ToolPage
      tool="/profile-picture"
      page={page}
      below={<ToolLanding path={page} />}
      crop={[{ id: "square", label: "Square", ratio: 1 }, { id: "free", label: "Free", ratio: null }]}
      title={preset.title ?? <>A sharp <span className="text-primary">profile picture</span> in seconds.</>}
      intro={preset.intro ?? "Upload a headshot. We replace the background with a solid colour and frame it for LinkedIn, CVs, Slack or team pages."}
    >
      {(items, reset) => {
        const it = items[0];
        return (
          <div className="tool-split grid gap-6 md:gap-8 md:grid-cols-[300px_1fr]">
            <aside className="space-y-6">
              <Field label="Background colour"><ColourSwatches value={colour} onChange={setColour} /></Field>
              <Field label="Shape"><Choice value={shape} onChange={setShape} options={SHAPES} /></Field>
              <Field label={`Size of person: ${zoom}%`}><Range label="Zoom" value={zoom} min={50} max={150} onChange={setZoom} /></Field>
            </aside>
            <ProfileResult cut={it?.cutout ?? null} name={it ? baseName(it.file) : "profile"} {...{ colour, shape, zoom, reset }} />
          </div>
        );
      }}
    </ToolPage>
  );
}

function ProfileResult({ cut, name, colour, shape, zoom, reset }: { cut: HTMLCanvasElement | null; name: string; colour: string; shape: string; zoom: number; reset: () => void }) {
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
    return c;
  }, [cut, colour, shape, zoom]);

  return (
    <div>
      <div className="checkerboard mx-auto max-w-md rounded-2xl p-4">
        {url && <ZoomView><img src={url} alt="Profile picture" className="w-full" /></ZoomView>}
      </div>
      <ResultActions url={url} name={`${name}-profile.png`} onReset={reset} />
    </div>
  );
}
