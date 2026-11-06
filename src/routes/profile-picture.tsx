import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { ProfilePicture } from "@/components/tools/ProfilePicture";

export const Route = createFileRoute("/profile-picture")({
  head: () => toolHead("/profile-picture"),
  component: () => <ProfilePicture />,
});
