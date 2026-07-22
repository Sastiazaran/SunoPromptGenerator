/**
 * Neon Highway Rock creative schema for the Suno Prompt Studio.
 * Each rule carries provenance: documented (hard), inferred (soft), or open.
 */

export type Provenance = 'documented' | 'inferred' | 'open'

export type Language = 'en' | 'es'

export type JourneyStageId =
  | 'beginning'
  | 'discovery'
  | 'connection'
  | 'passion'
  | 'fracture'
  | 'silence'
  | 'decision'
  | 'rebirth'
  | 'return'
  | 'horizon'

export type SettingId =
  | 'gas_station'
  | 'diner'
  | 'motel'
  | 'overlook'
  | 'coastal'
  | 'desert'
  | 'mountain'
  | 'urban_neon'
  | 'midnight_rain'
  | 'blue_horizon'

export type GenreEmphasis =
  | 'aor_rock'
  | 'power_ballad'
  | 'highway_rock'
  | 'blues_tinged'
  | 'country_tinged'
  | 'acoustic_night'
  | 'synth_glow'

export type Intensity = 'intimate' | 'steady' | 'driving' | 'soaring'

export type VocalType =
  | 'warm_male'
  | 'warm_female'
  | 'duet'
  | 'raspy_storyteller'
  | 'clear_belter'

export interface Provenanced<T> {
  value: T
  provenance: Provenance
  source: string
}

export interface JourneyStage {
  id: JourneyStageId
  label: { en: string; es: string }
  dominantEmotion: { en: string; es: string }
  themes: { en: string[]; es: string[] }
  provenance: Provenance
  source: string
}

export interface Setting {
  id: SettingId
  label: { en: string; es: string }
  sonicHint: string
  imagery: { en: string[]; es: string[] }
  provenance: Provenance
  source: string
}

export const NORTH_STAR: Provenanced<string> = {
  value:
    'Neon Highway Rock is the soundtrack of human transitions: songs that accompany the kilometers between who someone was and who they become.',
  provenance: 'documented',
  source: 'Banderas de Diseño / Philosophy Manifest',
}

export const THREE_FLAGS: Provenanced<string>[] = [
  {
    value: 'Inner Journey — accompany the kilometers toward the next version of the self.',
    provenance: 'documented',
    source: 'Banderas de Diseño',
  },
  {
    value: 'Change Perception — do not change the world; change how a moment feels.',
    provenance: 'documented',
    source: 'Banderas de Diseño',
  },
  {
    value: 'Become Memory — the song should attach itself to a real journey memory.',
    provenance: 'documented',
    source: 'Banderas de Diseño',
  },
]

export const CREATIVE_DNA: Provenanced<string>[] = [
  {
    value: 'Songs are about people discovering who they are while moving forward.',
    provenance: 'documented',
    source: 'Creative DNA v1.0 — Journey Law',
  },
  {
    value: 'Music serves human experience, never virtuosity.',
    provenance: 'documented',
    source: 'Creative DNA v1.0 — Experience Law',
  },
  {
    value: 'A great song becomes part of the listener’s memory.',
    provenance: 'documented',
    source: 'Creative DNA v1.0 — Memory Law',
  },
  {
    value: 'The outer world molds the person living the story.',
    provenance: 'documented',
    source: 'Creative DNA v1.0 — World Mirror Law',
  },
  {
    value: 'Human relationships are the true engine of the journey.',
    provenance: 'documented',
    source: 'Creative DNA v1.0 — Human Connection Law',
  },
  {
    value: 'Beauty and pain can coexist.',
    provenance: 'documented',
    source: 'Creative DNA v1.0 — Human Truth Law',
  },
  {
    value: 'Hope is continuing without guarantees.',
    provenance: 'documented',
    source: 'Creative DNA v1.0 — Hope Law',
  },
  {
    value: 'Music walks beside the journey; it never forces the feeling.',
    provenance: 'documented',
    source: 'Banderas de Diseño — companion principle',
  },
]

