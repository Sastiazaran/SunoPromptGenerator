import {
  BANNED_CLICHES,
  CREATIVE_DNA,
  GENRE_EMPHASIS_LABELS,
  HARD_RULES,
  JOURNEY_STAGES,
  NORTH_STAR,
  SETTINGS,
  SONIC_DEFAULTS,
  STAGE_FAMILY,
  THREE_FLAGS,
  TONE,
  type Language,
} from './schema'
import {
  EXCLUDED_STYLES,
  FAMILY_HARMONY,
  FORM_PREFERENCE,
  GROOVE_FEELS,
  INSTRUMENT_PALETTES,
  KEY_POOLS,
  MIX_LAW,
  MUSIC_PROVENANCE,
  MUSIC_SOURCE,
  PRODUCTION_ERAS,
  PROGRESSIONS,
  SECTION_TAGS,
  SONG_FORMS,
  VOCAL_DELIVERY,
  type SongForm,
} from './music'
import { LYRIC_BANK, SEED_LINES, type FamilyBank } from './lyrics-bank'
import { Rng, hashString } from './rng'
import type {
  AppliedRule,
  ArrangementSection,
  MusicSpec,
  SongInput,
  SongPackage,
} from './types'
import { hasBlockingErrors, validateInput, validatePackage } from './validate'

/** Suno truncates long style fields; leaving headroom keeps the tail intact. */
const STYLE_BUDGET = 900

/** Short enough to leave prompt budget for instruments. The full TONE line is prose. */
const TONE_SHORT = 'luminous melancholy, hopeful forward motion'

function pickStage(id: SongInput['journeyStageId']) {
  const stage = JOURNEY_STAGES.find((s) => s.id === id)
  if (!stage) throw new Error(`Unknown journey stage: ${id}`)
  return stage
}

function pickSetting(id: SongInput['settingId']) {
  const setting = SETTINGS.find((s) => s.id === id)
  if (!setting) throw new Error(`Unknown setting: ${id}`)
  return setting
}

/**
 * Explicit field list rather than JSON.stringify, so the seed cannot drift
 * when a caller builds the object with its keys in a different order.
 */
function canonicalSeed(input: SongInput): string {
  return [
    input.language,
    input.journeyStageId,
    input.settingId,
    input.genreEmphasis,
    input.intensity,
    input.vocalType,
    input.bpm ?? '',
    input.productionEraId ?? '',
    input.songFormId ?? '',
    input.relationship?.trim() ?? '',
    input.emotionalDestination?.trim() ?? '',
    input.lyricalSeed?.trim() ?? '',
    input.variant ?? 0,
  ].join('|')
}

/* ------------------------------------------------------------------ */
/* Style prompt                                                        */
/* ------------------------------------------------------------------ */

/**
 * Flattens descriptor groups into one comma list, dropping repeats and
 * stopping at the budget. Parts must arrive in priority order: Suno weights
 * the opening terms heaviest, so the genre head survives any truncation.
 *
 * Deduplication matters more than it looks — the genre head and the emphasis
 * tags overlap ("cinematic highway rock" appeared twice in every prompt),
 * which is part of why separate briefs produced such similar output.
 */
function joinStyle(parts: string[], budget = STYLE_BUDGET): string {
  const seen = new Set<string>()
  const kept: string[] = []
  let length = 0

  for (const part of parts) {
    for (const raw of part.split(',')) {
      const token = raw.trim().replace(/\s+/g, ' ')
      if (!token) continue
      const key = token.toLowerCase()
      if (seen.has(key)) continue

      const cost = kept.length === 0 ? token.length : token.length + 2
      if (length + cost > budget) return kept.join(', ')

      seen.add(key)
      kept.push(token)
      length += cost
    }
  }

  return kept.join(', ')
}

function buildStylePrompt(input: SongInput, music: MusicSpec): string {
  const setting = pickSetting(input.settingId)
  const genre = GENRE_EMPHASIS_LABELS[input.genreEmphasis]

  return joinStyle([
    SONIC_DEFAULTS.styleCore.value,
    genre.styleTags,
    `${music.bpm} BPM`,
    music.meter,
    music.feel,
    `key of ${music.key}`,
    `${music.progression} progression`,
    music.instrumentation.join(', '),
    music.drumNote,
    music.vocal.join(', '),
    music.productionEraTags,
    MIX_LAW,
    setting.sonicHint,
    TONE_SHORT,
  ])
}

