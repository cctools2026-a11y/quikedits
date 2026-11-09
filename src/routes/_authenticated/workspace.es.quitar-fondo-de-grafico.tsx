import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { Cutouts } from "@/components/tools/Cutouts";

export const Route = createFileRoute("/_authenticated/workspace/es/quitar-fondo-de-grafico")({
  head: () => toolHead("/remove-background-from-graphic", "es"),
  component: () => <Cutouts page="/remove-background-from-graphic" preset={{ raw: true, tol: 50, title: <>Clear the background of a <span className="text-primary">graphic</span>.</>, intro: "For screenshots, icons, clip art and flat graphics. The plain background disappears instantly, with no AI download." }} />,
});
