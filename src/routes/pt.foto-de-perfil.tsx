import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { ProfilePicture } from "@/components/tools/ProfilePicture";

export const Route = createFileRoute("/pt/foto-de-perfil")({
  head: () => toolHead("/profile-picture", "pt"),
  component: () => <ProfilePicture />,
});
