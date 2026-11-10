"""Notes Search -- the read side of the app, with no aiohttp in it.

Everything here is blocking (SQLite reads, file reads, one subprocess), and the
route layer runs each call in ``asyncio.to_thread`` so nothing touches the
gateway's event loop. Kept free of the web framework so the tests can drive it
directly against a fixture index.

Two search paths, chosen by what the moment needs
-------------------------------------------------
``suggest`` runs while the user types. It reads QMD's own FTS5 table
(``documents_fts``) read-only and in-process, which answers in a few
milliseconds. Shelling out to ``qmd search`` for every keystroke costs ~170 ms
of Node start-up per call, which is the difference between results that follow
the cursor and results that trail it.

``deep`` runs ``qmd query`` -- the hybrid path with query expansion, vectors and
reranking. It loads two local models and takes seconds, so the page asks for
it explicitly (Enter on the search box) and the result is cached.

The schema is QMD's, not ours. ``schema_ok`` checks the handful of columns this
module reads, and ``suggest`` falls back to ``qmd search --json`` when they are
missing, so a QMD upgrade that reshapes the index degrades speed rather than
breaking search.

Reading documents
-----------------
A document is addressed by ``(collection, path)`` exactly as QMD stores it. The
collection's root comes from ``store_collections``; the resolved file must stay
inside that root after ``realpath``, so ``../`` segments or a symlink cannot
turn the reader into a general file server. Notes carrying ``private: true``
frontmatter are flagged, and the page refuses to put them into a chat.
"""

from __future__ import annotations

import json
import math
import os
import re
import shutil
import sqlite3
import subprocess
import threading
import time
import unicodedata
from collections import OrderedDict
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

#: Where QMD keeps its index unless told otherwise. ``QMD_INDEX`` overrides it,
#: which is also how the tests point this module at a fixture.
DEFAULT_INDEX = Path(
    os.environ.get("XDG_CACHE_HOME", str(Path.home() / ".cache"))
) / "qmd" / "index.sqlite"

#: Largest document the reader will return. The vault's largest notes are a few
#: hundred KB; anything bigger is almost certainly a pasted export.
MAX_DOC_BYTES = 3 * 1024 * 1024
#: Largest image the asset route will stream.
MAX_ASSET_BYTES = 15 * 1024 * 1024
#: Image types the asset route serves. Anything else is a 404: the route exists
#: so a note's embedded screenshots render, not to expose arbitrary files.
ASSET_TYPES = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
}

_SNIPPET_OPEN = "\u0002"
_SNIPPET_CLOSE = "\u0003"

#: Lines that carry no reading value in a snippet: Reflect's frontmatter id, the
#: frontmatter fences, and the wiki-block markers.
_NOISE_LINE = re.compile(r"^\s*(?:---\s*$|id:\s*\w+\s*$|<!--.*?-->\s*$)")
_FRONTMATTER = re.compile(r"\A---\s*\n(.*?)\n---\s*(?:\n|\Z)", re.S)
_TOKEN = re.compile(r"[\w][\w'\-]*", re.U)
_PHRASE = re.compile(r'"([^"]+)"')


class LibraryError(Exception):
    """A request the library cannot satisfy, with an HTTP status to report."""

    def __init__(self, message: str, status: int = 400, code: str = "bad_request"):
        super().__init__(message)
        self.status = status
        self.code = code


# --------------------------------------------------------------------------
# Index access
# --------------------------------------------------------------------------


def index_path() -> Path:
    override = os.environ.get("QMD_INDEX")
    return Path(override).expanduser() if override else DEFAULT_INDEX


_local = threading.local()


