import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { LogoCleaner } from "@/components/tools/LogoCleaner";

export const Route = createFileRoute("/_authenticated/workspace/logo-cleaner")({
  head: () => toolHead("/logo-cleaner"),
  component: () => <LogoCleaner />,
});
