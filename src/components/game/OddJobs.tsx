import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type CSSProperties } from "react";

type Verdicts = [string, string, string];
type SliderJob = {
  kind: "slider"; title: string; brief: string; unit: string; subject: string; target: number; tol: number; verdicts: Verdicts;
  /** slider moves the opposite way */ inverted?: boolean;
  /** slider creeps on its own */ drift?: number;
  /** client changes their mind once you get close */ changeTo?: { target: number; note: string };
  look: "rotate" | "shrink" | "fade" | "wobble" | "grow";
};
type TapJob = { kind: "tap"; title: string; brief: string; items: string[]; odd: number[]; shuffle?: boolean; verdicts: Verdicts };
type HoldJob = { kind: "hold"; title: string; brief: string; subject: string; button: string; target: number; tol: number; verdicts: Verdicts };
type ChaseJob = { kind: "chase"; title: string; brief: string; subject: string; dodges: number; verdicts: Verdicts };
type CardJob = { kind: "card"; title: string; brief: string; prompt: string; verdicts: Verdicts };
type Job = SliderJob | TapJob | HoldJob | ChaseJob | CardJob;

const JOBS: Job[] = [
  { kind: "slider", look: "fade", title: "Make the ghost less obvious", brief: "He's haunting a job interview tomorrow. Tone him down, but not so much he's not there.", unit: "% ghost", subject: "ghost", target: 22, tol: 5, verdicts: ["He got the job. HR is uneasy.", "He's slightly too there. Someone screamed.", "He's either fully visible or fully gone. Both are illegal."] },
  { kind: "tap", title: "Remove the spies from the egg carton", brief: "Four of these eggs are wearing disguises. You know which.", shuffle: true, items: ["egg", "egg", "egg, allegedly", "egg", "egg", "egg", "not a spy", "egg", "egg", "egg", "egg", "egg, allegedly", "egg", "egg", "classified", "egg"], odd: [2, 6, 11, 14], verdicts: ["The carton is secure. The hens thank you.", "One spy remains. He's laying low.", "You threw out an innocent egg. It had a family."] },
  { kind: "card", title: "Client feedback round", brief: "Finish the client's email. Two other contractors are also pitching.", prompt: "Love it! Could you just make it a bit more ____?", verdicts: ["The client chose you. They're weeping into a stapler.", "", "The client went with someone else. Ouch."] },
  { kind: "hold", title: "Iron the cloud", brief: "It's going to a wedding. Hold to iron. Too long and it rains on the bride.", subject: "cloud", button: "Hold to iron", target: 2.4, tol: 0.4, verdicts: ["A crisp, flat cloud. Guests weep.", "Still a bit fluffy at the edges.", "It's raining indoors. Somehow."] },
  { kind: "slider", look: "rotate", inverted: true, title: "Straighten the lighthouse", brief: "Ships keep asking it for directions. This slider was installed backwards. Sorry.", unit: "°", subject: "lighthouse", target: 50, tol: 4, verdicts: ["Ships salute. One ship proposes.", "One ship is still suspicious.", "You've invented a new kind of lighthouse."] },
  { kind: "chase", title: "Centre the moon", brief: "It's for a calendar. The moon does not want to be in the calendar.", subject: "moon", dodges: 6, verdicts: ["Captured. The moon signs the release form.", "Caught it, eventually. It's sulking.", ""] },
  { kind: "card", title: "Emergency revision", brief: "The client called at 3am. Choose your excuse.", prompt: "Sorry for the delay, I was busy ____.", verdicts: ["Accepted. The client is now worried about you, in a nice way.", "", "The client believed the other excuse instead."] },
  { kind: "slider", look: "grow", drift: 0.6, changeTo: { target: 12, note: "Client: \"Actually, smaller. Much smaller. Like a sad meatball.\"" }, title: "Inflate the pufferfish", brief: "Client wants him 'more confident'. The slider keeps sliding. Hold your nerve.", unit: "puffs", subject: "pufferfish", target: 80, tol: 6, verdicts: ["Exactly as confident as a fish should be.", "He's mildly over-confident now.", "The fish has left the building. Via the ceiling."] },
  { kind: "tap", title: "Shave the kiwi", brief: "It's a kiwi. The fruit. Please don't shave the bird. Pick only the fruit.", items: ["kiwi fruit", "kiwi bird", "kiwi fruit", "kiwi fruit", "small bird", "kiwi fruit", "another bird", "kiwi fruit", "kiwi fruit", "kiwi bird", "kiwi fruit", "kiwi fruit"], odd: [0, 2, 3, 5, 7, 8, 10, 11], verdicts: ["Eight bald kiwis. Cold, but grateful.", "Some fruit still have their winter coats.", "You shaved a bird. It's wearing a scarf now and will not discuss it."] },
  { kind: "slider", look: "wobble", title: "Tune the rooster", brief: "He's crowing a semitone flat and refuses to admit it.", unit: "Hz", subject: "rooster", target: 37, tol: 5, verdicts: ["The sun rises right on cue.", "The sun rises… eventually.", "The sun has decided to sleep in."] },
  { kind: "hold", title: "Defrost the woolly mammoth", brief: "Museum wants him 'awake-ish'. Hold to defrost. Stop before he's fully awake and hungry.", subject: "mammoth", button: "Hold the hairdryer", target: 3.2, tol: 0.5, verdicts: ["He blinks once. Ticket sales triple.", "He's still mostly a fridge.", "He's awake. He's eaten the gift shop."] },
  { kind: "card", title: "The final brief", brief: "Last pitch of the day. Pick the one that gets you paid.", prompt: "We'll know it's finished when it has ____.", verdicts: ["Approved. You'll be paid in exposure and one duck.", "", "Rejected. The raccoon got the contract again."] },
  { kind: "slider", look: "shrink", title: "Trim the hedge", brief: "The client asked for 'a bit less hedge, but more hedge-y'.", unit: "cm", subject: "hedge", target: 28, tol: 5, verdicts: ["Perfect. The neighbours are furious.", "It's… a hedge-adjacent shape.", "You've made a stump. The client says it's art."] },
];

