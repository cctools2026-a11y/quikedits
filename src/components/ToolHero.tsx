import { useEffect, useRef, type ReactNode } from "react";
import { BadgeCheck, Lock, Sparkles, UserX } from "lucide-react";
import { CompareSlider } from "@/components/CompareSlider";
import { TOOL_MEDIA } from "@/lib/tool-media";

/** Two-column hero: copy + upload on the left, a draggable example on the right. */
export function ToolHero({ path, title, intro, children }: { path: string; title: ReactNode; intro: ReactNode; children: ReactNode }) {
  const m = TOOL_MEDIA[path];
  return (
    <section className="grid items-center gap-10 pt-8 sm:pt-12 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
      <div className="min-w-0">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-lift">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> Free · runs on your device
        </span>
        <h1 className="font-display mt-4 text-4xl font-bold leading-[1.02] tracking-tight sm:text-5xl lg:text-[3.6rem]">{title}</h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">{intro}</p>
        <div className="mt-7">{children}</div>
      </div>
      {m && (
        <figure className="settle relative mx-auto w-full max-w-md lg:max-w-none" style={{ ["--tilt" as string]: `${m.tilt}deg` }}>
          <div aria-hidden className="checker-sm absolute -inset-3 -z-10 rotate-[-3deg] rounded-[2rem] opacity-70" />
          <div className="rounded-[1.75rem] border border-border bg-card p-2.5 shadow-float">
            <CompareSlider before={m.before} after={m.after} beforeAlt={`Example photo: ${m.subject}`} afterAlt={`Example result: ${m.subject}`} />
          </div>
          <figcaption className="absolute -bottom-4 left-6 rounded-full bg-foreground px-4 py-1.5 text-xs font-semibold text-background shadow-lift">{m.badge}</figcaption>
          <span className="absolute -top-3 right-6 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-lift">Drag to compare</span>
        </figure>
      )}
    </section>
  );
}

export function TrustStrip() {
  const items = [
    { icon: BadgeCheck, label: "Free forever", sub: "No watermark, no limits" },
    { icon: Lock, label: "Never uploaded", sub: "Your photo stays on your device" },
    { icon: UserX, label: "No sign-up", sub: "Just open and use" },
  ];
  return (
    <ul className="mt-14 grid gap-3 sm:grid-cols-3">
      {items.map(({ icon: Icon, label, sub }) => (
        <li key={label} className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-lift">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary"><Icon className="h-5 w-5" /></span>
          <span className="min-w-0"><span className="block text-sm font-semibold">{label}</span><span className="block text-xs text-muted-foreground">{sub}</span></span>
        </li>
      ))}
    </ul>
  );
}

/** Fade sections in as they scroll into view (skipped for reduced motion via CSS). */
export function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e?.isIntersecting) { el.classList.add("is-in"); io.disconnect(); } }, { rootMargin: "0px 0px -10% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}
