export type Behaviour = "plain" | "dodge" | "off" | "two" | "hold" | "reason" | "wait" | "tiny" | "shy" | "many";

export interface Stage {
  say: string;
  label: string;
  kind: Behaviour;
}

export const STAGES: Stage[] = [
  { say: "This is a button.", label: "Press", kind: "plain" },
  { say: "You pressed it. Fine. Please don't press it again.", label: "Press", kind: "plain" },
  { say: "That was again. I'm moving it.", label: "Catch me", kind: "dodge" },
  { say: "The button is now off.", label: "Off", kind: "off" },
  { say: "It was not off. Now there are two. One is real.", label: "Press", kind: "two" },
  { say: "Please give a reason for pressing.", label: "Submit reason", kind: "reason" },
  { say: "Your reason has been filed under 'sure'. Press and hold to continue.", label: "Hold", kind: "hold" },
  { say: "The button is on a short break.", label: "Back soon", kind: "wait" },
  { say: "Budget cuts.", label: "ok", kind: "tiny" },
  { say: "This one is shy. Approach slowly.", label: "Hello", kind: "shy" },
  { say: "We hired more buttons. Only one of them is working today.", label: "Press", kind: "many" },
  { say: "Every press is now logged. Nobody reads the log.", label: "Press", kind: "plain" },
  { say: "Please wait. The button is thinking about what it has done.", label: "Thinking", kind: "wait" },
  { say: "It's moving again, mostly out of habit.", label: "Still here", kind: "dodge" },
  { say: "The button would like a written explanation.", label: "Explain", kind: "reason" },
  { say: "This press is a long one.", label: "Hold longer", kind: "hold" },
  { say: "The button is off. Honestly this time.", label: "Off (really)", kind: "off" },
  { say: "Two buttons. The other one is real. Probably.", label: "Press", kind: "two" },
  { say: "Last one. I mean it.", label: "Press", kind: "plain" },
  { say: "I have nothing left to say. You win a button.", label: "Start over", kind: "plain" },
];

export const nextStage = (i: number) => Math.min(i + 1, STAGES.length - 1);
export const isLast = (i: number) => i >= STAGES.length - 1;
