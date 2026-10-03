import { useEffect, useState, type FormEvent } from 'react'
import {
  GENRE_EMPHASIS_LABELS,
  JOURNEY_STAGES,
  OPEN_DECISIONS,
  SCHEMA_VERSION,
  SETTINGS,
  SONIC_DEFAULTS,
  VOCAL_LABELS,
  type GenreEmphasis,
  type Intensity,
  type JourneyStageId,
  type Language,
  type SettingId,
  type VocalType,
} from './creative/schema'
import { PRODUCTION_ERAS, SONG_FORMS } from './creative/music'
import { formatForSuno, generateSongPackage, musicSummary } from './creative/generator'
import { clearHistory, loadHistory, saveToHistory } from './creative/history'
import type { SongInput, SongPackage } from './creative/types'
import { validateInput } from './creative/validate'
import './App.css'

const INTENSITIES: Intensity[] = ['intimate', 'steady', 'driving', 'soaring']

const DEFAULT_INPUT: SongInput = {
  language: 'en',
  journeyStageId: 'fracture',
  settingId: 'gas_station',
  genreEmphasis: 'highway_rock',
  intensity: 'steady',
  vocalType: 'warm_male',
  relationship: '',
  emotionalDestination: '',
  lyricalSeed: '',
  variant: 0,
}

function copyText(text: string): Promise<void> {
  return navigator.clipboard.writeText(text)
}

/** Blank optional text fields must reach the generator as undefined, not ''. */
function normalize(input: SongInput): SongInput {
  return {
    ...input,
    relationship: input.relationship?.trim() || undefined,
    emotionalDestination: input.emotionalDestination?.trim() || undefined,
    lyricalSeed: input.lyricalSeed?.trim() || undefined,
    productionEraId: input.productionEraId || undefined,
    songFormId: input.songFormId || undefined,
  }
}

