import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { ProductPhoto } from "@/components/tools/ProductPhoto";

export const Route = createFileRoute("/pt/foto-de-produto")({
  head: () => toolHead("/product-photo", "pt"),
  component: () => <ProductPhoto />,
});
