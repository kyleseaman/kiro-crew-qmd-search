"""Folder management: add, remove and re-index QMD collections from the page.

Every folder Notes Search shows is a QMD collection. This module drives the
``qmd`` CLI to change them, because QMD owns its index and this app only ever
opens it read-only (see ``library._conn``).

The CLI calls are slow (indexing a large vault, or embedding it, which downloads
models on first run) so they run as jobs on ONE worker thread. One thread also
serialises writes, since every ``qmd`` mutation writes the same SQLite file.
Jobs live in memory: the page polls ``GET /folders`` while any is unfinished,
and a gateway restart forgets them, which is fine because QMD's own state is
the record of what happened.

Inputs come from the page, so they are validated here before they reach argv,
and argv is always a list: nothing is ever passed through a shell.
"""

from __future__ import annotations

import json
import os
import re
import subprocess
import threading
import time
import uuid
from collections import deque
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from . import library

NAME_RE = re.compile(r"^[a-z0-9][a-z0-9_-]{0,39}$")
# Globs only: letters, digits, the glob metacharacters and path separators.
MASK_RE = re.compile(r"^[A-Za-z0-9_*?{}\[\],./ -]{1,120}$")
DEFAULT_MASK = "**/*.md"

ADD_TIMEOUT = 30 * 60
UPDATE_TIMEOUT = 30 * 60
EMBED_TIMEOUT = 60 * 60
REMOVE_TIMEOUT = 2 * 60
MAX_JOBS_KEPT = 20


class _Jobs:
    def __init__(self) -> None:
        self.lock = threading.Lock()
        self.jobs: dict[str, dict[str, Any]] = {}
        self.order: deque[str] = deque()
        self.queue: deque[tuple[str, list[tuple[str, list[str], float]]]] = deque()
        self.wake = threading.Condition(self.lock)
        self.worker: threading.Thread | None = None


_state = _Jobs()


