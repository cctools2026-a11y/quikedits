import { createFileRoute } from "@tanstack/react-router";
import { licenseHead } from "@/lib/seo";
import { LicensePage } from "@/components/LicensePage";

export const Route = createFileRoute("/_authenticated/workspace/pt/licenca")({
  head: () => licenseHead("pt"),
  component: LicensePage,
});
