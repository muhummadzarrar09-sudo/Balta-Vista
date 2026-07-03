# Beta Phase A — Asset Replacement Manifest

This document defines the first real-asset replacement round for Balta Vista Nathiagali. The current site has art-directed generated placeholders. Beta begins when client-supplied drone footage, photography, Blender renders, or approved architectural visuals replace the most visible placeholders.

## Replacement Principle

Do not redesign the site around random new images. Replace assets into the existing visual system:

- warm charcoal / pine / brass grade
- no cold corporate blue treatment
- no overexposed whites
- cinematic but believable
- Nathiagali-specific terrain, pine forest, mist, ridge roads, winter/green season atmosphere
- architecture should feel like a luxury hill hotel, not a fantasy mansion

## Priority Replacement Order

### P0 — Hero Exterior / Drone / Render

**Current path**

```txt
public/assets/hero/luxury-hero-nathiagali.png
```

**Recommended replacement**

- Drone still or video poster frame
- Wide exterior architectural render
- Evening or early morning light
- Pine valley context visible
- Hotel should look hospitality-scale, not private palace-scale

**Target dimensions**

```txt
Minimum: 2800px wide
Ideal: 3840px wide
Aspect: 16:9 or wider
```

**Acceptance criteria**

- Text can sit over it with strong contrast
- Building is visible but not screaming
- Feels plausible for Nathiagali/KPK
- Warm window light or atmospheric depth

---

### P1 — Signature Suite

**Current path**

```txt
public/assets/rooms/room-suite-luxury.png
```

**Recommended replacement**

- Real suite photo or Blender interior render
- Strong valley/pine view
- Warm lamps, stone, timber, textiles
- Lounge area visible

**Target dimensions**

```txt
Minimum: 2200px wide
Aspect: 4:3 or 3:2
```

**Acceptance criteria**

- Justifies highest room tier
- Looks less generic than a stock hotel room
- No visual clutter or fake luxury props

---

### P2 — Double Bedroom

**Current path**

```txt
public/assets/rooms/room-double-luxury.png
```

**Recommended replacement**

- Two-bed or family-capable room
- Warm, premium, not cramped
- Window/view cue if possible

**Target dimensions**

```txt
Minimum: 2200px wide
Aspect: 4:3 or 3:2
```

---

### P3 — Single Bedroom

**Current path**

```txt
public/assets/rooms/room-single-luxury.png
```

**Recommended replacement**

- Quiet room with strong bed/window composition
- Useful for solo/short stay positioning

**Target dimensions**

```txt
Minimum: 2200px wide
Aspect: 4:3 or 3:2
```

---

### P4 — Seasonal Experience Images

**Current paths**

```txt
public/assets/experience/experience-snowfall-nathiagali.png
public/assets/experience/experience-trails-nathiagali.png
public/assets/experience/experience-bonfire-nathiagali.png
```

**Recommended replacement**

- Snowfall: exterior/lodge/winter arrival, warm interior glow
- Trails: actual Nathiagali/Dunga Gali/Ayubia style forest atmosphere
- Bonfire: terrace, lanterns, blankets, hospitality setting

**Target dimensions**

```txt
Minimum: 2600px wide
Aspect: 16:9
```

---

### P5 — Owner / Story Image

**Current path**

```txt
public/assets/story/owner-lounge-placeholder.png
```

**Recommended replacement**

- Founder portrait, family portrait, or real lounge/lobby image
- Should feel sincere, not corporate headshot

**Target dimensions**

```txt
Minimum: 1600px tall
Aspect: 4:5 or portrait
```

---

## Optional Video Upgrade

The hero is structurally ready for future drone/video work, but Beta A should first secure a strong still/poster frame.

If video is supplied later:

```txt
public/assets/hero/balta-vista-hero-drone.mp4
public/assets/hero/balta-vista-hero-poster.jpg
```

Rules:

- muted by default
- no autoplay sound
- poster fallback required
- keep hero message as the only focal text

## Asset Intake Workflow

1. Drop raw candidate assets into:

```txt
public/assets/_incoming/
```

2. Review against art direction and dimensions.
3. Crop/grade/export approved assets into the existing production paths above.
4. Keep filenames stable so app code does not need redesign.
5. Run:

```bash
npm run check
```

6. Visually QA:

- homepage hero
- `/rooms`
- `/experience`
- brochure cover and room pages
- OpenGraph image if needed

## Current Beta A Status

- Asset slots are defined.
- Replacement file paths are stable.
- Intake folders exist.
- The current generated images remain temporary until client assets arrive.

