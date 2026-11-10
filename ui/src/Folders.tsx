/**
 * Folders: the QMD collections Notes Search reads, and the controls to change them.
 *
 * Every change is a job on the backend (`qmd collection add`, `qmd update`,
 * `qmd embed`, `qmd collection remove`), so this page submits, then polls
 * `GET /folders` while anything is queued or running. Removing a folder only
 * takes it out of the index: the files on disk are never touched, and the
 * confirmation says so.
 */
import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { I } from './icons'
import { BASE, errorMessage, useApi } from './api'
import { relTime } from './util'

export interface FolderJob {
  id: string
  kind: 'add' | 'remove' | 'reindex'
  collection: string
  state: 'queued' | 'running' | 'done' | 'failed'
  step: string
  message: string
  started_at: string
  finished_at: string | null
}

interface Folder {
  name: string
  path: string
  docs: number
  kind: 'obsidian' | 'reflect' | 'markdown'
}

interface Suggestion {
  path: string
  name: string
  label: string
  kind: 'obsidian'
}

interface Overview {
  folders: Folder[]
  jobs: FolderJob[]
  suggestions: Suggestion[]
  qmd: string | null
  index: string
}

const KIND_LABEL: Record<Folder['kind'], string> = { obsidian: 'Obsidian vault', reflect: 'Reflect graph', markdown: 'Markdown' }

function slug(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'notes'
}

function baseName(path: string): string {
  return path.replace(/[\\/]+$/, '').split(/[\\/]/).pop() || ''
}

const live = (j: FolderJob) => j.state === 'queued' || j.state === 'running'

