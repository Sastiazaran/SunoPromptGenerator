import type { SongPackage } from './types'

/** v2 packages carry `music` and `arrangement`; v1 entries would render as blanks. */
const STORAGE_KEY = 'nhr-suno-history-v2'
const MAX_ITEMS = 30

export function loadHistory(): SongPackage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as SongPackage[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveToHistory(pkg: SongPackage): SongPackage[] {
  const next = [pkg, ...loadHistory().filter((p) => p.id !== pkg.id)].slice(0, MAX_ITEMS)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  return next
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY)
}
