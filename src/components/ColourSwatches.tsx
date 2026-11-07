import { Check } from "lucide-react";
import { PALETTE } from "@/lib/colour-background";

export function ColourSwatches({ value, onChange, colours = PALETTE }: { value: string; onChange: (c: string) => void; colours?: readonly string[] }) {
  return (
    <div className="flex flex-wrap gap-2.5" role="radiogroup" aria-label={t("Background colour")}>
      {colours.map((c) => (
        <button
          key={c}
          type="button"
          role="radio"
          aria-checked={value.toLowerCase() === c.toLowerCase()}
          aria-label={`Colour ${c}`}
          onClick={() => onChange(c)}
          className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-border shadow-sm transition-transform hover:scale-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-ring"
          style={{ backgroundColor: c }}
        >
          {value.toLowerCase() === c.toLowerCase() && <Check className="h-5 w-5 text-background mix-blend-difference" />}
        </button>
      ))}
      <label className="flex h-10 cursor-pointer items-center gap-2 rounded-full border-2 border-border px-3 text-sm font-medium">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="h-6 w-6 cursor-pointer border-0 bg-transparent p-0" aria-label={t("Custom colour")} />
        Custom
      </label>
    </div>
  );
}
