import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { ProductPhoto } from "@/components/tools/ProductPhoto";

export const Route = createFileRoute("/pt/foto-de-roupa-para-vender")({
  head: () => toolHead("/clothing-photo", "pt"),
  component: () => <ProductPhoto page="/clothing-photo" preset={{ colour: "#F5F0E8", sizeId: "portrait", pad: 6, title: <>Clothes photos for <span className="text-primary">Depop &amp; Vinted</span>.</>, intro: "Upload photos of your clothes. We cut them out and place them on a soft light background in a portrait frame." }} />,
});
