"""Folder management: validation, the exact qmd argv, job lifecycle, suggestions.

A fake ``qmd`` (QMD_BIN) records its argv and environment, so no real index is
touched. Run: python3 -m unittest discover -s tests
"""

from __future__ import annotations

import json
import os
import sqlite3
import stat
import sys
import tempfile
import time
import unittest
from pathlib import Path
from unittest import mock

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from backend import folders, library  # noqa: E402

FAKE_QMD = """#!/usr/bin/env python3
import json, os, sys
log = os.environ["FAKE_QMD_LOG"]
with open(log, "a") as f:
    f.write(json.dumps({"argv": sys.argv[1:], "index_path": os.environ.get("INDEX_PATH")}) + "\\n")
if os.environ.get("FAKE_QMD_FAIL") and sys.argv[1:2] == ["embed"]:
    print("\\x1b[31mError: model download failed\\x1b[0m", file=sys.stderr)
    sys.exit(1)
print("Indexed 3 files\\r100%")
"""


def wait_jobs(timeout: float = 10.0) -> list[dict]:
    end = time.monotonic() + timeout
    while time.monotonic() < end:
        js = folders.jobs()
        if js and all(j["state"] in ("done", "failed") for j in js):
            return js
        time.sleep(0.05)
    raise AssertionError(f"jobs did not finish: {folders.jobs()}")


class FolderTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        root = Path(self.tmp.name)
        self.root = root
        self.notes = root / "My Notes"
        self.notes.mkdir()
        self.vault = root / "Work Vault"
        (self.vault / ".obsidian").mkdir(parents=True)
        db = root / "index.sqlite"
        c = sqlite3.connect(db)
        c.executescript(
            """
            CREATE TABLE store_collections (name TEXT PRIMARY KEY, path TEXT NOT NULL);
            CREATE TABLE documents (id INTEGER PRIMARY KEY, collection TEXT, path TEXT, title TEXT,
                hash TEXT, created_at TEXT, modified_at TEXT, active INTEGER DEFAULT 1);
            """
        )
        c.execute("INSERT INTO store_collections VALUES ('existing', ?)", (str(self.vault),))
        c.commit()
        c.close()
        fake = root / "qmd"
        fake.write_text(FAKE_QMD)
        fake.chmod(fake.stat().st_mode | stat.S_IXUSR)
        self.log = root / "calls.jsonl"
        self.env = mock.patch.dict(
            os.environ, {"QMD_INDEX": str(db), "QMD_BIN": str(fake), "FAKE_QMD_LOG": str(self.log)}
        )
        self.env.start()
        folders._state.jobs.clear()
        folders._state.order.clear()

    def tearDown(self):
        wait_jobs() if folders.jobs() else None
        self.env.stop()
        self.tmp.cleanup()

    def calls(self) -> list[dict]:
        return [json.loads(line) for line in self.log.read_text().splitlines()] if self.log.exists() else []

    def test_add_runs_collection_add_then_embed(self):
        job = folders.add({"path": str(self.notes)})
        self.assertEqual(job["collection"], "my-notes")
        [done] = wait_jobs()
        self.assertEqual(done["state"], "done", done)
        argvs = [c["argv"] for c in self.calls()]
        self.assertEqual(
            argvs,
            [["collection", "add", str(self.notes.resolve()), "--name", "my-notes"], ["embed", "-c", "my-notes"]],
        )

    def test_cli_targets_the_index_the_app_reads(self):
        folders.add({"path": str(self.notes), "name": "n"})
        wait_jobs()
        self.assertTrue(all(c["index_path"] == str(library.index_path()) for c in self.calls()))

    def test_custom_mask_is_passed(self):
        folders.add({"path": str(self.notes), "name": "n", "mask": "**/*.{md,markdown}"})
        wait_jobs()
        self.assertIn("--mask", self.calls()[0]["argv"])

    def test_failure_reports_clean_last_line(self):
        with mock.patch.dict(os.environ, {"FAKE_QMD_FAIL": "1"}):
            folders.add({"path": str(self.notes), "name": "n"})
            [job] = wait_jobs()
        self.assertEqual(job["state"], "failed")
        self.assertEqual(job["message"], "Error: model download failed")

    def test_rejects_bad_input(self):
        cases = [
            ({"path": ""}, "path_required"),
            ({"path": "notes"}, "path_relative"),
            ({"path": str(self.root / "nope")}, "path_missing"),
            ({"path": "/"}, "path_too_broad"),
            ({"path": str(Path.home())}, "path_too_broad"),
            ({"path": str(self.vault)}, "path_exists"),
            ({"path": str(self.notes), "name": "Bad Name"}, "bad_name"),
            ({"path": str(self.notes), "name": "--name"}, "bad_name"),
            ({"path": str(self.notes), "name": "existing"}, "name_exists"),
            ({"path": str(self.notes), "mask": "--help"}, "bad_mask"),
            ({"path": str(self.notes), "mask": "../**/*.md"}, "bad_mask"),
            ({"path": str(self.notes), "mask": "*.md; rm -rf ~"}, "bad_mask"),
        ]
        for body, code in cases:
            with self.subTest(body=body):
                with self.assertRaises(library.LibraryError) as ctx:
                    folders.add(body)
                self.assertEqual(ctx.exception.code, code)
        self.assertEqual(self.calls(), [])

    def test_remove_and_reindex_need_a_known_folder(self):
        for fn in (folders.remove, folders.reindex):
            with self.assertRaises(library.LibraryError) as ctx:
                fn("ghost")
            self.assertEqual(ctx.exception.code, "collection_not_found")
        folders.remove("existing")
        wait_jobs()
        self.assertEqual(self.calls()[-1]["argv"], ["collection", "remove", "existing"])

    def test_reindex_updates_then_embeds_one_folder(self):
        folders.reindex("existing")
        wait_jobs()
        self.assertEqual([c["argv"] for c in self.calls()], [["update"], ["embed", "-c", "existing"]])

    def test_overview_kinds_and_obsidian_suggestions(self):
        other = self.root / "Personal"
        (other / ".obsidian").mkdir(parents=True)
        cfg = self.root / "obsidian.json"
        cfg.write_text(json.dumps({"vaults": {"a": {"path": str(self.vault)}, "b": {"path": str(other)}, "c": {"path": str(self.root / "gone")}}}))
        with mock.patch.object(folders, "_obsidian_configs", return_value=[cfg]):
            ov = folders.overview()
        self.assertEqual([(f["name"], f["kind"]) for f in ov["folders"]], [("existing", "obsidian")])
        # Already-indexed and missing vaults are not suggested.
        self.assertEqual([s["path"] for s in ov["suggestions"]], [str(other.resolve())])

    def test_missing_index_is_an_empty_library(self):
        with mock.patch.dict(os.environ, {"QMD_INDEX": str(self.root / "none.sqlite")}):
            ov = folders.overview()
            self.assertEqual(ov["folders"], [])
            folders.add({"path": str(self.notes)})
            wait_jobs()
        self.assertEqual(self.calls()[0]["argv"][:2], ["collection", "add"])


if __name__ == "__main__":
    unittest.main()
