import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { PassportPhoto } from "@/components/tools/PassportPhoto";

export const Route = createFileRoute("/schengen-visa-photo")({
  head: () => toolHead("/schengen-visa-photo"),
  component: () => <PassportPhoto page="/schengen-visa-photo" preset={{ sizeId: "uk", colour: "#EEEEEE", title: <>Schengen visa photo, <span className="text-primary">35 × 45 mm</span>.</>, intro: "Upload a well-lit photo facing the camera. We put it on light grey and size it for a Schengen visa application." }} />,
});
