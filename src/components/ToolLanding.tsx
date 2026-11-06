import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, Download, Plus, ShieldCheck, Upload, Wand2, X } from "lucide-react";
import { TOOL_CONTENT } from "@/lib/tool-content";
import { PHOTO_RULES } from "@/lib/photo-rules";
import { TOOLS } from "@/lib/tools";
import { Reveal } from "@/components/ToolHero";
import { ToolArt } from "@/components/ToolArt";


function Heading({ id, kicker, children }: { id: string; kicker?: string; children: React.ReactNode }) {
  return (
    <div>
      {kicker && <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{kicker}</p>}
      <h2 id={id} className={`font-display ${kicker ? "mt-2 " : ""}text-4xl leading-none sm:text-5xl`}>{children}</h2>
    </div>
  );
}

const panel = "glass rounded-3xl";
const STEP_ICONS = [Upload, Wand2, Download];

/** Readable landing content shown under the upload box: how it works, uses, tips, FAQs, other tools. */
export function ToolLanding({ path, home = false }: { path: string; home?: boolean }) {
  const c = TOOL_CONTENT[path]!;
  const rules = PHOTO_RULES[path];
  return (
    <div className="relative mt-20 space-y-20">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <span className="glow-orb left-[-10%] top-0 h-96 w-96 bg-primary/40" />
        <span className="glow-orb right-[-8%] top-[22%] h-[28rem] w-[28rem] bg-tile-sky" style={{ animationDelay: "-6s" }} />
        <span className="glow-orb left-[20%] top-[50%] h-96 w-96 bg-tile-lilac" style={{ animationDelay: "-12s" }} />
        <span className="glow-orb right-[10%] bottom-0 h-80 w-80 bg-tile-mint" style={{ animationDelay: "-3s" }} />
      </div>
      <Reveal>
        <section aria-labelledby="how">
          <Heading id="how">How it works</Heading>
          <ol className="mt-8 grid gap-4 sm:grid-cols-3">
            {c.steps.map((s, i) => {
              const Icon = STEP_ICONS[i] ?? Wand2;
              return (
                <li key={s.title} className={`${panel} group relative p-6 transition-all duration-300 hover:-translate-y-1`}>
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-[0_8px_24px_-8px_var(--primary)]"><Icon className="h-5 w-5" /></span>
                    <span className="rounded-full border border-border/60 bg-background/40 px-2.5 py-1 font-mono text-[11px] tracking-wider text-muted-foreground">STEP {i + 1}</span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold leading-snug">{s.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                </li>
              );
            })}
          </ol>
        </section>
      </Reveal>

      <Reveal>
        <section aria-labelledby="great-for">
          <Heading id="great-for">Great for</Heading>
          <ul className="mt-6 flex flex-wrap gap-2">
            {c.greatFor.map((g) => (
              <li key={g} className="glass rounded-full px-4 py-2 text-sm font-semibold">{g}</li>
            ))}
          </ul>
        </section>
      </Reveal>

      <Reveal>
        <section aria-labelledby="tips">
          <Heading id="tips">Tips for the best photo</Heading>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className={`${panel} p-6`}>
              <p className="flex items-center gap-2 text-sm font-semibold"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary"><Check className="h-3.5 w-3.5" /></span>Do</p>
              <ul className="mt-4 space-y-2.5 text-sm text-foreground/80">
                {[...(rules?.good ?? []), ...c.tips].map((t) => <li key={t} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{t}</li>)}
              </ul>
            </div>
            <div className={`${panel} p-6`}>
              <p className="flex items-center gap-2 text-sm font-semibold"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-muted-foreground"><X className="h-3.5 w-3.5" /></span>Avoid</p>
              <ul className="mt-4 space-y-2.5 text-sm text-foreground/80">
                {(rules?.avoid ?? []).map((t) => <li key={t} className="flex gap-2"><X className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />{t}</li>)}
              </ul>
            </div>
          </div>
        </section>
      </Reveal>

      {!home && (
        <Reveal>
          <section className={`${panel} flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:p-8`}>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><ShieldCheck className="h-6 w-6" /></span>
            <div>
              <h2 className="text-xl font-semibold">Free and private, for real</h2>
              <p className="mt-1 text-sm text-muted-foreground">Your photo never leaves your device. No sign-up, no watermark, no limits.</p>
            </div>
          </section>
        </Reveal>
      )}

      <Reveal>
        <section aria-labelledby="faq">
          <Heading id="faq">Common questions</Heading>
          <div className={`${panel} mt-8 divide-y divide-border overflow-hidden`}>
            {c.faqs.map((f) => (
              <details key={f.q} className="group px-6 py-4 open:bg-background/30">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
                  {f.q}<span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-background/50 transition-transform group-open:rotate-45"><Plus className="h-4 w-4" /></span>
                </summary>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">{f.a}</p>
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
    <Link to={to} className="group block overflow-hidden glass rounded-3xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1">
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
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TOOLS.map((t) => <ToolCard key={t.to} to={t.to} label={t.task} blurb={t.label} />)}
        </div>
      </section>
    </Reveal>
  );
}
