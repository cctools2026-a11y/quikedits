import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ChevronDown, Eraser, IdCard, Image, Menu, PenLine, Palette, ShoppingBag, Sticker, UserRound, X, type LucideIcon,
} from "lucide-react";
import { TOOL_GROUPS, TOOLS, subtool, subtoolsOf } from "@/lib/tools";
import { localePath } from "@/lib/i18n";
import { useEnPath, useLocale, useLp, useT, type RoutePath } from "@/lib/use-i18n";

export const ICONS: Record<string, LucideIcon> = {
  "/": Eraser, "/colour-background": Palette, "/photo-background": Image, "/product-photo": ShoppingBag,
  "/passport-photo": IdCard, "/profile-picture": UserRound, "/sticker-maker": Sticker, "/logo-cleaner": PenLine,
};

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const raw = useRouterState({ select: (s) => s.location.pathname });
  const path = useEnPath();
  const t = useT();
  const lp = useLp();
  const locale = useLocale();
  const current = TOOLS.find((o) => o.to === (subtool(path)?.parent ?? path));

  useEffect(() => { setOpen(false); setMobile(false); }, [raw]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); setMobile(false); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const enter = () => { if (timer.current) clearTimeout(timer.current); setOpen(true); };
  const leave = () => { timer.current = setTimeout(() => setOpen(false), 150); };

  return (
    <header className="relative z-40 border-b-4 border-foreground bg-background">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4">
        <Link to={lp("/")} className="font-display shrink-0 text-2xl tracking-wide">{"quikedits"}<span className="text-primary">.</span><span className="ml-2 rounded-full border-2 border-foreground bg-art-yellow px-2 py-0.5 align-middle font-sans text-[10px] font-bold uppercase tracking-wider text-foreground">{t("Free")}</span></Link>

        <nav aria-label={t("Main")} className="hidden items-center gap-1 md:flex">
          <div onPointerEnter={enter} onPointerLeave={leave}>
            <button
              type="button"
              aria-expanded={open}
              aria-haspopup="true"
              onClick={() => setOpen((o) => !o)}
              className={`flex items-center gap-1.5 rounded-full border-2 border-foreground px-4 py-2 text-sm font-bold transition-colors hover:bg-primary hover:text-primary-foreground ${open ? "bg-primary text-primary-foreground" : "bg-card"}`}
            >
              {current ? <>{t("Tools")}<span>·</span><span>{t(current.label)}</span></> : t("All tools")}
              <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
            {open && (
              <div className="absolute inset-x-0 top-full border-b-4 border-foreground bg-background shadow-xl">
                <div className="mx-auto max-w-5xl px-4 py-8"><ToolGrid path={path} /></div>
              </div>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-2">
        <nav aria-label={t("Language")} className="flex rounded-full border-2 border-foreground bg-card p-0.5 text-xs font-bold">
          {(["en", "pt", "es"] as const).map((l) => (
            <Link key={l} to={localePath(path, l) as RoutePath} hrefLang={l} lang={l} aria-current={l === locale ? "true" : undefined}
              aria-label={{ en: "English", pt: "Português", es: "Español" }[l]}
              className={`rounded-full px-2.5 py-1 uppercase transition-colors ${l === locale ? "bg-foreground text-background" : "hover:bg-accent"}`}>{l}</Link>
          ))}
        </nav>
        <button type="button" aria-label={mobile ? t("Close menu") : t("Open menu")} aria-expanded={mobile} onClick={() => setMobile((m) => !m)}
          className="flex items-center gap-2 rounded-full border-2 border-foreground bg-card px-4 py-2 text-sm font-bold md:hidden">
          {mobile ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />} {t("Tools")}
        </button>
        </div>

      </div>

      {mobile && (
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto bg-background px-4 py-6 md:hidden">
          <ToolGrid path={path} />
        </div>
      )}
    </header>
  );
}

function ToolGrid({ path }: { path: string }) {
  const tr = useT();
  const lp = useLp();
  return (
    <div className="grid gap-8 md:grid-cols-3">
      {TOOL_GROUPS.map((g) => (
        <div key={g.id}>
          <p className="font-display mb-3 text-2xl tracking-wide">{tr(g.label)}</p>
          <ul className="space-y-1">
            {TOOLS.filter((t) => t.group === g.id).map((t) => {
              const Icon = ICONS[t.to] ?? Eraser;
              const active = t.to === path;
              return (
                <li key={t.to}>
                  <Link to={lp(t.to)} aria-current={active ? "page" : undefined}
                    className={`group flex gap-3 rounded-xl border-2 p-2.5 transition-colors hover:border-foreground hover:bg-card ${active ? "border-foreground bg-card" : "border-transparent"}`}>
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-foreground transition-colors ${active ? "bg-primary text-primary-foreground" : "bg-card text-foreground group-hover:bg-primary group-hover:text-primary-foreground"}`}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="font-display block text-lg leading-tight tracking-wide">{tr(t.label)}</span>
                      <span className="block text-xs text-muted-foreground">{tr(t.blurb)}</span>
                    </span>
                  </Link>
                  {subtoolsOf(t.to).length > 0 && (
                    <ul aria-label={tr("Popular jobs for {s}", { s: tr(t.label) })} className="ml-14 mt-1 mb-2 flex flex-wrap gap-1.5">
                      {subtoolsOf(t.to).slice(0, 4).map((s) => (
                        <li key={s.to}>
                          <Link to={lp(s.to)} aria-current={s.to === path ? "page" : undefined}
                            className={`block rounded-full border-2 px-2.5 py-0.5 text-xs font-semibold transition-colors hover:border-foreground hover:bg-card ${s.to === path ? "border-foreground bg-card" : "border-border"}`}>{tr(s.label)}</Link>

                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
