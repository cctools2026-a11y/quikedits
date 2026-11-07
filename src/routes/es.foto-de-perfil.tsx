import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { ProfilePicture } from "@/components/tools/ProfilePicture";

export const Route = createFileRoute("/es/foto-de-perfil")({
  head: () => toolHead("/profile-picture", "es"),
  component: () => <ProfilePicture />,
});
