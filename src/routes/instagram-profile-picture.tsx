import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { ProfilePicture } from "@/components/tools/ProfilePicture";

export const Route = createFileRoute("/instagram-profile-picture")({
  head: () => toolHead("/instagram-profile-picture"),
  component: () => <ProfilePicture page="/instagram-profile-picture" preset={{ colour: "#FF4FA3", shape: "circle", title: <>A bold <span className="text-primary">Instagram</span> profile picture.</>, intro: "Upload a photo. We put you on a bright colour in a circle, so you stand out in comments and stories." }} />,
});
