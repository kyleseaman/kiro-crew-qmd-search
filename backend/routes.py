"""Notes Search -- backend routes, served in-process by the gateway.

Declared as ``backend.routes:register_routes``. An installed app goes through
``kiro_crew/apps/route_registry.py``: the function receives an ``AppContext``,
returns ``list[AppRoute]``, paths are relative to ``/api/apps/notes-search``, and
handlers take ``(request, ctx)``.

Routes:

  GET  /status                         index path, collections, counts, qmd binary
  GET  /suggest?q=&c=&limit=           instant FTS results while typing
  GET  /deep?q=&c=&limit=              hybrid ``qmd query`` (seconds; cached)
  GET  /recent?c=&limit=               recently modified notes
  GET  /doc?c=&p=                      one document, raw markdown + metadata
  GET  /resolve?t=&c=                  a [[wikilink]] target -> (collection, path)
  GET  /backlinks?c=&p=                notes linking here
  GET  /asset?c=&p=&src=               an image the note embeds
  GET  /sessions                       chats opened from Notes Search
  POST /sessions                       {slot_key, title, docs}
  DELETE /sessions/{slot_key}          forget one (the chat itself is untouched)
  POST /seed                           {docs, question} -> first message for a chat
  GET  /folders                        indexed folders, running jobs, vault suggestions
  POST /folders                        {path, name?, mask?} -> job (qmd collection add + embed)
  POST /folders/{name}/reindex         job (qmd update + embed)
  DELETE /folders/{name}               job (qmd collection remove; files stay on disk)

Every handler hands its work to ``asyncio.to_thread``: the gateway runs every
chat session on one event loop, and a SQLite scan or a ``qmd query`` subprocess
left inline would stall all of them.
"""

from __future__ import annotations

import asyncio
import json
import logging
from functools import wraps
from pathlib import Path
from typing import Any, Awaitable, Callable

from aiohttp import web

from . import folders, library, sessions

logger = logging.getLogger("kirocrew.app.notes-search")

APP_NAME = "notes-search"
MAX_BODY = 64 * 1024

_Handler = Callable[[web.Request, Any], Awaitable[web.StreamResponse]]


def _json(payload: Any, status: int = 200) -> web.Response:
    return web.json_response(
        payload,
        status=status,
        dumps=lambda obj: json.dumps(obj, ensure_ascii=False),
        headers={"Cache-Control": "no-store"},
    )


def _guard(handler: _Handler) -> _Handler:
    """Map library errors to their status, and keep tracebacks off the wire."""

    @wraps(handler)
    async def wrapper(request: web.Request, ctx: Any) -> web.StreamResponse:
        try:
            return await handler(request, ctx)
        except library.LibraryError as exc:
            return _json({"error": str(exc), "code": exc.code}, status=exc.status)
        except web.HTTPException:
            raise
        except Exception:  # pragma: no cover - logged, never leaked
            logger.exception("notes-search %s failed", request.path)
            return _json({"error": "internal error", "code": "internal"}, status=500)

    return wrapper


def _data_dir(ctx: Any) -> str:
    directory = getattr(ctx, "data_dir", None)
    if directory:
        return str(directory)
    return str(Path(__file__).resolve().parent.parent / "data")


def _q(request: web.Request, key: str, default: str = "") -> str:
    return request.query.get(key, default)


def _int(request: web.Request, key: str, default: int) -> int:
    try:
        return int(request.query.get(key, default))
    except (TypeError, ValueError):
        return default


async def _body(request: web.Request) -> dict:
    raw = await request.content.read(MAX_BODY + 1)
    if len(raw) > MAX_BODY:
        raise library.LibraryError("body too large", status=413, code="too_large")
    if not raw:
        return {}
    try:
        parsed = json.loads(raw.decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError) as exc:
        raise library.LibraryError(f"invalid JSON body: {exc}") from exc
    if not isinstance(parsed, dict):
        raise library.LibraryError("body must be a JSON object")
    return parsed


# --------------------------------------------------------------------------


async def handle_status(request, ctx):
    return _json(await asyncio.to_thread(library.status))