function grade(err: number, tol: number) {
  if (err <= tol) return 0;
  if (err <= tol * 3) return 1;
  return 2;
}

const RANKS: [number, string][] = [
  [800, "Supreme Overseer of Unrequested Edits"],
  [550, "Licensed Cloud Ironer"],
  [300, "Moon Wrangler (Probationary)"],
  [120, "Intern Who Touched The Mammoth"],
  [0, "Person Who Was Asked To Leave"],
];

function shuffled<T>(arr: T[]) {
  return arr.map((v, i) => ({ v, i, k: Math.random() })).sort((a, b) => a.k - b.k);
}

export function OddJobs() {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState<{ g: number; pts: number; note?: string | undefined } | null>(null);
  const done = round >= JOBS.length;
  const job: Job | null = done ? null : (JOBS[round] ?? null);

  const finish = (g: number, note?: string) => {
    const pts = [100, 40, 0][g] ?? 0;
    setScore((s) => s + pts);
    setResult({ g, pts, note });
  };

  const rank = RANKS.find(([min]) => score >= min)?.[1] ?? "";

  return (
    <main className="odd-jobs min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-6 py-8 sm:px-10 sm:py-12">
        <header className="mb-10 flex items-baseline justify-between gap-4 border-b border-border pb-5">
          <h1 className="font-display text-4xl leading-none sm:text-5xl">Odd Jobs</h1>
          <p className="text-sm text-muted-foreground">Edits nobody asked for.</p>
        </header>

        <section className="flex-1">
          {job && (
            <div className="py-2">
              <div className="flex items-center justify-between text-xs font-bold uppercase text-muted-foreground">
                <span>Job {round + 1} of {JOBS.length}</span><span>{score} pts</span>
              </div>
              <h2 className="mt-5 font-display text-4xl leading-tight sm:text-5xl">{job.title}</h2>
              <p className="mt-3 max-w-lg text-base leading-relaxed text-muted-foreground">{job.brief}</p>

              <div key={round}>
                {job.kind === "slider" && <Slider job={job} locked={!!result} onDone={finish} />}
                {job.kind === "tap" && <Tap job={job} locked={!!result} onDone={finish} />}
                {job.kind === "hold" && <Hold job={job} locked={!!result} onDone={finish} />}
                {job.kind === "chase" && <Chase job={job} locked={!!result} onDone={finish} />}
                {job.kind === "card" && <Cards job={job} locked={!!result} onDone={finish} />}
              </div>

              {result && (
                <div role="status" className="mt-8 border-t border-border py-5 text-foreground">
                  <p className="font-display text-2xl">+{result.pts}</p>
                  <p>{result.note ?? job.verdicts[result.g]}</p>
                  <Button type="button" onClick={() => { setResult(null); setRound((r) => r + 1); }} className="mt-4 rounded-none bg-foreground px-5 py-3 text-background">Next job</Button>
                </div>
              )}
            </div>
          )}

          {done && (
            <div className="py-12 text-center">
              <p className="text-sm font-bold uppercase text-muted-foreground">Shift over</p>
              <p className="mt-2 font-display text-7xl">{score}</p>
              <p className="mt-1 text-lg font-semibold">{rank}</p>
              <p className="mt-2 text-sm text-muted-foreground">Your pay is one (1) slightly ironed cloud.</p>
              <Button type="button" onClick={() => { setScore(0); setRound(0); }} className="mt-5 rounded-none bg-primary px-6 py-3 font-bold text-primary-foreground">Clock in again</Button>
            </div>
          )}
        </section>

        <footer className="mt-10 text-center">
          <Link to="/auth" aria-label="Staff" className="text-xs text-muted-foreground/40 hover:text-muted-foreground">·</Link>
        </footer>
      </div>
    </main>
  );
}

