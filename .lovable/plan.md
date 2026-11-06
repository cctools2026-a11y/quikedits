# Fix the passport example's messy "after" photo

The white-background result shows leftover grey smudges above her head and down the left side of her hair.

## What changes
- Re-run the teenager's photo through the site's own background remover, then clean it up: drop leftover patches above and beside the head, smooth the hair outline, and keep only her head and shoulders.
- Place the clean cutout on pure white at the same size and position, so the before/after slider still lines up.
- Check the result zoomed in at desktop and phone sizes, at every document size preset, with no grey marks left.
- If the edges still aren't clean, swap in a new portrait of the same Asian teenage girl with sleek hair against a plain wall, which cuts out cleanly.

## Technical details
- Replace the passport "after" asset referenced in `src/lib/tool-media.ts`. Clean-up steps: alpha threshold, keep the largest component, light erosion and feather on the hair edge, composite onto #FFFFFF.
