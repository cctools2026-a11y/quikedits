import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { ProfilePicture } from "@/components/tools/ProfilePicture";

export const Route = createFileRoute("/_authenticated/workspace/cv-photo")({
  head: () => toolHead("/cv-photo"),
  component: () => <ProfilePicture page="/cv-photo" preset={{ colour: "#FFFFFF", shape: "square", title: <>A tidy <span className="text-primary">CV photo</span>.</>, intro: "Upload a headshot. We put it on clean white in a square frame, ready for your CV or r\u00e9sum\u00e9." }} />,
});
