import { useMemo, useState } from "react";
import { AlertTriangle, Brush, Sparkles } from "lucide-react";
import { analyseCanvas, keepLargest } from "@/lib/compose";
import { cuesFor, SMALL_EDGE } from "@/lib/photo-rules";
import { TouchUp } from "@/components/TouchUp";

/** Warnings about a cutout plus quick fixes. `cut` must be full-frame, aligned with `source`. */
export function CutoutCues({ tool, cut, source, label, onChange, onRetry }: {
  tool: string; cut: HTMLCanvasElement; source: HTMLCanvasElement; label?: string | undefined;
  onChange: (c: HTMLCanvasElement) => void; onRetry?: (() => void) | undefined;
}) {
  const [editing, setEditing] = useState(false);
  const cues = useMemo(
    () => cuesFor(tool, analyseCanvas(cut), Math.min(source.width, source.height) < SMALL_EDGE),
    [tool, cut, source],
  );
  const stray = cues.some((c) => c.id === "stray");

  if (editing) return <TouchUp cut={cut} source={source} onDone={(c) => { onChange(c); setEditing(false); }} onCancel={() => setEditing(false)} />;

  return (
    <div className="mb-6">
      {cues.length > 0 && (
        <div role="status" className="rounded-2xl border border-primary/40 bg-accent p-4 text-accent-foreground">
          {label && <p className="mb-1 text-sm font-semibold">{label}</p>}
          <ul className="space-y-1.5">
            {cues.map((c) => <li key={c.id} className="flex gap-2 text-sm"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />{c.text}</li>)}
          </ul>
          <div className="mt-3 flex flex-wrap gap-2">
            {stray && (
              <button type="button" onClick={() => onChange(keepLargest(cut))} className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                <Sparkles className="h-4 w-4" /> Clean up stray bits
              </button>
            )}
            <button type="button" onClick={() => setEditing(true)} className="flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium">
              <Brush className="h-4 w-4" /> Fix it
            </button>
            {onRetry && <button type="button" onClick={onRetry} className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium">Try another photo</button>}
          </div>
        </div>
      )}
      {cues.length === 0 && (
        <button type="button" onClick={() => setEditing(true)} className="flex items-center gap-1.5 text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground">
          <Brush className="h-4 w-4" /> {label ? `Touch up ${label}` : "Something missing or left over? Touch it up"}
        </button>
      )}
    </div>
  );
}
