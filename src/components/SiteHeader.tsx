import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ChevronDown, Eraser, IdCard, Image, Menu, PenLine, Palette, ShoppingBag, Sticker, UserRound, X, type LucideIcon,
} from "lucide-react";
import { TOOL_GROUPS, TOOLS } from "@/lib/tools";

const ICONS: Record<string, LucideIcon> = {
  "/": Eraser, "/colour-background": Palette, "/photo-background": Image, "/product-photo": ShoppingBag,
  "/passport-photo": IdCard, "/profile-picture": UserRound, "/sticker-maker": Sticker, "/logo-cleaner": PenLine,
};

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const current = TOOLS.find((t) => t.to === path);

  useEffect(() => { setOpen(false); setMobile(false); }, [path]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); setMobile(false); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const enter = () => { if (timer.current) clearTimeout(timer.current); setOpen(true); };
  const leave = () => { timer.current = setTimeout(() => setOpen(false), 150); };

  return (
    <header className="relative z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4">
        <Link to="/" className="font-display shrink-0 text-xl font-bold tracking-tight">quikedits<span className="text-primary">.</span><span className="ml-2 rounded-full bg-accent px-2 py-0.5 align-middle font-sans text-[10px] font-semibold uppercase tracking-wider text-primary">Free</span></Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          <div onPointerEnter={enter} onPointerLeave={leave}>
            <button
              type="button"
              aria-expanded={open}
              aria-haspopup="true"
              onClick={() => setOpen((o) => !o)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-accent ${open ? "bg-accent" : ""}`}
            >
              {current ? <>Tools<span className="text-muted-foreground">·</span><span className="text-primary">{current.label}</span></> : "All tools"}
              <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
            {open && (
              <div className="absolute inset-x-0 top-full border-b border-border bg-background shadow-xl">
                <div className="mx-auto max-w-5xl px-4 py-8"><ToolGrid path={path} /></div>
              </div>
            )}
          </div>
          <Link to="/" hash="how-free" className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">How it's free</Link>
        </nav>

        <button type="button" aria-label={mobile ? "Close menu" : "Open menu"} aria-expanded={mobile} onClick={() => setMobile((m) => !m)}
          className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium md:hidden">
          {mobile ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />} Tools
        </button>
      </div>

      {mobile && (
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-border bg-background px-4 py-6 md:hidden">
          <ToolGrid path={path} />
          <Link to="/" hash="how-free" className="mt-6 block text-sm font-medium underline underline-offset-2">How is this free?</Link>
        </div>
      )}
    </header>
  );
}

function ToolGrid({ path }: { path: string }) {
  return (
    <div className="grid gap-8 md:grid-cols-3">
      {TOOL_GROUPS.map((g) => (
        <div key={g.id}>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{g.label}</p>
          <ul className="space-y-1">
            {TOOLS.filter((t) => t.group === g.id).map((t) => {
              const Icon = ICONS[t.to] ?? Eraser;
              const active = t.to === path;
              return (
                <li key={t.to}>
                  <Link to={t.to} aria-current={active ? "page" : undefined}
                    className={`group flex gap-3 rounded-xl p-2.5 transition-colors hover:bg-accent ${active ? "bg-accent" : ""}`}>
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${active ? "bg-primary text-primary-foreground" : "bg-muted text-foreground group-hover:bg-primary group-hover:text-primary-foreground"}`}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold">{t.label}</span>
                      <span className="block text-xs text-muted-foreground">{t.blurb}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
