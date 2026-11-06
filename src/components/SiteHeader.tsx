import { Link } from "@tanstack/react-router";
import { TOOLS } from "@/lib/tools";

export function SiteHeader() {
  return (
    <header className="mx-auto max-w-5xl px-4 py-5">
      <Link to="/" className="font-display text-xl font-bold tracking-tight">cutout<span className="text-primary">.</span></Link>
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

export function MoreTools() {
  return (
    <section aria-labelledby="more-tools" className="mt-16">
      <h2 id="more-tools" className="font-display text-2xl font-bold tracking-tight">More free tools</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((t) => (
          <Link key={t.to} to={t.to} className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/60">
            <span className="font-semibold">{t.label}</span>
            <p className="mt-1 text-sm text-muted-foreground">{t.blurb}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
