/** Printable page sizes at 300 dpi. */
export const PAGES = [
  { id: "a4", label: "A4", w: 2480, h: 3508 },
  { id: "letter", label: "US Letter", w: 2550, h: 3300 },
] as const;

/** Grid of equal cells on a page with a margin and gap; returns cell positions. */
export function gridOnPage(pw: number, ph: number, cell: number, margin: number, gap: number) {
  const cols = Math.max(1, Math.floor((pw - 2 * margin + gap) / (cell + gap)));
  const rows = Math.max(1, Math.floor((ph - 2 * margin + gap) / (cell + gap)));
  const ox = Math.round((pw - (cols * cell + (cols - 1) * gap)) / 2);
  const oy = Math.round((ph - (rows * cell + (rows - 1) * gap)) / 2);
  const cells: { x: number; y: number }[] = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) cells.push({ x: ox + c * (cell + gap), y: oy + r * (cell + gap) });
  return { cols, rows, cells };
}
