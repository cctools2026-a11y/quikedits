# Plan: photo rules, upload tips and "this didn't work well" cues

Your screenshot shows the problem: the tool kept only part of a patterned shirt plus some faint specks, and the page still offered it as a finished result. People need to know beforehand what photos work, a warning when the result looks wrong, and a way to fix it.

## 1. What photos each tool accepts

| Tool | Works best with | Won't work well |
|---|---|---|
| Remove background | One clear person, pet or object | Crowds, scenery, screenshots, text |
| Colour background | Person or object, in focus | Busy group shots |
| Product photos | One product, filling most of the frame | Several items scattered, see-through glass |
| Passport photo | One face, front-on, head and shoulders, even light | Side views, sunglasses, hats, groups, children's faces in a crowd |
| Profile picture | One head-and-shoulders photo | Full-body or far-away shots |
| Sticker maker | Close-up of one person, pet or object | Wide scenes |
| Photo background | One person or object, plus a separate backdrop photo | Group shots, scenery as the subject |
| Logo & signature | Dark ink or logo on a plain, even background | Photos of people, patterned paper |

Hard rules everywhere (already in place): JPG, PNG or WebP, up to 25 MB. New soft rule: photos smaller than about 300 px on the short side get a warning that the result may look blurry.

## 2. Tips before upload
- A small row of 3 picture tips right under the upload box on each tool page, using simple "Good / Avoid" cards: e.g. Passport: "Face the camera", "Plain light behind you", "No shadows on your face".
- The short promise under the heading adds what the tool expects ("Best with one person, head and shoulders").

## 3. Automatic checks after processing
After the background is removed, the app looks at what was kept and shows a friendly message above the result when something looks off:

- **Almost nothing kept** (under about 3% of the photo): "We couldn't find a clear subject. Try a photo where the person or object stands out from the background."
- **Almost everything kept** (over about 90%): "The background looks too similar to the subject, so little was removed. Try a plainer background."
- **Bits scattered around** (several separate pieces, like the specks in your screenshot): "We found a few stray bits. Tap 'Clean up stray bits' to keep only the main subject." One tap keeps only the biggest piece.
- **Subject cut off at the edge** (passport, profile): "Your head looks cut off at the top. Use a photo with space above your head."
- **Logo cleaner**: if the corners aren't one even colour: "The background isn't plain, so some of it may remain. Try a photo on white paper."
- **Small photo**: "This photo is small, so the result may look soft."

Each message has two buttons: **Fix it** (opens the touch-up tool below) and **Try another photo**. The download stays available; the message never blocks it.

## 4. Touch-up: mark what to keep and what to remove
A simple brush tool on the result, for every AI tool:
- Two brushes: **Keep** (green) paints back parts that were wrongly removed, **Remove** (red) erases leftover background.
- Brush size slider, Undo, and Reset.
- Works with finger or mouse; zoom by pinching or with + / − buttons.
- The finished result and download update straight away.
- A one-line hint: "Paint green on anything that should stay, red on anything that should go."

## 5. What I'll check
- Run your screenshot-style case (patterned shirt, stray bits) and confirm the warning and "Clean up stray bits" appear.
- Confirm each warning shows on a sample photo built to trigger it, and nothing shows on a good photo.

## Technical details
- `src/lib/photo-rules.ts`: per-tool `accepts`, `avoid`, tips, and thresholds; pure `analyseCutout(alpha, w, h)` returning coverage %, number of connected pieces, largest-piece share, and edge-touch flags (top/left/right). Unit tests with small synthetic masks for each rule.
- `keepLargest(canvas)`: connected-component pass (flood fill on downscaled alpha) to drop small islands.
- `src/components/PhotoTips.tsx` (before upload) and `src/components/CutoutCues.tsx` (after), plugged into `ToolPage` and the home and colour background pages.
- `src/components/TouchUp.tsx`: canvas brush over the cutout; "keep" restores pixels from the original image, "remove" zeros alpha; updates the item's cutout so every tool's composite re-renders.
- Logo cleaner check reuses the corner sampling it already does (corner colour spread above a threshold).
- No servers, all on the device.
