import home from "@/assets/cards/home.webp";
import homeCut from "@/assets/cards/home-cut.webp";
import colour from "@/assets/cards/colour.webp";
import colourCut from "@/assets/cards/colour-refined-cut.webp.asset.json";
import product from "@/assets/cards/product-cat-bottle-original.jpg";
import productCut from "@/assets/cards/product-cat-bottle-cut.webp.asset.json";
import passport from "@/assets/cards/passport.webp";
import passportCut from "@/assets/cards/passport-cut.webp";
import profile from "@/assets/cards/profile-short-hair-original.jpg";
import profileCut from "@/assets/cards/profile-short-hair-cut.webp.asset.json";
import sticker from "@/assets/cards/sticker-blue-heeler-original.jpg";
import stickerCut from "@/assets/cards/sticker-blue-heeler-cut.webp.asset.json";
import photobg from "@/assets/tools/photobg-summer-before.webp";
import photobgCut from "@/assets/tools/photobg-summer-cut.webp";
import logo from "@/assets/cards/signature-quikedits-paper.jpg";
import logoCut from "@/assets/cards/signature-quikedits-transparent.webp.asset.json";
import coastalResult from "@/assets/tools/photobg-coastal-after.webp";

type Art = { before: string; cut: string; tile: string; result: string; resultImg?: string; flatPhoto?: boolean; outline?: boolean; move?: string; extra?: "floor" | "oval" | "circle" };

/** Card art per tool: photo before, cut-out after (made with the site's own remover), and the backdrop the tool adds. */
const ART: Record<string, Art> = {
  "/": { before: home, cut: homeCut, tile: "bg-art-yellow", result: "checker-sm" },
  "/colour-background": { before: colour, cut: colourCut.url, tile: "bg-tile-sky", result: "bg-art-coral" },
  "/product-photo": { before: product, cut: productCut.url, tile: "bg-primary", result: "bg-card", move: "group-hover:scale-[0.92]", extra: "floor" },
  "/passport-photo": { before: passport, cut: passportCut, tile: "bg-art-yellow", result: "bg-muted", extra: "oval" },
  "/profile-picture": { before: profile, cut: profileCut.url, tile: "bg-tile-sky", result: "bg-card", extra: "circle" },
  "/sticker-maker": { before: sticker, cut: stickerCut.url, tile: "bg-primary", result: "checker-sm", outline: true },
  "/photo-background": { before: photobg, cut: photobgCut, tile: "bg-art-yellow", result: "bg-card", resultImg: coastalResult, flatPhoto: true },
  "/logo-cleaner": { before: logo, cut: logoCut.url, tile: "bg-tile-sky", result: "checker-sm", resultImg: logoCut.url, flatPhoto: true },
};

const EASE = "duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none";
const LIFT = "drop-shadow(0 10px 14px color-mix(in oklab, var(--foreground) 22%, transparent))";
const OUTLINE = "drop-shadow(3px 0 0 var(--card)) drop-shadow(-3px 0 0 var(--card)) drop-shadow(0 3px 0 var(--card)) drop-shadow(0 -3px 0 var(--card))";

/**
 * The subject breaks out of the top of its photo frame. On hover the old background
 * fades into the tool's result while the cut-out lifts and a dotted cut line traces the frame.
 */
export function ToolArt({ to }: { to: string }) {
  const a = ART[to] ?? ART["/"];
  if (!a) return null;
  return (
    <div className={`relative aspect-[4/3] overflow-hidden ${a.tile}`}>
      <div className={`absolute left-1/2 top-[62%] h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/10 blur-2xl transition-transform ${EASE} group-hover:scale-110`} />

      {/* square stage; the frame shows only its lower part so the subject pops out above it */}
      <div className="absolute bottom-[7%] left-1/2 aspect-square w-[58%] -translate-x-1/2">
        <svg aria-hidden className={`pointer-events-none absolute -inset-[5%] top-[13%] h-[92%] w-[110%] overflow-visible opacity-0 transition-opacity ${EASE} group-hover:opacity-100`} viewBox="0 0 110 92" preserveAspectRatio="none">
          <rect x="1" y="1" width="108" height="90" rx="9" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" className="march text-foreground/40" />
        </svg>
        <div className={`absolute inset-x-0 bottom-0 ${a.flatPhoto ? "top-0" : "top-[18%]"} overflow-hidden rounded-xl border-[3px] border-card shadow-lift transition-shadow ${EASE} group-hover:shadow-float`}>
          <div className="absolute inset-x-0 bottom-0 aspect-square">
            <div className={`absolute inset-0 ${a.result}`} />
            {a.extra === "circle" && <div className="absolute inset-[8%] top-[14%] overflow-hidden rounded-full bg-art-pink">
              <div className="absolute -left-[10%] top-[14%] h-[18%] w-[68%] -rotate-[28deg] rounded-full bg-art-yellow" />
              <div className="absolute -right-[18%] bottom-[14%] h-[22%] w-[70%] -rotate-[28deg] rounded-full bg-art-teal" />
            </div>}
            {a.extra === "floor" && <div className="absolute bottom-[6%] left-[24%] h-[7%] w-[52%] rounded-[50%] bg-foreground/25 blur-md" />}
            {a.resultImg && <img src={a.resultImg} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />}
            <img src={a.before} alt="" loading="lazy" className={`absolute inset-0 h-full w-full object-cover ${a.flatPhoto ? "transition-opacity" : "transition-[opacity,filter]"} ${EASE} group-hover:opacity-0 ${a.flatPhoto ? "" : "group-hover:blur-sm"}`} />
          </div>
        </div>
        {a.extra === "oval" && (
          <div aria-hidden className={`pointer-events-none absolute left-1/2 top-[3%] h-[66%] w-[48%] -translate-x-1/2 rounded-[50%] border-[1.5px] border-dashed border-primary/80 opacity-0 transition-opacity delay-150 ${EASE} group-hover:opacity-100`} style={{ zIndex: 2 }} />
        )}
        {a.outline && (
          <img src={a.cut} alt="" loading="lazy" style={{ filter: OUTLINE, clipPath: "inset(-60% 0 3px 0)" }} className={`absolute inset-0 h-full w-full object-contain opacity-0 transition-opacity ${EASE} group-hover:opacity-100`} />
        )}
        {!a.flatPhoto && <img
          src={a.cut}
          alt=""
          loading="lazy"
          style={{ "--b": LIFT.replace("22%", "0%"), "--o": LIFT, clipPath: "inset(-60% 3px 3px 3px round 0 0 10px 10px)" } as React.CSSProperties}
          className={`absolute inset-0 h-full w-full origin-bottom object-contain transition-[filter,transform] ${EASE} ${a.move ?? ""} [filter:var(--b)] group-hover:[filter:var(--o)]`}
        />}
      </div>

    </div>
  );
}
