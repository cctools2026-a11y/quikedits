import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { PhotoBackground } from "@/components/tools/PhotoBackground";

export const Route = createFileRoute("/_authenticated/workspace/photo-background")({
  head: () => toolHead("/photo-background"),
  component: () => <PhotoBackground />,
});
