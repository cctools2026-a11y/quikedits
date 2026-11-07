import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { PhotoBackground } from "@/components/tools/PhotoBackground";

export const Route = createFileRoute("/es/cambiar-fondo-de-foto")({
  head: () => toolHead("/photo-background", "es"),
  component: () => <PhotoBackground />,
});
