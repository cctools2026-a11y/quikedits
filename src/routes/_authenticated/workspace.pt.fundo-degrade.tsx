import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { PhotoBackground } from "@/components/tools/PhotoBackground";

export const Route = createFileRoute("/_authenticated/workspace/pt/fundo-degrade")({
  head: () => toolHead("/gradient-background", "pt"),
  component: () => <PhotoBackground page="/gradient-background" preset={{ gradients: true, backdrops: [], title: <>Put your photo on a <span className="text-primary">gradient</span>.</>, intro: "Upload a photo and pick a soft gradient. Great for profile pictures, posters and thumbnails." }} />,
});
