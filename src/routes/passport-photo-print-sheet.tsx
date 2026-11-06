import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { PassportPhoto } from "@/components/tools/PassportPhoto";

export const Route = createFileRoute("/passport-photo-print-sheet")({
  head: () => toolHead("/passport-photo-print-sheet"),
  component: () => <PassportPhoto page="/passport-photo-print-sheet" preset={{ sizeId: "uk", title: <>Passport photos on a <span className="text-primary">4 × 6 sheet</span>.</>, intro: "Make one photo and get several copies laid out on a standard 4 \u00d7 6 in print. Print it anywhere for a few cents." }} />,
});
