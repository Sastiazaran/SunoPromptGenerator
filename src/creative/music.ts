/**
 * Musical Language + Production Bible for Neon Highway Rock.
 *
 * Closes the two gaps the creative audit lists as open: a concrete instrument
 * vocabulary and a mix/production reference set. Everything here is `inferred`
 * from the documented era, the reference tracks and the biome language — it is
 * the sonic layer the Notion corpus never wrote down.
 *
 * Style text is written the way Suno reads best: short, concrete, comma-ready
 * noun phrases naming players and gear. No abstractions ("memory-forming"),
 * no negations — exclusions belong in the Exclude Styles field, because a
 * negated term in the positive field still steers the model toward it.
 */

import type { EmotionalFamily, GenreEmphasis, Intensity, Provenance, VocalType } from './schema'

export const MUSIC_PROVENANCE: Provenance = 'inferred'
export const MUSIC_SOURCE = 'Musical Language / Production Bible (inferred from era + reference tracks)'

/* ------------------------------------------------------------------ */
/* Instrumentation                                                     */
/* ------------------------------------------------------------------ */

export interface InstrumentPalette {
  leadGuitar: string[]
  rhythmGuitar: string[]
  bass: string[]
  drums: string[]
  keys: string[]
  /** One extra texture that keeps arrangements from all sounding like a four-piece. */
  color: string[]
}

export const INSTRUMENT_PALETTES: Record<GenreEmphasis, InstrumentPalette> = {
  aor_rock: {
    leadGuitar: [
      'singing Les Paul lead through a cranked Marshall',
      'long-sustain bent-note lead guitar with slow vibrato',
      'harmonized twin-guitar lead lines',
    ],
    rhythmGuitar: [
      'chorus-soaked clean Stratocaster arpeggios',
      'palm-muted crunch rhythm guitar double-tracked hard left and right',
      'ringing open-chord electric with light overdrive',
    ],
    bass: [
      'punchy Precision bass locked to the kick',
      'melodic fingerstyle bass walking between chord tones',
    ],
    drums: [
      'big gated-reverb snare with tight toms',
      'confident rock backbeat with open hi-hat lifts into the chorus',
    ],
    keys: [
      'Hammond B3 pad holding under the choruses',
      'glassy DX7 bell pad shimmering behind the band',
      'layered analog synth strings',
    ],
    color: [
      'stacked three-part backing vocals on the hook',
      'tambourine doubling the backbeat',
    ],
  },
  power_ballad: {
    leadGuitar: [
      'soaring melodic guitar solo, vocal-like phrasing and long sustain',
      'slide-lifted lead answering the vocal line',
    ],
    rhythmGuitar: [
      'clean arpeggiated electric with chorus and quarter-note delay',
      '12-string acoustic doubling the electric in the chorus',
    ],
    bass: [
      'round supportive bass holding whole notes through the verse',
      'bass walking up into each chorus',
    ],
    drums: [
      'half-time ballad groove, rim-clicks in the verse',
      'drums entering only at the first chorus, wide and open',
    ],
    keys: ['grand piano carrying the verse', 'warm string pad swelling under the chorus'],
    color: ['cello counter-melody in the bridge', 'soft choir pad on the final chorus'],
  },
  highway_rock: {
    leadGuitar: [
      'gritty Telecaster lead with bluesy bends',
      'short answering licks between the vocal phrases',
    ],
    rhythmGuitar: [
      'driving eighth-note crunch guitars',
      'power chords with ringing top strings',
    ],
    bass: [
      'eighth-note driving bass under the whole verse',
      'Precision bass played with a pick for attack',
    ],
    drums: [
      'four-on-the-floor rock groove moving to the ride in the chorus',
      'steady backbeat with a train-like hi-hat pulse',
    ],
    keys: ['Hammond organ swells behind the guitars', 'honky-tonk piano fills'],
    color: ['handclaps on the last chorus', 'gang backing vocals on the hook'],
  },
  blues_tinged: {
    leadGuitar: [
      'overdriven Les Paul lead full of expressive bends',
      'slide guitar crying over the changes',
    ],
    rhythmGuitar: [
      'warm overdriven combo-amp rhythm',
      'dominant-seventh chord stabs on the offbeat',
    ],
    bass: ['walking bass line with bluesy passing tones', 'loose pocket bass sitting behind the beat'],
    drums: ['shuffle groove with brushed ghost notes', 'laid-back backbeat, deliberately behind the click'],
    keys: ['Wurlitzer electric piano comping', 'Hammond organ with a slow Leslie'],
    color: ['harmonica answering the vocal', 'call-and-response backing vocals'],
  },
  country_tinged: {
    leadGuitar: [
      'clean Telecaster twang with chicken-picked fills',
      'pedal steel bending underneath the chorus',
    ],
    rhythmGuitar: [
      'strummed dreadnought acoustic driving the rhythm',
      'light electric rhythm through spring reverb',
    ],
    bass: ['root-fifth bass with a country bounce', 'upright-style bass tone, short and woody'],
    drums: ['brushed snare in a train shuffle', 'simple two-and-four backbeat, ride heavy'],
    keys: ['barroom piano in the choruses', 'organ pad low in the mix'],
    color: ['fiddle counter-line in the bridge', 'close family-harmony backing vocals'],
  },
  acoustic_night: {
    leadGuitar: [
      'fingerpicked nylon-string lead figure',
      'sparse electric answering with volume swells',
    ],
    rhythmGuitar: [
      'fingerpicked steel-string acoustic, close-miked',
      'capoed acoustic ringing on open strings',
    ],
    bass: ['upright bass playing only the roots', 'soft fretless bass sliding between notes'],
    drums: ['brushes on a small kit', 'drums held back until the final chorus, then floor tom and shaker'],
    keys: ['felt piano with the sustain pedal down', 'Rhodes chords floating behind the vocal'],
    color: ['a single cello line in the bridge', 'room tone and finger squeak left in the take'],
  },
  synth_glow: {
    leadGuitar: [
      'clean chorus-drenched lead through tape delay',
      'restrained melodic guitar line, phrase-based',
    ],
    rhythmGuitar: [
      'clean compressed guitar arpeggios',
      'muted single-coil rhythm with light overdrive',
    ],
    bass: [
      'electric bass doubled an octave down by a soft analog synth bass',
      'round bass pulse supported by a sub layer',
    ],
    drums: [
      'tight rock kit with a subtle electronic layer on the snare',
      'live drums with a soft programmed shaker',
    ],
    keys: [
      'warm Juno pad under the chords',
      'slow Prophet arpeggio sitting low in the mix',
      'glassy FM electric-piano bells',
    ],
    color: ['analog tape hiss as atmosphere', 'wordless vocal pad through the chorus'],
  },
}