async def handle_suggest(request, ctx):
    sort = "recent" if _q(request, "sort") == "recent" else "relevance"
    result = await asyncio.to_thread(
        library.suggest, _q(request, "q"), _q(request, "c") or None, _int(request, "limit", 12), sort
    )
    return _json(result)


async def handle_deep(request, ctx):
    result = await asyncio.to_thread(
        library.deep, _q(request, "q"), _q(request, "c") or None, _int(request, "limit", 12)
    )
    return _json(result)


async def handle_recent(request, ctx):
    items = await asyncio.to_thread(library.recent, _int(request, "limit", 30), _q(request, "c") or None)
    return _json({"results": items})


async def handle_doc(request, ctx):
    return _json(await asyncio.to_thread(library.document, _q(request, "c"), _q(request, "p")))


async def handle_resolve(request, ctx):
    hit = await asyncio.to_thread(library.resolve_link, _q(request, "t"), _q(request, "c") or None)
    if hit is None:
        return _json({"error": "no note with that title", "code": "link_unresolved"}, status=404)
    return _json(hit)


async def handle_backlinks(request, ctx):
    items = await asyncio.to_thread(library.backlinks, _q(request, "c"), _q(request, "p"))
    return _json({"results": items})


async def handle_asset(request, ctx):
    data, ctype = await asyncio.to_thread(
        library.asset, _q(request, "c"), _q(request, "p"), _q(request, "src")
    )
    headers = {"Cache-Control": "private, max-age=300", "X-Content-Type-Options": "nosniff"}
    if ctype == "image/svg+xml":
        # An SVG is a document that can carry script. Served as an <img> it cannot
        # run, but opened directly it could, so it gets a sandboxing CSP.
        headers["Content-Security-Policy"] = "default-src 'none'; style-src 'unsafe-inline'; sandbox"
    return web.Response(body=data, content_type=ctype, headers=headers)


async def handle_sessions_list(request, ctx):
    return _json({"sessions": await asyncio.to_thread(sessions.load, _data_dir(ctx))})


async def handle_sessions_record(request, ctx):
    body = await _body(request)
    return _json(await asyncio.to_thread(sessions.record, _data_dir(ctx), body))


async def handle_sessions_forget(request, ctx):
    key = request.match_info.get("slot_key", "")
    ok = await asyncio.to_thread(sessions.forget, _data_dir(ctx), key)
    return _json({"forgotten": ok}, status=200 if ok else 404)


async def handle_seed(request, ctx):
    body = await _body(request)
    return _json(await asyncio.to_thread(sessions.seed, body))


async def handle_folders(request, ctx):
    return _json(await asyncio.to_thread(folders.overview))


async def handle_folders_add(request, ctx):
    body = await _body(request)
    return _json(await asyncio.to_thread(folders.add, body), status=202)


async def handle_folders_reindex(request, ctx):
    return _json(await asyncio.to_thread(folders.reindex, request.match_info.get("name", "")), status=202)


async def handle_folders_remove(request, ctx):
    return _json(await asyncio.to_thread(folders.remove, request.match_info.get("name", "")), status=202)


ROUTE_TABLE: list[tuple[str, str, _Handler]] = [
    ("GET", "/status", handle_status),
    ("GET", "/suggest", handle_suggest),
    ("GET", "/deep", handle_deep),
    ("GET", "/recent", handle_recent),
    ("GET", "/doc", handle_doc),
    ("GET", "/resolve", handle_resolve),
    ("GET", "/backlinks", handle_backlinks),
    ("GET", "/asset", handle_asset),
    ("GET", "/sessions", handle_sessions_list),
    ("POST", "/sessions", handle_sessions_record),
    ("DELETE", "/sessions/{slot_key}", handle_sessions_forget),
    ("POST", "/seed", handle_seed),
    ("GET", "/folders", handle_folders),
    ("POST", "/folders", handle_folders_add),
    ("POST", "/folders/{name}/reindex", handle_folders_reindex),
    ("DELETE", "/folders/{name}", handle_folders_remove),
]


def register_routes(ctx: Any) -> list:
    from kiro_crew.apps.route_registry import AppRoute

    routes = [AppRoute(method=m, path=p, handler=_guard(h)) for m, p, h in ROUTE_TABLE]
    logger.info("notes-search returning %d routes (index: %s)", len(routes), library.index_path())
    return routes
