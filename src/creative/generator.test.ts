import { describe, expect, it } from 'vitest'
import { formatForSuno, generateSongPackage, musicSummary } from './generator'
import { EXCLUDED_STYLES, PRODUCTION_ERAS, SONG_FORMS } from './music'
import { JOURNEY_STAGES, SETTINGS, type Language } from './schema'
import type { SongInput } from './types'
import { hasBlockingErrors, validateInput, validatePackage } from './validate'

const base: SongInput = {
  language: 'en',
  journeyStageId: 'fracture',
  settingId: 'gas_station',
  genreEmphasis: 'highway_rock',
  intensity: 'steady',
  vocalType: 'warm_male',
  relationship: 'a long-distance love',
  emotionalDestination: 'a luminous kind of gratitude',
  lyricalSeed: 'same pump at 2am',
}

describe('validateInput', () => {
  it('accepts a valid brief', () => {
    expect(hasBlockingErrors(validateInput(base))).toBe(false)
  })

  it('rejects a non-positive tempo', () => {
    const issues = validateInput({ ...base, bpm: 0 })
    expect(issues.some((i) => i.severity === 'error' && i.field === 'bpm')).toBe(true)
  })

  it('warns when the tempo fights the chosen intensity', () => {
    const issues = validateInput({ ...base, intensity: 'intimate', bpm: 150 })
    expect(issues.some((i) => i.field === 'bpm' && i.severity === 'warning')).toBe(true)
  })

  it('rejects an unknown production era', () => {
    const issues = validateInput({ ...base, productionEraId: 'vaporwave_2049' })
    expect(issues.some((i) => i.severity === 'error' && i.field === 'productionEraId')).toBe(true)
  })

  it('warns when the emotional destination is a verb phrase', () => {
    const issues = validateInput({ ...base, emotionalDestination: 'seguir adelante' })
    expect(issues.some((i) => i.field === 'emotionalDestination')).toBe(true)
  })
})

describe('generateSongPackage', () => {
  it('builds a complete English package with required sections', () => {
    const pkg = generateSongPackage(base)
    expect(pkg.title.length).toBeGreaterThan(0)
    expect(pkg.lyrics).toContain('[Verse')
    expect(pkg.lyrics).toContain('[Chorus')
    expect(pkg.lyrics).toContain('[Outro')
    expect(pkg.appliedRules.some((r) => r.provenance === 'documented')).toBe(true)
    expect(hasBlockingErrors(validatePackage(pkg))).toBe(false)
  })

  it('routes Spanish lyrics when language is es', () => {
    const pkg = generateSongPackage({ ...base, language: 'es' })
    expect(pkg.concept).toMatch(/protagonista|carretera/i)
    expect(pkg.lyrics).not.toMatch(/\bthe road\b/i)
  })

  it('is deterministic for the same input and variant', () => {
    const a = generateSongPackage(base)
    const b = generateSongPackage(base)
    expect(a.title).toBe(b.title)
    expect(a.stylePrompt).toBe(b.stylePrompt)
    expect(a.lyrics).toBe(b.lyrics)
  })

  it('does not depend on the order the brief object was built in', () => {
    const reordered: SongInput = {
      vocalType: base.vocalType,
      settingId: base.settingId,
      language: base.language,
      lyricalSeed: base.lyricalSeed,
      intensity: base.intensity,
      genreEmphasis: base.genreEmphasis,
      relationship: base.relationship,
      emotionalDestination: base.emotionalDestination,
      journeyStageId: base.journeyStageId,
    }
    expect(generateSongPackage(reordered).lyrics).toBe(generateSongPackage(base).lyrics)
  })

  it('formats a paste-ready Suno block', () => {
    const text = formatForSuno(generateSongPackage(base))
    expect(text).toContain('STYLE OF MUSIC:')
    expect(text).toContain('EXCLUDE STYLES:')
    expect(text).toContain('LYRICS:')
  })

  it('includes provenance checklist with sources', () => {
    const pkg = generateSongPackage(base)
    expect(pkg.appliedRules.length).toBeGreaterThan(5)
    expect(pkg.appliedRules.every((r) => r.source.length > 0)).toBe(true)
  })
})

