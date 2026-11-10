/**
 * The right column: every chat opened from Notes Search, side by side as tabs.
 *
 * Each tab is a real dashboard session (it lives in the sidebar under
 * "Notes Search", has the host's approvals and transcript), rendered with the host's
 * own ChatEmbed. The drawer adds what the host does not know: which notes each
 * conversation is about, shown as chips that reopen the note.
 */
import { ChatEmbed, useNavigate } from '@kirocrew/app-sdk'
import { I } from './icons'
import { docKey, type DocRef, type Session } from './api'
import { longDate, relTime } from './util'

export interface ChatDrawerProps {
  open: Session[]
  active: string | null
  starting: string | null
  sessions: Session[]
  currentDocKey: string | null
  onActivate: (key: string) => void
  onClose: (key: string) => void
  onCloseDrawer: () => void
  onResume: (s: Session) => void
  onOpenDoc: (d: DocRef) => void
  onForget: (s: Session) => void
}

export function ChatDrawer(p: ChatDrawerProps) {
  const navigate = useNavigate()
  const activeSession = p.open.find((s) => s.slot_key === p.active) ?? null
  const openKeys = new Set(p.open.map((s) => s.slot_key))
  const history = p.sessions.filter((s) => !openKeys.has(s.slot_key))
  const aboutThis = p.currentDocKey ? history.filter((s) => s.docs.some((d) => docKey(d) === p.currentDocKey)) : []
  const others = history.filter((s) => !aboutThis.includes(s))

  return (
    <aside className="lib-right" aria-label="Chats">
      <div className="lib-chathead">
        <h2 className="lib-grow">Chats</h2>
        {activeSession && (
          <button
            type="button"
            className="lib-btn lib-btn-quiet lib-btn-icon"
            title="Open this chat full screen"
            aria-label="Open this chat full screen"
            onClick={() => navigate(`/chat?sid=${encodeURIComponent(activeSession.slot_key)}`)}
          >
            <I.External size={15} />
          </button>
        )}
        <button type="button" className="lib-btn lib-btn-quiet lib-btn-icon" aria-label="Hide chats" onClick={p.onCloseDrawer}>
          <I.PanelRight size={16} />
        </button>
      </div>

      {p.open.length > 0 && (
        <div className="lib-chattabs" role="tablist" aria-label="Open chats">
          {p.open.map((s) => (
            <div
              key={s.slot_key}
              role="tab"
              tabIndex={0}
              aria-selected={s.slot_key === p.active}
              className="lib-chattab"
              title={s.title}
              onClick={() => p.onActivate(s.slot_key)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && p.onActivate(s.slot_key)}
            >
              <span className="lib-dot" data-live={p.starting === s.slot_key} />
              <span className="lib-ell">{s.title.replace(/^📄\s*/, '')}</span>
              <span
                className="lib-tab-x"
                role="button"
                aria-label={`Close ${s.title}`}
                onClick={(e) => {
                  e.stopPropagation()
                  p.onClose(s.slot_key)
                }}
              >
                <I.X size={12} strokeWidth={2.6} />
              </span>
            </div>
          ))}
        </div>
      )}

      {activeSession ? (
        <>
          {activeSession.docs.length > 0 && (
            <div className="lib-context">
              <span>About</span>
              {activeSession.docs.map((d) => (
                <button key={docKey(d)} type="button" className="lib-docchip" onClick={() => p.onOpenDoc(d)} title={`${d.collection}/${d.path}`}>
                  <I.File size={12} />
                  <span className="lib-ell">{d.title}</span>
                </button>
              ))}
            </div>
          )}
          <div className="lib-chatbody">
            <ChatEmbed key={activeSession.slot_key} slotKey={activeSession.slot_key} frameless startAtBottom placeholder="Reply…" />
          </div>
        </>
      ) : (
        <div className="lib-convos">
          {p.sessions.length === 0 && (
            <div className="lib-empty">
              <h3>No chats yet</h3>
              <p>
                Open a note and press <b>Chat about this</b>, or select several results and chat about them together. Each chat is a full session in your
                sidebar.
              </p>
            </div>
          )}
          {aboutThis.length > 0 && <div className="lib-section">About this note</div>}
          {aboutThis.map((s) => (
            <ConvoRow key={s.slot_key} s={s} onResume={p.onResume} onForget={p.onForget} />
          ))}
          {others.length > 0 && <div className="lib-section">Earlier</div>}
          {others.map((s) => (
            <ConvoRow key={s.slot_key} s={s} onResume={p.onResume} onForget={p.onForget} />
          ))}
        </div>
      )}
    </aside>
  )
}

function ConvoRow({ s, onResume, onForget }: { s: Session; onResume: (s: Session) => void; onForget: (s: Session) => void }) {
  return (
    <div className="lib-row" style={{ alignItems: 'flex-start' }}>
      <button type="button" className="lib-convo lib-grow" onClick={() => onResume(s)} title={longDate(s.created_at)}>
        <b className="lib-ell" style={{ maxWidth: '100%' }}>
          {s.title.replace(/^📄\s*/, '')}
        </b>
        <span className="lib-meta-sm lib-ell" style={{ maxWidth: '100%' }}>
          {relTime(s.created_at)} · {s.docs.map((d) => d.title).join(', ')}
        </span>
      </button>
      <button type="button" className="lib-btn lib-btn-quiet lib-btn-icon" style={{ marginTop: 8 }} aria-label={`Remove ${s.title} from this list`} title="Remove from this list (the chat stays in your sidebar)" onClick={() => onForget(s)}>
        <I.X size={13} />
      </button>
    </div>
  )
}
