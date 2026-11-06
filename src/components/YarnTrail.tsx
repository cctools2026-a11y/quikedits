import { useEffect, useRef } from "react";

/**
 * A kitten with two balls of wool in the bottom-right corner. The balls roll
 * towards wherever the pointer moves (desktop) or with the scroll (mobile);
 * when they roll far enough the kitten pounces after them.
 * Decorative only: aria-hidden, no pointer events, hidden for reduced motion.
 */
const RANGE = 34; // how far (px) a ball can roll from its resting spot

export function YarnTrail() {
  const balls = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
  const cat = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const state = [{ x: 0, y: 0, vx: 0, vy: 0, spin: 0 }, { x: 0, y: 0, vx: 0, vy: 0, spin: 0 }];
    let goalX = 0, goalY = 0, lastPX = -1, lastPY = -1, lastScroll = scrollY;
    let pounce = 0, cool = 0, raf = 0, catX = 0, face = 1;

    const push = (dx: number, dy: number) => {
      goalX = Math.max(-RANGE, Math.min(RANGE, goalX + dx));
      goalY = Math.max(-RANGE / 2, Math.min(RANGE / 2, goalY + dy));
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (lastPX >= 0) push((e.clientX - lastPX) * 0.25, (e.clientY - lastPY) * 0.15);
      lastPX = e.clientX; lastPY = e.clientY;
    };
    const onScroll = () => {
      const d = scrollY - lastScroll; lastScroll = scrollY;
      push(Math.sign(d) * Math.min(14, Math.abs(d) * 0.08) * (Math.random() > 0.5 ? 1 : -1), d * 0.05);
    };

    const tick = () => {
      goalX *= 0.97; goalY *= 0.95; // wool settles back home
      state.forEach((b, i) => {
        const k = i ? 0.05 : 0.08; // second ball is lazier
        const tx = goalX * (i ? 0.7 : 1), ty = goalY * (i ? -0.6 : 1);
        b.vx = (b.vx + (tx - b.x) * k) * 0.82;
        b.vy = (b.vy + (ty - b.y) * k) * 0.82;
        b.x += b.vx; b.y += b.vy; b.spin += b.vx * 6;
        balls[i].current!.style.transform = `translate(${b.x}px, ${b.y}px) rotate(${b.spin}deg)`;
      });
      const lead = state[0];
      cool = Math.max(0, cool - 1);
      if (!pounce && !cool && Math.hypot(lead.vx, lead.vy) > 1.1) { pounce = 1; face = lead.vx >= 0 ? 1 : -1; }
      if (pounce) { pounce += 0.045; if (pounce >= 2) { pounce = 0; cool = 50; } }
      catX += ((lead.x * 0.6) - catX) * 0.08;
      const p = pounce ? pounce - 1 : 0;
      const hop = pounce ? Math.sin(p * Math.PI) * 26 : 0;
      const lunge = pounce ? Math.sin(p * Math.PI) * 14 * face : 0;
      const tilt = pounce ? Math.sin(p * Math.PI) * -12 * face : 0;
      cat.current!.style.transform = `translate(${catX + lunge}px, ${-hop}px) rotate(${tilt}deg) scaleX(${face})`;
      cat.current!.dataset.pounce = pounce ? "1" : "0";
      raf = requestAnimationFrame(tick);
    };

    addEventListener("pointermove", onMove, { passive: true });
    addEventListener("scroll", onScroll, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); removeEventListener("pointermove", onMove); removeEventListener("scroll", onScroll); };
  }, []);

  return (
    <div aria-hidden className="kitten-corner pointer-events-none fixed bottom-3 right-4 z-40 h-20 w-36 sm:bottom-4 sm:right-8 sm:h-24 sm:w-44">
      <div ref={cat} className="kitten absolute bottom-1 left-1 h-16 w-16 origin-bottom sm:h-20 sm:w-20">
        <svg viewBox="0 0 80 80" className="h-full w-full overflow-visible">
          <path className="kitten-tail" d="M14 62 C 0 58, 2 40, 12 38" fill="none" stroke="var(--foreground)" strokeWidth="5" strokeLinecap="round" />
          <ellipse cx="34" cy="60" rx="22" ry="15" fill="var(--kitten)" stroke="var(--foreground)" strokeWidth="3" />
          <circle cx="54" cy="40" r="16" fill="var(--kitten)" stroke="var(--foreground)" strokeWidth="3" />
          <path d="M42 30 L44 14 L54 26 Z M58 26 L66 13 L68 30 Z" fill="var(--kitten)" stroke="var(--foreground)" strokeWidth="3" strokeLinejoin="round" />
          <circle cx="50" cy="40" r="2.6" fill="var(--foreground)" />
          <circle cx="61" cy="40" r="2.6" fill="var(--foreground)" />
          <path d="M53 46 q2.5 2.5 5 0" fill="none" stroke="var(--foreground)" strokeWidth="2" strokeLinecap="round" />
          <ellipse cx="44" cy="74" rx="6" ry="4" fill="var(--kitten)" stroke="var(--foreground)" strokeWidth="2.5" />
          <ellipse cx="26" cy="74" rx="6" ry="4" fill="var(--kitten)" stroke="var(--foreground)" strokeWidth="2.5" />
        </svg>
      </div>
      <Ball ref={balls[0]} className="bottom-1 right-10 h-9 w-9 sm:h-11 sm:w-11" colour="var(--yarn)" />
      <Ball ref={balls[1]} className="bottom-1 right-0 h-7 w-7 sm:h-8 sm:w-8" colour="var(--yarn-2)" />
    </div>
  );
}

function Ball({ ref, className, colour }: { ref: React.Ref<HTMLDivElement>; className: string; colour: string }) {
  return (
    <div ref={ref} className={`absolute ${className}`}>
      <svg viewBox="0 0 24 24" className="h-full w-full">
        <circle cx="12" cy="12" r="10.5" fill={colour} stroke="var(--foreground)" strokeWidth="1.6" />
        <path d="M4 9c5-2 11-2 16 1M3.5 14c6-3 11-3 17 0M7 20c2-6 7-12 12-14M5 5c4 3 7 9 7 17" fill="none" stroke="var(--foreground)" strokeWidth="1" strokeLinecap="round" opacity=".5" />
      </svg>
    </div>
  );
}
