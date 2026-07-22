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
  bpmMin?: number
  bpmMax?: number
  relationship?: string
  lyricalSeed?: string
  emotionalDestination?: string
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
  appliedRules: AppliedRule[]
  warnings: string[]
}

export interface ValidationIssue {
  field?: string
  message: string
  severity: 'error' | 'warning'
}
