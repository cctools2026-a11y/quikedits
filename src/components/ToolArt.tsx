import { Eraser } from "lucide-react";
import { ICONS } from "@/components/SiteHeader";
import home from "@/assets/cards/home.webp";
import homeCut from "@/assets/cards/home-cut.webp";
import colour from "@/assets/cards/colour.webp";
import colourCut from "@/assets/cards/colour-cut.webp";
import product from "@/assets/cards/product.webp";
import productCut from "@/assets/cards/product-cut.webp";
import passport from "@/assets/cards/passport.webp";
import passportCut from "@/assets/cards/passport-cut.webp";
import profile from "@/assets/cards/profile.webp";
import profileCut from "@/assets/cards/profile-cut.webp";
import sticker from "@/assets/cards/sticker.webp";
import stickerCut from "@/assets/cards/sticker-cut.webp";
import photobg from "@/assets/cards/photobg.webp";
import photobgCut from "@/assets/cards/photobg-cut.webp";
import logo from "@/assets/cards/logo.webp";
import logoCut from "@/assets/cards/logo-cut.webp";
import beach from "@/assets/cards/beach.webp";

type Art = { before: string; cut: string; tile: string; result: string; resultImg?: string; outline?: boolean };

/** Card art per tool: photo before, cut-out after (made with the site's own remover), and the backdrop the tool adds. */
const ART: Record<string, Art> = {
  "/": { before: home, cut: homeCut, tile: "bg-tile-peach", result: "checker-sm" },
  "/colour-background": { before: colour, cut: colourCut, tile: "bg-tile-lilac", result: "bg-art-coral" },
  "/product-photo": { before: product, cut: productCut, tile: "bg-tile-butter", result: "bg-card" },
  "/passport-photo": { before: passport, cut: passportCut, tile: "bg-tile-sky", result: "bg-card" },
  "/profile-picture": { before: profile, cut: profileCut, tile: "bg-tile-mint", result: "bg-art-blue" },
  "/sticker-maker": { before: sticker, cut: stickerCut, tile: "bg-tile-peach", result: "checker-sm", outline: true },
  "/photo-background": { before: photobg, cut: photobgCut, tile: "bg-tile-sky", result: "bg-card", resultImg: beach },
  "/logo-cleaner": { before: logo, cut: logoCut, tile: "bg-tile-butter", result: "checker-sm" },
};

const EASE = "duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none";
const OUTLINE = "drop-shadow(2px 0 0 var(--card)) drop-shadow(-2px 0 0 var(--card)) drop-shadow(0 2px 0 var(--card)) drop-shadow(0 -2px 0 var(--card))";

/**
 * The subject breaks out of the top of its photo frame. On hover the old background
 * fades into the tool's result while the cut-out lifts and a dotted cut line traces the frame.
 */
export function ToolArt({ to }: { to: string }) {
  const a = ART[to] ?? ART["/"]!;
  const Icon = ICONS[to] ?? Eraser;
  return (
    <div className={`relative aspect-[4/3] overflow-hidden ${a.tile}`}>
      <div className="bg-mat absolute inset-0 opacity-50" />
      <div className={`absolute left-1/2 top-[62%] h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-card/40 blur-2xl transition-transform ${EASE} group-hover:scale-110`} />

      {/* square stage; the frame shows only its lower part so the subject pops out above it */}
      <div className="absolute bottom-[7%] left-1/2 aspect-square w-[54%] -translate-x-1/2">
        <svg aria-hidden className={`pointer-events-none absolute -inset-[5%] top-[13%] h-[92%] w-[110%] overflow-visible opacity-0 transition-opacity ${EASE} group-hover:opacity-100`} viewBox="0 0 110 92" preserveAspectRatio="none">
          <rect x="1" y="1" width="108" height="90" rx="9" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" className="march text-foreground/40" />
        </svg>
        <div className={`absolute inset-x-0 bottom-0 top-[18%] overflow-hidden rounded-xl border-[3px] border-card shadow-lift transition-shadow ${EASE} group-hover:shadow-float`}>
          <div className="absolute inset-x-0 bottom-0 aspect-square">
            <div className={`absolute inset-0 ${a.result}`} />
            {a.resultImg && <img src={a.resultImg} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />}
            <img src={a.before} alt="" loading="lazy" className={`absolute inset-0 h-full w-full object-cover transition-[opacity,filter] ${EASE} group-hover:opacity-0 group-hover:blur-sm`} />
          </div>
        </div>
        <img
          src={a.cut}
          alt=""
          loading="lazy"
          style={a.outline ? { filter: OUTLINE } : undefined}
          className={`absolute inset-0 h-full w-full origin-bottom object-contain transition-transform ${EASE} group-hover:-translate-y-[3%] group-hover:scale-[1.04]`}
        />
      </div>

      <span className="absolute bottom-3 left-3 grid overflow-hidden rounded-full bg-card/90 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground shadow-lift">
        <span className={`col-start-1 row-start-1 transition-all ${EASE} group-hover:-translate-y-full group-hover:opacity-0`}>Before</span>
        <span className={`col-start-1 row-start-1 translate-y-full text-primary opacity-0 transition-all ${EASE} group-hover:translate-y-0 group-hover:opacity-100`}>After</span>
      </span>
      <span className={`absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-card text-primary shadow-lift transition-transform ${EASE} group-hover:rotate-[-12deg] group-hover:scale-110`}>
        <Icon className="h-4 w-4" />
      </span>
    </div>
  );
}
