import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { PassportPhoto } from "@/components/tools/PassportPhoto";

export const Route = createFileRoute("/es/foto-pasaporte-reino-unido")({
  head: () => toolHead("/uk-passport-photo", "es"),
  component: () => <PassportPhoto page="/uk-passport-photo" preset={{ sizeId: "uk", colour: "#EEEEEE", title: <>UK passport photo, <span className="text-primary">35 × 45 mm</span>.</>, intro: "Upload a well-lit photo facing the camera. We put it on light grey and size it for a UK passport, with a print sheet." }} />,
});
