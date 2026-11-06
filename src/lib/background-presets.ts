import confetti from "@/assets/backgrounds/confetti.jpg";
import popArt from "@/assets/backgrounds/pop-art.jpg";
import playroom from "@/assets/backgrounds/playroom.jpg";
import beach from "@/assets/backgrounds/beach.jpg";
import city from "@/assets/backgrounds/city.jpg";
import mountains from "@/assets/backgrounds/mountains.jpg";
import balloons from "@/assets/backgrounds/balloons.jpg";
import office from "@/assets/backgrounds/office.jpg";

export const BACKGROUND_PRESETS = [
  { id: "confetti", name: "Confetti", src: confetti, colour: [128, 234, 178] },
  { id: "pop-art", name: "Pop art", src: popArt, colour: [252, 227, 14] },
  { id: "playroom", name: "Playroom", src: playroom, colour: [105, 205, 207] },
  { id: "beach", name: "Beach", src: beach, colour: [136, 196, 220] },
  { id: "city", name: "City street", src: city, colour: [185, 149, 115] },
  { id: "mountains", name: "Mountains", src: mountains, colour: [109, 146, 135] },
  { id: "balloons", name: "Balloons", src: balloons, colour: [229, 204, 169] },
  { id: "office", name: "Home office", src: office, colour: [189, 184, 172] },
] as const;