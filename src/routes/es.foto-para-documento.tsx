import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { PassportPhoto } from "@/components/tools/PassportPhoto";

export const Route = createFileRoute("/es/foto-para-documento")({
  head: () => toolHead("/id-card-photo", "es"),
  component: () => <PassportPhoto page="/id-card-photo" preset={{ sizeId: "uk", colour: "#FFFFFF", title: <>ID card and <span className="text-primary">licence photos</span>.</>, intro: "Upload a photo facing the camera. We size it to a standard 35 \u00d7 45 mm ID photo on white." }} />,
});