type Props<J> = { job: J; locked: boolean; onDone: (g: number, note?: string) => void };

function SubmitBtn({ onClick, children = "Submit edit" }: { onClick: () => void; children?: string }) {
  return <Button type="button" onClick={onClick} className="mt-6 h-12 w-full rounded-none bg-foreground px-5 py-3 text-background hover:bg-foreground/90">{children}</Button>;
}

function Slider({ job, locked, onDone }: Props<SliderJob>) {
  const [value, setValue] = useState(job.inverted ? 100 : 0);
  const [target, setTarget] = useState(job.target);
  const [note, setNote] = useState<string | null>(null);
  const changed = useRef(false);

  useEffect(() => {
    if (!job.drift || locked) return;
    const id = setInterval(() => setValue((v) => Math.min(100, v + (job.drift ?? 0))), 60);
    return () => clearInterval(id);
  }, [job.drift, locked]);

  useEffect(() => {
    if (!job.changeTo || changed.current || locked) return;
    if (Math.abs(value - target) <= job.tol * 1.5) {
      changed.current = true;
      setTarget(job.changeTo.target);
      setNote(job.changeTo.note);
    }
  }, [value, target, job, locked]);

  const v = Math.round(value);
  const off = v - target;
  const style: CSSProperties =
    job.look === "rotate" ? { transform: `rotate(${off * 0.9}deg)` }
    : job.look === "shrink" ? { transform: `scale(${1.6 - v / 100})` }
    : job.look === "grow" ? { transform: `scale(${0.4 + v / 45})` }
    : job.look === "fade" ? { opacity: v / 100 }
    : { transform: `rotate(${Math.sin(v) * Math.min(30, Math.abs(off))}deg) translateY(${Math.min(20, Math.abs(off) / 2)}px)` };

  return (
    <div className="mt-6">
      {note && <p className="mb-2 border-l-2 border-foreground pl-3 text-sm text-foreground">{note}</p>}
      <div className="flex h-52 items-center justify-center overflow-hidden font-display text-5xl sm:text-6xl" aria-hidden>
        <span style={style} className="transition-[transform,opacity] duration-150">{job.subject}</span>
      </div>
      <input type="range" min={0} max={100} step={1} value={job.inverted ? 100 - v : v} disabled={locked}
        onChange={(e) => { const n = Number(e.target.value); setValue(job.inverted ? 100 - n : n); }}
        aria-label={job.title} className="w-full accent-[var(--color-primary)]" />
      <p className="mt-1 text-center text-sm font-semibold">{v} {job.unit}</p>
      {!locked && <SubmitBtn onClick={() => onDone(grade(Math.abs(v - target), job.tol))} />}
    </div>
  );
}

