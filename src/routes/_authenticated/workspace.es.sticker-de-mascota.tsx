import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { StickerMaker } from "@/components/tools/StickerMaker";

export const Route = createFileRoute("/_authenticated/workspace/es/sticker-de-mascota")({
  head: () => toolHead("/pet-sticker", "es"),
  component: () => <StickerMaker page="/pet-sticker" preset={{ shadow: true, format: "image/webp", title: <>Turn your pet into a <span className="text-primary">sticker</span>.</>, intro: "Upload a photo of your pet. We cut them out and add a white outline and a playful drop shadow." }} />,
});
