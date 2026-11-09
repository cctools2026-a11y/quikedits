export interface Round {
  topic: string;
  human: string;
  machine: string;
  reveal: string;
}

export const ROUNDS: Round[] = [
  { topic: "Shop sign", human: "Back in 10 mins. Gone to find Gary.", machine: "We are temporarily unavailable. Thank you for your patience.", reveal: "A machine would never mention Gary." },
  { topic: "Birthday card", human: "Happy 40th. You still owe me a sandwich from 1998.", machine: "Wishing you joy, laughter and success on your special day.", reveal: "The machine has never been owed a sandwich." },
  { topic: "Weather forecast", human: "Rain later. Bring the good umbrella, not the one that flips.", machine: "Expect scattered showers with mild temperatures throughout the afternoon.", reveal: "Only people own a bad umbrella on purpose." },
  { topic: "Haiku about soup", human: "Soup too hot to eat / I blow on it like a fool / now my glasses fog", machine: "Warm golden broth flows / nourishing body and soul / comfort in a bowl", reveal: "Nobody's soul has ever been nourished by a haiku." },
  { topic: "Lost cat poster", human: "LOST: Biscuit. Answers to nothing. Will come for ham.", machine: "Missing cat. Friendly and well-loved. Please contact us if found.", reveal: "The ham was the giveaway." },
  { topic: "Restaurant review", human: "Chips were great. Waiter called me 'boss' four times. I'm not his boss.", machine: "A delightful dining experience with attentive service and flavourful dishes.", reveal: "The machine has never been called boss." },
  { topic: "Fridge note", human: "Whoever ate my yoghurt: I know. I've always known.", machine: "Please respect others' food items in the shared refrigerator.", reveal: "That is the voice of real yoghurt grief." },
  { topic: "Out-of-office reply", human: "I'm on a beach. If it's urgent, it probably isn't.", machine: "I am currently out of the office with limited access to email.", reveal: "The machine is never on a beach." },
  { topic: "Plant care tip", human: "Water it on Sundays. Talk to it if you're lonely. It won't answer.", machine: "Water weekly and place in bright, indirect sunlight for best results.", reveal: "Machines don't admit to talking to plants." },
  { topic: "Wedding toast", human: "They met at a bus stop. The bus never came. Neither did I, apparently.", machine: "Here's to a lifetime of love, partnership and shared adventures.", reveal: "The machine has never missed a bus." },
  { topic: "Product review", human: "Kettle works. Boils water. Not sure what else I expected. Four stars.", machine: "This kettle exceeded my expectations with its sleek design and rapid boiling.", reveal: "Real people dock a star for no reason." },
  { topic: "Apology text", human: "Sorry I'm late. The duck wouldn't move.", machine: "I apologise for the delay and appreciate your understanding.", reveal: "The duck is always real." },
  { topic: "Motivational quote", human: "Do one thing today. Two if one was a nap.", machine: "Every day is a new opportunity to become your best self.", reveal: "The machine does not nap." },
  { topic: "School report", human: "Tries hard. Talks to the class goldfish more than to the class.", machine: "Shows consistent effort and is developing strong collaborative skills.", reveal: "The goldfish could not be reached for comment." },
];

export const ROUNDS_PER_GAME = 12;

export function shuffle<T>(arr: T[], rand: () => number = Math.random): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

export const pickRounds = (rand: () => number = Math.random) => shuffle(ROUNDS, rand).slice(0, ROUNDS_PER_GAME);

export const score = (picks: boolean[]) => picks.filter(Boolean).length;

export function verdict(s: number): string {
  if (s >= 11) return "Flawless. You can smell a template from across the room.";
  if (s >= 8) return "You can tell a person from a vending machine. Mostly.";
  if (s >= 5) return "Half human, half toaster. A fair mix.";
  return "The machines thank you for your support.";
}
