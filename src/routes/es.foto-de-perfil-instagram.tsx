import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { ProfilePicture } from "@/components/tools/ProfilePicture";

export const Route = createFileRoute("/es/foto-de-perfil-instagram")({
  head: () => toolHead("/instagram-profile-picture", "es"),
  component: () => <ProfilePicture page="/instagram-profile-picture" preset={{ colour: "#FF4FA3", shape: "circle", title: <>A bold <span className="text-primary">Instagram</span> profile picture.</>, intro: "Upload a photo. We put you on a bright colour in a circle, so you stand out in comments and stories." }} />,
});
