import { useEffect, useRef, type ReactNode } from "react";
import { CompareSlider } from "@/components/CompareSlider";
import { TOOL_MEDIA } from "@/lib/tool-media";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { TOOLS, subtool } from "@/lib/tools";

/** Two-column hero: copy + upload on the left, a draggable example on the right. */
export function ToolHero({ path, title, intro, children, example }: { path: string; title: ReactNode; intro: ReactNode; children: ReactNode; example?: ReactNode }) {
  const m = TOOL_MEDIA[path];
  const sub = subtool(path);
  const parent = sub && TOOLS.find((t) => t.to === sub.parent);
  return (
    <section className="grid items-center gap-10 overflow-x-clip pt-8 sm:pt-12 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
      <div className="min-w-0">
        {sub && parent && (
          <nav aria-label={t("Breadcrumb")} className="mb-3 flex items-center gap-1 text-sm font-semibold text-muted-foreground">
            <Link to={parent.to} className="underline-offset-4 hover:text-foreground hover:underline">{parent.label}</Link>
            <ChevronRight className="h-4 w-4" aria-hidden /><span className="text-foreground">{sub.label}</span>
          </nav>
        )}
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
  const items = ["Free forever", "Never uploaded", "No sign-up"];
  return (
    <ul className="mt-8 flex flex-wrap gap-2">
      {items.map((label) => (
        <li key={label} className="rounded-full border-[3px] border-foreground bg-card px-3.5 py-1 text-sm font-bold text-foreground">
          {label}
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
