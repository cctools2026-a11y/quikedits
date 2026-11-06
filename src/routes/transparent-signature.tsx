import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { LogoCleaner } from "@/components/tools/LogoCleaner";

export const Route = createFileRoute("/transparent-signature")({
  head: () => toolHead("/transparent-signature"),
  component: () => <LogoCleaner page="/transparent-signature" preset={{ tol: 70, title: <>Your signature as a <span className="text-primary">transparent PNG</span>.</>, intro: "Sign on white paper and take a photo. The paper disappears instantly, with no AI download." }} />,
});
