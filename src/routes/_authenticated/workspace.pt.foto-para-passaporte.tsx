import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { PassportPhoto } from "@/components/tools/PassportPhoto";

export const Route = createFileRoute("/_authenticated/workspace/pt/foto-para-passaporte")({
  head: () => toolHead("/passport-photo", "pt"),
  component: () => <PassportPhoto />,
});