/* ------------------------------------------------------------------ */
/* Harmony                                                             */
/* ------------------------------------------------------------------ */

export type HarmonicColor = 'bright' | 'shadow' | 'bittersweet'

export interface KeyCenter {
  /** Written for the style field, e.g. "D major". */
  name: string
  character: string
}

export const KEY_POOLS: Record<HarmonicColor, KeyCenter[]> = {
  bright: [
    { name: 'D major', character: 'open ringing strings, the classic road-rock key' },
    { name: 'A major', character: 'bright and forward, easy for a belted chorus' },
    { name: 'E major', character: 'full low-string resonance, big rock spread' },
    { name: 'G major', character: 'warm and folk-leaning, sits under a storyteller vocal' },
    { name: 'C major', character: 'plain and honest, nothing to hide behind' },
  ],
  shadow: [
    { name: 'A minor', character: 'plain-spoken sadness, understated' },
    { name: 'E minor', character: 'deep open-string weight' },
    { name: 'B minor', character: 'tense and restless, wants to resolve' },
    { name: 'F# minor', character: 'cold and reflective, good for close vocals' },
    { name: 'D minor', character: 'heavy and grounded' },
  ],
  bittersweet: [
    { name: 'E Mixolydian', character: 'major with a flat seventh — hopeful but unresolved' },
    { name: 'D Mixolydian', character: 'highway modality, endless forward motion' },
    { name: 'A Dorian', character: 'minor with a bright sixth, melancholy that keeps moving' },
    { name: 'B minor verse lifting into D major chorus', character: 'the shape of the change itself' },
    { name: 'E minor verse resolving to G major chorus', character: 'shadow opening into gratitude' },
  ],
}

export interface Progression {
  roman: string
  label: string
}

