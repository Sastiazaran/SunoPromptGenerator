# Neon Highway Rock — Suno Prompt Studio

Local bilingual generator that turns your Neon Highway Rock creative rules into Suno-ready song packages:

- **Style of Music** prompt
- Title + concept
- Full lyrics with `[Verse]` / `[Chorus]` / `[Bridge]` / `[Outro]`
- Negative / exclusion prompt
- Checklist of applied rules with provenance (`documented` | `inferred` | `open`)

## Quick start

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

```bash
npm test      # focused generator/validation tests
npm run build # production build
```

## How to use with Suno

1. Fill the song brief (language, journey stage, setting, genre, intensity, vocals).
2. Click **Generate Suno package**.
3. Use **Copy all for Suno** (or copy style / lyrics separately).
4. Paste into Suno Custom mode: style field + lyrics field.

## Creative provenance

Rules live in `src/creative/schema.ts`, derived from the Notion corpus:

| Source | Role |
|--------|------|
| Philosophy Manifest / Banderas de Diseño / Creative DNA | Hard identity laws |
| Human Journey Atlas | Journey stages + golden questions |
| World Building / Experience Manifest | Settings, biomes, emotional tone |
| Song Generation Engine | Notes incomplete layers (Musical Language, Production Bible) |

Only **documented** rules are hard validation constraints. Sonic BPM ranges and AOR/highway defaults are **inferred** until Musical Language / Production Bible are written.

## Notion companion

Under the **Neon Highway rock** hub, create/use the **Suno Prompt System** page (schema + templates + backlog) and the **Suno Track Log** database for generated packages.

## Project layout

```
src/
  creative/
    schema.ts       # versioned creative rules
    generator.ts    # deterministic package builder
    validate.ts     # input + package validation
    history.ts      # localStorage history
    types.ts
  App.tsx           # studio UI
```
