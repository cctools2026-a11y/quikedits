import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { ColourTool } from "@/components/tools/ColourTool";

export const Route = createFileRoute("/colour-background")({
  head: () => toolHead("/colour-background"),
  component: () => <ColourTool />,
});
