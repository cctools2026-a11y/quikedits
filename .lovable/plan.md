# Replace Odd Jobs with "The Button"

## What visitors get
The public homepage becomes one plain button and a deadpan narrator line. It's made of words and actions only, with no pictures or decorative frames.

- Every press changes the rules. For example: "Don't press it again." Then the button moves. Then it asks for a reason. Then it pretends to be off. Then it turns into two buttons, and only one is real.
- About 20 short stages, taking 1–2 minutes. The humour is dry and never crude.
- At the end the narrator gives up and offers a "start over" link.
- Phones: taps work, and dodging stages use tap timing instead of mouse movement.
- If reduced motion is turned on, stages that move the button use text tricks instead.

## Kept as is
- The private workspace, sign-in, the hidden old links, search settings and the licence/source link in the footer.

## Technical details
- New `src/components/game/TheButton.tsx`: a list of stages, each with narrator text and button behaviour. It reuses the shared Button and keeps the styles inside the `.odd-jobs` scope.
- `src/routes/index.tsx` renders it; update the page title and description (no mention of design).
- Remove `OddJobs.tsx`.
- Add a small unit test that stage progression ends at the final stage.
- Check it in the browser at phone and desktop sizes.
