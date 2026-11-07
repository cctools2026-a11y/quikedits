import { SUBTOOLS } from "@/lib/tools";
import type { Locale } from "@/lib/i18n";
import localeMedia from "@/lib/locale-media.json";
import homeB from "@/assets/tools/home-expressive-puppy-original.jpg";
import homeA from "@/assets/tools/home-expressive-puppy-after.webp.asset.json";
import colourB from "@/assets/tools/colour-sleek-bob-original.jpg";
import colourA from "@/assets/tools/colour-sleek-bob-after.webp.asset.json";
import productB from "@/assets/tools/product-circus-mug-original.jpg";
import productA from "@/assets/tools/product-circus-mug-clean-after.webp.asset.json";
import passportB from "@/assets/tools/passport-asian-girl-original.jpg";
import passportA from "@/assets/tools/passport-asian-girl-clean.webp.asset.json";
import profileB from "@/assets/tools/profile-before.webp";
import profileA from "@/assets/tools/profile-after.webp";
import stickerB from "@/assets/tools/sticker-calico-original.jpg";
import stickerA from "@/assets/tools/sticker-calico-after.webp.asset.json";
import photobgB from "@/assets/tools/photobg-summer-before.webp";
import photobgA from "@/assets/tools/photobg-coastal-after.webp";
import logoB from "@/assets/tools/logo-before.webp";
import logoA from "@/assets/tools/logo-after.webp";

export type ToolMedia = { before: string; after: string; subject: string; badge: string; tilt: number };

/** Example before/after pairs. The "after" images were made with the site's own tools. */
export const TOOL_MEDIA: Record<string, ToolMedia> = {
  "/": { before: homeB, after: homeA.url, subject: "an expressive puppy in a messy craft room", badge: "Transparent PNG", tilt: -2 },
  "/colour-background": { before: colourB, after: colourA.url, subject: "woman with a sleek bob at a café", badge: "Any solid colour", tilt: 2 },
  "/product-photo": { before: productB, after: productA.url, subject: "colourful mug reading not my circus, not my monkeys", badge: "2000 × 2000 · Amazon ready", tilt: -1.5 },
  "/passport-photo": { before: passportB, after: passportA.url, subject: "Asian teenage girl in a living room", badge: "35 × 45 mm · print sheet", tilt: 1.5 },
  "/profile-picture": { before: profileB, after: profileA, subject: "headshot in an office", badge: "LinkedIn ready", tilt: -2 },
  "/sticker-maker": { before: stickerB, after: stickerA.url, subject: "calico kitten on a sofa", badge: "512 × 512 sticker", tilt: 3 },
  "/photo-background": { before: photobgB, after: photobgA, subject: "woman in summer clothes on a patio", badge: "Patio → seaside terrace", tilt: -1.5 },
  "/logo-cleaner": { before: logoB, after: logoA, subject: "signature on paper", badge: "Transparent signature", tilt: 1 },
};

for (const s of SUBTOOLS) TOOL_MEDIA[s.to] ??= TOOL_MEDIA[s.parent]!;

type LocalMedia = { before: string; after: string };
const LOCAL = localeMedia.hero as Record<string, Record<string, LocalMedia>>;

/** Example pair for a page in a language: local people, places and words, falling back to English. */
export function mediaFor(path: string, locale: Locale): ToolMedia | undefined {
  const base = TOOL_MEDIA[path];
  const local = locale === "en" ? undefined : LOCAL[locale]?.[path];
  return base && local ? { ...base, ...local } : base;
}

/** Load an example photo as a File so it can go through the normal tool flow. */
export async function sampleFile(path: string, locale: Locale = "en") {
  const m = mediaFor(path, locale)!;
  const blob = await (await fetch(m.before)).blob();
  return new File([blob], "sample.webp", { type: blob.type || "image/webp" });
}
