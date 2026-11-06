import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ToolPage, useRenderedUrl, Field, Range, Choice, ResultActions, baseName } from "@/components/ToolPage";
import { ctx2d, makeCanvas, withOutline } from "@/lib/compose";
import { fitContain, STICKER_SIZE } from "@/lib/tool-sizes";

export const Route = createFileRoute("/sticker-maker")({
  head: () => ({
    meta: [
      { title: "Free Sticker Maker — WhatsApp & Telegram Stickers from Photos" },
      { name: "description", content: "Cut out a photo and add a sticker outline. 512 × 512 PNG or WebP for WhatsApp and Telegram. Free and private." },
      { property: "og:title", content: "Free Photo Sticker Maker" },
      { property: "og:description", content: "Turn photos into outlined stickers for WhatsApp and Telegram, right in your browser." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StickerMaker,
});

const OUTLINES = [{ id: "#FFFFFF", label: "White" }, { id: "#000000", label: "Black" }] as const;
const FORMATS = [{ id: "image/png", label: "PNG" }, { id: "image/webp", label: "WebP (WhatsApp)" }] as const;

function StickerMaker() {
  const [outline, setOutline] = useState<"#FFFFFF" | "#000000">("#FFFFFF");
  const [width, setWidth] = useState(12);
  const [format, setFormat] = useState<"image/png" | "image/webp">("image/png");

  return (
    <ToolPage
      title={<>Turn any photo into a <span className="text-primary">sticker</span>.</>}
      intro="Upload a photo of a person, pet or object. We cut it out and add an outline, sized 512 × 512 for WhatsApp and Telegram."
    >
      {(items, reset) => {
        const it = items[0];
        return (
          <div className="grid gap-8 md:grid-cols-[300px_1fr]">
            <aside className="space-y-6">
              <Field label="Outline colour"><Choice value={outline} onChange={setOutline} options={OUTLINES} /></Field>
              <Field label={`Outline thickness: ${width}`}><Range label="Outline thickness" value={width} min={0} max={30} onChange={setWidth} /></Field>
              <Field label="File type"><Choice value={format} onChange={setFormat} options={FORMATS} /></Field>
            </aside>
            <StickerResult cut={it?.cutout ?? null} name={it ? baseName(it.file) : "sticker"} {...{ outline, width, format, reset }} />
          </div>
        );
      }}
    </ToolPage>
  );
}

function StickerResult({ cut, name, outline, width, format, reset }: { cut: HTMLCanvasElement | null; name: string; outline: string; width: number; format: string; reset: () => void }) {
  const url = useRenderedUrl(() => {
    if (!cut) return null;
    const r = Math.round(width * (Math.max(cut.width, cut.height) / 480));
    const s = withOutline(cut, r, outline);
    const c = makeCanvas(STICKER_SIZE, STICKER_SIZE);
    const f = fitContain(s.width, s.height, STICKER_SIZE, STICKER_SIZE, 16);
    ctx2d(c).drawImage(s, f.x, f.y, f.w, f.h);
    return c;
  }, [cut, outline, width], format);

  return (
    <div>
      <div className="checkerboard mx-auto max-w-md rounded-2xl p-4">{url && <img src={url} alt="Sticker" className="w-full" />}</div>
      <ResultActions url={url} name={`${name}-sticker.${format === "image/webp" ? "webp" : "png"}`} label="Download sticker" onReset={reset} />
    </div>
  );
}
