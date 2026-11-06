import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, Plus, X } from "lucide-react";
import { TOOL_CONTENT } from "@/lib/tool-content";
import { PHOTO_RULES } from "@/lib/photo-rules";
import { TOOLS } from "@/lib/tools";
import { Reveal } from "@/components/ToolHero";
import { ToolArt } from "@/components/ToolArt";


function Heading({ id, kicker, children }: { id: string; kicker?: string; children: React.ReactNode }) {
  return (
    <div>
      {kicker && <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{kicker}</p>}
      <h2 id={id} className={`font-display ${kicker ? "mt-2 " : ""}text-5xl leading-none sm:text-6xl`}>{children}</h2>
    </div>
  );
}

/** Readable landing content shown under the upload box: how it works, uses, tips, FAQs, other tools. */
export function ToolLanding({ path, home = false }: { path: string; home?: boolean }) {
  const c = TOOL_CONTENT[path]!;
  const rules = PHOTO_RULES[path];
  return (
    <div className="mt-24 space-y-24">
      <Reveal>
        <section aria-labelledby="how">
          <Heading id="how">How it works</Heading>
          <ol className="mt-10 grid gap-10 sm:grid-cols-3 sm:gap-8">
            {c.steps.map((s, i) => (
              <li key={s.title} className="border-t-2 border-foreground pt-5">
                <span className="font-display block text-7xl leading-none text-primary">0{i + 1}</span>
                <h3 className="mt-4 text-xl font-semibold leading-snug">{s.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-muted-foreground">{s.text}</p>
              </li>
            ))}
          </ol>
        </section>
      </Reveal>

      <Reveal>
        <section aria-labelledby="great-for">
          <Heading id="great-for">Great for</Heading>
          <div className="mt-8 rounded-2xl border-2 border-foreground bg-card p-2 shadow-lift">
            <ul className="flex flex-wrap gap-2">
              {c.greatFor.map((g, i) => (
                <li
                  key={g}
                  className={`rounded-xl px-4 py-2.5 text-base font-semibold sm:text-lg ${i === 0 ? "bg-foreground text-background" : "bg-muted text-foreground"}`}
                >
                  {g}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section aria-labelledby="tips">
          <Heading id="tips">Tips for the best photo</Heading>
          <div className="mt-10 grid gap-10 md:grid-cols-2">
            <div className="border-t-2 border-foreground pt-5">
              <p className="font-display text-3xl leading-none">Do</p>
              <ul className="mt-4 space-y-2.5 text-foreground/80">
                {[...(rules?.good ?? []), ...c.tips].map((t) => <li key={t} className="flex gap-2"><Check className="mt-1 h-4 w-4 shrink-0 text-primary" />{t}</li>)}
              </ul>
            </div>
            <div className="border-t-2 border-border pt-5">
              <p className="font-display text-3xl leading-none">Avoid</p>
              <ul className="mt-4 space-y-2.5 text-foreground/80">
                {(rules?.avoid ?? []).map((t) => <li key={t} className="flex gap-2"><X className="mt-1 h-4 w-4 shrink-0" />{t}</li>)}
              </ul>
            </div>
          </div>
        </section>
      </Reveal>

      {!home && (
        <Reveal>
          <section className="rounded-[1.75rem] bg-card p-8 shadow-lift sm:p-12">
            <h2 className="font-display text-4xl leading-none sm:text-5xl">Free and private, for real</h2>
            <p className="mt-3 max-w-xl text-foreground/75">Your photo never leaves your device. No sign-up, no watermark, no limits.</p>
          </section>
        </Reveal>
      )}

      <Reveal>
        <section aria-labelledby="faq">
          <Heading id="faq">Common questions</Heading>
          <div className="mt-6 divide-y divide-border border-y border-border">
            {c.faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold [&::-webkit-details-marker]:hidden">
                  {f.q}<span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-foreground transition-transform group-open:rotate-45"><Plus className="h-4 w-4" /></span>
                </summary>
                <p className="mt-3 max-w-3xl text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </Reveal>

      {!home && <Reveal><OtherTools path={path} /></Reveal>}
    </div>
  );
}

function ToolCard({ to, label, blurb, tag }: { to: string; label: string; blurb: string; tag?: string | undefined }) {
  return (
    <Link to={to} className="group block overflow-hidden rounded-[1.5rem] bg-card transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1">
      <div className="relative">
        <ToolArt to={to} />
        {tag && <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">{tag}</span>}
      </div>
      <div className="p-4">
        <span className="flex items-center justify-between font-semibold">{label}<ArrowRight className="h-4 w-4 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" /></span>
        <p className="mt-1 text-sm text-muted-foreground">{blurb}</p>
      </div>
    </Link>
  );
}

function OtherTools({ path }: { path: string }) {
  const rel = TOOL_CONTENT[path]!.related;
  const others = TOOLS.filter((t) => t.to !== path).sort((a, b) => Number(b.to === rel) - Number(a.to === rel));
  return (
    <section aria-labelledby="more-tools">
      <Heading id="more-tools">More free tools</Heading>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {others.map((t) => <ToolCard key={t.to} to={t.to} label={t.label} blurb={t.blurb} tag={t.to === rel ? "Try next" : undefined} />)}
      </div>
    </section>
  );
}

/** Home page tool picker, described by the job people want done. */
export function ToolPicker() {
  return (
    <Reveal>
      <section aria-labelledby="pick-tool" className="mt-24">
        <Heading id="pick-tool">Pick the tool for your job</Heading>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TOOLS.map((t) => <ToolCard key={t.to} to={t.to} label={t.task} blurb={t.label} />)}
        </div>
      </section>
    </Reveal>
  );
}
