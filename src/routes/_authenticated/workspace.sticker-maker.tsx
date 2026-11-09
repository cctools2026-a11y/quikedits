import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { StickerMaker } from "@/components/tools/StickerMaker";

export const Route = createFileRoute("/_authenticated/workspace/sticker-maker")({
  head: () => toolHead("/sticker-maker"),
  component: () => <StickerMaker />,
});
