import { Eraser, Scissors } from "lucide-react";
import { TOOL_MEDIA } from "@/lib/tool-media";
import { ICONS } from "@/components/SiteHeader";

const TILES: Record<string, string> = {
  "/": "bg-tile-peach",
  "/colour-background": "bg-tile-lilac",
  "/product-photo": "bg-tile-butter",
  "/passport-photo": "bg-tile-sky",
  "/profile-picture": "bg-tile-mint",
  "/sticker-maker": "bg-tile-peach",
  "/photo-background": "bg-tile-sky",
  "/logo-cleaner": "bg-tile-butter",
};

/** Illustrated card art: the original photo behind, the cut-out result lifted in front. */
export function ToolArt({ to }: { to: string }) {
  const m = TOOL_MEDIA[to];
  const Icon = ICONS[to] ?? Eraser;
  return (
    <div className={`relative aspect-[4/3] overflow-hidden ${TILES[to] ?? "bg-tile-peach"}`}>
      <div className="bg-mat absolute inset-0 opacity-60" />
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full border-2 border-dashed border-foreground/15" />
      <Icon aria-hidden className="absolute -bottom-6 -left-6 h-32 w-32 text-foreground/[0.06]" strokeWidth={1.5} />
      {m && (
        <>
          <div className="absolute left-[12%] top-[16%] w-[42%] -rotate-6 rounded-md bg-card p-1.5 pb-5 shadow-lift transition-transform duration-500 group-hover:-translate-x-2 group-hover:-rotate-[10deg]">
            <img src={m.before} alt="" loading="lazy" className="aspect-square w-full rounded-sm object-cover grayscale-[35%]" />
          </div>
          <svg aria-hidden viewBox="0 0 100 40" className="absolute left-[38%] top-[44%] w-[24%] text-foreground/40">
            <path d="M2 30 Q50 -6 98 22" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
          </svg>
          <Scissors aria-hidden className="absolute left-[56%] top-[42%] h-5 w-5 rotate-[30deg] text-foreground/60" />
          <div className="absolute right-[10%] top-[24%] w-[46%] rotate-3 rounded-lg border-4 border-card bg-card shadow-float transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:rotate-6">
            <div className="checker-sm overflow-hidden rounded-md">
              <img src={m.after} alt="" loading="lazy" className="aspect-square w-full object-cover" />
            </div>
          </div>
        </>
      )}
      <span className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-card text-primary shadow-lift">
        <Icon className="h-4 w-4" />
      </span>
    </div>
  );
}
