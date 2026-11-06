import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { Cutouts } from "@/components/tools/Cutouts";

export const Route = createFileRoute("/cut-out-hair")({
  head: () => toolHead("/cut-out-hair"),
  component: () => <Cutouts page="/cut-out-hair" preset={{ title: <>Cut out <span className="text-primary">hair</span> cleanly.</>, intro: "Upload a portrait. We handle the tricky edges, and you can brush in or out any strands after." }} />,
});
