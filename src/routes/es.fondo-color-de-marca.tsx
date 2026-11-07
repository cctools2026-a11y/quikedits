import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { ColourTool } from "@/components/tools/ColourTool";

export const Route = createFileRoute("/es/fondo-color-de-marca")({
  head: () => toolHead("/brand-colour-background", "es"),
  component: () => <ColourTool page="/brand-colour-background" preset={{ brand: true, title: <>Photos on your <span className="text-primary">brand colour</span>.</>, intro: "Paste your brand's hex code once. It's remembered on this device, so every photo matches." }} />,
});
