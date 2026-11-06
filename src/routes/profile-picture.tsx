import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ToolPage, useRenderedUrl, Field, Range, Choice, ResultActions, baseName } from "@/components/ToolPage";
import { ColourSwatches } from "@/components/ColourSwatches";
import { ctx2d, makeCanvas } from "@/lib/compose";
import { PROFILE_SIZE } from "@/lib/tool-sizes";

export const Route = createFileRoute("/profile-picture")({
  head: () => ({
    meta: [
      { title: "Free Profile Picture Maker — LinkedIn & CV Headshots" },
      { name: "description", content: "Turn any photo into a clean profile picture on a solid colour, in a circle or square. Free, private, in your browser." },
      { property: "og:title", content: "Free Profile Picture Maker" },
      { property: "og:description", content: "Professional headshots on a solid colour for LinkedIn, CVs and team pages." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProfilePicture,
});

const SHAPES = [{ id: "circle", label: "Circle" }, { id: "square", label: "Square" }] as const;

function ProfilePicture() {
  const [colour, setColour] = useState("#3B82F6");
  const [shape, setShape] = useState<"circle" | "square">("circle");
  const [zoom, setZoom] = useState(90);

  return (
    <ToolPage
      crop={[{ id: "square", label: "Square", ratio: 1 }, { id: "free", label: "Free", ratio: null }]}
      title={<>A sharp <span className="text-primary">profile picture</span> in seconds.</>}
      intro="Upload a headshot. We replace the background with a solid colour and frame it for LinkedIn, CVs, Slack or team pages."
    >
      {(items, reset) => {
        const it = items[0];
        return (
          <div className="grid gap-8 md:grid-cols-[300px_1fr]">
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
        {url && <img src={url} alt="Profile picture" className="w-full" />}
      </div>
      <ResultActions url={url} name={`${name}-profile.png`} onReset={reset} />
    </div>
  );
}