export function Folders(p: { onChanged: () => void; firstRun?: boolean }) {
  const api = useApi()
  const [ov, setOv] = useState<Overview | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [path, setPath] = useState('')
  const [name, setName] = useState('')
  const [nameTouched, setNameTouched] = useState(false)
  const [mask, setMask] = useState('')
  const [more, setMore] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [confirm, setConfirm] = useState<string | null>(null)
  const seenDone = useRef(new Set<string>())

  const load = useCallback(() => {
    return api
      .get<Overview>(`${BASE}/folders`)
      .then((o) => {
        setOv(o)
        setLoadError(null)
        // Tell the page once per finished job, so search and counts catch up.
        let changed = false
        for (const j of o.jobs) {
          if (!live(j) && !seenDone.current.has(j.id)) {
            seenDone.current.add(j.id)
            changed = true
          }
        }
        if (changed) p.onChanged()
        return o
      })
      .catch((e) => setLoadError(errorMessage(e)))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api])

  useEffect(() => {
    void load().then((o) => o && o.jobs.forEach((j) => !live(j) && seenDone.current.add(j.id)))
  }, [load])

  const running = ov?.jobs.some(live) ?? false
  useEffect(() => {
    if (!running) return
    const t = window.setInterval(() => void load(), 1500)
    return () => window.clearInterval(t)
  }, [running, load])

  function onPath(v: string) {
    setPath(v)
    setFormError(null)
    if (!nameTouched) setName(slug(baseName(v)))
  }

  async function submit(body: { path: string; name: string; mask?: string }) {
    setBusy(true)
    setFormError(null)
    try {
      await api.post(`${BASE}/folders`, body)
      setPath('')
      setName('')
      setNameTouched(false)
      setMask('')
      setMore(false)
      await load()
    } catch (e) {
      setFormError(errorMessage(e))
    } finally {
      setBusy(false)
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!path.trim()) return
    void submit({ path: path.trim(), name: name.trim(), mask: mask.trim() || undefined })
  }

  async function act(kind: 'reindex' | 'remove', folder: string) {
    setConfirm(null)
    try {
      if (kind === 'remove') await api.del(`${BASE}/folders/${encodeURIComponent(folder)}`)
      else await api.post(`${BASE}/folders/${encodeURIComponent(folder)}/reindex`, {})
      await load()
    } catch (e) {
      setFormError(errorMessage(e))
    }
  }

  if (loadError && !ov) {
    return (
      <div className="lib-alert" role="alert">
        <I.Alert size={16} />
        <span>{loadError}</span>
      </div>
    )
  }
  if (!ov) {
    return (
      <div className="lib-skeleton" aria-busy="true" aria-label="Loading folders">
        <i style={{ width: '60%' }} />
        <i style={{ width: '85%' }} />
      </div>
    )
  }

  const jobFor = (folder: string) => ov.jobs.find((j) => j.collection === folder && live(j))
  const pendingAdds = ov.jobs.filter((j) => j.kind === 'add' && live(j) && !ov.folders.some((f) => f.name === j.collection))
  const failures = ov.jobs.filter((j) => j.state === 'failed').slice(0, 3)

  return (
    <div className="lib-folders">
      {!ov.qmd && (
        <div className="lib-alert" role="alert">
          <I.Terminal size={16} />
          <div>
            <b>QMD isn’t installed.</b> Notes Search uses it to index your notes. Install it with Node 22 or newer, then reload this page:
            <pre className="lib-cmd">npm install -g @tobilu/qmd</pre>
          </div>
        </div>
      )}

      {ov.suggestions.length > 0 && (
        <section aria-label="Obsidian vaults on this computer">
          <div className="lib-section" style={{ paddingLeft: 0 }}>Found on this computer</div>
          {ov.suggestions.map((s) => (
            <div key={s.path} className="lib-folder">
              <div className="lib-grow" style={{ minWidth: 0 }}>
                <div className="lib-row" style={{ gap: 8 }}>
                  <b className="lib-ell">{s.label}</b>
                  <span className="lib-tag">Obsidian vault</span>
                </div>
                <div className="lib-folder-path lib-ell" title={s.path}>{s.path}</div>
              </div>
              <button type="button" className="lib-btn lib-btn-secondary lib-btn-sm" disabled={!ov.qmd || busy} onClick={() => void submit({ path: s.path, name: s.name })}>
                <I.Plus size={14} /> Add
              </button>
            </div>
          ))}
        </section>
      )}

      <form className="lib-folder-form" onSubmit={onSubmit} aria-label="Add a folder">
        <div className="lib-section" style={{ paddingLeft: 0 }}>{p.firstRun ? 'Add a folder of notes' : 'Add a folder'}</div>
        <label className="lib-field">
          <span>Folder</span>
          <input
            value={path}
            onChange={(e) => onPath(e.target.value)}
            placeholder="~/Documents/Notes"
            spellCheck={false}
            autoComplete="off"
            aria-describedby="lib-folder-hint"
          />
        </label>
        <div id="lib-folder-hint" className="lib-meta-sm">
          An Obsidian vault, a Reflect graph, or any folder of .md files. For a vault, use the folder that contains <code>.obsidian</code>.
        </div>
        {more && (
          <div className="lib-row" style={{ gap: 10, alignItems: 'flex-start' }}>
            <label className="lib-field lib-grow">
              <span>Name</span>
              <input
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  setNameTouched(true)
                }}
                placeholder="notes"
                spellCheck={false}
              />
            </label>
            <label className="lib-field lib-grow">
              <span>Files</span>
              <input value={mask} onChange={(e) => setMask(e.target.value)} placeholder="**/*.md" spellCheck={false} />
            </label>
          </div>
        )}
        {formError && (
          <div className="lib-alert lib-alert-error" role="alert">
            <I.Alert size={16} />
            <span>{formError}</span>
          </div>
        )}
        <div className="lib-row" style={{ gap: 8 }}>
          <button type="submit" className="lib-btn lib-btn-primary" disabled={!ov.qmd || busy || !path.trim()}>
            {busy ? <I.Loader size={15} className="lib-spin" /> : <I.FolderPlus size={15} />}
            Add and index
          </button>
          <button type="button" className="lib-btn lib-btn-quiet lib-btn-sm" aria-expanded={more} onClick={() => setMore((v) => !v)}>
            {more ? 'Fewer options' : 'Name and file pattern'}
          </button>
        </div>
      </form>

      {(ov.folders.length > 0 || pendingAdds.length > 0) && (
        <section aria-label="Searched folders">
          <div className="lib-section" style={{ paddingLeft: 0 }}>Searched folders</div>
          {pendingAdds.map((j) => (
            <div key={j.id} className="lib-folder" aria-busy="true">
              <div className="lib-grow" style={{ minWidth: 0 }}>
                <b>{j.collection}</b>
                <JobLine job={j} />
              </div>
            </div>
          ))}
          {ov.folders.map((f) => {
            const job = jobFor(f.name)
            return (
              <div key={f.name} className="lib-folder" aria-busy={job ? true : undefined}>
                <div className="lib-grow" style={{ minWidth: 0 }}>
                  <div className="lib-row" style={{ gap: 8 }}>
                    <b className="lib-ell">{f.name}</b>
                    <span className="lib-tag">{KIND_LABEL[f.kind]}</span>
                    <span className="lib-meta-sm">{f.docs.toLocaleString()} notes</span>
                  </div>
                  <div className="lib-folder-path lib-ell" title={f.path}>{f.path}</div>
                  {job && <JobLine job={job} />}
                  {confirm === f.name && (
                    <div className="lib-folder-confirm" role="group" aria-label={`Remove ${f.name}`}>
                      <span>Remove “{f.name}” from Notes Search? Your files stay on disk, and you can add the folder again later.</span>
                      <div className="lib-row" style={{ gap: 6 }}>
                        <button type="button" className="lib-btn lib-btn-danger lib-btn-sm" onClick={() => void act('remove', f.name)}>
                          Remove
                        </button>
                        <button type="button" className="lib-btn lib-btn-quiet lib-btn-sm" onClick={() => setConfirm(null)}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                {!job && confirm !== f.name && (
                  <div className="lib-row" style={{ gap: 2, flex: 'none' }}>
                    <button type="button" className="lib-btn lib-btn-quiet lib-btn-sm" disabled={!ov.qmd} title="Re-read changed files and refresh search by meaning" onClick={() => void act('reindex', f.name)}>
                      <I.Refresh size={14} /> Re-index
                    </button>
                    <button type="button" className="lib-btn lib-btn-quiet lib-btn-icon" disabled={!ov.qmd} aria-label={`Remove ${f.name}`} title="Remove from Notes Search" onClick={() => setConfirm(f.name)}>
                      <I.Trash size={14} />
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </section>
      )}

      {failures.length > 0 && (
        <section aria-label="Recent problems">
          {failures.map((j) => (
            <div key={j.id} className="lib-alert lib-alert-error" role="alert">
              <I.Alert size={16} />
              <span>
                <b>{j.kind === 'add' ? 'Adding' : j.kind === 'remove' ? 'Removing' : 'Re-indexing'} “{j.collection}” failed</b>
                {j.step ? ` while ${j.step.toLowerCase()}` : ''}: {j.message || 'qmd exited with an error'}
                {j.finished_at ? ` · ${relTime(j.finished_at)}` : ''}
              </span>
            </div>
          ))}
        </section>
      )}

      <div className="lib-meta-sm lib-folders-foot">
        QMD doesn’t watch for changes. Re-index after editing notes, or schedule <code>qmd update && qmd embed</code> to run on its own. Index: <code>{ov.index}</code>
      </div>
    </div>
  )
}

function JobLine({ job }: { job: FolderJob }) {
  return (
    <div className="lib-folder-job" role="status">
      <I.Loader size={13} className="lib-spin" />
      <span>
        {job.state === 'queued' ? 'Waiting…' : `${job.step}…`}
        {job.kind === 'add' && job.step.startsWith('Building') ? ' Keyword search already works. The first run downloads models and can take a few minutes.' : ''}
      </span>
      {job.message && <span className="lib-ell lib-meta-sm">{job.message}</span>}
    </div>
  )
}
