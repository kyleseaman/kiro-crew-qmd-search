/**
 * Notes Search -- the app page. The default export is what the host mounts.
 *
 * Three columns: search on the left, the reader in the middle, chats on the
 * right. The open notes, open chats and panel layout survive a reload through
 * localStorage, so Notes Search reopens where it was left.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTheme } from '@kirocrew/app-sdk'
import { LIBRARY_CSS } from './theme'
import { I } from './icons'
import {
  BASE,
  addDocMessage,
  createChat,
  docKey,
  errorMessage,
  qs,
  sendToSlot,
  useApi,
  useDeep,
  useSuggest,
  type Doc,
  type DocRef,
  type Hit,
  type Session,
  type SortMode,
  type Status,
} from './api'
import { SearchPanel, useRows } from './Search'
import { Reader, TabStrip, type Tab } from './Reader'
import { ChatDrawer } from './Chat'
import { MOD, relTime } from './util'
import { Folders } from './Folders'

const STORE = 'notes-search:v1'

interface Persisted {
  tabs: Tab[]
  active: string | null
  chats: Session[]
  activeChat: string | null
  chatOpen: boolean
  leftOpen: boolean
  collection: string | null
  sort: SortMode
}

function loadPersisted(): Partial<Persisted> {
  try {
    const raw = window.localStorage.getItem(STORE)
    return raw ? (JSON.parse(raw) as Partial<Persisted>) : {}
  } catch {
    return {}
  }
}

export default function QmdLibrary() {
  const api = useApi()
  const theme = useTheme()
  const initial = useMemo(loadPersisted, [])

  const [status, setStatus] = useState<Status | null>(null)
  const [query, setQuery] = useState('')
  const [collection, setCollection] = useState<string | null>(initial.collection ?? null)
  const [sort, setSort] = useState<SortMode>(initial.sort === 'recent' ? 'recent' : 'relevance')
  const [selected, setSelected] = useState(0)
  const [recent, setRecent] = useState<Hit[]>([])
  const [picks, setPicks] = useState<Map<string, Hit>>(new Map())

  const [tabs, setTabs] = useState<Tab[]>((initial.tabs ?? []).map((t) => ({ ...t, preview: false })))
  const [active, setActive] = useState<string | null>(initial.active ?? null)
  const [leftOpen, setLeftOpen] = useState(initial.leftOpen ?? true)

  const [sessions, setSessions] = useState<Session[]>([])
  const [chats, setChats] = useState<Session[]>(initial.chats ?? [])
  const [activeChat, setActiveChat] = useState<string | null>(initial.activeChat ?? null)
  const [chatOpen, setChatOpen] = useState(initial.chatOpen ?? false)
  const [starting, setStarting] = useState<string | null>(null)

  const [toast, setToast] = useState<{ msg: string; kind: 'info' | 'error' } | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const docs = useRef(new Map<string, Doc>())

  const suggest = useSuggest(api, query, collection, sort)
  const deep = useDeep(api)
  const rows = useRows({ query, suggest: suggest.result, deep: deep.result, recent, sort })

  const notify = useCallback((msg: string, kind: 'info' | 'error' = 'info') => {
    setToast({ msg, kind })
    window.setTimeout(() => setToast((t) => (t?.msg === msg ? null : t)), kind === 'error' ? 6000 : 2200)
  }, [])

  // ── persistence ──
  useEffect(() => {
    const data: Persisted = { tabs: tabs.filter((t) => !t.preview || docKey(t) === active), active, chats, activeChat, chatOpen, leftOpen, collection, sort }
    try {
      window.localStorage.setItem(STORE, JSON.stringify(data))
    } catch {
      /* storage full or disabled */
    }
  }, [tabs, active, chats, activeChat, chatOpen, leftOpen, collection, sort])

  // ── initial data ──
  const refreshSessions = useCallback(() => {
    api
      .get<{ sessions: Session[] }>(`${BASE}/sessions`)
      .then((r) => setSessions(r.sessions))
      .catch(() => undefined)
  }, [api])

  const [showFolders, setShowFolders] = useState(false)
  const [indexEpoch, setIndexEpoch] = useState(0)

  const refreshStatus = useCallback(() => {
    api.get<Status>(`${BASE}/status`).then(setStatus).catch((e) => setStatus({ index: '', qmd: null, schema_ok: false, collections: [], documents: 0, index_updated_at: null, error: errorMessage(e) }))
  }, [api])

  // A folder was added, removed or re-indexed: counts, filters and recents change.
  const onFoldersChanged = useCallback(() => {
    refreshStatus()
    setIndexEpoch((n) => n + 1)
  }, [refreshStatus])

  useEffect(() => {
    refreshStatus()
    refreshSessions()
  }, [refreshStatus, refreshSessions])

  useEffect(() => {
    api
      .get<{ results: Hit[] }>(`${BASE}/recent?${qs({ c: collection, limit: 30 })}`)
      .then((r) => setRecent(r.results))
      .catch(() => setRecent([]))
  }, [api, collection, indexEpoch])

  useEffect(() => {
    if (deep.result && deep.result.query !== query.trim()) deep.clear()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  // ── tabs ──
  const openDoc = useCallback((d: DocRef & { title: string }, opts: { pin?: boolean; words?: string[]; heading?: string } = {}) => {
    const key = docKey(d)
    setTabs((prev) => {
      const words = opts.words ?? []
      const existing = prev.find((t) => docKey(t) === key)
      if (existing) {
        return prev.map((t) => (docKey(t) === key ? { ...t, preview: t.preview && !opts.pin, words, heading: opts.heading } : t))
      }
      const tab: Tab = { collection: d.collection, path: d.path, title: d.title, preview: !opts.pin, words, heading: opts.heading }
      const previewAt = prev.findIndex((t) => t.preview)
      if (previewAt >= 0) {
        const next = [...prev]
        next[previewAt] = tab
        return next
      }
      return [...prev, tab]
    })
    setActive(key)
    setShowFolders(false)
  }, [])

  const closeTab = useCallback(
    (key: string) => {
      setTabs((prev) => {
        const i = prev.findIndex((t) => docKey(t) === key)
        const next = prev.filter((t) => docKey(t) !== key)
        if (active === key) {
          const neighbour = next[Math.min(i, next.length - 1)]
          setActive(neighbour ? docKey(neighbour) : null)
        }
        return next
      })
    },
    [active],
  )

  const pin = useCallback((key: string) => setTabs((prev) => prev.map((t) => (docKey(t) === key ? { ...t, preview: false } : t))), [])

  const openLink = useCallback(
    (target: string, heading: string, from: string) => {
      api
        .get<DocRef>(`${BASE}/resolve?${qs({ t: target, c: from })}`)
        .then((d) => openDoc(d, { pin: true, heading: heading || undefined }))
        .catch(() => notify(`No note is titled “${target}” yet`, 'error'))
    },
    [api, openDoc, notify],
  )

  const onSelected = useCallback(
    (i: number, viaKeyboard?: boolean) => {
      setSelected(i)
      if (viaKeyboard) {
        const row = rows.flat[i]
        if (row) openDoc(row.hit, { words: row.words })
      }
    },
    [rows.flat, openDoc],
  )

  // ── picks ──
  const togglePick = useCallback((hit: Hit) => {
    setPicks((prev) => {
      const next = new Map(prev)
      const k = docKey(hit)
      if (next.has(k)) next.delete(k)
      else next.set(k, hit)
      return next
    })
  }, [])

  // ── chats ──
  const startChat = useCallback(
    async (refs: DocRef[], question: string) => {
      setChatOpen(true)
      setStarting('pending')
      try {
        const session = await createChat(api, refs, question)
        setChats((prev) => [session, ...prev.filter((s) => s.slot_key !== session.slot_key)])
        setActiveChat(session.slot_key)
        setStarting(session.slot_key)
        window.setTimeout(() => setStarting((s) => (s === session.slot_key ? null : s)), 8000)
        refreshSessions()
        return session
      } catch (e) {
        setStarting(null)
        notify(errorMessage(e), 'error')
        return null
      }
    },
    [api, notify, refreshSessions],
  )

  const chatPicks = useCallback(() => {
    const refs = [...picks.values()].map((h) => ({ collection: h.collection, path: h.path, title: h.title }))
    void startChat(refs, '').then((s) => s && setPicks(new Map()))
  }, [picks, startChat])

  const activeSession = chats.find((s) => s.slot_key === activeChat) ?? null

  const addToChat = useCallback(
    (doc: Doc, question: string) => {
      if (!activeSession) return
      const already = activeSession.docs.some((d) => docKey(d) === docKey(doc))
      const msg = already ? question.trim() || 'Look at this note again.' : addDocMessage(doc, question)
      setChatOpen(true)
      sendToSlot(api, activeSession.slot_key, msg).catch((e) => notify(errorMessage(e), 'error'))
      if (!already) {
        const updated: Session = { ...activeSession, docs: [...activeSession.docs, { collection: doc.collection, path: doc.path, title: doc.title }] }
        setChats((prev) => prev.map((s) => (s.slot_key === updated.slot_key ? updated : s)))
        api.post(`${BASE}/sessions`, updated).then(refreshSessions).catch(() => undefined)
      }
    },
    [api, activeSession, notify, refreshSessions],
  )

  const resume = useCallback((s: Session) => {
    setChats((prev) => (prev.some((c) => c.slot_key === s.slot_key) ? prev : [s, ...prev]))
    setActiveChat(s.slot_key)
    setChatOpen(true)
  }, [])

  const closeChat = useCallback(
    (key: string) => {
      setChats((prev) => {
        const next = prev.filter((s) => s.slot_key !== key)
        if (activeChat === key) setActiveChat(next[0]?.slot_key ?? null)
        return next
      })
    },
    [activeChat],
  )

  const forget = useCallback(
    (s: Session) => {
      api
        .del(`${BASE}/sessions/${encodeURIComponent(s.slot_key)}`)
        .then(refreshSessions)
        .catch(() => undefined)
    },
    [api, refreshSessions],
  )

  // ── global keys ──
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      const typing = !!t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)
      const mod = e.metaKey || e.ctrlKey
      if ((mod && e.key.toLowerCase() === 'k') || (!typing && e.key === '/')) {
        e.preventDefault()
        setLeftOpen(true)
        window.setTimeout(() => {
          searchRef.current?.focus()
          searchRef.current?.select()
        }, 0)
      } else if (mod && e.key.toLowerCase() === 'j') {
        e.preventDefault()
        setChatOpen((v) => !v)
      } else if (mod && e.key === '\\') {
        e.preventDefault()
        setLeftOpen((v) => !v)
      } else if (!typing && e.altKey && /^[1-9]$/.test(e.key)) {
        const tab = tabs[Number(e.key) - 1]
        if (tab) setActive(docKey(tab))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [tabs])

  const activeTab = tabs.find((t) => docKey(t) === active) ?? null
  const sessionsForDoc = activeTab ? sessions.filter((s) => s.docs.some((d) => docKey(d) === docKey(activeTab))) : []
  const indexInfo = status ? { documents: status.documents, updated: status.index_updated_at, error: status.error } : null

  return (
    <div className="lib" data-mode={theme?.mode === 'light' ? 'light' : 'dark'} data-testid="notes-search-root">
      <style>{LIBRARY_CSS}</style>
      {toast && (
        <div className="lib-toast" role="status" data-kind={toast.kind}>
          {toast.msg}
        </div>
      )}
      <div className="lib-frame" data-chat={chatOpen ? 'open' : 'closed'} data-left={leftOpen ? 'open' : 'closed'}>
        {leftOpen ? (
          <SearchPanel
            ref={searchRef}
            query={query}
            onQuery={setQuery}
            collections={status?.collections ?? []}
            collection={collection}
            onCollection={setCollection}
            suggest={suggest.result}
            suggestLoading={suggest.loading}
            suggestError={suggest.error}
            deep={deep.result}
            deepRunning={deep.running}
            deepError={deep.error}
            onDeep={() => deep.run(query, collection)}
            recent={recent}
            activeKey={active}
            selected={selected}
            onSelected={onSelected}
            onOpen={(hit, o) => openDoc(hit, o)}
            onLink={(t, c) => openLink(t, '', c)}
            picks={picks}
            onTogglePick={togglePick}
            onClearPicks={() => setPicks(new Map())}
            onChatPicks={chatPicks}
            indexInfo={indexInfo}
            sort={sort}
            onSort={setSort}
            onCollapse={() => setLeftOpen(false)}
          />
        ) : (
          <div />
        )}

        <main className="lib-center" aria-label="Reader">
          <TabStrip
            tabs={tabs}
            active={active}
            onActivate={setActive}
            onClose={closeTab}
            onPin={pin}
            leftOpen={leftOpen}
            onToggleLeft={() => setLeftOpen((v) => !v)}
            chatOpen={chatOpen}
            chatCount={chats.length}
            onToggleChat={() => setChatOpen((v) => !v)}
            foldersOpen={showFolders}
            onToggleFolders={() => setShowFolders((v) => !v)}
          />
          {showFolders ? (
            <div className="lib-scroll">
              <div className="lib-welcome" style={{ paddingTop: 48 }}>
                <div className="lib-row" style={{ gap: 10 }}>
                  <h2 className="lib-grow">Folders</h2>
                  <button type="button" className="lib-btn lib-btn-quiet lib-btn-icon" aria-label="Close folders" onClick={() => setShowFolders(false)}>
                    <I.X size={16} />
                  </button>
                </div>
                <p>Notes Search looks in every folder listed here. Each one is a QMD collection on this computer.</p>
                <Folders onChanged={onFoldersChanged} />
              </div>
            </div>
          ) : activeTab ? (
            <Reader
              key={docKey(activeTab)}
              tab={activeTab}
              onTouch={() => pin(docKey(activeTab))}
              onOpenLink={openLink}
              onOpenHit={(h) => openDoc(h, { pin: true })}
              onTag={(tag) => {
                setLeftOpen(true)
                setQuery(tag)
                setSelected(0)
              }}
              onChat={(doc, q) => {
                pin(docKey(doc))
                void startChat([{ collection: doc.collection, path: doc.path, title: doc.title }], q)
              }}
              onAddToChat={activeSession && chatOpen ? addToChat : null}
              activeChatTitle={activeSession ? activeSession.title.replace(/^📄\s*/, '') : null}
              sessionsForDoc={sessionsForDoc.filter((s) => s.slot_key !== activeChat)}
              onResumeSession={resume}
              notify={notify}
              onDocLoaded={(d) => {
                docs.current.set(docKey(d), d)
                if (d.title !== activeTab.title) setTabs((prev) => prev.map((t) => (docKey(t) === docKey(d) ? { ...t, title: d.title } : t)))
              }}
            />
          ) : (
            <Welcome status={status} sessions={sessions} onResume={resume} onSearch={() => searchRef.current?.focus()} recent={recent} onOpen={(h) => openDoc(h, { pin: true })} onFoldersChanged={onFoldersChanged} />
          )}
        </main>

        {chatOpen ? (
          <ChatDrawer
            open={chats}
            active={activeChat}
            starting={starting}
            sessions={sessions}
            currentDocKey={active}
            onActivate={setActiveChat}
            onClose={closeChat}
            onCloseDrawer={() => setChatOpen(false)}
            onResume={resume}
            onOpenDoc={(d) => openDoc(d, { pin: true })}
            onForget={forget}
          />
        ) : (
          <div />
        )}
      </div>
    </div>
  )
}

