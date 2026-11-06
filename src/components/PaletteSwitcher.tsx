import { useEffect, useState } from "react";
import { Palette, X } from "lucide-react";

const PALETTES = [
  { id: "riso", name: "Riso bright", colors: ["#f6f0e4", "#ff3e8a", "#ffc928", "#3fa9ff", "#1d2a5c"] },
  { id: "candy", name: "Candy pop", colors: ["#fff8ec", "#ff5fa2", "#ffe234", "#2445e8", "#111111"] },
  { id: "sorbet", name: "Soft sorbet", colors: ["#fdf0ee", "#f6a5c0", "#fbe99a", "#a8cff0", "#4a3a5c"] },
  { id: "carnival", name: "Night carnival", colors: ["#1c1840", "#ff3d8b", "#ffd83a", "#3d7cff", "#f7f2e4"] },
  { id: "milk", name: "Milk & candy", colors: ["#fdfcf8", "#f7b9cf", "#fbf0b8", "#d4e6f6", "#2c3242"] },
  { id: "mint", name: "Fresh mint", colors: ["#f7fcf8", "#a6e3cf", "#f8f0b8", "#d3e8f2", "#2d4a50"] },
  { id: "cloud", name: "Lilac cloud", colors: ["#f9fafe", "#d2bdf0", "#f9eec4", "#cfdcf8", "#2f3654"] },
] as const;

const KEY = "qe-palette";

function apply(id: string) {
  if (id === "riso") document.documentElement.removeAttribute("data-palette");
  else document.documentElement.setAttribute("data-palette", id);
}

export function PaletteSwitcher() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("riso");

  useEffect(() => {
    const saved = localStorage.getItem(KEY);
    if (saved) { setCurrent(saved); apply(saved); }
  }, []);

  const choose = (id: string) => {
    setCurrent(id);
    apply(id);
    localStorage.setItem(KEY, id);
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {open ? (
        <div className="w-64 rounded-2xl border-4 border-foreground bg-card p-3 text-card-foreground shadow-xl">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-display text-xl tracking-wide">Palette</span>
            <button aria-label="Close palette switcher" onClick={() => setOpen(false)} className="rounded-full p-1 hover:bg-muted"><X className="size-4" /></button>
          </div>
          <ul className="space-y-1.5">
            {PALETTES.map((p) => (
              <li key={p.id}>
                <button
                  onClick={() => choose(p.id)}
                  aria-pressed={current === p.id}
                  className={`flex w-full items-center justify-between gap-2 rounded-xl border-2 px-2.5 py-2 text-left text-sm font-semibold ${current === p.id ? "border-foreground bg-primary text-primary-foreground" : "border-transparent hover:border-border"}`}
                >
                  <span>{p.name}</span>
                  <span className="flex">
                    {p.colors.map((c) => (
                      <span key={c} className="-ml-1 size-4 rounded-full border border-foreground/40" style={{ background: c }} />
                    ))}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-muted-foreground">Your choice is remembered on this device.</p>
        </div>
      ) : (
        <button onClick={() => setOpen(true)} aria-label="Change colour palette" className="flex items-center gap-2 rounded-full border-4 border-foreground bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-lg">
          <Palette className="size-4" /> Palette
        </button>
      )}
    </div>
  );
}
