"""Chat sessions opened from Notes Search, and the first message each one gets.

The page creates the chat slot itself through the host's ``/api/chat/slots`` --
that is the one path that gives the session a real place in the sidebar, the
host's approval flow and its transcript. This module owns the two things the
host does not know about:

* which documents a session was opened about, kept in ``data/sessions.json`` so
  reopening a note can offer the conversations already held about it;
* the seed message, built HERE rather than in the page so the private-note rule
  is enforced by the server, not by a button being disabled.

Why the seed names files instead of pasting them
------------------------------------------------
The seed is the first user message in a transcript the person reads. Pasting a
40 KB note into it buries the question under the document, in the chat and in
the sidebar preview. The agent reads the file itself instead, which costs one
visible read and keeps the conversation about the question. It also means the
agent sees the file as it is on disk now, not as it was when the page loaded.
"""

from __future__ import annotations

import json
import os
import tempfile
import threading
import time
from pathlib import Path
from typing import Any

from . import library

MAX_SEED_DOCS = 12
MAX_SESSIONS = 300

_lock = threading.Lock()


def _file(data_dir: str) -> Path:
    return Path(data_dir) / "sessions.json"


def load(data_dir: str) -> list[dict[str, Any]]:
    try:
        raw = json.loads(_file(data_dir).read_text(encoding="utf-8"))
    except (FileNotFoundError, json.JSONDecodeError):
        return []
    if not isinstance(raw, list):
        return []
    return [s for s in raw if isinstance(s, dict) and s.get("slot_key")]


def _save(data_dir: str, sessions: list[dict[str, Any]]) -> None:
    path = _file(data_dir)
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp = tempfile.mkstemp(dir=str(path.parent), prefix=".sessions.", suffix=".json")
    with os.fdopen(fd, "w", encoding="utf-8") as fh:
        json.dump(sessions, fh, ensure_ascii=False, indent=1)
    os.replace(tmp, path)


def _clean_docs(docs: Any) -> list[dict[str, str]]:
    out = []
    seen = set()
    for d in docs if isinstance(docs, list) else []:
        if isinstance(d, dict) and d.get("collection") and d.get("path"):
            key = (str(d["collection"]), str(d["path"]))
            if key in seen:
                continue
            seen.add(key)
            out.append(
                {
                    "collection": key[0][:200],
                    "path": key[1][:1000],
                    "title": str(d.get("title") or "")[:300],
                }
            )
    return out[:MAX_SEED_DOCS]


def record(data_dir: str, body: dict[str, Any]) -> dict[str, Any]:
    slot_key = str(body.get("slot_key") or "").strip()
    if not slot_key or len(slot_key) > 200:
        raise library.LibraryError("slot_key is required")
    entry = {
        "slot_key": slot_key,
        "title": str(body.get("title") or "")[:200],
        "docs": _clean_docs(body.get("docs")),
        "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }
    with _lock:
        sessions = [s for s in load(data_dir) if s.get("slot_key") != slot_key]
        sessions.insert(0, entry)
        _save(data_dir, sessions[:MAX_SESSIONS])
    return entry


def forget(data_dir: str, slot_key: str) -> bool:
    with _lock:
        sessions = load(data_dir)
        kept = [s for s in sessions if s.get("slot_key") != slot_key]
        if len(kept) == len(sessions):
            return False
        _save(data_dir, kept)
    return True


def seed(body: dict[str, Any]) -> dict[str, Any]:
    """The first message for a new session about one or more documents.

    A private note is refused outright rather than silently dropped, so the page
    can say why the chat did not start.
    """
    docs = _clean_docs(body.get("docs"))
    question = str(body.get("question") or "").strip()[:4000]
    if not docs:
        raise library.LibraryError("at least one document is required")

    loaded = []
    for d in docs:
        doc = library.document(d["collection"], d["path"])
        if doc["private"]:
            raise library.LibraryError(
                f"“{doc['title']}” is marked private, so it is not shared with an agent",
                status=403,
                code="private_note",
            )
        loaded.append(doc)

    if len(loaded) == 1:
        d = loaded[0]
        lead = f"Let's talk about **{d['title']}** from my notes."
    else:
        lead = f"Let's talk about these {len(loaded)} notes together."
    files = "\n".join(f"- **{d['title']}** · `{d['abs_path']}`" for d in loaded)
    guidance = (
        "Read " + ("it" if len(loaded) == 1 else "each one") + " in full before answering, "
        "answer from " + ("it" if len(loaded) == 1 else "them") + " first, and name the section "
        "you are drawing on. Say plainly when something is not in there. For related context "
        "you can search the rest of my notes with `qmd query \"...\"` or `qmd search \"...\"`. "
        "Don't edit any of these files unless I ask."
    )
    ask = question or (
        "Start with a tight summary: what it says, the decisions and open questions in it, "
        "and anything that looks out of date."
        if len(loaded) == 1
        else "Start with what they say together, where they agree or conflict, and what is still open."
    )
    message = f"{lead}\n\n{files}\n\n{guidance}\n\n{ask}"
    title = loaded[0]["title"] if len(loaded) == 1 else f"{loaded[0]['title']} + {len(loaded) - 1} more"
    return {
        "message": message,
        "title": title[:120],
        "docs": [{"collection": d["collection"], "path": d["path"], "title": d["title"]} for d in loaded],
        "question": ask,
    }
