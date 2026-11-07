import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { ColourTool } from "@/components/tools/ColourTool";

export const Route = createFileRoute("/pt/fundo-branco")({
  head: () => toolHead("/white-background", "pt"),
  component: () => <ColourTool page="/white-background" preset={{ colour: "#FFFFFF", title: <>Make your photo background <span className="text-primary">pure white</span>.</>, intro: "Upload a photo and we turn everything behind your subject pure white, right in your browser." }} />,
});