/** Musical exclusions only — Suno cannot act on thematic ones. */
function buildNegativePrompt(): string {
  return EXCLUDED_STYLES.join(', ')
}

/* ------------------------------------------------------------------ */
/* Musical decisions                                                   */
/* ------------------------------------------------------------------ */

function resolveForm(input: SongInput, rng: Rng): SongForm {
  if (input.songFormId) {
    const chosen = SONG_FORMS.find((f) => f.id === input.songFormId)
    if (chosen) return chosen
  }
  const eligibleIds = FORM_PREFERENCE[input.intensity]
  const eligible = SONG_FORMS.filter((f) => eligibleIds.includes(f.id))
  return rng.pick(eligible.length > 0 ? eligible : SONG_FORMS)
}

function resolveMusic(input: SongInput, rng: Rng, form: SongForm): MusicSpec {
  const family = STAGE_FAMILY[input.journeyStageId]
  const palette = INSTRUMENT_PALETTES[input.genreEmphasis]
  const delivery = VOCAL_DELIVERY[input.vocalType]

  const groove = rng.fork('groove').pick(GROOVE_FEELS[input.intensity])
  const harmonyRng = rng.fork('harmony')
  const colour = harmonyRng.pick(FAMILY_HARMONY[family])
  const keyCenter = harmonyRng.pick(KEY_POOLS[colour])
  const progression = harmonyRng.pick(PROGRESSIONS[colour])

  const instrRng = rng.fork('instruments')
  const instrumentation = [
    instrRng.pick(palette.rhythmGuitar),
    instrRng.pick(palette.leadGuitar),
    instrRng.pick(palette.bass),
    instrRng.pick(palette.keys),
    instrRng.pick(palette.color),
  ]

  const vocalRng = rng.fork('vocal')
  const vocal = [
    delivery.register,
    vocalRng.pick(delivery.texture),
    vocalRng.pick(delivery.harmony),
    vocalRng.pick(delivery.delivery),
  ]

  const era =
    PRODUCTION_ERAS.find((e) => e.id === input.productionEraId) ??
    rng.fork('era').pick(PRODUCTION_ERAS)

  return {
    bpm: input.bpm ?? groove.bpm,
    meter: groove.meter,
    feel: groove.feel,
    drumNote: groove.drumNote,
    key: keyCenter.name,
    keyCharacter: keyCenter.character,
    progression: progression.roman,
    progressionLabel: progression.label,
    instrumentation,
    vocal,
    productionEraLabel: era.label,
    productionEraTags: era.tags,
    formLabel: form.label,
  }
}

function buildArrangement(form: SongForm): ArrangementSection[] {
  return form.sections.map((section) => {
    const label = SECTION_TAGS[section.role]
    return { tag: `[${label}: ${section.note}]`, label, note: section.note }
  })
}

/* ------------------------------------------------------------------ */
/* Title and concept                                                   */
/* ------------------------------------------------------------------ */

const TITLE_PARTS: Record<Language, { a: string[]; b: string[] }> = {
  en: {
    a: [
      'Neon', 'Midnight', 'Horizon', 'Coastal', 'Desert', 'Motel', 'Empty', 'Last', 'Blue',
      'Quiet', 'Half-Lit', 'Open', 'Slow', 'Borrowed', 'Northbound', 'Paper', 'Second',
      'Unmarked', 'Long', 'Wider',
    ],
    b: [
      'Kilometers', 'Promises', 'Coffee', 'Lane', 'Radio', 'Return', 'Dawn', 'Mirror', 'Exit',
      'Miles', 'Headlights', 'Weather', 'Company', 'Distance', 'Ignition', 'Turnaround',
      'Shoulder', 'Morning', 'Engine', 'Overpass',
    ],
  },
  es: {
    a: [
      'Neón', 'Medianoche', 'Horizonte', 'Costa', 'Desierto', 'Motel', 'Vacío', 'Último', 'Azul',
      'Silencio', 'Media', 'Abierto', 'Lento', 'Prestado', 'Norte', 'Papel', 'Segundo',
      'Sin Nombre', 'Largo', 'Ancho',
    ],
    b: [
      'Kilómetros', 'Promesas', 'Café', 'Carril', 'Radio', 'Regreso', 'Amanecer', 'Espejo',
      'Salida', 'Millas', 'Faros', 'Clima', 'Compañía', 'Distancia', 'Arranque', 'Vuelta',
      'Arcén', 'Mañana', 'Motor', 'Puente',
    ],
  },
}

