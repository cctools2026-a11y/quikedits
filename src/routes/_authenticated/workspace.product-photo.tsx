import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { ProductPhoto } from "@/components/tools/ProductPhoto";

export const Route = createFileRoute("/_authenticated/workspace/product-photo")({
  head: () => toolHead("/product-photo"),
  component: () => <ProductPhoto />,
});