function Tap({ job, locked, onDone }: Props<TapJob>) {
  const [order] = useState(() => (job.shuffle ? shuffled(job.items) : job.items.map((v, i) => ({ v, i, k: 0 }))));
  const [picked, setPicked] = useState<number[]>([]);
  const cols = "grid-cols-4";
  return (
    <div className="mt-6">
      <div className={`grid ${cols} gap-2`}>
        {order.map(({ v, i }) => {
          const on = picked.includes(i);
          return (
            <Button key={i} type="button" disabled={locked} aria-pressed={on}
              onClick={() => setPicked((p) => (on ? p.filter((x) => x !== i) : [...p, i]))}
              variant="ghost" className={`h-16 min-w-0 whitespace-normal rounded-none border-b text-sm transition active:scale-95 ${on ? "border-border bg-muted text-muted-foreground line-through" : "border-border bg-background"}`}>{v}</Button>
          );
        })}
      </div>
      {!locked && <SubmitBtn onClick={() => {
        const wrong = picked.filter((p) => !job.odd.includes(p)).length;
        const missed = job.odd.filter((o) => !picked.includes(o)).length;
        onDone(wrong > 0 ? 2 : missed > 0 ? 1 : 0);
      }} />}
    </div>
  );
}

function Hold({ job, locked, onDone }: Props<HoldJob>) {
  const [t, setT] = useState(0);
  const start = useRef<number | null>(null);
  const raf = useRef(0);
  const tick = () => { if (start.current != null) { setT((performance.now() - start.current) / 1000); raf.current = requestAnimationFrame(tick); } };
  const down = () => { if (locked || start.current != null) return; start.current = performance.now(); raf.current = requestAnimationFrame(tick); };
  const up = () => {
    if (start.current == null) return;
    cancelAnimationFrame(raf.current);
    const secs = (performance.now() - start.current) / 1000;
    start.current = null; setT(secs);
    onDone(grade(Math.abs(secs - job.target), job.tol));
  };
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  const over = t > job.target + job.tol;
  const p = Math.min(1, t / job.target);
  return (
    <div className="mt-6">
      <div className="relative flex h-52 items-center justify-center overflow-hidden font-display text-5xl sm:text-6xl" aria-hidden>
        <span style={{ transform: `scaleY(${1 - p * 0.55}) scaleX(${1 + p * 0.35})` }}>{job.subject}</span>
        {over && <span className="absolute bottom-0 text-base text-muted-foreground">rain. rain. rain.</span>}
      </div>
      <p className="text-center text-sm font-semibold">{t.toFixed(1)} s</p>
      {!locked && (
        <Button type="button" onPointerDown={down} onPointerUp={up} onPointerLeave={up}
          onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); down(); } }}
          onKeyUp={(e) => { if (e.key === " " || e.key === "Enter") up(); }}
          className="mt-4 h-12 w-full touch-none select-none rounded-none bg-foreground px-5 py-3 text-background hover:bg-foreground/90 active:scale-[0.99]">{job.button}</Button>
      )}
    </div>
  );
}

const TAUNTS = ["No.", "Absolutely not.", "I have a cold.", "Not my good side.", "Ask my agent.", "Fine. FINE."];

function Chase({ job, locked, onDone }: Props<ChaseJob>) {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [dodged, setDodged] = useState(0);
  const tired = dodged >= job.dodges;
  const flee = () => {
    if (locked || tired) return;
    setDodged((d) => d + 1);
    setPos({ x: 10 + Math.random() * 80, y: 10 + Math.random() * 80 });
  };
  return (
    <div className="mt-6">
      <div className="relative h-64 overflow-hidden border-y border-border">
        <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 border border-dashed border-muted-foreground" aria-hidden />
        <Button type="button" disabled={locked}
          onPointerEnter={(e) => { if (e.pointerType === "mouse") flee(); }}
          onClick={() => (tired ? onDone(dodged > job.dodges + 2 ? 1 : 0) : flee())}
          aria-label={tired ? "Catch the moon" : "Try to catch the moon"}
          style={{ left: `${tired ? 50 : pos.x}%`, top: `${tired ? 50 : pos.y}%` }}
          className="absolute h-12 -translate-x-1/2 -translate-y-1/2 rounded-none bg-transparent px-2 font-display text-3xl text-foreground shadow-none hover:bg-transparent transition-[left,top] duration-200">{job.subject}</Button>
        {dodged > 0 && !locked && <p className="absolute bottom-2 left-0 right-0 text-center text-sm text-muted-foreground">“{TAUNTS[Math.min(dodged - 1, TAUNTS.length - 1)]}”</p>}
      </div>
      {!locked && <Button type="button" onClick={() => onDone(1, "You gave up. The calendar now features a photo of a potato.")} className="mt-4 h-12 w-full rounded-none border border-border bg-transparent px-5 py-2 text-sm text-foreground shadow-none hover:bg-muted">Use a potato instead</Button>}
    </div>
  );
}

