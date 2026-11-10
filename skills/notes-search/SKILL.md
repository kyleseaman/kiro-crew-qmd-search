---
name: notes-search
description: Search, read and answer from the user's markdown notes indexed by QMD (a Reflect graph, an Obsidian vault, or any folder of .md files), including chats started from Notes Search page. Use when the user asks to find a note, answer from their notes, compare documents, follow [[wikilinks]] or backlinks, or when a message names notes from Notes Search. Never reads notes marked private.
---

# Notes Search: answer from the user's notes with QMD

The Notes Search app indexes the user's markdown with [QMD](https://github.com/tobi/qmd)
and lets them read notes and start chats about them. This skill covers what the
app adds on top of QMD: privacy, the note dialects, and how Notes Search chats arrive.

## QMD syntax: load it from QMD itself

QMD ships version-matched agent instructions. Before your first search in a
session, read them rather than guessing flags:

```bash
qmd skills get qmd --full
```

Follow its workflow: search for candidates, retrieve the full document with
`qmd get` / `qmd multi-get`, then answer from the retrieved text. Snippets are
leads, not evidence. Prefer `qmd search` for exact titles and names, and a
structured `qmd query` (`intent:`, `lex:`, `vec:`, `hyde:`) for ideas.

If `qmd` is not on PATH, or fails with a Node module version error, see the
`notes-search-setup` skill.

## Privacy: never read a private note

A note whose YAML frontmatter has `private: true` (also `yes` or `1`) is off
limits. Notes Search never sends one to a chat, and you must hold the same line:

- Do not open, quote, summarise or paraphrase it, even if a search returns it.
- If a search hit turns out to be private once retrieved, drop it and say only
  that a private note matched.
- Never edit the frontmatter to make a note readable.

## Chats started from Notes Search

A Notes Search chat opens with a message that names one or more notes by title and
absolute path, followed by the user's question. Read every named file in full
before answering, answer from those notes first, and name the section you drew
on. Say plainly when the answer is not in them. Search the rest of the index
only for related context, and label it as coming from another note.

"Also read **Title** · `path`" later in the chat adds one more note to the
conversation. Read it the same way.

## Note dialects

Check which app owns the folder before following or writing links, because they
resolve `[[links]]` differently:

| Folder contains | App | `[[Target]]` names |
|---|---|---|
| `.reflect/` | Reflect | the note's H1 title, then the filename |
| `.obsidian/` (and no `.reflect/`) | Obsidian | the filename, then the H1, then `aliases:` in frontmatter |
| neither | plain markdown | the H1 title, then the filename |

Obsidian syntax you may meet: `![[Note]]` embeds a whole note, `![[Note#Heading]]`
a section and `![[Note#^id]]` the block ending in ` ^id`. `> [!note] Title` is a
callout (`-` or `+` after `]` makes it foldable). `==text==` is a highlight and
`%%text%%` is a comment the author hid from readers, so do not surface it as
content. When two Obsidian notes share a filename, the link resolves to the one
closest to the vault root.

To find what links to a note, search for its title and its filename as phrases
(`qmd search '"Note Title"'`), then read each hit and keep the ones that contain
`[[Note Title` or `[[filename`. Keyword search ignores the brackets, so the
match alone does not prove a link.

## Writing to notes

Only edit or create notes when the user asks. When you do:

- Edit the file on disk directly. QMD is a read index and picks the change up on
  its next `qmd update`.
- Keep the existing frontmatter intact, including any `id:` an app wrote.
- Link with the folder's dialect: titles in Reflect, filenames in Obsidian.
- A new Reflect or plain note starts with a `# Title` line, since that is its name.
- Never write into `.obsidian/`, `.reflect/` or `.git/`.

## Citing

Cite each claim with the note title and its `qmd://collection/path` (or the
docid QMD printed), so the user can open it in Notes Search.
