import type { ReactNode } from "react";

export const TOOLS = [
  { to: "/", group: "cutouts", label: "Remove background", task: "I need a see-through cut-out", blurb: "Transparent PNG of any photo." },
  { to: "/colour-background", group: "cutouts", label: "Colour background", task: "I want a plain colour behind my photo", blurb: "Put your photo on a solid colour." },
  { to: "/product-photo", group: "photos", label: "Product photos", task: "I'm selling something online", blurb: "White backgrounds and marketplace sizes, several at once." },
  { to: "/passport-photo", group: "photos", label: "Passport photo", task: "I need a passport or ID photo", blurb: "Official sizes with a printable sheet." },
  { to: "/profile-picture", group: "photos", label: "Profile picture", task: "I need a LinkedIn or CV photo", blurb: "Headshots on a solid colour, circle or square." },
  { to: "/sticker-maker", group: "fun", label: "Sticker maker", task: "I want to make a sticker", blurb: "Cut-outs with an outline for WhatsApp and Telegram." },
  { to: "/photo-background", group: "cutouts", label: "Photo background", task: "I want a different picture behind me", blurb: "Place your cut-out on another photo." },
  { to: "/logo-cleaner", group: "fun", label: "Logo & signature", task: "I need a transparent logo or signature", blurb: "Clear the background behind logos and signatures." },
] as const;

export const TOOL_GROUPS = [
  { id: "cutouts", label: "Cut out & change background" },
  { id: "photos", label: "Photos for a purpose" },
  { id: "fun", label: "Stickers & graphics" },
] as const;

/** Starting settings a sub-tool page hands to its parent tool. */
export type Preset = {
  title?: ReactNode; intro?: string; colour?: string; pad?: number; sizeId?: string;
  shape?: "circle" | "square"; outline?: "#FFFFFF" | "#000000"; format?: "image/png" | "image/webp"; tol?: number;
  /** Product: soft shadow under the item. */ shadow?: boolean;
  /** Profile: outline ring colour. */ ring?: string;
  /** Profile/cutouts: accept several photos. */ multiple?: boolean;
  /** Sticker: output size in px and padding. */ size?: number; stickerPad?: number;
  /** Sticker: lay copies out on a printable page. */ sheet?: boolean;
  /** Photo background: only these backdrop ids, fixed output size, blur own scene, gradients. */
  backdrops?: string[]; canvas?: { w: number; h: number }; blur?: boolean; gradients?: boolean;
  /** Logo: keep coloured ink only, recolour, and max width. */
  ink?: boolean; recolour?: "original" | "black" | "white"; maxWidth?: number;
  /** Colour: hex box remembered on this device. */ brand?: boolean;
  /** Cutouts: AI-free flat-graphic mode. */ raw?: boolean; maxSide?: number;
};

/** Focused pages for one specific job, each built on a parent tool. */
export const SUBTOOLS = [
  { to: "/white-background", parent: "/colour-background", label: "White background", blurb: "Pure white behind any photo." },
  { to: "/amazon-product-photo", parent: "/product-photo", label: "Amazon product photo", blurb: "2000 × 2000, pure white, product fills 85%." },
  { to: "/us-passport-photo", parent: "/passport-photo", label: "US passport photo", blurb: "2 × 2 in on white, with a print sheet." },
  { to: "/uk-passport-photo", parent: "/passport-photo", label: "UK passport photo", blurb: "35 × 45 mm on light grey." },
  { to: "/india-passport-photo", parent: "/passport-photo", label: "India passport photo", blurb: "51 × 51 mm on white." },
  { to: "/linkedin-profile-photo", parent: "/profile-picture", label: "LinkedIn photo", blurb: "Circle headshot on a calm colour." },
  { to: "/whatsapp-sticker", parent: "/sticker-maker", label: "WhatsApp sticker", blurb: "512 × 512 WebP with a white outline." },
  { to: "/transparent-signature", parent: "/logo-cleaner", label: "Transparent signature", blurb: "Sign on paper, get a PNG for documents." },
] as const;

export const subtoolsOf = (parent: string) => SUBTOOLS.filter((s) => s.parent === parent);
export const subtool = (path: string) => SUBTOOLS.find((s) => s.to === path);
