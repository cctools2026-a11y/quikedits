import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ROUNDS, ROUNDS_PER_GAME, pickRounds, score, verdict, type Round } from "@/lib/handmade-rounds";

const ROPE = 13;

export function MadeByHand() {
  const [rounds, setRounds] = useState<Round[]>(() => ROUNDS.slice(0, ROUNDS_PER_GAME));
  const [flips, setFlips] = useState<boolean[]>(() => rounds.map((_, i) => i % 2 === 0));
  const [i, setI] = useState(0);
  const [picks, setPicks] = useState<boolean[]>([]);
  const [answered, setAnswered] = useState<boolean | null>(null);

  const reset = () => {
    const r = pickRounds();
    setRounds(r); setFlips(r.map(() => Math.random() < 0.5)); setI(0); setPicks([]); setAnswered(null);
  };
  useEffect(reset, []);

  const done = i >= rounds.length;
  const round = rounds[i];
  const s = score(picks);
  const rope = useMemo(() => {
    const lean = picks.length ? (s - (picks.length - s)) / ROUNDS_PER_GAME : 0;
    const pos = Math.round(((1 - lean) / 2) * (ROPE - 1));
    return Array.from({ length: ROPE }, (_, k) => (k === pos ? "●" : "━")).join("");
  }, [picks, s]);

  const choose = (isHuman: boolean) => {
    if (answered !== null) return;
    setAnswered(isHuman);
    setPicks((p) => [...p, isHuman]);
  };

  const options = round ? (flips[i] ? [[round.human, true], [round.machine, false]] : [[round.machine, false], [round.human, true]]) as [string, boolean][] : [];

  return (
    <main className="odd-jobs flex min-h-dvh flex-col bg-background px-6 py-10 text-foreground">
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col">
        <header className="text-center">
          <h1 className="text-3xl font-bold">Made by Hand?</h1>
          <p className="mt-2 text-sm text-muted-foreground">Tap the one a person wrote.</p>
          <p className="mt-6 font-mono text-sm whitespace-nowrap" aria-label={`Score ${s} of ${picks.length}`}>
            HAND {rope} MACHINE
          </p>
        </header>

        <section className="flex flex-1 flex-col justify-center gap-6 py-10">
          {!done && round && (
            <>
              <p className="text-center text-xs font-bold uppercase text-muted-foreground">{i + 1} / {rounds.length} · {round.topic}</p>
              <div className="flex flex-col gap-3">
                {options.map(([text, isHuman]) => {
                  const show = answered !== null;
                  return (
                    <button key={text} type="button" onClick={() => choose(isHuman)} disabled={show}
                      className={`border-2 p-5 text-left text-lg leading-snug transition-colors ${show ? (isHuman ? "border-foreground" : "border-border text-muted-foreground line-through") : "border-border hover:border-foreground focus-visible:border-foreground"}`}>
                      {text}
                      {show && <span className="mt-2 block text-xs font-bold uppercase no-underline">{isHuman ? "A person" : "A machine"}</span>}
                    </button>
                  );
                })}
              </div>
              <div className="min-h-[6rem] text-center" aria-live="polite">
                {answered !== null && (
                  <>
                    <p className="font-semibold">{answered ? "Correct." : "Fooled."} {round.reveal}</p>
                    <Button type="button" onClick={() => { setAnswered(null); setI(i + 1); }} className="mt-4 rounded-none bg-foreground px-6 py-3 text-background">Next</Button>
                  </>
                )}
              </div>
            </>
          )}
          {done && (
            <div className="text-center">
              <p className="text-6xl font-bold">{s} / {rounds.length}</p>
              <p className="mt-3 text-lg">{verdict(s)}</p>
              <Button type="button" onClick={reset} className="mt-6 rounded-none bg-foreground px-6 py-3 text-background">Play again</Button>
            </div>
          )}
        </section>

        <footer className="text-center text-xs text-muted-foreground">
          <Link to="/" className="underline">Another game</Link>
        </footer>
      </div>
    </main>
  );
}
