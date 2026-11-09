import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { ProfilePicture } from "@/components/tools/ProfilePicture";

export const Route = createFileRoute("/_authenticated/workspace/pt/fotos-da-equipe")({
  head: () => toolHead("/team-headshots", "pt"),
  component: () => <ProfilePicture page="/team-headshots" preset={{ colour: "#E5E7EB", shape: "square", multiple: true, title: <>Matching <span className="text-primary">team headshots</span>.</>, intro: "Upload everyone's photos at once. Each gets the same background and framing, ready for your About page." }} />,
});
