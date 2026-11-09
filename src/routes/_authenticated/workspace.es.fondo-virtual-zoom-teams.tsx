import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { PhotoBackground } from "@/components/tools/PhotoBackground";

export const Route = createFileRoute("/_authenticated/workspace/es/fondo-virtual-zoom-teams")({
  head: () => toolHead("/virtual-background", "es"),
  component: () => <PhotoBackground page="/virtual-background" preset={{ canvas: { w: 1920, h: 1080 }, backdrops: ["office", "city", "beach", "mountains", "playroom"], title: <>Make a <span className="text-primary">Zoom or Teams</span> background.</>, intro: "Make a 1920 \u00d7 1080 virtual background, or put yourself on one for a profile banner." }} />,
});
