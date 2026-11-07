import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { PhotoBackground } from "@/components/tools/PhotoBackground";

export const Route = createFileRoute("/pt/trocar-fundo-da-foto")({
  head: () => toolHead("/photo-background", "pt"),
  component: () => <PhotoBackground />,
});
