import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { StickerMaker } from "@/components/tools/StickerMaker";

export const Route = createFileRoute("/_authenticated/workspace/pt/figurinha-telegram")({
  head: () => toolHead("/telegram-sticker", "pt"),
  component: () => <StickerMaker page="/telegram-sticker" preset={{ format: "image/webp", title: <>Make your own <span className="text-primary">Telegram sticker</span>.</>, intro: "Upload a photo. We cut it out, add an outline and save a 512 \u00d7 512 WebP for Telegram's sticker bot." }} />,
});