const TITLE_PATTERNS: Record<Language, ((a: string, b: string) => string)[]> = {
  en: [
    (a, b) => `${a} ${b}`,
    (_a, b) => `The ${b}`,
    (a, b) => `${a} ${b}`,
    (a, b) => `All the ${a} ${b}`,
    (_a, b) => `${b}, Anyway`,
  ],
  es: [
    (a, b) => `${a} ${b}`,
    (_a, b) => `Los ${b}`,
    (a, b) => `${a} ${b}`,
    (a, b) => `Todos los ${a} ${b}`,
    (_a, b) => `${b}, Igual`,
  ],
}

function buildTitle(input: SongInput, rng: Rng): string {
  const seed = input.lyricalSeed?.trim()
  if (seed) {
    const words = seed
      .split(/\s+/)
      .filter((w) => w.length > 3)
      .slice(0, 2)
    if (words.length > 0) {
      return words.map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(' ')
    }
  }

  const parts = TITLE_PARTS[input.language]
  const titleRng = rng.fork('title')
  return titleRng.pick(TITLE_PATTERNS[input.language])(
    titleRng.pick(parts.a),
    titleRng.pick(parts.b),
  )
}

function buildConcept(input: SongInput, music: MusicSpec, rng: Rng): string {
  const stage = pickStage(input.journeyStageId)
  const setting = pickSetting(input.settingId)
  const lang = input.language
  const theme = rng.fork('concept-theme').pick(stage.themes[lang])
  const person = personSlot(input)
  const dest = destSlot(input)
  const seed = input.lyricalSeed?.trim()

  const musical =
    lang === 'es'
      ? `Musicalmente: ${music.formLabel.toLowerCase()} en ${music.key} a ${music.bpm} BPM (${music.meter}, ${music.feel}), sobre ${music.progression} — ${music.progressionLabel}. Producción: ${music.productionEraLabel.toLowerCase()}.`
      : `Musically: ${music.formLabel.toLowerCase()} in ${music.key} at ${music.bpm} BPM (${music.meter}, ${music.feel}), over ${music.progression} — ${music.progressionLabel}. Production: ${music.productionEraLabel.toLowerCase()}.`

  if (lang === 'es') {
    const seedNote = seed ? ` Semilla: ${seed}.` : ''
    return `En ${setting.label.es}, el protagonista atraviesa ${stage.label.es} (${stage.dominantEmotion.es}). La historia gira en torno a ${person} y el motivo de ${theme}. La carretera exterior refleja el cambio interior: no hay cierre absoluto, sino ${dest}.${seedNote} ${musical}`
  }

  const seedNote = seed ? ` Seed: ${seed}.` : ''
  return `At ${setting.label.en}, the protagonist moves through ${stage.label.en} (${stage.dominantEmotion.en}). The story centers on ${person} and the motif of ${theme}. The outer road mirrors the inner change: nothing is sealed, only ${dest}.${seedNote} ${musical}`
}

/* ------------------------------------------------------------------ */
/* Lyrics                                                              */
/* ------------------------------------------------------------------ */

function personSlot(input: SongInput): string {
  const supplied = input.relationship?.trim()
  if (supplied) return supplied
  return input.language === 'es'
    ? 'alguien que aún viaja en el retrovisor'
    : 'someone who still rides in the rearview'
}

function destSlot(input: SongInput): string {
  const supplied = input.emotionalDestination?.trim()
  if (supplied) return supplied
  return input.language === 'es' ? 'una esperanza más quieta' : 'a softer kind of hope'
}

function fillSlots(block: string, slots: Record<string, string>): string {
  return block.replace(/\{(\w+)\}/g, (match, key: string) => slots[key] ?? match)
}

