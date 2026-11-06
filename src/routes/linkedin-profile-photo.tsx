import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { ProfilePicture } from "@/components/tools/ProfilePicture";

export const Route = createFileRoute("/linkedin-profile-photo")({
  head: () => toolHead("/linkedin-profile-photo"),
  component: () => <ProfilePicture page="/linkedin-profile-photo" preset={{ colour: "#E5E7EB", shape: "circle", title: <>A clean <span className="text-primary">LinkedIn photo</span> in seconds.</>, intro: "Upload a headshot. We swap the background for a calm grey and frame it for LinkedIn's circle." }} />,
});
