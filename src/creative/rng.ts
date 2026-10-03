/**
 * Deterministic randomness for package generation.
 *
 * A brief plus a variant number always reproduces the same package, but each
 * decision draws from an independent stream. The previous `(seed + salt) % len`
 * approach correlated every choice, so nearby salts landed on nearby indices
 * and most packages converged on the same words.
 */

/** FNV-1a. Stable across runs, unlike anything based on object iteration order. */
export function hashString(raw: string): number {
  let h = 2166136261 >>> 0
  for (let i = 0; i < raw.length; i++) {
    h ^= raw.charCodeAt(i)
    h = Math.imul(h, 16777619) >>> 0
  }
  return h >>> 0
}

export class Rng {
  private state: number

  constructor(seed: number) {
    this.state = (seed >>> 0) || 1
  }

  /** mulberry32 */
  next(): number {
    this.state = (this.state + 0x6d2b79f5) >>> 0
    let t = this.state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }

  int(maxExclusive: number): number {
    return Math.floor(this.next() * maxExclusive)
  }

  /** Inclusive on both ends. */
  range(min: number, max: number): number {
    if (max <= min) return min
    return min + this.int(max - min + 1)
  }

  pick<T>(items: readonly T[]): T {
    if (items.length === 0) throw new Error('Rng.pick requires a non-empty list')
    return items[this.int(items.length)]
  }

  /** Sample without replacement, so a palette never repeats an instrument. */
  pickMany<T>(items: readonly T[], count: number): T[] {
    const pool = [...items]
    const out: T[] = []
    while (out.length < count && pool.length > 0) {
      out.push(pool.splice(this.int(pool.length), 1)[0])
    }
    return out
  }

  chance(probability: number): boolean {
    return this.next() < probability
  }

  /**
   * A named child stream. Keeps decisions stable when unrelated ones change:
   * editing the lyric bank must not reshuffle the chosen key or drum feel.
   */
  fork(label: string): Rng {
    return new Rng((this.state ^ hashString(label)) >>> 0)
  }
}