/**
 * Assembles the lyric from the chosen form. The chorus is drawn once and
 * reused, because a chorus that changes every time is not a chorus; variety
 * comes from which blocks are drawn, not from rewriting the hook mid-song.
 */
function buildLyrics(
  input: SongInput,
  title: string,
  form: SongForm,
  arrangement: ArrangementSection[],
  rng: Rng,
): string {
  const lang = input.language
  const stage = pickStage(input.journeyStageId)
  const setting = pickSetting(input.settingId)
  const family = STAGE_FAMILY[input.journeyStageId]
  const bank: FamilyBank = LYRIC_BANK[lang][family]

  const lyricRng = rng.fork('lyrics')
  const slots: Record<string, string> = {
    image: lyricRng.fork('image').pick(setting.imagery[lang]),
    theme: lyricRng.fork('theme').pick(stage.themes[lang]),
    place: setting.label[lang].toLowerCase(),
    person: personSlot(input),
    dest: destSlot(input),
    title,
  }

  const verses = lyricRng.fork('verses').pickMany(bank.verses, 3)
  const chorus = lyricRng.fork('chorus').pick(bank.choruses)
  const pre = lyricRng.fork('pre').pick(bank.pres)
  const bridge = lyricRng.fork('bridge').pick(bank.bridges)
  const breakdown = lyricRng.fork('breakdown').pick(bank.breakdowns)
  const outro = lyricRng.fork('outro').pick(bank.outros)

  const seed = input.lyricalSeed?.trim()
  const seedLine = seed
    ? fillSlots(lyricRng.fork('seed').pick(SEED_LINES[lang]), { seed })
    : null

  let verseIndex = 0
  const blocks: string[] = []

  form.sections.forEach((section, i) => {
    const tag = arrangement[i].tag

    switch (section.role) {
      case 'intro':
      case 'solo':
        blocks.push(tag)
        break
      case 'verse': {
        const body = verses[verseIndex % verses.length]
        verseIndex += 1
        const withSeed =
          seedLine && verseIndex === 1 ? `${body}\n${seedLine}` : body
        blocks.push(`${tag}\n${withSeed}`)
        break
      }
      case 'pre':
        blocks.push(`${tag}\n${pre}`)
        break
      case 'chorus':
      case 'final_chorus':
        blocks.push(`${tag}\n${chorus}`)
        break
      case 'bridge':
        blocks.push(`${tag}\n${bridge}`)
        break
      case 'breakdown':
        blocks.push(`${tag}\n${breakdown}`)
        break
      case 'outro':
        blocks.push(`${tag}\n${outro}`)
        break
    }
  })

  return fillSlots(blocks.join('\n\n'), slots)
}

/* ------------------------------------------------------------------ */
/* Provenance                                                          */
/* ------------------------------------------------------------------ */

