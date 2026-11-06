import confetti from "@/assets/backgrounds/confetti.jpg";
import popArt from "@/assets/backgrounds/pop-art.jpg";
import playroom from "@/assets/backgrounds/playroom.jpg";

export const BACKGROUND_PRESETS = [
  { id: "confetti", name: "Confetti", src: confetti, colour: [128, 234, 178] },
  { id: "pop-art", name: "Pop art", src: popArt, colour: [252, 227, 14] },
  { id: "playroom", name: "Playroom", src: playroom, colour: [105, 205, 207] },
] as const;