export const HARD_RULES: Provenanced<string>[] = [
  {
    value: 'Every song must answer: which road segment is the protagonist on?',
    provenance: 'documented',
    source: 'World Building',
  },
  {
    value: 'Every song must answer: which life segment is the protagonist living?',
    provenance: 'documented',
    source: 'World Building',
  },
  {
    value: 'Before writing: journey stage, relationship at stake, what changes, physical route that mirrors the change.',
    provenance: 'documented',
    source: 'Human Journey Atlas — Golden Rule',
  },
  {
    value: 'The destination is never the main theme; who the protagonist becomes is.',
    provenance: 'documented',
    source: 'Human Journey Atlas',
  },
  {
    value: 'Leave a door open — write chapters, not closed endings.',
    provenance: 'documented',
    source: 'Philosophy Manifest / Experience Manifest',
  },
  {
    value: 'Nostalgia is luminous gratitude, never pure despair.',
    provenance: 'documented',
    source: 'Experience Manifest / Philosophy Manifest',
  },
  {
    value: 'Ordinary people, extraordinary moment. No celebrities, no villains.',
    provenance: 'documented',
    source: 'World Building / Philosophy Manifest',
  },
  {
    value: 'Listener must be able to inhabit the protagonist — avoid hyper-specific biography that excludes projection.',
    provenance: 'documented',
    source: 'Creative Manifest — Immersion',
  },
]

export const BANNED_CLICHES: Provenanced<string>[] = [
  {
    value: 'Toxic melodrama / “I lost you forever” as the only emotional color',
    provenance: 'documented',
    source: 'World Building — Emotions',
  },
  {
    value: 'Night as fear or threat',
    provenance: 'documented',
    source: 'Experience Manifest',
  },
  {
    value: 'Nostalgia as pure sadness without gratitude or hope',
    provenance: 'documented',
    source: 'Experience Manifest',
  },
  {
    value: 'Cars/motorcycles as the subject instead of people',
    provenance: 'documented',
    source: 'Philosophy Manifest',
  },
  {
    value: 'Hyper-saturated neon synthwave visual/sonic cliché as default identity',
    provenance: 'documented',
    source: 'World Building — Colors',
  },
  {
    value: 'Show-off virtuosity that overpowers the emotional scene',
    provenance: 'documented',
    source: 'Creative DNA — Experience Law',
  },
]

export const TONE: Provenanced<string> = {
  value: 'Luminous melancholy (melancolía luminosa) — tender, cinematic, hopeful forward motion',
  provenance: 'documented',
  source: 'Song Generation Engine — Tone (provisional name accepted as working tone)',
}

