import { createFileRoute } from "@tanstack/react-router";
import { licenseHead } from "@/lib/seo";
import { LicensePage } from "@/components/LicensePage";

export const Route = createFileRoute("/license")({
  head: () => licenseHead("en"),
  component: LicensePage,
});
