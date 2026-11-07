import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { LogoCleaner } from "@/components/tools/LogoCleaner";

export const Route = createFileRoute("/es/logo-y-firma-sin-fondo")({
  head: () => toolHead("/logo-cleaner", "es"),
  component: () => <LogoCleaner />,
});
