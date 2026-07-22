import {
  BANNED_CLICHES,
  CREATIVE_DNA,
  GENRE_EMPHASIS_LABELS,
  HARD_RULES,
  JOURNEY_STAGES,
  NORTH_STAR,
  SETTINGS,
  SONIC_DEFAULTS,
  THREE_FLAGS,
  TONE,
  VOCAL_LABELS,
  type Intensity,
  type Language,
} from './schema'
import type { AppliedRule, SongInput, SongPackage } from './types'
import { hasBlockingErrors, validateInput, validatePackage } from './validate'

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

function bpmRange(input: SongInput): [number, number] {
  const defaults = SONIC_DEFAULTS.bpmByIntensity[input.intensity]
  return [input.bpmMin ?? defaults[0], input.bpmMax ?? defaults[1]]
}

function hashSeed(input: SongInput): number {
  const raw = JSON.stringify(input)
  let h = 0
  for (let i = 0; i < raw.length; i++) h = (h * 31 + raw.charCodeAt(i)) >>> 0
  return h
}

function pick<T>(items: T[], seed: number, salt: number): T {
  return items[(seed + salt) % items.length]
}

const TITLE_PARTS: Record<Language, { a: string[]; b: string[] }> = {
  en: {
    a: [
      'Neon',
      'Midnight',
      'Horizon',
      'Coastal',
      'Desert',
      'Motel',
      'Empty',
      'Last',
      'Blue',
      'Quiet',
    ],
    b: [
      'Kilometers',
      'Promises',
      'Coffee',
      'Lane',
      'Radio',
      'Return',
      'Dawn',
      'Mirror',
      'Exit',
      'Miles',
    ],
  },
  es: {
    a: [
      'Neón',
      'Medianoche',
      'Horizonte',
      'Costa',
      'Desierto',
      'Motel',
      'Vacío',
      'Último',
      'Azul',
      'Silencio',
    ],
    b: [
      'Kilómetros',
      'Promesas',
      'Café',
      'Carril',
      'Radio',
      'Regreso',
      'Amanecer',
      'Espejo',
      'Salida',
      'Millas',
    ],
  },
}

function intensityEnergy(intensity: Intensity): string {
  switch (intensity) {
    case 'intimate':
      return 'intimate low-energy arrangement, close vocals, soft dynamics'
    case 'steady':
      return 'steady midtempo groove, warm forward motion'
    case 'driving':
      return 'driving road-trip energy, confident pulse, still cinematic'
    case 'soaring':
      return 'soaring emotional lift, open choruses, hopeful intensity without aggression'
  }
}

function buildAppliedRules(input: SongInput): AppliedRule[] {
  const stage = pickStage(input.journeyStageId)
  const setting = pickSetting(input.settingId)
  const genre = GENRE_EMPHASIS_LABELS[input.genreEmphasis]

  return [
    { rule: NORTH_STAR.value, provenance: NORTH_STAR.provenance, source: NORTH_STAR.source },
    { rule: TONE.value, provenance: TONE.provenance, source: TONE.source },
    ...THREE_FLAGS.map((f) => ({
      rule: f.value,
      provenance: f.provenance,
      source: f.source,
    })),
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
      rule: SONIC_DEFAULTS.genreCore.value,
      provenance: SONIC_DEFAULTS.genreCore.provenance,
      source: SONIC_DEFAULTS.genreCore.source,
    },
    {
      rule: SONIC_DEFAULTS.production.value,
      provenance: SONIC_DEFAULTS.production.provenance,
      source: SONIC_DEFAULTS.production.source,
    },
    ...CREATIVE_DNA.slice(0, 3).map((r) => ({
      rule: r.value,
      provenance: r.provenance,
      source: r.source,
    })),
  ]
}

