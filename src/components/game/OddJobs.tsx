import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

type SliderJob = { kind: "slider"; title: string; brief: string; unit: string; emoji: string; target: number; tol: number; verdicts: [string, string, string] };
type TapJob = { kind: "tap"; title: string; brief: string; items: string[]; odd: number[]; verdicts: [string, string, string] };
type Job = SliderJob | TapJob;

const JOBS: Job[] = [
  { kind: "slider", title: "Re-season the soup", brief: "Grandma says it's 'almost right'. Add exactly enough salt.", unit: "pinches", emoji: "🍲", target: 63, tol: 6, verdicts: ["Grandma weeps with joy.", "Grandma nods. Politely.", "Grandma is calling your mother."] },
  { kind: "tap", title: "Edit the flock", brief: "Three of these birds are not birds. Remove them.", items: ["🐦", "🐦", "🥐", "🐦", "🐦", "🧦", "🐦", "🐦", "🐦", "🐦", "🪥", "🐦"], odd: [2, 5, 10], verdicts: ["The flock is pure again.", "Mostly birds. Mostly.", "You removed a real bird. It's filing a complaint."] },
  { kind: "slider", title: "Straighten the lighthouse", brief: "Ships are getting confused. Rotate it upright.", unit: "°", emoji: "🗼", target: 50, tol: 4, verdicts: ["Ships everywhere salute you.", "One ship is still suspicious.", "You've invented a new kind of lighthouse."] },
  { kind: "tap", title: "Proofread the garden", brief: "Pull the three weeds hiding among the tulips.", items: ["🌷", "🌷", "🌷", "🌿", "🌷", "🌷", "🌷", "🌷", "🌿", "🌷", "🌿", "🌷"], odd: [3, 8, 10], verdicts: ["The tulips applaud slowly.", "A weed survives. It's plotting.", "You pulled a tulip. The others saw."] },
  { kind: "slider", title: "Tune the rooster", brief: "He's crowing a semitone flat. Nudge his pitch.", unit: "Hz", emoji: "🐓", target: 37, tol: 5, verdicts: ["The sun rises right on cue.", "The sun rises… eventually.", "The sun has decided to sleep in."] },
  { kind: "slider", title: "Trim the hedge", brief: "The client asked for 'a bit less hedge'. Trim it.", unit: "cm", emoji: "🌳", target: 28, tol: 5, verdicts: ["A perfect hedge. Neighbours are jealous.", "It's… a hedge-adjacent shape.", "You've made a stump. The client says it's art."] },
];

function grade(err: number, tol: number) {
  if (err <= tol) return 0;
  if (err <= tol * 3) return 1;
  return 2;
}

export function OddJobs() {
  const order = useMemo(() => JOBS.map((_, i) => i), []);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState<{ g: number; pts: number } | null>(null);
  const [value, setValue] = useState(0);
  const [picked, setPicked] = useState<number[]>([]);
  const done = round >= order.length;
  const job = done ? null : JOBS[order[round]];

  useEffect(() => { setValue(0); setPicked([]); setResult(null); }, [round]);

  function submit() {
    if (!job) return;
    let g: number;
    if (job.kind === "slider") g = grade(Math.abs(value - job.target), job.tol);
    else {
      const wrong = picked.filter((p) => !job.odd.includes(p)).length;
      const missed = job.odd.filter((o) => !picked.includes(o)).length;
      g = wrong > 0 ? 2 : missed > 0 ? 1 : 0;
    }
    const pts = [100, 40, 0][g];
    setScore((s) => s + pts);
    setResult({ g, pts });
  }

  const rank = score >= 500 ? "Legendary Editor of Unrelated Things" : score >= 300 ? "Senior Odd-Jobber" : score >= 120 ? "Promising Intern" : "Enthusiastic Volunteer";

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-xl flex-col px-5 py-10">
        <header className="mb-8 text-center">
          <h1 className="font-display text-6xl leading-none sm:text-7xl">Odd Jobs</h1>
          <p className="mt-2 text-muted-foreground">Edits nobody asked for, in places design never goes.</p>
        </header>

        <section className="flex-1">
          {job && (
            <div className="rounded-[1.5rem] border-4 border-foreground bg-card p-6 shadow-float">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <span>Job {round + 1} of {order.length}</span><span>{score} pts</span>
              </div>
              <h2 className="mt-3 font-display text-4xl leading-none">{job.title}</h2>
              <p className="mt-2">{job.brief}</p>

              {job.kind === "slider" ? (
                <div className="mt-6">
                  <div className="flex h-36 items-center justify-center text-7xl" aria-hidden>
                    <span style={job.unit === "°" ? { transform: `rotate(${(value - job.target) * 0.9}deg)` } : job.unit === "cm" ? { transform: `scale(${1.6 - value / 100})` } : undefined} className="transition-transform">{job.emoji}</span>
                  </div>
                  <input type="range" min={0} max={100} value={value} disabled={!!result} onChange={(e) => setValue(Number(e.target.value))} aria-label={job.title} className="w-full accent-[var(--color-primary)]" />
                  <p className="mt-1 text-center text-sm font-semibold">{value} {job.unit}</p>
                </div>
              ) : (
                <div className="mt-6 grid grid-cols-4 gap-2">
                  {job.items.map((it, i) => {
                    const on = picked.includes(i);
                    return (
                      <button key={i} type="button" disabled={!!result} aria-pressed={on}
                        onClick={() => setPicked((p) => (on ? p.filter((x) => x !== i) : [...p, i]))}
                        className={`aspect-square rounded-xl border-2 text-3xl transition ${on ? "border-primary bg-primary/15 opacity-50" : "border-foreground bg-background"}`}>{it}</button>
                    );
                  })}
                </div>
              )}

              {result ? (
                <div className="mt-6 rounded-xl border-2 border-foreground bg-art-yellow p-4 text-foreground">
                  <p className="font-display text-2xl">+{result.pts}</p>
                  <p>{job.verdicts[result.g]}</p>
                  <button type="button" onClick={() => setRound((r) => r + 1)} className="mt-3 rounded-full bg-foreground px-5 py-2 font-bold text-background">Next job</button>
                </div>
              ) : (
                <button type="button" onClick={submit} className="mt-6 w-full rounded-full bg-primary px-5 py-3 font-bold text-primary-foreground">Submit edit</button>
              )}
            </div>
          )}

          {done && (
            <div className="rounded-[1.5rem] border-4 border-foreground bg-card p-6 text-center shadow-float">
              <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Shift over</p>
              <p className="mt-2 font-display text-7xl">{score}</p>
              <p className="mt-1 text-lg font-semibold">{rank}</p>
              <button type="button" onClick={() => { setScore(0); setRound(0); }} className="mt-5 rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground">Clock in again</button>
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
