import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, ChevronDown, Download, ImagePlus, ShieldCheck, SlidersHorizontal, X } from "lucide-react";
import { TOOL_CONTENT } from "@/lib/tool-content";
import { TOOL_MEDIA } from "@/lib/tool-media";
import { PHOTO_RULES } from "@/lib/photo-rules";
import { TOOLS } from "@/lib/tools";
import { Reveal } from "@/components/ToolHero";
import { ToolArt } from "@/components/ToolArt";

const STEP_ICONS = [ImagePlus, SlidersHorizontal, Download];

function Heading({ id, kicker, children }: { id: string; kicker: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{kicker}</p>
      <h2 id={id} className="font-display mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{children}</h2>
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
          <Heading id="how" kicker="Three steps">How it works</Heading>
          <ol className="relative mt-10 grid gap-6 sm:grid-cols-3">
            <span aria-hidden className="cut-line absolute left-[16%] right-[16%] top-7 hidden h-0.5 sm:block" />
            {c.steps.map((s, i) => {
              const Icon = STEP_ICONS[i]!;
              return (
                <li key={s} className="relative text-center">
                  <span className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-card shadow-lift">
                    <Icon className="h-6 w-6 text-primary" />
                    <span className="font-display absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{i + 1}</span>
                  </span>
                  <p className="mx-auto mt-4 max-w-[16rem] font-medium">{s}</p>
                </li>
              );
            })}
          </ol>
        </section>
      </Reveal>

      <Reveal>
        <section aria-labelledby="great-for" className="rounded-[2rem] border border-border bg-card p-6 shadow-lift sm:p-10">
          <Heading id="great-for" kicker="Made for">Great for</Heading>
          <ul className="mt-6 flex flex-wrap gap-3">
            {c.greatFor.map((g, i) => (
              <li key={g} style={{ transform: `rotate(${[-1.5, 1, -0.5, 1.5, -1][i % 5]}deg)` }}
                className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium shadow-lift">{g}</li>
            ))}
          </ul>
        </section>
      </Reveal>

      <Reveal>
        <section aria-labelledby="tips">
          <Heading id="tips" kicker="Better results">Tips for the best photo</Heading>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-lift">
              <p className="flex items-center gap-2 font-semibold"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check className="h-4 w-4" /></span>Do</p>
              <ul className="mt-4 space-y-2.5 text-muted-foreground">
                {[...(rules?.good ?? []), ...c.tips].map((t) => <li key={t} className="flex gap-2"><Check className="mt-1 h-4 w-4 shrink-0 text-primary" />{t}</li>)}
              </ul>
            </div>
            <div className="rounded-2xl border border-dashed border-border bg-background p-6">
              <p className="flex items-center gap-2 font-semibold"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted"><X className="h-4 w-4" /></span>Avoid</p>
              <ul className="mt-4 space-y-2.5 text-muted-foreground">
                {(rules?.avoid ?? []).map((t) => <li key={t} className="flex gap-2"><X className="mt-1 h-4 w-4 shrink-0" />{t}</li>)}
              </ul>
            </div>
          </div>
        </section>
      </Reveal>

      {!home && (
        <Reveal>
          <section className="flex flex-col gap-4 rounded-[2rem] bg-foreground p-8 text-background sm:flex-row sm:items-center sm:p-10">
            <ShieldCheck className="h-10 w-10 shrink-0 text-primary" />
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-2xl font-bold">Free and private, for real</h2>
              <p className="mt-1 opacity-80">Your photo never leaves your device. No sign-up, no watermark, no limits.</p>
            </div>
            <Link to="/" hash="how-free" className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 font-semibold text-primary-foreground">
              How it's free <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        </Reveal>
      )}

      <Reveal>
        <section aria-labelledby="faq">
          <Heading id="faq" kicker="Good to know">Common questions</Heading>
          <div className="mt-8 grid gap-3 md:grid-cols-2">
            {c.faqs.map((f) => (
              <details key={f.q} className="group h-fit rounded-2xl border border-border bg-card p-5 shadow-lift">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                  {f.q}<ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-muted-foreground">{f.a}</p>
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
    <Link to={to} className="group block overflow-hidden rounded-2xl border border-border bg-card shadow-lift transition-all hover:-translate-y-1 hover:shadow-float">
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
      <Heading id="more-tools" kicker="Same idea, free and private">More free tools</Heading>
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
        <Heading id="pick-tool" kicker="Eight free tools">Pick the tool for your job</Heading>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TOOLS.map((t) => <ToolCard key={t.to} to={t.to} label={t.task} blurb={t.label} />)}
        </div>
      </section>
    </Reveal>
  );
}