export default function App() {
  const [input, setInput] = useState<SongInput>(DEFAULT_INPUT)
  const [pkg, setPkg] = useState<SongPackage | null>(null)
  const [history, setHistory] = useState<SongPackage[]>([])
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [showOpen, setShowOpen] = useState(false)

  useEffect(() => {
    setHistory(loadHistory())
  }, [])

  const warnings = validateInput(normalize(input)).filter((i) => i.severity === 'warning')
  const [windowMin, windowMax] = SONIC_DEFAULTS.bpmByIntensity[input.intensity]

  function generate(next: SongInput) {
    setError(null)
    setCopied(null)
    try {
      const result = generateSongPackage(normalize(next))
      setInput(next)
      setPkg(result)
      setHistory(saveToHistory(result))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed')
    }
  }

  function onGenerate(e?: FormEvent) {
    e?.preventDefault()
    generate(input)
  }

  /** Same brief, new draw — the reason the studio stopped producing one song. */
  function onReroll() {
    generate({ ...input, variant: (input.variant ?? 0) + 1 })
  }

  async function handleCopy(label: string, text: string) {
    await copyText(text)
    setCopied(label)
    window.setTimeout(() => setCopied(null), 1600)
  }

  return (
    <div className="app">
      <header className="hero">
        <p className="brand">Neon Highway Rock</p>
        <h1>Suno Prompt Studio</h1>
        <p className="lede">
          Turn journey stage, setting, and emotion into a Suno-ready package — a musically specific
          style prompt, a full arrangement map, and lyrics drawn from a written corpus rather than a
          single template.
        </p>
        <p className="meta">
          Schema v{SCHEMA_VERSION} · Documented rules are hard · Inferred sonic defaults are labeled
        </p>
      </header>

      <main className="layout">
        <form className="panel form" onSubmit={onGenerate}>
          <h2>Song brief</h2>

          <label>
            Language
            <select
              value={input.language}
              onChange={(e) => setInput({ ...input, language: e.target.value as Language })}
            >
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
            <span className="hint documented">Documented choice — bilingual catalogs share rules</span>
          </label>

          <label>
            Journey stage
            <select
              value={input.journeyStageId}
              onChange={(e) =>
                setInput({ ...input, journeyStageId: e.target.value as JourneyStageId })
              }
            >
              {JOURNEY_STAGES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label.en} / {s.label.es} — {s.dominantEmotion.en}
                </option>
              ))}
            </select>
            <span className="hint documented">Documented — Human Journey Atlas</span>
          </label>

          <label>
            Setting / biome
            <select
              value={input.settingId}
              onChange={(e) => setInput({ ...input, settingId: e.target.value as SettingId })}
            >
              {SETTINGS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label.en}
                </option>
              ))}
            </select>
            <span className="hint documented">Documented — World Building / Experience biomes</span>
          </label>

          <label>
            Genre emphasis
            <select
              value={input.genreEmphasis}
              onChange={(e) =>
                setInput({ ...input, genreEmphasis: e.target.value as GenreEmphasis })
              }
            >
              {(Object.keys(GENRE_EMPHASIS_LABELS) as GenreEmphasis[]).map((id) => (
                <option key={id} value={id}>
                  {GENRE_EMPHASIS_LABELS[id].en} ({GENRE_EMPHASIS_LABELS[id].provenance})
                </option>
              ))}
            </select>
            <span className="hint inferred">Selects the instrument palette in the Musical Language</span>
          </label>

          <label>
            Intensity
            <select
              value={input.intensity}
              onChange={(e) => setInput({ ...input, intensity: e.target.value as Intensity })}
            >
              {INTENSITIES.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
            <span className="hint inferred">Drives groove, meter and tempo</span>
          </label>

          <label>
            Vocal type
            <select
              value={input.vocalType}
              onChange={(e) => setInput({ ...input, vocalType: e.target.value as VocalType })}
            >
              {(Object.keys(VOCAL_LABELS) as VocalType[]).map((id) => (
                <option key={id} value={id}>
                  {VOCAL_LABELS[id].en}
                </option>
              ))}
            </select>
            <span className="hint inferred">Sets register, harmony stack and delivery</span>
          </label>

          <div className="row">
            <label>
              Production era
              <select
                value={input.productionEraId ?? ''}
                onChange={(e) => setInput({ ...input, productionEraId: e.target.value })}
              >
                <option value="">Auto</option>
                {PRODUCTION_ERAS.map((era) => (
                  <option key={era.id} value={era.id}>
                    {era.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Song form
              <select
                value={input.songFormId ?? ''}
                onChange={(e) => setInput({ ...input, songFormId: e.target.value })}
              >
                <option value="">Auto</option>
                {SONG_FORMS.map((form) => (
                  <option key={form.id} value={form.id}>
                    {form.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label>
            Tempo override
            <input
              type="number"
              placeholder={`Auto — ${windowMin}–${windowMax} for "${input.intensity}"`}
              value={input.bpm ?? ''}
              onChange={(e) =>
                setInput({ ...input, bpm: e.target.value === '' ? undefined : Number(e.target.value) })
              }
            />
            <span className="hint inferred">
              Leave blank to take the tempo from the groove. Suno locks onto one number better than a
              range.
            </span>
          </label>

          <label>
            Relationship at stake
            <input
              type="text"
              placeholder="e.g. a long-distance love / un hermano"
              value={input.relationship ?? ''}
              onChange={(e) => setInput({ ...input, relationship: e.target.value })}
            />
            <span className="hint documented">Documented Atlas question</span>
          </label>

          <label>
            Emotional destination
            <input
              type="text"
              placeholder="e.g. a luminous nostalgia / una esperanza más quieta"
              value={input.emotionalDestination ?? ''}
              onChange={(e) => setInput({ ...input, emotionalDestination: e.target.value })}
            />
            <span className="hint">A noun phrase — lyrics place it after prepositions</span>
          </label>

          <label>
            Lyrical seed (optional)
            <textarea
              rows={3}
              placeholder="A line, image, or memory fragment…"
              value={input.lyricalSeed ?? ''}
              onChange={(e) => setInput({ ...input, lyricalSeed: e.target.value })}
            />
          </label>

          {warnings.length > 0 && (
            <ul className="warnings">
              {warnings.map((w) => (
                <li key={w.message}>{w.message}</li>
              ))}
            </ul>
          )}

          {error && <p className="error">{error}</p>}

          <button type="submit" className="primary">
            Generate Suno package
          </button>

          <button type="button" className="ghost" onClick={onReroll}>
            Reroll — same brief, new song (variant {(input.variant ?? 0) + 1})
          </button>

          <button type="button" className="ghost" onClick={() => setShowOpen((v) => !v)}>
            {showOpen ? 'Hide' : 'Show'} open documentation decisions
          </button>
          {showOpen && (
            <ul className="open-list">
              {OPEN_DECISIONS.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          )}
        </form>

        <section className="panel results">
          <h2>Output</h2>
          {!pkg && (
            <p className="empty">Generate a package to see style, arrangement, lyrics and provenance.</p>
          )}
          {pkg && (
            <>
              <div className="toolbar">
                <button type="button" onClick={() => handleCopy('all', formatForSuno(pkg))}>
                  Copy all for Suno
                </button>
                <button type="button" onClick={() => handleCopy('style', pkg.stylePrompt)}>
                  Copy style
                </button>
                <button type="button" onClick={() => handleCopy('exclude', pkg.negativePrompt)}>
                  Copy exclude
                </button>
                <button type="button" onClick={() => handleCopy('lyrics', pkg.lyrics)}>
                  Copy lyrics
                </button>
                {copied && <span className="copied">Copied {copied}</span>}
              </div>

              <article>
                <h3>{pkg.title}</h3>
                <p className="concept">{pkg.concept}</p>
              </article>

              <article>
                <h4>Musical spec</h4>
                <dl className="spec">
                  <dt>Tempo</dt>
                  <dd>
                    {pkg.music.bpm} BPM · {pkg.music.meter} · {pkg.music.feel}
                  </dd>
                  <dt>Key</dt>
                  <dd>
                    {pkg.music.key} — {pkg.music.keyCharacter}
                  </dd>
                  <dt>Progression</dt>
                  <dd>
                    {pkg.music.progression} ({pkg.music.progressionLabel})
                  </dd>
                  <dt>Drums</dt>
                  <dd>{pkg.music.drumNote}</dd>
                  <dt>Instrumentation</dt>
                  <dd>{pkg.music.instrumentation.join(' · ')}</dd>
                  <dt>Voice</dt>
                  <dd>{pkg.music.vocal.join(' · ')}</dd>
                  <dt>Production</dt>
                  <dd>
                    {pkg.music.productionEraLabel} — {pkg.music.productionEraTags}
                  </dd>
                  <dt>Form</dt>
                  <dd>{pkg.music.formLabel}</dd>
                </dl>
              </article>

              <article>
                <h4>Style of Music ({pkg.stylePrompt.length} chars)</h4>
                <pre>{pkg.stylePrompt}</pre>
              </article>

              <article>
                <h4>Exclude Styles</h4>
                <pre>{pkg.negativePrompt}</pre>
              </article>

              <article>
                <h4>Arrangement</h4>
                <ol className="arrangement">
                  {pkg.arrangement.map((section, i) => (
                    <li key={`${section.label}-${i}`}>
                      <strong>{section.label}</strong>
                      <span>{section.note}</span>
                    </li>
                  ))}
                </ol>
              </article>

              <article>
                <h4>Lyrics</h4>
                <pre className="lyrics">{pkg.lyrics}</pre>
              </article>

              {pkg.warnings.length > 0 && (
                <article>
                  <h4>Warnings</h4>
                  <ul className="warnings">
                    {pkg.warnings.map((w) => (
                      <li key={w}>{w}</li>
                    ))}
                  </ul>
                </article>
              )}

              <article>
                <h4>Applied rules</h4>
                <ul className="rules">
                  {pkg.appliedRules.map((r, i) => (
                    <li key={`${r.source}-${i}`}>
                      <span className={`badge ${r.provenance}`}>{r.provenance}</span>
                      <span>{r.rule}</span>
                      <small>{r.source}</small>
                    </li>
                  ))}
                </ul>
              </article>
            </>
          )}
        </section>

        <aside className="panel history">
          <div className="history-head">
            <h2>History</h2>
            <button
              type="button"
              className="ghost"
              onClick={() => {
                clearHistory()
                setHistory([])
              }}
            >
              Clear
            </button>
          </div>
          {history.length === 0 && <p className="empty">No packages yet.</p>}
          <ul className="history-list">
            {history.map((item) => (
              <li key={`${item.id}-${item.createdAt}`}>
                <button type="button" onClick={() => setPkg(item)}>
                  <strong>{item.title}</strong>
                  <span>
                    {item.input.language.toUpperCase()} · {item.input.journeyStageId} ·{' '}
                    {item.input.settingId}
                  </span>
                  <span>{musicSummary(item.music)}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>
      </main>
    </div>
  )
}
