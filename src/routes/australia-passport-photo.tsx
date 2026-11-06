import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { PassportPhoto } from "@/components/tools/PassportPhoto";

export const Route = createFileRoute("/australia-passport-photo")({
  head: () => toolHead("/australia-passport-photo"),
  component: () => <PassportPhoto page="/australia-passport-photo" preset={{ sizeId: "uk", colour: "#FFFFFF", title: <>Australian passport photo, <span className="text-primary">35 × 45 mm</span>.</>, intro: "Upload a well-lit photo facing the camera. We put it on white and size it for an Australian passport, with a print sheet." }} />,
});