def _conn() -> sqlite3.Connection:
    """A read-only connection for the calling thread.

    One per worker thread (``asyncio.to_thread`` reuses a small pool), reopened
    if the index file is replaced underneath it. ``mode=ro`` means this app can
    never write QMD's index, whatever a bug elsewhere asks of it.
    """
    path = index_path()
    try:
        stat = path.stat()
    except FileNotFoundError as exc:
        raise LibraryError(
            f"QMD index not found at {path}. Run `qmd update` to build it.",
            status=503,
            code="index_missing",
        ) from exc
    ident = (str(path), stat.st_ino)
    cached = getattr(_local, "conn", None)
    if cached is not None and getattr(_local, "ident", None) == ident:
        return cached
    if cached is not None:
        try:
            cached.close()
        except sqlite3.Error:
            pass
    conn = sqlite3.connect(f"file:{path}?mode=ro", uri=True, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    _local.conn = conn
    _local.ident = ident
    return conn


def schema_ok() -> bool:
    """Whether the index has the tables and columns this module reads."""
    try:
        conn = _conn()
        want = {
            "documents": {"id", "collection", "path", "title", "hash", "modified_at", "active"},
            "content": {"hash", "doc"},
            "store_collections": {"name", "path"},
        }
        for table, cols in want.items():
            have = {row[1] for row in conn.execute(f"PRAGMA table_info({table})")}
            if not cols <= have:
                return False
        conn.execute("SELECT rowid FROM documents_fts LIMIT 0")
        return True
    except (sqlite3.Error, LibraryError):
        return False


def collections() -> list[dict[str, Any]]:
    conn = _conn()
    rows = conn.execute(
        """
        SELECT c.name, c.path, COUNT(d.id) AS docs
        FROM store_collections c
        LEFT JOIN documents d ON d.collection = c.name AND d.active = 1
        GROUP BY c.name, c.path
        ORDER BY docs DESC
        """
    ).fetchall()
    return [
        {"name": r["name"], "path": r["path"], "docs": r["docs"], "obsidian": _is_vault_root(r["path"])}
        for r in rows
    ]


def _is_vault_root(path: str | Path) -> bool:
    """An Obsidian vault is a folder with an ``.obsidian/`` settings directory.

    A folder that ALSO carries ``.reflect/`` is a Reflect graph that was once
    opened in Obsidian: Reflect titles notes by their H1 (its files are named by
    id), so title-first linking stays right for it.
    """
    try:
        root = Path(path).expanduser()
        return (root / ".obsidian").is_dir() and not (root / ".reflect").is_dir()
    except OSError:
        return False


def is_obsidian(collection: str | None) -> bool:
    if not collection:
        return False
    try:
        return _is_vault_root(_collection_root(collection))
    except LibraryError:
        return False


def _collection_root(name: str) -> Path:
    row = _conn().execute("SELECT path FROM store_collections WHERE name = ?", (name,)).fetchone()
    if row is None:
        raise LibraryError(f"unknown collection {name!r}", status=404, code="collection_not_found")
    return Path(row["path"]).expanduser()


def status() -> dict[str, Any]:
    path = index_path()
    out: dict[str, Any] = {
        "index": str(path),
        "qmd": qmd_binary(),
        "schema_ok": False,
        "collections": [],
        "documents": 0,
        "index_updated_at": None,
    }
    try:
        out["index_updated_at"] = _iso(path.stat().st_mtime)
    except FileNotFoundError:
        out["error"] = f"QMD index not found at {path}"
        return out
    try:
        out["collections"] = collections()
        out["documents"] = sum(c["docs"] for c in out["collections"])
        out["schema_ok"] = schema_ok()
    except (sqlite3.Error, LibraryError) as exc:
        out["error"] = str(exc)
    return out


# --------------------------------------------------------------------------
# Free-form query -> FTS5
# --------------------------------------------------------------------------


@dataclass
class ParsedQuery:
    phrases: list[str]
    terms: list[str]
    #: The token under the cursor, matched as a prefix. ``None`` once the user
    #: has typed a space after it, at which point it is a whole word.
    partial: str | None
    excluded: list[str]

    @property
    def empty(self) -> bool:
        return not (self.phrases or self.terms or self.partial)

    def words(self) -> list[str]:
        """Every positive word, for highlighting on the page."""
        out = [w for p in self.phrases for w in _TOKEN.findall(p)]
        out += self.terms
        if self.partial:
            out.append(self.partial)
        return out


def parse_query(text: str) -> ParsedQuery:
    """Turn whatever the user typed into terms FTS5 can match without a syntax error.

    Free-form text is the contract, so nothing a person types may surface as an
    FTS5 parse error. Quoted spans become phrases, ``-word`` excludes, and every
    other word is a quoted term -- quoting is what neutralises ``AND``, ``NEAR``,
    ``*``, ``:`` and parentheses, which FTS5 would otherwise read as operators.
    """
    text = (text or "")[:500]
    phrases = [p.strip() for p in _PHRASE.findall(text) if _TOKEN.search(p)]
    rest = _PHRASE.sub(" ", text)
    if rest.count('"') % 2:  # an unclosed quote while typing: treat as a space
        rest = rest.replace('"', " ")
    trailing_space = not text or text[-1].isspace() or text.rstrip().endswith('"')
    excluded: list[str] = []
    terms: list[str] = []
    for raw in rest.split():
        if raw.startswith("-") and len(raw) > 1:
            excluded += [t.lower() for t in _TOKEN.findall(raw[1:])]
            continue
        terms += [t.lower() for t in _TOKEN.findall(raw)]
    partial = None
    if terms and not trailing_space:
        partial = terms.pop()
    return ParsedQuery(phrases=phrases, terms=terms, partial=partial, excluded=excluded)


def _quote(term: str) -> str:
    return '"' + term.replace('"', '""') + '"'


def fts_expression(q: ParsedQuery, partial_override: str | None = None) -> str:
    parts = [_quote(p) for p in q.phrases] + [_quote(t) for t in q.terms]
    partial = partial_override if partial_override is not None else q.partial
    if partial:
        # A one-letter prefix matches most of the vault and is slow to rank, so
        # it is matched as a word until a second letter arrives.
        parts.append(_quote(partial) + ("*" if len(partial) >= 2 else ""))
    expr = " ".join(parts)
    if expr and q.excluded:
        expr = f"({expr}) NOT ({' OR '.join(_quote(t) for t in q.excluded)})"
    return expr


def _partial_fallbacks(partial: str | None) -> list[str | None]:
    """Shorter spellings of the token under the cursor, for the stemmer's sake.

    The index uses the Porter stemmer, so "pricing" is stored as "price" and the
    prefix "prici*" matches nothing even though the user is plainly typing
    "pricing". Dropping letters from the end until something matches (never
    below three) recovers that without a second index.
    """
    out: list[str | None] = [partial]
    if partial and len(partial) > 3:
        for cut in range(1, min(3, len(partial) - 3) + 1):
            out.append(partial[:-cut])
    return out


# --------------------------------------------------------------------------
# Search
# --------------------------------------------------------------------------


def _recency_boost(modified_at: str | None, now: float) -> float:
    """Up to +25% for a note touched today, fading over roughly a quarter."""
    if not modified_at:
        return 1.0
    try:
        ts = datetime.fromisoformat(modified_at.replace("Z", "+00:00")).timestamp()
    except ValueError:
        return 1.0
    age_days = max(0.0, (now - ts) / 86400.0)
    return 1.0 + 0.25 * math.exp(-age_days / 90.0)


def _clean_snippet(raw: str) -> str:
    lines = [ln for ln in raw.splitlines() if not _NOISE_LINE.match(ln)]
    text = " ".join(ln.strip() for ln in lines if ln.strip())
    text = re.sub(r"\s+", " ", text)
    # Leading markdown structure reads as noise in a one-line preview.
    return re.sub(r"(^|\s)#{1,6}\s+", r"\1", text).strip()


def _snippet_to_parts(text: str) -> list[dict[str, Any]]:
    """Split a marked snippet into ``[{text, hit}]`` so the page never parses HTML."""
    parts: list[dict[str, Any]] = []
    for i, chunk in enumerate(re.split(f"[{_SNIPPET_OPEN}{_SNIPPET_CLOSE}]", text)):
        if chunk:
            parts.append({"text": chunk, "hit": i % 2 == 1})
    return parts


_DATE_STEM = re.compile(r"^\d{4}-\d{2}-\d{2}$")


def display_title(title: str | None, rel: str, collection: str | None = None) -> str:
    """The title a person would recognise.

    QMD titles a note by its first heading, so every daily note whose first
    section is "Meetings" is titled "Meetings". A date-named file is titled by
    its date, which is what Reflect shows and what ``[[2026-10-02]]`` links say.

    In an Obsidian vault the filename IS the title, so the real file's stem wins
    (QMD's stored path is lower-cased and dashed, which is not what Obsidian shows).
    """
    stem = Path(rel).stem
    if collection and _vault_cached(collection):
        try:
            real = _disk_map(_collection_root(collection).resolve()).get(rel)
        except LibraryError:
            real = None
        return Path(real).stem if real else (title or stem)
    if _DATE_STEM.match(stem):
        return stem
    return title or stem


_vault_flags: dict[str, tuple[float, bool]] = {}


def _vault_cached(collection: str) -> bool:
    """``is_obsidian`` with a short cache, since search rows ask once per result."""
    now = time.monotonic()
    hit = _vault_flags.get(collection)
    if hit and now - hit[0] < _DISK_MAP_TTL:
        return hit[1]
    flag = is_obsidian(collection)
    _vault_flags[collection] = (now, flag)
    return flag


def _doc_row_payload(row: sqlite3.Row, score: float, snippet: str) -> dict[str, Any]:
    return {
        "collection": row["collection"],
        "path": row["path"],
        "uri": f"qmd://{row['collection']}/{row['path']}",
        "title": display_title(row["title"], row["path"], row["collection"]),
        "modified_at": row["modified_at"],
        "score": round(score, 4),
        "snippet": _snippet_to_parts(_clean_snippet(snippet)),
    }


def suggest(
    text: str, collection: str | None = None, limit: int = 12, sort: str = "relevance"
) -> dict[str, Any]:
    """Instant results for the text in the search box, ranked and snippeted.

    ``sort="recent"`` returns the newest matching notes instead of the best
    ranked ones: the ORDER BY changes in SQL, so it is the newest of ALL
    matches, not a reshuffle of the top few.
    """
    started = time.perf_counter()
    recent_first = sort == "recent"
    q = parse_query(text)
    limit = max(1, min(int(limit or 12), 40))
    if q.empty:
        return {"query": text, "words": [], "results": [], "took_ms": 0, "engine": "fts"}
    if not schema_ok():
        return _cli_search(text, collection, limit, started, q)

    conn = _conn()
    now = time.time()
    rows: list[sqlite3.Row] = []
    expr = ""
    for partial in _partial_fallbacks(q.partial):
        expr = fts_expression(q, partial_override=partial)
        if not expr:
            break
        sql = """
            SELECT f.rowid AS rid, bm25(documents_fts, 2.0, 12.0, 1.0) AS rank
            FROM documents_fts f
            JOIN documents d ON d.id = f.rowid AND d.active = 1
            WHERE documents_fts MATCH ?
        """
        args: list[Any] = [expr]
        if collection:
            sql += " AND d.collection = ?"
            args.append(collection)
        if recent_first:
            sql += " ORDER BY d.modified_at DESC LIMIT ?"
            args.append(limit)
        else:
            # Over-fetch so the recency boost can reorder near-ties.
            sql += " ORDER BY rank LIMIT ?"
            args.append(limit * 3)
        try:
            rows = conn.execute(sql, args).fetchall()
        except sqlite3.OperationalError:
            rows = []
        if rows:
            break

    if not rows:
        return {
            "query": text,
            "words": q.words(),
            "results": [],
            "took_ms": round((time.perf_counter() - started) * 1000, 1),
            "engine": "fts",
        }

    ids = [r["rid"] for r in rows]
    rank = {r["rid"]: r["rank"] for r in rows}
    placeholders = ",".join("?" * len(ids))
    detail = conn.execute(
        f"""
        SELECT f.rowid AS rid, d.collection, d.path, d.title, d.modified_at,
               snippet(documents_fts, 2, '{_SNIPPET_OPEN}', '{_SNIPPET_CLOSE}', '…', 22) AS snip
        FROM documents_fts f
        JOIN documents d ON d.id = f.rowid
        WHERE documents_fts MATCH ? AND f.rowid IN ({placeholders})
        """,
        [expr, *ids],
    ).fetchall()

    scored = []
    for row in detail:
        # bm25 is negative-is-better; flip it so bigger is better before boosting.
        base = -float(rank[row["rid"]])
        title = (row["title"] or "").lower()
        words = q.words()
        if words and all(w in title for w in words):
            base *= 1.35
        scored.append((base * _recency_boost(row["modified_at"], now), row))
    if recent_first:
        scored.sort(key=lambda pair: pair[1]["modified_at"] or "", reverse=True)
    else:
        scored.sort(key=lambda pair: pair[0], reverse=True)
    top = scored[:limit]
    if recent_first and top:
        # Scores stay relative to the best match in the set, for display only.
        best = max(s for s, _ in top)
        results = [_doc_row_payload(row, s / best if best else 0.0, row["snip"]) for s, row in top]
        return {
            "query": text,
            "words": q.words(),
            "results": results,
            "took_ms": round((time.perf_counter() - started) * 1000, 1),
            "engine": "fts",
            "sort": "recent",
        }
    best = top[0][0] if top else 1.0
    results = [_doc_row_payload(row, s / best if best else 0.0, row["snip"]) for s, row in top]
    return {
        "query": text,
        "words": q.words(),
        "results": results,
        "took_ms": round((time.perf_counter() - started) * 1000, 1),
        "engine": "fts",
    }


def recent(limit: int = 30, collection: str | None = None) -> list[dict[str, Any]]:
    """The most recently modified notes, for the empty search box."""
    conn = _conn()
    sql = """
        SELECT d.collection, d.path, d.title, d.modified_at, substr(c.doc, 1, 900) AS head
        FROM documents d JOIN content c ON c.hash = d.hash
        WHERE d.active = 1
    """
    args: list[Any] = []
    if collection:
        sql += " AND d.collection = ?"
        args.append(collection)
    sql += " ORDER BY d.modified_at DESC LIMIT ?"
    args.append(max(1, min(int(limit), 100)))
    out = []
    for row in conn.execute(sql, args):
        head = _FRONTMATTER.sub("", row["head"] or "")
        lines = [
            ln for ln in head.splitlines()
            if ln.strip() and not ln.lstrip().startswith(("#", "<!--", "- Type:"))
        ]
        excerpt = _clean_snippet(" ".join(lines))[:220]
        out.append(_doc_row_payload(row, 0.0, excerpt))
    return out


# --------------------------------------------------------------------------
# The qmd CLI: deep search, and the fallback when the schema moves
# --------------------------------------------------------------------------


def qmd_binary() -> str | None:
    """The qmd launcher, preferring the Node-pinned one on ~/.local/bin.

    The gateway's PATH is not the user's login PATH, and the ~/.bun wrapper picks
    up whichever Node comes first -- the wrong ABI fails with NODE_MODULE_VERSION.
    The ~/.local/bin launcher pins the Node QMD's native module was built for.
    """
    override = os.environ.get("QMD_BIN")
    candidates = [override] if override else []
    candidates += [
        str(Path.home() / ".local/bin/qmd"),
        str(Path.home() / ".bun/bin/qmd"),
        shutil.which("qmd") or "",
        "/opt/homebrew/bin/qmd",
    ]
    for c in candidates:
        if c and os.path.isfile(c) and os.access(c, os.X_OK):
            return c
    return None


def _qmd_env() -> dict[str, str]:
    env = dict(os.environ)
    extra = [str(Path.home() / ".local/bin"), str(Path.home() / ".bun/bin"), "/opt/homebrew/bin"]
    env["PATH"] = os.pathsep.join(extra + [env.get("PATH", "")])
    env.setdefault("NO_COLOR", "1")
    # QMD_INDEX moves the index this app READS. The qmd CLI takes its database
    # from INDEX_PATH, so pass the same file on, or searches and folder changes
    # would run against a different index than the page shows.
    if os.environ.get("QMD_INDEX"):
        env["INDEX_PATH"] = str(index_path())
    return env


def clear_caches() -> None:
    """Forget per-collection lookups after a folder is added, removed or re-indexed."""
    _vault_flags.clear()
    with _disk_lock:
        _disk_maps.clear()
        _asset_maps.clear()
    with _deep_lock:
        _deep_cache.clear()


def _run_qmd(args: list[str], timeout: float) -> Any:
    binary = qmd_binary()
    if not binary:
        raise LibraryError("qmd is not installed or not on PATH", status=503, code="qmd_missing")
    try:
        proc = subprocess.run(
            [binary, *args],
            capture_output=True,
            text=True,
            timeout=timeout,
            env=_qmd_env(),
            stdin=subprocess.DEVNULL,
        )
    except subprocess.TimeoutExpired as exc:
        raise LibraryError(
            f"qmd took longer than {int(timeout)}s", status=504, code="qmd_timeout"
        ) from exc
    if proc.returncode != 0:
        tail = (proc.stderr or proc.stdout or "").strip().splitlines()[-1:] or ["no output"]
        raise LibraryError(f"qmd failed: {tail[0][:300]}", status=502, code="qmd_failed")
    out = proc.stdout.strip()
    start = out.find("[")
    if start < 0:
        return []
    try:
        return json.loads(out[start:])
    except json.JSONDecodeError as exc:
        raise LibraryError("qmd returned output that is not JSON", status=502, code="qmd_bad_json") from exc


def _from_cli_rows(rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    out = []
    for r in rows:
        uri = str(r.get("file") or "")
        m = re.match(r"^qmd://([^/]+)/(.+)$", uri)
        if not m:
            continue
        snippet = str(r.get("snippet") or "")
        snippet = re.sub(r"^@@[^\n]*\n+", "", snippet)
        out.append(
            {
                "collection": m.group(1),
                "path": m.group(2),
                "uri": uri,
                "title": display_title(r.get("title"), m.group(2)),
                "modified_at": None,
                "score": float(r.get("score") or 0.0),
                "line": r.get("line"),
                "snippet": [{"text": _clean_snippet(snippet)[:400], "hit": False}],
            }
        )
    _attach_modified(out)
    return out


def _attach_modified(results: list[dict[str, Any]]) -> None:
    if not results:
        return
    try:
        conn = _conn()
    except LibraryError:
        return
    for r in results:
        row = conn.execute(
            "SELECT modified_at FROM documents WHERE collection = ? AND path = ? AND active = 1",
            (r["collection"], r["path"]),
        ).fetchone()
        if row is not None:
            r["modified_at"] = row["modified_at"]


def _cli_search(text: str, collection: str | None, limit: int, started: float, q: ParsedQuery):
    args = ["search", text, "--json", "-n", str(limit)]
    if collection:
        args += ["-c", collection]
    rows = _run_qmd(args, timeout=20)
    return {
        "query": text,
        "words": q.words(),
        "results": _from_cli_rows(rows),
        "took_ms": round((time.perf_counter() - started) * 1000, 1),
        "engine": "qmd-search",
    }


_deep_cache: "OrderedDict[tuple[str, str], dict[str, Any]]" = OrderedDict()
_deep_lock = threading.Lock()
#: One hybrid query at a time. Each one loads the embedding and reranker models,
#: and two at once on a laptop already short of memory is how a gateway stalls.
_deep_flight = threading.Lock()


def deep(text: str, collection: str | None = None, limit: int = 12) -> dict[str, Any]:
    """Hybrid search through ``qmd query``: expansion, vectors and reranking."""
    text = (text or "").strip()[:500]
    if not text:
        return {"query": text, "results": [], "took_ms": 0, "engine": "qmd-query", "cached": False}
    key = (text, collection or "")
    with _deep_lock:
        hit = _deep_cache.get(key)
        if hit is not None:
            _deep_cache.move_to_end(key)
            return {**hit, "cached": True}
    if not _deep_flight.acquire(timeout=120):
        raise LibraryError("another deep search is still running", status=409, code="busy")
    try:
        started = time.perf_counter()
        args = ["query", text, "--json", "-n", str(max(1, min(int(limit), 30)))]
        if collection:
            args += ["-c", collection]
        rows = _run_qmd(args, timeout=150)
        payload = {
            "query": text,
            "words": parse_query(text + " ").words(),
            "results": _from_cli_rows(rows),
            "took_ms": round((time.perf_counter() - started) * 1000, 1),
            "engine": "qmd-query",
        }
    finally:
        _deep_flight.release()
    with _deep_lock:
        _deep_cache[key] = payload
        while len(_deep_cache) > 40:
            _deep_cache.popitem(last=False)
    return {**payload, "cached": False}


# --------------------------------------------------------------------------
# Documents
# --------------------------------------------------------------------------


def _hex_emoji(segment: str) -> str:
    out: list[str] = []
    run: list[str] = []

    def flush():
        if run:
            out.append("-".join(format(ord(c), "x") for c in run))
            run.clear()

    for ch in segment:
        cat = unicodedata.category(ch)
        if cat in ("So", "Sk"):
            run.append(ch)
        elif cat == "Mn" and run:
            continue
        else:
            flush()
            out.append(ch)
    flush()
    return "".join(out)


def _clean_segment(s: str) -> str:
    out: list[str] = []
    dash = False
    for ch in s:
        if ch.isalnum() or ch == "$":
            out.append(ch)
            dash = False
        elif not dash:
            out.append("-")
            dash = True
    return "".join(out).strip("-")


def handelize(path: str) -> str:
    """Python port of QMD's ``handelize``: the path QMD stores for a file.

    QMD indexes ``drafts/Kiro Pricing Update.md`` as
    ``drafts/Kiro-Pricing-Update.md``, so the stored path is NOT a path on disk
    for any file whose name has spaces, punctuation or emoji. Mirrors
    ``store.js`` in @tobilu/qmd: ``___`` is a folder break, emoji become hex code
    points, every other run of non letter/number/``$`` becomes one dash, and the
    filename keeps its extension.
    """
    parts = path.replace("___", "/").split("/")
    out = []
    for i, seg in enumerate(parts):
        seg = _hex_emoji(seg)
        if i == len(parts) - 1:
            m = re.search(r"(\.[A-Za-z0-9]+)$", seg)
            ext = m.group(1) if m else ""
            name = seg[: -len(ext)] if ext else seg
            cleaned = _clean_segment(name) + ext
        else:
            cleaned = _clean_segment(seg)
        if cleaned:
            out.append(cleaned)
    return "/".join(out)


_disk_maps: dict[str, tuple[float, dict[str, str]]] = {}
_disk_lock = threading.Lock()
_DISK_MAP_TTL = 60.0


def _disk_map(root: Path) -> dict[str, str]:
    """``handelized path -> real relative path`` for every markdown file under root."""
    key = str(root)
    now = time.monotonic()
    with _disk_lock:
        hit = _disk_maps.get(key)
        if hit and now - hit[0] < _DISK_MAP_TTL:
            return hit[1]
    mapping: dict[str, str] = {}
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if not d.startswith(".") and d != "node_modules"]
        rel_dir = os.path.relpath(dirpath, root)
        for f in filenames:
            if not f.lower().endswith(".md"):
                continue
            rel = f if rel_dir == "." else f"{rel_dir}/{f}"
            try:
                mapping.setdefault(handelize(rel), rel)
            except Exception:  # pragma: no cover - a name handelize cannot express
                continue
    with _disk_lock:
        _disk_maps[key] = (now, mapping)
    return mapping


def _resolve(collection: str, rel: str) -> Path:
    """The file on disk for QMD's stored ``(collection, path)``, confined to the root."""
    if not collection or not rel:
        raise LibraryError("collection and path are required")
    if "\x00" in rel or rel.startswith(("/", "\\")):
        raise LibraryError("invalid path")
    root = _collection_root(collection).resolve()
    target = (root / rel).resolve()
    if target != root and root not in target.parents:
        raise LibraryError("path escapes its collection", status=403, code="outside_collection")
    if not target.exists():
        real = _disk_map(root).get(rel) or _disk_map(root).get(handelize(rel))
        if real:
            candidate = (root / real).resolve()
            if root in candidate.parents:
                return candidate
    return target


def frontmatter(text: str) -> tuple[dict[str, str], str]:
    """A shallow ``key: value`` read of YAML frontmatter, and the body after it.

    Shallow on purpose: the reader only shows simple properties, and pulling in
    a YAML parser for that would be a dependency for display.
    """
    m = _FRONTMATTER.match(text)
    if not m:
        return {}, text
    props: dict[str, str] = {}
    key: str | None = None
    items: list[str] = []

    def flush() -> None:
        if key is not None and items:
            props[key] = ", ".join(items)

    for line in m.group(1).splitlines():
        stripped = line.strip()
        # Obsidian writes lists as block items under the key:
        #   tags:
        #     - meeting
        if key is not None and stripped.startswith("- "):
            items.append(stripped[2:].strip().strip("'\""))
            continue
        if ":" in line and not line.startswith((" ", "\t", "-")):
            flush()
            k, _, v = line.partition(":")
            key, items = k.strip(), []
            v = v.strip()
            if v.startswith("[") and v.endswith("]"):
                # Flow list: aliases: [Alpha, "Beta"]
                v = ", ".join(p.strip().strip("'\"") for p in v[1:-1].split(",") if p.strip())
            props[key] = v.strip("'\"")
    flush()
    return props, text[m.end():]


def frontmatter_list(props: dict[str, str], name: str) -> list[str]:
    """A list property (``aliases``, ``tags``) as its items."""
    raw = props.get(name, "")
    return [p.strip() for p in raw.split(",") if p.strip()]


def is_private(props: dict[str, str]) -> bool:
    return str(props.get("private", "")).lower() in {"true", "yes", "1"}


def document(collection: str, rel: str) -> dict[str, Any]:
    target = _resolve(collection, rel)
    conn = _conn()
    row = conn.execute(
        """
        SELECT d.title, d.modified_at, d.hash, c.doc
        FROM documents d LEFT JOIN content c ON c.hash = d.hash
        WHERE d.collection = ? AND d.path = ? AND d.active = 1
        """,
        (collection, rel),
    ).fetchone()
    text: str | None = None
    source = "disk"
    mtime: float | None = None
    try:
        st = target.stat()
        if st.st_size > MAX_DOC_BYTES:
            raise LibraryError("document is too large to open here", status=413, code="too_large")
        text = target.read_text(encoding="utf-8", errors="replace")
        mtime = st.st_mtime
    except FileNotFoundError:
        # Deleted since the last `qmd update`: show what the index still holds,
        # and say so, rather than a bare 404 for a result the search just showed.
        if row is None or row["doc"] is None:
            raise LibraryError("document not found", status=404, code="doc_not_found") from None
        text = row["doc"]
        source = "index"
    props, body = frontmatter(text)
    title = display_title((row["title"] if row is not None else None) or _first_heading(body), rel, collection)
    words = len(_TOKEN.findall(body))
    return {
        "collection": collection,
        "path": rel,
        "uri": f"qmd://{collection}/{rel}",
        "abs_path": str(target),
        "title": title,
        "markdown": text,
        "properties": {k: v for k, v in props.items() if k != "id"},
        "private": is_private(props),
        "modified_at": _iso(mtime) if mtime else (row["modified_at"] if row is not None else None),
        "indexed_at": row["modified_at"] if row is not None else None,
        "stale_index": bool(
            row is not None and row["hash"] and mtime and _index_older(row["modified_at"], mtime)
        ),
        "source": source,
        "obsidian": _obsidian_link(collection, target),
        "words": words,
        "reading_minutes": max(1, round(words / 230)),
    }


def _index_older(indexed_iso: str | None, mtime: float) -> bool:
    if not indexed_iso:
        return False
    try:
        ts = datetime.fromisoformat(indexed_iso.replace("Z", "+00:00")).timestamp()
    except ValueError:
        return False
    return mtime - ts > 120


def _first_heading(body: str) -> str | None:
    m = re.search(r"^#\s+(.+)$", body, re.M)
    return m.group(1).strip() if m else None


def resolve_link(target: str, from_collection: str | None = None) -> dict[str, Any] | None:
    """Resolve a ``[[wikilink]]`` the way the note's own app would.

    Title-first apps (Reflect, Logseq-style vaults) name a note by its H1, so the
    title wins, then the filename stem (``[[2026-10-02]]`` names a daily note by
    its file), then a path suffix for ``[[folder/note]]``. In an Obsidian vault a
    link names the FILE, so the filename and path go first, the H1 after, and a
    note's ``aliases`` frontmatter last. ``#Heading`` and ``#^block`` suffixes
    are the reader's business, not the resolver's.
    """
    target = (target or "").split("|", 1)[0].split("#", 1)[0].split("^", 1)[0].strip()
    if not target:
        return None
    conn = _conn()
    order = "CASE WHEN d.collection = ? THEN 0 ELSE 1 END, d.modified_at DESC"
    args_c = [from_collection or ""]

    def by_title():
        return conn.execute(
            f"SELECT collection, path, title FROM documents d WHERE active = 1 AND title = ? COLLATE NOCASE ORDER BY {order} LIMIT 1",
            [target, *args_c],
        ).fetchone()

    def by_file():
        stem = target if target.lower().endswith(".md") else target + ".md"
        # QMD stores a cleaned-up path ("My Note.md" -> "my-note.md"), so match
        # the link both as written and as QMD would have stored it.
        handle = handelize(stem) or stem
        # Shortest path first: Obsidian picks the closest-to-root note when two
        # files share a name and the link does not say which.
        return conn.execute(
            f"""SELECT collection, path, title FROM documents d WHERE active = 1
                AND (path = ? COLLATE NOCASE OR path LIKE ? ESCAPE '\\'
                     OR path = ? COLLATE NOCASE OR path LIKE ? ESCAPE '\\')
                ORDER BY CASE WHEN d.collection = ? THEN 0 ELSE 1 END, length(path), d.modified_at DESC
                LIMIT 1""",
            [stem, "%/" + _like_escape(stem), handle, "%/" + _like_escape(handle), *args_c],
        ).fetchone()

    steps = (by_file, by_title, lambda: _by_alias(target, from_collection)) if is_obsidian(from_collection) else (
        by_title, by_file, lambda: _by_alias(target, from_collection)
    )
    row = None
    for step in steps:
        row = step()
        if row is not None:
            break
    if row is None:
        return None
    return {"collection": row["collection"], "path": row["path"], "title": row["title"]}


def _by_alias(target: str, from_collection: str | None):
    """A note whose ``aliases`` frontmatter names ``target``."""
    conn = _conn()
    rows = conn.execute(
        """SELECT d.collection, d.path, d.title, c.doc FROM documents d JOIN content c ON c.hash = d.hash
           WHERE d.active = 1 AND c.doc LIKE '---%' AND c.doc LIKE '%alias%' AND c.doc LIKE ? ESCAPE '\\'
           ORDER BY CASE WHEN d.collection = ? THEN 0 ELSE 1 END, d.modified_at DESC LIMIT 50""",
        ["%" + _like_escape(target) + "%", from_collection or ""],
    ).fetchall()
    want = target.lower()
    for r in rows:
        props, _ = frontmatter(r["doc"])
        names = frontmatter_list(props, "aliases") + frontmatter_list(props, "alias")
        if any(n.lower() == want for n in names):
            return r
    return None


def _like_escape(s: str) -> str:
    return s.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")


def backlinks(collection: str, rel: str, limit: int = 40) -> list[dict[str, Any]]:
    """Notes that link here with ``[[Title]]`` or ``[[file-stem]]``."""
    conn = _conn()
    row = conn.execute(
        "SELECT title FROM documents WHERE collection = ? AND path = ? AND active = 1",
        (collection, rel),
    ).fetchone()
    names = {Path(rel).stem}
    if row is not None and row["title"]:
        names.add(row["title"])
    clauses = []
    args: list[Any] = []
    for n in names:
        for close in ("]]", "|", "#"):
            clauses.append("c.doc LIKE ? ESCAPE '\\'")
            args.append("%[[" + _like_escape(n) + close + "%")
    sql = f"""
        SELECT d.collection, d.path, d.title, d.modified_at, c.doc
        FROM documents d JOIN content c ON c.hash = d.hash
        WHERE d.active = 1 AND NOT (d.collection = ? AND d.path = ?)
          AND ({' OR '.join(clauses)})
        ORDER BY d.modified_at DESC LIMIT ?
    """
    out = []
    for r in conn.execute(sql, [collection, rel, *args, max(1, min(limit, 100))]):
        out.append(_doc_row_payload(r, 0.0, _link_context(r["doc"], names)))
    return out


def _link_context(doc: str, names: set[str]) -> str:
    low = doc.lower()
    for n in names:
        i = low.find("[[" + n.lower())
        if i >= 0:
            start = max(0, i - 110)
            end = min(len(doc), i + len(n) + 120)
            pre = "…" if start else ""
            post = "…" if end < len(doc) else ""
            seg = doc[start:end]
            j = seg.lower().find("[[" + n.lower())
            k = seg.find("]]", j)
            k = len(seg) if k < 0 else k + 2
            return pre + seg[:j] + _SNIPPET_OPEN + seg[j:k] + _SNIPPET_CLOSE + seg[k:] + post
    return ""


def asset(collection: str, rel_from_doc: str, src: str) -> tuple[bytes, str]:
    """An image a note embeds, resolved relative to the note, then to the root."""
    if re.match(r"^[a-z][a-z0-9+.\-]*:", src, re.I):
        raise LibraryError("only local images are served", status=404, code="not_local")
    src = src.split("?", 1)[0].split("#", 1)[0]
    try:
        from urllib.parse import unquote

        src = unquote(src)
    except Exception:  # pragma: no cover
        pass
    root = _collection_root(collection).resolve()
    base = _resolve(collection, rel_from_doc).parent
    candidates = [base / src, root / src.lstrip("/")]
    # Obsidian's ![[image.png]] names a file anywhere in the vault (usually an
    # attachments folder), so fall back to a by-name lookup under the root.
    by_name = _asset_map(root).get(Path(src).name.lower())
    if by_name:
        candidates.append(root / by_name)
    for cand in candidates:
        try:
            target = cand.resolve()
        except OSError:
            continue
        if root not in target.parents:
            continue
        ctype = ASSET_TYPES.get(target.suffix.lower())
        if ctype and target.is_file():
            if target.stat().st_size > MAX_ASSET_BYTES:
                raise LibraryError("image too large", status=413, code="too_large")
            return target.read_bytes(), ctype
    raise LibraryError("image not found", status=404, code="asset_not_found")


_asset_maps: dict[str, tuple[float, dict[str, str]]] = {}


def _asset_map(root: Path) -> dict[str, str]:
    """``lower-cased image filename -> shortest relative path`` under root."""
    key = str(root)
    now = time.monotonic()
    with _disk_lock:
        hit = _asset_maps.get(key)
        if hit and now - hit[0] < _DISK_MAP_TTL:
            return hit[1]
    mapping: dict[str, str] = {}
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if not d.startswith(".") and d != "node_modules"]
        rel_dir = os.path.relpath(dirpath, root)
        for f in filenames:
            if Path(f).suffix.lower() not in ASSET_TYPES:
                continue
            rel = f if rel_dir == "." else f"{rel_dir}/{f}"
            prev = mapping.get(f.lower())
            if prev is None or len(rel) < len(prev):
                mapping[f.lower()] = rel
    with _disk_lock:
        _asset_maps[key] = (now, mapping)
    return mapping


def _obsidian_link(collection: str, target: Path) -> dict[str, str] | None:
    """What the reader needs for an "Open in Obsidian" button, or None.

    Obsidian's URI scheme names a vault by its folder name and a file by its
    vault-relative path without the ``.md``.
    """
    if not _vault_cached(collection):
        return None
    root = _collection_root(collection).resolve()
    try:
        rel = target.resolve().relative_to(root)
    except (ValueError, OSError):
        return None
    file = str(rel.with_suffix("")) if rel.suffix.lower() == ".md" else str(rel)
    return {"vault": root.name, "file": file}


def _iso(ts: float) -> str:
    return datetime.fromtimestamp(ts, tz=timezone.utc).isoformat().replace("+00:00", "Z")