export const PROGRESSIONS: Record<HarmonicColor, Progression[]> = {
  bright: [
    { roman: 'I–V–vi–IV', label: 'anthemic cycle' },
    { roman: 'I–bVII–IV–I', label: 'Mixolydian highway turnaround' },
    { roman: 'I–iii–IV–V', label: 'classic AOR lift' },
    { roman: 'IV–I–V–vi', label: 'chorus that starts already airborne' },
  ],
  shadow: [
    { roman: 'i–bVI–bIII–bVII', label: 'Aeolian power-ballad cycle' },
    { roman: 'i–bVII–bVI–V', label: 'descending rock line' },
    { roman: 'i–iv–bVII–bIII', label: 'brooding minor verse' },
  ],
  bittersweet: [
    { roman: 'vi–IV–I–V', label: 'bittersweet lift into hope' },
    { roman: 'i–bIII–bVII–IV', label: 'Dorian brightening, a major-IV window in a minor room' },
    { roman: 'vi–V–IV–V', label: 'suspended turn left unresolved' },
    { roman: 'I–V–vi–iii–IV', label: 'long descending bass line under a steady melody' },
  ],
}

/** Which harmonic colour each stretch of the journey lives in. */
export const FAMILY_HARMONY: Record<EmotionalFamily, HarmonicColor[]> = {
  ignition: ['bright', 'bittersweet'],
  bond: ['bright', 'bittersweet'],
  rupture: ['shadow', 'bittersweet'],
  resolve: ['bittersweet', 'bright'],
  homecoming: ['bittersweet', 'bright'],
}

/* ------------------------------------------------------------------ */
/* Rhythm                                                              */
/* ------------------------------------------------------------------ */

export interface GrooveFeel {
  meter: string
  feel: string
  drumNote: string
  /** A single target tempo. Suno follows one number far more reliably than a range. */
  bpm: number
}

export const GROOVE_FEELS: Record<Intensity, GrooveFeel[]> = {
  intimate: [
    { meter: '4/4', feel: 'slow ballad feel with rubato phrasing', drumNote: 'brushes and rim-clicks, full backbeat saved for late', bpm: 72 },
    { meter: '6/8', feel: 'rolling 6/8 ballad', drumNote: 'soft triplet pulse on the ride', bpm: 66 },
    { meter: '12/8', feel: 'slow triplet blues-ballad feel', drumNote: 'shuffled ghost notes in a deep pocket', bpm: 62 },
    { meter: '4/4', feel: 'sparse held-chord feel, silence used as an instrument', drumNote: 'floor tom and shaker only', bpm: 78 },
  ],
  steady: [
    { meter: '4/4', feel: 'straight eighths with a relaxed backbeat', drumNote: 'closed hats, snare on two and four', bpm: 92 },
    { meter: '4/4', feel: 'half-time verse opening into a full-time chorus', drumNote: 'rim-click verse, full kit chorus', bpm: 96 },
    { meter: '4/4', feel: 'light shuffle swing', drumNote: 'swung hats with ghost-note snare', bpm: 88 },
    { meter: '4/4', feel: 'midtempo pocket that sits slightly behind the beat', drumNote: 'ride bell accents on the turnaround', bpm: 100 },
  ],
  driving: [
    { meter: '4/4', feel: 'straight-ahead eighth-note drive', drumNote: 'driving hats, ride through the chorus', bpm: 112 },
    { meter: '4/4', feel: 'four-on-the-floor road pulse', drumNote: 'kick on every beat, open-hat accents', bpm: 118 },
    { meter: '4/4', feel: 'sixteenth-note hi-hat momentum', drumNote: 'tight kit, busy hats, crashes on every turnaround', bpm: 108 },
    { meter: '4/4', feel: 'train-beat drive under a steady vocal', drumNote: 'snare rolling sixteenths, kick on one and three', bpm: 122 },
  ],
  soaring: [
    { meter: '4/4', feel: 'half-time verse into a wide anthemic chorus', drumNote: 'huge open chorus, crash on every bar', bpm: 104 },
    { meter: '4/4', feel: 'eighth-note build releasing into a stadium chorus', drumNote: 'tom-driven build, full-kit release', bpm: 100 },
    { meter: '6/8', feel: '6/8 anthem swell', drumNote: 'triplet ride pattern, big fills into each chorus', bpm: 96 },
    { meter: '4/4', feel: 'steady verse with a double-time chorus lift', drumNote: 'hats doubling as the chorus lands', bpm: 110 },
  ],
}

/* ------------------------------------------------------------------ */
/* Production                                                          */
/* ------------------------------------------------------------------ */

export interface ProductionEra {
  id: string
  label: string
  tags: string
}

