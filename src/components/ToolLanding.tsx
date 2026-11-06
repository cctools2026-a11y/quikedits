import { Link } from "@tanstack/react-router";
import { ChevronDown, Lightbulb, ShieldCheck } from "lucide-react";
import { TOOL_CONTENT } from "@/lib/tool-content";
import { TOOLS } from "@/lib/tools";

/** Readable landing content shown under the upload box: how it works, uses, tips, FAQs, other tools. */
export function ToolLanding({ path, home = false }: { path: string; home?: boolean }) {
  const c = TOOL_CONTENT[path]!;
  return (
    <div className="mt-16 space-y-16">
      <section aria-labelledby="how">
        <h2 id="how" className="font-display text-2xl font-bold tracking-tight">How it works</h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-3">
          {c.steps.map((s, i) => (
            <li key={s} className="rounded-2xl border border-border bg-card p-5">
              <span className="font-display flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{i + 1}</span>
              <p className="mt-3">{s}</p>
            </li>
          ))}
        </ol>
      </section>

      <div className="grid gap-8 md:grid-cols-2">
        <section aria-labelledby="great-for">
          <h2 id="great-for" className="font-display text-2xl font-bold tracking-tight">Great for</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {c.greatFor.map((g) => <li key={g} className="rounded-full bg-accent px-3.5 py-1.5 text-sm text-accent-foreground">{g}</li>)}
          </ul>
        </section>
        <section aria-labelledby="tips">
          <h2 id="tips" className="font-display text-2xl font-bold tracking-tight">Tips for the best result</h2>
          <ul className="mt-4 space-y-2">
            {c.tips.map((t) => <li key={t} className="flex gap-2 text-muted-foreground"><Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{t}</li>)}
          </ul>
        </section>
      </div>

      {!home && (
        <section className="flex gap-4 rounded-3xl border border-border bg-card p-6">
          <ShieldCheck className="h-8 w-8 shrink-0 text-primary" />
          <div>
            <h2 className="font-display text-xl font-bold">Free and private, for real</h2>
            <p className="mt-1 text-muted-foreground">
              Your photo never leaves your device. No sign-up, no watermark, no limits.{" "}
              <Link to="/" hash="how-free" className="font-medium text-foreground underline underline-offset-2">See how it can be free</Link>
            </p>
          </div>
        </section>
      )}

      <section aria-labelledby="faq">
        <h2 id="faq" className="font-display text-2xl font-bold tracking-tight">Common questions</h2>
        <div className="mt-4 divide-y divide-border rounded-2xl border border-border bg-card">
          {c.faqs.map((f) => (
            <details key={f.q} className="group p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                {f.q}<ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-2 text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {!home && <OtherTools path={path} />}
    </div>
  );
}

function OtherTools({ path }: { path: string }) {
  const rel = TOOL_CONTENT[path]!.related;
  const others = TOOLS.filter((t) => t.to !== path).sort((a, b) => Number(b.to === rel) - Number(a.to === rel));
  return (
    <section aria-labelledby="more-tools">
      <h2 id="more-tools" className="font-display text-2xl font-bold tracking-tight">More free tools</h2>
      <p className="mt-1 text-muted-foreground">Same idea: free, private, right in your browser.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {others.map((t) => (
          <Link key={t.to} to={t.to} className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/60">
            {t.to === rel && <span className="mb-2 inline-block rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">Try next</span>}
            <span className="block font-semibold">{t.label}</span>
            <p className="mt-1 text-sm text-muted-foreground">{t.blurb}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

/** Home page tool picker, described by the job people want done. */
export function ToolPicker() {
  return (
    <section aria-labelledby="pick-tool" className="mt-16">
      <h2 id="pick-tool" className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Pick the tool for your job</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TOOLS.map((t) => (
          <Link key={t.to} to={t.to} className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/60">
            <span className="block font-semibold">{t.task}</span>
            <p className="mt-1 text-sm text-muted-foreground">{t.label}: {t.blurb}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
