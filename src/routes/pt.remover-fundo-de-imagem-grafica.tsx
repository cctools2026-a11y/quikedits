import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { Cutouts } from "@/components/tools/Cutouts";

export const Route = createFileRoute("/pt/remover-fundo-de-imagem-grafica")({
  head: () => toolHead("/remove-background-from-graphic", "pt"),
  component: () => <Cutouts page="/remove-background-from-graphic" preset={{ raw: true, tol: 50, title: <>Clear the background of a <span className="text-primary">graphic</span>.</>, intro: "For screenshots, icons, clip art and flat graphics. The plain background disappears instantly, with no AI download." }} />,
});