export const PRODUCTION_ERAS: ProductionEra[] = [
  {
    id: 'plate_70s',
    label: 'Late-70s road rock',
    tags: 'natural room drums, EMT plate reverb, ribbon-mic warmth, light compression, tracked live',
  },
  {
    id: 'aor_80s',
    label: '80s AOR',
    tags: 'SSL console sheen, gated reverb snare, wide chorus on the guitars, stacked backing vocals, long reverb tails',
  },
  {
    id: 'dry_90s',
    label: 'Early-90s rock',
    tags: 'dry punchy drums in a live room, tape saturation on the mix bus, close-miked guitars, little reverb',
  },
  {
    id: 'cinematic_modern',
    label: 'Modern cinematic',
    tags: 'wide stereo image, controlled low end, analog tape glue, dynamics left intact',
  },
]

/** Applies to every mix regardless of era — the documented "space" requirement. */
export const MIX_LAW = 'chorus mixed wider than the verse, headroom kept, vocal always front and dry-ish'

/* ------------------------------------------------------------------ */
/* Voice                                                               */
/* ------------------------------------------------------------------ */

export interface VocalDelivery {
  register: string
  texture: string[]
  harmony: string[]
  delivery: string[]
}

export const VOCAL_DELIVERY: Record<VocalType, VocalDelivery> = {
  warm_male: {
    register: 'warm baritone lead sitting in chest voice',
    texture: ['close-miked with light plate reverb', 'slight rasp on the held notes'],
    harmony: ['octave double and a third above on the hook', 'single low harmony under the chorus'],
    delivery: [
      'conversational verses opening into a full-voiced chorus',
      'phrases landing slightly late, like someone thinking while speaking',
    ],
  },
  warm_female: {
    register: 'warm alto lead with an airy top',
    texture: ['intimate close-mic, breath left in', 'soft doubling on the chorus only'],
    harmony: ['thirds above on the hook', 'wordless high harmony floating over the last chorus'],
    delivery: ['restrained verses, chorus full but controlled', 'long sustained vowels on the hook'],
  },
  duet: {
    register: 'male and female leads trading lines',
    texture: ['both voices close-miked, panned slightly apart', 'unison only when the hook lands'],
    harmony: ['sixths and thirds on the final chorus', 'call-and-response through the second verse'],
    delivery: ['conversational trade-offs, like two people in a car', 'one voice answering the other'],
  },
  raspy_storyteller: {
    register: 'raspy storytelling rock lead',
    texture: ['dry and forward, grit on the top of the range', 'raw take-one feel, pitch left human'],
    harmony: ['gang vocals only on the hook', 'octave double on the last chorus'],
    delivery: ['half-spoken verses building to a full-voice chorus', 'lyrics delivered like a recollection'],
  },
  clear_belter: {
    register: 'clear powerful rock lead with an open top register',
    texture: ['bright and present with a tall reverb on the hook', 'controlled vibrato on long notes'],
    harmony: ['three-part stack on the chorus', 'answering harmony line in the bridge'],
    delivery: ['held back in the verse so the chorus has somewhere to go', 'full belt reserved for the final chorus'],
  },
}

/* ------------------------------------------------------------------ */
/* Arrangement                                                         */
/* ------------------------------------------------------------------ */

export type SectionRole =
  | 'intro'
  | 'verse'
  | 'pre'
  | 'chorus'
  | 'bridge'
  | 'solo'
  | 'breakdown'
  | 'final_chorus'
  | 'outro'

export interface SectionSpec {
  role: SectionRole
  /** Arrangement note rendered inside the Suno section tag. */
  note: string
}

export interface SongForm {
  id: string
  label: string
  sections: SectionSpec[]
}

