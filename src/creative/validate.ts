import {
  GENRE_EMPHASIS_LABELS,
  JOURNEY_STAGES,
  SETTINGS,
  SONIC_DEFAULTS,
  type Intensity,
} from './schema'
import { PRODUCTION_ERAS, SONG_FORMS } from './music'
import type { SongInput, SongPackage, ValidationIssue } from './types'

const REQUIRED_SECTIONS = ['[Verse', '[Chorus', '[Outro'] as const

/** Suno's style field truncates past roughly this length. */
const STYLE_MAX = 1000
const STYLE_MIN = 40

export function validateInput(input: SongInput): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  if (input.language !== 'en' && input.language !== 'es') {
    issues.push({ field: 'language', message: 'Language must be en or es.', severity: 'error' })
  }

  if (!JOURNEY_STAGES.some((s) => s.id === input.journeyStageId)) {
    issues.push({ field: 'journeyStageId', message: 'Unknown journey stage.', severity: 'error' })
  }

  if (!SETTINGS.some((s) => s.id === input.settingId)) {
    issues.push({ field: 'settingId', message: 'Unknown setting.', severity: 'error' })
  }

  if (!(input.genreEmphasis in GENRE_EMPHASIS_LABELS)) {
    issues.push({ field: 'genreEmphasis', message: 'Unknown genre emphasis.', severity: 'error' })
  }

  const intensityOk: Intensity[] = ['intimate', 'steady', 'driving', 'soaring']
  if (!intensityOk.includes(input.intensity)) {
    issues.push({ field: 'intensity', message: 'Unknown intensity.', severity: 'error' })
  }

  if (input.bpm !== undefined) {
    if (!Number.isFinite(input.bpm) || input.bpm <= 0) {
      issues.push({ field: 'bpm', message: 'BPM must be a positive number.', severity: 'error' })
    } else if (input.bpm < 60 || input.bpm > 160) {
      issues.push({
        field: 'bpm',
        message: 'BPM should stay within 60–160 for this universe.',
        severity: 'warning',
      })
    } else if (intensityOk.includes(input.intensity)) {
      const [min, max] = SONIC_DEFAULTS.bpmByIntensity[input.intensity]
      if (input.bpm < min || input.bpm > max) {
        issues.push({
          field: 'bpm',
          message: `${input.bpm} BPM sits outside the ${min}–${max} window for "${input.intensity}" — the groove and the tempo will fight each other.`,
          severity: 'warning',
        })
      }
    }
  }

  if (input.productionEraId && !PRODUCTION_ERAS.some((e) => e.id === input.productionEraId)) {
    issues.push({
      field: 'productionEraId',
      message: 'Unknown production era.',
      severity: 'error',
    })
  }

  if (input.songFormId && !SONG_FORMS.some((f) => f.id === input.songFormId)) {
    issues.push({ field: 'songFormId', message: 'Unknown song form.', severity: 'error' })
  }

  if (input.genreEmphasis === 'synth_glow' && input.intensity === 'soaring') {
    issues.push({
      field: 'genreEmphasis',
      message:
        'Soft synth glow + soaring can tip into hyper-neon cliché — keep synth restrained (documented color rule).',
      severity: 'warning',
    })
  }

  if (input.genreEmphasis === 'acoustic_night' && input.intensity === 'driving') {
    issues.push({
      field: 'intensity',
      message:
        'Acoustic Night at driving intensity loses the sparse arrangement the setting asks for.',
      severity: 'warning',
    })
  }

  const dest = input.emotionalDestination?.trim()
  if (dest && /^(seguir|keep|stay|move|volver|continuar)\b/i.test(dest)) {
    issues.push({
      field: 'emotionalDestination',
      message:
        'Emotional destination reads as a verb phrase; the lyric bank places it after prepositions, so a noun phrase ("a softer kind of hope") fits better.',
      severity: 'warning',
    })
  }

  return issues
}

export function validatePackage(pkg: SongPackage): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  if (!pkg.title.trim()) {
    issues.push({ field: 'title', message: 'Title is required.', severity: 'error' })
  }

  if (pkg.stylePrompt.length > STYLE_MAX) {
    issues.push({
      field: 'stylePrompt',
      message: `Style prompt exceeds ${STYLE_MAX} characters; Suno may truncate.`,
      severity: 'warning',
    })
  }

  if (pkg.stylePrompt.length < STYLE_MIN) {
    issues.push({
      field: 'stylePrompt',
      message: 'Style prompt is too short to encode the Neon Highway Rock identity.',
      severity: 'error',
    })
  }

  /** A prompt with no tempo, key or named instrument is the generic output we set out to kill. */
  if (!/\d+\s*BPM/i.test(pkg.stylePrompt)) {
    issues.push({
      field: 'stylePrompt',
      message: 'Style prompt is missing a tempo.',
      severity: 'error',
    })
  }

  if (!/key of /i.test(pkg.stylePrompt)) {
    issues.push({
      field: 'stylePrompt',
      message: 'Style prompt is missing a key centre.',
      severity: 'warning',
    })
  }

  /**
   * Negations in the positive style field steer Suno toward the very thing
   * being excluded; that is what the separate exclude list is for.
   */
  const negation = pkg.stylePrompt.match(/\b(no|not|never|without|avoid)\b/i)
  if (negation) {
    issues.push({
      field: 'stylePrompt',
      message: `Style prompt contains the negation "${negation[0]}" — move it to the exclude list, Suno reads negations as emphasis.`,
      severity: 'warning',
    })
  }

  for (const section of REQUIRED_SECTIONS) {
    if (!pkg.lyrics.includes(section)) {
      issues.push({
        field: 'lyrics',
        message: `Missing required section ${section}].`,
        severity: 'error',
      })
    }
  }

  if (pkg.arrangement.length === 0) {
    issues.push({ field: 'arrangement', message: 'Arrangement is empty.', severity: 'error' })
  }

  /** Any leftover `{slot}` means a lyric block used a token the generator does not fill. */
  const unresolved = pkg.lyrics.match(/\{(\w+)\}/)
  if (unresolved) {
    issues.push({
      field: 'lyrics',
      message: `Unresolved lyric slot ${unresolved[0]}.`,
      severity: 'error',
    })
  }

  const lines = pkg.lyrics
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('['))

  const counts = new Map<string, number>()
  for (const line of lines) {
    const key = line.toLowerCase()
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  for (const [line, count] of counts) {
    if (count > 3) {
      issues.push({
        field: 'lyrics',
        message: `Line repeats more than 3 times: "${line}"`,
        severity: 'warning',
      })
    }
  }

  const hardBanned = [
    /i lost you forever/i,
    /te perd[ií] para siempre/i,
    /night of terror/i,
    /noche de terror/i,
  ]
  for (const pattern of hardBanned) {
    if (pattern.test(pkg.lyrics) || pattern.test(pkg.concept)) {
      issues.push({
        field: 'lyrics',
        message: `Blocked melodrama/cliché pattern matched: ${pattern}`,
        severity: 'error',
      })
    }
  }

  return issues
}

export function hasBlockingErrors(issues: ValidationIssue[]): boolean {
  return issues.some((i) => i.severity === 'error')
}