function buildStylePrompt(input: SongInput): string {
  const setting = pickSetting(input.settingId)
  const genre = GENRE_EMPHASIS_LABELS[input.genreEmphasis]
  const vocal = VOCAL_LABELS[input.vocalType]
  const [bpmMin, bpmMax] = bpmRange(input)
  const stage = pickStage(input.journeyStageId)

  const parts = [
    SONIC_DEFAULTS.genreCore.value,
    genre.styleTags,
    setting.sonicHint,
    intensityEnergy(input.intensity),
    vocal.style,
    `${bpmMin}-${bpmMax} BPM`,
    TONE.value,
    `emotional arc: ${stage.dominantEmotion.en}`,
    SONIC_DEFAULTS.production.value,
    'cinematic road atmosphere, breathing space, sustained guitars, hopeful melancholy',
    'ordinary human story, memory-forming, no aggressive metal, no hyper-saturated synthwave',
  ]

  return parts.join(', ')
}

function buildNegativePrompt(): string {
  return [
    ...BANNED_CLICHES.map((c) => c.value),
    'toxic breakup melodrama',
    'trap beats',
    'EDM drops',
    'death metal',
    'cartoonish neon synthwave overload',
    'celebrity flex lyrics',
    'closed tragic ending with no hope door',
  ].join('; ')
}

function buildTitle(input: SongInput, seed: number): string {
  const parts = TITLE_PARTS[input.language]
  const a = pick(parts.a, seed, 3)
  const b = pick(parts.b, seed, 11)
  if (input.lyricalSeed?.trim()) {
    const words = input.lyricalSeed
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 3)
      .slice(0, 2)
    if (words.length) {
      return words.map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(' ')
    }
  }
  return `${a} ${b}`
}

function buildConcept(input: SongInput): string {
  const stage = pickStage(input.journeyStageId)
  const setting = pickSetting(input.settingId)
  const lang = input.language
  const emotion = stage.dominantEmotion[lang]
  const settingLabel = setting.label[lang]
  const theme = pick(stage.themes[lang], hashSeed(input), 5)
  const relationship =
    input.relationship?.trim() ||
    (lang === 'es' ? 'una relación que está cambiando' : 'a relationship that is changing')
  const destination =
    input.emotionalDestination?.trim() ||
    (lang === 'es'
      ? 'una esperanza quieta que sigue avanzando'
      : 'a quiet hope that keeps moving forward')
  const seedNote = input.lyricalSeed?.trim()
    ? lang === 'es'
      ? ` Semilla: ${input.lyricalSeed.trim()}.`
      : ` Seed: ${input.lyricalSeed.trim()}.`
    : ''

  if (lang === 'es') {
    return `En ${settingLabel}, el protagonista atraviesa ${stage.label.es} (${emotion}). La historia gira en torno a ${relationship} y el motivo ${theme}. La carretera exterior refleja un cambio interior: al final no hay cierre absoluto, sino ${destination}.${seedNote} La canción debe sentirse cinematográfica y habitable para el oyente.`
  }

  return `At ${settingLabel}, the protagonist moves through ${stage.label.en} (${emotion}). The story centers on ${relationship} and the motif of ${theme}. The outer road mirrors an inner change: the song ends not with a sealed conclusion, but with ${destination}.${seedNote} It should feel cinematic and inhabitable for the listener.`
}

function lyricsEn(input: SongInput, title: string): string {
  const stage = pickStage(input.journeyStageId)
  const setting = pickSetting(input.settingId)
  const seed = hashSeed(input)
  const image = pick(setting.imagery.en, seed, 2)
  const theme = pick(stage.themes.en, seed, 7)
  const relation = input.relationship?.trim() || 'someone who still lives in the rearview'
  const dest = input.emotionalDestination?.trim() || 'keep going with a softer kind of hope'
  const custom = input.lyricalSeed?.trim()

  return `[Verse]
${image} on the glass of the night
I measure the dark in quiet miles
Thinking about ${theme}
and ${relation}
${custom ? `You said "${custom}" like a map I still keep\n` : ''}The road don't ask me who I was
It only asks me who I'll be

[Pre-Chorus]
No sirens, no speeches, just the hum
Of a heart learning how to run

[Chorus]
I'm not chasing the destination
I'm learning the shape of the change
If this song becomes a memory
Let it taste like rain and open range
I can feel the horizon breathing
Calling me to ${dest}

[Verse]
Same ${setting.label.en.toLowerCase()}, different skin
I park where the silence lets me in
Every curve a private question
Every light a softer yes
I don't need a perfect answer
I just need the next honest mile

[Bridge]
If I turn around, I'll still be moving
If I stay, I'll still be new
The past can ride shotgun
But it doesn't get to drive

[Chorus]
I'm not chasing the destination
I'm learning the shape of the change
If this song becomes a memory
Let it taste like rain and open range
I can feel the horizon breathing
Calling me to ${dest}

[Outro]
${title} fades into the windshield glow
The world stays the same
But I don't
And the road keeps going`
}

