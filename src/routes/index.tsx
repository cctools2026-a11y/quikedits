import { createFileRoute } from "@tanstack/react-router";
import { OddJobs } from "@/components/game/OddJobs";

const TITLE = "Odd Jobs — a game of edits nobody asked for";
const DESC = "Re-season soup, edit a flock, tune a rooster. A tiny browser game of very odd edit jobs.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://quikedits.com/" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: "https://quikedits.com/" }],
  }),
  component: OddJobs,
});
