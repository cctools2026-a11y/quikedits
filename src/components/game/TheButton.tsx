import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { STAGES, isLast, nextStage } from "@/lib/button-stages";

const base = "rounded-none bg-foreground px-8 py-4 text-lg font-bold text-background";

export function TheButton() {
  const [i, setI] = useState(0);
  const [note, setNote] = useState("");
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hold, setHold] = useState(0);
  const [waiting, setWaiting] = useState(false);
  const [reason, setReason] = useState("");
  const [presses, setPresses] = useState(0);
  const [real] = useState(() => Math.random());
  const [reduced, setReduced] = useState(false);
  const holdTimer = useRef<number | null>(null);
  const stage = STAGES[i]!;

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    setNote(""); setPos({ x: 0, y: 0 }); setHold(0); setReason(""); setPresses(0);
    if (stage.kind === "wait") {
      setWaiting(true);
      const t = window.setTimeout(() => setWaiting(false), 3000);
      return () => window.clearTimeout(t);
    }
    setWaiting(false);
  }, [i, stage.kind]);

  const advance = () => (isLast(i) ? setI(0) : setI(nextStage(i)));

  const dodge = () => {
    if (presses >= 3) return;
    setPresses((p) => p + 1);
    if (reduced) { setNote(["Not there.", "Nope.", "Try once more."][presses] ?? ""); return; }
    setPos({ x: (Math.random() - 0.5) * 220, y: (Math.random() - 0.5) * 160 });
  };

  const startHold = () => {
    const need = i > 10 ? 3000 : 1500;
    const t0 = Date.now();
    holdTimer.current = window.setInterval(() => {
      const p = Math.min(1, (Date.now() - t0) / need);
      setHold(p);
      if (p >= 1) { stopHold(); advance(); }
    }, 50);
  };
  const stopHold = () => {
    if (holdTimer.current) window.clearInterval(holdTimer.current);
    holdTimer.current = null;
    setHold((h) => { if (h > 0 && h < 1) setNote("That was a short hold. Again."); return 0; });
  };

  const renderButton = () => {
    switch (stage.kind) {
      case "dodge":
        return (
          <Button type="button" className={base} style={{ translate: `${pos.x}px ${pos.y}px`, transition: "translate 180ms ease-out" }}
            onPointerEnter={(e) => e.pointerType === "mouse" && dodge()}
            onClick={() => (presses >= 3 ? advance() : dodge())}>{stage.label}</Button>
        );
      case "off":
        return (
          <Button type="button" className="rounded-none border border-border bg-muted px-8 py-4 text-lg text-muted-foreground"
            onClick={() => (presses >= 1 ? advance() : (setPresses(1), setNote("Off buttons don't do anything. Press again to confirm.")))}>{stage.label}</Button>
        );
      case "two": {
        const left = real < 0.5;
        const fake = () => setNote("That one was decorative.");
        return (
          <div className="flex gap-4">
            <Button type="button" className={base} onClick={left ? advance : fake}>{stage.label}</Button>
            <Button type="button" className={base} onClick={left ? fake : advance}>{stage.label}</Button>
          </div>
        );
      }
      case "many": {
        const n = Math.floor(real * 9);
        return (
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 9 }, (_, k) => (
              <Button key={k} type="button" className="rounded-none bg-foreground px-4 py-3 text-background"
                onClick={k === n ? advance : () => setNote(["On lunch.", "In a meeting.", "Out of office.", "Training day.", "Just started.", "Doesn't press.", "Union rep.", "Asleep."][k % 8]!)}>
                {stage.label}
              </Button>
            ))}
          </div>
        );
      }
      case "reason":
        return (
          <form className="flex w-full max-w-sm flex-col gap-3" onSubmit={(e) => {
            e.preventDefault();
            if (reason.trim().length < 3) { setNote("That is not a reason. That is a noise."); return; }
            advance();
          }}>
            <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Because…" aria-label="Your reason"
              className="border-b-2 border-foreground bg-transparent px-1 py-2 text-lg outline-none" />
            <Button type="submit" className={base}>{stage.label}</Button>
          </form>
        );
      case "hold":
        return (
          <Button type="button" className={base} onPointerDown={startHold} onPointerUp={stopHold} onPointerLeave={stopHold}
            onContextMenu={(e) => e.preventDefault()} style={{ touchAction: "none", userSelect: "none" }}>
            {hold > 0 ? `${Math.round(hold * 100)}%` : stage.label}
          </Button>
        );
      case "wait":
        return <Button type="button" disabled={waiting} className={base} onClick={advance}>{waiting ? stage.label : "Back"}</Button>;
      case "tiny":
        return <Button type="button" className="h-auto min-h-0 rounded-none bg-foreground px-1 py-0 text-[9px] text-background" onClick={advance}>{stage.label}</Button>;
      case "shy":
        return (
          <Button type="button" className={base} style={{ opacity: presses === 0 ? 0.15 : presses === 1 ? 0.5 : 1, transition: "opacity 600ms" }}
            onClick={() => (presses >= 2 ? advance() : (setPresses((p) => p + 1), setNote(presses === 0 ? "Too fast. Gently." : "Nearly.")))}>{stage.label}</Button>
        );
      default:
        return <Button type="button" className={base} onClick={advance}>{stage.label}</Button>;
    }
  };

  return (
    <main className="odd-jobs flex min-h-dvh flex-col bg-background px-6 py-10 text-foreground">
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col">
        <p className="text-xs text-muted-foreground" aria-live="polite">{i + 1} / {STAGES.length}</p>
        <section className="flex flex-1 flex-col items-center justify-center gap-10 text-center">
          <p className="min-h-[4rem] text-2xl font-semibold leading-snug" aria-live="polite">{stage.say}</p>
          <div className="flex min-h-[12rem] items-center justify-center">{renderButton()}</div>
          <p className="min-h-[1.5rem] text-sm text-muted-foreground" aria-live="polite">{note}</p>
        </section>
        <footer className="mt-10 text-center">
          <Link to="/auth" aria-label="Staff" className="text-xs text-muted-foreground/40 hover:text-muted-foreground">·</Link>
        </footer>
      </div>
    </main>
  );
}
