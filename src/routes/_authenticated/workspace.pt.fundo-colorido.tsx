import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { ColourTool } from "@/components/tools/ColourTool";

export const Route = createFileRoute("/_authenticated/workspace/pt/fundo-colorido")({
  head: () => toolHead("/colour-background", "pt"),
  component: () => <ColourTool />,
});
