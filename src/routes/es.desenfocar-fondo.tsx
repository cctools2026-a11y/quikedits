import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { PhotoBackground } from "@/components/tools/PhotoBackground";

export const Route = createFileRoute("/es/desenfocar-fondo")({
  head: () => toolHead("/blur-background", "es"),
  component: () => <PhotoBackground page="/blur-background" preset={{ blur: true, title: <><span className="text-primary">Blur</span> your photo background.</>, intro: "Upload a photo. Your subject stays sharp and the scene behind softens, like a portrait camera." }} />,
});
