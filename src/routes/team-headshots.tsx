import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { ProfilePicture } from "@/components/tools/ProfilePicture";

export const Route = createFileRoute("/team-headshots")({
  head: () => toolHead("/team-headshots"),
  component: () => <ProfilePicture page="/team-headshots" preset={{ colour: "#E5E7EB", shape: "square", multiple: true, title: <>Matching <span className="text-primary">team headshots</span>.</>, intro: "Upload everyone's photos at once. Each gets the same background and framing, ready for your About page." }} />,
});
