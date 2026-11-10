import type { ReactNode } from 'react'
import type { SnippetPart } from './api'

export function relTime(iso: string | null | undefined, now = Date.now()): string {
  if (!iso) return ''
  const t = Date.parse(iso)
  if (Number.isNaN(t)) return ''
  const s = Math.max(0, (now - t) / 1000)
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  const d = Math.floor(s / 86400)
  if (d < 7) return `${d}d ago`
  const date = new Date(t)
  const sameYear = date.getFullYear() === new Date(now).getFullYear()
  return date.toLocaleDateString([], { month: 'short', day: 'numeric', ...(sameYear ? {} : { year: 'numeric' }) })
}

export function longDate(iso: string | null | undefined): string {
  if (!iso) return ''
  const t = Date.parse(iso)
  if (Number.isNaN(t)) return ''
  return new Date(t).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
}

const WIKI = /\[\[([^\]\n|#]+)(?:#[^\]\n|]*)?(?:\|([^\]\n]+))?\]\]/g

/**
 * A search or backlink snippet. `[[Target]]` / `[[Target|Alias]]` render as links
 * (label only, no brackets), the way the notes app shows them. Hit ranges from
 * the index are kept, including when a hit falls inside a link.
 */
export function Snippet({ parts, onLink }: { parts: SnippetPart[]; onLink?: (target: string) => void }) {
  let text = ''
  const hits: Array<[number, number]> = []
  for (const p of parts) {
    if (p.hit) hits.push([text.length, text.length + p.text.length])
    text += p.text
  }

  const marked = (s: number, e: number, key: string): ReactNode[] => {
    const out: ReactNode[] = []
    let at = s
    for (const [a, b] of hits) {
      if (b <= at || a >= e) continue
      const hs = Math.max(a, at)
      const he = Math.min(b, e)
      if (hs > at) out.push(<span key={`${key}-${at}`}>{text.slice(at, hs)}</span>)
      out.push(<mark key={`${key}-m${hs}`}>{text.slice(hs, he)}</mark>)
      at = he
    }
    if (at < e) out.push(<span key={`${key}-${at}`}>{text.slice(at, e)}</span>)
    return out
  }

  const out: ReactNode[] = []
  let last = 0
  for (const m of text.matchAll(WIKI)) {
    const start = m.index ?? 0
    const end = start + m[0].length
    if (start > last) out.push(...marked(last, start, `t${last}`))
    const target = m[1].trim()
    const labelStart = m[2] ? start + m[0].lastIndexOf('|') + 1 : start + 2
    const labelEnd = m[2] ? end - 2 : start + 2 + m[1].length
    const isHit = hits.some(([a, b]) => a < end && b > start)
    out.push(
      <span
        key={`l${start}`}
        className="lib-snip-link"
        data-hit={isHit}
        title={target}
        onClick={
          onLink
            ? (e) => {
                e.stopPropagation()
                onLink(target)
              }
            : undefined
        }
      >
        {marked(labelStart, labelEnd, `l${start}`)}
      </span>,
    )
    last = end
  }
  if (last < text.length) out.push(...marked(last, text.length, `t${last}`))
  return <>{out}</>
}

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Highlight query words (prefix match) inside a plain string. */
export function highlight(text: string, words: string[]): ReactNode {
  const ws = words.filter((w) => w.length >= 2)
  if (!ws.length) return text
  const re = new RegExp(`(${ws.map(escapeRe).join('|')})`, 'ig')
  const out: ReactNode[] = []
  let last = 0
  text.replace(re, (m, _g, idx: number) => {
    if (idx > last) out.push(text.slice(last, idx))
    out.push(<mark key={idx}>{m}</mark>)
    last = idx + m.length
    return m
  })
  if (last < text.length) out.push(text.slice(last))
  return out
}

/** "notes/managed-crews.md" -> "notes". Root files show the collection. */
export function folderOf(collection: string, path: string): string {
  const i = path.lastIndexOf('/')
  return i < 0 ? collection : `${collection} / ${path.slice(0, i).replace(/\//g, ' / ')}`
}

export function isDaily(path: string): boolean {
  return /(^|\/)\d{4}-\d{2}-\d{2}\.md$/.test(path)
}

export function isMac(): boolean {
  return typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)
}

export const MOD = isMac() ? '⌘' : 'Ctrl'
