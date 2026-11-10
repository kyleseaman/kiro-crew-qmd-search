/**
 * The center column: open notes as tabs, and the reader for the active one.
 *
 * A single click on a result opens it in the PREVIEW tab (italic, replaced by
 * the next preview), the way an editor does; Enter, a double click, or any
 * scroll/interaction inside the note pins it. That keeps arrowing through
 * results from piling up thirty tabs.
 */
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { I } from './icons'
import { BASE, docKey, errorMessage, qs, type Doc, type DocRef, type Hit, type Session, useApi } from './api'
import { extractSection, renderMarkdown } from './markdown'
import { MOD, Snippet, folderOf, longDate, relTime } from './util'

export interface Tab {
  collection: string
  path: string
  title: string
  preview: boolean
  /** Query words to highlight when the note was opened from a search. */
  words: string[]
  heading?: string
}

// ───────────── tab strip ─────────────

export function TabStrip(props: {
  tabs: Tab[]
  active: string | null
  onActivate: (key: string) => void
  onClose: (key: string) => void
  onPin: (key: string) => void
  leftOpen: boolean
  onToggleLeft: () => void
  chatOpen: boolean
  chatCount: number
  onToggleChat: () => void
  foldersOpen: boolean
  onToggleFolders: () => void
}) {
  return (
    <div className="lib-tabs" role="tablist" aria-label="Open notes">
      <button
        type="button"
        className="lib-btn lib-btn-quiet lib-btn-icon"
        style={{ marginBottom: 6, flex: 'none' }}
        aria-pressed={props.leftOpen}
        aria-label={props.leftOpen ? 'Hide search' : 'Show search'}
        title={`${props.leftOpen ? 'Hide' : 'Show'} search (${MOD}\\)`}
        onClick={props.onToggleLeft}
      >
        <I.PanelLeft size={16} />
      </button>
      {props.tabs.map((t) => {
        const key = docKey(t)
        return (
          <div
            key={key}
            role="tab"
            tabIndex={0}
            aria-selected={props.active === key}
            data-preview={t.preview}
            className="lib-tab"
            title={`${t.title}\n${t.collection}/${t.path}`}
            onClick={() => props.onActivate(key)}
            onDoubleClick={() => props.onPin(key)}
            onAuxClick={(e) => e.button === 1 && props.onClose(key)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') props.onActivate(key)
            }}
          >
            <I.File size={13} aria-hidden="true" />
            <span className="lib-ell">{t.title}</span>
            <span
              className="lib-tab-x"
              role="button"
              aria-label={`Close ${t.title}`}
              onClick={(e) => {
                e.stopPropagation()
                props.onClose(key)
              }}
            >
              <I.X size={12} strokeWidth={2.6} />
            </span>
          </div>
        )
      })}
      <div className="lib-tabs-end">
        <button
          type="button"
          className="lib-btn lib-btn-quiet lib-btn-sm"
          aria-pressed={props.foldersOpen}
          onClick={props.onToggleFolders}
          title="Choose which folders to search"
        >
          <I.Folders size={15} />
          Folders
        </button>
        <button
          type="button"
          className="lib-btn lib-btn-quiet lib-btn-sm"
          aria-pressed={props.chatOpen}
          onClick={props.onToggleChat}
          title={`${props.chatOpen ? 'Hide' : 'Show'} chats (${MOD}J)`}
        >
          <I.Chat size={15} />
          Chats{props.chatCount ? ` · ${props.chatCount}` : ''}
        </button>
      </div>
    </div>
  )
}

// ───────────── reader ─────────────

export interface ReaderProps {
  tab: Tab
  onTouch: () => void
  onOpenLink: (target: string, heading: string, fromCollection: string) => void
  onOpenHit: (hit: Hit) => void
  onTag: (tag: string) => void
  onChat: (doc: Doc, question: string) => void
  onAddToChat: ((doc: Doc, question: string) => void) | null
  activeChatTitle: string | null
  sessionsForDoc: Session[]
  onResumeSession: (s: Session) => void
  notify: (msg: string, kind?: 'info' | 'error') => void
  onDocLoaded: (doc: Doc) => void
}

