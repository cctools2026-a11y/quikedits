import { Link } from "@tanstack/react-router";
import { IMGLY_URL, SOURCE_URL } from "@/lib/site";
import { TOOLS } from "@/lib/tools";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border py-6 text-sm text-muted-foreground">
      <nav aria-label="All tools" className="mx-auto mb-6 max-w-5xl px-4">
        <p className="mb-2 font-medium text-foreground">Free tools</p>
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          {TOOLS.map((t) => <li key={t.to}><Link to={t.to} className="hover:text-foreground">{t.label}</Link></li>)}
        </ul>
      </nav>
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 sm:flex-row sm:items-center sm:justify-between">
        <p>
          Free software under{" "}
          <Link to="/license" className="underline underline-offset-2 hover:text-foreground">AGPL-3.0</Link>.
          Uses{" "}
          <a href={IMGLY_URL} className="underline underline-offset-2 hover:text-foreground" target="_blank" rel="noreferrer">
            @imgly/background-removal
          </a>{" "}
          by IMG.LY.
        </p>
        <div className="flex gap-4">
          <a href={SOURCE_URL} className="font-medium text-foreground underline underline-offset-2" target="_blank" rel="noreferrer">Source code</a>
          <Link to="/license" className="hover:text-foreground">License</Link>
        </div>
      </div>
    </footer>
  );
}
