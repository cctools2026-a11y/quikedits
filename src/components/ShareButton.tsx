import { useT } from "@/lib/use-i18n";
import { useEffect, useState } from "react";
import { Share2 } from "lucide-react";

/** Shares an edited image through the device's own share sheet (WhatsApp, Instagram, etc.). */
export function ShareButton({ url, name, compact = false }: { url: string | null; name: string; compact?: boolean }) {
  const t = useT();
  const [supported, setSupported] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  useEffect(() => { setSupported(typeof navigator !== "undefined" && "share" in navigator && "canShare" in navigator); }, []);
  if (!supported) return null;

  const share = async () => {
    if (!url) return;
    setNote(null);
    try {
      const blob = await (await fetch(url)).blob();
      const file = new File([blob], name, { type: blob.type || "image/png" });
      if (!navigator.canShare({ files: [file] })) { setNote(t("This device can't share images. Please download instead.")); return; }
      await navigator.share({ files: [file], title: t("Made with QuikEdits") });
    } catch (e) {
      if ((e as Error).name !== "AbortError") setNote(t("Sharing didn't work. Please download instead."));
    }
  };

  return (
    <div className={compact ? "" : "flex flex-1 flex-col"}>
      <button type="button" onClick={share} disabled={!url} aria-label={compact ? t("Share") : undefined}
        className={compact
          ? "flex shrink-0 items-center gap-1.5 rounded-full border-2 border-foreground px-3 py-1.5 font-medium hover:bg-accent disabled:opacity-50"
          : "flex flex-1 items-center justify-center gap-2 rounded-full border-4 border-foreground bg-card px-6 py-3.5 text-lg font-semibold shadow-lg transition-colors hover:border-primary hover:bg-accent disabled:opacity-50"}>
        <Share2 className={compact ? "h-4 w-4" : "h-5 w-5"} /> {compact ? "" : t("Share")}
      </button>
      {note && <p role="status" className="mt-1 text-center text-xs text-muted-foreground">{note}</p>}
    </div>
  );
}
