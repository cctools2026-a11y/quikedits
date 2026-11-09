import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { StickerMaker } from "@/components/tools/StickerMaker";

export const Route = createFileRoute("/_authenticated/workspace/es/crear-stickers")({
  head: () => toolHead("/sticker-maker", "es"),
  component: () => <StickerMaker />,
});
