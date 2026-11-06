// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    // Static output for Cloudflare Pages: every page is prerendered to HTML.
    pages: [{ path: "/" }, { path: "/license" }, { path: "/colour-background" },
      { path: "/product-photo" }, { path: "/passport-photo" }, { path: "/profile-picture" },
      { path: "/sticker-maker" }, { path: "/photo-background" }, { path: "/logo-cleaner" },
      { path: "/white-background" }, { path: "/amazon-product-photo" }, { path: "/us-passport-photo" }, { path: "/uk-passport-photo" }, { path: "/india-passport-photo" }, { path: "/linkedin-profile-photo" }, { path: "/whatsapp-sticker" }, { path: "/transparent-signature" },
      { path: "/transparent-png-for-slides" }, { path: "/remove-background-from-graphic" }, { path: "/batch-remove-background" }, { path: "/cut-out-pet" }, { path: "/cut-out-hair" }, { path: "/black-background" }, { path: "/brand-colour-background" }, { path: "/gradient-background" }, { path: "/virtual-background" }, { path: "/holiday-background" }, { path: "/party-background" }, { path: "/blur-background" }, { path: "/ebay-etsy-product-photo" }, { path: "/shopify-product-photos" }, { path: "/product-photo-shadow" }, { path: "/clothing-photo" }, { path: "/australia-passport-photo" }, { path: "/schengen-visa-photo" }, { path: "/id-card-photo" }, { path: "/passport-photo-print-sheet" }, { path: "/cv-photo" }, { path: "/instagram-profile-picture" }, { path: "/discord-avatar" }, { path: "/team-headshots" }, { path: "/telegram-sticker" }, { path: "/printable-sticker-sheet" }, { path: "/pet-sticker" }, { path: "/slack-emoji" }, { path: "/email-signature" }, { path: "/logo-to-png" }, { path: "/recolour-logo" }, { path: "/stamp-cleaner" }],
    prerender: { enabled: true, autoStaticPathsDiscovery: false },
  },
});
