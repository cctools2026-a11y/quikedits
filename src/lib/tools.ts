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
  { to: "/transparent-png-for-slides", parent: "/", label: "PNG for slides", blurb: "Tight cut-out, slide-ready size." },
  { to: "/remove-background-from-graphic", parent: "/", label: "Graphic or screenshot", blurb: "Instant, no AI, for flat images." },
  { to: "/batch-remove-background", parent: "/", label: "Batch remove backgrounds", blurb: "Many photos, one ZIP." },
  { to: "/cut-out-pet", parent: "/", label: "Cut out a pet", blurb: "Clean cut-outs of dogs and cats." },
  { to: "/cut-out-hair", parent: "/", label: "Cut out hair cleanly", blurb: "Tips and touch-up for tricky hair." },
  { to: "/black-background", parent: "/colour-background", label: "Black background", blurb: "Dramatic black behind any photo." },
  { to: "/brand-colour-background", parent: "/colour-background", label: "Brand colour background", blurb: "Paste your hex, it's remembered." },
  { to: "/gradient-background", parent: "/photo-background", label: "Gradient background", blurb: "Soft colour gradients behind you." },
  { to: "/virtual-background", parent: "/photo-background", label: "Zoom / Teams background", blurb: "1920 \u00d7 1080, ready for calls." },
  { to: "/holiday-background", parent: "/photo-background", label: "Holiday background", blurb: "Beach, city or mountains." },
  { to: "/party-background", parent: "/photo-background", label: "Party background", blurb: "Balloons and confetti." },
  { to: "/blur-background", parent: "/photo-background", label: "Blur the background", blurb: "Portrait-mode blur, any photo." },
  { to: "/ebay-etsy-product-photo", parent: "/product-photo", label: "eBay / Etsy photo", blurb: "Square, white, marketplace ready." },
  { to: "/shopify-product-photos", parent: "/product-photo", label: "Shopify product images", blurb: "Consistent squares for your store." },
  { to: "/product-photo-shadow", parent: "/product-photo", label: "Product shadow", blurb: "Soft shadow on white." },
  { to: "/clothing-photo", parent: "/product-photo", label: "Depop / Vinted photo", blurb: "Portrait shots for clothes." },
  { to: "/australia-passport-photo", parent: "/passport-photo", label: "Australia passport photo", blurb: "35 \u00d7 45 mm on white." },
  { to: "/schengen-visa-photo", parent: "/passport-photo", label: "Schengen visa photo", blurb: "35 \u00d7 45 mm on light grey." },
  { to: "/id-card-photo", parent: "/passport-photo", label: "ID / licence photo", blurb: "Generic 35 \u00d7 45 mm ID photo." },
  { to: "/passport-photo-print-sheet", parent: "/passport-photo", label: "Passport print sheet", blurb: "Several copies on a 4 \u00d7 6 print." },
  { to: "/cv-photo", parent: "/profile-picture", label: "CV / resume photo", blurb: "Square, on white." },
  { to: "/instagram-profile-picture", parent: "/profile-picture", label: "Instagram / TikTok picture", blurb: "Bold colour, circle crop." },
  { to: "/discord-avatar", parent: "/profile-picture", label: "Discord / gaming avatar", blurb: "Circle with an outline ring." },
  { to: "/team-headshots", parent: "/profile-picture", label: "Team headshots", blurb: "Matching photos for the whole team." },
  { to: "/telegram-sticker", parent: "/sticker-maker", label: "Telegram sticker", blurb: "512 px WebP for Telegram." },
  { to: "/printable-sticker-sheet", parent: "/sticker-maker", label: "Printable sticker sheet", blurb: "A4 or Letter page with cut lines." },
  { to: "/pet-sticker", parent: "/sticker-maker", label: "Pet sticker", blurb: "Outline plus a playful shadow." },
  { to: "/slack-emoji", parent: "/sticker-maker", label: "Slack / Discord emoji", blurb: "128 \u00d7 128, trimmed tight." },
  { to: "/email-signature", parent: "/logo-cleaner", label: "Signature for email", blurb: "Small PNG sized for emails." },
  { to: "/logo-to-png", parent: "/logo-cleaner", label: "Logo to transparent PNG", blurb: "Clear a white or flat background." },
  { to: "/recolour-logo", parent: "/logo-cleaner", label: "Recolour logo", blurb: "All-white or all-black versions." },
  { to: "/stamp-cleaner", parent: "/logo-cleaner", label: "Stamp / seal cleaner", blurb: "Keep red or blue ink only." },
] as const;

export const subtoolsOf = (parent: string) => SUBTOOLS.filter((s) => s.parent === parent);
export const subtool = (path: string) => SUBTOOLS.find((s) => s.to === path);
