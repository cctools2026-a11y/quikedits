# One look from top to bottom: "poster studio"

The whole page follows the top banner's style: bold Bebas headlines, photo cards with thick black outlines, tilted slightly, and big flat orange/yellow shapes. Like Affinity Studio, the photos carry the design, not boxes or panels. The glass panels, colour glows and icon tiles are removed.

```text
+--------------------------------------------------------------+
| TURN ANY PHOTO INTO A STICKER.        [ orange sun ]         |
| intro line                           +-----------+  tilted   |
| [ upload ]                           |  before / |  outlined |
| (Free forever) (Never uploaded) ...  |  after    |  card     |
|                                      +-----------+ [yellow]  |
+--------------------------------------------------------------+
| HOW IT WORKS                                                 |
|  +------+        +------+        +------+                    |
|  | photo|  --->  | photo|  --->  | photo|   three outlined   |
|  +------+        +------+        +------+   tilted mini      |
|  01 ADD YOUR PHOTO  02 ADD AN OUTLINE  03 DOWNLOAD          |
|  short line         short line         short line           |
+--------------------------------------------------------------+
| GREAT FOR   big Bebas words in a row, orange underline on    |
|             hover:  WHATSAPP  MEMES  PET STICKERS  PRINTS    |
+--------------------------------------------------------------+
| TIPS  [yellow block behind]                                  |
|  +-good photo--+  DO: ...        +-bad photo--+  AVOID: ...  |
|  | tilted card |                 | tilted card|              |
+--------------------------------------------------------------+
| FREE AND PRIVATE, FOR REAL   one huge Bebas line on an       |
| orange band, black text, no box                              |
+--------------------------------------------------------------+
| COMMON QUESTIONS   thick black rules, big + that turns       |
+--------------------------------------------------------------+
| MORE FREE TOOLS    existing pop-out photo cards, given the   |
|                    same thick outline + tilt as the banner   |
+--------------------------------------------------------------+
```

## What changes, section by section
- **How it works**: each step gets a small outlined photo card showing that stage of this tool (original → in progress → finished result), built from the photo already shown at the top. Dashed arrows connect them. Big orange numbers and Bebas step titles, with the existing descriptions underneath.
- **Great for**: large Bebas words in a row instead of chips. They stay plain text for now, so they can become links to presets later.
- **Tips**: one "good photo" and one "photo to avoid" card, each outlined and tilted, next to its list, with a yellow shape behind.
- **Free and private**: a full-width orange band with one big line of text.
- **Questions**: thick black dividers, Bebas questions, and the + turns into an x when open.
- **More tools**: the cards get the banner's thick outline and slight tilt.
- **Trust chips** under the upload box: the same thick black outline as the banner card.
- Sections fade in gently as you scroll; the cards straighten slightly when you hover over them.

## Technical details
- Remove the `glass`/`glow-orb` utilities and the glow layer from ToolLanding; add a shared `PosterCard` (border-4 border-foreground, rounded, shadow-float, --tilt) reused by ToolHero, steps, tips and ToolCard.
- Step images come from TOOL_MEDIA (before, a CSS half-split mid state, after), so no new assets are needed.
- Good/avoid tip images: before = TOOL_MEDIA before; avoid = the same photo zoomed out and blurred with CSS, with an X badge.
- Update the mem://design/landing-glass memory to record the "poster studio" direction and that glass was rejected.
- Check every tool page at desktop and phone sizes with Playwright.
