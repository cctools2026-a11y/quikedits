import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { LogoCleaner } from "@/components/tools/LogoCleaner";

export const Route = createFileRoute("/pt/logo-e-assinatura-sem-fundo")({
  head: () => toolHead("/logo-cleaner", "pt"),
  component: () => <LogoCleaner />,
});
