# Beta Phase G — Cross-Browser / Device QA

Beta device QA has two layers:

1. Automated smoke checks that can run locally/CI.
2. Manual real-device checks that must be performed on actual browsers/devices.

## Automated Commands

```bash
npm run qa:static
npm run qa:runtime
npm run qa:beta
```

`qa:beta` runs:

- typecheck
- production build
- npm audit
- no-white guard
- static project QA
- production runtime route/API smoke test

## Automated Coverage

The automated scripts verify:

- required routes/files exist
- no deprecated `middleware.ts`
- no Framer Motion dependency
- old brand name is gone
- env docs are present
- public asset references exist
- production routes return 200
- `/api/booking` rejects invalid payloads
- `/api/booking` accepts valid payloads and returns `BV-` reference
- `/api/events` accepts valid first-party conversion events

## Manual Device Matrix

These still require real devices or BrowserStack/LambdaTest:

| Device / Browser | Priority | Checks |
|---|---:|---|
| iOS Safari | P0 | hero, nav, pinned rooms, booking form, date inputs, WhatsApp links |
| Android Chrome | P0 | hero, scroll, pinned rooms, booking form, performance |
| Desktop Chrome | P0 | full route smoke, motion, route transitions |
| Desktop Safari | P1 | sticky/pinned sections, clip-path reveals, date inputs |
| Firefox | P1 | layout, SVG maps, form controls |
| Edge | P2 | general layout and booking smoke |

## Manual QA Checklist

- Hero image is crisp and headline reveals after loader.
- Desktop nav indicator moves between links.
- Mobile menu opens full-screen and routes correctly.
- Rooms pinned section releases cleanly.
- Reduced motion mode shows all content without heavy animation.
- `/rooms` room-specific booking links preselect room on `/booking`.
- `/booking` submits valid inquiry and shows `BV-` reference.
- `/location` works with and without `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL`.
- WhatsApp links open correctly.
- Footer links route to sub-pages.
- No horizontal overflow on mobile.

## Current Status

Automated Beta QA scripts are implemented. Manual real-device QA remains pending until the team runs it on physical devices or a browser testing service.
