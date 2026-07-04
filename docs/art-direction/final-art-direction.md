# Finished Product Phase A — Final Art Direction

## Status

Art-direction readiness is complete. Actual final replacement remains pending real/client-approved hotel assets.

The current generated imagery is acceptable for prototype review, but the finished product must replace the most visible imagery with real photography, drone stills/video, Blender renders, or client-approved architectural visuals.

## Final Art Direction Goal

Balta Vista should feel like a believable luxury hill hotel in Nathiagali, not a fantasy chalet, generic resort, or AI mansion.

The finished visual system should feel:

- warm
- quiet
- architectural
- local to pine country and mountain weather
- hospitality-scale
- cinematic without looking unreal

## Non-Negotiables

- No cold corporate blue grading.
- No blown-out white skies or sterile interiors.
- No images that look like a private palace instead of a hotel.
- No fake guest/review imagery.
- No cluttered luxury props.
- No inconsistent color grading between pages.

## Final Replacement Slots

### Hero Exterior

Current:

```txt
public/assets/hero/luxury-hero-nathiagali.png
```

Final should be either:

- drone still / drone video poster
- exterior architectural render
- dusk or early morning exterior
- pine valley and ridge context visible

Minimum: `2600×1400`  
Ideal: `3840px` wide or larger

### Rooms

Current:

```txt
public/assets/rooms/room-suite-luxury.png
public/assets/rooms/room-double-luxury.png
public/assets/rooms/room-single-luxury.png
```

Final should show:

- real/proposed room geometry
- warm lighting
- stone/timber/sage/brass material language
- believable window views
- clear differentiation between room tiers

### Experience

Current:

```txt
public/assets/experience/experience-snowfall-nathiagali.png
public/assets/experience/experience-trails-nathiagali.png
public/assets/experience/experience-bonfire-nathiagali.png
```

Final should show:

- actual Nathiagali/Ayubia/Dunga Gali style landscape cues
- seasonal specificity
- hospitality mood, not generic travel stock

### Story / Owner

Current:

```txt
public/assets/story/owner-lounge-placeholder.png
```

Final should show one of:

- founder portrait
- family/story portrait
- actual lobby/lounge
- warm hosting detail shot

## Cropping Rules

- Hero must preserve safe text space.
- Rooms must crop well in 4:3 and large card layouts.
- Experience images must support both teaser cards and editorial spreads.
- Owner/story image must work in a tall vertical crop.

## Image QA Command

Run:

```bash
npm run qa:assets
```

This validates the current raster slots meet minimum technical dimensions. It does not judge art direction; human review is still required.

## Human Review Checklist

- Does the image feel believable for Nathiagali?
- Does the image support the Balta Vista brand palette?
- Does the image avoid cold/overexposed luxury clichés?
- Does it work with existing text overlays?
- Does it match the room/experience page crop?
- Does it make the site feel less generated?

## Next Step

When final assets arrive:

1. Drop raw files into `public/assets/_incoming/`.
2. Select/crop/grade into `public/assets/_approved/`.
3. Replace stable production paths.
4. Run `npm run qa:assets`.
5. Run `npm run qa:beta`.
6. Perform visual QA on homepage, rooms, experience, location, booking, reviews, and brochure.
