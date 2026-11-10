"""Backend tests against a tiny fixture QMD index built in a temp dir.

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

from backend import library, sessions  # noqa: E402


DOCS = {
    "notes/garden.md": "# Garden Plan\n\nWe planned the spring garden and #garden beds.\n\nSee [[Roadmap]].",
    "notes/roadmap.md": "# Roadmap\n\nThe roadmap links to [[Garden Plan]] and ships in Q4.",
    "notes/secret.md": "---\nprivate: true\n---\n# Secret\n\nDo not share.",
    "daily/2026-10-02.md": "# Meetings\n\nTalked about the roadmap.",
}


def build_fixture(root: Path) -> Path:
    vault = root / "vault"
    for rel, text in DOCS.items():
        p = vault / rel
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(text, encoding="utf-8")
    (root / "outside.md").write_text("outside", encoding="utf-8")
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
    c.execute("INSERT INTO store_collections VALUES ('vault', ?)", (str(vault),))
    for i, (rel, text) in enumerate(DOCS.items(), start=1):
        title = text.split("\n# ", 1)[-1].split("\n", 1)[0].lstrip("# ")
        c.execute("INSERT INTO content VALUES (?,?,?)", (f"h{i}", text, "2026-10-01"))
        c.execute(
            "INSERT INTO documents (id, collection, path, title, hash, created_at, modified_at) VALUES (?,?,?,?,?,?,?)",
            (i, "vault", rel, title, f"h{i}", "2026-10-01", f"2026-10-0{i}T00:00:00Z"),
        )
        c.execute("INSERT INTO documents_fts (rowid, filepath, title, body) VALUES (?,?,?,?)", (i, f"vault/{rel}", title, text))
    c.commit()
    c.close()
    return db


class LibraryTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tmp = tempfile.TemporaryDirectory()
        cls.root = Path(cls.tmp.name)
        os.environ["QMD_INDEX"] = str(build_fixture(cls.root))

    @classmethod
    def tearDownClass(cls):
        os.environ.pop("QMD_INDEX", None)
        cls.tmp.cleanup()

    def test_free_form_text_never_raises(self):
        for q in ['notes AND (', 'NEAR(', '"unclosed', 'a:b*', '-', '***', '()', 'title:x', '"']:
            res = library.suggest(q)
            self.assertIsInstance(res["results"], list, q)

    def test_prefix_while_typing_survives_stemming(self):
        titles = [r["title"] for r in library.suggest("garden pla")["results"]]
        self.assertIn("Garden Plan", titles)

    def test_exclusion(self):
        titles = [r["title"] for r in library.suggest("roadmap -q4 ")["results"]]
        self.assertNotIn("Roadmap", titles)
        self.assertIn("Garden Plan", titles)

    def test_sort_recent_orders_by_modified(self):
        res = library.suggest("roadmap ", sort="recent")
        dates = [r["modified_at"] for r in res["results"]]
        self.assertGreater(len(dates), 1)
        self.assertEqual(dates, sorted(dates, reverse=True))

    def test_daily_note_titled_by_date(self):
        titles = [r["title"] for r in library.suggest("talked")["results"]]
        self.assertEqual(titles, ["2026-10-02"])

    def test_snippet_parts_mark_hits(self):
        hit = library.suggest("garden ")["results"][0]
        self.assertTrue(any(p["hit"] for p in hit["snippet"]))

    def test_path_traversal_refused(self):
        with self.assertRaises(library.LibraryError) as ctx:
            library.document("vault", "../outside.md")
        self.assertEqual(ctx.exception.status, 403)
        with self.assertRaises(library.LibraryError):
            library.document("vault", "/etc/passwd")

    def test_handelize_matches_qmd(self):
        self.assertEqual(library.handelize("drafts/Weekly Garden Update.md"), "drafts/Weekly-Garden-Update.md")
        self.assertEqual(library.handelize("a/2026-07-21 Hello World Notes.md"), "a/2026-07-21-Hello-World-Notes.md")
        self.assertEqual(library.handelize("Q&A (v2).md"), "Q-A-v2.md")
        self.assertEqual(library.handelize("x/🚀 Launch.md"), "x/1f680-Launch.md")

    def test_slugified_index_path_reads_the_real_file(self):
        real = self.root / "vault" / "notes" / "Big Plan (draft).md"
        real.write_text("# Big Plan\n\nhello", encoding="utf-8")
        library._disk_maps.clear()
        doc = library.document("vault", "notes/Big-Plan-draft.md")
        self.assertEqual(doc["source"], "disk")
        self.assertEqual(doc["abs_path"], str(real.resolve()))

    def test_document_and_private_flag(self):
        doc = library.document("vault", "notes/secret.md")
        self.assertTrue(doc["private"])
        self.assertEqual(library.document("vault", "notes/garden.md")["title"], "Garden Plan")

    def test_resolve_and_backlinks(self):
        self.assertEqual(library.resolve_link("garden plan")["path"], "notes/garden.md")
        self.assertEqual(library.resolve_link("2026-10-02")["path"], "daily/2026-10-02.md")
        self.assertIsNone(library.resolve_link("Nope"))
        back = [b["path"] for b in library.backlinks("vault", "notes/garden.md")]
        self.assertEqual(back, ["notes/roadmap.md"])

    def test_seed_refuses_private_note(self):
        with self.assertRaises(library.LibraryError) as ctx:
            sessions.seed({"docs": [{"collection": "vault", "path": "notes/secret.md"}]})
        self.assertEqual(ctx.exception.code, "private_note")

    def test_seed_names_files_and_question(self):
        out = sessions.seed(
            {"docs": [{"collection": "vault", "path": "notes/garden.md"}, {"collection": "vault", "path": "notes/roadmap.md"}], "question": "What changed?"}
        )
        self.assertIn(str(self.root / "vault" / "notes/garden.md"), out["message"])
        self.assertTrue(out["message"].endswith("What changed?"))
        self.assertEqual(out["title"], "Garden Plan + 1 more")

    def test_session_record_and_forget(self):
        with tempfile.TemporaryDirectory() as d:
            sessions.record(d, {"slot_key": "s1", "title": "t", "docs": [{"collection": "vault", "path": "a.md"}]})
            sessions.record(d, {"slot_key": "s1", "title": "t2", "docs": []})
            self.assertEqual([s["title"] for s in sessions.load(d)], ["t2"])
            self.assertTrue(sessions.forget(d, "s1"))
            self.assertEqual(sessions.load(d), [])


if __name__ == "__main__":
    unittest.main()
