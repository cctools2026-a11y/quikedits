import { createFileRoute } from "@tanstack/react-router";
import { MadeByHand } from "@/components/game/MadeByHand";

const TITLE = "Made by Hand? — spot the person, not the machine";
const DESC = "Two lines, one written by a person. Twelve rounds of guessing who wrote it before the machines win.";

export const Route = createFileRoute("/handmade")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://quikedits.com/handmade" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: "https://quikedits.com/handmade" }],
  }),
  component: MadeByHand,
});
