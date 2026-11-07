import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { localePath } from "@/lib/i18n";
import { useEnPath, useLocale, type RoutePath } from "@/lib/use-i18n";

const KEY = "quikedits-lang-hint";

/** Suggests the Portuguese page to Portuguese browsers. Never redirects, so crawlers always see the page they asked for. */
export function LanguageHint() {
  const locale = useLocale();
  const path = useEnPath();
  const [show, setShow] = useState(false);
  useEffect(() => {
    const pt = (navigator.languages ?? [navigator.language]).some((l) => l?.toLowerCase().startsWith("pt"));
    setShow(locale === "en" && pt && localStorage.getItem(KEY) !== "1");
  }, [locale]);
  if (!show) return null;
  const close = () => { localStorage.setItem(KEY, "1"); setShow(false); };
  return (
    <div lang="pt" role="region" aria-label="Idioma" className="fixed inset-x-3 bottom-20 z-50 mx-auto flex max-w-md items-center gap-3 rounded-2xl border-4 border-foreground bg-card px-4 py-3 shadow-float">
      <p className="flex-1 text-sm font-semibold">Ver esta página em português?</p>
      <Link to={localePath(path, "pt") as RoutePath} hrefLang="pt" onClick={close} className="rounded-full border-2 border-foreground bg-primary px-3 py-1.5 text-sm font-bold text-primary-foreground">Ver em português</Link>
      <button type="button" onClick={close} aria-label="Fechar" className="rounded-full p-1 hover:bg-muted"><X className="h-4 w-4" /></button>
    </div>
  );
}
