# Beta Phase B — Location / Map Configuration

This document defines the Beta-ready map/location upgrade for Balta Vista Nathiagali.

## Current Status

The `/location` page now supports two modes:

1. **Live map mode** — if `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL` is set.
2. **Branded fallback mode** — if no live map URL is available yet.

The branded fallback remains intentionally designed and on-brand, while the live map can be enabled later without changing page layout.

## Environment Variable

```bash
NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL=
```

Use a Google Maps embed URL for the confirmed property location once available.

## Required Map Details Before Final Launch

- Exact property coordinates
- Confirmed arrival/parking point
- Correct public place label
- Road approach note from Islamabad/Rawalpindi
- Winter access advisory
- Nearby landmarks:
  - Dunga Gali pipeline walk
  - Mushkpuri approach
  - Ayubia National Park
  - Murree interchange

## Visual Direction

Google Maps embeds are limited in deep styling compared with custom JS maps. Until a full Maps JavaScript or Mapbox implementation is required, the live embed is wrapped in the Balta Vista design system:

- rounded card shell
- charcoal overlay panel
- brass location notes
- warm/earthy surrounding UI
- fallback branded route drawing if no URL is configured

## Future Upgrade Option

If deeper map styling becomes important in Beta or Final Product, switch to:

- Google Maps JavaScript API with custom JSON styling, or
- Mapbox with a custom earthy style

Do this only after exact location and production API keys are confirmed.

## QA Checklist

- `/location` renders with no env var.
- `/location` renders with `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL`.
- iframe has a descriptive title.
- page still contains text route guidance outside the iframe.
- map section does not introduce cold visual dominance.
- mobile layout does not overflow.
