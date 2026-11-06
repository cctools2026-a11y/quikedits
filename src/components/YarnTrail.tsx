import { useEffect, useRef } from "react";

/**
 * A ball of wool that unspools down the page edge as you scroll, with a little
 * cat paw batting it along. Hovering tool cards on desktop gives it a nudge.
 * Purely decorative: aria-hidden, pointer-events none, off for reduced motion.
 */
const W = 60;
const H = 1000;
// Loose, wandering thread in a 60x1000 box (stretched to the viewport height).
const PATH = "M30 0 C 52 60, 8 110, 30 170 S 54 280, 26 340 S 6 450, 32 510 S 56 620, 28 690 S 4 800, 30 860 S 50 950, 30 1000";

export function YarnTrail() {
  const path = useRef<SVGPathElement>(null);
  const ball = useRef<HTMLDivElement>(null);
  const paw = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const p = path.current!;
    const len = p.getTotalLength();
    p.style.strokeDasharray = `${len}`;
    let target = 0, shown = 0, nudge = 0, raf = 0, last = 0;

    const read = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      target = max > 0 ? scrollY / max : 0;
    };
    const tick = (t: number) => {
      const dt = Math.min(64, t - last || 16); last = t;
      nudge *= 0.92;
      const goal = Math.min(1, 0.04 + target * 0.96 + nudge);
      shown += (goal - shown) * Math.min(1, dt / 120);
      const l = len * shown;
      p.style.strokeDashoffset = `${len - l}`;
      const pt = p.getPointAtLength(l);
      const box = p.ownerSVGElement!.getBoundingClientRect();
      const x = (pt.x / W) * box.width, y = (pt.y / H) * box.height;
      ball.current!.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${l * 2.2}deg)`;
      const bat = Math.sin(t / 380) * 4 + nudge * 120;
      paw.current!.style.transform = `translate(${x}px, ${y}px) translate(-50%, -150%) rotate(${-20 + bat}deg)`;
      raf = requestAnimationFrame(tick);
    };
    const onHover = (e: Event) => {
      if ((e.target as Element).closest?.("a[href^='/'] .group, a.group, .group")) nudge = Math.min(0.06, nudge + 0.03);
    };
    read();
    addEventListener("scroll", read, { passive: true });
    addEventListener("resize", read);
    document.addEventListener("pointerover", onHover);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", read);
      removeEventListener("resize", read);
      document.removeEventListener("pointerover", onHover);
    };
  }, []);

  return (
    <div aria-hidden className="yarn-trail pointer-events-none fixed inset-y-0 right-0 z-10 w-6 sm:w-10 xl:w-16">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-full w-full overflow-visible">
        <path ref={path} d={PATH} fill="none" stroke="var(--yarn)" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" strokeDasharray="1" strokeDashoffset="1" />
      </svg>
      <div ref={paw} className="absolute left-0 top-0 origin-bottom">
        <svg viewBox="0 0 20 24" className="h-4 w-3.5 sm:h-5 sm:w-4"><path d="M10 24 C3 24 2 16 4 10 C5 6 15 6 16 10 C18 16 17 24 10 24Z" fill="var(--foreground)" /><circle cx="5" cy="5" r="2.2" fill="var(--foreground)" /><circle cx="10" cy="3" r="2.2" fill="var(--foreground)" /><circle cx="15" cy="5" r="2.2" fill="var(--foreground)" /></svg>
      </div>
      <div ref={ball} className="absolute left-0 top-0">
        <svg viewBox="0 0 24 24" className="h-4 w-4 sm:h-6 sm:w-6">
          <circle cx="12" cy="12" r="10.5" fill="var(--yarn)" stroke="var(--foreground)" strokeWidth="1.5" />
          <path d="M4 9c5-2 11-2 16 1M3.5 14c6-3 11-3 17 0M7 20c2-6 7-12 12-14M5 5c4 3 7 9 7 17" fill="none" stroke="var(--foreground)" strokeWidth="1" strokeLinecap="round" opacity=".55" />
        </svg>
      </div>
    </div>
  );
}