function Welcome(p: {
  status: Status | null
  sessions: Session[]
  recent: Hit[]
  onResume: (s: Session) => void
  onSearch: () => void
  onOpen: (h: Hit) => void
  onFoldersChanged: () => void
}) {
  // No index yet, or an index with nothing in it: setup is the only useful thing here.
  if (p.status && (p.status.collections.length === 0 || /index not found/i.test(p.status.error ?? ''))) {
    return (
      <div className="lib-scroll">
        <div className="lib-welcome">
          <h2>Point Notes Search at your notes</h2>
          <p>
            Add a folder of markdown, such as an Obsidian vault or a Reflect graph. Notes Search indexes it with QMD on this computer, then you can search it, read notes and chat about them. Nothing leaves your machine until you start a chat.
          </p>
          <div className="lib-welcome-folders">
            <Folders onChanged={p.onFoldersChanged} firstRun />
          </div>
        </div>
      </div>
    )
  }
  // Nothing open: a quiet placeholder. The search panel on the left is the
  // starting point, so this side doesn't repeat it.
  return (
    <div className="lib-scroll">
      <div className="lib-empty-reader">
        <I.File size={30} strokeWidth={1.6} aria-hidden="true" />
        <b>No note open</b>
        <p>Pick a note on the left, or search to find one. You can chat about any note you open.</p>
        <div className="lib-keyline" aria-label="Keyboard shortcuts">
          <span><span className="lib-kbd">/</span> search</span>
          <span><span className="lib-kbd">{MOD}↵</span> search by meaning</span>
          <span><span className="lib-kbd">⇧↵</span> select several</span>
          <span><span className="lib-kbd">{MOD}J</span> chats</span>
        </div>
        {p.sessions.length > 0 && (
          <div className="lib-empty-chats">
            <div className="lib-section" style={{ paddingLeft: 0 }}>Recent chats</div>
            {p.sessions.slice(0, 5).map((s) => (
              <button key={s.slot_key} type="button" className="lib-convo" onClick={() => p.onResume(s)}>
                <b>{s.title.replace(/^📄\s*/, '')}</b>
                <span className="lib-meta-sm">{relTime(s.created_at)}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