export const JOURNEY_STAGES: JourneyStage[] = [
  {
    id: 'beginning',
    label: { en: 'The Beginning', es: 'El Comienzo' },
    dominantEmotion: { en: 'Expectation', es: 'Expectativa' },
    themes: {
      en: ['first car', 'first motorcycle', 'first aimless trip', 'first love', 'leaving home'],
      es: ['primer auto', 'primera moto', 'primer viaje sin rumbo', 'primer amor', 'salir de casa'],
    },
    provenance: 'documented',
    source: 'Human Journey Atlas I',
  },
  {
    id: 'discovery',
    label: { en: 'Discovery', es: 'El Descubrimiento' },
    dominantEmotion: { en: 'Curiosity', es: 'Curiosidad' },
    themes: {
      en: ['falling in love unnoticed', 'life-changing friendship', 'finding vocation', 'sharing kilometers'],
      es: ['enamorarse sin darse cuenta', 'amistad que cambia la vida', 'descubrir una vocación', 'compartir kilómetros'],
    },
    provenance: 'documented',
    source: 'Human Journey Atlas II',
  },
  {
    id: 'connection',
    label: { en: 'Connection', es: 'La Conexión' },
    dominantEmotion: { en: 'Trust', es: 'Confianza' },
    themes: {
      en: ['driving without needing to talk', 'promises', 'feeling at home far away'],
      es: ['manejar sin necesidad de hablar', 'promesas', 'sentirse en casa lejos'],
    },
    provenance: 'documented',
    source: 'Human Journey Atlas III',
  },
  {
    id: 'passion',
    label: { en: 'Passion', es: 'La Pasión' },
    dominantEmotion: { en: 'Surrender', es: 'Entrega' },
    themes: {
      en: ['desire', 'adrenaline', 'improvised trips', 'need to see someone at 3am'],
      es: ['deseo', 'adrenalina', 'viajes improvisados', 'necesidad de ver a alguien a las 3am'],
    },
    provenance: 'documented',
    source: 'Human Journey Atlas IV',
  },
  {
    id: 'fracture',
    label: { en: 'Fracture', es: 'La Fractura' },
    dominantEmotion: { en: 'Pain with hope', es: 'Dolor con esperanza' },
    themes: {
      en: ['breakup', 'goodbye', 'lost dream', 'growing up', 'understanding without blaming'],
      es: ['ruptura', 'despedida', 'sueño perdido', 'crecer', 'comprender sin culpar'],
    },
    provenance: 'documented',
    source: 'Human Journey Atlas V',
  },
  {
    id: 'silence',
    label: { en: 'Silence', es: 'El Silencio' },
    dominantEmotion: { en: 'Introspection', es: 'Introspección' },
    themes: {
      en: ['driving with no destination', 'radio off', 'rain', 'coffee alone', 'transformation begins'],
      es: ['manejar sin destino', 'radio apagada', 'lluvia', 'café solo', 'comienza la transformación'],
    },
    provenance: 'documented',
    source: 'Human Journey Atlas VI',
  },
  {
    id: 'decision',
    label: { en: 'Decision', es: 'La Decisión' },
    dominantEmotion: { en: 'Courage', es: 'Valor' },
    themes: {
      en: ['forgive', 'stay or go', 'call or stay silent', 'choose a lane'],
      es: ['perdonar', 'quedarse o irse', 'llamar o guardar silencio', 'elegir un carril'],
    },
    provenance: 'documented',
    source: 'Human Journey Atlas VII',
  },
  {
    id: 'rebirth',
    label: { en: 'Rebirth', es: 'El Renacer' },
    dominantEmotion: { en: 'Freedom', es: 'Libertad' },
    themes: {
      en: ['moving again', 'hope not euphoria', 'accepting forward motion'],
      es: ['volver a moverse', 'esperanza no euforia', 'aceptar seguir adelante'],
    },
    provenance: 'documented',
    source: 'Human Journey Atlas VIII',
  },
  {
    id: 'return',
    label: { en: 'Return', es: 'El Regreso' },
    dominantEmotion: { en: 'Luminous nostalgia', es: 'Nostalgia luminosa' },
    themes: {
      en: ['coming home', 'same road years later', 'everything looks the same, nothing is'],
      es: ['volver a casa', 'misma carretera años después', 'todo parece igual, nada lo es'],
    },
    provenance: 'documented',
    source: 'Human Journey Atlas IX',
  },
  {
    id: 'horizon',
    label: { en: 'Horizon', es: 'El Horizonte' },
    dominantEmotion: { en: 'Hope', es: 'Esperanza' },
    themes: {
      en: ['another road', 'invitation not conclusion', 'listener keeps moving'],
      es: ['otra carretera', 'invitación no conclusión', 'el oyente sigue avanzando'],
    },
    provenance: 'documented',
    source: 'Human Journey Atlas X',
  },
]

