import type {
  GenreEmphasis,
  Intensity,
  JourneyStageId,
  Language,
  SettingId,
  VocalType,
} from './schema'

export interface SongInput {
  language: Language
  journeyStageId: JourneyStageId
  settingId: SettingId
  genreEmphasis: GenreEmphasis
  intensity: Intensity
  vocalType: VocalType
  /**
   * Single target tempo. Suno locks onto one number far more reliably than a
   * range, so the old bpmMin/bpmMax pair was replaced by an optional override
   * on top of the tempo implied by the groove.
   */
  bpm?: number
  /** `undefined` lets the generator choose from the era set. */
  productionEraId?: string
  /** `undefined` lets the generator choose a form that suits the intensity. */
  songFormId?: string
  relationship?: string
  lyricalSeed?: string
  /** Noun phrase — the lyric bank places it after prepositions. */
  emotionalDestination?: string
  /**
   * Reroll counter. Same brief plus same variant always reproduces the same
   * package; bumping it redraws every seeded choice.
   */
  variant?: number
}

/** The concrete musical decisions behind a package, surfaced so they can be edited by hand. */
export interface MusicSpec {
  bpm: number
  meter: string
  feel: string
  drumNote: string
  key: string
  keyCharacter: string
  progression: string
  progressionLabel: string
  instrumentation: string[]
  vocal: string[]
  productionEraLabel: string
  productionEraTags: string
  formLabel: string
}

export interface ArrangementSection {
  /** Rendered Suno tag, e.g. `[Guitar Solo: melodic, 16 bars]`. */
  tag: string
  label: string
  note: string
}

export interface AppliedRule {
  rule: string
  provenance: 'documented' | 'inferred' | 'open'
  source: string
}

export interface SongPackage {
  id: string
  createdAt: string
  input: SongInput
  title: string
  concept: string
  stylePrompt: string
  negativePrompt: string
  lyrics: string
  music: MusicSpec
  arrangement: ArrangementSection[]
  appliedRules: AppliedRule[]
  warnings: string[]
}

export interface ValidationIssue {
  field?: string
  message: string
  severity: 'error' | 'warning'
}
