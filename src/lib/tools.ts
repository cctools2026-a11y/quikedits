export const TOOLS = [
  { to: "/", label: "Remove background", task: "I need a see-through cut-out", blurb: "Transparent PNG of any photo." },
  { to: "/colour-background", label: "Colour background", task: "I want a plain colour behind my photo", blurb: "Put your photo on a solid colour." },
  { to: "/product-photo", label: "Product photos", task: "I'm selling something online", blurb: "White backgrounds and marketplace sizes, several at once." },
  { to: "/passport-photo", label: "Passport photo", task: "I need a passport or ID photo", blurb: "Official sizes with a printable sheet." },
  { to: "/profile-picture", label: "Profile picture", task: "I need a LinkedIn or CV photo", blurb: "Headshots on a solid colour, circle or square." },
  { to: "/sticker-maker", label: "Sticker maker", task: "I want to make a sticker", blurb: "Cut-outs with an outline for WhatsApp and Telegram." },
  { to: "/photo-background", label: "Photo background", task: "I want a different picture behind me", blurb: "Place your cut-out on another photo." },
  { to: "/logo-cleaner", label: "Logo & signature", task: "I need a transparent logo or signature", blurb: "Clear the background behind logos and signatures." },
] as const;
