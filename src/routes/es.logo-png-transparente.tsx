import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { LogoCleaner } from "@/components/tools/LogoCleaner";

export const Route = createFileRoute("/es/logo-png-transparente")({
  head: () => toolHead("/logo-to-png", "es"),
  component: () => <LogoCleaner page="/logo-to-png" preset={{ tol: 60, title: <>Make your logo a <span className="text-primary">transparent PNG</span>.</>, intro: "Upload your logo on white or any flat colour. The background disappears instantly." }} />,
});
