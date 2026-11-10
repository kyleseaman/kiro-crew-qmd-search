/**
 * The page's data layer: typed calls to this app's backend and the host chat API.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import { useAppApi, type AppApi } from '@kirocrew/app-sdk'

export const BASE = '/api/apps/notes-search'

export interface SnippetPart {
  text: string
  hit: boolean
}

export interface DocRef {
  collection: string
  path: string
  title: string
}

export interface Hit extends DocRef {
  uri: string
  modified_at: string | null
  score: number
  line?: number | null
  snippet: SnippetPart[]
}

export interface SearchResult {
  query: string
  words: string[]
  results: Hit[]
  took_ms: number
  engine: string
  cached?: boolean
}

export interface Collection {
  name: string
  path: string
  docs: number
}

export interface Status {
  index: string
  qmd: string | null
  schema_ok: boolean
  collections: Collection[]
  documents: number
  index_updated_at: string | null
  error?: string
}

export interface Doc extends DocRef {
  uri: string
  abs_path: string
  markdown: string
  properties: Record<string, string>
  private: boolean
  modified_at: string | null
  indexed_at: string | null
  stale_index: boolean
  source: 'disk' | 'index'
  words: number
  reading_minutes: number
  /** Set for notes in an Obsidian vault: what an obsidian://open link needs. */
  obsidian?: { vault: string; file: string } | null
}

export interface Session {
  slot_key: string
  title: string
  docs: DocRef[]
  created_at: string
}

/** The error text a failed host fetch carries: "API 404: {json}". */
export function errorMessage(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err)
  const m = /^API \d+: (.*)$/s.exec(raw)
  if (m) {
    try {
      const parsed = JSON.parse(m[1])
      if (parsed && typeof parsed.error === 'string') return parsed.error
    } catch {
      /* not JSON */
    }
    return m[1].slice(0, 300)
  }
  return raw
}

export function qs(params: Record<string, string | number | undefined | null>): string {
  const q = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== null && v !== '') q.set(k, String(v))
  return q.toString()
}

export function docKey(d: { collection: string; path: string }): string {
  return `${d.collection}/${d.path}`
}

/** Live-as-you-type search. Stale responses are dropped by sequence number. */
export type SortMode = 'relevance' | 'recent'

/** Newest first. Notes with no date sink to the bottom. Stable for ties. */
export function byRecency<T extends { modified_at: string | null }>(items: T[]): T[] {
  return items
    .map((it, i) => ({ it, i, t: it.modified_at ? Date.parse(it.modified_at) || 0 : 0 }))
    .sort((a, b) => b.t - a.t || a.i - b.i)
    .map((x) => x.it)
}

export function useSuggest(api: AppApi, query: string, collection: string | null, sort: SortMode = 'relevance') {
  const [result, setResult] = useState<SearchResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const seq = useRef(0)
  useEffect(() => {
    const q = query
    if (!q.trim()) {
      seq.current++
      setResult(null)
      setLoading(false)
      setError(null)
      return
    }
    const mine = ++seq.current
    setLoading(true)
    // Short enough to feel instant, long enough not to fire on every key of a fast typist.
    const t = window.setTimeout(() => {
      api
        .get<SearchResult>(`${BASE}/suggest?${qs({ q, c: collection, limit: 14, sort: sort === 'recent' ? 'recent' : undefined })}`)
        .then((r) => {
          if (mine !== seq.current) return
          // Sorted again here so the order is right even against a backend
          // that predates the sort parameter.
          setResult(sort === 'recent' ? { ...r, results: byRecency(r.results) } : r)
          setError(null)
        })
        .catch((e) => {
          if (mine !== seq.current) return
          setError(errorMessage(e))
        })
        .finally(() => {
          if (mine === seq.current) setLoading(false)
        })
    }, 70)
    return () => window.clearTimeout(t)
  }, [api, query, collection, sort])
  return { result, loading, error }
}

/** Hybrid `qmd query`, run on demand. */
export function useDeep(api: AppApi) {
  const [result, setResult] = useState<SearchResult | null>(null)
  const [running, setRunning] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const seq = useRef(0)
  const run = useCallback(
    (q: string, collection: string | null) => {
      const query = q.trim()
      if (!query) return
      const mine = ++seq.current
      setRunning(query)
      setError(null)
      api
        .get<SearchResult>(`${BASE}/deep?${qs({ q: query, c: collection, limit: 12 })}`)
        .then((r) => mine === seq.current && setResult(r))
        .catch((e) => mine === seq.current && setError(errorMessage(e)))
        .finally(() => mine === seq.current && setRunning(null))
    },
    [api],
  )
  const clear = useCallback(() => {
    seq.current++
    setResult(null)
    setRunning(null)
    setError(null)
  }, [])
  return { result, running, error, run, clear }
}

export function useApi() {
  return useAppApi()
}

// ───────────── chat sessions ─────────────

interface Slot {
  key: string
  title?: string
  running?: boolean
}

interface Folder {
  id: string
  name: string
}

const FOLDER_NAME = 'Notes Search'

async function fileIntoFolder(api: AppApi, slotKey: string) {
  try {
    const folders = await api.get<Folder[] | { folders?: Folder[] }>('/api/chat/folders')
    const list: Folder[] = Array.isArray(folders) ? folders : folders?.folders ?? []
    let folder = list.find((f) => f.name === FOLDER_NAME)
    if (!folder) folder = await api.post<Folder>('/api/chat/folders', { name: FOLDER_NAME })
    if (folder?.id) await api.patch(`/api/chat/slots/${encodeURIComponent(slotKey)}/folder`, { folder_id: folder.id })
  } catch {
    // Filing is cosmetic. The session works without a folder.
  }
}

function newSlotName(): string {
  const rand = Math.random().toString(36).slice(2, 8)
  return `library-${Date.now().toString(36)}-${rand}`
}

/**
 * Send a message into a slot without holding the page on the reply.
 *
 * `POST /api/chat` answers with a server-sent event stream that stays open for
 * the whole turn. The host SDK reads the body as text, so awaiting it would
 * block until the agent finishes. The embedded chat polls the slot for the
 * transcript, so this only needs the request to be accepted.
 */
export function sendToSlot(api: AppApi, slotKey: string, message: string): Promise<void> {
  return api
    .post('/api/chat', { message, slot: slotKey, agent: '' })
    .then(() => undefined)
    .catch((err) => {
      if (err instanceof SyntaxError) return
      throw err
    })
}

export async function createChat(
  api: AppApi,
  docs: DocRef[],
  question: string,
): Promise<Session> {
  const seed = await api.post<{ message: string; title: string; docs: DocRef[] }>(`${BASE}/seed`, {
    docs,
    question,
  })
  const slot = await api.post<Slot>('/api/chat/slots', { name: newSlotName(), agent: '' })
  const title = `📄 ${seed.title}`
  await api.patch(`/api/chat/slots/${encodeURIComponent(slot.key)}/title`, { title }).catch(() => undefined)
  const session = await api.post<Session>(`${BASE}/sessions`, {
    slot_key: slot.key,
    title,
    docs: seed.docs,
  })
  void fileIntoFolder(api, slot.key)
  // Deliberately not awaited: see sendToSlot.
  void sendToSlot(api, slot.key, seed.message).catch(() => undefined)
  return session
}

export function addDocMessage(doc: Doc, question: string): string {
  const ask = question.trim() || 'How does this relate to what we have been discussing?'
  return `Also read **${doc.title}** · \`${doc.abs_path}\` and bring it into this conversation.\n\n${ask}`
}
