import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { ProductPhoto } from "@/components/tools/ProductPhoto";

export const Route = createFileRoute("/es/fotos-de-producto-shopify")({
  head: () => toolHead("/shopify-product-photos", "es"),
  component: () => <ProductPhoto page="/shopify-product-photos" preset={{ colour: "#FFFFFF", sizeId: "square", pad: 10, title: <>Consistent <span className="text-primary">Shopify</span> product images.</>, intro: "Upload a batch. Every product gets the same white square and padding, so your store grid looks tidy." }} />,
});
