"""Obsidian vault behaviour: filename titles, file-first links, aliases, attachments.

Run: python3 -m unittest discover -s tests
"""

from __future__ import annotations

import os
import sqlite3
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from backend import library  # noqa: E402

# Real filenames on disk -> body. QMD stores a cleaned-up path, see STORED.
FILES = {
    "Projects/Launch Plan.md": "---\naliases:\n  - GA plan\n  - Launch\ntags: [launch, q4]\n---\n# Overview\n\nSee [[Meeting Notes#^abc]] and ![[diagram.png]].",
    "Meeting Notes.md": "# Overview\n\nWe agreed on the [[Launch Plan|plan]]. ^abc",
    "Archive/Meeting Notes.md": "# Old\n\nAn older note with the same filename, deeper in the tree.",
}
STORED = {
    "Projects/Launch Plan.md": "Projects/Launch-Plan.md",
    "Meeting Notes.md": "Meeting-Notes.md",
    "Archive/Meeting Notes.md": "Archive/Meeting-Notes.md",
}


def build_vault(root: Path) -> Path:
    vault = root / "My Vault"
    (vault / ".obsidian").mkdir(parents=True)
    for rel, text in FILES.items():
        p = vault / rel
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(text, encoding="utf-8")
    (vault / "attachments").mkdir()
    (vault / "attachments" / "diagram.png").write_bytes(b"\x89PNG\r\n\x1a\nfake")
    db = root / "index.sqlite"
    c = sqlite3.connect(db)
    c.executescript(
        """
        CREATE TABLE content (hash TEXT PRIMARY KEY, doc TEXT NOT NULL, created_at TEXT NOT NULL);
        CREATE TABLE documents (id INTEGER PRIMARY KEY AUTOINCREMENT, collection TEXT, path TEXT, title TEXT,
            hash TEXT, created_at TEXT, modified_at TEXT, active INTEGER DEFAULT 1);
        CREATE TABLE store_collections (name TEXT PRIMARY KEY, path TEXT NOT NULL);
        CREATE VIRTUAL TABLE documents_fts USING fts5(filepath, title, body, tokenize='porter unicode61');
        """
    )
    c.execute("INSERT INTO store_collections VALUES ('ov', ?)", (str(vault),))
    for i, (rel, text) in enumerate(FILES.items(), start=1):
        # QMD titles by first heading, which in Obsidian is usually NOT the name.
        title = text.split("# ", 1)[-1].split("\n", 1)[0]
        c.execute("INSERT INTO content VALUES (?,?,?)", (f"o{i}", text, "2026-10-01"))
        c.execute(
            "INSERT INTO documents (id, collection, path, title, hash, created_at, modified_at) VALUES (?,?,?,?,?,?,?)",
            (i, "ov", STORED[rel], title, f"o{i}", "2026-10-01", f"2026-10-0{i}T00:00:00Z"),
        )
        c.execute("INSERT INTO documents_fts (rowid, filepath, title, body) VALUES (?,?,?,?)", (i, f"ov/{STORED[rel]}", title, text))
    c.commit()
    c.close()
    return db


class ObsidianTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tmp = tempfile.TemporaryDirectory()
        cls.root = Path(cls.tmp.name)
        os.environ["QMD_INDEX"] = str(build_vault(cls.root))

    @classmethod
    def tearDownClass(cls):
        os.environ.pop("QMD_INDEX", None)
        cls.tmp.cleanup()

    def test_vault_is_detected(self):
        [col] = library.collections()
        self.assertTrue(col["obsidian"])

    def test_reflect_graph_with_leftover_obsidian_folder_stays_title_first(self):
        graph = self.root / "graph"
        (graph / ".obsidian").mkdir(parents=True)
        (graph / ".reflect").mkdir()
        self.assertFalse(library._is_vault_root(graph))

    def test_title_is_the_real_filename(self):
        doc = library.document("ov", "Projects/Launch-Plan.md")
        self.assertEqual(doc["title"], "Launch Plan")

    def test_link_names_the_file_not_the_heading(self):
        hit = library.resolve_link("Launch Plan", "ov")
        self.assertEqual(hit["path"], "Projects/Launch-Plan.md")

    def test_duplicate_filename_prefers_the_shallowest(self):
        hit = library.resolve_link("Meeting Notes#^abc", "ov")
        self.assertEqual(hit["path"], "Meeting-Notes.md")

    def test_alias_resolves(self):
        hit = library.resolve_link("GA plan", "ov")
        self.assertEqual(hit["path"], "Projects/Launch-Plan.md")

    def test_list_frontmatter(self):
        props, _ = library.frontmatter(FILES["Projects/Launch Plan.md"])
        self.assertEqual(props["aliases"], "GA plan, Launch")
        self.assertEqual(props["tags"], "launch, q4")

    def test_attachment_found_by_name(self):
        data, ctype = library.asset("ov", "Projects/Launch-Plan.md", "diagram.png")
        self.assertEqual(ctype, "image/png")
        self.assertTrue(data.startswith(b"\x89PNG"))

    def test_open_in_obsidian_link(self):
        doc = library.document("ov", "Projects/Launch-Plan.md")
        self.assertEqual(doc["obsidian"], {"vault": "My Vault", "file": "Projects/Launch Plan"})


if __name__ == "__main__":
    unittest.main()
