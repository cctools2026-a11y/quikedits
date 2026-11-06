import { HowItsFree } from "@/components/HowItsFree";
import { Link } from "@tanstack/react-router";
import { IMGLY_URL, SOURCE_URL } from "@/lib/site";
import { TOOL_GROUPS, TOOLS } from "@/lib/tools";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-card text-sm text-muted-foreground">
      <div className="px-4 pt-12 text-foreground"><HowItsFree /></div>
      <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="font-display text-xl font-bold tracking-tight text-foreground">quikedits<span className="text-primary">.</span></Link>
          <p className="mt-3 max-w-xs">Made to run on your device. Your photos never leave it, which is why it's free.</p>
        </div>
        {TOOL_GROUPS.map((g) => (
          <nav key={g.id} aria-label={g.label}>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground">{g.label}</p>
            <ul className="space-y-2">
              {TOOLS.filter((t) => t.group === g.id).map((t) => (
                <li key={t.to}><Link to={t.to} className="hover:text-foreground">{t.label}</Link></li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Free software under{" "}
            <Link to="/license" className="underline underline-offset-2 hover:text-foreground">AGPL-3.0</Link>. Uses{" "}
            <a href={IMGLY_URL} className="underline underline-offset-2 hover:text-foreground" target="_blank" rel="noreferrer">@imgly/background-removal</a> by IMG.LY.
          </p>
          <div className="flex gap-4">
            <a href={SOURCE_URL} className="font-medium text-foreground underline underline-offset-2" target="_blank" rel="noreferrer">Source code</a>
            <Link to="/license" className="hover:text-foreground">License</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
