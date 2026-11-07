import { HowItsFree } from "@/components/HowItsFree";
import { Link } from "@tanstack/react-router";
import { IMGLY_URL, SOURCE_URL } from "@/lib/site";
import { TOOL_GROUPS, TOOLS } from "@/lib/tools";
import { useLp, useT } from "@/lib/use-i18n";

export function SiteFooter() {
  const t = useT();
  const lp = useLp();
  return (
    <footer className="mt-28 border-t-4 border-foreground bg-background text-sm text-muted-foreground">
      <div className="px-4 pt-16 text-foreground"><HowItsFree /></div>
      <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to={lp("/")} className="font-display text-4xl leading-none text-foreground">{"quikedits"}<span className="text-primary">.</span></Link>
          <p className="mt-3 max-w-xs">{t("Made to run on your device. Your photos never leave it, which is why it's free.")}</p>
        </div>
        {TOOL_GROUPS.map((g) => (
          <nav key={g.id} aria-label={t(g.label)}>
            <p className="font-display mb-3 text-2xl leading-none text-foreground">{t(g.label)}</p>
            <ul className="space-y-2">
              {TOOLS.filter((o) => o.group === g.id).map((o) => (
                <li key={o.to}><Link to={lp(o.to)} className="font-medium transition-colors hover:text-primary">{t(o.label)}</Link></li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t-4 border-foreground bg-foreground text-background/70">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Free software under{" "}
            <Link to="/license" className="underline underline-offset-2 hover:text-background">AGPL-3.0</Link>. Uses{" "}
            <a href={IMGLY_URL} className="underline underline-offset-2 hover:text-background" target="_blank" rel="noreferrer">{"@imgly/background-removal"}</a> by IMG.LY.
          </p>
          <div className="flex gap-4">
            <a href={SOURCE_URL} className="font-semibold text-background underline underline-offset-2" target="_blank" rel="noreferrer">{t("Source code")}</a>
            <Link to={lp("/license")} className="hover:text-background">
{t("License")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