export const SETTINGS: Setting[] = [
  {
    id: 'gas_station',
    label: { en: 'Midnight gas station', es: 'Gasolinera de madrugada' },
    sonicHint: 'intimate clean guitars, warm bass, contained drums',
    imagery: {
      en: ['2:13 AM', 'fluorescent hum', 'coffee and gasoline', 'one pump occupied'],
      es: ['2:13 AM', 'zumbido fluorescente', 'café y gasolina', 'un surtidor ocupado'],
    },
    provenance: 'documented',
    source: 'World Building — Sacred Places',
  },
  {
    id: 'diner',
    label: { en: 'All-night diner', es: 'Diner abierto toda la noche' },
    sonicHint: 'ballad space, soft classic rock undercurrent, warm vocals',
    imagery: {
      en: ['always-on coffee pot', 'worn mugs', 'waitresses who know regulars'],
      es: ['cafetera que nunca para', 'tazas gastadas', 'camareras que conocen a los viajeros'],
    },
    provenance: 'documented',
    source: 'World Building — Sacred Places',
  },
  {
    id: 'motel',
    label: { en: 'Roadside motel', es: 'Motel de carretera' },
    sonicHint: 'restful midtempo, reflective guitars, soft pads of night air',
    imagery: {
      en: ['blinking neon', 'simple room', 'bikes outside', 'parking-lot window'],
      es: ['neón parpadeante', 'habitación sencilla', 'motos afuera', 'ventana al estacionamiento'],
    },
    provenance: 'documented',
    source: 'World Building — Sacred Places',
  },
  {
    id: 'overlook',
    label: { en: 'Overlook', es: 'Mirador' },
    sonicHint: 'space for guitar solos, silence as instrument, wide stereo',
    imagery: {
      en: ['engine off', 'immense landscape', 'unmarked pull-off'],
      es: ['motor apagado', 'paisaje inmenso', 'parada sin señalizar'],
    },
    provenance: 'documented',
    source: 'World Building — Sacred Places',
  },
  {
    id: 'coastal',
    label: { en: 'Coastal highway', es: 'Autopista costera' },
    sonicHint: 'luminous grooves, open choruses, wind-in-the-mix feel',
    imagery: {
      en: ['sea between curves', 'salt and wind', 'rhythm over destination'],
      es: ['mar entre curvas', 'sal y viento', 'ritmo sobre destino'],
    },
    provenance: 'documented',
    source: 'World Building — Sacred Places',
  },
  {
    id: 'desert',
    label: { en: 'Desert highway', es: 'Carretera del desierto' },
    sonicHint: 'minimalist arrangement, breathing instruments, sparse percussion',
    imagery: {
      en: ['perfect night temperature', 'immense stars', 'no light pollution'],
      es: ['temperatura perfecta', 'estrellas inmensas', 'sin contaminación lumínica'],
    },
    provenance: 'documented',
    source: 'World Building — Sacred Places',
  },
  {
    id: 'mountain',
    label: { en: 'Mountain road', es: 'Carretera de montaña' },
    sonicHint: 'more guitar presence, echoing engine between trees, long curves',
    imagery: {
      en: ['long curves', 'forest', 'fog', 'small towns'],
      es: ['curvas largas', 'bosque', 'neblina', 'pueblos pequeños'],
    },
    provenance: 'documented',
    source: 'World Building — Sacred Places',
  },
  {
    id: 'urban_neon',
    label: { en: 'Urban Neon', es: 'Urban Neon' },
    sonicHint: 'reflective city pulse, restrained drive, glass-and-concrete sheen',
    imagery: {
      en: ['reflections', 'glass', 'concrete', 'city center'],
      es: ['reflejos', 'cristal', 'concreto', 'centro de ciudad'],
    },
    provenance: 'documented',
    source: 'Experience Manifest — Biomes',
  },
  {
    id: 'midnight_rain',
    label: { en: 'Midnight Rain', es: 'Midnight Rain' },
    sonicHint: 'wet-night atmosphere, soft delay, intimate vocal close-mic',
    imagery: {
      en: ['light rain', 'neon reflections', 'reduced visibility'],
      es: ['lluvia ligera', 'neón reflejado', 'visibilidad reducida'],
    },
    provenance: 'documented',
    source: 'Experience Manifest — Biomes',
  },
  {
    id: 'blue_horizon',
    label: { en: 'Blue Horizon', es: 'Blue Horizon' },
    sonicHint: 'pre-dawn lift, hopeful pads under rock band, open sky chorus',
    imagery: {
      en: ['just before sunrise', 'sky clearing', 'stars still visible'],
      es: ['justo antes del amanecer', 'cielo aclarando', 'todavía hay estrellas'],
    },
    provenance: 'documented',
    source: 'Experience Manifest — Biomes',
  },
]