export function Reader(p: ReaderProps) {
  const api = useApi()
  const [doc, setDoc] = useState<Doc | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [backlinks, setBacklinks] = useState<Hit[] | null>(null)
  const [ask, setAsk] = useState('')
  const [current, setCurrent] = useState<string | null>(null)
  const [findIdx, setFindIdx] = useState(0)
  const [findCount, setFindCount] = useState(0)
  const [showProps, setShowProps] = useState(false)
  const proseRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const key = docKey(p.tab)

  useEffect(() => {
    let live = true
    setDoc(null)
    setError(null)
    setBacklinks(null)
    setFindIdx(0)
    api
      .get<Doc>(`${BASE}/doc?${qs({ c: p.tab.collection, p: p.tab.path })}`)
      .then((d) => {
        if (!live) return
        setDoc(d)
        p.onDocLoaded(d)
      })
      .catch((e) => live && setError(errorMessage(e)))
    api
      .get<{ results: Hit[] }>(`${BASE}/backlinks?${qs({ c: p.tab.collection, p: p.tab.path })}`)
      .then((r) => live && setBacklinks(r.results))
      .catch(() => live && setBacklinks([]))
    scrollRef.current?.scrollTo({ top: 0 })
    return () => {
      live = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, key])

  const rendered = useMemo(
    () => (doc ? renderMarkdown(doc.markdown, { collection: doc.collection, path: doc.path, title: doc.title }) : null),
    [doc],
  )

  // After the HTML lands: highlight the search words, add copy buttons to code.
  useLayoutEffect(() => {
    const root = proseRef.current
    if (!root || !rendered) return
    // Set imperatively, never through dangerouslySetInnerHTML: the match marks
    // and copy buttons below mutate this subtree, and a React-owned innerHTML
    // can be re-applied on a later render, silently wiping them.
    root.innerHTML = rendered.html
    root.querySelectorAll('pre').forEach((pre) => {
      if (pre.querySelector('.lib-copy')) return
      const b = document.createElement('button')
      b.type = 'button'
      b.className = 'lib-copy'
      b.textContent = 'Copy'
      b.addEventListener('click', () => {
        const code = pre.querySelector('code')?.textContent ?? pre.textContent ?? ''
        void navigator.clipboard?.writeText(code).then(() => {
          b.textContent = 'Copied'
          window.setTimeout(() => (b.textContent = 'Copy'), 1200)
        })
      })
      pre.appendChild(b)
    })
    const words = p.tab.words.filter((w) => w.length >= 2)
    let count = 0
    if (words.length) {
      const re = new RegExp(`(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi')
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode: (n) =>
          n.parentElement?.closest('pre, code, .lib-anchor, mark.lib-find, .lib-embed') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT,
      })
      const nodes: Text[] = []
      while (walker.nextNode()) nodes.push(walker.currentNode as Text)
      for (const node of nodes) {
        const text = node.data
        re.lastIndex = 0
        if (!re.test(text)) continue
        re.lastIndex = 0
        const frag = document.createDocumentFragment()
        let last = 0
        let m: RegExpExecArray | null
        while ((m = re.exec(text))) {
          if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)))
          const mark = document.createElement('mark')
          mark.className = 'lib-find'
          mark.dataset.find = String(count++)
          mark.textContent = m[0]
          frag.appendChild(mark)
          last = m.index + m[0].length
        }
        if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)))
        node.parentNode?.replaceChild(frag, node)
      }
    }
    setFindCount(count)
    setFindIdx(0)
    if (p.tab.heading?.startsWith('^')) {
      const marker = root.querySelector<HTMLElement>(`[data-block="${CSS.escape(p.tab.heading.slice(1))}"]`)
      const block = marker?.closest<HTMLElement>('p, li, blockquote, table, .lib-callout') ?? marker?.parentElement
      if (block) {
        block.dataset.flash = 'true'
        window.setTimeout(() => block.scrollIntoView({ block: 'center' }), 30)
      }
    } else if (p.tab.heading) {
      const want = p.tab.heading.toLowerCase()
      const target = rendered.outline.find((o) => o.text.toLowerCase() === want)
      if (target) window.setTimeout(() => document.getElementById(target.id)?.scrollIntoView({ block: 'start' }), 30)
    } else if (count) {
      window.setTimeout(() => root.querySelector('mark.lib-find')?.scrollIntoView({ block: 'center' }), 30)
    }
  }, [rendered, p.tab.words, p.tab.heading])

  // Fill ![[Note]] embeds once the host note is on screen. One level deep: the
  // embedded note renders its own embeds as links (see renderMarkdown's
  // `embedded`), so a note that embeds itself cannot recurse.
  useEffect(() => {
    const root = proseRef.current
    if (!root || !rendered || !doc) return
    const slots = Array.from(root.querySelectorAll<HTMLElement>('.lib-embed[data-embed]'))
    if (!slots.length) return
    let live = true
    const docs = new Map<string, Promise<Doc>>()
    const load = (target: string) => {
      let pending = docs.get(target)
      if (!pending) {
        pending = api
          .get<DocRef>(`${BASE}/resolve?${qs({ t: target, c: doc.collection })}`)
          .then((ref) => api.get<Doc>(`${BASE}/doc?${qs({ c: ref.collection, p: ref.path })}`))
        docs.set(target, pending)
      }
      return pending
    }
    slots.forEach((slot, n) => {
      const body = slot.querySelector<HTMLElement>('.lib-embed-body')
      if (!body) return
      const heading = slot.dataset.heading || ''
      load(slot.dataset.embed || '')
        .then((d) => {
          if (!live) return
          const section = extractSection(d.markdown, heading)
          if (section === null) {
            body.textContent = heading.startsWith('^') ? 'That block is no longer in the note.' : `No heading “${heading}” in this note.`
            body.className = 'lib-embed-body lib-embed-missing'
            return
          }
          if (d.private) {
            body.textContent = 'Private note. Open it to read.'
            body.className = 'lib-embed-body lib-embed-missing'
            return
          }
          body.innerHTML = renderMarkdown(section, { collection: d.collection, path: d.path, title: heading ? undefined : d.title, embedded: true, idPrefix: `embed-${n}-` }).html
          body.className = 'lib-embed-body'
        })
        .catch(() => {
          if (!live) return
          body.textContent = 'This note could not be found.'
          body.className = 'lib-embed-body lib-embed-missing'
          slot.querySelector('.lib-wikilink')?.setAttribute('data-broken', 'true')
        })
    })
    return () => {
      live = false
    }
  }, [api, rendered, doc])

  useEffect(() => {
    const root = proseRef.current
    if (!root || !findCount) return
    root.querySelectorAll('mark.lib-find[data-active]').forEach((m) => m.removeAttribute('data-active'))
    const m = root.querySelector<HTMLElement>(`mark.lib-find[data-find="${findIdx}"]`)
    if (m) {
      m.dataset.active = 'true'
      m.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
  }, [findIdx, findCount])

  // Scroll spy for the outline.
  useEffect(() => {
    const root = proseRef.current
    const scroller = scrollRef.current
    if (!root || !scroller || !rendered?.outline.length) return
    const heads = rendered.outline.map((o) => document.getElementById(o.id)).filter(Boolean) as HTMLElement[]
    const onScroll = () => {
      const top = scroller.getBoundingClientRect().top + 80
      let cur: string | null = heads[0]?.id ?? null
      for (const h of heads) {
        if (h.getBoundingClientRect().top <= top) cur = h.id
        else break
      }
      setCurrent(cur)
    }
    onScroll()
    scroller.addEventListener('scroll', onScroll, { passive: true })
    return () => scroller.removeEventListener('scroll', onScroll)
  }, [rendered])

  const onProseClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = e.target as HTMLElement
      const wl = el.closest<HTMLElement>('[data-wikilink]')
      if (wl) {
        e.preventDefault()
        p.onOpenLink(wl.dataset.wikilink || '', wl.dataset.heading || '', p.tab.collection)
        return
      }
      const tag = el.closest<HTMLElement>('[data-tag]')
      if (tag) {
        e.preventDefault()
        p.onTag(tag.dataset.tag || '')
        return
      }
      const a = el.closest<HTMLAnchorElement>('a[href^="#"]')
      if (a) {
        e.preventDefault()
        const id = decodeURIComponent(a.getAttribute('href')!.slice(1))
        document.getElementById(id)?.scrollIntoView({ block: 'start', behavior: 'smooth' })
        return
      }
      const rel = el.closest<HTMLAnchorElement>('a[href]')
      if (rel && !/^[a-z][a-z0-9+.-]*:/i.test(rel.getAttribute('href') || '') && /\.md(#.*)?$/i.test(rel.getAttribute('href') || '')) {
        e.preventDefault()
        const href = decodeURIComponent(rel.getAttribute('href')!)
        const base = p.tab.path.includes('/') ? p.tab.path.slice(0, p.tab.path.lastIndexOf('/') + 1) : ''
        const parts = (base + href.split('#')[0]).split('/')
        const out: string[] = []
        for (const part of parts) {
          if (part === '..') out.pop()
          else if (part && part !== '.') out.push(part)
        }
        p.onOpenHit({ collection: p.tab.collection, path: out.join('/'), title: out[out.length - 1].replace(/\.md$/i, ''), uri: '', modified_at: null, score: 0, snippet: [] })
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [p.tab.collection, p.tab.path, p.onOpenLink, p.onTag, p.onOpenHit],
  )

  function submitAsk() {
    if (!doc) return
    const q = ask.trim()
    if (p.onAddToChat && q) p.onAddToChat(doc, q)
    else p.onChat(doc, q)
    setAsk('')
  }

  function onAskKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.nativeEvent.isComposing) return
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submitAsk()
    }
  }

  const propEntries = doc ? Object.entries(doc.properties).filter(([k]) => k !== 'private') : []

  return (
    <div className="lib-scroll" ref={scrollRef} onWheel={p.tab.preview ? p.onTouch : undefined}>
      {error && (
        <div className="lib-welcome">
          <div className="lib-alert" role="alert">
            <I.Alert size={16} />
            <span>{error}</span>
          </div>
        </div>
      )}
      {!doc && !error && (
        <div className="lib-doc">
          <div className="lib-article lib-skeleton" aria-busy="true" aria-label="Loading note">
            <i style={{ width: '30%' }} />
            <i style={{ width: '70%', height: 36 }} />
            <i style={{ width: '45%' }} />
            <br />
            {[92, 88, 95, 60, 90, 84, 40].map((w, i) => (
              <i key={i} style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
      )}
      {doc && rendered && (
        <div className="lib-doc">
          <article className="lib-article">
            {findCount > 0 && (
              <div className="lib-findbar" role="group" aria-label="Matches in this note">
                <span>
                  {findIdx + 1} / {findCount}
                </span>
                <button type="button" className="lib-btn lib-btn-quiet lib-btn-icon" aria-label="Previous match" onClick={() => setFindIdx((i) => (i - 1 + findCount) % findCount)}>
                  <I.ChevronUp size={14} />
                </button>
                <button type="button" className="lib-btn lib-btn-quiet lib-btn-icon" aria-label="Next match" onClick={() => setFindIdx((i) => (i + 1) % findCount)}>
                  <I.ChevronDown size={14} />
                </button>
              </div>
            )}
            <nav className="lib-crumbs" aria-label="Location">
              <I.Folder size={13} />
              {folderOf(doc.collection, doc.path)
                .split(' / ')
                .map((seg, i, all) => (
                  <span key={i} className="lib-row" style={{ gap: 4 }}>
                    {seg}
                    {i < all.length - 1 && <I.Chevron size={12} />}
                  </span>
                ))}
            </nav>
            <h1 className="lib-title">{doc.title}</h1>
            <div className="lib-docmeta">
              {doc.modified_at && (
                <span title={longDate(doc.modified_at)}>
                  <I.Clock size={13} /> Edited {relTime(doc.modified_at)}
                </span>
              )}
              <span>
                {doc.reading_minutes} min read · {doc.words.toLocaleString()} words
              </span>
              {doc.private && (
                <span className="lib-tag lib-tag-warn">
                  <I.Lock size={11} /> private
                </span>
              )}
              {doc.stale_index && (
                <span className="lib-tag" title="The file changed after QMD last indexed it. Search results may lag until the next qmd update.">
                  edited since indexed
                </span>
              )}
              {doc.source === 'index' && <span className="lib-tag lib-tag-warn">file deleted · showing indexed copy</span>}
            </div>

            <div className="lib-actions">
              <button
                type="button"
                className="lib-btn lib-btn-primary"
                disabled={doc.private}
                title={doc.private ? 'Private notes are not shared with an agent' : 'Start a new chat about this note'}
                onClick={() => p.onChat(doc, '')}
              >
                <I.ChatPlus size={15} />
                Chat about this
              </button>
              {p.onAddToChat && !doc.private && (
                <button type="button" className="lib-btn lib-btn-secondary" onClick={() => p.onAddToChat!(doc, '')} title={`Bring this note into “${p.activeChatTitle}”`}>
                  <I.Plus size={15} />
                  Add to current chat
                </button>
              )}
              {p.sessionsForDoc.slice(0, 2).map((s) => (
                <button key={s.slot_key} type="button" className="lib-btn lib-btn-quiet" onClick={() => p.onResumeSession(s)} title={`Reopen chat from ${longDate(s.created_at)}`}>
                  <I.Chat size={14} />
                  Resume · {relTime(s.created_at)}
                </button>
              ))}
              <span className="lib-grow" />
              {doc.obsidian && (
                <a
                  className="lib-btn lib-btn-quiet lib-btn-sm"
                  href={`obsidian://open?${qs({ vault: doc.obsidian.vault, file: doc.obsidian.file })}`}
                  title={`Open in the “${doc.obsidian.vault}” vault in Obsidian`}
                >
                  <I.External size={14} />
                  Open in Obsidian
                </a>
              )}
              <button
                type="button"
                className="lib-btn lib-btn-quiet lib-btn-icon"
                title="Copy the file path"
                aria-label="Copy the file path"
                onClick={() => void navigator.clipboard?.writeText(doc.abs_path).then(() => p.notify('Path copied'))}
              >
                <I.Copy size={15} />
              </button>
              <button
                type="button"
                className="lib-btn lib-btn-quiet lib-btn-icon"
                title="Copy the [[wikilink]]"
                aria-label="Copy the wikilink"
                onClick={() => void navigator.clipboard?.writeText(`[[${doc.title}]]`).then(() => p.notify('Wikilink copied'))}
              >
                <I.Link size={15} />
              </button>
              {propEntries.length > 0 && (
                <button type="button" className="lib-btn lib-btn-quiet lib-btn-sm" aria-pressed={showProps} onClick={() => setShowProps((v) => !v)}>
                  Properties
                </button>
              )}
            </div>

            {showProps && propEntries.length > 0 && (
              <dl className="lib-props">
                {propEntries.map(([k, v]) => (
                  <div key={k} style={{ display: 'contents' }}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            )}

            <div
              ref={proseRef}
              className="lib-prose"
              style={{ marginTop: 26 }}
              onClick={onProseClick}
              onKeyDown={(e) => {
                const t = e.target as HTMLElement
                if ((e.key === 'Enter' || e.key === ' ') && t.dataset.tag) {
                  e.preventDefault()
                  p.onTag(t.dataset.tag)
                }
              }}
            />

            {backlinks && backlinks.length > 0 && (
              <section className="lib-backlinks" aria-label="Linked from">
                <h3>
                  Linked from {backlinks.length} note{backlinks.length === 1 ? '' : 's'}
                </h3>
                {backlinks.map((b) => (
                  <button key={docKey(b)} type="button" className="lib-backlink" onClick={() => p.onOpenHit(b)}>
                    <div className="lib-row">
                      <b className="lib-grow lib-ell">{b.title}</b>
                      <span className="lib-meta-sm">{relTime(b.modified_at)}</span>
                    </div>
                    {b.snippet.length > 0 && (
                      <div className="lib-hit-snippet">
                        <Snippet parts={b.snippet} onLink={(t) => p.onOpenLink(t, '', b.collection)} />
                      </div>
                    )}
                  </button>
                ))}
              </section>
            )}
          </article>

          {rendered.outline.length > 1 && (
            <nav className="lib-outline" aria-label="On this page">
              <h4>On this page</h4>
              {rendered.outline.map((o) => (
                <a
                  key={o.id}
                  href={`#${o.id}`}
                  data-depth={o.depth}
                  aria-current={current === o.id}
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById(o.id)?.scrollIntoView({ block: 'start', behavior: 'smooth' })
                  }}
                >
                  {o.text}
                </a>
              ))}
            </nav>
          )}
        </div>
      )}

      {doc && !doc.private && (
        <div className="lib-ask">
          <I.Sparkles size={17} aria-hidden="true" />
          <textarea
            rows={1}
            value={ask}
            onChange={(e) => {
              setAsk(e.target.value)
              e.target.style.height = 'auto'
              e.target.style.height = `${Math.min(160, e.target.scrollHeight)}px`
            }}
            onKeyDown={onAskKey}
            placeholder={p.onAddToChat ? `Ask in “${p.activeChatTitle}” about this note…` : 'Ask anything about this note…'}
            aria-label="Ask about this note"
          />
          <button type="button" className="lib-btn lib-btn-primary lib-btn-icon" aria-label="Ask" onClick={submitAsk}>
            <I.ArrowUp size={16} strokeWidth={2.6} />
          </button>
        </div>
      )}
    </div>
  )
}
