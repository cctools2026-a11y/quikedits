import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { Cutouts } from "@/components/tools/Cutouts";

export const Route = createFileRoute("/transparent-png-for-slides")({
  head: () => toolHead("/transparent-png-for-slides"),
  component: () => <Cutouts page="/transparent-png-for-slides" preset={{ maxSide: 1920, title: <>Cut-outs for <span className="text-primary">slides</span>.</>, intro: "Upload a photo. We cut out the subject, trim the edges and size it to fit a slide without slowing your deck down." }} />,
});
