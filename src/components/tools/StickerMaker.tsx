import { useT } from "@/lib/use-i18n";
import type { Preset } from "@/lib/tools";
import { ZoomView } from "@/components/ZoomView";
import { ToolLanding } from "@/components/ToolLanding";
import { useState } from "react";
import { ToolPage, useRenderedUrl, Field, Range, Choice, ResultActions, baseName } from "@/components/ToolPage";
import { ctx2d, makeCanvas, withOutline } from "@/lib/compose";
import { fitContain, STICKER_SIZE } from "@/lib/tool-sizes";
import { PAGES, gridOnPage } from "@/lib/sheets";


const OUTLINES = [{ id: "#FFFFFF", label: "White" }, { id: "#000000", label: "Black" }] as const;
const FORMATS = [{ id: "image/png", label: "PNG" }, { id: "image/webp", label: "WebP (WhatsApp)" }] as const;

export function StickerMaker({ page = "/sticker-maker", preset = {} }: { page?: string; preset?: Preset }) {
  const t = useT();
  const [outline, setOutline] = useState<"#FFFFFF" | "#000000">(preset.outline ?? "#FFFFFF");
  const [width, setWidth] = useState(12);
  const [pageId, setPageId] = useState<(typeof PAGES)[number]["id"]>("a4");
  const [format, setFormat] = useState<"image/png" | "image/webp">(preset.format ?? "image/png");

  return (
    <ToolPage
      tool="/sticker-maker"
      page={page}
      below={<ToolLanding path={page} />}
      crop={[{ id: "free", label: t("Free"), ratio: null }, { id: "square", label: t("Square"), ratio: 1 }]}
      title={preset.title ?? <>{t("Turn any photo into a")} <span className="text-primary">{"sticker"}</span>.</>}
      intro={preset.intro ?? t("Upload a photo of a person, pet or object. We cut it out and add an outline, sized 512 × 512 for WhatsApp and Telegram.")}
    >
      {(items, reset) => {
        const it = items[0];
        return (
          <div className="tool-split grid gap-6 md:gap-8 md:grid-cols-[300px_1fr]">
            <aside className="space-y-6">
              <Field label={t("Outline colour")}><Choice value={outline} onChange={setOutline} options={OUTLINES.map((o) => ({ ...o, label: t(o.label) }))} /></Field>
              <Field label={t("Outline thickness: {n}", { n: width })}><Range label={t("Outline thickness")} value={width} min={0} max={30} onChange={setWidth} /></Field>
              {preset.sheet
                ? <Field label={t("Paper")}><Choice value={pageId} onChange={setPageId} options={PAGES.map((p) => ({ id: p.id, label: t(p.label) }))} /></Field>
                : <Field label={t("File type")}><Choice value={format} onChange={setFormat} options={FORMATS.map((o) => ({ ...o, label: t(o.label) }))} /></Field>}
            </aside>
            <StickerResult cut={it?.cutout ?? null} name={it ? baseName(it.file) : "sticker"} {...{ outline, width, format, reset }} size={preset.size ?? STICKER_SIZE} pad={preset.stickerPad ?? 16} shadow={!!preset.shadow} page={preset.sheet ? PAGES.find((p) => p.id === pageId)! : null} />
          </div>
        );
      }}
    </ToolPage>
  );
}

function StickerResult({ cut, name, outline, width, format, reset, size, pad, shadow, page }: { cut: HTMLCanvasElement | null; name: string; outline: string; width: number; format: string; reset: () => void; size: number; pad: number; shadow: boolean; page: { w: number; h: number } | null }) {
  const t = useT();
  const draw = (S: number) => {
    if (!cut) return null;
    const r = Math.round(width * (Math.max(cut.width, cut.height) / 480));
    const s = withOutline(cut, r, outline);
    const c = makeCanvas(S, S);
    const ctx = ctx2d(c);
    const f = fitContain(s.width, s.height, S, S, (pad * S) / STICKER_SIZE + (shadow ? S * 0.03 : 0));
    if (shadow) { ctx.shadowColor = "rgba(0,0,0,0.35)"; ctx.shadowBlur = S * 0.03; ctx.shadowOffsetX = S * 0.012; ctx.shadowOffsetY = S * 0.02; }
    ctx.drawImage(s, f.x, f.y, f.w, f.h);
    return c;
  };
  const url = useRenderedUrl(() => {
    if (!page) return draw(size);
    const one = draw(600); // 2 in at 300 dpi
    if (!one) return null;
    const c = makeCanvas(page.w, page.h);
    const ctx = ctx2d(c);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, page.w, page.h);
    ctx.setLineDash([12, 12]);
    ctx.strokeStyle = "#BBBBBB";
    ctx.lineWidth = 2;
    for (const p of gridOnPage(page.w, page.h, 600, 120, 60).cells) {
      ctx.drawImage(one, p.x, p.y);
      ctx.strokeRect(p.x, p.y, 600, 600);
    }
    return c;
  }, [cut, outline, width, size, pad, shadow, page], page ? "image/png" : format, format === "image/webp" && !page ? 100_000 : undefined);

  return (
    <div>
      <div className="checkerboard mx-auto max-w-md rounded-2xl p-4">{url && <ZoomView><img src={url} alt={t("Sticker")} className="w-full" /></ZoomView>}</div>
      {page && <p className="mt-3 text-xs text-muted-foreground">Prints at 300 dpi. Each sticker is 2 × 2 in; cut along the dashed lines.</p>}
      <ResultActions url={url} name={page ? `${name}-sticker-sheet.png` : `${name}-sticker.${format === "image/webp" ? "webp" : "png"}`} label={page ? t("Download sticker sheet") : t("Download sticker")} onReset={reset} />
    </div>
  );
}