function buildAppliedRules(input: SongInput, music: MusicSpec): AppliedRule[] {
  const stage = pickStage(input.journeyStageId)
  const setting = pickSetting(input.settingId)
  const genre = GENRE_EMPHASIS_LABELS[input.genreEmphasis]

  return [
    { rule: NORTH_STAR.value, provenance: NORTH_STAR.provenance, source: NORTH_STAR.source },
    { rule: TONE.value, provenance: TONE.provenance, source: TONE.source },
    ...THREE_FLAGS.map((f) => ({ rule: f.value, provenance: f.provenance, source: f.source })),
    ...HARD_RULES.slice(0, 4).map((r) => ({
      rule: r.value,
      provenance: r.provenance,
      source: r.source,
    })),
    {
      rule: `Journey stage: ${stage.label.en} / ${stage.dominantEmotion.en}`,
      provenance: stage.provenance,
      source: stage.source,
    },
    {
      rule: `Setting sonic hint: ${setting.sonicHint}`,
      provenance: setting.provenance,
      source: setting.source,
    },
    {
      rule: `Genre emphasis: ${genre.styleTags}`,
      provenance: genre.provenance,
      source: 'Genre emphasis selector',
    },
    {
      rule: `Tempo and feel: ${music.bpm} BPM, ${music.meter}, ${music.feel}`,
      provenance: MUSIC_PROVENANCE,
      source: MUSIC_SOURCE,
    },
    {
      rule: `Harmony: ${music.key} — ${music.keyCharacter}; ${music.progression} (${music.progressionLabel})`,
      provenance: MUSIC_PROVENANCE,
      source: MUSIC_SOURCE,
    },
    {
      rule: `Instrumentation: ${music.instrumentation.join('; ')}`,
      provenance: MUSIC_PROVENANCE,
      source: MUSIC_SOURCE,
    },
    {
      rule: `Production: ${music.productionEraLabel} — ${music.productionEraTags}`,
      provenance: MUSIC_PROVENANCE,
      source: MUSIC_SOURCE,
    },
    {
      rule: `Arrangement: ${music.formLabel}`,
      provenance: MUSIC_PROVENANCE,
      source: MUSIC_SOURCE,
    },
    {
      rule: SONIC_DEFAULTS.genreCore.value,
      provenance: SONIC_DEFAULTS.genreCore.provenance,
      source: SONIC_DEFAULTS.genreCore.source,
    },
    ...CREATIVE_DNA.slice(0, 3).map((r) => ({
      rule: r.value,
      provenance: r.provenance,
      source: r.source,
    })),
    ...BANNED_CLICHES.slice(0, 2).map((c) => ({
      rule: `Avoided: ${c.value}`,
      provenance: c.provenance,
      source: c.source,
    })),
  ]
}

/* ------------------------------------------------------------------ */
/* Entry point                                                         */
/* ------------------------------------------------------------------ */

/**
 * Assemble a Suno-ready song package from Neon Highway Rock rules.
 *
 * Deterministic for a given brief: the same input and `variant` always yields
 * the same package. Bump `input.variant` to reroll every seeded choice.
 */
export function generateSongPackage(input: SongInput): SongPackage {
  const inputIssues = validateInput(input)
  if (hasBlockingErrors(inputIssues)) {
    throw new Error(
      inputIssues
        .filter((i) => i.severity === 'error')
        .map((i) => i.message)
        .join(' '),
    )
  }

  const seed = hashString(canonicalSeed(input))
  const rng = new Rng(seed)

  const form = resolveForm(input, rng.fork('form'))
  const music = resolveMusic(input, rng.fork('music'), form)
  const arrangement = buildArrangement(form)
  const title = buildTitle(input, rng)
  const concept = buildConcept(input, music, rng)
  const stylePrompt = buildStylePrompt(input, music)
  const negativePrompt = buildNegativePrompt()
  const lyrics = buildLyrics(input, title, form, arrangement, rng)
  const appliedRules = buildAppliedRules(input, music)

  const pkg: SongPackage = {
    id: `nhr-${seed.toString(16)}`,
    createdAt: new Date().toISOString(),
    input,
    title,
    concept,
    stylePrompt,
    negativePrompt,
    lyrics,
    music,
    arrangement,
    appliedRules,
    warnings: inputIssues.filter((i) => i.severity === 'warning').map((i) => i.message),
  }

  const packageIssues = validatePackage(pkg)
  if (hasBlockingErrors(packageIssues)) {
    throw new Error(
      packageIssues
        .filter((i) => i.severity === 'error')
        .map((i) => i.message)
        .join(' '),
    )
  }

  pkg.warnings = [
    ...pkg.warnings,
    ...packageIssues.filter((i) => i.severity === 'warning').map((i) => i.message),
  ]

  return pkg
}

/** One-line musical summary, useful in Suno's short description field. */
export function musicSummary(music: MusicSpec): string {
  return [
    `${music.bpm} BPM`,
    music.meter,
    music.key,
    `${music.progression} (${music.progressionLabel})`,
    music.formLabel,
    music.productionEraLabel,
  ].join(' · ')
}

export function formatForSuno(pkg: SongPackage): string {
  return [
    `TITLE: ${pkg.title}`,
    '',
    'STYLE OF MUSIC:',
    pkg.stylePrompt,
    '',
    'EXCLUDE STYLES:',
    pkg.negativePrompt,
    '',
    'MUSIC NOTES:',
    musicSummary(pkg.music),
    '',
    'LYRICS:',
    pkg.lyrics,
  ].join('\n')
}
