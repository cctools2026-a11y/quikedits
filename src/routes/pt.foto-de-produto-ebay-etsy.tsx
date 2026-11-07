import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { ProductPhoto } from "@/components/tools/ProductPhoto";

export const Route = createFileRoute("/pt/foto-de-produto-ebay-etsy")({
  head: () => toolHead("/ebay-etsy-product-photo", "pt"),
  component: () => <ProductPhoto page="/ebay-etsy-product-photo" preset={{ colour: "#FFFFFF", sizeId: "square", pad: 8, title: <>Listing photos for <span className="text-primary">eBay &amp; Etsy</span>.</>, intro: "Upload your product photos. We put each one on white in a 2000 \u00d7 2000 square that works on eBay and Etsy." }} />,
});
