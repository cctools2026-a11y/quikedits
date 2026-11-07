import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { PassportPhoto } from "@/components/tools/PassportPhoto";

export const Route = createFileRoute("/es/foto-pasaporte-india")({
  head: () => toolHead("/india-passport-photo", "es"),
  component: () => <PassportPhoto page="/india-passport-photo" preset={{ sizeId: "in", colour: "#FFFFFF", title: <>India passport photo, <span className="text-primary">51 × 51 mm</span>.</>, intro: "Upload a well-lit photo facing the camera. We put it on white and size it for an Indian passport, with a print sheet." }} />,
});
