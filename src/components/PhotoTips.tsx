import { Check, Info, X } from "lucide-react";
import { PHOTO_RULES } from "@/lib/photo-rules";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

function TipsBody({ tool }: { tool: string }) {
  const r = PHOTO_RULES[tool];
  if (!r) return null;
  return (
    <div className="text-sm">
      <p className="font-medium leading-relaxed text-foreground">{r.best}</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-semibold text-foreground">Works well</p>
          <ul className="space-y-2 text-muted-foreground">
            {r.good.map((g) => <li key={g} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />{g}</li>)}
          </ul>
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold text-foreground">Avoid</p>
          <ul className="space-y-2 text-muted-foreground">
            {r.avoid.map((g) => <li key={g} className="flex items-start gap-2"><X className="mt-0.5 h-4 w-4 shrink-0 text-destructive" aria-hidden />{g}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function PhotoTips({ tool }: { tool: string }) {
  const isMobile = useIsMobile();
  if (!PHOTO_RULES[tool]) return null;

  const trigger = (
    <button
      type="button"
      aria-label="Show photo tips"
      className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-full px-1 text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-ring"
    >
      <Info className="h-4 w-4 shrink-0" aria-hidden />
      Photo tips
    </button>
  );

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>{trigger}</SheetTrigger>
        <SheetContent side="bottom" className="bg-mat rounded-t-2xl px-5 pb-8">
          <SheetTitle className="mt-2 font-display text-3xl">Photo tips</SheetTitle>
          <div className="mt-3"><TipsBody tool={tool} /></div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent side="bottom" align="start" sideOffset={8} className="w-[28rem] max-w-[90vw] rounded-2xl p-5 shadow-xl">
        <p className="mb-3 font-display text-2xl">Photo tips</p>
        <TipsBody tool={tool} />
      </PopoverContent>
    </Popover>
  );
}
