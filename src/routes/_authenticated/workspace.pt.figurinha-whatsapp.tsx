import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { StickerMaker } from "@/components/tools/StickerMaker";

export const Route = createFileRoute("/_authenticated/workspace/pt/figurinha-whatsapp")({
  head: () => toolHead("/whatsapp-sticker", "pt"),
  component: () => <StickerMaker page="/whatsapp-sticker" preset={{ outline: "#FFFFFF", format: "image/webp", title: <>Make your own <span className="text-primary">WhatsApp sticker</span>.</>, intro: "Upload a photo. We cut it out, add a white outline and save it as a 512 × 512 WebP for WhatsApp." }} />,
});