export const SONG_FORMS: SongForm[] = [
  {
    id: 'classic_aor',
    label: 'Classic AOR',
    sections: [
      { role: 'intro', note: 'clean guitar arpeggio, 8 bars, band enters on the last two' },
      { role: 'verse', note: 'bass and hi-hat only, vocal close and dry' },
      { role: 'pre', note: 'guitars enter, drums build on the toms' },
      { role: 'chorus', note: 'full band, wide guitars, backing vocal stack' },
      { role: 'verse', note: 'drums stay in, add organ pad underneath' },
      { role: 'pre', note: 'same build, one degree hotter' },
      { role: 'chorus', note: 'full band, harmony added above the lead' },
      { role: 'solo', note: 'melodic guitar solo, 16 bars, vocal-like phrasing over the chorus changes' },
      { role: 'bridge', note: 'drop to keys and voice, cymbals held out' },
      { role: 'final_chorus', note: 'full stack, crash on every bar, lead ad-libs over the top' },
      { role: 'outro', note: 'band decays, last phrase left to a single guitar' },
    ],
  },
  {
    id: 'ballad_build',
    label: 'Ballad build',
    sections: [
      { role: 'intro', note: 'solo piano, 4 bars, drums held out' },
      { role: 'verse', note: 'voice and piano alone' },
      { role: 'chorus', note: 'drums and bass enter, strings swell underneath' },
      { role: 'verse', note: 'add clean electric arpeggio, keep the kit soft' },
      { role: 'chorus', note: 'wider, backing vocals join on the second half' },
      { role: 'bridge', note: 'strip to voice and one held chord, then rebuild' },
      { role: 'solo', note: 'guitar solo entering quietly and growing, 12 bars' },
      { role: 'final_chorus', note: 'full arrangement, highest note of the song lands here' },
      { role: 'outro', note: 'return to solo piano, unresolved final chord' },
    ],
  },
  {
    id: 'two_verse_drive',
    label: 'Two-verse drive',
    sections: [
      { role: 'intro', note: 'guitar riff over drums, 4 bars' },
      { role: 'verse', note: 'riff continues underneath, vocal on top' },
      { role: 'chorus', note: 'open chords, whole band pushing forward' },
      { role: 'verse', note: 'add organ, bass moves to eighths' },
      { role: 'chorus', note: 'same but with gang backing vocals' },
      { role: 'solo', note: 'short punchy guitar solo, 8 bars over the verse changes' },
      { role: 'breakdown', note: 'drums and bass only, guitars out, vocal half-spoken' },
      { role: 'final_chorus', note: 'everything back in at once, sudden full band' },
      { role: 'outro', note: 'riff repeats and fades under the engine of the mix' },
    ],
  },
  {
    id: 'slow_burn',
    label: 'Slow burn',
    sections: [
      { role: 'intro', note: 'atmosphere and one sustained guitar note, 8 bars' },
      { role: 'verse', note: 'sparse, more space than notes' },
      { role: 'verse', note: 'same texture, one instrument added' },
      { role: 'pre', note: 'first real lift, drums finally commit' },
      { role: 'chorus', note: 'wide and released, the payoff of the whole first half' },
      { role: 'bridge', note: 'key instrument drops out, leaving voice exposed' },
      { role: 'solo', note: 'restrained solo that stays under the vocal melody, 16 bars' },
      { role: 'final_chorus', note: 'full band, doubled lead vocal, longest sustain of the song' },
      { role: 'outro', note: 'one instrument at a time leaves until only the room remains' },
    ],
  },
]

/** Forms that suit each energy level, so a ballad never gets a train-beat arrangement. */
export const FORM_PREFERENCE: Record<Intensity, string[]> = {
  intimate: ['ballad_build', 'slow_burn'],
  steady: ['classic_aor', 'slow_burn', 'two_verse_drive'],
  driving: ['two_verse_drive', 'classic_aor'],
  soaring: ['classic_aor', 'ballad_build', 'slow_burn'],
}

/** Suno reads these as structural instructions, not lyrics. */
export const SECTION_TAGS: Record<SectionRole, string> = {
  intro: 'Intro',
  verse: 'Verse',
  pre: 'Pre-Chorus',
  chorus: 'Chorus',
  bridge: 'Bridge',
  solo: 'Guitar Solo',
  breakdown: 'Breakdown',
  final_chorus: 'Final Chorus',
  outro: 'Outro',
}

/* ------------------------------------------------------------------ */
/* Exclusions                                                          */
/* ------------------------------------------------------------------ */

/**
 * Musical exclusions only. Thematic bans (celebrity lyrics, closed tragic
 * endings) are enforced on the lyrics by `validate.ts`; putting them in Suno's
 * Exclude Styles field wastes the slot on things it cannot act on.
 */
export const EXCLUDED_STYLES: string[] = [
  'death metal',
  'metalcore',
  'screamed vocals',
  'trap beats',
  'EDM drops',
  'four-on-the-floor dance production',
  'hyper-saturated synthwave',
  'chiptune',
  'autotuned vocals',
  'rap verses',
  'orchestral bombast',
  'shred guitar wankery',
  'lo-fi hiss as the main aesthetic',
]
