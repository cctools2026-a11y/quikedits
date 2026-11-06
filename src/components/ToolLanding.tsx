import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, Plus, X } from "lucide-react";
import { TOOL_MEDIA } from "@/lib/tool-media";
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

/** Outlined, slightly tilted photo card — the same language as the top banner. */
export function PosterCard({ tilt = 0, className = "", children }: { tilt?: number; className?: string; children: React.ReactNode }) {
  return (
    <div
      className={`rounded-[1.25rem] border-4 border-foreground bg-card p-1.5 shadow-float transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] [transform:rotate(var(--tilt))] hover:[transform:rotate(0deg)_translateY(-4px)] ${className}`}
      style={{ ["--tilt" as string]: `${tilt}deg` }}
    >
      {children}
    </div>
  );
}

function StepImage({ i, m }: { i: number; m: { before: string; after: string; subject: string } }) {
  const img = "aspect-[4/3] w-full rounded-[0.8rem] object-cover";
  if (i === 0) return <img src={m.before} alt={`Original: ${m.subject}`} loading="lazy" className={img} />;
  if (i === 2) return <div className="checkerboard overflow-hidden rounded-[0.8rem]"><img src={m.after} alt={`Result: ${m.subject}`} loading="lazy" className={img} /></div>;
  return (
    <div className="relative overflow-hidden rounded-[0.8rem]">
      <img src={m.before} alt="" loading="lazy" className={img} />
      <div className="checkerboard absolute inset-0 [clip-path:inset(0_0_0_50%)]"><img src={m.after} alt="" loading="lazy" className={img} /></div>
      <span aria-hidden className="absolute inset-y-0 left-1/2 w-0.5 bg-primary" />
    </div>
  );
}

/** Readable landing content shown under the upload box: how it works, uses, tips, FAQs, other tools. */
export function ToolLanding({ path, home = false }: { path: string; home?: boolean }) {
  const c = TOOL_CONTENT[path]!;
  const rules = PHOTO_RULES[path];
  const m = TOOL_MEDIA[path];
  const tilts = [-2.5, 1.5, -1];
  return (
    <div className="mt-24 space-y-28 overflow-x-clip">
      <Reveal>
        <section aria-labelledby="how">
          <Heading id="how">How it works</Heading>
          <ol className="mt-12 grid gap-12 sm:grid-cols-3 sm:gap-8">
            {c.steps.map((s, i) => (
              <li key={s.title} className="relative">
                {m && <PosterCard tilt={tilts[i]}><StepImage i={i} m={m} /></PosterCard>}
                {i < 2 && <span aria-hidden className="absolute -right-6 top-[28%] hidden w-6 border-t-[3px] border-dashed border-foreground sm:block" />}
                <div className="mt-6 flex items-baseline gap-3">
                  <span className="font-display text-5xl leading-none text-primary">0{i + 1}</span>
                  <h3 className="font-display text-3xl leading-none">{s.title}</h3>
                </div>
                <p className="mt-3 leading-relaxed text-muted-foreground">{s.text}</p>
              </li>
            ))}
          </ol>
        </section>
      </Reveal>

      <Reveal>
        <section aria-labelledby="great-for">
          <Heading id="great-for">Great for</Heading>
          <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-2">
            {c.greatFor.map((g) => (
              <li key={g} className="font-display text-4xl leading-tight decoration-primary decoration-4 underline-offset-8 transition-colors hover:text-primary hover:underline sm:text-5xl">{g}</li>
            ))}
          </ul>
        </section>
      </Reveal>

      <Reveal>
        <section aria-labelledby="tips" className="relative isolate">
          <span aria-hidden className="absolute -right-24 top-16 -z-10 h-72 w-72 rotate-12 rounded-[2rem] bg-art-yellow opacity-70" />
          <Heading id="tips">Tips for the best photo</Heading>
          <div className="mt-12 grid gap-14 md:grid-cols-2 md:gap-10">
            <div className="grid grid-cols-[7rem_1fr] items-start gap-6 sm:grid-cols-[10rem_1fr]">
              {m && <PosterCard tilt={-3}><img src={m.before} alt="A good photo: close and clear" loading="lazy" className="aspect-square w-full rounded-[0.8rem] object-cover" /></PosterCard>}
              <div>
                <p className="font-display text-4xl leading-none">Do</p>
                <ul className="mt-4 space-y-2.5 text-foreground/80">
                  {[...(rules?.good ?? []), ...c.tips].map((t) => <li key={t} className="flex gap-2"><Check className="mt-1 h-4 w-4 shrink-0 text-primary" />{t}</li>)}
                </ul>
              </div>
            </div>
            <div className="grid grid-cols-[7rem_1fr] items-start gap-6 sm:grid-cols-[10rem_1fr]">
              {m && (
                <PosterCard tilt={2.5} className="relative">
                  <div className="overflow-hidden rounded-[0.8rem]"><img src={m.before} alt="A photo to avoid: far away and blurry" loading="lazy" className="aspect-square w-full scale-50 object-cover blur-[3px]" /></div>
                  <span className="absolute -right-3 -top-3 flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-foreground bg-primary text-primary-foreground"><X className="h-4 w-4" /></span>
                </PosterCard>
              )}
              <div>
                <p className="font-display text-4xl leading-none">Avoid</p>
                <ul className="mt-4 space-y-2.5 text-foreground/80">
                  {(rules?.avoid ?? []).map((t) => <li key={t} className="flex gap-2"><X className="mt-1 h-4 w-4 shrink-0" />{t}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {!home && (
        <Reveal>
          <section className="relative left-1/2 w-screen -translate-x-1/2 -rotate-1 bg-primary py-10">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <h2 className="font-display text-5xl leading-none text-primary-foreground sm:text-7xl">Free and private, for real</h2>
              <p className="mt-2 text-lg font-medium text-primary-foreground/90">Your photo never leaves your device. No sign-up, no watermark, no limits.</p>
            </div>
          </section>
        </Reveal>
      )}

      <Reveal>
        <section aria-labelledby="faq">
          <Heading id="faq">Common questions</Heading>
          <div className="mt-8 border-t-4 border-foreground">
            {c.faqs.map((f) => (
              <details key={f.q} className="group border-b-4 border-foreground py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-3xl leading-none [&::-webkit-details-marker]:hidden">
                  {f.q}<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-[3px] border-foreground transition-all group-open:rotate-45 group-open:bg-primary group-open:text-primary-foreground"><Plus className="h-5 w-5" /></span>
                </summary>
                <p className="mt-3 max-w-3xl text-lg text-muted-foreground">{f.a}</p>
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
    <Link to={to} className="group block overflow-hidden rounded-[1.5rem] border-4 border-foreground bg-card shadow-float transition-transform duration-500 hover:-translate-y-1 ease-[cubic-bezier(0.22,1,0.36,1)]">
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
      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {TOOLS.map((t) => <ToolCard key={t.to} to={t.to} label={t.task} blurb={t.label} />)}
        </div>
      </section>
    </Reveal>
  );
}
