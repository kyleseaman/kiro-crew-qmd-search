/**
 * Markdown -> sanitised HTML, plus the outline, for one note.
 *
 * marked does the parsing; extensions teach it the vault's dialect, covering
 * both Reflect-style graphs and Obsidian vaults:
 *
 *   [[Target]] / [[Target|Alias]] / [[Target#Heading]] / [[Target#^block]]
 *                                   -> a wikilink the page resolves on click
 *   ![[image.png]] / ![[image.png|300]] / ![alt|300x200](img.png)
 *                                   -> an embedded, optionally sized image
 *   ![[Note]] / ![[Note#Heading]] / ![[Note#^block]]
 *                                   -> a placeholder the reader fills with that note
 *   > [!note] Title / > [!tip]- Folded
 *                                   -> a callout, foldable with + or -
 *   ==text==                        -> a highlight
 *   %%comment%%                     -> hidden
 *   text ^block-id                  -> hidden marker the reader can scroll to
 *   #tag                            -> a tag pill that searches for the tag
 *
 * Everything then goes through DOMPurify. The vault holds clipped web pages
 * with raw HTML in them, and this page runs inside the dashboard with the
 * user's credentials, so an unsanitised `<img onerror>` would be script in the
 * dashboard's origin.
 */
import { Marked, type Tokens, type TokenizerExtension, type RendererExtension } from 'marked'
import DOMPurify from 'dompurify'

export interface OutlineItem {
  id: string
  text: string
  depth: number
}

export interface Rendered {
  html: string
  outline: OutlineItem[]
}

const IMAGE_EXT = /\.(png|jpe?g|gif|webp|svg|avif|bmp)$/i
/** Attachments Obsidian can embed that this reader shows as a name, not inline. */
const ATTACHMENT_EXT = /\.(pdf|mp4|webm|mov|mkv|mp3|wav|m4a|ogg|flac|canvas|excalidraw|base)$/i
const SIZE = /^(\d{1,4})(?:x(\d{1,4}))?$/

/** Callout kinds Obsidian recognises, folded into the three tones the theme draws. */
const CALLOUT_ALIASES: Record<string, string> = {
  summary: 'abstract', tldr: 'abstract', hint: 'tip', important: 'tip', check: 'success', done: 'success',
  help: 'question', faq: 'question', caution: 'warning', attention: 'warning', fail: 'failure',
  missing: 'failure', error: 'danger', cite: 'quote',
}
const CALLOUT_TONE: Record<string, string> = {
  tip: 'sage', success: 'sage', warning: 'danger', failure: 'danger', danger: 'danger', bug: 'danger',
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function escRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/<[^>]+>/g, '')
      .replace(/&[a-z]+;/g, '')
      .replace(/[^\p{L}\p{N}\s-]/gu, '')
      .trim()
      .replace(/\s+/g, '-')
      .slice(0, 80) || 'section'
  )
}

/** Strip YAML frontmatter; the reader shows its properties separately. */
export function stripFrontmatter(md: string): string {
  return md.replace(/^---\s*\n[\s\S]*?\n---\s*(\n|$)/, '')
}

