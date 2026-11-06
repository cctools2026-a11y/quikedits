import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { PassportPhoto } from "@/components/tools/PassportPhoto";

export const Route = createFileRoute("/passport-photo")({
  head: () => toolHead("/passport-photo"),
  component: () => <PassportPhoto />,
});
