import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { ColourTool } from "@/components/tools/ColourTool";

export const Route = createFileRoute("/_authenticated/workspace/black-background")({
  head: () => toolHead("/black-background"),
  component: () => <ColourTool page="/black-background" preset={{ colour: "#000000", title: <>Put your photo on <span className="text-primary">black</span>.</>, intro: "Upload a photo and we place it on pure black for a bold, dramatic look." }} />,
});
