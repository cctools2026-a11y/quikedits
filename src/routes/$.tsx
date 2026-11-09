import { createFileRoute, redirect } from "@tanstack/react-router";

// Old public tool URLs (and anything unknown) land on the landing page.
export const Route = createFileRoute("/$")({
  beforeLoad: () => {
    throw redirect({ to: "/", replace: true });
  },
});
