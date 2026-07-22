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
import { formatForSuno, generateSongPackage } from './creative/generator'
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
}

function copyText(text: string): Promise<void> {
  return navigator.clipboard.writeText(text)
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

  const warnings = validateInput(input).filter((i) => i.severity === 'warning')
  const [bpmMin, bpmMax] = SONIC_DEFAULTS.bpmByIntensity[input.intensity]

  function onGenerate(e?: FormEvent) {
    e?.preventDefault()
    setError(null)
    setCopied(null)
    try {
      const next = generateSongPackage({
        ...input,
        bpmMin: input.bpmMin ?? bpmMin,
        bpmMax: input.bpmMax ?? bpmMax,
        relationship: input.relationship?.trim() || undefined,
        emotionalDestination: input.emotionalDestination?.trim() || undefined,
        lyricalSeed: input.lyricalSeed?.trim() || undefined,
      })
      setPkg(next)
      setHistory(saveToHistory(next))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed')
    }
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
          Turn journey stage, setting, and emotion into a Suno-ready package — style prompt, concept,
          and full lyrics — grounded in your creative docs.
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
            <span className="hint inferred">Mix of documented flavors + inferred AOR/highway core</span>
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
            <span className="hint open">Open — BPM defaults are inferred until Musical Language exists</span>
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
            <span className="hint inferred">Inferred — Production Bible incomplete</span>
          </label>

          <div className="row">
            <label>
              BPM min
              <input
                type="number"
                value={input.bpmMin ?? bpmMin}
                onChange={(e) =>
                  setInput({ ...input, bpmMin: Number(e.target.value) || undefined })
                }
              />
            </label>
            <label>
              BPM max
              <input
                type="number"
                value={input.bpmMax ?? bpmMax}
                onChange={(e) =>
                  setInput({ ...input, bpmMax: Number(e.target.value) || undefined })
                }
              />
            </label>
          </div>

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
              placeholder="e.g. luminous nostalgia / seguir con esperanza"
              value={input.emotionalDestination ?? ''}
              onChange={(e) => setInput({ ...input, emotionalDestination: e.target.value })}
            />
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
          {!pkg && <p className="empty">Generate a package to see style, lyrics, and rule provenance.</p>}
          {pkg && (
            <>
              <div className="toolbar">
                <button type="button" onClick={() => handleCopy('all', formatForSuno(pkg))}>
                  Copy all for Suno
                </button>
                <button type="button" onClick={() => handleCopy('style', pkg.stylePrompt)}>
                  Copy style
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
                <h4>Style of Music</h4>
                <pre>{pkg.stylePrompt}</pre>
              </article>

              <article>
                <h4>Exclude / Negative</h4>
                <pre>{pkg.negativePrompt}</pre>
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
                  {pkg.appliedRules.map((r) => (
                    <li key={`${r.source}-${r.rule}`}>
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
                </button>
              </li>
            ))}
          </ul>
        </aside>
      </main>
    </div>
  )
}
