import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    // Keep "/pt/" as-is: it is the canonical Portuguese home and is served as /pt/index.html.
    trailingSlash: "preserve",
    defaultPreloadStaleTime: 0,
  });

  return router;
};
