import { useT } from "@/lib/use-i18n";
import type { Preset } from "@/lib/tools";
import { ZoomView } from "@/components/ZoomView";
import { ToolLanding } from "@/components/ToolLanding";
import { useEffect, useState } from "react";
import { ZipButton, useUrlMap } from "@/components/ZipButton";
import { uniqueNames } from "@/lib/zip";
import { ShareButton } from "@/components/ShareButton";
import { Download } from "lucide-react";
import { ToolPage, useRenderedUrl, Field, Range, Choice, baseName, type Item } from "@/components/ToolPage";
import { ColourSwatches } from "@/components/ColourSwatches";
import { ctx2d, makeCanvas } from "@/lib/compose";
import { fitContain, PRODUCT_SIZES } from "@/lib/tool-sizes";


type SizeId = (typeof PRODUCT_SIZES)[number]["id"];

export function ProductPhoto({ page = "/product-photo", preset = {} }: { page?: string; preset?: Preset }) {
  const t = useT();
  const [colour, setColour] = useState(preset.colour ?? "#FFFFFF");
  const [sizeId, setSizeId] = useState<SizeId>((preset.sizeId as SizeId | undefined) ?? "square");
  const [pad, setPad] = useState(preset.pad ?? 8);
  const [shadow, setShadow] = useState<"off" | "on">(preset.shadow ? "on" : "off");
  const [urls, report] = useUrlMap();
  const size = PRODUCT_SIZES.find((s) => s.id === sizeId)!;

  return (
    <ToolPage
      tool="/product-photo"
      page={page}
      below={<ToolLanding path={page} />}
      crop={[{ id: "free", label: "Free", ratio: null }, { id: "square", label: "Square", ratio: 1 }]}
      multiple
      title={preset.title ?? <>{t("Product photos on")} <span className="text-primary">{"clean white"}</span>{t(", ready to list.")}</>}
      intro={preset.intro ?? t("Upload one or several product photos. We remove the background, centre each product and size it for Amazon, eBay, Etsy or Shopify.")}
    >
      {(items, reset) => { const names = uniqueNames(items.map((x) => `${baseName(x.file)}-product.png`)); return (
        <div className="tool-split grid gap-6 md:gap-8 md:grid-cols-[280px_1fr]">
          <aside className="space-y-6">
            <Field label={t("Background")}><ColourSwatches value={colour} onChange={setColour} colours={["#FFFFFF", "#F5F0E8", "#E5E7EB", "#000000"]} /></Field>
            <Field label={t("Size")}>
              <Choice value={sizeId} onChange={setSizeId} options={PRODUCT_SIZES.map((s) => ({ id: s.id, label: s.label }))} />
            </Field>
            <Field label={`Space around product: ${pad}%`}><Range label={t("Padding")} value={pad} min={0} max={25} onChange={setPad} /></Field>
            <Field label={t("Shadow")}><Choice value={shadow} onChange={setShadow} options={[{ id: "off", label: "None" }, { id: "on", label: t("Soft shadow") }]} /></Field>
            <ZipButton files={items.map((_, i) => ({ url: urls[i] ?? null, name: names[i]! }))} name="product-photos.zip" />
            <button onClick={reset} className="w-full rounded-full border border-border px-5 py-3 font-medium hover:bg-accent">{t("New images")}</button>
          </aside>
          <div className="grid gap-6 sm:grid-cols-2">
            {items.map((it, i) => <ProductResult key={i} item={it} name={names[i]!} colour={colour} w={size.w} h={size.h} pad={pad} shadow={shadow === "on"} onUrl={(u) => report(i, u)} />)}
          </div>
        </div>
      ); }}
    </ToolPage>
  );
}

function ProductResult({ item, name, colour, w, h, pad, shadow, onUrl }: { item: Item; name: string; colour: string; w: number; h: number; pad: number; shadow: boolean; onUrl: (u: string | null) => void }) {
  const t = useT();
  const url = useRenderedUrl(() => {
    const cut = item.cutout;
    if (!cut) return null;
    const c = makeCanvas(w, h);
    const ctx = ctx2d(c);
    ctx.fillStyle = colour;
    ctx.fillRect(0, 0, w, h);
    const f = fitContain(cut.width, cut.height, w, h, (Math.min(w, h) * pad) / 100);
    if (shadow) {
      // Soft contact shadow: an ellipse just under the product's base.
      const sh = Math.max(12, f.h * 0.06);
      ctx.save();
      ctx.filter = `blur(${Math.round(sh * 0.6)}px)`;
      ctx.fillStyle = "rgba(0,0,0,0.28)";
      ctx.beginPath();
      ctx.ellipse(f.x + f.w / 2, f.y + f.h - sh * 0.15, f.w * 0.42, sh / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.drawImage(cut, f.x, f.y, f.w, f.h);
    return c;
  }, [item.cutout, colour, w, h, pad, shadow]);
  useEffect(() => { onUrl(url); }, [url, onUrl]);

  if (item.error) return <p className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive">{item.file.name}: {item.error}</p>;
  return (
    <figure className="rounded-2xl border border-border bg-card p-3">
      {url ? <ZoomView><img src={url} alt={`${item.file.name} on new background`} className="w-full rounded-xl" /></ZoomView> : <div className="aspect-square animate-pulse rounded-xl bg-muted" />}
      <figcaption className="mt-3 flex items-center justify-between gap-2 text-sm">
        <span className="truncate text-muted-foreground">{item.file.name}</span>
        <a href={url ?? undefined} download={name} className="flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-4 py-2 font-medium text-primary-foreground">
          <Download className="h-4 w-4" /> {t("PNG")}
        </a>
        <ShareButton compact url={url} name={name} />
      </figcaption>
    </figure>
  );
}
