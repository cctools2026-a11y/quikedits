import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { RemoveBackground } from "@/components/tools/RemoveBackground";

export const Route = createFileRoute("/es/")({
  head: () => toolHead("/", "es"),
  component: RemoveBackground,
});
