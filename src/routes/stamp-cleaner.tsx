import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { LogoCleaner } from "@/components/tools/LogoCleaner";

export const Route = createFileRoute("/stamp-cleaner")({
  head: () => toolHead("/stamp-cleaner"),
  component: () => <LogoCleaner page="/stamp-cleaner" preset={{ tol: 60, ink: true, title: <>Clean up a <span className="text-primary">stamp or seal</span>.</>, intro: "Photograph a red or blue stamp. We keep only the coloured ink and clear the paper and black text." }} />,
});
