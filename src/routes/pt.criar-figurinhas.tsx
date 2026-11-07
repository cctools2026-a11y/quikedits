import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { StickerMaker } from "@/components/tools/StickerMaker";

export const Route = createFileRoute("/pt/criar-figurinhas")({
  head: () => toolHead("/sticker-maker", "pt"),
  component: () => <StickerMaker />,
});