describe('variation', () => {
  it('produces a different song for the same brief on reroll', () => {
    const first = generateSongPackage(base)
    const second = generateSongPackage({ ...base, variant: 1 })
    expect(second.lyrics).not.toBe(first.lyrics)
  })

  it('reaches many distinct choruses across variants', () => {
    const choruses = new Set<string>()
    for (let variant = 0; variant < 24; variant++) {
      const pkg = generateSongPackage({ ...base, variant })
      const chorus = pkg.lyrics.split(/\n\n/).find((block) => block.startsWith('[Chorus'))
      if (chorus) choruses.add(chorus)
    }
    expect(choruses.size).toBeGreaterThan(1)
  })

  it('varies the musical spec across variants rather than reusing one arrangement', () => {
    const specs = new Set<string>()
    for (let variant = 0; variant < 24; variant++) {
      specs.add(musicSummary(generateSongPackage({ ...base, variant }).music))
    }
    expect(specs.size).toBeGreaterThan(4)
  })

  it('gives different journey stages different lyrics', () => {
    const lyrics = new Set(
      JOURNEY_STAGES.map((stage) => generateSongPackage({ ...base, journeyStageId: stage.id }).lyrics),
    )
    expect(lyrics.size).toBe(JOURNEY_STAGES.length)
  })
})

describe('style prompt is musical, not philosophical', () => {
  const pkg = generateSongPackage(base)

  it('leads with the genre so truncation cannot cost the identity', () => {
    expect(pkg.stylePrompt.startsWith('cinematic highway rock')).toBe(true)
  })

  it('states a single tempo and a key', () => {
    expect(pkg.stylePrompt).toMatch(/\b\d{2,3} BPM\b/)
    expect(pkg.stylePrompt).toMatch(/key of /)
  })

  it('never negates inside the positive field', () => {
    expect(pkg.stylePrompt).not.toMatch(/\b(no|not|never|without|avoid)\b/i)
  })

  it('repeats no descriptor', () => {
    const tokens = pkg.stylePrompt.split(',').map((t) => t.trim().toLowerCase())
    expect(new Set(tokens).size).toBe(tokens.length)
  })

  it('stays inside the field budget', () => {
    expect(pkg.stylePrompt.length).toBeLessThanOrEqual(1000)
  })

  it('keeps exclusions in the exclude field only', () => {
    expect(pkg.negativePrompt.split(', ')).toEqual(EXCLUDED_STYLES)
  })
})

describe('arrangement', () => {
  it('always contains an instrumental solo section', () => {
    const pkg = generateSongPackage(base)
    expect(pkg.arrangement.some((s) => s.label === 'Guitar Solo')).toBe(true)
    expect(pkg.lyrics).toMatch(/\[Guitar Solo:/)
  })

  it('gives every section a production note', () => {
    const pkg = generateSongPackage(base)
    expect(pkg.arrangement.every((s) => s.note.length > 0)).toBe(true)
  })

  it('honours an explicit song form', () => {
    for (const form of SONG_FORMS) {
      const pkg = generateSongPackage({ ...base, songFormId: form.id })
      expect(pkg.music.formLabel).toBe(form.label)
      expect(pkg.arrangement).toHaveLength(form.sections.length)
    }
  })

  it('honours an explicit production era and tempo', () => {
    const era = PRODUCTION_ERAS[2]
    const pkg = generateSongPackage({ ...base, productionEraId: era.id, bpm: 99 })
    expect(pkg.music.productionEraLabel).toBe(era.label)
    expect(pkg.music.bpm).toBe(99)
    expect(pkg.stylePrompt).toContain('99 BPM')
  })
})

describe('every brief combination stays valid', () => {
  const languages: Language[] = ['en', 'es']

  it('resolves all lyric slots for every stage, setting and language', () => {
    for (const language of languages) {
      for (const stage of JOURNEY_STAGES) {
        for (const setting of SETTINGS) {
          const pkg = generateSongPackage({
            ...base,
            language,
            journeyStageId: stage.id,
            settingId: setting.id,
            relationship: undefined,
            emotionalDestination: undefined,
            lyricalSeed: undefined,
          })
          expect(pkg.lyrics).not.toMatch(/\{\w+\}/)
          expect(hasBlockingErrors(validatePackage(pkg))).toBe(false)
        }
      }
    }
  })
})
