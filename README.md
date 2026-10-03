# Neon Highway Rock — Suno Prompt Studio

Local bilingual generator that turns Neon Highway Rock creative rules into Suno-ready song packages:

- **Style of Music** — dense, musical prompt (BPM, key, progression, instruments, groove, production era)
- **Musical spec + arrangement map** — concrete decisions you can inspect or override
- Title + concept
- Full lyrics with section tags and production notes (`[Verse: …]`, `[Guitar Solo: …]`, etc.)
- Exclude Styles list (negations stay out of the positive style field)
- Checklist of applied rules with provenance (`documented` | `inferred` | `open`)
- **Reroll** — same brief, new song via `variant`

## Quick start

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

```bash
npm test      # generator / validation tests
npm run build # production build
```

## How to use with Suno

1. Fill the song brief (language, journey stage, setting, genre, intensity, vocals).
2. Optionally lock production era, song form, or tempo.
3. Click **Generate Suno package** (or **Reroll** for another draw of the same brief).
4. Paste into Suno Custom mode: Style of Music + Exclude Styles + Lyrics.

## Why packages stay distinct

Earlier versions reused one lyric skeleton and a prose-heavy style prompt, so Suno kept making the same song. v2.0.0 fixes that with:

- Independent seeded RNG streams per decision (`rng.ts`)
- A Musical Language / Production Bible (`music.ts`) — palettes, keys, grooves, eras, forms
- A written lyric corpus keyed by emotional family + language (`lyrics-bank.ts`)
- Style prompts built as concrete musical noun phrases, with no negations in the positive field

## Creative provenance

Rules live in `src/creative/schema.ts`, derived from the Notion corpus:

| Source | Role |
|--------|------|
| Philosophy Manifest / Banderas de Diseño / Creative DNA | Hard identity laws |
| Human Journey Atlas | Journey stages + golden questions |
| World Building / Experience Manifest | Settings, biomes, emotional tone |
| Musical Language / Production Bible (`music.ts`) | Inferred until Notion ratifies |

Only **documented** rules are hard validation constraints. Sonic defaults are **inferred**.

## Project layout

```
src/
  creative/
    schema.ts         # versioned creative rules
    music.ts          # instruments, harmony, groove, production, forms
    lyrics-bank.ts    # hand-written lyric blocks by family / language
    rng.ts            # deterministic seeded randomness
    generator.ts      # package builder
    validate.ts       # input + package validation
    history.ts        # localStorage history
    types.ts
  App.tsx             # studio UI
```
