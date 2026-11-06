import { useEffect, useRef, type ReactNode } from "react";
import { CompareSlider } from "@/components/CompareSlider";
import { TOOL_MEDIA } from "@/lib/tool-media";

/** Two-column hero: copy + upload on the left, a draggable example on the right. */
export function ToolHero({ path, title, intro, children, example }: { path: string; title: ReactNode; intro: ReactNode; children: ReactNode; example?: ReactNode }) {
  const m = TOOL_MEDIA[path];
  return (
    <section className="grid items-center gap-10 overflow-x-clip pt-8 sm:pt-12 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
      <div className="min-w-0">
        <h1 className="page-title">{title}</h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">{intro}</p>
        <div className="mt-7">{children}</div>
      </div>
      <HeroStage>{example ?? (m && (
        <figure className="settle relative mx-auto w-full max-w-md lg:max-w-none" style={{ ["--tilt" as string]: `${m.tilt}deg` }}>
          <div className="rounded-[1.75rem] border-4 border-foreground bg-card p-2.5 shadow-float">
            <CompareSlider before={m.before} after={m.after} beforeAlt={`Example photo: ${m.subject}`} afterAlt={`Example result: ${m.subject}`} />
          </div>
        </figure>
      ))}</HeroStage>
    </section>
  );
}

function HeroStage({ children }: { children: ReactNode }) {
  return (
    <div className="hero-stage mx-auto w-full max-w-md px-4 py-6 sm:px-6 lg:max-w-none">
      <span aria-hidden className="splash-block" />
      <span aria-hidden className="splash-sun" />
      {children}
    </div>
  );
}

export function TrustStrip() {
  const items = [
    { label: "Free forever", sub: "No watermark, no limits" },
    { label: "Never uploaded", sub: "Your photo stays on your device" },
    { label: "No sign-up", sub: "Just open and use" },
  ];
  const tints = ["", "", ""];
  return (
    <ul className="mt-14 grid gap-6 border-y border-border py-6 sm:grid-cols-3">
      {items.map(({ label, sub }, i) => (
        <li key={label} className={`${tints[i]} sm:px-2`}>
          <span className="font-display block text-3xl leading-none tracking-wide text-foreground">{label}</span>
          <span className="mt-1.5 block text-sm text-foreground/70">{sub}</span>
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
