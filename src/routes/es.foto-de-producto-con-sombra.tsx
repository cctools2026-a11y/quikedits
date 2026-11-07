import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { ProductPhoto } from "@/components/tools/ProductPhoto";

export const Route = createFileRoute("/es/foto-de-producto-con-sombra")({
  head: () => toolHead("/product-photo-shadow", "es"),
  component: () => <ProductPhoto page="/product-photo-shadow" preset={{ colour: "#FFFFFF", shadow: true, title: <>Product photos with a <span className="text-primary">soft shadow</span>.</>, intro: "Upload your products. We place each one on white with a soft shadow underneath so it looks grounded, not floating." }} />,
});