function lyricsEs(input: SongInput, title: string): string {
  const stage = pickStage(input.journeyStageId)
  const setting = pickSetting(input.settingId)
  const seed = hashSeed(input)
  const image = pick(setting.imagery.es, seed, 2)
  const theme = pick(stage.themes.es, seed, 7)
  const relation = input.relationship?.trim() || 'alguien que aún vive en el espejo retrovisor'
  const dest = input.emotionalDestination?.trim() || 'seguir con una esperanza más quieta'
  const custom = input.lyricalSeed?.trim()

  return `[Verse]
${image} sobre el cristal de la noche
mido la oscuridad en millas calladas
pensando en ${theme}
y en ${relation}
${custom ? `Dijiste "${custom}" como un mapa que aún guardo\n` : ''}La carretera no pregunta quién fui
solo pregunta en quién me voy convirtiendo

[Pre-Chorus]
Sin sirenas, sin discursos, solo el zumbido
de un corazón aprendiendo a avanzar

[Chorus]
No persigo el destino
aprendo la forma del cambio
Si esta canción se vuelve memoria
que sepa a lluvia y campo abierto
Siento el horizonte respirar
llamándome a ${dest}

[Verse]
Mismo ${setting.label.es.toLowerCase()}, distinta piel
paro donde el silencio me deja entrar
Cada curva es una pregunta privada
cada luz un sí más suave
No necesito una respuesta perfecta
solo la siguiente milla honesta

[Bridge]
Si doy la vuelta, igual sigo moviéndome
si me quedo, igual soy otro
El pasado puede ir de copiloto
pero no conduce

[Chorus]
No persigo el destino
aprendo la forma del cambio
Si esta canción se vuelve memoria
que sepa a lluvia y campo abierto
Siento el horizonte respirar
llamándome a ${dest}

[Outro]
${title} se disuelve en el resplandor del parabrisas
El mundo sigue igual
Yo no
Y la carretera continúa`
}

/**
 * Assemble a deterministic Suno-ready song package from Neon Highway Rock rules.
 */
export function generateSongPackage(input: SongInput): SongPackage {
  const inputIssues = validateInput(input)
  if (hasBlockingErrors(inputIssues)) {
    throw new Error(inputIssues.filter((i) => i.severity === 'error').map((i) => i.message).join(' '))
  }

  const seed = hashSeed(input)
  const title = buildTitle(input, seed)
  const concept = buildConcept(input)
  const stylePrompt = buildStylePrompt(input)
  const negativePrompt = buildNegativePrompt()
  const lyrics = input.language === 'es' ? lyricsEs(input, title) : lyricsEn(input, title)
  const appliedRules = buildAppliedRules(input)

  const pkg: SongPackage = {
    id: `nhr-${seed.toString(16)}`,
    createdAt: new Date().toISOString(),
    input,
    title,
    concept,
    stylePrompt,
    negativePrompt,
    lyrics,
    appliedRules,
    warnings: inputIssues.filter((i) => i.severity === 'warning').map((i) => i.message),
  }

  const packageIssues = validatePackage(pkg)
  if (hasBlockingErrors(packageIssues)) {
    throw new Error(
      packageIssues.filter((i) => i.severity === 'error').map((i) => i.message).join(' '),
    )
  }

  pkg.warnings = [
    ...pkg.warnings,
    ...packageIssues.filter((i) => i.severity === 'warning').map((i) => i.message),
  ]

  return pkg
}

export function formatForSuno(pkg: SongPackage): string {
  return [
    `TITLE: ${pkg.title}`,
    '',
    'STYLE OF MUSIC:',
    pkg.stylePrompt,
    '',
    'EXCLUDE / NEGATIVE:',
    pkg.negativePrompt,
    '',
    'LYRICS:',
    pkg.lyrics,
  ].join('\n')
}
