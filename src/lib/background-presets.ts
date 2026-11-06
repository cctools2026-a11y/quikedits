import confetti from "@/assets/backgrounds/confetti.jpg";
import popArt from "@/assets/backgrounds/pop-art.jpg";
import playroom from "@/assets/backgrounds/playroom.jpg";

export const BACKGROUND_PRESETS = [
  { id: "confetti", name: "Confetti", src: confetti },
  { id: "pop-art", name: "Pop art", src: popArt },
  { id: "playroom", name: "Playroom", src: playroom },
] as const;