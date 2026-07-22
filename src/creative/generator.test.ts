import { describe, expect, it } from 'vitest'
import { formatForSuno, generateSongPackage } from './generator'
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
  emotionalDestination: 'luminous hope',
  lyricalSeed: 'same pump at 2am',
}

describe('validateInput', () => {
  it('accepts a valid brief', () => {
    expect(hasBlockingErrors(validateInput(base))).toBe(false)
  })

  it('rejects inverted BPM range', () => {
    const issues = validateInput({ ...base, bpmMin: 140, bpmMax: 90 })
    expect(issues.some((i) => i.severity === 'error' && i.field === 'bpm')).toBe(true)
  })
})

describe('generateSongPackage', () => {
  it('builds a complete English package with required sections', () => {
    const pkg = generateSongPackage(base)
    expect(pkg.title.length).toBeGreaterThan(0)
    expect(pkg.stylePrompt.length).toBeGreaterThan(40)
    expect(pkg.lyrics).toContain('[Verse]')
    expect(pkg.lyrics).toContain('[Chorus]')
    expect(pkg.lyrics).toContain('[Outro]')
    expect(pkg.appliedRules.some((r) => r.provenance === 'documented')).toBe(true)
    expect(hasBlockingErrors(validatePackage(pkg))).toBe(false)
  })

  it('routes Spanish lyrics when language is es', () => {
    const pkg = generateSongPackage({ ...base, language: 'es' })
    expect(pkg.lyrics).toMatch(/No persigo el destino|carretera/i)
    expect(pkg.concept).toMatch(/protagonista|carretera/i)
  })

  it('is deterministic for the same input', () => {
    const a = generateSongPackage(base)
    const b = generateSongPackage(base)
    expect(a.title).toBe(b.title)
    expect(a.stylePrompt).toBe(b.stylePrompt)
    expect(a.lyrics).toBe(b.lyrics)
  })

  it('formats a paste-ready Suno block', () => {
    const pkg = generateSongPackage(base)
    const text = formatForSuno(pkg)
    expect(text).toContain('STYLE OF MUSIC:')
    expect(text).toContain('LYRICS:')
    expect(text).toContain(pkg.title)
  })

  it('includes provenance checklist with sources', () => {
    const pkg = generateSongPackage(base)
    expect(pkg.appliedRules.length).toBeGreaterThan(5)
    expect(pkg.appliedRules.every((r) => r.source.length > 0)).toBe(true)
  })
})
