---
name: notes-search-setup
description: Install QMD and point the Notes Search app at folders of notes - add an Obsidian vault, Reflect graph or markdown folder, re-index, check index health, and fix a Notes Search page that shows no results. Use when the user asks to set up Notes Search, add or remove a notes folder, re-index, or when qmd is missing or broken.
---

# Notes Search setup: QMD index and folders

Notes Search reads QMD's index (`~/.cache/qmd/index.sqlite`) read-only and runs
the `qmd` CLI for meaning-based search. Every folder Notes Search shows is a QMD
**collection**. The Folders screen in Notes Search does the same steps below through
buttons. Use the CLI when the user asks you to, or when the page cannot.

These commands change local state. Run them when the user asked for setup or
maintenance, and say what each one will do first. Embedding a large folder
downloads models on first run and can take several minutes.

## 1. Check what exists

```bash
qmd --version
qmd status
qmd collection list
```

`qmd status` shows each collection, its document count and how many documents
still need embeddings. If `qmd` is missing, install it (Node 22 or newer):

```bash
npm install -g @tobilu/qmd
```

## 2. Add a folder

Pick a short, lowercase collection name. It appears in `qmd://name/...` paths
and in the folder filter in Notes Search.

```bash
qmd collection add ~/Documents/MyVault --name myvault
qmd embed -c myvault
```

`collection add` indexes the folder's `**/*.md` files right away, so keyword
search works at once. `embed` adds meaning-based search. To index other files,
pass a glob with `--mask`, for example `--mask '**/*.{md,markdown}'`.

**Obsidian vaults:** add the vault root, the folder that contains `.obsidian/`,
so Notes Search detects the vault and resolves links and attachments the way
Obsidian does. QMD skips dot-folders, so `.obsidian/` and Obsidian's `.trash/`
stay out of the index.

**Reflect graphs:** add the graph folder, the one that contains `.reflect/`.

## 3. Keep it current

QMD does not watch files. After notes change:

```bash
qmd update
qmd embed
```

`update` re-reads every collection and `embed` only processes changed documents.
Suggest a scheduled job (cron, launchd, or a Crew schedule) running both every
15 to 60 minutes if the user wants Notes Search to stay fresh by itself.

## 4. Remove or rename a folder

```bash
qmd collection remove myvault
qmd collection rename myvault notes
```

Removing a collection drops it from the index only. The files on disk stay.

## Troubleshooting

| Symptom | Fix |
|---|---|
| Notes Search says the index is missing | Run step 2 at least once; the index file is created by the first `collection add`. |
| Keyword results but "search by meaning" is empty | Run `qmd embed`; check `qmd status` for pending embeddings. |
| `NODE_MODULE_VERSION` mismatch | QMD's SQLite module was built for another Node. Reinstall QMD under the Node you run it with (`npm install -g @tobilu/qmd`), or wrap `qmd` in a script that pins that Node. |
| `qmd query` fails on models or GPU | Run `qmd doctor`. `QMD_FORCE_CPU=1` avoids GPU problems. Keyword search keeps working either way. |
| New notes do not appear | Run `qmd update`. A note edited since indexing shows "edited since indexed" in the reader. |
| Notes Search cannot find `qmd` | It looks in `~/.local/bin`, `~/.bun/bin` and `PATH`. Set `QMD_BIN` to the full path in the gateway's environment. |
| Notes Search should read a different index | Set `QMD_INDEX` to the `.sqlite` file in the gateway's environment. |

After changing `QMD_BIN` or `QMD_INDEX`, restart the gateway, or disable and
re-enable the app (`kirocrew app disable notes-search`, then
`kirocrew app enable notes-search`).
