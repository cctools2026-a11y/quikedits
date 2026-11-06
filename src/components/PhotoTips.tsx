import { Check, ChevronDown, Info, X } from "lucide-react";
import { PHOTO_RULES } from "@/lib/photo-rules";

export function PhotoTips({ tool }: { tool: string }) {
  const r = PHOTO_RULES[tool];
  if (!r) return null;
  return (
    <details className="group mt-4 border-b border-border pb-3 text-sm">
      <summary className="flex min-h-10 cursor-pointer list-none items-center gap-2 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
        <Info className="h-4 w-4 shrink-0" aria-hidden />
        <span className="font-medium">Photo tips</span>
        <ChevronDown className="ml-auto h-4 w-4 shrink-0 transition-transform motion-reduce:transition-none group-open:rotate-180" aria-hidden />
      </summary>
      <div className="pt-2">
        <p className="font-medium leading-relaxed">{r.best}</p>
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
              {r.avoid.map((g) => <li key={g} className="flex items-start gap-2"><X className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />{g}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </details>
  );
}
