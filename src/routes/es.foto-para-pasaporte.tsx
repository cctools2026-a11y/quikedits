import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { PassportPhoto } from "@/components/tools/PassportPhoto";

export const Route = createFileRoute("/es/foto-para-pasaporte")({
  head: () => toolHead("/passport-photo", "es"),
  component: () => <PassportPhoto />,
});
