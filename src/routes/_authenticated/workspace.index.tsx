import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { RemoveBackground } from "@/components/tools/RemoveBackground";

export const Route = createFileRoute("/_authenticated/workspace/")({
  head: () => toolHead("/"),
  component: RemoveBackground,
});
