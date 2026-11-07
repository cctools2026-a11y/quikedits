import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { Cutouts } from "@/components/tools/Cutouts";

export const Route = createFileRoute("/es/quitar-fondo-en-lote")({
  head: () => toolHead("/batch-remove-background", "es"),
  component: () => <Cutouts page="/batch-remove-background" preset={{ multiple: true, title: <>Remove backgrounds from <span className="text-primary">many photos</span>.</>, intro: "Upload up to 20 photos at once. Each one is cut out on your device, then download them all in one ZIP." }} />,
});