def _now() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def slug(text: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")[:40].strip("-")
    return s or "notes"


# --------------------------------------------------------------------------
# Validation
# --------------------------------------------------------------------------


def _existing() -> list[dict[str, Any]]:
    try:
        return library.collections()
    except library.LibraryError as exc:
        if exc.code == "index_missing":
            return []
        raise


def validate_folder(raw_path: str) -> Path:
    raw = (raw_path or "").strip()
    if not raw:
        raise library.LibraryError("choose a folder", code="path_required")
    path = Path(raw).expanduser()
    if not path.is_absolute():
        raise library.LibraryError("use a full path, like ~/Documents/Notes", code="path_relative")
    try:
        path = path.resolve(strict=True)
    except (FileNotFoundError, RuntimeError) as exc:
        raise library.LibraryError(f"no folder at {raw}", status=404, code="path_missing") from exc
    if not path.is_dir():
        raise library.LibraryError(f"{raw} is a file, not a folder", code="path_not_dir")
    if not os.access(path, os.R_OK | os.X_OK):
        raise library.LibraryError(f"can't read {raw}", status=403, code="path_unreadable")
    home = Path.home().resolve()
    if path == Path(path.anchor) or path == home:
        raise library.LibraryError(
            "pick a notes folder, not your whole disk or home folder", code="path_too_broad"
        )
    for c in _existing():
        try:
            if Path(c["path"]).expanduser().resolve() == path:
                raise library.LibraryError(
                    f"that folder is already in Notes Search as “{c['name']}”", status=409, code="path_exists"
                )
        except OSError:
            continue
    return path


def validate_name(name: str, *, new: bool) -> str:
    name = (name or "").strip()
    if not NAME_RE.match(name):
        raise library.LibraryError(
            "names use lowercase letters, digits, - and _, up to 40 characters", code="bad_name"
        )
    names = {c["name"] for c in _existing()}
    if new and name in names:
        raise library.LibraryError(f"a folder named “{name}” already exists", status=409, code="name_exists")
    if not new and name not in names:
        raise library.LibraryError(f"unknown folder “{name}”", status=404, code="collection_not_found")
    return name


def validate_mask(mask: str) -> str:
    mask = (mask or "").strip() or DEFAULT_MASK
    if not MASK_RE.match(mask) or mask.startswith("-") or ".." in mask or mask.startswith("/"):
        raise library.LibraryError("file pattern must be a glob like **/*.md", code="bad_mask")
    return mask


# --------------------------------------------------------------------------
# Jobs
# --------------------------------------------------------------------------


def _qmd() -> str:
    binary = library.qmd_binary()
    if not binary:
        raise library.LibraryError(
            "qmd is not installed. Install it with `npm install -g @tobilu/qmd`.",
            status=503,
            code="qmd_missing",
        )
    return binary


def _submit(kind: str, collection: str, steps: list[tuple[str, list[str], float]]) -> dict[str, Any]:
    job = {
        "id": uuid.uuid4().hex[:12],
        "kind": kind,
        "collection": collection,
        "state": "queued",
        "step": steps[0][0],
        "message": "",
        "started_at": _now(),
        "finished_at": None,
    }
    with _state.lock:
        _state.jobs[job["id"]] = job
        _state.order.append(job["id"])
        while len(_state.order) > MAX_JOBS_KEPT:
            old = _state.order[0]
            if _state.jobs[old]["state"] in ("queued", "running"):
                break
            _state.order.popleft()
            _state.jobs.pop(old, None)
        _state.queue.append((job["id"], steps))
        if _state.worker is None or not _state.worker.is_alive():
            _state.worker = threading.Thread(target=_work, name="notes-search-folders", daemon=True)
            _state.worker.start()
        _state.wake.notify()
        return dict(job)


def _update(job_id: str, **fields: Any) -> None:
    with _state.lock:
        if job_id in _state.jobs:
            _state.jobs[job_id].update(fields)


def _last_line(text: str) -> str:
    # QMD draws progress with carriage returns and ANSI codes; keep the last real line.
    clean = re.sub(r"\x1b\[[0-9;?]*[A-Za-z]", "", text or "")
    lines = [ln.strip() for chunk in clean.splitlines() for ln in chunk.split("\r") if ln.strip()]
    return lines[-1][:300] if lines else ""


def _work() -> None:
    while True:
        with _state.lock:
            while not _state.queue:
                if not _state.wake.wait(timeout=300):
                    _state.worker = None
                    return
            job_id, steps = _state.queue.popleft()
        _update(job_id, state="running")
        failed = False
        for label, argv, timeout in steps:
            _update(job_id, step=label)
            try:
                proc = subprocess.run(
                    argv,
                    capture_output=True,
                    text=True,
                    timeout=timeout,
                    env=library._qmd_env(),
                    stdin=subprocess.DEVNULL,
                )
            except subprocess.TimeoutExpired:
                _update(job_id, state="failed", message=f"{label} took longer than {int(timeout // 60)} minutes")
                failed = True
                break
            except OSError as exc:
                _update(job_id, state="failed", message=f"couldn't run qmd: {exc.strerror or exc}")
                failed = True
                break
            if proc.returncode != 0:
                _update(job_id, state="failed", message=_last_line(proc.stderr) or _last_line(proc.stdout) or "qmd failed")
                failed = True
                break
            _update(job_id, message=_last_line(proc.stdout))
        library.clear_caches()
        if not failed:
            _update(job_id, state="done", step="")
        _update(job_id, finished_at=_now())


def add(body: dict[str, Any]) -> dict[str, Any]:
    path = validate_folder(str(body.get("path") or ""))
    name = validate_name(str(body.get("name") or "").strip() or slug(path.name), new=True)
    mask = validate_mask(str(body.get("mask") or ""))
    qmd = _qmd()
    argv = [qmd, "collection", "add", str(path), "--name", name]
    if mask != DEFAULT_MASK:
        argv += ["--mask", mask]
    return _submit(
        "add",
        name,
        [("Indexing files", argv, ADD_TIMEOUT), ("Building search by meaning", [qmd, "embed", "-c", name], EMBED_TIMEOUT)],
    )


def remove(name: str) -> dict[str, Any]:
    name = validate_name(name, new=False)
    return _submit("remove", name, [("Removing", [_qmd(), "collection", "remove", name], REMOVE_TIMEOUT)])


def reindex(name: str) -> dict[str, Any]:
    name = validate_name(name, new=False)
    qmd = _qmd()
    # `qmd update` has no per-collection flag, so it refreshes every folder.
    # `embed -c` then only embeds this one's changed documents.
    return _submit(
        "reindex",
        name,
        [("Re-reading files", [qmd, "update"], UPDATE_TIMEOUT), ("Building search by meaning", [qmd, "embed", "-c", name], EMBED_TIMEOUT)],
    )


def jobs() -> list[dict[str, Any]]:
    with _state.lock:
        return [dict(_state.jobs[j]) for j in reversed(_state.order) if j in _state.jobs]


# --------------------------------------------------------------------------
# Suggestions: Obsidian vaults the user has opened that aren't indexed yet
# --------------------------------------------------------------------------


def _obsidian_configs() -> list[Path]:
    home = Path.home()
    return [
        home / "Library/Application Support/obsidian/obsidian.json",
        home / ".config/obsidian/obsidian.json",
        home / ".var/app/md.obsidian.Obsidian/config/obsidian/obsidian.json",
    ]


def suggestions() -> list[dict[str, str]]:
    indexed: set[Path] = set()
    for c in _existing():
        try:
            indexed.add(Path(c["path"]).expanduser().resolve())
        except OSError:
            pass
    out: list[dict[str, str]] = []
    seen: set[Path] = set()
    for cfg in _obsidian_configs():
        try:
            data = json.loads(cfg.read_text(encoding="utf-8"))
        except (OSError, ValueError):
            continue
        vaults = data.get("vaults") if isinstance(data, dict) else None
        if not isinstance(vaults, dict):
            continue
        for v in vaults.values():
            raw = v.get("path") if isinstance(v, dict) else None
            if not isinstance(raw, str):
                continue
            try:
                p = Path(raw).expanduser().resolve()
            except OSError:
                continue
            if p in seen or p in indexed or not (p / ".obsidian").is_dir():
                continue
            seen.add(p)
            out.append({"path": str(p), "name": slug(p.name), "label": p.name, "kind": "obsidian"})
    return out[:10]


def overview() -> dict[str, Any]:
    folders = []
    for c in _existing():
        root = Path(c["path"]).expanduser()
        kind = "reflect" if (root / ".reflect").is_dir() else "obsidian" if c.get("obsidian") else "markdown"
        folders.append({"name": c["name"], "path": c["path"], "docs": c["docs"], "kind": kind})
    return {
        "folders": folders,
        "jobs": jobs(),
        "suggestions": suggestions(),
        "qmd": library.qmd_binary(),
        "index": str(library.index_path()),
        "checked_at": time.time(),
    }
