import { Check, X } from "lucide-react";
import { PHOTO_RULES } from "@/lib/photo-rules";

export function PhotoTips({ tool }: { tool: string }) {
  const r = PHOTO_RULES[tool];
  if (!r) return null;
  return (
    <div className="mt-5">
      <p className="text-sm font-medium">{r.best}</p>
      <ul className="mt-3 flex flex-wrap gap-2 text-sm">
        {r.good.map((g) => (
          <li key={g} className="flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-accent-foreground"><Check className="h-4 w-4" aria-hidden />{g}</li>
        ))}
        {r.avoid.map((g) => (
          <li key={g} className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-muted-foreground"><X className="h-4 w-4" aria-label="Avoid" />{g}</li>
        ))}
      </ul>
    </div>
  );
}