const FENCE = /^ {0,3}(`{3,}|~{3,})[^\n]*\n[\s\S]*?^ {0,3}\1[ \t]*$/gm

/** Apply `fn` to every stretch of the note that is not inside a fenced code block. */
function outsideCode(md: string, fn: (prose: string) => string): string {
  let out = ''
  let last = 0
  for (const m of md.matchAll(FENCE)) {
    out += fn(md.slice(last, m.index)) + m[0]
    last = m.index! + m[0].length
  }
  return out + fn(md.slice(last))
}

/**
 * Obsidian syntax that is easiest handled before parsing: `%%comments%%` are
 * removed (they can span lines), and a trailing ` ^block-id` becomes an empty
 * marker element so `[[Note#^block-id]]` has somewhere to scroll to.
 */
export function preprocess(md: string): string {
  return outsideCode(md, (prose) =>
    prose
      .replace(/%%[\s\S]*?%%/g, '')
      .replace(/(^|[ \t])\^([A-Za-z0-9-]+)[ \t]*$/gm, (_m, lead: string, id: string) => `${lead}<span class="lib-block" data-block="${id}"></span>`),
  )
}

/**
 * The part of a note that `![[Note#Heading]]` or `![[Note#^block]]` names, or
 * the whole body when `ref` is empty. Null when the heading or block is gone.
 */
export function extractSection(md: string, ref: string): string | null {
  const body = stripFrontmatter(md)
  if (!ref) return body
  const lines = body.split('\n')
  if (ref.startsWith('^')) {
    const marker = new RegExp(`(^|\\s)\\^${escRe(ref.slice(1))}\\s*$`)
    const at = lines.findIndex((l) => marker.test(l))
    if (at < 0) return null
    // A marker on its own line names the block above it (a list, a table).
    const alone = lines[at].trim().startsWith('^')
    let end = alone ? at - 1 : at
    while (alone && end >= 0 && !lines[end].trim()) end--
    let start = end
    while (start > 0 && lines[start - 1].trim()) start--
    if (end < 0) return null
    return lines.slice(start, end + 1).join('\n')
  }
  const want = slugify(ref)
  let inFence = false
  let start = -1
  let level = 0
  for (let i = 0; i < lines.length; i++) {
    if (/^ {0,3}(`{3,}|~{3,})/.test(lines[i])) inFence = !inFence
    if (inFence) continue
    const h = /^(#{1,6})\s+(.*?)\s*#*\s*$/.exec(lines[i])
    if (!h) continue
    if (start >= 0 && h[1].length <= level) return lines.slice(start, i).join('\n').trimEnd()
    if (start < 0 && slugify(h[2].replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_m, a, b) => b || a)) === want) {
      start = i
      level = h[1].length
    }
  }
  return start >= 0 ? lines.slice(start).join('\n').trimEnd() : null
}

export function assetUrl(collection: string, docPath: string, src: string): string {
  const q = new URLSearchParams({ c: collection, p: docPath, src })
  return `/api/apps/notes-search/asset?${q.toString()}`
}

function sizeAttrs(spec: string): string {
  const m = SIZE.exec(spec.trim())
  if (!m) return ''
  return ` width="${m[1]}"${m[2] ? ` height="${m[2]}"` : ''}`
}

interface RenderOpts {
  collection: string
  path: string
  /** Hide a leading H1 equal to this, since the page header already shows it. */
  title?: string
  /**
   * Rendering a note embedded in another. Note embeds inside it become plain
   * links, which caps embedding at one level and stops a note embedding itself
   * from recursing.
   */
  embedded?: boolean
  /** Prefix for heading ids, so an embed's headings never collide with the host note's. */
  idPrefix?: string
}

type Lexer = { blockTokens: (src: string, tokens: Tokens.Generic[]) => unknown; inline: (src: string, tokens: Tokens.Generic[]) => unknown; inlineTokens: (src: string, tokens: Tokens.Generic[]) => unknown }
type Parser = { parse: (t: Tokens.Generic[]) => string; parseInline: (t: Tokens.Generic[]) => string }

export function renderMarkdown(source: string, opts: RenderOpts): Rendered {
  const outline: OutlineItem[] = []
  const used = new Map<string, number>()
  const prefix = opts.idPrefix ?? ''
  let firstHeadingSeen = false

  const wikilink: TokenizerExtension & RendererExtension = {
    name: 'wikilink',
    level: 'inline',
    start(src: string) {
      const i = src.indexOf('[[')
      if (i < 0) return undefined
      return i > 0 && src[i - 1] === '!' ? i - 1 : i
    },
    tokenizer(src: string) {
      const m = /^(!?)\[\[([^\]\n|#]+)(#[^\]\n|]*)?(?:\|([^\]\n]+))?\]\]/.exec(src)
      if (!m) return undefined
      return {
        type: 'wikilink',
        raw: m[0],
        embed: m[1] === '!',
        target: m[2].trim(),
        heading: (m[3] || '').slice(1),
        alias: (m[4] || '').trim(),
      }
    },
    renderer(token: Tokens.Generic) {
      const target = String(token.target)
      const heading = String(token.heading || '')
      const alias = String(token.alias || '')
      if (token.embed && IMAGE_EXT.test(target)) {
        const sized = sizeAttrs(alias)
        const alt = alias && !sized ? alias : target
        return `<img src="${esc(assetUrl(opts.collection, opts.path, target))}" alt="${esc(alt)}"${sized} loading="lazy">`
      }
      if (token.embed && ATTACHMENT_EXT.test(target)) {
        return `<span class="lib-embed-missing">Attachment: ${esc(target)}</span>`
      }
      const link = (label: string) =>
        `<a class="lib-wikilink" href="#" data-wikilink="${esc(target)}" data-heading="${esc(heading)}">${esc(label)}</a>`
      if (token.embed && opts.embedded) {
        return `<span class="lib-embed-missing">Embedded note: ${link(target)}</span>`
      }
      if (token.embed) {
        return `<span class="lib-embed" data-embed="${esc(target)}" data-heading="${esc(heading)}"><span class="lib-embed-head">${link(alias || target + (heading && !heading.startsWith('^') ? ` › ${heading}` : ''))}</span><span class="lib-embed-body lib-embed-loading">Loading…</span></span>`
      }
      return link(alias || target + (heading && !heading.startsWith('^') ? ` › ${heading}` : ''))
    },
  }

  const highlight: TokenizerExtension & RendererExtension = {
    name: 'highlight',
    level: 'inline',
    start(src: string) {
      const i = src.indexOf('==')
      return i < 0 ? undefined : i
    },
    tokenizer(this: { lexer: Lexer }, src: string) {
      const m = /^==(?=\S)([^\n]*?\S)==(?!=)/.exec(src)
      if (!m) return undefined
      const token = { type: 'highlight', raw: m[0], tokens: [] as Tokens.Generic[] }
      this.lexer.inlineTokens(m[1], token.tokens)
      return token
    },
    renderer(this: { parser: Parser }, token: Tokens.Generic) {
      return `<mark class="lib-hl">${this.parser.parseInline(token.tokens as Tokens.Generic[])}</mark>`
    },
  }

  const callout: TokenizerExtension & RendererExtension = {
    name: 'callout',
    level: 'block',
    start(src: string) {
      const m = /^ {0,3}>[ \t]*\[!/m.exec(src)
      return m ? m.index : undefined
    },
    tokenizer(this: { lexer: Lexer }, src: string) {
      const m = /^ {0,3}>[ \t]*\[!([\w-]+)\]([+-]?)[ \t]*([^\n]*)(?:\n|$)((?: {0,3}>[^\n]*(?:\n|$))*)/.exec(src)
      if (!m) return undefined
      const raw = m[1].toLowerCase()
      const kind = CALLOUT_ALIASES[raw] ?? raw
      const title = m[3].trim()
      const token = {
        type: 'callout',
        raw: m[0],
        kind,
        fold: m[2],
        hasTitle: Boolean(title),
        label: raw.charAt(0).toUpperCase() + raw.slice(1),
        titleTokens: [] as Tokens.Generic[],
        tokens: [] as Tokens.Generic[],
      }
      if (title) this.lexer.inline(title, token.titleTokens)
      this.lexer.blockTokens(m[4].replace(/^ {0,3}> ?/gm, ''), token.tokens)
      return token
    },
    childTokens: ['titleTokens', 'tokens'],
    renderer(this: { parser: Parser }, token: Tokens.Generic) {
      const title = token.hasTitle ? this.parser.parseInline(token.titleTokens as Tokens.Generic[]) : esc(String(token.label))
      const body = this.parser.parse(token.tokens as Tokens.Generic[])
      const kind = esc(String(token.kind))
      const tone = CALLOUT_TONE[String(token.kind)] ?? 'accent'
      const attrs = `class="lib-callout" data-callout="${kind}" data-tone="${tone}"`
      if (token.fold) {
        return `<details ${attrs}${token.fold === '+' ? ' open' : ''}><summary class="lib-callout-title"><span>${title}</span></summary>${body ? `<div class="lib-callout-body">${body}</div>` : ''}</details>\n`
      }
      return `<div ${attrs}><div class="lib-callout-title"><span>${title}</span></div>${body ? `<div class="lib-callout-body">${body}</div>` : ''}</div>\n`
    },
  }

  const tag: TokenizerExtension & RendererExtension = {
    name: 'hashtag',
    level: 'inline',
    start(src: string) {
      const m = /(^|[\s(])#[A-Za-z][\w\-/]*/.exec(src)
      return m ? m.index + m[1].length : undefined
    },
    tokenizer(src: string) {
      const m = /^#([A-Za-z][\w\-/]*)/.exec(src)
      if (!m) return undefined
      return { type: 'hashtag', raw: m[0], tag: m[1] }
    },
    renderer(token: Tokens.Generic) {
      const t = String(token.tag)
      return `<span class="lib-ptag" role="button" tabindex="0" data-tag="${esc(t)}">#${esc(t)}</span>`
    },
  }

  const md = new Marked({ gfm: true, breaks: false })
  md.use({
    extensions: [callout, wikilink, highlight, tag],
    renderer: {
      heading(this: { parser: Parser }, { tokens, depth, text }: Tokens.Heading) {
        const inner = this.parser.parseInline(tokens as Tokens.Generic[])
        const plain = text.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_m, a, b) => b || a).replace(/<[^>]+>/g, '').trim()
        if (!firstHeadingSeen) {
          firstHeadingSeen = true
          if (depth === 1 && opts.title && plain.toLowerCase() === opts.title.trim().toLowerCase()) {
            return ''
          }
        }
        const base = prefix + slugify(plain)
        const n = used.get(base) ?? 0
        used.set(base, n + 1)
        const id = n ? `${base}-${n}` : base
        if (depth <= 4) outline.push({ id, text: plain.replace(/[*_`=]/g, ''), depth })
        return `<h${depth} id="${esc(id)}"><a class="lib-anchor" href="#${esc(id)}" aria-hidden="true" tabindex="-1">#</a>${inner}</h${depth}>\n`
      },
      image({ href, title, text }: Tokens.Image) {
        const local = href && !/^[a-z][a-z0-9+.-]*:/i.test(href) && !href.startsWith('//')
        const src = local ? assetUrl(opts.collection, opts.path, href) : href
        // Obsidian sizes a markdown image through its alt text: ![alt|300](img.png).
        const sized = /^(.*?)\|([^|]+)$/.exec(text || '')
        const size = sized ? sizeAttrs(sized[2]) : ''
        const alt = size && sized ? sized[1] : text || ''
        return `<img src="${esc(src || '')}" alt="${esc(alt)}"${size}${title ? ` title="${esc(title)}"` : ''} loading="lazy">`
      },
    },
  })

  const body = preprocess(stripFrontmatter(source))
  const raw = md.parse(body, { async: false }) as string
  const html = DOMPurify.sanitize(raw, {
    ADD_ATTR: ['data-wikilink', 'data-heading', 'data-tag', 'data-embed', 'data-block', 'data-callout', 'data-tone', 'target', 'loading', 'tabindex', 'role', 'open'],
    FORBID_TAGS: ['style', 'form', 'button', 'textarea', 'select', 'iframe', 'object', 'embed'],
    FORBID_ATTR: ['style'],
  })
  return { html, outline }
}

// Every external link opens outside the dashboard, and never with an opener.
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A') {
    const href = node.getAttribute('href') || ''
    if (/^https?:/i.test(href)) {
      node.setAttribute('target', '_blank')
      node.setAttribute('rel', 'noopener noreferrer')
    }
  }
  if (node.tagName === 'INPUT') {
    node.setAttribute('disabled', '')
  }
})
