import {
  GENRE_EMPHASIS_LABELS,
  JOURNEY_STAGES,
  SETTINGS,
  SONIC_DEFAULTS,
  type Intensity,
} from './schema'
import type { SongInput, SongPackage, ValidationIssue } from './types'

const REQUIRED_SECTIONS = ['[Verse]', '[Chorus]', '[Outro]'] as const

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

  const [defaultMin, defaultMax] = SONIC_DEFAULTS.bpmByIntensity[input.intensity]
  const min = input.bpmMin ?? defaultMin
  const max = input.bpmMax ?? defaultMax

  if (min < 60 || max > 160) {
    issues.push({
      field: 'bpm',
      message: 'BPM should stay within 60–160 for this universe.',
      severity: 'warning',
    })
  }

  if (min > max) {
    issues.push({ field: 'bpm', message: 'BPM min cannot exceed BPM max.', severity: 'error' })
  }

  if (input.genreEmphasis === 'synth_glow' && input.intensity === 'soaring') {
    issues.push({
      field: 'genreEmphasis',
      message:
        'Soft synth glow + soaring can tip into hyper-neon cliché — keep synth restrained (documented color rule).',
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

  if (pkg.stylePrompt.length > 1000) {
    issues.push({
      field: 'stylePrompt',
      message: 'Style prompt exceeds 1000 characters; Suno may truncate.',
      severity: 'warning',
    })
  }

  if (pkg.stylePrompt.length < 40) {
    issues.push({
      field: 'stylePrompt',
      message: 'Style prompt is too short to encode the Neon Highway Rock identity.',
      severity: 'error',
    })
  }

  for (const section of REQUIRED_SECTIONS) {
    if (!pkg.lyrics.includes(section)) {
      issues.push({
        field: 'lyrics',
        message: `Missing required section ${section}.`,
        severity: 'error',
      })
    }
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
