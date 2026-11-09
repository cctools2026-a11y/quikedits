import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { Cutouts } from "@/components/tools/Cutouts";

export const Route = createFileRoute("/_authenticated/workspace/cut-out-pet")({
  head: () => toolHead("/cut-out-pet"),
  component: () => <Cutouts page="/cut-out-pet" preset={{ title: <>Cut out your <span className="text-primary">pet</span>.</>, intro: "Upload a photo of your dog, cat or bunny. We remove the background so you can put them anywhere." }} />,
});
