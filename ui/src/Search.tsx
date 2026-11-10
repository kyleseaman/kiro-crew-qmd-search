/**
 * The left column: one free-form search box, live results under it.
 *
 * Instant results come from QMD's keyword index on every pause in typing.
 * Enter opens the highlighted result; ⌘Enter runs QMD's hybrid search
 * (expansion, vectors, reranking), which takes seconds and is shown as its own
 * section so it never reshuffles the list the user is reading.
 */
import { forwardRef, useEffect, useMemo, useRef, type KeyboardEvent } from 'react'
import { I } from './icons'
import { byRecency, docKey, type Collection, type Hit, type SearchResult, type SortMode } from './api'
import { MOD, Snippet, folderOf, highlight, isDaily, relTime } from './util'

export interface SearchProps {
  query: string
  onQuery: (q: string) => void
  collections: Collection[]
  collection: string | null
  onCollection: (c: string | null) => void
  suggest: SearchResult | null
  suggestLoading: boolean
  suggestError: string | null
  deep: SearchResult | null
  deepRunning: string | null
  deepError: string | null
  onDeep: () => void
  recent: Hit[]
  activeKey: string | null
  selected: number
  /** `viaKeyboard` previews the row in the reader; hover only highlights it. */
  onSelected: (i: number, viaKeyboard?: boolean) => void
  onOpen: (hit: Hit, opts?: { pin?: boolean; words?: string[] }) => void
  /** Open a [[wikilink]] clicked inside a result snippet. */
  onLink?: (target: string, fromCollection: string) => void
  picks: Map<string, Hit>
  onTogglePick: (hit: Hit) => void
  onClearPicks: () => void
  onChatPicks: () => void
  indexInfo: { documents: number; updated: string | null; error?: string } | null
  sort: SortMode
  onSort: (s: SortMode) => void
}

interface Row {
  hit: Hit
  words: string[]
}

export function useRows(p: Pick<SearchProps, 'query' | 'suggest' | 'deep' | 'recent'> & { sort?: SortMode }): {
  sections: Array<{ id: string; label: string; meta?: string; rows: Row[] }>
  flat: Row[]
} {
  return useMemo(() => {
    const sections: Array<{ id: string; label: string; meta?: string; rows: Row[] }> = []
    if (!p.query.trim()) {
      sections.push({ id: 'recent', label: 'Recently edited', rows: p.recent.map((hit) => ({ hit, words: [] })) })
    } else {
      const seen = new Set<string>()
      if (p.deep && p.deep.query === p.query.trim() && p.deep.results.length) {
        const deepHits = p.sort === 'recent' ? byRecency(p.deep.results) : p.deep.results
        const rows = deepHits.map((hit) => ({ hit, words: p.deep!.words }))
        rows.forEach((r) => seen.add(docKey(r.hit)))
        sections.push({
          id: 'deep',
          label: p.sort === 'recent' ? 'Best matches, newest first' : 'Best matches',
          meta: `hybrid · ${(p.deep.took_ms / 1000).toFixed(1)}s${p.deep.cached ? ' · cached' : ''}`,
          rows,
        })
      }
      if (p.suggest) {
        const rows = p.suggest.results
          .filter((hit) => !seen.has(docKey(hit)))
          .map((hit) => ({ hit, words: p.suggest!.words }))
        sections.push({
          id: 'suggest',
          label: (sections.length ? 'Keyword matches' : 'Matches') + (p.sort === 'recent' ? ', newest first' : ''),
          meta: `${p.suggest.results.length}${p.suggest.results.length >= 14 ? '+' : ''} · ${Math.round(p.suggest.took_ms)}ms`,
          rows,
        })
      }
    }
    return { sections, flat: sections.flatMap((s) => s.rows) }
  }, [p.query, p.suggest, p.deep, p.recent, p.sort])
}

