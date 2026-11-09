import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { LogoCleaner } from "@/components/tools/LogoCleaner";

export const Route = createFileRoute("/_authenticated/workspace/pt/mudar-cor-do-logo")({
  head: () => toolHead("/recolour-logo", "pt"),
  component: () => <LogoCleaner page="/recolour-logo" preset={{ tol: 60, recolour: "white", title: <>Make your logo <span className="text-primary">all white or black</span>.</>, intro: "Upload your logo. We clear the background and turn it all white or all black for dark or light backgrounds." }} />,
});
