import type { Preset } from "@/lib/tools";
import { ZoomView } from "@/components/ZoomView";
import { ToolLanding } from "@/components/ToolLanding";
import { useState } from "react";
import { ToolPage, useRenderedUrl, Field, Range, Choice, ResultActions, baseName } from "@/components/ToolPage";
import { ctx2d, makeCanvas } from "@/lib/compose";
import { PASSPORT_SIZES, passportPx, sheetLayout, SHEET } from "@/lib/tool-sizes";
import { PassportExample, PassportSizeSelect } from "@/components/PassportExample";


type SizeId = (typeof PASSPORT_SIZES)[number]["id"];
const BGS = [{ id: "#FFFFFF", label: "White" }, { id: "#EEEEEE", label: "Light grey" }] as const;

export function PassportPhoto({ page = "/passport-photo", preset = {} }: { page?: string; preset?: Preset }) {
  const [sizeId, setSizeId] = useState<SizeId>("uk");
  const [bg, setBg] = useState<(typeof BGS)[number]["id"]>("#FFFFFF");
  const [zoom, setZoom] = useState(100);
  const [top, setTop] = useState(8);
  const size = passportPx(PASSPORT_SIZES.find((s) => s.id === sizeId) ?? PASSPORT_SIZES[1]);

  return (
    <ToolPage
      tool="/passport-photo"
      example={<PassportExample sizeId={sizeId} onSizeChange={setSizeId} />}
      below={<ToolLanding path={page} />}
      crop={[{ id: "photo", label: "Photo shape", ratio: size.w / size.h }, { id: "free", label: "Free", ratio: null }]}
      title={<>Passport &amp; ID photos, <span className="text-primary">done at home</span>.</>}
      intro="Upload a well-lit photo facing the camera. We replace the background and size it for your passport, visa or ID card."
    >
      {(items, reset) => <PassportResult cut={items[0]?.cutout ?? null} name={items[0] ? baseName(items[0].file) : "photo"} {...{ size, bg, zoom, top, reset }}
        controls={
          <>
            <PassportSizeSelect value={sizeId} onChange={setSizeId} />
            <Field label="Background"><Choice value={bg} onChange={setBg} options={BGS} /></Field>
            <Field label={`Size of person: ${zoom}%`}><Range label="Zoom" value={zoom} min={60} max={160} onChange={setZoom} /></Field>
            <Field label={`Space above head: ${top}%`}><Range label="Space above head" value={top} min={0} max={30} onChange={setTop} /></Field>
          </>
        } />}
    </ToolPage>
  );
}

function PassportResult({ cut, name, size, bg, zoom, top, reset, controls }: {
  cut: HTMLCanvasElement | null; name: string; size: { w: number; h: number }; bg: string; zoom: number; top: number; reset: () => void; controls: React.ReactNode;
}) {
  const draw = () => {
    if (!cut) return null;
    const c = makeCanvas(size.w, size.h);
    const ctx = ctx2d(c);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, size.w, size.h);
    const w = size.w * (zoom / 100);
    const h = (cut.height / cut.width) * w;
    ctx.drawImage(cut, (size.w - w) / 2, size.h * (top / 100), w, h);
    return c;
  };
  const single = useRenderedUrl(draw, [cut, size.w, size.h, bg, zoom, top]);
  const sheet = useRenderedUrl(() => {
    const one = draw();
    if (!one) return null;
    const c = makeCanvas(SHEET.w, SHEET.h);
    const ctx = ctx2d(c);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, SHEET.w, SHEET.h);
    ctx.strokeStyle = "#BBBBBB";
    for (const p of sheetLayout(size.w, size.h).positions) {
      ctx.drawImage(one, p.x, p.y);
      ctx.strokeRect(p.x + 0.5, p.y + 0.5, size.w - 1, size.h - 1);
    }
    return c;
  }, [cut, size.w, size.h, bg, zoom, top]);

  return (
    <div className="tool-split grid gap-6 md:gap-8 md:grid-cols-[300px_1fr]">
      <aside className="space-y-6">{controls}</aside>
      <div>
        <div className="grid items-start gap-6 sm:grid-cols-[1fr_2fr]">
          {single && <ZoomView><img src={single} alt="Passport photo" className="w-full rounded-lg border border-border" /></ZoomView>}
          {sheet && <ZoomView><img src={sheet} alt="Print sheet" className="w-full rounded-lg border border-border" /></ZoomView>}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          The sheet prints at 6 × 4 in (10 × 15 cm), 300 dpi. Always check your country's official photo rules before submitting.
        </p>
        <ResultActions url={single} name={`${name}-passport.png`} label="Download photo" />
        <ResultActions url={sheet} name={`${name}-passport-sheet.png`} label="Download print sheet" onReset={reset} />
      </div>
    </div>
  );
}