/** Sonic defaults — Musical Language bible is incomplete; these are inferred. */
export const SONIC_DEFAULTS = {
  genreCore: {
    value:
      'cinematic highway rock / AOR rock with power-ballad space, late-70s to mid-90s American road myth atmosphere',
    provenance: 'inferred' as Provenance,
    source: 'World Building era + reference songs (Is This Love, Cryin’, Crazy) + Song Generation Engine gaps',
  },
  allowedFlavors: {
    value: ['country', 'blues', 'soft synth glow', 'acoustic'] as const,
    provenance: 'documented' as Provenance,
    source: 'Philosophy Manifest — style may change; identity must survive',
  },
  production: {
    value:
      'wide cinematic mix, breathing room, sustained guitar notes, choruses that open the horizon, music amplifies landscape instead of competing',
    provenance: 'inferred' as Provenance,
    source: 'Experience Manifest + World Building space/air language',
  },
  bpmByIntensity: {
    intimate: [68, 86] as [number, number],
    steady: [88, 104] as [number, number],
    driving: [106, 122] as [number, number],
    soaring: [96, 118] as [number, number],
    provenance: 'inferred' as Provenance,
    source: 'Open — Musical Language / Production Bible not written',
  },
}

export const GENRE_EMPHASIS_LABELS: Record<
  GenreEmphasis,
  { en: string; es: string; styleTags: string; provenance: Provenance }
> = {
  aor_rock: {
    en: 'AOR Rock',
    es: 'AOR Rock',
    styleTags: 'AOR rock, melodic hard rock, polished 80s-90s highway rock',
    provenance: 'inferred',
  },
  power_ballad: {
    en: 'Power Ballad',
    es: 'Power Ballad',
    styleTags: 'power ballad, emotional rock ballad, soaring chorus',
    provenance: 'documented',
  },
  highway_rock: {
    en: 'Highway Rock',
    es: 'Highway Rock',
    styleTags: 'cinematic highway rock, road-trip rock, open-road groove',
    provenance: 'inferred',
  },
  blues_tinged: {
    en: 'Blues-tinged',
    es: 'Toque blues',
    styleTags: 'blues-tinged rock, warm guitar bends, late-night honesty',
    provenance: 'documented',
  },
  country_tinged: {
    en: 'Country-tinged',
    es: 'Toque country',
    styleTags: 'country-tinged rock, storytelling vocal, Americana highway',
    provenance: 'documented',
  },
  acoustic_night: {
    en: 'Acoustic Night',
    es: 'Noche acústica',
    styleTags: 'acoustic rock ballad, intimate night drive, sparse arrangement',
    provenance: 'documented',
  },
  synth_glow: {
    en: 'Soft Synth Glow',
    es: 'Brillo synth suave',
    styleTags: 'rock with soft synth glow, restrained neon atmosphere, not hyper-saturated synthwave',
    provenance: 'documented',
  },
}

export const VOCAL_LABELS: Record<VocalType, { en: string; es: string; style: string }> = {
  warm_male: {
    en: 'Warm male lead',
    es: 'Voz masculina cálida',
    style: 'warm male lead vocal, emotional but restrained',
  },
  warm_female: {
    en: 'Warm female lead',
    es: 'Voz femenina cálida',
    style: 'warm female lead vocal, intimate and cinematic',
  },
  duet: {
    en: 'Duet',
    es: 'Dúo',
    style: 'male-female duet vocals, conversational intimacy',
  },
  raspy_storyteller: {
    en: 'Raspy storyteller',
    es: 'Narrador ronco',
    style: 'raspy storytelling rock vocal',
  },
  clear_belter: {
    en: 'Clear belter',
    es: 'Voz clara potente',
    style: 'clear belting rock vocal for soaring choruses',
  },
}

export const OPEN_DECISIONS: string[] = [
  'Official Musical Language bible (instrument nicknames, riff vocabulary)',
  'Production Bible (Marshall, plate reverb, doubles — still empty)',
  'Exact BPM ranges per biome',
  'Official tone name beyond provisional “melancolía luminosa”',
  'Story Seeds corpus and Human Archetypes catalog',
  'Whether Spanish and English catalogs share the same sonic defaults',
]

export const SCHEMA_VERSION = '1.0.0'
