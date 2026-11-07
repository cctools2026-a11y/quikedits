import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { ColourTool } from "@/components/tools/ColourTool";

export const Route = createFileRoute("/es/fondo-de-color")({
  head: () => toolHead("/colour-background", "es"),
  component: () => <ColourTool />,
});
