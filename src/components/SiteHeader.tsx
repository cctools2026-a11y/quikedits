import { Link } from "@tanstack/react-router";
import { TOOLS } from "@/lib/tools";

export function SiteHeader() {
  return (
    <header className="mx-auto max-w-5xl px-4 py-5">
      <Link to="/" className="font-display text-xl font-bold tracking-tight">quikedits<span className="text-primary">.</span></Link>
      <nav aria-label="Tools" className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 text-sm">
        {TOOLS.map((t) => (
          <Link
            key={t.to}
            to={t.to}
            activeOptions={{ exact: true }}
            className="shrink-0 rounded-full border border-border px-3 py-1.5 text-muted-foreground hover:text-foreground"
            activeProps={{ className: "shrink-0 rounded-full border border-primary bg-primary px-3 py-1.5 text-primary-foreground" }}
          >
            {t.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