export const SearchPanel = forwardRef<HTMLInputElement, SearchProps>(function SearchPanel(p, inputRef) {
  const { sections, flat } = useRows(p)
  const listRef = useRef<HTMLDivElement>(null)

  // Keep the highlighted row on screen as the arrow keys move it.
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-row="${p.selected}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [p.selected])

  function onKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.nativeEvent.isComposing) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      p.onSelected(Math.min(flat.length - 1, p.selected + 1), true)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      p.onSelected(Math.max(0, p.selected - 1), true)
    } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      p.onDeep()
    } else if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault()
      const row = flat[p.selected]
      if (row) p.onTogglePick(row.hit)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const row = flat[p.selected]
      if (row) p.onOpen(row.hit, { pin: true, words: row.words })
    } else if (e.key === 'Escape') {
      if (p.query) {
        e.preventDefault()
        p.onQuery('')
      }
    }
  }

  const q = p.query.trim()
  const deepForThis = p.deepRunning === q
  const showDeepRow = q.length > 0 && !(p.deep && p.deep.query === q)
  const picking = p.picks.size > 0
  let rowIndex = -1

  return (
    <aside className="lib-left" aria-label="Search">
      <div className="lib-brand">
        <span className="lib-logo" aria-hidden="true">
          <I.Brand size={17} strokeWidth={2.5} />
        </span>
        <h1>Notes Search</h1>
        {p.indexInfo && (
          <span className="lib-meta lib-meta-sm" title={p.indexInfo.updated ? `Index file updated ${p.indexInfo.updated}` : undefined}>
            {p.indexInfo.documents.toLocaleString()} notes
            <br />
            {p.indexInfo.updated ? `indexed ${relTime(p.indexInfo.updated)}` : ''}
          </span>
        )}
      </div>

      <div className="lib-search" role="search">
        <label className="lib-search-box">
          {p.suggestLoading || deepForThis ? (
            <I.Loader size={18} className="lib-spin" aria-hidden="true" />
          ) : (
            <I.Search size={18} strokeWidth={2.4} aria-hidden="true" />
          )}
          <span className="lib-sr">Search your notes</span>
          <input
            ref={inputRef}
            value={p.query}
            onChange={(e) => {
              p.onQuery(e.target.value)
              p.onSelected(0)
            }}
            onKeyDown={onKey}
            placeholder="Search anything you've written…"
            autoComplete="off"
            spellCheck={false}
            role="combobox"
            aria-expanded={flat.length > 0}
            aria-controls="lib-results"
            aria-activedescendant={flat.length ? `lib-row-${p.selected}` : undefined}
          />
          {p.query ? (
            <button type="button" className="lib-btn lib-btn-quiet lib-btn-icon" aria-label="Clear search" onClick={() => p.onQuery('')}>
              <I.X size={15} />
            </button>
          ) : (
            <span className="lib-kbd" aria-hidden="true">/</span>
          )}
        </label>
      </div>

      {p.collections.length > 1 && (
        <div className="lib-filters" role="group" aria-label="Collection">
          <button type="button" className="lib-chip" aria-pressed={p.collection === null} onClick={() => p.onCollection(null)}>
            All
          </button>
          {p.collections.map((c) => (
            <button
              key={c.name}
              type="button"
              className="lib-chip"
              aria-pressed={p.collection === c.name}
              onClick={() => p.onCollection(p.collection === c.name ? null : c.name)}
            >
              {c.name} <span className="lib-count">{c.docs.toLocaleString()}</span>
            </button>
          ))}
        </div>
      )}

      {q && (
        <div className="lib-sortbar">
          <span className="lib-meta-sm">Sort</span>
          <div className="lib-seg" role="radiogroup" aria-label="Sort results">
            {(
              [
                ['relevance', 'Best match'],
                ['recent', 'Newest'],
              ] as Array<[SortMode, string]>
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                role="radio"
                aria-checked={p.sort === key}
                className="lib-seg-opt"
                onClick={() => {
                  p.onSort(key)
                  p.onSelected(0)
                }}
              >
                {key === 'recent' && <I.Clock size={12} aria-hidden="true" />}
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="lib-results" id="lib-results" role="listbox" ref={listRef} data-picking={picking}>
        {p.indexInfo?.error && (
          <div className="lib-empty">
            <h3>QMD's index isn't readable</h3>
            <p>{p.indexInfo.error}</p>
            <p>
              Build it with <code>qmd update</code> and <code>qmd embed</code>.
            </p>
          </div>
        )}

        {sections.map((s) => (
          <div key={s.id}>
            <div className="lib-section">
              {s.id === 'deep' && <I.Sparkles size={13} aria-hidden="true" />}
              {s.id === 'recent' && <I.Clock size={13} aria-hidden="true" />}
              {s.label}
              {s.meta && <span className="lib-meta-sm">{s.meta}</span>}
            </div>
            {s.rows.map((row) => {
              rowIndex += 1
              const i = rowIndex
              const key = docKey(row.hit)
              const picked = p.picks.has(key)
              const DocIcon = isDaily(row.hit.path) ? I.Calendar : I.File
              return (
                <div
                  key={`${s.id}:${key}`}
                  id={`lib-row-${i}`}
                  data-row={i}
                  role="option"
                  aria-selected={i === p.selected}
                  className="lib-hit"
                  tabIndex={-1}
                  onMouseMove={() => i !== p.selected && p.onSelected(i)}
                  onClick={(e) => {
                    if (e.metaKey || e.ctrlKey || e.shiftKey) p.onTogglePick(row.hit)
                    else p.onOpen(row.hit, { words: row.words })
                  }}
                  onDoubleClick={() => p.onOpen(row.hit, { pin: true, words: row.words })}
                  data-active={p.activeKey === key}
                >
                  <span className="lib-hit-icon" aria-hidden="true">
                    <DocIcon size={16} strokeWidth={2.2} />
                  </span>
                  <span className="lib-hit-title">
                    <span>{highlight(row.hit.title, row.words)}</span>
                  </span>
                  <span className="lib-hit-path">
                    {folderOf(row.hit.collection, row.hit.path)}
                    {row.hit.modified_at ? ` · ${relTime(row.hit.modified_at)}` : ''}
                  </span>
                  {row.hit.snippet.length > 0 && (
                    <span className="lib-hit-snippet">
                      <Snippet parts={row.hit.snippet} onLink={p.onLink ? (t) => p.onLink!(t, row.hit.collection) : undefined} />
                    </span>
                  )}
                  <button
                    type="button"
                    className="lib-check"
                    role="checkbox"
                    aria-checked={picked}
                    aria-label={picked ? `Remove ${row.hit.title} from selection` : `Select ${row.hit.title} to chat about together`}
                    title="Select to chat about several notes together (⇧Enter)"
                    onClick={(e) => {
                      e.stopPropagation()
                      p.onTogglePick(row.hit)
                    }}
                  >
                    {picked && <I.Check size={11} strokeWidth={3.4} />}
                  </button>
                </div>
              )
            })}
          </div>
        ))}

        {q && showDeepRow && (
          <button type="button" className="lib-deep-row" onClick={p.onDeep} aria-busy={deepForThis} disabled={deepForThis}>
            {deepForThis ? <I.Loader size={17} className="lib-spin" /> : <I.Sparkles size={17} />}
            <span className="lib-grow">
              {deepForThis ? (
                <>
                  <b>Searching by meaning…</b>
                  <br />
                  <span className="lib-meta-sm">QMD is expanding and reranking. This takes a few seconds.</span>
                </>
              ) : (
                <>
                  <b>Search by meaning</b>
                  <br />
                  <span className="lib-meta-sm">Hybrid QMD search with query expansion and reranking</span>
                </>
              )}
            </span>
            {!deepForThis && (
              <span className="lib-row">
                <span className="lib-kbd">{MOD}</span>
                <span className="lib-kbd">↵</span>
              </span>
            )}
          </button>
        )}

        {p.deepError && q && (
          <div className="lib-alert" role="alert" style={{ marginTop: 8 }}>
            <I.Alert size={16} />
            <span>{p.deepError}</span>
          </div>
        )}
        {p.suggestError && (
          <div className="lib-alert" role="alert" style={{ marginTop: 8 }}>
            <I.Alert size={16} />
            <span>{p.suggestError}</span>
          </div>
        )}

        {q && p.suggest && !p.suggestLoading && flat.length === 0 && !deepForThis && (
          <div className="lib-empty">
            <h3>No keyword matches</h3>
            <p>Try fewer words, or search by meaning to find notes that say it differently.</p>
          </div>
        )}
      </div>

      {picking && (
        <div className="lib-tray" role="status">
          <span className="lib-grow">
            {p.picks.size} note{p.picks.size === 1 ? '' : 's'} selected
            <span className="lib-tray-hint">{p.picks.size === 1 ? 'Select more to discuss them in one chat' : 'One chat reads them all together'}</span>
          </span>
          <button type="button" className="lib-btn lib-btn-quiet lib-btn-sm" onClick={p.onClearPicks}>
            Clear
          </button>
          <button type="button" className="lib-btn lib-btn-primary lib-btn-sm" onClick={p.onChatPicks}>
            <I.ChatPlus size={14} />
            {p.picks.size === 1 ? 'Chat about it' : `Chat about all ${p.picks.size}`}
          </button>
        </div>
      )}
    </aside>
  )
})
