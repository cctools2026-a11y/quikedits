import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { ProfilePicture } from "@/components/tools/ProfilePicture";

export const Route = createFileRoute("/es/avatar-discord")({
  head: () => toolHead("/discord-avatar", "es"),
  component: () => <ProfilePicture page="/discord-avatar" preset={{ colour: "#23272A", shape: "circle", ring: "#5865F2", title: <>A <span className="text-primary">Discord</span> avatar with a ring.</>, intro: "Upload a photo. We put you on a dark background in a circle with a coloured outline ring." }} />,
});
