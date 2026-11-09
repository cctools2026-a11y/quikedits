import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { StickerMaker } from "@/components/tools/StickerMaker";

export const Route = createFileRoute("/_authenticated/workspace/es/hoja-de-pegatinas-para-imprimir")({
  head: () => toolHead("/printable-sticker-sheet", "es"),
  component: () => <StickerMaker page="/printable-sticker-sheet" preset={{ sheet: true, title: <>A <span className="text-primary">printable</span> sticker sheet.</>, intro: "Upload a photo. We make a sticker and fill an A4 or Letter page with copies and cut lines, ready to print." }} />,
});
