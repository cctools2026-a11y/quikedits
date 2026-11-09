import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { LogoCleaner } from "@/components/tools/LogoCleaner";

export const Route = createFileRoute("/_authenticated/workspace/pt/assinatura-de-email")({
  head: () => toolHead("/email-signature", "pt"),
  component: () => <LogoCleaner page="/email-signature" preset={{ tol: 70, maxWidth: 400, title: <>Your signature for <span className="text-primary">email</span>.</>, intro: "Sign on white paper and take a photo. We clear the paper and size it to fit neatly in an email signature." }} />,
});
