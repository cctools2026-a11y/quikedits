import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { ProductPhoto } from "@/components/tools/ProductPhoto";
import { padForFill } from "@/lib/tool-sizes";

export const Route = createFileRoute("/_authenticated/workspace/es/foto-de-producto-amazon")({
  head: () => toolHead("/amazon-product-photo", "es"),
  component: () => <ProductPhoto page="/amazon-product-photo" preset={{ colour: "#FFFFFF", pad: padForFill(85), title: <>Product photos <span className="text-primary">ready for Amazon</span>.</>, intro: "Upload your product photos. Each one is cut out, centred on pure white and sized 2000 × 2000 so the product fills 85% of the frame." }} />,
});
