import { useEffect } from "react";

/**
 * Site-wide, low-key motion:
 * - Desktop: elements with [data-tilt] lean towards the mouse in 3D and lift.
 * - Everywhere: [data-reveal] elements rise gently into place as they scroll in.
 * Uses `translate`/`opacity` for reveal so it never fights the elements' own transforms.
 */
export function Motion() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;
    root.classList.add("motion-on");

    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    const watch = () => document.querySelectorAll("[data-reveal]:not(.is-in)").forEach((el) => io.observe(el));
    watch();
    const mo = new MutationObserver(watch);
    mo.observe(document.body, { childList: true, subtree: true });

    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    let active: HTMLElement | null = null;
    const onMove = (e: PointerEvent) => {
      const el = (e.target as Element).closest?.("[data-tilt]") as HTMLElement | null;
      if (active && active !== el) { active.style.transform = ""; active.style.transition = ""; }
      active = el;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transition = "transform 120ms ease-out, border-color 300ms";
      el.style.transform = `perspective(900px) rotateX(${(-py * 7).toFixed(2)}deg) rotateY(${(px * 9).toFixed(2)}deg) translateY(-6px)`;
    };
    const onLeave = () => { if (active) { active.style.transform = ""; active.style.transition = ""; active = null; } };
    if (fine) { addEventListener("pointermove", onMove, { passive: true }); document.addEventListener("pointerleave", onLeave); }

    return () => {
      io.disconnect(); mo.disconnect(); root.classList.remove("motion-on");
      removeEventListener("pointermove", onMove); document.removeEventListener("pointerleave", onLeave);
    };
  }, []);
  return null;
}
