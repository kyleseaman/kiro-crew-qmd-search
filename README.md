# Notes Search for Kiro Crew

Notes Search is an app for [Kiro Crew](https://kiro.dev). It adds a page to the Crew dashboard where you can search, read and chat about your markdown notes. It works with Obsidian vaults, Reflect graphs and any folder of `.md` files.

Search runs on your computer through [QMD](https://github.com/tobi/qmd), an open-source search engine for markdown. QMD keeps a SQLite index of your folders. It offers keyword search, plus search by meaning using small models it downloads and runs locally. Notes Search reads that index, shows your notes, and passes the ones you pick to your Crew agent when you want to talk about them.

## What it does

- **Search as you type.** Matching passages appear as you type, straight from QMD's keyword index. Press `⌘↵` (`Ctrl+↵`) to search by meaning with QMD's hybrid query, which shows in its own section so it never reorders what you're reading.
- **Read notes.** `[[wikilinks]]`, backlinks, an outline, embedded images and match highlighting in the note.
- **Obsidian support.** Notes Search detects a vault from its `.obsidian/` folder. It then resolves links by filename and `aliases`, renders callouts, `==highlights==`, `%%comments%%`, `![[embeds]]` (whole notes, headings and `^blocks`) and sized images, and offers an **Open in Obsidian** button.
- **Chat about your notes.** Start a chat about one note, add more notes to a running chat, or select several results and talk about them together. Each chat is a regular Crew session in your sidebar.
- **Manage folders in the app.** Add, re-index or remove folders from the **Folders** screen. Notes Search also suggests Obsidian vaults it finds on your computer.
- **Private notes are kept out of chats.** Notes Search won't start a chat about a note with `private: true` in its frontmatter. The bundled skill also tells the agent not to read, quote or summarise one it finds by searching.
- **Two agent skills.** `notes-search` teaches the agent to answer from your notes with QMD and to respect private notes and each app's link rules. `notes-search-setup` covers installing QMD, adding folders and fixing a broken index.

Notes Search uses your Crew theme and follows your light or dark mode.

## Requirements

- Kiro Crew on macOS or Linux
- Python 3 (the gateway already ships it)
- [QMD](https://github.com/tobi/qmd) 2.x on Node 22 or newer:

  ```sh
  npm install -g @tobilu/qmd
  ```

## Install

```sh
git clone https://github.com/kyleseaman/kiro-crew-qmd-search.git
kirocrew app install ./kiro-crew-qmd-search
kirocrew app enable notes-search
```

Open **Notes Search** in the Crew sidebar. If you have no QMD index yet, the first screen asks for a folder. You can also use the command line:

```sh
qmd collection add ~/Documents/MyVault --name myvault
qmd embed -c myvault
```

For an Obsidian vault, add the folder that contains `.obsidian/`.

## Keeping the index fresh

QMD doesn't watch your files. Click **Re-index** on the Folders screen after big changes, or schedule both commands to run every 15 to 60 minutes (with cron, launchd or a Crew schedule):

```sh
qmd update && qmd embed
```

## Configuration

Set these in the gateway's environment, then restart the gateway:

| Variable | Default | Purpose |
|---|---|---|
| `QMD_INDEX` | `~/.cache/qmd/index.sqlite` | The QMD index Notes Search reads. Notes Search passes the same file to the `qmd` CLI, so searches and folder changes use it too. |
| `QMD_BIN` | `~/.local/bin/qmd`, `~/.bun/bin/qmd`, then `PATH` | The `qmd` launcher. |

## How it works

```
your folders ──qmd──▶ QMD index (SQLite, on disk)
                           │ read-only
                           ▼
            Notes Search page + backend ──▶ Crew chat ──▶ your agent
            (in the Crew dashboard)         (note titles   (reads the files
                                             and paths)     it was given)
```

The backend runs inside the Kiro Crew gateway, behind the dashboard's sign-in. It opens QMD's index **read-only** for instant keyword search and reading. It runs the `qmd` CLI for search by meaning and for the folder changes you make on the Folders screen. Folder jobs run one at a time, because they all write the same index. The reader loads notes straight from disk, so it shows your latest edits before QMD re-indexes.

Searching and reading stay on your computer. Chatting works differently. The first message names the notes you picked by title and path, and the agent then reads those files with its own tools. From that point the notes are part of the conversation, and they go to your model provider like anything else you discuss with Crew.

## Development

```sh
cd ui && npm install && npm run build      # type-check and bundle to ui/dist
cd .. && python3 -m unittest discover -s tests
kirocrew app dev notes-search               # live reload while you work
```

`ui/dist` is committed so the app installs without a build step.

## License

[MIT](LICENSE). QMD is a separate project under its own MIT license.