const ANSWERS = [
  "a horse who is a lawyer", "the confidence of a medium-sized goose", "Tuesday's leftover enthusiasm", "an emotional support baguette",
  "more beige", "a single, judgemental grape", "the energy of a jogging grandpa", "seventeen tiny hats", "a nap that never ends",
  "a strongly worded sandwich", "my cousin's karaoke trophy", "an owl doing taxes", "a feeling, but in a box", "slightly too many llamas",
  "a pigeon with a business plan", "the sound a fridge makes at night", "a sock that has seen things", "a motivational potato",
  "fifty percent more spoon", "a cloud that's been ironed", "a dramatic entrance by a snail", "the moon, but contractually obliged",
  "a polite volcano", "a wizard's lost receipt", "glitter, but emotionally",
];
const RIVALS = ["Gary from Accounts", "A Raccoon in a Blazer", "The Intern's Mum", "A Very Tall Pigeon", "Brenda (Freelance)"];
const JUDGE_LINES = ["The client squints at the cards.", "The client consults a magic eight ball.", "The client asks their cat.", "The client flips a biscuit."];

function pick<T>(arr: T[], n: number) { return shuffled(arr).slice(0, n).map((x) => x.v); }

function Cards({ job, locked, onDone }: Props<CardJob>) {
  const [hand] = useState(() => pick(ANSWERS, 5));
  const [rivals] = useState(() => pick(RIVALS, 2).map((name) => ({ name, card: pick(ANSWERS.filter((a) => !hand.includes(a)), 1)[0] ?? "a motivational potato" })));
  const [mine, setMine] = useState<string | null>(null);
  const [winner, setWinner] = useState<number | null>(null);
  const [judging, setJudging] = useState(false);
  const fill = (a: string | null) => job.prompt.replace("____", a ? `“${a}”` : "______");
  const play = () => {
    if (!mine) return;
    setJudging(true);
    setTimeout(() => {
      // Rigged slightly in your favour: the client likes you, mostly.
      const w = Math.random() < 0.55 ? 0 : 1 + Math.floor(Math.random() * 2);
      setWinner(w); setJudging(false);
      onDone(w === 0 ? 0 : 2, w === 0 ? undefined : `${rivals[w - 1]?.name ?? "The other contractor"} won with “${rivals[w - 1]?.card ?? "a motivational potato"}”. ${job.verdicts[2]}`);
    }, 1400);
  };
  const entries = [{ name: "You", card: mine ?? "" }, ...rivals];
  return (
    <div className="mt-6">
      <div className="border-l-2 border-foreground py-4 pl-5 text-foreground">
        <p className="font-display text-3xl leading-tight">{fill(mine)}</p>
      </div>
      {!judging && winner === null && !locked && (
        <>
          <div className="mt-5 flex flex-col">
            {hand.map((a) => (
              <Button key={a} variant="ghost" type="button" onClick={() => setMine(a)} aria-pressed={mine === a}
                className={`h-auto min-h-14 justify-start whitespace-normal rounded-none border-b px-3 py-3 text-left text-base transition ${mine === a ? "border-foreground bg-foreground text-background hover:bg-foreground/90" : "border-border bg-transparent text-foreground shadow-none hover:bg-muted"}`}>{a}</Button>
            ))}
          </div>
          <SubmitBtn onClick={play}>{mine ? "Play this card" : "Pick a card"}</SubmitBtn>
        </>
      )}
      {(judging || winner !== null) && (
        <div className="mt-5 space-y-2">
          {judging && <p className="animate-pulse text-center text-sm font-semibold">{JUDGE_LINES[Math.floor(Math.random() * JUDGE_LINES.length)]}</p>}
          {entries.map((e, i) => (
            <div key={e.name} className={`border-b border-border py-3 text-sm transition ${winner === i ? "border-foreground font-semibold" : "border-border bg-background"} ${winner !== null && winner !== i ? "opacity-50" : ""}`}>
              <span className="font-bold">{e.name}:</span> {e.card} {winner === i && "— accepted"}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
