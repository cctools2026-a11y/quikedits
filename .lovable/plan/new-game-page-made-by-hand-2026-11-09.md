# New game page: "Made by Hand?"

A second public game at **quikedits.com/handmade**. The Button stays on the homepage. It's made of words and interactions only, with no pictures and no live AI. All lines are prewritten, so it's free, instant and private.

## How it plays (default: Spot the human)
- 12 rounds. Each round shows two short lines on the same topic, such as a shop sign, a birthday card, a weather forecast or a haiku about soup.
- One reads like a person wrote it: specific, a bit wobbly, oddly personal. The other is a machine's too-smooth version.
- Tap the one you think a person wrote. A dry one-line reveal follows, e.g. "The machine would never mention Gary."
- A rope of text characters (`HAND ●━━━━━━ MACHINE`) shifts toward whichever side is "winning" your guesses.
- At the end you get a score and a deadpan verdict, e.g. "You can tell a person from a vending machine. Mostly." Plus a "play again" button that shuffles the rounds.
- Humour stays silly and never crude, and nothing mentions design.

## Links between games
- A small "Another game" text link on each page points to the other.

## Technical details
- `src/lib/handmade-rounds.ts`: pure data plus shuffle/score helpers, with a unit test (score counts correct picks; 12 rounds per game).
- `src/components/game/MadeByHand.tsx`: reuses the shared Button inside the `.odd-jobs` scope.
- `src/routes/handmade.tsx`: its own head() title, description, og and twitter tags, and canonical.
- Add `/handmade` to the prerender pages in vite.config.ts and to the sitemap script, then regenerate the sitemap.
- Update the AGENTS.md rule "public site is only the game + /auth" to include `/handmade`.
- Browser check at phone and desktop sizes.
