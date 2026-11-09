import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { PassportPhoto } from "@/components/tools/PassportPhoto";

export const Route = createFileRoute("/_authenticated/workspace/es/foto-pasaporte-estados-unidos")({
  head: () => toolHead("/us-passport-photo", "es"),
  component: () => <PassportPhoto page="/us-passport-photo" preset={{ sizeId: "us", colour: "#FFFFFF", title: <>US passport photo, <span className="text-primary">2 × 2 in</span>.</>, intro: "Upload a well-lit photo facing the camera. We put it on white and size it for a US passport, with a print sheet." }} />,
});
