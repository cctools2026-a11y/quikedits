import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/lib/seo";
import { PhotoBackground } from "@/components/tools/PhotoBackground";

export const Route = createFileRoute("/_authenticated/workspace/party-background")({
  head: () => toolHead("/party-background"),
  component: () => <PhotoBackground page="/party-background" preset={{ backdrops: ["balloons", "confetti", "pop-art"], title: <>Make a <span className="text-primary">party</span> photo.</>, intro: "Upload a photo and put it in front of balloons or confetti for birthdays and celebrations." }} />,
});
