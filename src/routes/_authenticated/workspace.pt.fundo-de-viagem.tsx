import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { PhotoBackground } from "@/components/tools/PhotoBackground";

export const Route = createFileRoute("/_authenticated/workspace/pt/fundo-de-viagem")({
  head: () => toolHead("/holiday-background", "pt"),
  component: () => <PhotoBackground page="/holiday-background" preset={{ backdrops: ["beach", "city", "mountains"], title: <>Put yourself on <span className="text-primary">holiday</span>.</>, intro: "Upload a photo and drop yourself onto a beach, a sunny city street or the mountains." }} />,
});
