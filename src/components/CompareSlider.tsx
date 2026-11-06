import { useCallback, useRef, useState } from "react";

export function CompareSlider({ before, after }: { before: string; after: string }) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const move = useCallback((clientX: number) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)));
  }, []);

  return (
    <div
      ref={ref}
      className="checkerboard relative w-full select-none overflow-hidden rounded-2xl border border-border touch-none"
      onPointerDown={(e) => {
        dragging.current = true;
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        move(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && move(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
    >
      <img src={after} alt="Background removed" className="block max-h-[70vh] w-full object-contain" draggable={false} />
      <img
        src={before}
        alt="Original"
        draggable={false}
        className="absolute inset-0 h-full w-full object-contain bg-background"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      />
      <span className="absolute left-3 top-3 rounded-full bg-foreground/80 px-2.5 py-1 text-xs font-medium text-background">Before</span>
      <span className="absolute right-3 top-3 rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground">After</span>
      <div className="absolute inset-y-0" style={{ left: `${pos}%` }}>
        <div className="absolute inset-y-0 -ml-px w-0.5 bg-primary" />
        <button
          type="button"
          role="slider"
          aria-label="Before and after comparison"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 5));
            if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 5));
          }}
          className="absolute top-1/2 -ml-5 -mt-5 flex h-10 w-10 cursor-ew-resize items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-ring"
        >
          ⇆
        </button>
      </div>
    </div>
  );
}
