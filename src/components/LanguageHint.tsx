import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { localePath, type Locale } from "@/lib/i18n";
import { useEnPath, useLocale, type RoutePath } from "@/lib/use-i18n";

const KEY = "quikedits-lang-hint";

const HINTS: Partial<Record<Locale, { q: string; cta: string; close: string; label: string }>> = {
  pt: { q: "Ver esta página em português?", cta: "Ver em português", close: "Fechar", label: "Idioma" },
  es: { q: "¿Ver esta página en español?", cta: "Ver en español", close: "Cerrar", label: "Idioma" },
};

/** Suggests a translated page to browsers set to that language. Never redirects, so crawlers always see the page they asked for. */
export function LanguageHint() {
  const locale = useLocale();
  const path = useEnPath();
  const [target, setTarget] = useState<Locale | null>(null);
  useEffect(() => {
    if (locale !== "en" || localStorage.getItem(KEY) === "1") return setTarget(null);
    const langs = (navigator.languages ?? [navigator.language]).map((l) => l?.toLowerCase() ?? "");
    const hit = langs.map((l) => l.slice(0, 2)).find((l): l is Locale => l in HINTS);
    setTarget(hit ?? null);
  }, [locale]);
  const h = target && HINTS[target];
  if (!target || !h) return null;
  const close = () => { localStorage.setItem(KEY, "1"); setTarget(null); };
  return (
    <div lang={target} role="region" aria-label={h.label} className="fixed inset-x-3 bottom-20 z-50 mx-auto flex max-w-md items-center gap-3 rounded-2xl border-4 border-foreground bg-card px-4 py-3 shadow-float">
      <p className="flex-1 text-sm font-semibold">{h.q}</p>
      <Link to={localePath(path, target) as RoutePath} hrefLang={target} onClick={close} className="rounded-full border-2 border-foreground bg-primary px-3 py-1.5 text-sm font-bold text-primary-foreground">{h.cta}</Link>
      <button type="button" onClick={close} aria-label={h.close} className="rounded-full p-1 hover:bg-muted"><X className="h-4 w-4" /></button>
    </div>
  );
}
