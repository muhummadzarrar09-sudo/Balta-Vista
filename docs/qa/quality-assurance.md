# Post-Phase QA / Handoff Pass

This pass adds production-adjacent finishing touches after the 10 planned build phases.

## Added

- Branded `not-found` page.
- Branded route-level `error` page.
- Branded `loading` fallback.
- Keyboard skip link.
- Stronger focus-visible styles for links, buttons, inputs, textarea, and selects.
- Reviews page metadata.
- No-pure-white guard script.

## Validation commands

```bash
npm run typecheck
npm run build
npm run audit
npm run guard:no-white
```

Or all together:

```bash
npm run check
```

## Manual QA checklist

- Hero headline remains the only focal hero message.
- Header hides on scroll down and reveals on scroll up.
- Desktop chapter rail updates across sections.
- Mobile menu opens full screen and closes after navigation.
- Pinned rooms section enters, scrubs, and releases cleanly.
- Room progress bars jump to the intended room state.
- Booking flow validates dates, room selection, details, and confirmation.
- Booking endpoint returns a reference and never echoes personal data.
- FAQ accordion opens without layout jank.
- Location route line draws on scroll.
- `/reviews` route loads and links back.
- Bad route displays branded 404.
- Keyboard focus is visible.
- Reduced-motion users do not get excessive animation.
- No pure white utility/color appears in app code.
