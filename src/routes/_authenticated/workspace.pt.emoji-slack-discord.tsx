import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { StickerMaker } from "@/components/tools/StickerMaker";

export const Route = createFileRoute("/_authenticated/workspace/pt/emoji-slack-discord")({
  head: () => toolHead("/slack-emoji", "pt"),
  component: () => <StickerMaker page="/slack-emoji" preset={{ size: 128, stickerPad: 2, format: "image/png", title: <>Make a custom <span className="text-primary">emoji</span>.</>, intro: "Upload a photo of a face or object. We cut it out and make a tight 128 \u00d7 128 emoji for Slack or Discord." }} />,
});
