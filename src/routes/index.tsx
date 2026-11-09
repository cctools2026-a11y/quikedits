import { createFileRoute } from "@tanstack/react-router";
import { TheButton } from "@/components/game/TheButton";

const TITLE = "The Button — please don't press it";
const DESC = "One button, twenty rules and a narrator who wishes you would stop. A tiny browser game.";

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
  component: TheButton,
});
