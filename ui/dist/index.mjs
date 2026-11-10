import { jsx as s, Fragment as Jt, jsxs as h } from "react/jsx-runtime";
import { useState as P, useRef as et, useEffect as Ce, useCallback as de, forwardRef as Br, useMemo as Fn, useLayoutEffect as Hr } from "react";
import { useAppApi as Wr, useNavigate as Gr, ChatEmbed as jr, useTheme as Zr } from "@kirocrew/app-sdk";
import Kr from "lucide-react";
const Yr = `
.lib {
  --surface: var(--card);
  --raised: var(--bg-elevated);
  --sunk: var(--bg-accent);
  --faint: color-mix(in srgb, var(--muted) 70%, var(--bg));
  --accent-text: var(--accent);
  --accent-strong: var(--accent-hover);
  --accent-fill: var(--accent);
  --accent-fill-hover: var(--accent-hover);
  --accent-on: var(--accent-fg);
  --accent-tint: var(--accent-subtle);
  --accent-tint-text: var(--text-strong);
  --sage: var(--ok);
  --sage-text: var(--accent);
  --sage-tint: var(--ok-subtle);
  --sage-tint-text: var(--text-strong);
  --warn-tint: var(--warn-subtle);
  --hit: var(--search-highlight);
  --hit-active: var(--search-highlight-current);
  --hit-text: var(--text-strong);
  --hl: color-mix(in srgb, var(--warn) 28%, transparent);
  --hl-text: var(--text-strong);
  --divider: var(--border);
  --divider-soft: color-mix(in srgb, var(--border) 60%, transparent);
  --hover: var(--bg-hover);
  --press: var(--border-strong);
  --code-bg: var(--bg-hover);

  --font-display: var(--font-body);
  --font-mono: var(--mono);

  --r-sm: 10px;
  --r-md: 16px;
  --r-lg: 24px;

  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-body);
  font-size: 14px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

.lib *, .lib *::before, .lib *::after { box-sizing: border-box; }
.lib ::selection { background: color-mix(in srgb, var(--accent) 32%, transparent); }
.lib :focus { outline: none; }
.lib :focus-visible { outline: 2px solid var(--accent-text); outline-offset: 2px; }
.lib :where(button) { font: inherit; color: inherit; }
.lib ::-webkit-scrollbar { width: 10px; height: 10px; }
.lib ::-webkit-scrollbar-thumb { background: var(--divider); border-radius: 999px; border: 3px solid transparent; background-clip: padding-box; }
.lib ::-webkit-scrollbar-thumb:hover { background: var(--faint); background-clip: padding-box; border: 3px solid transparent; }
.lib ::-webkit-scrollbar-track { background: transparent; }

/* ───────────── frame ───────────── */
.lib-frame {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: var(--left, 380px) minmax(0, 1fr) var(--right, 0px);
  transition: grid-template-columns .22s ease;
}
.lib-frame[data-chat="open"] { --right: clamp(360px, 32vw, 520px); }
.lib-frame[data-left="closed"] { --left: 0px; }
@media (max-width: 1100px) {
  .lib-frame { --left: 320px; }
  .lib-frame[data-chat="open"] { --right: 380px; }
}
@media (max-width: 860px) {
  .lib-frame, .lib-frame[data-chat="open"] { grid-template-columns: minmax(0, 1fr); }
  .lib-frame > .lib-left { display: var(--show-left, flex); }
  .lib-frame > .lib-center { display: var(--show-center, none); }
  .lib-frame > .lib-right { display: var(--show-right, none); }
}

/* ───────────── left: search ───────────── */
.lib-left {
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--divider-soft);
  background: var(--bg);
  overflow: hidden;
}
.lib-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 18px 20px 10px;
}
.lib-logo {
  width: 26px;
  height: 26px;
  flex: none;
  border-radius: 7px;
  background: var(--accent-subtle);
  color: var(--accent);
  display: grid;
  place-items: center;
}
.lib-brand h1 {
  font-family: var(--font-display);
  font-weight: 650;
  font-size: 16px;
  letter-spacing: -0.005em;
  line-height: 1;
  margin: 0;
}
.lib-brand .lib-meta { margin-left: auto; text-align: right; line-height: 1.3; }

.lib-search {
  margin: 4px 16px 10px;
  position: relative;
}
.lib-search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 48px;
  padding: 0 8px 0 16px;
  border-radius: 999px;
  background: var(--raised);
  box-shadow: var(--shadow-sm);
  border: 1.5px solid transparent;
  transition: border-color .15s, box-shadow .15s;
}
.lib-search-box:focus-within { border-color: var(--accent-text); box-shadow: var(--shadow-md); }
.lib-search-box svg { color: var(--muted); flex: none; }
.lib-search-box input {
  flex: 1;
  min-width: 0;
  border: 0;
  background: transparent;
  color: var(--text);
  caret-color: var(--accent-text);
  font: inherit;
  font-size: 15.5px;
  font-weight: 500;
  padding: 10px 0;
}
.lib-search-box input::placeholder { color: var(--muted); font-weight: 400; }
.lib-search-box input:focus-visible { outline: none; }
.lib-kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  border-radius: 6px;
  border: 1.5px solid var(--divider);
  color: var(--muted);
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
  font-family: var(--font-body);
  white-space: nowrap;
}

.lib-filters {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  padding: 0 18px 8px;
}
.lib-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid var(--divider);
  background: transparent;
  color: var(--text);
  border-radius: 999px;
  padding: 4px 11px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}
.lib-chip:hover { background: var(--hover); }
.lib-chip[aria-pressed="true"] { background: var(--accent-fill); border-color: var(--accent-fill); color: var(--accent-on); }
.lib-chip .lib-count { font-variant-numeric: tabular-nums; opacity: .7; font-weight: 700; }

.lib-sortbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 18px 8px;
}
.lib-seg {
  display: inline-flex;
  padding: 2px;
  gap: 2px;
  border-radius: 999px;
  background: var(--surface);
  border: 1px solid var(--divider-soft);
}
.lib-seg-opt {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border: 0;
  background: transparent;
  color: var(--muted);
  border-radius: 999px;
  padding: 3px 11px;
  font-size: 12px;
  font-weight: 650;
  cursor: pointer;
}
.lib-seg-opt:hover { color: var(--text); background: var(--hover); }
.lib-seg-opt[aria-checked="true"] { background: var(--raised); color: var(--text); box-shadow: var(--shadow-sm); }

.lib-results {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 2px 10px 18px;
  scroll-padding: 60px 0;
}
.lib-section {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 10px 6px;
  font-size: 11px;
  letter-spacing: .09em;
  text-transform: uppercase;
  font-weight: 700;
  color: var(--sage-text);
}
.lib-section .lib-meta-sm { text-transform: none; letter-spacing: 0; font-weight: 500; margin-left: auto; }

.lib-hit {
  position: relative;
  display: grid;
  grid-template-columns: 22px minmax(0, 1fr);
  gap: 2px 10px;
  width: 100%;
  text-align: left;
  border: 0;
  background: transparent;
  border-radius: var(--r-md);
  padding: 10px 12px 11px 8px;
  cursor: pointer;
  color: var(--text);
  scroll-margin: 8px;
}
.lib-hit:hover { background: var(--hover); }
.lib-hit[aria-selected="true"] { background: var(--accent-subtle); }
.lib-hit-icon { grid-row: 1 / span 3; color: var(--faint); padding-top: 2px; display: flex; justify-content: center; }
.lib-hit[aria-selected="true"] .lib-hit-icon { color: var(--accent-text); }
.lib-hit-title {
  font-weight: 650;
  font-size: 14.5px;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 6px;
}
.lib-hit-title > span:first-child { overflow: hidden; text-overflow: ellipsis; }
.lib-hit-path {
  font-size: 12px;
  color: var(--muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.lib-hit-snippet {
  font-size: 13px;
  line-height: 1.5;
  color: var(--muted);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-top: 3px;
}
.lib-hit-snippet mark, .lib-hit-title mark {
  background: var(--hit);
  color: var(--hit-text);
  border-radius: 4px;
  padding: 0 2px;
  margin: 0 -1px;
}
.lib-hit-title mark { background: transparent; color: var(--accent-text); padding: 0; margin: 0; }
.lib-snip-link {
  color: var(--accent-text);
  font-weight: 600;
  text-decoration: underline;
  text-decoration-color: color-mix(in srgb, var(--accent-text) 35%, transparent);
  text-decoration-thickness: 1.5px;
  text-underline-offset: 3px;
  cursor: pointer;
}
.lib-snip-link:hover { text-decoration-color: currentColor; }
.lib-snip-link[data-hit="true"] { font-weight: 750; text-decoration-color: currentColor; }
.lib-check {
  position: absolute;
  right: 10px;
  top: 10px;
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 1.5px solid var(--border-strong);
  background: var(--raised);
  color: var(--accent-on);
  display: grid;
  place-items: center;
  cursor: pointer;
  padding: 0;
  opacity: 0;
  transition: opacity .12s;
}
.lib-hit:hover .lib-check, .lib-check:focus-visible, .lib-results[data-picking="true"] .lib-check { opacity: 1; }
.lib-check:focus-visible { outline-offset: 1px; }
.lib-check[aria-checked="true"] { background: var(--accent); border-color: var(--accent); color: var(--accent-fg); opacity: 1; }
.lib-hit:has(.lib-check) .lib-hit-title { padding-right: 26px; }

.lib-deep-row {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  border: 1.5px dashed var(--divider);
  background: transparent;
  color: var(--text);
  border-radius: var(--r-md);
  padding: 10px 12px;
  margin: 6px 0 2px;
  cursor: pointer;
  text-align: left;
  font-size: 13px;
}
.lib-deep-row:hover { background: var(--hover); border-color: var(--sage); }
.lib-deep-row[aria-busy="true"] { cursor: progress; border-style: solid; border-color: var(--sage); }
.lib-deep-row svg { color: var(--sage-text); flex: none; }
.lib-deep-row .lib-grow > b { font-weight: 650; }

.lib-tray {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 12px 12px;
  padding: 8px 8px 8px 16px;
  border-radius: 999px;
  background: var(--text);
  color: var(--bg);
  box-shadow: var(--shadow-lg);
  font-size: 13px;
  font-weight: 600;
  animation: lib-rise .18s ease;
}
.lib-tray .lib-btn-quiet { color: color-mix(in srgb, var(--bg) 75%, transparent); }
.lib-tray .lib-btn-quiet:hover { color: var(--bg); background: color-mix(in srgb, var(--bg) 12%, transparent); }
@keyframes lib-rise { from { transform: translateY(8px); opacity: 0; } to { transform: none; opacity: 1; } }

/* ───────────── buttons & small parts ───────────── */
.lib-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  border: 1px solid transparent;
  background: transparent;
  color: var(--text);
  border-radius: 999px;
  padding: 7px 14px;
  font-size: 13px;
  font-weight: 650;
  line-height: 1.2;
  white-space: nowrap;
  text-decoration: none;
  transition: background .12s, border-color .12s, color .12s;
}
.lib-btn:disabled { opacity: .45; cursor: not-allowed; }
.lib-btn svg { flex: none; }
.lib-btn-primary { background: var(--accent-fill); color: var(--accent-on); }
.lib-btn-primary:hover:not(:disabled) { background: var(--accent-fill-hover); }
.lib-btn-secondary { border-color: var(--divider); }
.lib-btn-secondary:hover:not(:disabled) { background: var(--hover); }
.lib-btn-quiet { color: var(--muted); padding: 6px 9px; }
.lib-btn-quiet:hover:not(:disabled) { background: var(--hover); color: var(--text); }
.lib-btn-quiet[aria-pressed="true"] { color: var(--accent-text); background: var(--hover); }
.lib-btn-sm { padding: 4px 10px; font-size: 12px; }
.lib-btn-icon { padding: 7px; border-radius: 999px; }
.lib-tray .lib-btn-primary { background: var(--accent); color: var(--accent-fg); }

.lib-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11.5px;
  font-weight: 650;
  padding: 2px 9px;
  border-radius: 999px;
  white-space: nowrap;
  background: var(--sage-tint);
  color: var(--sage-tint-text);
}
.lib-tag-warn { background: var(--accent-tint); color: var(--accent-tint-text); }
.lib-meta { font-size: 12.5px; color: var(--muted); }
.lib-meta-sm { font-size: 11.5px; color: var(--muted); }
.lib-grow { flex: 1; min-width: 0; }
.lib-row { display: flex; align-items: center; gap: 8px; min-width: 0; }
.lib-ell { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.lib-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
.lib-spin { animation: lib-spin 1s linear infinite; }
@keyframes lib-spin { to { transform: rotate(360deg); } }
.lib-dot { width: 7px; height: 7px; border-radius: 999px; background: var(--faint); flex: none; }
.lib-dot[data-live="true"] { background: var(--sage); box-shadow: 0 0 0 3px color-mix(in srgb, var(--sage) 25%, transparent); animation: lib-pulse 1.6s ease-in-out infinite; }
@keyframes lib-pulse { 50% { box-shadow: 0 0 0 6px color-mix(in srgb, var(--sage) 0%, transparent); } }

.lib-empty {
  margin: 10px;
  padding: 22px 20px;
  border-radius: var(--r-lg);
  background: var(--surface);
  color: var(--text);
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.lib-empty h3 { margin: 0; font-size: 15px; font-weight: 700; }
.lib-empty p { margin: 0; color: var(--muted); font-size: 13px; }
.lib-empty code, .lib-alert code { font-family: var(--font-mono); font-size: 12px; background: var(--raised); padding: 1px 6px; border-radius: 6px; }

.lib-alert {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 11px 14px;
  border-radius: var(--r-md);
  background: var(--accent-tint);
  color: var(--accent-tint-text);
  font-size: 13px;
}
.lib-alert-quiet { background: var(--surface); color: var(--text); }
.lib-alert-error { background: var(--danger-subtle); color: var(--text); box-shadow: inset 3px 0 0 var(--danger); }
.lib-alert-error svg { color: var(--danger); }
.lib-alert svg { flex: none; margin-top: 1px; }

/* ───────────── center: reader ───────────── */
.lib-center {
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: var(--raised);
  position: relative;
}
.lib-tabs {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  padding: 10px 10px 0;
  background: var(--bg);
  border-bottom: 1px solid var(--divider-soft);
  overflow-x: auto;
  scrollbar-width: none;
  min-height: 48px;
  flex: none;
}
.lib-tabs::-webkit-scrollbar { display: none; }
.lib-tab {
  display: flex;
  align-items: center;
  gap: 7px;
  max-width: 240px;
  min-width: 0;
  padding: 8px 8px 9px 13px;
  border-radius: 12px 12px 0 0;
  border: 0;
  background: transparent;
  color: var(--muted);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  position: relative;
  flex: none;
}
.lib-tab:hover { background: var(--hover); color: var(--text); }
.lib-tab[aria-selected="true"] { background: var(--raised); color: var(--text); box-shadow: 0 -1px 0 var(--divider-soft), 1px 0 0 var(--divider-soft), -1px 0 0 var(--divider-soft); }
.lib-tab[aria-selected="true"]::after { content: ""; position: absolute; left: 0; right: 0; bottom: -1px; height: 2px; background: var(--raised); }
.lib-tab[data-preview="true"] > .lib-ell { font-style: italic; }
.lib-tab-x {
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  border-radius: 6px;
  opacity: .55;
  flex: none;
}
.lib-tab-x:hover { background: var(--press); opacity: 1; }
.lib-tabs-end { margin-left: auto; display: flex; gap: 2px; align-items: center; padding-bottom: 6px; flex: none; }

.lib-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  container-type: inline-size;
  scroll-behavior: smooth;
}
.lib-doc {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 0 40px;
  max-width: 1180px;
  margin: 0 auto;
  padding: 40px 56px 160px;
}
@container (min-width: 1040px) {
  .lib-doc { grid-template-columns: minmax(0, 1fr) 220px; }
  .lib-outline { display: block !important; }
  .lib-outline-toggle { display: none !important; }
}
@container (max-width: 640px) {
  .lib-doc { padding: 24px 22px 160px; }
}
.lib-article { min-width: 0; max-width: 74ch; width: 100%; justify-self: center; }

.lib-crumbs {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
  font-size: 12.5px;
  color: var(--muted);
  margin-bottom: 14px;
}
.lib-crumbs svg { opacity: .6; }
.lib-title {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(28px, 4.2cqi, 42px);
  line-height: 1.1;
  letter-spacing: -0.015em;
  margin: 0 0 14px;
  text-wrap: balance;
}
.lib-docmeta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px 14px;
  font-size: 13px;
  color: var(--muted);
}
.lib-docmeta > span { display: inline-flex; align-items: center; gap: 5px; }
.lib-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  margin: 18px 0 8px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--divider-soft);
}
.lib-props {
  display: grid;
  grid-template-columns: max-content minmax(0, 1fr);
  gap: 4px 16px;
  margin: 14px 0 0;
  padding: 12px 16px;
  border-radius: var(--r-md);
  background: var(--surface);
  font-size: 13px;
}
.lib-props dt { color: var(--muted); font-weight: 600; }
.lib-props dd { margin: 0; overflow-wrap: anywhere; }

.lib-outline { display: none; position: sticky; top: 24px; align-self: start; max-height: calc(100vh - 160px); overflow-y: auto; padding: 6px 0 20px; }
.lib-outline h4 { margin: 0 0 8px 12px; font-size: 11px; letter-spacing: .09em; text-transform: uppercase; color: var(--sage-text); }
.lib-outline a {
  display: block;
  padding: 4px 10px 4px 12px;
  border-left: 2px solid var(--divider-soft);
  color: var(--muted);
  text-decoration: none;
  font-size: 12.5px;
  line-height: 1.35;
}
.lib-outline a[data-depth="3"] { padding-left: 24px; font-size: 12px; }
.lib-outline a[data-depth="4"] { padding-left: 34px; font-size: 12px; }
.lib-outline a:hover { color: var(--text); border-left-color: var(--faint); }
.lib-outline a[aria-current="true"] { color: var(--accent-text); border-left-color: var(--accent); font-weight: 650; }

.lib-findbar {
  position: sticky;
  top: 12px;
  z-index: 3;
  float: right;
  display: flex;
  align-items: center;
  gap: 4px;
  margin: -6px -20px 0 0;
  padding: 4px 4px 4px 12px;
  border-radius: 999px;
  background: var(--bg);
  box-shadow: var(--shadow-md);
  font-size: 12px;
  font-weight: 650;
  color: var(--muted);
}

/* — prose — */
.lib-prose { font-size: 16px; line-height: 1.72; color: var(--text); overflow-wrap: break-word; }
.lib-prose > :first-child { margin-top: 0; }
.lib-prose p, .lib-prose ul, .lib-prose ol, .lib-prose blockquote, .lib-prose pre, .lib-prose table, .lib-prose dl { margin: 0 0 1.05em; }
.lib-prose h1, .lib-prose h2, .lib-prose h3, .lib-prose h4, .lib-prose h5, .lib-prose h6 {
  line-height: 1.25;
  margin: 1.9em 0 .6em;
  scroll-margin-top: 24px;
  letter-spacing: -0.012em;
  position: relative;
}
.lib-prose h1 { font-family: var(--font-display); font-weight: 700; font-size: 1.85em; }
.lib-prose h2 { font-family: var(--font-display); font-weight: 700; font-size: 1.45em; }
.lib-prose h3 { font-size: 1.16em; font-weight: 750; }
.lib-prose h4 { font-size: 1em; font-weight: 750; }
.lib-prose h5, .lib-prose h6 { font-size: .86em; font-weight: 750; text-transform: uppercase; letter-spacing: .06em; color: var(--muted); }
.lib-prose .lib-anchor { position: absolute; left: -1.1em; opacity: 0; color: var(--faint); text-decoration: none; font-family: var(--font-body); font-weight: 500; }
.lib-prose :is(h1,h2,h3,h4):hover .lib-anchor { opacity: 1; }
.lib-prose a { color: var(--accent-text); text-decoration: underline; text-decoration-color: color-mix(in srgb, var(--accent-text) 35%, transparent); text-underline-offset: 3px; text-decoration-thickness: 1.5px; }
.lib-prose a:hover { text-decoration-color: currentColor; }
.lib-prose a.lib-wikilink { text-decoration-style: solid; font-weight: 600; }
.lib-prose a.lib-wikilink[data-broken="true"] { color: var(--muted); text-decoration-style: dashed; cursor: help; }
.lib-prose .lib-ptag {
  display: inline-block;
  font-size: .8em;
  font-weight: 650;
  line-height: 1.5;
  padding: 0 .55em;
  border-radius: 999px;
  background: var(--sage-tint);
  color: var(--sage-tint-text);
  cursor: pointer;
  vertical-align: .08em;
}
.lib-prose .lib-ptag:hover { filter: brightness(.96); }
.lib-prose strong { font-weight: 720; }
.lib-prose ul, .lib-prose ol { padding-left: 1.4em; }
.lib-prose li { margin: .25em 0; }
.lib-prose li::marker { color: var(--faint); }
.lib-prose li > ul, .lib-prose li > ol { margin: .25em 0 .4em; }
.lib-prose li:has(> input[type="checkbox"]) { list-style: none; margin-left: -1.3em; }
.lib-prose input[type="checkbox"] { accent-color: var(--sage); margin: 0 .5em 0 0; transform: translateY(1px); }
.lib-prose blockquote {
  margin-left: 0;
  padding: .2em 0 .2em 1.1em;
  border-left: 3px solid var(--accent);
  color: var(--muted);
  font-style: italic;
}
.lib-prose blockquote > :last-child { margin-bottom: 0; }
.lib-prose code {
  font-family: var(--font-mono);
  font-size: .86em;
  background: var(--code-bg);
  padding: .12em .4em;
  border-radius: 6px;
}
.lib-prose pre {
  position: relative;
  background: var(--code-bg);
  border-radius: var(--r-md);
  padding: 14px 16px;
  overflow-x: auto;
  font-size: 13.5px;
  line-height: 1.6;
}
.lib-prose pre code { background: transparent; padding: 0; font-size: inherit; }
.lib-prose pre .lib-copy {
  position: absolute;
  top: 8px;
  right: 8px;
  opacity: 0;
  border: 1px solid var(--divider);
  background: var(--raised);
  color: var(--muted);
  border-radius: 8px;
  font-size: 11px;
  font-weight: 650;
  padding: 3px 8px;
  cursor: pointer;
  font-family: var(--font-body);
}
.lib-prose pre:hover .lib-copy { opacity: 1; }
.lib-prose hr { border: 0; height: 1px; background: var(--divider); margin: 2.2em 0; }
.lib-prose img { max-width: 100%; height: auto; border-radius: var(--r-md); box-shadow: var(--shadow-sm); }
.lib-prose table { border-collapse: collapse; width: 100%; font-size: .9em; display: block; overflow-x: auto; }
.lib-prose th, .lib-prose td { padding: 7px 12px; text-align: left; vertical-align: top; border-bottom: 1px solid var(--divider-soft); }
.lib-prose th { font-weight: 700; border-bottom: 1.5px solid var(--divider); white-space: nowrap; }
.lib-prose tr:hover td { background: var(--hover); }
.lib-prose mark.lib-find { background: var(--hit); color: var(--hit-text); border-radius: 3px; padding: 0 1px; }
.lib-prose mark.lib-find[data-active="true"] { background: var(--hit-active); color: #000; box-shadow: 0 0 0 2px var(--hit-active); }
.lib-prose .lib-embed-missing { color: var(--muted); font-size: .9em; font-style: italic; }
.lib-prose mark.lib-hl { background: var(--hl); color: var(--hl-text); border-radius: 3px; padding: 0 .15em; }
.lib-prose .lib-block { display: none; }
.lib-prose [data-flash="true"] { animation: lib-flash 1.6s ease-out 1; border-radius: 6px; }
@keyframes lib-flash { from { background: var(--hit); } to { background: transparent; } }
@media (prefers-reduced-motion: reduce) { .lib-prose [data-flash="true"] { animation: none; outline: 2px solid var(--hit-active); outline-offset: 2px; } }

.lib-prose .lib-callout {
  --co: var(--accent);
  margin: 0 0 1.05em;
  padding: 10px 14px;
  border-left: 3px solid var(--co);
  border-radius: 0 var(--r-sm) var(--r-sm) 0;
  background: color-mix(in srgb, var(--co) 9%, transparent);
  color: var(--text);
}
.lib-prose .lib-callout[data-tone="sage"] { --co: var(--sage); }
.lib-prose .lib-callout[data-tone="danger"] { --co: var(--danger); }
.lib-prose .lib-callout-title { display: flex; align-items: center; gap: 8px; font-weight: 720; }
.lib-prose .lib-callout-title::before { content: ""; flex: none; width: 8px; height: 8px; border-radius: 50%; background: var(--co); }
.lib-prose summary.lib-callout-title { cursor: pointer; list-style: none; }
.lib-prose summary.lib-callout-title::-webkit-details-marker { display: none; }
.lib-prose summary.lib-callout-title::after { content: "›"; margin-left: auto; color: var(--muted); font-size: 1.15em; line-height: 1; transition: transform .15s; }
.lib-prose details.lib-callout[open] > summary.lib-callout-title::after { transform: rotate(90deg); }
.lib-prose .lib-callout-body { margin-top: 6px; }
.lib-prose .lib-callout-body > :last-child { margin-bottom: 0; }

.lib-prose .lib-embed {
  display: block;
  margin: .5em 0 1.05em;
  padding: 10px 16px 12px;
  border-left: 2px solid var(--divider);
  border-radius: 0 var(--r-sm) var(--r-sm) 0;
  background: var(--hover);
}
.lib-prose .lib-embed-head { display: block; font-size: .8em; margin-bottom: 4px; }
.lib-prose .lib-embed-body { display: block; }
.lib-prose .lib-embed-body > :last-child { margin-bottom: 0; }
.lib-prose .lib-embed-body > :first-child { margin-top: 0; }
.lib-prose .lib-embed-loading { color: var(--faint); font-size: .9em; }
.lib-prose .lib-embed .lib-anchor { display: none; }
.lib-actions a.lib-btn { text-decoration: none; }

.lib-backlinks { margin-top: 56px; padding-top: 22px; border-top: 1px solid var(--divider-soft); }
.lib-backlinks h3 { margin: 0 0 10px; font-size: 13px; letter-spacing: .06em; text-transform: uppercase; color: var(--sage-text); }
.lib-backlink {
  display: block;
  width: 100%;
  text-align: left;
  border: 0;
  border-radius: var(--r-md);
  padding: 10px 14px;
  background: var(--surface);
  margin-bottom: 8px;
  cursor: pointer;
  color: var(--text);
}
.lib-backlink:hover { box-shadow: var(--shadow-sm); filter: brightness(1.015); }
.lib-backlink b { font-weight: 650; font-size: 14px; }
.lib-backlink .lib-hit-snippet mark { background: transparent; color: var(--accent-text); font-weight: 650; padding: 0; }

/* — the floating ask bar — */
.lib-ask {
  position: absolute;
  left: 50%;
  bottom: 22px;
  transform: translateX(-50%);
  width: min(720px, calc(100% - 48px));
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 7px 7px 7px 18px;
  border-radius: 26px;
  background: var(--bg);
  border: 1.5px solid var(--divider);
  box-shadow: var(--shadow-lg);
  z-index: 5;
  transition: border-color .15s;
}
.lib-ask:focus-within { border-color: var(--accent-text); }
.lib-ask > svg { color: var(--accent-text); margin-bottom: 11px; flex: none; }
.lib-ask textarea {
  flex: 1;
  min-width: 0;
  border: 0;
  resize: none;
  background: transparent;
  color: var(--text);
  caret-color: var(--accent-text);
  font: inherit;
  font-size: 14.5px;
  line-height: 1.45;
  padding: 9px 0;
  max-height: 160px;
}
.lib-ask textarea::placeholder { color: var(--muted); }
.lib-ask textarea:focus-visible { outline: none; }
.lib-ask .lib-btn { margin-bottom: 1px; }

.lib-welcome {
  max-width: 640px;
  margin: 0 auto;
  padding: 12vh 32px 40px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.lib-welcome h2 { font-family: var(--font-display); font-weight: 700; font-size: 36px; line-height: 1.1; margin: 0; letter-spacing: -0.015em; }
.lib-welcome p { margin: 0; color: var(--muted); font-size: 15px; line-height: 1.6; }
.lib-keys { display: grid; grid-template-columns: max-content 1fr; gap: 8px 14px; align-items: center; font-size: 13px; margin-top: 8px; color: var(--text); }
.lib-keys > span:nth-child(odd) { display: flex; gap: 4px; }
.lib-stats { display: flex; gap: 10px; flex-wrap: wrap; }
.lib-stat { background: var(--surface); border-radius: var(--r-md); padding: 12px 16px; min-width: 120px; }
.lib-stat b { display: block; font-size: 22px; font-weight: 750; font-variant-numeric: tabular-nums; letter-spacing: -0.02em; }
.lib-stat span { font-size: 12px; color: var(--muted); }

/* ───────────── folders ───────────── */
.lib-folders { display: flex; flex-direction: column; gap: 18px; }
.lib-folders section { display: flex; flex-direction: column; gap: 6px; }
.lib-folders code, .lib-folder-form code { font-family: var(--font-mono); font-size: .92em; background: var(--code-bg); padding: .05em .35em; border-radius: 5px; }
.lib-folder {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: var(--r-sm);
  background: var(--surface);
  border: 1px solid var(--divider-soft);
}
.lib-folder-path { font-family: var(--font-mono); font-size: 12px; color: var(--muted); margin-top: 2px; }
.lib-folder-job { display: flex; align-items: center; gap: 6px; margin-top: 6px; font-size: 12.5px; color: var(--text); }
.lib-folder-job svg { flex: none; color: var(--accent-text); }
.lib-folder-confirm { display: flex; flex-direction: column; gap: 8px; margin-top: 8px; font-size: 13px; }
.lib-folder-form { display: flex; flex-direction: column; gap: 8px; }
.lib-field { display: flex; flex-direction: column; gap: 4px; font-size: 12px; font-weight: 650; color: var(--muted); }
.lib-field input {
  font: inherit;
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 400;
  color: var(--text);
  background: var(--raised);
  border: 1px solid var(--divider);
  border-radius: var(--r-sm);
  padding: 8px 10px;
  caret-color: var(--accent-text);
}
.lib-field input::placeholder { color: var(--faint); }
.lib-field input:focus { border-color: var(--accent-text); }
.lib-cmd { font-family: var(--font-mono); font-size: 12.5px; background: var(--code-bg); border-radius: var(--r-sm); padding: 8px 10px; margin: 8px 0 0; white-space: pre-wrap; user-select: all; }
.lib-btn-danger { background: var(--danger); color: var(--danger-fg); }
.lib-btn-danger:hover:not(:disabled) { filter: brightness(1.08); }
.lib-welcome-folders { margin-top: 4px; }
.lib-welcome-quiet { gap: 14px; padding-top: 16vh; max-width: 560px; }
.lib-welcome-quiet h2 { font-size: 26px; letter-spacing: -0.01em; margin-top: -6px; }
.lib-welcome-quiet p { font-size: 14.5px; }
.lib-keyline { display: flex; flex-wrap: wrap; gap: 6px 18px; font-size: 12.5px; color: var(--muted); margin-top: 6px; }
.lib-keyline .lib-kbd { margin-right: 4px; }
.lib-folders-foot { line-height: 1.6; }

.lib-skeleton { display: flex; flex-direction: column; gap: 12px; }
.lib-skeleton i { display: block; height: 14px; border-radius: 8px; background: linear-gradient(90deg, var(--surface), var(--sunk), var(--surface)); background-size: 300% 100%; animation: lib-shimmer 1.4s ease infinite; }
@keyframes lib-shimmer { from { background-position: 100% 0; } to { background-position: -100% 0; } }

/* ───────────── right: chat ───────────── */
.lib-right {
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--divider-soft);
  background: var(--bg);
  overflow: hidden;
}
.lib-chathead {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 10px 8px 8px 14px;
  border-bottom: 1px solid var(--divider-soft);
  min-height: 48px;
  flex: none;
}
.lib-chathead h2 { margin: 0; font-size: 14px; font-weight: 750; }
.lib-chattabs {
  display: flex;
  gap: 4px;
  padding: 8px 10px;
  overflow-x: auto;
  scrollbar-width: none;
  flex: none;
  border-bottom: 1px solid var(--divider-soft);
}
.lib-chattabs::-webkit-scrollbar { display: none; }
.lib-chattab {
  display: flex;
  align-items: center;
  gap: 7px;
  max-width: 200px;
  padding: 5px 6px 5px 10px;
  border-radius: 999px;
  border: 1px solid var(--divider);
  background: transparent;
  color: var(--muted);
  font-size: 12.5px;
  font-weight: 650;
  cursor: pointer;
  flex: none;
}
.lib-chattab:hover { color: var(--text); background: var(--hover); }
.lib-chattab[aria-selected="true"] { background: var(--raised); color: var(--text); border-color: transparent; box-shadow: var(--shadow-sm); }
.lib-context {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  align-items: center;
  padding: 8px 14px;
  font-size: 12px;
  color: var(--muted);
  border-bottom: 1px solid var(--divider-soft);
  flex: none;
}
.lib-docchip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  max-width: 220px;
  border: 0;
  background: var(--surface);
  color: var(--text);
  border-radius: 999px;
  padding: 3px 10px 3px 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}
.lib-docchip:hover { background: var(--sunk); }
.lib-docchip svg { color: var(--accent-text); flex: none; }
.lib-chatbody { flex: 1; min-height: 0; display: flex; flex-direction: column; }
.lib-chatbody > div { flex: 1; min-height: 0; }
/* The embedded chat is the host's component in the host's tokens. Its composer
   gets this page's pill so the drawer reads as part of Notes Search. */
.lib-chatbody input[type="text"], .lib-chatbody textarea {
  background: var(--raised) !important;
  color: var(--text) !important;
  border: 1.5px solid var(--divider) !important;
  border-radius: 20px !important;
  font-family: var(--font-body) !important;
  font-size: 14px !important;
  padding-left: 14px !important;
}
.lib-chatbody input[type="text"]:focus-visible, .lib-chatbody textarea:focus-visible { border-color: var(--accent-text) !important; }
.lib-chatbody .prose, .lib-chatbody [class*="markdown"] { font-family: var(--font-body); }

.lib-convos { flex: 1; min-height: 0; overflow-y: auto; padding: 8px 10px 20px; }
.lib-convo {
  display: flex;
  flex-direction: column;
  gap: 3px;
  width: 100%;
  text-align: left;
  border: 0;
  background: transparent;
  color: var(--text);
  border-radius: var(--r-md);
  padding: 10px 12px;
  cursor: pointer;
}
.lib-convo:hover { background: var(--hover); }
.lib-convo b { font-size: 13.5px; font-weight: 650; }

.lib-toast {
  position: absolute;
  left: 50%;
  top: 14px;
  transform: translateX(-50%);
  z-index: 30;
  background: var(--text);
  color: var(--bg);
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  box-shadow: var(--shadow-lg);
  animation: lib-rise .18s ease;
  max-width: calc(100% - 40px);
}
.lib-toast[data-kind="error"] { background: var(--accent-tint); color: var(--accent-tint-text); }

@media (prefers-reduced-motion: reduce) {
  .lib *, .lib *::before, .lib *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; }
}
`;
function G(t) {
  const e = Kr[t];
  return e || (({ size: i = 16 }) => /* @__PURE__ */ s("span", { "aria-hidden": "true", "data-missing-icon": t, style: { display: "inline-block", width: i, height: i } }));
}
const z = {
  Search: G("Search"),
  Brand: G("Search"),
  File: G("FileText"),
  Calendar: G("CalendarDays"),
  Sparkles: G("Sparkles"),
  Chat: G("MessageSquare"),
  ChatPlus: G("MessageSquarePlus"),
  X: G("X"),
  Check: G("Check"),
  Chevron: G("ChevronRight"),
  ChevronUp: G("ChevronUp"),
  ChevronDown: G("ChevronDown"),
  ArrowUp: G("ArrowUp"),
  External: G("ExternalLink"),
  Copy: G("Copy"),
  Link: G("Link2"),
  Clock: G("Clock"),
  Lock: G("Lock"),
  Alert: G("AlertTriangle"),
  Loader: G("Loader2"),
  PanelLeft: G("PanelLeft"),
  PanelRight: G("PanelRight"),
  Plus: G("Plus"),
  ListTree: G("ListTree"),
  Brain: G("Brain"),
  Hash: G("Hash"),
  Refresh: G("RefreshCw"),
  Folder: G("Folder"),
  Back: G("ArrowLeft"),
  FolderPlus: G("FolderPlus"),
  Folders: G("FolderTree"),
  Trash: G("Trash2"),
  Terminal: G("Terminal")
}, he = "/api/apps/notes-search";
function Ze(t) {
  const e = t instanceof Error ? t.message : String(t), n = /^API \d+: (.*)$/s.exec(e);
  if (n) {
    try {
      const i = JSON.parse(n[1]);
      if (i && typeof i.error == "string") return i.error;
    } catch {
    }
    return n[1].slice(0, 300);
  }
  return e;
}
function je(t) {
  const e = new URLSearchParams();
  for (const [n, i] of Object.entries(t)) i != null && i !== "" && e.set(n, String(i));
  return e.toString();
}
function X(t) {
  return `${t.collection}/${t.path}`;
}
function Qi(t) {
  return t.map((e, n) => ({ it: e, i: n, t: e.modified_at && Date.parse(e.modified_at) || 0 })).sort((e, n) => n.t - e.t || e.i - n.i).map((e) => e.it);
}
function Xr(t, e, n, i = "relevance") {
  const [r, l] = P(null), [c, o] = P(!1), [p, u] = P(null), S = et(0);
  return Ce(() => {
    const y = e;
    if (!y.trim()) {
      S.current++, l(null), o(!1), u(null);
      return;
    }
    const T = ++S.current;
    o(!0);
    const _ = window.setTimeout(() => {
      t.get(`${he}/suggest?${je({ q: y, c: n, limit: 14, sort: i === "recent" ? "recent" : void 0 })}`).then((f) => {
        T === S.current && (l(i === "recent" ? { ...f, results: Qi(f.results) } : f), u(null));
      }).catch((f) => {
        T === S.current && u(Ze(f));
      }).finally(() => {
        T === S.current && o(!1);
      });
    }, 70);
    return () => window.clearTimeout(_);
  }, [t, e, n, i]), { result: r, loading: c, error: p };
}
function Qr(t) {
  const [e, n] = P(null), [i, r] = P(null), [l, c] = P(null), o = et(0), p = de(
    (S, y) => {
      const T = S.trim();
      if (!T) return;
      const _ = ++o.current;
      r(T), c(null), t.get(`${he}/deep?${je({ q: T, c: y, limit: 12 })}`).then((f) => _ === o.current && n(f)).catch((f) => _ === o.current && c(Ze(f))).finally(() => _ === o.current && r(null));
    },
    [t]
  ), u = de(() => {
    o.current++, n(null), r(null), c(null);
  }, []);
  return { result: e, running: i, error: l, run: p, clear: u };
}
function qn() {
  return Wr();
}
const ki = "Notes Search";
async function Vr(t, e) {
  try {
    const n = await t.get("/api/chat/folders");
    let r = (Array.isArray(n) ? n : n?.folders ?? []).find((l) => l.name === ki);
    r || (r = await t.post("/api/chat/folders", { name: ki })), r?.id && await t.patch(`/api/chat/slots/${encodeURIComponent(e)}/folder`, { folder_id: r.id });
  } catch {
  }
}
function Jr() {
  const t = Math.random().toString(36).slice(2, 8);
  return `library-${Date.now().toString(36)}-${t}`;
}
function Vi(t, e, n) {
  return t.post("/api/chat", { message: n, slot: e, agent: "" }).then(() => {
  }).catch((i) => {
    if (!(i instanceof SyntaxError))
      throw i;
  });
}
async function ea(t, e, n) {
  const i = await t.post(`${he}/seed`, {
    docs: e,
    question: n
  }), r = await t.post("/api/chat/slots", { name: Jr(), agent: "" }), l = `📄 ${i.title}`;
  await t.patch(`/api/chat/slots/${encodeURIComponent(r.key)}/title`, { title: l }).catch(() => {
  });
  const c = await t.post(`${he}/sessions`, {
    slot_key: r.key,
    title: l,
    docs: i.docs
  });
  return Vr(t, r.key), Vi(t, r.key, i.message).catch(() => {
  }), c;
}
function ta(t, e) {
  const n = e.trim() || "How does this relate to what we have been discussing?";
  return `Also read **${t.title}** · \`${t.abs_path}\` and bring it into this conversation.

${n}`;
}
function Je(t, e = Date.now()) {
  if (!t) return "";
  const n = Date.parse(t);
  if (Number.isNaN(n)) return "";
  const i = Math.max(0, (e - n) / 1e3);
  if (i < 60) return "just now";
  if (i < 3600) return `${Math.floor(i / 60)}m ago`;
  if (i < 86400) return `${Math.floor(i / 3600)}h ago`;
  const r = Math.floor(i / 86400);
  if (r < 7) return `${r}d ago`;
  const l = new Date(n), c = l.getFullYear() === new Date(e).getFullYear();
  return l.toLocaleDateString([], { month: "short", day: "numeric", ...c ? {} : { year: "numeric" } });
}
function $n(t) {
  if (!t) return "";
  const e = Date.parse(t);
  return Number.isNaN(e) ? "" : new Date(e).toLocaleString([], { weekday: "short", month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}
const na = /\[\[([^\]\n|#]+)(?:#[^\]\n|]*)?(?:\|([^\]\n]+))?\]\]/g;
function Ji({ parts: t, onLink: e }) {
  let n = "";
  const i = [];
  for (const o of t)
    o.hit && i.push([n.length, n.length + o.text.length]), n += o.text;
  const r = (o, p, u) => {
    const S = [];
    let y = o;
    for (const [T, _] of i) {
      if (_ <= y || T >= p) continue;
      const f = Math.max(T, y), v = Math.min(_, p);
      f > y && S.push(/* @__PURE__ */ s("span", { children: n.slice(y, f) }, `${u}-${y}`)), S.push(/* @__PURE__ */ s("mark", { children: n.slice(f, v) }, `${u}-m${f}`)), y = v;
    }
    return y < p && S.push(/* @__PURE__ */ s("span", { children: n.slice(y, p) }, `${u}-${y}`)), S;
  }, l = [];
  let c = 0;
  for (const o of n.matchAll(na)) {
    const p = o.index ?? 0, u = p + o[0].length;
    p > c && l.push(...r(c, p, `t${c}`));
    const S = o[1].trim(), y = o[2] ? p + o[0].lastIndexOf("|") + 1 : p + 2, T = o[2] ? u - 2 : p + 2 + o[1].length, _ = i.some(([f, v]) => f < u && v > p);
    l.push(
      /* @__PURE__ */ s(
        "span",
        {
          className: "lib-snip-link",
          "data-hit": _,
          title: S,
          onClick: e ? (f) => {
            f.stopPropagation(), e(S);
          } : void 0,
          children: r(y, T, `l${p}`)
        },
        `l${p}`
      )
    ), c = u;
  }
  return c < n.length && l.push(...r(c, n.length, `t${c}`)), /* @__PURE__ */ s(Jt, { children: l });
}
function ia(t) {
  return t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function ra(t, e) {
  const n = e.filter((c) => c.length >= 2);
  if (!n.length) return t;
  const i = new RegExp(`(${n.map(ia).join("|")})`, "ig"), r = [];
  let l = 0;
  return t.replace(i, (c, o, p) => (p > l && r.push(t.slice(l, p)), r.push(/* @__PURE__ */ s("mark", { children: c }, p)), l = p + c.length, c)), l < t.length && r.push(t.slice(l)), r;
}
function er(t, e) {
  const n = e.lastIndexOf("/");
  return n < 0 ? t : `${t} / ${e.slice(0, n).replace(/\//g, " / ")}`;
}
function aa(t) {
  return /(^|\/)\d{4}-\d{2}-\d{2}\.md$/.test(t);
}
function la() {
  return typeof navigator < "u" && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
}
const Ot = la() ? "⌘" : "Ctrl";
function tr(t) {
  return Fn(() => {
    const e = [];
    if (!t.query.trim())
      e.push({ id: "recent", label: "Recently edited", rows: t.recent.map((n) => ({ hit: n, words: [] })) });
    else {
      const n = /* @__PURE__ */ new Set();
      if (t.deep && t.deep.query === t.query.trim() && t.deep.results.length) {
        const r = (t.sort === "recent" ? Qi(t.deep.results) : t.deep.results).map((l) => ({ hit: l, words: t.deep.words }));
        r.forEach((l) => n.add(X(l.hit))), e.push({
          id: "deep",
          label: t.sort === "recent" ? "Best matches, newest first" : "Best matches",
          meta: `hybrid · ${(t.deep.took_ms / 1e3).toFixed(1)}s${t.deep.cached ? " · cached" : ""}`,
          rows: r
        });
      }
      if (t.suggest) {
        const i = t.suggest.results.filter((r) => !n.has(X(r))).map((r) => ({ hit: r, words: t.suggest.words }));
        e.push({
          id: "suggest",
          label: (e.length ? "Keyword matches" : "Matches") + (t.sort === "recent" ? ", newest first" : ""),
          meta: `${t.suggest.results.length}${t.suggest.results.length >= 14 ? "+" : ""} · ${Math.round(t.suggest.took_ms)}ms`,
          rows: i
        });
      }
    }
    return { sections: e, flat: e.flatMap((n) => n.rows) };
  }, [t.query, t.suggest, t.deep, t.recent, t.sort]);
}
const oa = Br(function(e, n) {
  const { sections: i, flat: r } = tr(e), l = et(null);
  Ce(() => {
    l.current?.querySelector(`[data-row="${e.selected}"]`)?.scrollIntoView({ block: "nearest" });
  }, [e.selected]);
  function c(T) {
    if (!T.nativeEvent.isComposing)
      if (T.key === "ArrowDown")
        T.preventDefault(), e.onSelected(Math.min(r.length - 1, e.selected + 1), !0);
      else if (T.key === "ArrowUp")
        T.preventDefault(), e.onSelected(Math.max(0, e.selected - 1), !0);
      else if (T.key === "Enter" && (T.metaKey || T.ctrlKey))
        T.preventDefault(), e.onDeep();
      else if (T.key === "Enter" && T.shiftKey) {
        T.preventDefault();
        const _ = r[e.selected];
        _ && e.onTogglePick(_.hit);
      } else if (T.key === "Enter") {
        T.preventDefault();
        const _ = r[e.selected];
        _ && e.onOpen(_.hit, { pin: !0, words: _.words });
      } else T.key === "Escape" && e.query && (T.preventDefault(), e.onQuery(""));
  }
  const o = e.query.trim(), p = e.deepRunning === o, u = o.length > 0 && !(e.deep && e.deep.query === o), S = e.picks.size > 0;
  let y = -1;
  return /* @__PURE__ */ h("aside", { className: "lib-left", "aria-label": "Search", children: [
    /* @__PURE__ */ h("div", { className: "lib-brand", children: [
      /* @__PURE__ */ s("span", { className: "lib-logo", "aria-hidden": "true", children: /* @__PURE__ */ s(z.Brand, { size: 17, strokeWidth: 2.5 }) }),
      /* @__PURE__ */ s("h1", { children: "Notes Search" }),
      e.indexInfo && /* @__PURE__ */ h("span", { className: "lib-meta lib-meta-sm", title: e.indexInfo.updated ? `Index file updated ${e.indexInfo.updated}` : void 0, children: [
        e.indexInfo.documents.toLocaleString(),
        " notes",
        /* @__PURE__ */ s("br", {}),
        e.indexInfo.updated ? `indexed ${Je(e.indexInfo.updated)}` : ""
      ] })
    ] }),
    /* @__PURE__ */ s("div", { className: "lib-search", role: "search", children: /* @__PURE__ */ h("label", { className: "lib-search-box", children: [
      e.suggestLoading || p ? /* @__PURE__ */ s(z.Loader, { size: 18, className: "lib-spin", "aria-hidden": "true" }) : /* @__PURE__ */ s(z.Search, { size: 18, strokeWidth: 2.4, "aria-hidden": "true" }),
      /* @__PURE__ */ s("span", { className: "lib-sr", children: "Search your notes" }),
      /* @__PURE__ */ s(
        "input",
        {
          ref: n,
          value: e.query,
          onChange: (T) => {
            e.onQuery(T.target.value), e.onSelected(0);
          },
          onKeyDown: c,
          placeholder: "Search anything you've written…",
          autoComplete: "off",
          spellCheck: !1,
          role: "combobox",
          "aria-expanded": r.length > 0,
          "aria-controls": "lib-results",
          "aria-activedescendant": r.length ? `lib-row-${e.selected}` : void 0
        }
      ),
      e.query ? /* @__PURE__ */ s("button", { type: "button", className: "lib-btn lib-btn-quiet lib-btn-icon", "aria-label": "Clear search", onClick: () => e.onQuery(""), children: /* @__PURE__ */ s(z.X, { size: 15 }) }) : /* @__PURE__ */ s("span", { className: "lib-kbd", "aria-hidden": "true", children: "/" })
    ] }) }),
    e.collections.length > 1 && /* @__PURE__ */ h("div", { className: "lib-filters", role: "group", "aria-label": "Collection", children: [
      /* @__PURE__ */ s("button", { type: "button", className: "lib-chip", "aria-pressed": e.collection === null, onClick: () => e.onCollection(null), children: "All" }),
      e.collections.map((T) => /* @__PURE__ */ h(
        "button",
        {
          type: "button",
          className: "lib-chip",
          "aria-pressed": e.collection === T.name,
          onClick: () => e.onCollection(e.collection === T.name ? null : T.name),
          children: [
            T.name,
            " ",
            /* @__PURE__ */ s("span", { className: "lib-count", children: T.docs.toLocaleString() })
          ]
        },
        T.name
      ))
    ] }),
    o && /* @__PURE__ */ h("div", { className: "lib-sortbar", children: [
      /* @__PURE__ */ s("span", { className: "lib-meta-sm", children: "Sort" }),
      /* @__PURE__ */ s("div", { className: "lib-seg", role: "radiogroup", "aria-label": "Sort results", children: [
        ["relevance", "Best match"],
        ["recent", "Newest"]
      ].map(([T, _]) => /* @__PURE__ */ h(
        "button",
        {
          type: "button",
          role: "radio",
          "aria-checked": e.sort === T,
          className: "lib-seg-opt",
          onClick: () => {
            e.onSort(T), e.onSelected(0);
          },
          children: [
            T === "recent" && /* @__PURE__ */ s(z.Clock, { size: 12, "aria-hidden": "true" }),
            _
          ]
        },
        T
      )) })
    ] }),
    /* @__PURE__ */ h("div", { className: "lib-results", id: "lib-results", role: "listbox", ref: l, "data-picking": S, children: [
      e.indexInfo?.error && /* @__PURE__ */ h("div", { className: "lib-empty", children: [
        /* @__PURE__ */ s("h3", { children: "QMD's index isn't readable" }),
        /* @__PURE__ */ s("p", { children: e.indexInfo.error }),
        /* @__PURE__ */ h("p", { children: [
          "Build it with ",
          /* @__PURE__ */ s("code", { children: "qmd update" }),
          " and ",
          /* @__PURE__ */ s("code", { children: "qmd embed" }),
          "."
        ] })
      ] }),
      i.map((T) => /* @__PURE__ */ h("div", { children: [
        /* @__PURE__ */ h("div", { className: "lib-section", children: [
          T.id === "deep" && /* @__PURE__ */ s(z.Sparkles, { size: 13, "aria-hidden": "true" }),
          T.id === "recent" && /* @__PURE__ */ s(z.Clock, { size: 13, "aria-hidden": "true" }),
          T.label,
          T.meta && /* @__PURE__ */ s("span", { className: "lib-meta-sm", children: T.meta })
        ] }),
        T.rows.map((_) => {
          y += 1;
          const f = y, v = X(_.hit), E = e.picks.has(v), O = aa(_.hit.path) ? z.Calendar : z.File;
          return /* @__PURE__ */ h(
            "div",
            {
              id: `lib-row-${f}`,
              "data-row": f,
              role: "option",
              "aria-selected": f === e.selected,
              className: "lib-hit",
              tabIndex: -1,
              onMouseMove: () => f !== e.selected && e.onSelected(f),
              onClick: (L) => {
                L.metaKey || L.ctrlKey || L.shiftKey ? e.onTogglePick(_.hit) : e.onOpen(_.hit, { words: _.words });
              },
              onDoubleClick: () => e.onOpen(_.hit, { pin: !0, words: _.words }),
              "data-active": e.activeKey === v,
              children: [
                /* @__PURE__ */ s("span", { className: "lib-hit-icon", "aria-hidden": "true", children: /* @__PURE__ */ s(O, { size: 16, strokeWidth: 2.2 }) }),
                /* @__PURE__ */ s("span", { className: "lib-hit-title", children: /* @__PURE__ */ s("span", { children: ra(_.hit.title, _.words) }) }),
                /* @__PURE__ */ h("span", { className: "lib-hit-path", children: [
                  er(_.hit.collection, _.hit.path),
                  _.hit.modified_at ? ` · ${Je(_.hit.modified_at)}` : ""
                ] }),
                _.hit.snippet.length > 0 && /* @__PURE__ */ s("span", { className: "lib-hit-snippet", children: /* @__PURE__ */ s(Ji, { parts: _.hit.snippet, onLink: e.onLink ? (L) => e.onLink(L, _.hit.collection) : void 0 }) }),
                /* @__PURE__ */ s(
                  "button",
                  {
                    type: "button",
                    className: "lib-check",
                    role: "checkbox",
                    "aria-checked": E,
                    "aria-label": E ? `Remove ${_.hit.title} from selection` : `Select ${_.hit.title} to chat about together`,
                    title: "Select for a chat across several notes (⇧Enter)",
                    onClick: (L) => {
                      L.stopPropagation(), e.onTogglePick(_.hit);
                    },
                    children: E && /* @__PURE__ */ s(z.Check, { size: 13, strokeWidth: 3.2 })
                  }
                )
              ]
            },
            `${T.id}:${v}`
          );
        })
      ] }, T.id)),
      o && u && /* @__PURE__ */ h("button", { type: "button", className: "lib-deep-row", onClick: e.onDeep, "aria-busy": p, disabled: p, children: [
        p ? /* @__PURE__ */ s(z.Loader, { size: 17, className: "lib-spin" }) : /* @__PURE__ */ s(z.Sparkles, { size: 17 }),
        /* @__PURE__ */ s("span", { className: "lib-grow", children: p ? /* @__PURE__ */ h(Jt, { children: [
          /* @__PURE__ */ s("b", { children: "Searching by meaning…" }),
          /* @__PURE__ */ s("br", {}),
          /* @__PURE__ */ s("span", { className: "lib-meta-sm", children: "QMD is expanding and reranking. This takes a few seconds." })
        ] }) : /* @__PURE__ */ h(Jt, { children: [
          /* @__PURE__ */ s("b", { children: "Search by meaning" }),
          /* @__PURE__ */ s("br", {}),
          /* @__PURE__ */ s("span", { className: "lib-meta-sm", children: "Hybrid QMD search with query expansion and reranking" })
        ] }) }),
        !p && /* @__PURE__ */ h("span", { className: "lib-row", children: [
          /* @__PURE__ */ s("span", { className: "lib-kbd", children: Ot }),
          /* @__PURE__ */ s("span", { className: "lib-kbd", children: "↵" })
        ] })
      ] }),
      e.deepError && o && /* @__PURE__ */ h("div", { className: "lib-alert", role: "alert", style: { marginTop: 8 }, children: [
        /* @__PURE__ */ s(z.Alert, { size: 16 }),
        /* @__PURE__ */ s("span", { children: e.deepError })
      ] }),
      e.suggestError && /* @__PURE__ */ h("div", { className: "lib-alert", role: "alert", style: { marginTop: 8 }, children: [
        /* @__PURE__ */ s(z.Alert, { size: 16 }),
        /* @__PURE__ */ s("span", { children: e.suggestError })
      ] }),
      o && e.suggest && !e.suggestLoading && r.length === 0 && !p && /* @__PURE__ */ h("div", { className: "lib-empty", children: [
        /* @__PURE__ */ s("h3", { children: "No keyword matches" }),
        /* @__PURE__ */ s("p", { children: "Try fewer words, or search by meaning to find notes that say it differently." })
      ] })
    ] }),
    S && /* @__PURE__ */ h("div", { className: "lib-tray", role: "status", children: [
      /* @__PURE__ */ h("span", { className: "lib-grow", children: [
        e.picks.size,
        " note",
        e.picks.size === 1 ? "" : "s",
        " selected"
      ] }),
      /* @__PURE__ */ s("button", { type: "button", className: "lib-btn lib-btn-quiet lib-btn-sm", onClick: e.onClearPicks, children: "Clear" }),
      /* @__PURE__ */ h("button", { type: "button", className: "lib-btn lib-btn-primary lib-btn-sm", onClick: e.onChatPicks, children: [
        /* @__PURE__ */ s(z.ChatPlus, { size: 14 }),
        "Chat about ",
        e.picks.size === 1 ? "it" : "them"
      ] })
    ] })
  ] });
});
function Un() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var ot = Un();
function nr(t) {
  ot = t;
}
var at = { exec: () => null };
function mt(t) {
  let e = [];
  return (n) => {
    let i = Math.max(0, Math.min(3, n - 1)), r = e[i];
    return r || (r = t(i), e[i] = r), r;
  };
}
function M(t, e = "") {
  let n = typeof t == "string" ? t : t.source, i = { replace: (r, l) => {
    let c = typeof l == "string" ? l : l.source;
    return c = c.replace(ge.caret, "$1"), n = n.replace(r, c), i;
  }, getRegex: () => new RegExp(n, e) };
  return i;
}
var sa = ((t = "") => {
  try {
    return !!new RegExp("(?<=1)(?<!1)" + t);
  } catch {
    return !1;
  }
})(), ge = { codeRemoveIndent: /^(?: {0,3}\t| {1,4})/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, endingSpaceTabChar: /[ \t]$/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, leadingSpaceTab: /^[ \t]+/, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, numericCharacterReference: /&#(?:(\d{1,7})|[Xx]([A-Fa-f0-9]{1,6}));/g, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (t) => new RegExp(`^( {0,3}${t})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: mt((t) => new RegExp(`^ {0,${t}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`)), hrRegex: mt((t) => new RegExp(`^ {0,${t}}((?:-[ 	]*){3,}|(?:_[ 	]*){3,}|(?:\\*[ 	]*){3,})(?:\\n+|$)`)), fencesBeginRegex: mt((t) => new RegExp(`^ {0,${t}}(?:\`\`\`|~~~)`)), headingBeginRegex: mt((t) => new RegExp(`^ {0,${t}}#`)), htmlBeginRegex: mt((t) => new RegExp(`^ {0,${t}}(?:</?(?:${Mt})(?: +|$|/?>)|<(?:script|pre|style|textarea|!--))`, "i")), blockquoteBeginRegex: mt((t) => new RegExp(`^ {0,${t}}>`)) }, ca = /^(?:[ \t]*(?:\n|$))+/, da = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, pa = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, Pt = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, ua = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, Bn = / {0,3}(?:[*+-]|\d{1,9}[.)])/, ir = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |fences|blockquote|heading|hr|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, rr = M(ir).replace(/bull/g, Bn).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\s|$)/).replace(/hr/g, / {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), ha = M(ir).replace(/bull/g, Bn).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\s|$)/).replace(/hr/g, / {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), Hn = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table|[ \t]+\n)[^\n]+)*)/, fa = /^[^\n]+/, Wn = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, ba = M(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Wn).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), ma = M(/^(bull)([ \t][^\n]*?)?(?:\n|$)/).replace(/bull/g, Bn).getRegex(), Mt = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Gn = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, ga = M("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n*|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>[^\\n]*\\n*|$)|<![A-Z][\\s\\S]*?(?:>[^\\n]*\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>[^\\n]*\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][a-z0-9-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][a-z0-9-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", Gn).replace("tag", Mt).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), ar = (t) => M(Hn).replace("hr", Pt).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", t).replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Mt).getRegex(), xa = ar(/ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/), ka = ar(/ {0,3}(?:[*+-]|\d{1,9}[.)])(?:[ \t]|\n|$)/), va = M(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", ka).getRegex(), jn = { blockquote: va, code: da, def: ba, fences: pa, heading: ua, hr: Pt, html: ga, lheading: rr, list: ma, newline: ca, paragraph: xa, table: at, text: fa }, vi = M("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", Pt).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Mt).getRegex(), ya = { ...jn, lheading: ha, table: vi, paragraph: M(Hn).replace("hr", Pt).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", vi).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Mt).getRegex() }, wa = { ...jn, html: M(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", Gn).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: at, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: M(Hn).replace("hr", Pt).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", rr).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, Ta = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, Sa = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, lr = /^( {2,}|\\)\n(?!\s*$)[ \t]*/, _a = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, Ke = /[\p{P}\p{S}]/u, kt = /[\s\p{P}\p{S}]/u, Ft = /[^\s\p{P}\p{S}]/u, Aa = M(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, kt).getRegex(), Ea = /[\p{Pi}\p{Ps}"']/u, or = /(?!~)[\p{P}\p{S}]/u, Na = /(?!~)[\s\p{P}\p{S}]/u, Ca = /(?:[^\s\p{P}\p{S}]|~)/u, Ra = M(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", sa ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), sr = /^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/, za = M(sr, "u").replace(/punct/g, Ke).getRegex(), $a = M(sr, "u").replace(/punct/g, or).getRegex(), La = /^(?:\*+(?:((?!\*)(?!openQuote)punct)|([^\s*]))?)|^_+(?:((?!_)(?!openQuote)punct)|([^\s_]))?/, Da = M(La, "u").replace(/openQuote/g, Ea).replace(/punct/g, Ke).getRegex(), cr = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", Ia = M(cr, "gu").replace(/notPunctSpace/g, Ft).replace(/punctSpace/g, kt).replace(/punct/g, Ke).getRegex(), Oa = M(cr, "gu").replace(/notPunctSpace/g, Ca).replace(/punctSpace/g, Na).replace(/punct/g, or).getRegex(), Pa = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)[\\s](\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|(?:(?!\\*)punct|notPunctSpace)(\\*+)(?!\\*)(?=notPunctSpace)", Ma = M(Pa, "gu").replace(/notPunctSpace/g, Ft).replace(/punctSpace/g, kt).replace(/punct/g, Ke).getRegex(), Fa = M("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, Ft).replace(/punctSpace/g, kt).replace(/punct/g, Ke).getRegex(), qa = "^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)[\\s](_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)|(?:(?!_)punct|notPunctSpace)(_+)(?!_)(?=notPunctSpace)", Ua = M(qa, "gu").replace(/notPunctSpace/g, Ft).replace(/punctSpace/g, kt).replace(/punct/g, Ke).getRegex(), Ba = M(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, Ke).getRegex(), Ha = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", Wa = M(Ha, "gu").replace(/notPunctSpace/g, Ft).replace(/punctSpace/g, kt).replace(/punct/g, Ke).getRegex(), Ga = M(/\\(punct)/, "gu").replace(/punct/g, Ke).getRegex(), ja = M(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), Za = M(Gn).replace("(?:-->|$)", "-->").getRegex(), Ka = M("^comment|^</[a-zA-Z][a-zA-Z0-9-]*\\s*>|^<[a-zA-Z][a-zA-Z0-9-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", Za).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), dr = /\[(?:\\[\s\S]|[^\[\]\\])*\]/, en = M(/(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/).replace("brackets", dr).getRegex(), Ya = M(/^!?\[(label)\]\([ \t\n]*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?[ \t\n]*\)/).replace("label", en).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]+|(?=\))/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), Xa = M(/^!?\[(label)\]\[(ref)\]/).replace("label", en).replace("ref", Wn).getRegex(), Qa = M(/^!?\[(ref)\](?:\[\])?/).replace("ref", Wn).getRegex(), yi = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\]){1,999}/, Va = M(/(?:[^\[\]\\`]*(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\]))){0,999}?[^\[\]\\`]*?/).replace("brackets", dr).getRegex(), Ja = M("reflink|nolink(?!\\()", "g").replace("reflink", M(/^!?\[(label)\]\[(ref)\]/).replace("label", Va).replace("ref", yi).getRegex()).replace("nolink", M(/^!?\[(ref)\](?:\[\])?/).replace("ref", yi).getRegex()).getRegex(), wi = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, el = /[A-Za-z0-9._+-]+@[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/, tl = M(/(?:mailto:email|xmpp:email(?:\/[A-Za-z0-9@.]+)?)/).replace(/email/g, el).getRegex(), Zn = { _backpedal: at, anyPunctuation: Ga, autolink: ja, blockSkip: Ra, br: lr, code: Sa, del: at, delLDelim: at, delRDelim: at, emStrongLDelim: za, emStrongRDelimAst: Ia, emStrongRDelimUnd: Fa, escape: Ta, link: Ya, nolink: Qa, punctuation: Aa, reflink: Xa, reflinkSearch: Ja, tag: Ka, text: _a, url: at }, nl = { ...Zn, emStrongLDelim: Da, emStrongRDelimAst: Ma, emStrongRDelimUnd: Ua, link: M(/^!?\[(label)\]\((.*?)\)/).replace("label", en).getRegex(), reflink: M(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", en).getRegex() }, Ln = { ...Zn, emStrongRDelimAst: Oa, emStrongLDelim: $a, delLDelim: Ba, delRDelim: Wa, url: M(/^emailProtocol|^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("emailProtocol", tl).replace("protocol", wi).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: M(/^(?:[^a-zA-Z0-9](?=emailProtocol)|(`+|~+|[^`~])(?:(?=[`~])|(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9](?=emailProtocol)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))))/).replace("protocol", wi).replace(/emailProtocol/g, /(?:mailto|xmpp):/).getRegex() }, il = { ...Ln, br: M(lr).replace("{2,}", "*").getRegex(), text: M(Ln.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, Qt = { normal: jn, gfm: ya, pedantic: wa }, Ct = { normal: Zn, gfm: Ln, breaks: il, pedantic: nl }, rl = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, Ti = (t) => rl[t];
function Ee(t, e) {
  if (e) {
    if (ge.escapeTest.test(t)) return t.replace(ge.escapeReplace, Ti);
  } else if (ge.escapeTestNoEncode.test(t)) return t.replace(ge.escapeReplaceNoEncode, Ti);
  return t;
}
function al(t) {
  return t.replace(ge.numericCharacterReference, (e, n, i) => {
    let r = n === void 0 ? Number.parseInt(i, 16) : Number.parseInt(n, 10);
    return r === 0 || r > 1114111 || r >= 55296 && r <= 57343 ? "�" : String.fromCodePoint(r);
  });
}
function Si(t) {
  try {
    t = encodeURI(t).replace(ge.percentDecode, "%");
  } catch {
    return null;
  }
  return t;
}
function _i(t, e) {
  let n = t.replace(ge.findPipe, (l, c, o) => {
    let p = !1, u = c;
    for (; --u >= 0 && o[u] === "\\"; ) p = !p;
    return p ? "|" : " |";
  }), i = n.split(ge.splitPipe), r = 0;
  if (i[0].trim() || i.shift(), i.length > 0 && !i.at(-1)?.trim() && i.pop(), e) if (i.length > e) i.splice(e);
  else for (; i.length < e; ) i.push("");
  for (; r < i.length; r++) i[r] = i[r].trim().replace(ge.slashPipe, "|");
  return i;
}
function Qe(t, e, n) {
  let i = t.length;
  if (i === 0) return "";
  let r = 0;
  for (; r < i && t.charAt(i - r - 1) === e; )
    r++;
  return t.slice(0, i - r);
}
function Ai(t) {
  let e = t.split(`
`), n = e.length - 1;
  for (; n >= 0 && ge.blankLine.test(e[n]); ) n--;
  return e.length - n <= 2 ? t : e.slice(0, n + 1).join(`
`);
}
function tn(t) {
  return t.trim().toLowerCase().toUpperCase().toLowerCase();
}
function Ei(t, e) {
  if (t.indexOf(e[0]) === -1 && t.indexOf(e[1]) === -1) return -1;
  let n = 0;
  for (let i = 0; i < t.length; i++) if (t[i] === "\\") i++;
  else if (t[i] === e[0]) n++;
  else if (t[i] === e[1] && (n--, n < 0)) return i;
  return n > 0 ? -2 : -1;
}
function Ni(t, e = 0) {
  let n = e, i = "";
  for (let r of t) if (r === "	") {
    let l = 4 - n % 4;
    i += " ".repeat(l), n += l;
  } else i += r, n++;
  return i;
}
function Ci(t, e, n, i, r) {
  let l = e.href, c = e.title || null, o = t[1].replace(r.other.outputLinkReplace, "$1"), p = t[0].charAt(0) === "!";
  i.state.inLink = !0;
  let u = i.state.linkEmitted, S = i.state.inRawBlock;
  i.state.linkEmitted = !1;
  let y = i.inlineTokens(o), T = i.state.linkEmitted;
  if (i.state.linkEmitted = u, i.state.inLink = !1, !p) {
    if (T) {
      i.state.inRawBlock = S;
      return;
    }
    i.state.linkEmitted = !0;
  }
  return { type: p ? "image" : "link", raw: n, href: l, title: c, text: o, tokens: y };
}
function ll(t, e, n) {
  let i = t.match(n.other.indentCodeCompensation);
  if (i === null) return e;
  let r = i[1];
  return e.split(`
`).map((l) => {
    let c = l.match(n.other.beginningSpace);
    if (c === null) return l;
    let [o] = c;
    return l.slice(Math.min(o.length, r.length));
  }).join(`
`);
}
function Ri(t, e, n, i) {
  if (!e.includes("<")) return !1;
  for (let r = 0; r < e.length; r++) {
    if (e[r] === "\\") {
      r++;
      continue;
    }
    if (e[r] === "`") {
      let o = i.inline.code.exec(e.slice(r));
      if (o) {
        r += o[0].length - 1;
        continue;
      }
    }
    if (e[r] !== "<") continue;
    let l = t.slice(n + r), c = i.inline.tag.exec(l) || i.inline.autolink.exec(l);
    if (c) {
      if (c[0].length > e.length - r) return !0;
      r += c[0].length - 1;
    }
  }
  return !1;
}
var nn = class {
  options;
  rules;
  lexer;
  constructor(t) {
    this.options = t || ot;
  }
  space(t) {
    let e = this.rules.block.newline.exec(t);
    if (e && e[0].length > 0) return { type: "space", raw: e[0] };
  }
  code(t) {
    let e = this.rules.block.code.exec(t);
    if (e) {
      let n = this.options.pedantic ? e[0] : Ai(e[0]), i = n.replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: n, codeBlockStyle: "indented", text: i };
    }
  }
  fences(t) {
    let e = this.rules.block.fences.exec(t);
    if (e) {
      let n = e[0], i = ll(n, e[3] || "", this.rules);
      return { type: "code", raw: n, lang: e[2] ? e[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : e[2], text: i };
    }
  }
  heading(t) {
    let e = this.rules.block.heading.exec(t);
    if (e) {
      let n = e[2].trim();
      if (this.rules.other.endingHash.test(n)) {
        let i = Qe(n, "#");
        (this.options.pedantic || !i || this.rules.other.endingSpaceTabChar.test(i)) && (n = i.trim());
      }
      return { type: "heading", raw: Qe(e[0], `
`), depth: e[1].length, text: n, tokens: this.lexer.inline(n) };
    }
  }
  hr(t) {
    let e = this.rules.block.hr.exec(t);
    if (e) return { type: "hr", raw: Qe(e[0], `
`) };
  }
  blockquote(t) {
    let e = this.rules.block.blockquote.exec(t);
    if (e) {
      let n = Qe(e[0], `
`).split(`
`), i = "", r = "", l = [];
      for (; n.length > 0; ) {
        let c = !1, o = [], p;
        for (p = 0; p < n.length; p++) if (this.rules.other.blockquoteStart.test(n[p])) o.push(n[p]), c = !0;
        else if (!c) o.push(n[p]);
        else break;
        n = n.slice(p);
        let u = o.join(`
`), S = u.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        i = i ? `${i}
${u}` : u, r = r ? `${r}
${S}` : S;
        let y = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(S, l, !0), this.lexer.state.top = y, n.length === 0) break;
        let T = l.at(-1);
        if (T?.type === "code") break;
        if (T?.type === "blockquote") {
          let _ = T, f = n.join(`
`), v = _.raw + `
` + f.replace(this.rules.other.blockquoteSetextReplace2, ""), E = this.blockquote(v);
          l[l.length - 1] = E;
          let O = v.substring(E.raw.length).replace(/^\n/, ""), L = O ? O.split(`
`).length : 0, D = L ? n.slice(0, -L) : n;
          D.length > 0 && (i = `${i}
${D.join(`
`)}`), r = r.substring(0, r.length - _.text.length) + E.text;
          break;
        } else if (T?.type === "list") {
          let _ = T, f = _.raw + `
` + n.join(`
`), v = this.list(f);
          l[l.length - 1] = v, i = i.substring(0, i.length - T.raw.length) + v.raw, r = r.substring(0, r.length - _.raw.length) + v.raw, n = f.substring(l.at(-1).raw.length).split(`
`);
          continue;
        }
      }
      return { type: "blockquote", raw: i, tokens: l, text: r };
    }
  }
  list(t) {
    let e = this.rules.block.list.exec(t);
    if (e) {
      let n = e[1].trim(), i = n.length > 1, r = { type: "list", raw: "", ordered: i, start: i ? +n.slice(0, -1) : "", loose: !1, items: [] };
      n = i ? `\\d{1,9}\\${n.slice(-1)}` : `\\${n}`, this.options.pedantic && (n = i ? n : "[*+-]");
      let l = this.rules.other.listItemRegex(n), c = !1;
      for (; t; ) {
        let p = !1, u = "", S = "";
        if (!(e = l.exec(t)) || this.rules.block.hr.test(t)) break;
        u = e[0], t = t.substring(u.length);
        let y = e[2].split(`
`, 1)[0], T = e[1].length, _ = this.options.pedantic ? Ni(y, T) : y.replace(this.rules.other.leadingSpaceTab, (O) => Ni(O, T)), f = t.split(`
`, 1)[0], v = !_.trim(), E = 0;
        if (this.options.pedantic ? (E = 2, S = _.trimStart()) : v ? E = T + 1 : (E = _.search(this.rules.other.nonSpaceChar), E = E > 4 ? 1 : E, S = _.slice(E), E += T), v && this.rules.other.blankLine.test(f) && (u += f + `
`, t = t.substring(f.length + 1), p = !0), !p) {
          let O = this.rules.other.nextBulletRegex(E), L = this.rules.other.hrRegex(E), D = this.rules.other.fencesBeginRegex(E), Y = this.rules.other.headingBeginRegex(E), B = this.rules.other.htmlBeginRegex(E), ue = this.rules.other.blockquoteBeginRegex(E);
          for (; t; ) {
            let Z = t.split(`
`, 1)[0], oe;
            if (f = Z, this.options.pedantic ? (f = f.replace(this.rules.other.listReplaceNesting, "  "), oe = f) : oe = f.replace(this.rules.other.leadingSpaceTab, (ke) => ke.replace(this.rules.other.tabCharGlobal, "    ")), D.test(f) || Y.test(f) || B.test(f) || ue.test(f) || O.test(f) || L.test(f)) break;
            if (oe.search(this.rules.other.nonSpaceChar) >= E || !f.trim()) S += `
` + oe.slice(E);
            else {
              if (v || _.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || D.test(_) || Y.test(_) || L.test(_)) break;
              S += `
` + f;
            }
            v = !f.trim(), u += Z + `
`, t = t.substring(Z.length + 1), _ = oe.slice(E);
          }
        }
        r.loose || (c ? r.loose = !0 : this.rules.other.doubleBlankLine.test(u) && (c = !0)), r.items.push({ type: "list_item", raw: u, task: !!this.options.gfm && this.rules.other.listIsTask.test(S), loose: !1, text: S, tokens: [] }), r.raw += u;
      }
      let o = r.items.at(-1);
      if (o) o.raw = o.raw.trimEnd(), o.text = o.text.trimEnd();
      else return;
      r.raw = r.raw.trimEnd();
      for (let p of r.items) if (this.lexer.state.top = !1, p.tokens = this.lexer.blockTokens(p.text, []), !r.loose) {
        let u = p.tokens.filter((y) => y.type === "space"), S = u.length > 0 && u.some((y) => this.rules.other.anyLine.test(y.raw));
        r.loose = S;
      }
      for (let p of r.items) {
        let u = p.tokens[0];
        if (p.task && (u?.type === "text" || u?.type === "paragraph")) {
          p.text = p.text.replace(this.rules.other.listReplaceTask, ""), u.raw = u.raw.replace(this.rules.other.listReplaceTask, ""), u.text = u.text.replace(this.rules.other.listReplaceTask, "");
          for (let y = this.lexer.inlineQueue.length - 1; y >= 0; y--) if (this.rules.other.listIsTask.test(this.lexer.inlineQueue[y].src)) {
            this.lexer.inlineQueue[y].src = this.lexer.inlineQueue[y].src.replace(this.rules.other.listReplaceTask, "");
            break;
          }
          let S = this.rules.other.listTaskCheckbox.exec(p.raw);
          if (S) {
            let y = { type: "checkbox", raw: S[0] + " ", checked: S[0] !== "[ ]" };
            p.checked = y.checked, r.loose ? p.tokens[0] && ["paragraph", "text"].includes(p.tokens[0].type) && "tokens" in p.tokens[0] && p.tokens[0].tokens ? (p.tokens[0].raw = y.raw + p.tokens[0].raw, p.tokens[0].text = y.raw + p.tokens[0].text, p.tokens[0].tokens.unshift(y)) : p.tokens.unshift({ type: "paragraph", raw: y.raw, text: y.raw, tokens: [y] }) : p.tokens.unshift(y);
          }
        } else p.task && (p.task = !1);
      }
      if (r.loose) for (let p of r.items) {
        p.loose = !0;
        for (let u of p.tokens) u.type === "text" && (u.type = "paragraph");
      }
      return r;
    }
  }
  html(t) {
    let e = this.rules.block.html.exec(t);
    if (e) {
      let n = Ai(e[0]);
      return { type: "html", block: !0, raw: n, pre: e[1] === "pre" || e[1] === "script" || e[1] === "style", text: n };
    }
  }
  def(t) {
    let e = this.rules.block.def.exec(t);
    if (e) {
      if (!this.rules.other.startAngleBracket.test(e[2]) && Ei(e[2], "()") !== -1) return;
      let n = tn(e[1]).replace(this.rules.other.multipleSpaceGlobal, " "), i = e[2] ? e[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", r = e[3] ? e[3].substring(1, e[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : e[3];
      return { type: "def", tag: n, raw: Qe(e[0], `
`), href: i, title: r };
    }
  }
  table(t) {
    let e = this.rules.block.table.exec(t);
    if (!e || !this.rules.other.tableDelimiter.test(e[2])) return;
    let n = _i(e[1]), i = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), r = e[3]?.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], l = { type: "table", raw: Qe(e[0], `
`), header: [], align: [], rows: [] };
    if (n.length === i.length) {
      for (let c of i) this.rules.other.tableAlignRight.test(c) ? l.align.push("right") : this.rules.other.tableAlignCenter.test(c) ? l.align.push("center") : this.rules.other.tableAlignLeft.test(c) ? l.align.push("left") : l.align.push(null);
      for (let c = 0; c < n.length; c++) l.header.push({ text: n[c], tokens: this.lexer.inline(n[c]), header: !0, align: l.align[c] });
      for (let c of r) l.rows.push(_i(c, l.header.length).map((o, p) => ({ text: o, tokens: this.lexer.inline(o), header: !1, align: l.align[p] })));
      return l;
    }
  }
  lheading(t) {
    let e = this.rules.block.lheading.exec(t);
    if (e) {
      let n = e[1].trim();
      return { type: "heading", raw: Qe(e[0], `
`), depth: e[2].charAt(0) === "=" ? 1 : 2, text: n, tokens: this.lexer.inline(n) };
    }
  }
  paragraph(t) {
    let e = this.rules.block.paragraph.exec(t);
    if (e) {
      let n = e[1].charAt(e[1].length - 1) === `
` ? e[1].slice(0, -1) : e[1];
      return { type: "paragraph", raw: e[0], text: n, tokens: this.lexer.inline(n) };
    }
  }
  text(t) {
    let e = this.rules.block.text.exec(t);
    if (e) return { type: "text", raw: e[0], text: e[0], tokens: this.lexer.inline(e[0]) };
  }
  escape(t) {
    let e = this.rules.inline.escape.exec(t);
    if (e) return { type: "escape", raw: e[0], text: e[1] };
  }
  tag(t) {
    let e = this.rules.inline.tag.exec(t);
    if (e) return !this.lexer.state.inLink && this.rules.other.startATag.test(e[0]) ? this.lexer.state.inLink = !0 : this.lexer.state.inLink && this.rules.other.endATag.test(e[0]) && (this.lexer.state.inLink = !1), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(e[0]) ? this.lexer.state.inRawBlock = !0 : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(e[0]) && (this.lexer.state.inRawBlock = !1), { type: "html", raw: e[0], inLink: this.lexer.state.inLink, inRawBlock: this.lexer.state.inRawBlock, block: !1, text: e[0] };
  }
  link(t) {
    if (this.lexer.state.linkParenPossible === !1) return;
    let e = this.rules.inline.link.exec(t);
    if (e) {
      let n = e[0].charAt(0) === "!" ? 2 : 1;
      if (!this.options.pedantic && Ri(t, e[1], n, this.rules)) return;
      let i = e[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(i)) {
        if (!this.rules.other.endAngleBracket.test(i)) return;
        let c = Qe(i.slice(0, -1), "\\");
        if ((i.length - c.length) % 2 === 0) return;
      } else {
        let c = Ei(e[2], "()");
        if (c === -2) return;
        if (c > -1) {
          let o = (e[0].indexOf("!") === 0 ? 5 : 4) + e[1].length + c;
          e[2] = e[2].substring(0, c), e[0] = e[0].substring(0, o).trim(), e[3] = "";
        }
      }
      let r = e[2], l = "";
      if (this.options.pedantic) {
        let c = this.rules.other.pedanticHrefTitle.exec(r);
        c && (r = c[1], l = c[3]);
      } else l = e[3] ? e[3].slice(1, -1) : "";
      return r = r.trim(), this.rules.other.startAngleBracket.test(r) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(i) ? r = r.slice(1) : r = r.slice(1, -1)), Ci(e, { href: r && r.replace(this.rules.inline.anyPunctuation, "$1"), title: l && l.replace(this.rules.inline.anyPunctuation, "$1") }, e[0], this.lexer, this.rules);
    }
  }
  reflink(t, e) {
    let n;
    if ((n = this.rules.inline.reflink.exec(t)) || (n = this.rules.inline.nolink.exec(t))) {
      let i = n[0].charAt(0) === "!" ? 2 : 1;
      if (!this.options.pedantic && Ri(t, n[1], i, this.rules)) return;
      let r = (n[2] || n[1]).replace(this.rules.other.multipleSpaceGlobal, " "), l = e[tn(r)];
      if (!l) {
        let c = n[0].charAt(0);
        return { type: "text", raw: c, text: c };
      }
      return Ci(n, l, n[0], this.lexer, this.rules);
    }
  }
  emStrong(t, e, n = "") {
    let i = this.rules.inline.emStrongLDelim.exec(t);
    if (!(!i || !i[1] && !i[2] && !i[3] && !i[4] || i[4] && n.match(this.rules.other.unicodeAlphaNumeric)) && (!(i[1] || i[3]) || !n || this.rules.inline.punctuation.exec(n))) {
      let r = [...i[0]].length - 1, l, c, o = r, p = 0, u = i[0][0], S = n === u, y = u === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (y.lastIndex = 0, e = e.slice(-1 * t.length + r); (i = y.exec(e)) !== null; ) {
        if (l = i[1] || i[2] || i[3] || i[4] || i[5] || i[6], !l) continue;
        if (c = [...l].length, i[3] || i[4]) {
          o += c;
          continue;
        } else if (i[5] || i[6]) {
          if (r % 3 && !((r + c) % 3)) {
            p += c;
            continue;
          }
          if (S) break;
        }
        if (o -= c, o > 0) continue;
        c = Math.min(c, c + o + p);
        let T = [...i[0]][0].length, _ = t.slice(0, r + i.index + T + c);
        if (Math.min(r, c) % 2) {
          let v = _.slice(1, -1);
          return { type: "em", raw: _, text: v, tokens: this.lexer.inlineTokens(v) };
        }
        let f = _.slice(2, -2);
        return { type: "strong", raw: _, text: f, tokens: this.lexer.inlineTokens(f) };
      }
    }
  }
  codespan(t) {
    let e = this.rules.inline.code.exec(t);
    if (e) {
      let n = e[2].replace(this.rules.other.newLineCharGlobal, " "), i = this.rules.other.nonSpaceChar.test(n), r = this.rules.other.startingSpaceChar.test(n) && this.rules.other.endingSpaceChar.test(n);
      return i && r && (n = n.substring(1, n.length - 1)), { type: "codespan", raw: e[0], text: n };
    }
  }
  br(t) {
    let e = this.rules.inline.br.exec(t);
    if (e) return { type: "br", raw: e[0] };
  }
  del(t, e, n = "") {
    let i = this.rules.inline.delLDelim.exec(t);
    if (i && (!i[1] || !n || this.rules.inline.punctuation.exec(n))) {
      let r = [...i[0]].length - 1, l, c, o = r, p = this.rules.inline.delRDelim;
      for (p.lastIndex = 0, e = e.slice(-1 * t.length + r); (i = p.exec(e)) !== null; ) {
        if (l = i[1] || i[2] || i[3] || i[4] || i[5] || i[6], !l || (c = [...l].length, c !== r)) continue;
        if (i[3] || i[4]) {
          o += c;
          continue;
        }
        if (o -= c, o > 0) continue;
        c = Math.min(c, c + o);
        let u = [...i[0]][0].length, S = t.slice(0, r + i.index + u + c), y = S.slice(r, -r);
        return { type: "del", raw: S, text: y, tokens: this.lexer.inlineTokens(y) };
      }
    }
  }
  autolink(t) {
    let e = this.rules.inline.autolink.exec(t);
    if (e) {
      let n, i;
      return e[2] === "@" ? (n = e[1], i = "mailto:" + n) : (n = e[1], i = n), { type: "link", raw: e[0], text: n, href: i, autolink: !0, tokens: [{ type: "text", raw: n, text: n }] };
    }
  }
  url(t) {
    let e;
    if (e = this.rules.inline.url.exec(t)) {
      let n, i;
      if (e[2] === "@") n = e[0], i = "mailto:" + n;
      else {
        let r;
        do
          r = e[0], e[0] = this.rules.inline._backpedal.exec(e[0])?.[0] ?? "";
        while (r !== e[0]);
        n = e[0], e[1] === "www." ? i = "http://" + e[0] : i = e[0];
      }
      return { type: "link", raw: e[0], text: n, href: i, autolink: !0, tokens: [{ type: "text", raw: n, text: n }] };
    }
  }
  inlineText(t) {
    let e = this.rules.inline.text.exec(t);
    if (e) {
      let n = this.lexer.state.inRawBlock;
      return { type: "text", raw: e[0], text: n ? e[0] : al(e[0]), escaped: n };
    }
  }
}, De = class Dn {
  tokens;
  options;
  state;
  inlineQueue;
  tokenizer;
  constructor(e) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || ot, this.options.tokenizer = this.options.tokenizer || new nn(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, linkEmitted: !1, linkParenPossible: !0, top: !0 };
    let n = { other: ge, block: Qt.normal, inline: Ct.normal };
    this.options.pedantic ? (n.block = Qt.pedantic, n.inline = Ct.pedantic) : this.options.gfm && (n.block = Qt.gfm, this.options.breaks ? n.inline = Ct.breaks : n.inline = Ct.gfm), this.tokenizer.rules = n;
  }
  static get rules() {
    return { block: Qt, inline: Ct };
  }
  static lex(e, n) {
    return new Dn(n).lex(e);
  }
  static lexInline(e, n) {
    return new Dn(n).inlineTokens(e);
  }
  lex(e) {
    e = e.replace(ge.carriageReturn, `
`), this.blockTokens(e, this.tokens);
    for (let n = 0; n < this.inlineQueue.length; n++) {
      let i = this.inlineQueue[n];
      this.inlineTokens(i.src, i.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, n = [], i = !1) {
    this.tokenizer.lexer = this, this.options.pedantic && (e = e.replace(ge.tabCharGlobal, "    ").replace(ge.spaceLine, ""));
    let r = 1 / 0;
    for (; e; ) {
      if (e.length < r) r = e.length;
      else {
        this.infiniteLoopError(e.charCodeAt(0));
        break;
      }
      let l;
      if (this.options.extensions?.block?.some((o) => (l = o.call({ lexer: this }, e, n)) ? (e = e.substring(l.raw.length), n.push(l), !0) : !1)) continue;
      if (l = this.tokenizer.space(e)) {
        e = e.substring(l.raw.length);
        let o = n.at(-1);
        l.raw.length === 1 && o !== void 0 ? o.raw += `
` : n.push(l);
        continue;
      }
      if (l = this.tokenizer.code(e)) {
        e = e.substring(l.raw.length);
        let o = n.at(-1);
        o?.type === "paragraph" || o?.type === "text" ? (o.raw += (o.raw.endsWith(`
`) ? "" : `
`) + l.raw, o.text += `
` + l.text, this.inlineQueue.at(-1).src = o.text) : n.push(l);
        continue;
      }
      if (l = this.tokenizer.fences(e)) {
        e = e.substring(l.raw.length), n.push(l);
        continue;
      }
      if (l = this.tokenizer.heading(e)) {
        e = e.substring(l.raw.length), n.push(l);
        continue;
      }
      if (l = this.tokenizer.hr(e)) {
        e = e.substring(l.raw.length), n.push(l);
        continue;
      }
      if (l = this.tokenizer.blockquote(e)) {
        e = e.substring(l.raw.length), n.push(l);
        continue;
      }
      if (l = this.tokenizer.list(e)) {
        e = e.substring(l.raw.length), n.push(l);
        continue;
      }
      if (l = this.tokenizer.html(e)) {
        e = e.substring(l.raw.length), n.push(l);
        continue;
      }
      if (l = this.tokenizer.def(e)) {
        e = e.substring(l.raw.length);
        let o = n.at(-1);
        o?.type === "paragraph" || o?.type === "text" ? (o.raw += (o.raw.endsWith(`
`) ? "" : `
`) + l.raw, o.text += `
` + l.raw, this.inlineQueue.at(-1).src = o.text) : this.tokens.links[l.tag] || (this.tokens.links[l.tag] = { href: l.href, title: l.title }, n.push(l));
        continue;
      }
      if (l = this.tokenizer.table(e)) {
        e = e.substring(l.raw.length), n.push(l);
        continue;
      }
      if (l = this.tokenizer.lheading(e)) {
        e = e.substring(l.raw.length), n.push(l);
        continue;
      }
      let c = e;
      if (this.options.extensions?.startBlock) {
        let o = 1 / 0, p = e.slice(1), u;
        this.options.extensions.startBlock.forEach((S) => {
          u = S.call({ lexer: this }, p), typeof u == "number" && u >= 0 && (o = Math.min(o, u));
        }), o < 1 / 0 && o >= 0 && (c = e.substring(0, o + 1));
      }
      if (this.state.top && (l = this.tokenizer.paragraph(c))) {
        let o = n.at(-1);
        i && o?.type === "paragraph" ? (o.raw += (o.raw.endsWith(`
`) ? "" : `
`) + l.raw, o.text += `
` + l.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = o.text) : n.push(l), i = c.length !== e.length, e = e.substring(l.raw.length);
        continue;
      }
      if (l = this.tokenizer.text(e)) {
        e = e.substring(l.raw.length);
        let o = n.at(-1);
        o?.type === "text" ? (o.raw += (o.raw.endsWith(`
`) ? "" : `
`) + l.raw, o.text += `
` + l.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = o.text) : n.push(l);
        continue;
      }
      if (e) {
        this.infiniteLoopError(e.charCodeAt(0));
        break;
      }
    }
    return this.state.top = !0, n;
  }
  inline(e, n = []) {
    return this.inlineQueue.push({ src: e, tokens: n }), n;
  }
  linkInText(e) {
    if (!e.includes("[")) return !1;
    let n = this.tokenizer.rules.inline.link;
    for (let i of e.matchAll(this.tokenizer.rules.inline.blockSkip)) if (n.test(i[0]) && e.charAt(i.index - 1) !== "!") return !0;
    for (let i of e.matchAll(this.tokenizer.rules.inline.reflinkSearch)) {
      let r = i[0], l = r.lastIndexOf("[");
      if (!(r.charAt(0) === "!" || !Object.hasOwn(this.tokens.links, tn(r.slice(l + 1, -1)))) && !(l > 1 && this.linkInText(r.slice(1, l - 1)))) return !0;
    }
    return !1;
  }
  inlineTokens(e, n = []) {
    this.tokenizer.lexer = this;
    let i = this.state.linkParenPossible;
    this.state.linkParenPossible = i && e.includes(")");
    try {
      return this.#e(e, n);
    } finally {
      this.state.linkParenPossible = i;
    }
  }
  #e(e, n) {
    let i = e;
    if (this.tokens.links && e.includes("[")) {
      let o = this.tokenizer.rules.inline.reflinkSearch, p = (u) => {
        let S = u.lastIndexOf("[");
        if (!Object.hasOwn(this.tokens.links, tn(u.slice(S + 1, -1)))) return u;
        if (S > 1 && u.charAt(0) !== "!") {
          let y = u.slice(1, S - 1);
          if (this.linkInText(y)) return "[" + y.replace(o, p) + "][" + "a".repeat(u.length - S - 2) + "]";
        }
        return "[" + "a".repeat(u.length - 2) + "]";
      };
      i = i.replace(o, p);
    }
    i = i.replace(this.tokenizer.rules.inline.anyPunctuation, (o) => "+".repeat(o.length)), i = i.replace(this.tokenizer.rules.inline.blockSkip, (o, p, u) => {
      let S = u ? u.length : 0;
      return o.slice(0, S) + "[" + "a".repeat(o.length - S - 2) + "]";
    }), i = this.options.hooks?.emStrongMask?.call({ lexer: this }, i) ?? i;
    let r = !1, l = "", c = 1 / 0;
    for (; e; ) {
      if (e.length < c) c = e.length;
      else {
        this.infiniteLoopError(e.charCodeAt(0));
        break;
      }
      r || (l = ""), r = !1;
      let o;
      if (this.options.extensions?.inline?.some((u) => (o = u.call({ lexer: this }, e, n)) ? (e = e.substring(o.raw.length), n.push(o), !0) : !1)) continue;
      if (o = this.tokenizer.escape(e)) {
        e = e.substring(o.raw.length), n.push(o);
        continue;
      }
      if (o = this.tokenizer.tag(e)) {
        e = e.substring(o.raw.length), n.push(o);
        continue;
      }
      if (o = this.tokenizer.link(e)) {
        e = e.substring(o.raw.length), n.push(o);
        continue;
      }
      if (o = this.tokenizer.reflink(e, this.tokens.links)) {
        e = e.substring(o.raw.length);
        let u = n.at(-1);
        o.type === "text" && u?.type === "text" ? (u.raw += o.raw, u.text += o.text) : n.push(o);
        continue;
      }
      if (o = this.tokenizer.emStrong(e, i, l)) {
        e = e.substring(o.raw.length), n.push(o);
        continue;
      }
      if (o = this.tokenizer.codespan(e)) {
        e = e.substring(o.raw.length), n.push(o);
        continue;
      }
      if (o = this.tokenizer.br(e)) {
        e = e.substring(o.raw.length), n.push(o);
        continue;
      }
      if (o = this.tokenizer.del(e, i, l)) {
        e = e.substring(o.raw.length), n.push(o);
        continue;
      }
      if (o = this.tokenizer.autolink(e)) {
        e = e.substring(o.raw.length), n.push(o);
        continue;
      }
      if (!this.state.inLink && (o = this.tokenizer.url(e))) {
        e = e.substring(o.raw.length), n.push(o);
        continue;
      }
      let p = e;
      if (this.options.extensions?.startInline) {
        let u = 1 / 0, S = e.slice(1), y;
        this.options.extensions.startInline.forEach((T) => {
          y = T.call({ lexer: this }, S), typeof y == "number" && y >= 0 && (u = Math.min(u, y));
        }), u < 1 / 0 && u >= 0 && (p = e.substring(0, u + 1));
      }
      if (o = this.tokenizer.inlineText(p)) {
        e = e.substring(o.raw.length), o.raw.slice(-1) !== "_" && (l = o.raw.slice(-1)), r = !0;
        let u = n.at(-1);
        u?.type === "text" ? (u.raw += o.raw, u.text += o.text) : n.push(o);
        continue;
      }
      if (e) {
        this.infiniteLoopError(e.charCodeAt(0));
        break;
      }
    }
    return n;
  }
  infiniteLoopError(e) {
    let n = "Infinite loop on byte: " + e;
    if (this.options.silent) console.error(n);
    else throw new Error(n);
  }
}, rn = class {
  options;
  parser;
  constructor(t) {
    this.options = t || ot;
  }
  space(t) {
    return "";
  }
  code({ text: t, lang: e, escaped: n }) {
    let i = (e || "").match(ge.notSpaceStart)?.[0], r = t ? t.replace(ge.endingNewline, "") + `
` : "";
    return i ? '<pre><code class="language-' + Ee(i) + '">' + (n ? r : Ee(r, !0)) + `</code></pre>
` : "<pre><code>" + (n ? r : Ee(r, !0)) + `</code></pre>
`;
  }
  blockquote({ tokens: t }) {
    return `<blockquote>
${this.parser.parse(t)}</blockquote>
`;
  }
  html({ text: t }) {
    return t;
  }
  def(t) {
    return "";
  }
  heading({ tokens: t, depth: e }) {
    return `<h${e}>${this.parser.parseInline(t)}</h${e}>
`;
  }
  hr(t) {
    return `<hr>
`;
  }
  list(t) {
    let e = t.ordered, n = t.start, i = "";
    for (let c = 0; c < t.items.length; c++) {
      let o = t.items[c];
      i += this.listitem(o);
    }
    let r = e ? "ol" : "ul", l = e && n !== 1 ? ' start="' + n + '"' : "";
    return "<" + r + l + `>
` + i + "</" + r + `>
`;
  }
  listitem(t) {
    return `<li>${this.parser.parse(t.tokens)}</li>
`;
  }
  checkbox({ checked: t }) {
    return "<input " + (t ? 'checked="" ' : "") + 'disabled="" type="checkbox"> ';
  }
  paragraph({ tokens: t }) {
    return `<p>${this.parser.parseInline(t)}</p>
`;
  }
  table(t) {
    let e = "", n = "";
    for (let r = 0; r < t.header.length; r++) n += this.tablecell(t.header[r]);
    e += this.tablerow({ text: n });
    let i = "";
    for (let r = 0; r < t.rows.length; r++) {
      let l = t.rows[r];
      n = "";
      for (let c = 0; c < l.length; c++) n += this.tablecell(l[c]);
      i += this.tablerow({ text: n });
    }
    return i && (i = `<tbody>${i}</tbody>`), `<table>
<thead>
` + e + `</thead>
` + i + `</table>
`;
  }
  tablerow({ text: t }) {
    return `<tr>
${t}</tr>
`;
  }
  tablecell(t) {
    let e = this.parser.parseInline(t.tokens), n = t.header ? "th" : "td";
    return (t.align ? `<${n} align="${t.align}">` : `<${n}>`) + e + `</${n}>
`;
  }
  strong({ tokens: t }) {
    return `<strong>${this.parser.parseInline(t)}</strong>`;
  }
  em({ tokens: t }) {
    return `<em>${this.parser.parseInline(t)}</em>`;
  }
  codespan({ text: t }) {
    return `<code>${Ee(t, !0)}</code>`;
  }
  br(t) {
    return "<br>";
  }
  del({ tokens: t }) {
    return `<del>${this.parser.parseInline(t)}</del>`;
  }
  link({ href: t, title: e, text: n, tokens: i, autolink: r }) {
    let l = r ? Ee(n, !0) : this.parser.parseInline(i), c = Si(t);
    if (c === null) return l;
    t = Ee(c, r);
    let o = '<a href="' + t + '"';
    return e && (o += ' title="' + Ee(e) + '"'), o += ">" + l + "</a>", o;
  }
  image({ href: t, title: e, text: n, tokens: i }) {
    i && (n = this.parser.parseInline(i, this.parser.textRenderer));
    let r = Si(t);
    if (r === null) return Ee(n);
    t = r;
    let l = `<img src="${Ee(t)}" alt="${Ee(n)}"`;
    return e && (l += ` title="${Ee(e)}"`), l += ">", l;
  }
  text(t) {
    return "tokens" in t && t.tokens ? this.parser.parseInline(t.tokens) : "escaped" in t && t.escaped ? t.text : Ee(t.text);
  }
}, Kn = class {
  strong({ text: t }) {
    return t;
  }
  em({ text: t }) {
    return t;
  }
  codespan({ text: t }) {
    return t;
  }
  del({ text: t }) {
    return t;
  }
  html({ text: t }) {
    return t;
  }
  text({ text: t }) {
    return t;
  }
  link({ text: t }) {
    return "" + t;
  }
  image({ text: t }) {
    return "" + t;
  }
  br() {
    return "";
  }
  checkbox({ raw: t }) {
    return t;
  }
}, Ie = class In {
  options;
  renderer;
  textRenderer;
  constructor(e) {
    this.options = e || ot, this.options.renderer = this.options.renderer || new rn(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new Kn();
  }
  static parse(e, n) {
    return new In(n).parse(e);
  }
  static parseInline(e, n) {
    return new In(n).parseInline(e);
  }
  parse(e) {
    this.renderer.parser = this;
    let n = "";
    for (let i = 0; i < e.length; i++) {
      let r = e[i];
      if (this.options.extensions?.renderers?.[r.type]) {
        let c = r, o = this.options.extensions.renderers[c.type].call({ parser: this }, c);
        if (o !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "checkbox", "html", "def", "paragraph", "text"].includes(c.type)) {
          n += o || "";
          continue;
        }
      }
      let l = r;
      switch (l.type) {
        case "space": {
          n += this.renderer.space(l);
          break;
        }
        case "hr": {
          n += this.renderer.hr(l);
          break;
        }
        case "heading": {
          n += this.renderer.heading(l);
          break;
        }
        case "code": {
          n += this.renderer.code(l);
          break;
        }
        case "table": {
          n += this.renderer.table(l);
          break;
        }
        case "blockquote": {
          n += this.renderer.blockquote(l);
          break;
        }
        case "list": {
          n += this.renderer.list(l);
          break;
        }
        case "checkbox": {
          n += this.renderer.checkbox(l);
          break;
        }
        case "html": {
          n += this.renderer.html(l);
          break;
        }
        case "def": {
          n += this.renderer.def(l);
          break;
        }
        case "paragraph": {
          n += this.renderer.paragraph(l);
          break;
        }
        case "text": {
          n += this.renderer.text(l);
          break;
        }
        default: {
          let c = 'Token with "' + l.type + '" type was not found.';
          if (this.options.silent) return console.error(c), "";
          throw new Error(c);
        }
      }
    }
    return n;
  }
  parseInline(e, n = this.renderer) {
    this.renderer.parser = this;
    let i = "";
    for (let r = 0; r < e.length; r++) {
      let l = e[r];
      if (this.options.extensions?.renderers?.[l.type]) {
        let o = this.options.extensions.renderers[l.type].call({ parser: this }, l);
        if (o !== !1 || !["escape", "html", "link", "image", "checkbox", "strong", "em", "codespan", "br", "del", "text"].includes(l.type)) {
          i += o || "";
          continue;
        }
      }
      let c = l;
      switch (c.type) {
        case "escape": {
          i += n.text(c);
          break;
        }
        case "html": {
          i += n.html(c);
          break;
        }
        case "link": {
          i += n.link(c);
          break;
        }
        case "image": {
          i += n.image(c);
          break;
        }
        case "checkbox": {
          i += n.checkbox(c);
          break;
        }
        case "strong": {
          i += n.strong(c);
          break;
        }
        case "em": {
          i += n.em(c);
          break;
        }
        case "codespan": {
          i += n.codespan(c);
          break;
        }
        case "br": {
          i += n.br(c);
          break;
        }
        case "del": {
          i += n.del(c);
          break;
        }
        case "text": {
          i += n.text(c);
          break;
        }
        default: {
          let o = 'Token with "' + c.type + '" type was not found.';
          if (this.options.silent) return console.error(o), "";
          throw new Error(o);
        }
      }
    }
    return i;
  }
}, It = class {
  options;
  block;
  constructor(t) {
    this.options = t || ot;
  }
  static passThroughHooks = /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens", "emStrongMask"]);
  static passThroughHooksRespectAsync = /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens"]);
  preprocess(t) {
    return t;
  }
  postprocess(t) {
    return t;
  }
  processAllTokens(t) {
    return t;
  }
  emStrongMask(t) {
    return t;
  }
  provideLexer(t = this.block) {
    return t ? De.lex : De.lexInline;
  }
  provideParser(t = this.block) {
    return t ? Ie.parse : Ie.parseInline;
  }
}, pr = class {
  defaults = Un();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = Ie;
  Renderer = rn;
  TextRenderer = Kn;
  Lexer = De;
  Tokenizer = nn;
  Hooks = It;
  constructor(...t) {
    this.use(...t);
  }
  walkTokens(t, e) {
    let n = [];
    for (let i of t) switch (n = n.concat(e.call(this, i)), i.type) {
      case "table": {
        let r = i;
        for (let l of r.header) n = n.concat(this.walkTokens(l.tokens, e));
        for (let l of r.rows) for (let c of l) n = n.concat(this.walkTokens(c.tokens, e));
        break;
      }
      case "list": {
        let r = i;
        n = n.concat(this.walkTokens(r.items, e));
        break;
      }
      default: {
        let r = i;
        this.defaults.extensions?.childTokens?.[r.type] ? this.defaults.extensions.childTokens[r.type].forEach((l) => {
          let c = r[l].flat(1 / 0);
          n = n.concat(this.walkTokens(c, e));
        }) : r.tokens && (n = n.concat(this.walkTokens(r.tokens, e)));
      }
    }
    return n;
  }
  use(...t) {
    let e = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return t.forEach((n) => {
      let i = { ...n };
      if (i.async = this.defaults.async || i.async || !1, n.extensions && (n.extensions.forEach((r) => {
        if (!r.name) throw new Error("extension name required");
        if ("renderer" in r) {
          let l = e.renderers[r.name];
          l ? e.renderers[r.name] = function(...c) {
            let o = r.renderer.apply(this, c);
            return o === !1 && (o = l.apply(this, c)), o;
          } : e.renderers[r.name] = r.renderer;
        }
        if ("tokenizer" in r) {
          if (!r.level || r.level !== "block" && r.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
          let l = e[r.level];
          l ? l.unshift(r.tokenizer) : e[r.level] = [r.tokenizer], r.start && (r.level === "block" ? e.startBlock ? e.startBlock.push(r.start) : e.startBlock = [r.start] : r.level === "inline" && (e.startInline ? e.startInline.push(r.start) : e.startInline = [r.start]));
        }
        "childTokens" in r && r.childTokens && (e.childTokens[r.name] = r.childTokens);
      }), i.extensions = e), n.renderer) {
        let r = this.defaults.renderer || new rn(this.defaults);
        for (let l in n.renderer) {
          if (!(l in r)) throw new Error(`renderer '${l}' does not exist`);
          if (["options", "parser"].includes(l)) continue;
          let c = l, o = n.renderer[c], p = r[c];
          r[c] = (...u) => {
            let S = o.apply(r, u);
            return S === !1 && (S = p.apply(r, u)), S || "";
          };
        }
        i.renderer = r;
      }
      if (n.tokenizer) {
        let r = this.defaults.tokenizer || new nn(this.defaults);
        for (let l in n.tokenizer) {
          if (!(l in r)) throw new Error(`tokenizer '${l}' does not exist`);
          if (["options", "rules", "lexer"].includes(l)) continue;
          let c = l, o = n.tokenizer[c], p = r[c];
          r[c] = (...u) => {
            let S = o.apply(r, u);
            return S === !1 && (S = p.apply(r, u)), S;
          };
        }
        i.tokenizer = r;
      }
      if (n.hooks) {
        let r = this.defaults.hooks || new It();
        for (let l in n.hooks) {
          if (!(l in r)) throw new Error(`hook '${l}' does not exist`);
          if (["options", "block"].includes(l)) continue;
          let c = l, o = n.hooks[c], p = r[c];
          It.passThroughHooks.has(l) ? r[c] = (u) => {
            if (this.defaults.async && It.passThroughHooksRespectAsync.has(l)) return (async () => {
              let y = await o.call(r, u);
              return p.call(r, y);
            })();
            let S = o.call(r, u);
            return p.call(r, S);
          } : r[c] = (...u) => {
            if (this.defaults.async) return (async () => {
              let y = await o.apply(r, u);
              return y === !1 && (y = await p.apply(r, u)), y;
            })();
            let S = o.apply(r, u);
            return S === !1 && (S = p.apply(r, u)), S;
          };
        }
        i.hooks = r;
      }
      if (n.walkTokens) {
        let r = this.defaults.walkTokens, l = n.walkTokens;
        i.walkTokens = function(c) {
          let o = [];
          return o.push(l.call(this, c)), r && (o = o.concat(r.call(this, c))), o;
        };
      }
      this.defaults = { ...this.defaults, ...i };
    }), this;
  }
  setOptions(t) {
    return this.defaults = { ...this.defaults, ...t }, this;
  }
  lexer(t, e) {
    return De.lex(t, e ?? this.defaults);
  }
  parser(t, e) {
    return Ie.parse(t, e ?? this.defaults);
  }
  parseMarkdown(t) {
    return (e, n) => {
      let i = { ...n }, r = { ...this.defaults, ...i }, l = this.onError(!!r.silent, !!r.async);
      if (this.defaults.async === !0 && i.async === !1) return l(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof e > "u" || e === null) return l(new Error("marked(): input parameter is undefined or null"));
      if (typeof e != "string") return l(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(e) + ", string expected"));
      if (r.hooks && (r.hooks.options = r, r.hooks.block = t), r.async) return (async () => {
        let c = r.hooks ? await r.hooks.preprocess(e) : e, o = await (r.hooks ? await r.hooks.provideLexer(t) : t ? De.lex : De.lexInline)(c, r), p = r.hooks ? await r.hooks.processAllTokens(o) : o;
        r.walkTokens && await Promise.all(this.walkTokens(p, r.walkTokens));
        let u = await (r.hooks ? await r.hooks.provideParser(t) : t ? Ie.parse : Ie.parseInline)(p, r);
        return r.hooks ? await r.hooks.postprocess(u) : u;
      })().catch(l);
      try {
        r.hooks && (e = r.hooks.preprocess(e));
        let c = (r.hooks ? r.hooks.provideLexer(t) : t ? De.lex : De.lexInline)(e, r);
        r.hooks && (c = r.hooks.processAllTokens(c)), r.walkTokens && this.walkTokens(c, r.walkTokens);
        let o = (r.hooks ? r.hooks.provideParser(t) : t ? Ie.parse : Ie.parseInline)(c, r);
        return r.hooks && (o = r.hooks.postprocess(o)), o;
      } catch (c) {
        return l(c);
      }
    };
  }
  onError(t, e) {
    return (n) => {
      if (n.message += `
Please report this to https://github.com/markedjs/marked.`, t) {
        let i = "<p>An error occurred:</p><pre>" + Ee(n.message + "", !0) + "</pre>";
        return e ? Promise.resolve(i) : i;
      }
      if (e) return Promise.reject(n);
      throw n;
    };
  }
}, lt = new pr();
function ee(t, e) {
  return lt.parse(t, e);
}
ee.options = ee.setOptions = function(t) {
  return lt.setOptions(t), ee.defaults = lt.defaults, nr(ee.defaults), ee;
};
ee.getDefaults = Un;
ee.defaults = ot;
function ol(...t) {
  return lt.use(...t), ee.defaults = lt.defaults, nr(ee.defaults), ee;
}
ee.use = ol;
ee.walkTokens = function(t, e) {
  return lt.walkTokens(t, e);
};
ee.parseInline = lt.parseInline;
ee.Parser = Ie;
ee.parser = Ie.parse;
ee.Renderer = rn;
ee.TextRenderer = Kn;
ee.Lexer = De;
ee.lexer = De.lex;
ee.Tokenizer = nn;
ee.Hooks = It;
ee.parse = ee;
ee.options;
ee.setOptions;
ee.walkTokens;
ee.parseInline;
Ie.parse;
De.lex;
function zi(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var n = 0, i = Array(e); n < e; n++) i[n] = t[n];
  return i;
}
function sl(t) {
  if (Array.isArray(t)) return t;
}
function cl(t, e) {
  var n = t == null ? null : typeof Symbol < "u" && t[Symbol.iterator] || t["@@iterator"];
  if (n != null) {
    var i, r, l, c, o = [], p = !0, u = !1;
    try {
      if (l = (n = n.call(t)).next, e !== 0) for (; !(p = (i = l.call(n)).done) && (o.push(i.value), o.length !== e); p = !0) ;
    } catch (S) {
      u = !0, r = S;
    } finally {
      try {
        if (!p && n.return != null && (c = n.return(), Object(c) !== c)) return;
      } finally {
        if (u) throw r;
      }
    }
    return o;
  }
}
function dl() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function pl(t, e) {
  return sl(t) || cl(t, e) || ul(t, e) || dl();
}
function ul(t, e) {
  if (t) {
    if (typeof t == "string") return zi(t, e);
    var n = {}.toString.call(t).slice(8, -1);
    return n === "Object" && t.constructor && (n = t.constructor.name), n === "Map" || n === "Set" ? Array.from(t) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? zi(t, e) : void 0;
  }
}
const ur = Object.entries, $i = Object.setPrototypeOf, hl = Object.isFrozen, hr = Object.getPrototypeOf, fr = Object.getOwnPropertyDescriptor;
let fe = Object.freeze, xe = Object.seal, gt = Object.create, br = typeof Reflect < "u" && Reflect, On = br.apply, Pn = br.construct;
fe || (fe = function(e) {
  return e;
});
xe || (xe = function(e) {
  return e;
});
On || (On = function(e, n) {
  for (var i = arguments.length, r = new Array(i > 2 ? i - 2 : 0), l = 2; l < i; l++) r[l - 2] = arguments[l];
  return e.apply(n, r);
});
Pn || (Pn = function(e) {
  for (var n = arguments.length, i = new Array(n > 1 ? n - 1 : 0), r = 1; r < n; r++) i[r - 1] = arguments[r];
  return new e(...i);
});
const We = ie(Array.prototype.forEach), fl = ie(Array.prototype.lastIndexOf), Li = ie(Array.prototype.pop), Rt = ie(Array.prototype.push), bl = ie(Array.prototype.slice), ml = ie(Array.prototype.splice), xt = Array.isArray, Tn = mr(Set), Sn = ie(Set.prototype.add), zt = ie(Set.prototype.has), rt = ie(String.prototype.toLowerCase), _n = ie(String.prototype.toString), Di = ie(String.prototype.match), $t = ie(String.prototype.replace), Ii = ie(String.prototype.indexOf), gl = ie(String.prototype.trim), xl = ie(Number.prototype.toString), kl = ie(Boolean.prototype.toString), Oi = typeof BigInt > "u" ? null : ie(BigInt.prototype.toString), Pi = typeof Symbol > "u" ? null : ie(Symbol.prototype.toString), _e = ie(Object.prototype.hasOwnProperty), Lt = ie(Object.prototype.toString), me = ie(RegExp.prototype.test), Ge = mr(TypeError);
function ie(t) {
  return function(e) {
    e instanceof RegExp && (e.lastIndex = 0);
    for (var n = arguments.length, i = new Array(n > 1 ? n - 1 : 0), r = 1; r < n; r++) i[r - 1] = arguments[r];
    return On(t, e, i);
  };
}
function mr(t) {
  return function() {
    for (var e = arguments.length, n = new Array(e), i = 0; i < e; i++) n[i] = arguments[i];
    return Pn(t, n);
  };
}
function j(t, e) {
  let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : rt;
  if ($i && $i(t, null), !xt(e)) return t;
  let i = e.length;
  for (; i--; ) {
    let r = e[i];
    if (typeof r == "string") {
      const l = n(r);
      l !== r && (hl(e) || (e[i] = l), r = l);
    }
    t[r] = !0;
  }
  return t;
}
function vl(t) {
  for (let e = 0; e < t.length; e++) _e(t, e) || (t[e] = null);
  return t;
}
function Ne(t) {
  const e = gt(null);
  for (const i of ur(t)) {
    var n = pl(i, 2);
    const r = n[0], l = n[1];
    _e(t, r) && (xt(l) ? e[r] = vl(l) : l && typeof l == "object" && l.constructor === Object ? e[r] = Ne(l) : e[r] = l);
  }
  return e;
}
function yl(t) {
  switch (typeof t) {
    case "string":
      return t;
    case "number":
      return xl(t);
    case "boolean":
      return kl(t);
    case "bigint":
      return Oi ? Oi(t) : "0";
    case "symbol":
      return Pi ? Pi(t) : "Symbol()";
    case "undefined":
      return Lt(t);
    case "function":
    case "object": {
      if (t === null) return Lt(t);
      const e = t, n = Re(e, "toString");
      if (typeof n == "function") {
        const i = n(e);
        return typeof i == "string" ? i : Lt(i);
      }
      return Lt(t);
    }
    default:
      return Lt(t);
  }
}
function Re(t, e) {
  for (; t !== null; ) {
    const i = fr(t, e);
    if (i) {
      if (i.get) return ie(i.get);
      if (typeof i.value == "function") return ie(i.value);
    }
    t = hr(t);
  }
  function n() {
    return null;
  }
  return n;
}
function wl(t, e) {
  for (; t !== null; ) {
    const n = fr(t, e);
    if (n) return n.get ? ie(n.get) : null;
    t = hr(t);
  }
  return null;
}
function Tl(t) {
  try {
    return me(t, ""), !0;
  } catch {
    return !1;
  }
}
const Mi = fe([
  "a",
  "abbr",
  "acronym",
  "address",
  "area",
  "article",
  "aside",
  "audio",
  "b",
  "bdi",
  "bdo",
  "big",
  "blink",
  "blockquote",
  "body",
  "br",
  "button",
  "canvas",
  "caption",
  "center",
  "cite",
  "code",
  "col",
  "colgroup",
  "content",
  "data",
  "datalist",
  "dd",
  "decorator",
  "del",
  "details",
  "dfn",
  "dialog",
  "dir",
  "div",
  "dl",
  "dt",
  "element",
  "em",
  "fieldset",
  "figcaption",
  "figure",
  "font",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hgroup",
  "hr",
  "html",
  "i",
  "img",
  "input",
  "ins",
  "kbd",
  "label",
  "legend",
  "li",
  "main",
  "map",
  "mark",
  "marquee",
  "menu",
  "menuitem",
  "meter",
  "nav",
  "nobr",
  "ol",
  "optgroup",
  "option",
  "output",
  "p",
  "picture",
  "pre",
  "progress",
  "q",
  "rp",
  "rt",
  "ruby",
  "s",
  "samp",
  "search",
  "section",
  "select",
  "shadow",
  "slot",
  "small",
  "source",
  "spacer",
  "span",
  "strike",
  "strong",
  "style",
  "sub",
  "summary",
  "sup",
  "table",
  "tbody",
  "td",
  "template",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "time",
  "tr",
  "track",
  "tt",
  "u",
  "ul",
  "var",
  "video",
  "wbr"
]), An = fe([
  "svg",
  "a",
  "altglyph",
  "altglyphdef",
  "altglyphitem",
  "animatecolor",
  "animatemotion",
  "animatetransform",
  "circle",
  "clippath",
  "defs",
  "desc",
  "ellipse",
  "enterkeyhint",
  "exportparts",
  "filter",
  "font",
  "g",
  "glyph",
  "glyphref",
  "hkern",
  "image",
  "inputmode",
  "line",
  "lineargradient",
  "marker",
  "mask",
  "metadata",
  "mpath",
  "part",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "radialgradient",
  "rect",
  "stop",
  "style",
  "switch",
  "symbol",
  "text",
  "textpath",
  "title",
  "tref",
  "tspan",
  "view",
  "vkern"
]), En = fe([
  "feBlend",
  "feColorMatrix",
  "feComponentTransfer",
  "feComposite",
  "feConvolveMatrix",
  "feDiffuseLighting",
  "feDisplacementMap",
  "feDistantLight",
  "feDropShadow",
  "feFlood",
  "feFuncA",
  "feFuncB",
  "feFuncG",
  "feFuncR",
  "feGaussianBlur",
  "feImage",
  "feMerge",
  "feMergeNode",
  "feMorphology",
  "feOffset",
  "fePointLight",
  "feSpecularLighting",
  "feSpotLight",
  "feTile",
  "feTurbulence"
]), Sl = fe([
  "animate",
  "color-profile",
  "cursor",
  "discard",
  "font-face",
  "font-face-format",
  "font-face-name",
  "font-face-src",
  "font-face-uri",
  "foreignobject",
  "hatch",
  "hatchpath",
  "mesh",
  "meshgradient",
  "meshpatch",
  "meshrow",
  "missing-glyph",
  "script",
  "set",
  "solidcolor",
  "unknown",
  "use"
]), Nn = fe([
  "math",
  "menclose",
  "merror",
  "mfenced",
  "mfrac",
  "mglyph",
  "mi",
  "mlabeledtr",
  "mmultiscripts",
  "mn",
  "mo",
  "mover",
  "mpadded",
  "mphantom",
  "mroot",
  "mrow",
  "ms",
  "mspace",
  "msqrt",
  "mstyle",
  "msub",
  "msup",
  "msubsup",
  "mtable",
  "mtd",
  "mtext",
  "mtr",
  "munder",
  "munderover",
  "mprescripts"
]), _l = fe([
  "maction",
  "maligngroup",
  "malignmark",
  "mlongdiv",
  "mscarries",
  "mscarry",
  "msgroup",
  "mstack",
  "msline",
  "msrow",
  "semantics",
  "annotation",
  "annotation-xml",
  "mprescripts",
  "none"
]), Fi = fe(["#text"]), qi = fe([
  "accept",
  "action",
  "align",
  "alt",
  "autocapitalize",
  "autocomplete",
  "autopictureinpicture",
  "autoplay",
  "background",
  "bgcolor",
  "border",
  "capture",
  "cellpadding",
  "cellspacing",
  "checked",
  "cite",
  "class",
  "clear",
  "color",
  "cols",
  "colspan",
  "command",
  "commandfor",
  "controls",
  "controlslist",
  "coords",
  "crossorigin",
  "datetime",
  "decoding",
  "default",
  "dir",
  "disabled",
  "disablepictureinpicture",
  "disableremoteplayback",
  "download",
  "draggable",
  "enctype",
  "enterkeyhint",
  "exportparts",
  "face",
  "for",
  "headers",
  "height",
  "hidden",
  "high",
  "href",
  "hreflang",
  "id",
  "inert",
  "inputmode",
  "integrity",
  "ismap",
  "kind",
  "label",
  "lang",
  "list",
  "loading",
  "loop",
  "low",
  "max",
  "maxlength",
  "media",
  "method",
  "min",
  "minlength",
  "multiple",
  "muted",
  "name",
  "nonce",
  "noshade",
  "novalidate",
  "nowrap",
  "open",
  "optimum",
  "part",
  "pattern",
  "placeholder",
  "playsinline",
  "popover",
  "popovertarget",
  "popovertargetaction",
  "poster",
  "preload",
  "pubdate",
  "radiogroup",
  "readonly",
  "rel",
  "required",
  "rev",
  "reversed",
  "role",
  "rows",
  "rowspan",
  "spellcheck",
  "scope",
  "selected",
  "shape",
  "size",
  "sizes",
  "slot",
  "span",
  "srclang",
  "start",
  "src",
  "srcset",
  "step",
  "style",
  "summary",
  "tabindex",
  "title",
  "translate",
  "type",
  "usemap",
  "valign",
  "value",
  "width",
  "wrap",
  "xmlns"
]), Cn = fe([
  "accent-height",
  "accumulate",
  "additive",
  "alignment-baseline",
  "amplitude",
  "ascent",
  "attributename",
  "attributetype",
  "azimuth",
  "basefrequency",
  "baseline-shift",
  "begin",
  "bias",
  "by",
  "class",
  "clip",
  "clippathunits",
  "clip-path",
  "clip-rule",
  "color",
  "color-interpolation",
  "color-interpolation-filters",
  "color-profile",
  "color-rendering",
  "cx",
  "cy",
  "d",
  "dx",
  "dy",
  "diffuseconstant",
  "direction",
  "display",
  "divisor",
  "dominant-baseline",
  "dur",
  "edgemode",
  "elevation",
  "end",
  "exponent",
  "fill",
  "fill-opacity",
  "fill-rule",
  "filter",
  "filterunits",
  "flood-color",
  "flood-opacity",
  "font-family",
  "font-size",
  "font-size-adjust",
  "font-stretch",
  "font-style",
  "font-variant",
  "font-weight",
  "fx",
  "fy",
  "g1",
  "g2",
  "glyph-name",
  "glyphref",
  "gradientunits",
  "gradienttransform",
  "height",
  "href",
  "id",
  "image-rendering",
  "in",
  "in2",
  "intercept",
  "k",
  "k1",
  "k2",
  "k3",
  "k4",
  "kerning",
  "keypoints",
  "keysplines",
  "keytimes",
  "lang",
  "lengthadjust",
  "letter-spacing",
  "kernelmatrix",
  "kernelunitlength",
  "lighting-color",
  "local",
  "marker-end",
  "marker-mid",
  "marker-start",
  "markerheight",
  "markerunits",
  "markerwidth",
  "maskcontentunits",
  "maskunits",
  "max",
  "mask",
  "mask-type",
  "media",
  "method",
  "mode",
  "min",
  "name",
  "numoctaves",
  "offset",
  "operator",
  "opacity",
  "order",
  "orient",
  "orientation",
  "origin",
  "overflow",
  "paint-order",
  "path",
  "pathlength",
  "patterncontentunits",
  "patterntransform",
  "patternunits",
  "pointer-events",
  "points",
  "preservealpha",
  "preserveaspectratio",
  "primitiveunits",
  "r",
  "rx",
  "ry",
  "radius",
  "refx",
  "refy",
  "repeatcount",
  "repeatdur",
  "restart",
  "result",
  "rotate",
  "scale",
  "seed",
  "shape-rendering",
  "slope",
  "specularconstant",
  "specularexponent",
  "spreadmethod",
  "startoffset",
  "stddeviation",
  "stitchtiles",
  "stop-color",
  "stop-opacity",
  "stroke-dasharray",
  "stroke-dashoffset",
  "stroke-linecap",
  "stroke-linejoin",
  "stroke-miterlimit",
  "stroke-opacity",
  "stroke",
  "stroke-width",
  "style",
  "surfacescale",
  "systemlanguage",
  "tabindex",
  "tablevalues",
  "targetx",
  "targety",
  "transform",
  "transform-origin",
  "text-anchor",
  "text-decoration",
  "text-orientation",
  "text-rendering",
  "textlength",
  "type",
  "u1",
  "u2",
  "unicode",
  "values",
  "vector-effect",
  "viewbox",
  "visibility",
  "version",
  "vert-adv-y",
  "vert-origin-x",
  "vert-origin-y",
  "width",
  "word-spacing",
  "wrap",
  "writing-mode",
  "xchannelselector",
  "ychannelselector",
  "x",
  "x1",
  "x2",
  "xmlns",
  "y",
  "y1",
  "y2",
  "z",
  "zoomandpan"
]), Ui = fe([
  "accent",
  "accentunder",
  "align",
  "bevelled",
  "close",
  "columnalign",
  "columnlines",
  "columnspacing",
  "columnspan",
  "denomalign",
  "depth",
  "dir",
  "display",
  "displaystyle",
  "encoding",
  "fence",
  "frame",
  "height",
  "href",
  "id",
  "largeop",
  "length",
  "linethickness",
  "lquote",
  "lspace",
  "mathbackground",
  "mathcolor",
  "mathsize",
  "mathvariant",
  "maxsize",
  "minsize",
  "movablelimits",
  "notation",
  "numalign",
  "open",
  "rowalign",
  "rowlines",
  "rowspacing",
  "rowspan",
  "rspace",
  "rquote",
  "scriptlevel",
  "scriptminsize",
  "scriptsizemultiplier",
  "selection",
  "separator",
  "separators",
  "stretchy",
  "subscriptshift",
  "supscriptshift",
  "symmetric",
  "voffset",
  "width",
  "xmlns"
]), Vt = fe([
  "xlink:href",
  "xml:id",
  "xlink:title",
  "xml:space",
  "xmlns:xlink"
]), Al = xe(/{{[\w\W]*|^[\w\W]*}}/g), El = xe(/<%[\w\W]*|^[\w\W]*%>/g), Nl = xe(/\${[\w\W]*/g), Cl = xe(/^data-[\-\w.\u00B7-\uFFFF]+$/), Rl = xe(/^aria-[\-\w]+$/), Bi = xe(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i), zl = xe(/^(?:\w+script|data):/i), $l = xe(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g), Ll = xe(/^html$/i), Dl = xe(/^[a-z][.\w]*(-[.\w]+)+$/i), Rn = xe(/<[/\w!]/g), Hi = xe(/<[/\w]/g), Il = xe(/<\/no(script|embed|frames)/i), Wi = xe(/\/>/i), ce = {
  element: 1,
  attribute: 2,
  text: 3,
  cdataSection: 4,
  entityReference: 5,
  entityNode: 6,
  processingInstruction: 7,
  comment: 8,
  document: 9,
  documentType: 10,
  documentFragment: 11,
  notation: 12
}, Ol = fe(j({}, [
  "style",
  "script",
  "xmp",
  "iframe",
  "noembed",
  "noframes",
  "plaintext",
  "noscript"
])), Pl = function() {
  return typeof window > "u" ? null : window;
}, Ml = function(e, n) {
  if (typeof e != "object" || typeof e.createPolicy != "function") return null;
  let i = null;
  const r = "data-tt-policy-suffix";
  n && n.hasAttribute(r) && (i = n.getAttribute(r));
  const l = "dompurify" + (i ? "#" + i : "");
  try {
    return e.createPolicy(l, {
      createHTML(c) {
        return c;
      },
      createScriptURL(c) {
        return c;
      }
    });
  } catch {
    return console.warn("TrustedTypes policy " + l + " could not be created."), null;
  }
}, Gi = function() {
  return {
    afterSanitizeAttributes: [],
    afterSanitizeElements: [],
    afterSanitizeShadowDOM: [],
    beforeSanitizeAttributes: [],
    beforeSanitizeElements: [],
    beforeSanitizeShadowDOM: [],
    uponSanitizeAttribute: [],
    uponSanitizeElement: [],
    uponSanitizeShadowNode: []
  };
}, Ve = function(e, n, i, r) {
  return _e(e, n) && xt(e[n]) ? j(r.base ? Ne(r.base) : {}, e[n], r.transform) : i;
}, zn = function(e, n, i) {
  const r = _e(e, n) ? e[n] : void 0;
  return r && typeof r == "object" ? Ne(r) : i();
};
function gr() {
  let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : Pl();
  const e = (g) => gr(g);
  if (e.version = "3.4.17", e.removed = [], !t || !t.document || t.document.nodeType !== ce.document || !t.Element)
    return e.isSupported = !1, e;
  let n = t.document;
  const i = n, r = i.currentScript;
  t.DocumentFragment;
  const l = t.HTMLTemplateElement, c = t.Node, o = t.Element, p = t.NodeFilter;
  t.NamedNodeMap === void 0 && (t.NamedNodeMap || t.MozNamedAttrMap), t.HTMLFormElement;
  const u = t.DOMParser, S = t.trustedTypes, y = o.prototype, T = Re(y, "cloneNode"), _ = Re(y, "remove"), f = Re(y, "removeAttributeNode"), v = Re(y, "nextSibling"), E = Re(y, "childNodes"), O = Re(y, "parentNode"), L = Re(y, "shadowRoot"), D = Re(y, "attributes"), Y = c && c.prototype ? Re(c.prototype, "nodeType") : null, B = c && c.prototype ? Re(c.prototype, "nodeName") : null, ue = c && c.prototype ? Re(c.prototype, "ownerDocument") : null, Z = function(a) {
    return Y ? Y(a) : a.nodeType;
  }, oe = function(a) {
    return B ? B(a) : a.nodeName;
  }, ke = wl(y, "namespaceURI"), w = function(a) {
    return ke ? ke(a) : a.namespaceURI;
  };
  if (typeof l == "function") {
    const g = n.createElement("template");
    g.content && g.content.ownerDocument && (n = g.content.ownerDocument);
  }
  let N, H = "", F, q = !1, W = 0;
  const k = function() {
    if (W > 0) throw Ge('A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.');
  }, $ = function(a) {
    k(), W++;
    try {
      return N.createHTML(a);
    } finally {
      W--;
    }
  }, re = function(a) {
    k(), W++;
    try {
      return N.createScriptURL(a);
    } finally {
      W--;
    }
  }, ne = function() {
    return q || (F = Ml(S, r), q = !0), F;
  }, ae = n, Ae = ae.implementation, ze = ae.createNodeIterator, qt = ae.createDocumentFragment, Ue = ae.getElementsByTagName, Oe = i.importNode;
  let Q = Gi();
  e.isSupported = typeof ur == "function" && typeof O == "function" && Ae && Ae.createHTMLDocument !== void 0;
  const vt = Al, an = El, ln = Nl, st = Cl, Ut = Rl, Pe = zl, Bt = $l, yt = Dl;
  let wt = Bi, te = null;
  const Tt = j({}, [
    ...Mi,
    ...An,
    ...En,
    ...Nn,
    ...Fi
  ]);
  let V = null;
  const St = j({}, [
    ...qi,
    ...Cn,
    ...Ui,
    ...Vt
  ]);
  let se = Object.seal(gt(null, {
    tagNameCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    attributeNameCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    allowCustomizedBuiltInElements: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: !1
    }
  })), tt = null, ct = null;
  const Me = Object.seal(gt(null, {
    tagCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    attributeCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    }
  }));
  let Ht = !0, $e = !0, Wt = !1, _t = !0, x = !1, A = !0, C = !1, K = !1, J = null, we = null, Be = !1, He = !1, ve = !1, Gt = !1, Yn = !0, Xn = !1;
  const Qn = "user-content-";
  let on = !0, sn = !1, nt = null, dt = {}, it = null;
  const Vn = j({}, [
    "annotation-xml",
    "audio",
    "colgroup",
    "desc",
    "foreignobject",
    "head",
    "iframe",
    "math",
    "mi",
    "mn",
    "mo",
    "ms",
    "mtext",
    "noembed",
    "noframes",
    "noscript",
    "plaintext",
    "script",
    "selectedcontent",
    "style",
    "svg",
    "template",
    "thead",
    "title",
    "video",
    "xmp"
  ]);
  let Jn = null;
  const ei = j({}, [
    "audio",
    "video",
    "img",
    "source",
    "image",
    "track"
  ]);
  let ti = null;
  const ni = j({}, [
    "alt",
    "class",
    "for",
    "id",
    "label",
    "name",
    "pattern",
    "placeholder",
    "role",
    "summary",
    "title",
    "value",
    "style",
    "xmlns"
  ]), jt = "http://www.w3.org/1998/Math/MathML", Zt = "http://www.w3.org/2000/svg", Fe = "http://www.w3.org/1999/xhtml";
  let pt = Fe, cn = !1, dn = null;
  const wr = j({}, [
    jt,
    Zt,
    Fe
  ], _n), ii = fe([
    "mi",
    "mo",
    "mn",
    "ms",
    "mtext"
  ]);
  let pn = j({}, ii);
  const ri = fe(["annotation-xml"]);
  let un = j({}, ri);
  const Tr = j({}, [
    "title",
    "style",
    "font",
    "a",
    "script"
  ]);
  let At = null;
  const Sr = ["application/xhtml+xml", "text/html"], _r = "text/html";
  let le = null, ut = null;
  const Ar = n.createElement("form"), ai = function(a) {
    return a instanceof RegExp || a instanceof Function;
  }, hn = function() {
    let a = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (ut && ut === a) return;
    (!a || typeof a != "object") && (a = {}), a = Ne(a), At = Sr.indexOf(a.PARSER_MEDIA_TYPE) === -1 ? _r : a.PARSER_MEDIA_TYPE, le = At === "application/xhtml+xml" ? _n : rt, te = Ve(a, "ALLOWED_TAGS", Tt, { transform: le }), V = Ve(a, "ALLOWED_ATTR", St, { transform: le }), dn = Ve(a, "ALLOWED_NAMESPACES", wr, { transform: _n }), ti = Ve(a, "ADD_URI_SAFE_ATTR", ni, {
      transform: le,
      base: ni
    }), Jn = Ve(a, "ADD_DATA_URI_TAGS", ei, {
      transform: le,
      base: ei
    }), it = Ve(a, "FORBID_CONTENTS", Vn, { transform: le }), tt = Ve(a, "FORBID_TAGS", Ne({}), { transform: le }), ct = Ve(a, "FORBID_ATTR", Ne({}), { transform: le }), dt = _e(a, "USE_PROFILES") ? a.USE_PROFILES && typeof a.USE_PROFILES == "object" ? Ne(a.USE_PROFILES) : a.USE_PROFILES : !1, Ht = a.ALLOW_ARIA_ATTR !== !1, $e = a.ALLOW_DATA_ATTR !== !1, Wt = a.ALLOW_UNKNOWN_PROTOCOLS || !1, _t = a.ALLOW_SELF_CLOSE_IN_ATTR !== !1, x = a.SAFE_FOR_TEMPLATES || !1, A = a.SAFE_FOR_XML !== !1, C = a.WHOLE_DOCUMENT || !1, He = a.RETURN_DOM || !1, ve = a.RETURN_DOM_FRAGMENT || !1, Gt = a.RETURN_TRUSTED_TYPE || !1, Be = a.FORCE_BODY || !1, Yn = a.SANITIZE_DOM !== !1, Xn = a.SANITIZE_NAMED_PROPS || !1, on = a.KEEP_CONTENT !== !1, sn = a.IN_PLACE || !1, wt = Tl(a.ALLOWED_URI_REGEXP) ? a.ALLOWED_URI_REGEXP : Bi, pt = typeof a.NAMESPACE == "string" ? a.NAMESPACE : Fe, pn = zn(a, "MATHML_TEXT_INTEGRATION_POINTS", () => j({}, ii)), un = zn(a, "HTML_INTEGRATION_POINTS", () => j({}, ri));
    const d = zn(a, "CUSTOM_ELEMENT_HANDLING", () => gt(null));
    if (se = gt(null), _e(d, "tagNameCheck") && ai(d.tagNameCheck) && (se.tagNameCheck = d.tagNameCheck), _e(d, "attributeNameCheck") && ai(d.attributeNameCheck) && (se.attributeNameCheck = d.attributeNameCheck), _e(d, "allowCustomizedBuiltInElements") && typeof d.allowCustomizedBuiltInElements == "boolean" && (se.allowCustomizedBuiltInElements = d.allowCustomizedBuiltInElements), xe(se), x && ($e = !1), ve && (He = !0), dt && (te = j({}, Fi), V = gt(null), dt.html === !0 && (j(te, Mi), j(V, qi)), dt.svg === !0 && (j(te, An), j(V, Cn), j(V, Vt)), dt.svgFilters === !0 && (j(te, En), j(V, Cn), j(V, Vt)), dt.mathMl === !0 && (j(te, Nn), j(V, Ui), j(V, Vt))), Me.tagCheck = null, Me.attributeCheck = null, _e(a, "ADD_TAGS") && (typeof a.ADD_TAGS == "function" ? Me.tagCheck = a.ADD_TAGS : xt(a.ADD_TAGS) && (te === Tt && (te = Ne(te)), j(te, a.ADD_TAGS, le))), _e(a, "ADD_ATTR") && (typeof a.ADD_ATTR == "function" ? Me.attributeCheck = a.ADD_ATTR : xt(a.ADD_ATTR) && (V === St && (V = Ne(V)), j(V, a.ADD_ATTR, le))), _e(a, "ADD_FORBID_CONTENTS") && xt(a.ADD_FORBID_CONTENTS) && (it === Vn && (it = Ne(it)), j(it, a.ADD_FORBID_CONTENTS, le)), on && (te["#text"] = !0), C && j(te, [
      "html",
      "head",
      "body"
    ]), te.table && (j(te, ["tbody"]), delete tt.tbody), a.TRUSTED_TYPES_POLICY) {
      if (typeof a.TRUSTED_TYPES_POLICY.createHTML != "function") throw Ge('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
      if (typeof a.TRUSTED_TYPES_POLICY.createScriptURL != "function") throw Ge('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
      const b = N;
      N = a.TRUSTED_TYPES_POLICY;
      try {
        H = $("");
      } catch (m) {
        throw N = b, m;
      }
    } else a.TRUSTED_TYPES_POLICY === null ? (N = void 0, H = "") : (N === void 0 && (N = ne()), N && typeof H == "string" && (H = $("")));
    fe && fe(a), ut = a;
  }, li = j({}, [
    ...An,
    ...En,
    ...Sl
  ]), oi = j({}, [...Nn, ..._l]), Er = function(a, d, b) {
    return d.namespaceURI === Fe ? a === "svg" : d.namespaceURI === jt ? a === "svg" && (b === "annotation-xml" || pn[b]) : !!li[a];
  }, Nr = function(a, d, b) {
    return d.namespaceURI === Fe ? a === "math" : d.namespaceURI === Zt ? a === "math" && un[b] : !!oi[a];
  }, Cr = function(a, d, b) {
    return d.namespaceURI === Zt && !un[b] || d.namespaceURI === jt && !pn[b] ? !1 : !oi[a] && (Tr[a] || !li[a]);
  }, Rr = function(a) {
    const d = w(a), b = rt(oe(a)), m = O(a);
    let R, I;
    return m && Z(m) === ce.element ? (R = { namespaceURI: w(m) }, I = rt(oe(m))) : (R = { namespaceURI: pt }, I = "template"), dn[d] ? d === Zt ? Er(b, R, I) : d === jt ? Nr(b, R, I) : d === Fe ? Cr(b, R, I) : !!(At === "application/xhtml+xml" && dn[d]) : !1;
  }, Ye = function(a) {
    Rt(e.removed, { element: a });
    try {
      O(a).removeChild(a);
    } catch {
      if (_(a), !O(a)) throw Ge("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place");
    }
  }, si = function(a, d, b) {
    try {
      f(a, d);
    } catch {
      try {
        a.removeAttribute(b);
      } catch {
      }
    }
  }, fn = function(a) {
    mn(a);
    const d = E(a);
    d && We(bl(d), (m) => {
      try {
        _(m);
      } catch {
      }
    });
    const b = Z(a) === ce.element ? D(a) : null;
    if (b) for (let m = b.length - 1; m >= 0; --m) {
      const R = b[m], I = R && R.name;
      typeof I == "string" && si(a, R, I);
    }
  }, ht = function(a, d, b) {
    if (!b) try {
      b = d.getAttributeNode(a);
    } catch {
      b = null;
    }
    Rt(e.removed, {
      attribute: b || null,
      from: d
    });
    try {
      b ? f(d, b) : d.removeAttribute(a);
    } catch {
      try {
        d.removeAttribute(a);
      } catch {
      }
    }
    if (a === "is")
      if (He || ve) try {
        Ye(d);
      } catch {
      }
      else try {
        d.setAttribute(a, "");
      } catch {
      }
  }, ci = function(a) {
    const d = D(a);
    if (d)
      for (let b = d.length - 1; b >= 0; --b) {
        const m = d[b], R = m && m.name;
        typeof R != "string" || V[le(R)] || si(a, m, R);
      }
  }, bn = function(a, d) {
    let b = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !1;
    const m = [a];
    for (; m.length > 0; ) {
      const R = m.pop();
      if (d(R) === !1) continue;
      if (b && Z(R) === ce.element) {
        const U = L(R);
        Xe(U) && m.push(U);
      }
      const I = E(R);
      if (I) for (let U = I.length - 1; U >= 0; --U) m.push(I[U]);
    }
  }, mn = function(a) {
    bn(a, (d) => {
      Z(d) === ce.element && ci(d);
    });
  }, gn = function(a) {
    const d = [];
    return bn(a, (b) => {
      d.push(b);
    }, !0), d;
  }, zr = function(a, d) {
    const b = Tn();
    We(gn(a), (m) => {
      Z(m) === ce.element && Sn(b, m);
    }), We(d, (m) => {
      Z(m) === ce.element && !zt(b, m) && ci(m);
    });
  }, di = function(a, d) {
    let b = !1;
    return We(e.removed, (m) => {
      m.element && (b = b || m.element === a, mn(m.element));
    }), zr(a, d), b;
  }, $r = 8, Lr = function(a, d) {
    const b = nt;
    let m = null;
    const R = () => (m || (m = Tn(), We(d, (I) => {
      Sn(m, I);
    })), m);
    for (let I = 0; ; I++) {
      const U = gn(a), pe = [a];
      let qe = !1;
      if (We(U, (ye) => {
        Z(ye) === ce.documentFragment ? Rt(pe, ye) : !qe && !zt(b, ye) && (qe = zt(R(), ye));
      }), !qe) return;
      if (I >= $r) throw Ge("the tree kept changing during in-place sanitization; refusing to return it");
      We(pe, (ye, Te) => {
        Dr(ye, Te > 0, a, R());
      });
    }
  }, Dr = function(a, d, b, m) {
    const R = xn(a);
    let I;
    for (; I = R.nextNode(); )
      !zt(m, I) || zt(nt, I) || (d && Le(Q.uponSanitizeShadowNode, I, null), vn(I, b), yn(I, b), Xe(I.content) && Nt(I.content));
  }, Ir = function(a) {
    nt && Sn(nt, a);
  }, pi = function(a, d) {
    return A ? a === "patchsrc" ? !0 : a === "for" && d !== "label" && d !== "output" : !1;
  }, Or = function(a) {
    A && bn(a, (d) => {
      const b = Z(d);
      if (b === ce.processingInstruction || b === ce.comment && me(Hi, d.data)) {
        try {
          _(d);
        } catch {
        }
        return !1;
      }
      if (b === ce.element) {
        const m = d, R = le(oe(d));
        try {
          m.hasAttribute && m.hasAttribute("patchsrc") && m.removeAttribute("patchsrc"), m.hasAttribute && m.hasAttribute("for") && pi("for", R) && m.removeAttribute("for");
        } catch {
        }
      }
      return !0;
    });
  }, ui = function(a) {
    let d = null, b = null;
    if (Be) a = "<remove></remove>" + a;
    else {
      const I = Di(a, /^[\r\n\t ]+/);
      b = I && I[0];
    }
    At === "application/xhtml+xml" && pt === Fe && (a = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + a + "</body></html>");
    const m = N ? $(a) : a;
    if (pt === Fe) try {
      d = new u().parseFromString(m, At);
    } catch {
    }
    if (!d || !d.documentElement) {
      d = Ae.createDocument(pt, "template", null);
      try {
        d.documentElement.innerHTML = cn ? H : m;
      } catch {
      }
    }
    const R = d.body || d.documentElement;
    return a && b && R.insertBefore(n.createTextNode(b), R.childNodes[0] || null), pt === Fe ? Ue.call(d, C ? "html" : "body")[0] : C ? d.documentElement : R;
  }, xn = function(a) {
    const d = ue ? ue(a) : a.ownerDocument;
    return ze.call(d || a, a, p.SHOW_ELEMENT | p.SHOW_COMMENT | p.SHOW_TEXT | p.SHOW_PROCESSING_INSTRUCTION | p.SHOW_CDATA_SECTION, null);
  }, Kt = function(a) {
    return a = $t(a, vt, " "), a = $t(a, an, " "), a = $t(a, ln, " "), a;
  }, kn = function(a) {
    var d;
    hi(a);
    const b = (d = a.querySelectorAll) === null || d === void 0 ? void 0 : d.call(a, "template");
    b && We(b, (m) => {
      Xe(m.content) && kn(m.content);
    });
  }, hi = function(a) {
    a.normalize();
    const d = ue ? ue(a) : a.ownerDocument, b = ze.call(d || a, a, p.SHOW_TEXT | p.SHOW_COMMENT | p.SHOW_CDATA_SECTION | p.SHOW_PROCESSING_INSTRUCTION, null);
    let m = b.nextNode();
    for (; m; )
      m.data = Kt(m.data), m = b.nextNode();
  }, Yt = function(a) {
    const d = B ? B(a) : null;
    return typeof d != "string" || le(d) !== "form" ? !1 : typeof a.nodeName != "string" || typeof a.textContent != "string" || typeof a.removeChild != "function" || a.attributes !== D(a) || typeof a.removeAttribute != "function" || typeof a.removeAttributeNode != "function" || typeof a.getAttributeNode != "function" || typeof a.setAttribute != "function" || typeof a.namespaceURI != "string" || typeof a.insertBefore != "function" || typeof a.hasChildNodes != "function" || a.nodeType !== Y(a) || a.childNodes !== E(a);
  }, Xe = function(a) {
    if (!Y || typeof a != "object" || a === null) return !1;
    try {
      return Y(a) === ce.documentFragment;
    } catch {
      return !1;
    }
  }, Et = function(a) {
    if (!Y || typeof a != "object" || a === null) return !1;
    try {
      return typeof Y(a) == "number";
    } catch {
      return !1;
    }
  };
  function Le(g, a, d) {
    g.length !== 0 && We(g, (b) => {
      b.call(e, a, d, ut);
    });
  }
  const Pr = function(a, d) {
    return !!(A && a.hasChildNodes() && !Et(a.firstElementChild) && me(Rn, a.textContent) && me(Rn, a.innerHTML) || A && Ol[d] && Z(a) === ce.element && w(a) === Fe && (Et(a.firstElementChild) || typeof a.textContent == "string" && me(Rn, a.textContent)) || a.nodeType === ce.processingInstruction || A && a.nodeType === ce.comment && me(Hi, a.data));
  }, Xt = function(a, d) {
    if (a instanceof RegExp) return me(a, d);
    if (a instanceof Function) {
      for (var b = arguments.length, m = new Array(b > 2 ? b - 2 : 0), R = 2; R < b; R++) m[R - 2] = arguments[R];
      return !!a(d, ...m);
    }
    return !1;
  }, Mr = function(a, d, b) {
    if (!tt[d] && mi(d) && Xt(se.tagNameCheck, d)) return !1;
    if (on && !it[d] && !it[rt(d)]) {
      const m = O(a), R = E(a);
      if (R && m) {
        const I = R.length;
        for (let U = I - 1; U >= 0; --U) {
          const pe = a === b ? T(R[U], !0) : R[U];
          m.insertBefore(pe, v(a));
        }
      }
    }
    return Ye(a), !0;
  }, fi = function(a, d, b, m) {
    return a.length === 0 ? d : d === b || d === m ? Ne(d) : d;
  }, ft = function(a, d) {
    return a === d || O(a) !== null ? !1 : (sn && mn(a), !0);
  }, vn = function(a, d) {
    if (Ir(a), Le(Q.beforeSanitizeElements, a, null), ft(a, d)) return !0;
    if (Yt(a))
      return Ye(a), !0;
    const b = le(oe(a));
    if (te = fi(Q.uponSanitizeElement, te, Tt, J), Le(Q.uponSanitizeElement, a, {
      tagName: b,
      allowedTags: te
    }), ft(a, d)) return !0;
    if (Pr(a, b))
      return Ye(a), !0;
    if (tt[b] || !(Me.tagCheck instanceof Function && Me.tagCheck(b)) && !te[b]) {
      const m = Mr(a, b, d);
      return m === !1 && (Le(Q.afterSanitizeElements, a, null), ft(a, d)) ? !0 : m;
    }
    if (Z(a) === ce.element && !Rr(a) || (b === "noscript" || b === "noembed" || b === "noframes") && me(Il, a.innerHTML))
      return Ye(a), !0;
    if (x && a.nodeType === ce.text) {
      const m = Kt(a.textContent);
      a.textContent !== m && (Rt(e.removed, { element: a.cloneNode() }), a.textContent = m);
    }
    return Le(Q.afterSanitizeElements, a, null), ft(a, d);
  }, bi = function(a, d, b) {
    if (ct[d] || pi(d, a) || Yn && (d === "id" || d === "name") && (b in n || b in Ar)) return !1;
    const m = V[d] || Me.attributeCheck instanceof Function && Me.attributeCheck(d, a);
    return $e && me(st, d) || Ht && me(Ut, d) ? !0 : m ? ti[d] || me(wt, $t(b, Bt, "")) || (d === "src" || d === "xlink:href" || d === "href") && a !== "script" && Ii(b, "data:") === 0 && Jn[a] || Wt && !me(Pe, $t(b, Bt, "")) ? !0 : !b : mi(a) && Xt(se.tagNameCheck, a) && Xt(se.attributeNameCheck, d, a) || d === "is" && se.allowCustomizedBuiltInElements && Xt(se.tagNameCheck, b);
  }, Fr = j({}, [
    "annotation-xml",
    "color-profile",
    "font-face",
    "font-face-format",
    "font-face-name",
    "font-face-src",
    "font-face-uri",
    "missing-glyph"
  ]), mi = function(a) {
    return !Fr[rt(a)] && me(yt, a);
  }, qr = function(a, d, b, m) {
    if (N && typeof S == "object" && typeof S.getAttributeType == "function" && !b) switch (S.getAttributeType(a, d)) {
      case "TrustedHTML":
        return $(m);
      case "TrustedScriptURL":
        return re(m);
    }
    return m;
  }, Ur = function(a, d, b, m) {
    try {
      return b ? a.setAttributeNS(b, d, m) : a.setAttribute(d, m), Yt(a) ? (Ye(a), !1) : !0;
    } catch {
      return ht(d, a), !1;
    }
  }, gi = function(a, d) {
    return A && me(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, d) ? !0 : rt(a) === "attributename" && Di(d, "href") !== null;
  }, yn = function(a, d) {
    if (Le(Q.beforeSanitizeAttributes, a, null), ft(a, d)) return;
    const b = a.attributes;
    if (!b || Yt(a)) return;
    V = fi(Q.uponSanitizeAttribute, V, St, we);
    const m = {
      attrName: "",
      attrValue: "",
      keepAttr: !0,
      allowedAttributes: V,
      forceKeepAttr: void 0
    };
    let R = b.length;
    const I = le(a.nodeName);
    for (; R--; ) {
      const U = b[R], pe = U.name, qe = U.namespaceURI, ye = U.value, Te = le(pe), bt = ye;
      let Se = pe === "value" ? bt : gl(bt), xi = !1;
      if (m.attrName = Te, m.attrValue = Se, m.keepAttr = !0, m.forceKeepAttr = void 0, Le(Q.uponSanitizeAttribute, a, m), Se = m.attrValue, Xn && (Te === "id" || Te === "name") && Ii(Se, Qn) !== 0 && (ht(pe, a, U), Se = Qn + Se, xi = !0), gi(pe, Se)) {
        ht(pe, a, U);
        continue;
      }
      if (!m.forceKeepAttr) {
        if (!m.keepAttr) {
          ht(pe, a, U);
          continue;
        }
        if (!_t && me(Wi, Se)) {
          ht(pe, a, U);
          continue;
        }
        if (x && (Se = Kt(Se)), !bi(I, Te, Se)) {
          ht(pe, a, U);
          continue;
        }
        Se = qr(I, Te, qe, Se), Se !== bt && Ur(a, pe, qe, Se) && xi && Li(e.removed);
      }
    }
    Le(Q.afterSanitizeAttributes, a, null), ft(a, d);
  }, Nt = function(a) {
    let d = null;
    const b = xn(a);
    for (Le(Q.beforeSanitizeShadowDOM, a, null); d = b.nextNode(); )
      if (Le(Q.uponSanitizeShadowNode, d, null), vn(d, a), yn(d, a), Xe(d.content) && Nt(d.content), Z(d) === ce.element) {
        const m = L(d);
        Xe(m) && (wn(m), Nt(m));
      }
    x && hi(a), Le(Q.afterSanitizeShadowDOM, a, null);
  }, wn = function(a) {
    const d = [{
      node: a,
      shadow: null
    }];
    for (; d.length > 0; ) {
      const b = d.pop();
      if (b.shadow) {
        Nt(b.shadow);
        continue;
      }
      const m = b.node, R = Z(m) === ce.element, I = E(m);
      if (I) for (let U = I.length - 1; U >= 0; --U) d.push({
        node: I[U],
        shadow: null
      });
      if (R) {
        const U = B ? B(m) : null;
        if (typeof U == "string" && le(U) === "template") {
          const pe = m.content;
          Xe(pe) && d.push({
            node: pe,
            shadow: null
          });
        }
      }
      if (R) {
        const U = L(m);
        Xe(U) && d.push({
          node: null,
          shadow: U
        }, {
          node: U,
          shadow: null
        });
      }
    }
  };
  return e.sanitize = function(g) {
    let a = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, d = null, b = null, m = null, R = null;
    if (cn = !g, cn && (g = "<!-->"), typeof g != "string" && !Et(g) && (g = yl(g), typeof g != "string"))
      throw Ge("dirty is not a string, aborting");
    if (!e.isSupported) return g;
    K ? (te = J, V = we) : hn(a), (Q.uponSanitizeElement.length > 0 || Q.uponSanitizeAttribute.length > 0) && (te = Ne(te)), Q.uponSanitizeAttribute.length > 0 && (V = Ne(V)), e.removed = [];
    const I = sn && typeof g != "string" && Et(g);
    let U = [];
    const pe = nt;
    if (I) {
      Or(g);
      const Te = oe(g);
      if (typeof Te == "string") {
        const bt = le(Te);
        if (!te[bt] || tt[bt])
          throw fn(g), Ge("root node is forbidden and cannot be sanitized in-place");
      }
      if (Yt(g))
        throw fn(g), Ge("root node is clobbered and cannot be sanitized in-place");
      U = gn(g), nt = Tn();
    } else if (Et(g))
      d = ui("<!---->"), b = d.ownerDocument.importNode(g, !0), b.nodeType === ce.element && b.nodeName === "BODY" || b.nodeName === "HTML" ? d = b : d.appendChild(b), wn(d);
    else {
      if (!He && !x && !C && g.indexOf("<") === -1) return N && Gt ? $(g) : g;
      if (d = ui(g), !d) return He ? null : Gt ? H : "";
    }
    d && Be && Ye(d.firstChild);
    const qe = I ? g : d;
    try {
      I && wn(g);
      const Te = xn(qe);
      for (; m = Te.nextNode(); )
        vn(m, qe), yn(m, qe), Xe(m.content) && Nt(m.content);
      I && Lr(g, U);
    } catch (Te) {
      throw I && (fn(g), di(g, U)), Te;
    } finally {
      nt = pe;
    }
    if (I) {
      if (di(g, U)) throw Ge("a node selected for removal could not be safely returned; refusing to sanitize in place");
      return x && kn(g), g;
    }
    if (He) {
      if (x && kn(d), ve)
        for (R = qt.call(d.ownerDocument); d.firstChild; ) R.appendChild(d.firstChild);
      else R = d;
      return (V.shadowroot || V.shadowrootmode) && (R = Oe.call(i, R, !0)), R;
    }
    let ye = C ? d.outerHTML : d.innerHTML;
    return C && te["!doctype"] && d.ownerDocument && d.ownerDocument.doctype && d.ownerDocument.doctype.name && me(Ll, d.ownerDocument.doctype.name) && (ye = "<!DOCTYPE " + d.ownerDocument.doctype.name + `>
` + ye), x && (ye = Kt(ye)), N && Gt ? $(ye) : ye;
  }, e.setConfig = function() {
    let g = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    hn(g), K = !0, J = te, we = V;
  }, e.clearConfig = function() {
    ut = null, K = !1, J = null, we = null, N = F, H = "";
  }, e.isValidAttribute = function(g, a, d) {
    ut || hn({});
    const b = le(g), m = le(a);
    return typeof d == "string" && (gi(a, d) || !_t && me(Wi, d)) ? !1 : bi(b, m, d);
  }, e.addHook = function(g, a) {
    typeof a == "function" && _e(Q, g) && Rt(Q[g], a);
  }, e.removeHook = function(g, a) {
    if (_e(Q, g)) {
      if (a !== void 0) {
        const d = fl(Q[g], a);
        return d === -1 ? void 0 : ml(Q[g], d, 1)[0];
      }
      return Li(Q[g]);
    }
  }, e.removeHooks = function(g) {
    _e(Q, g) && (Q[g] = []);
  }, e.removeAllHooks = function() {
    Q = Gi();
  }, e;
}
var xr = gr();
const Fl = /\.(png|jpe?g|gif|webp|svg|avif|bmp)$/i, ql = /\.(pdf|mp4|webm|mov|mkv|mp3|wav|m4a|ogg|flac|canvas|excalidraw|base)$/i, Ul = /^(\d{1,4})(?:x(\d{1,4}))?$/, Bl = {
  summary: "abstract",
  tldr: "abstract",
  hint: "tip",
  important: "tip",
  check: "success",
  done: "success",
  help: "question",
  faq: "question",
  caution: "warning",
  attention: "warning",
  fail: "failure",
  missing: "failure",
  error: "danger",
  cite: "quote"
}, Hl = {
  tip: "sage",
  success: "sage",
  warning: "danger",
  failure: "danger",
  danger: "danger",
  bug: "danger"
};
function be(t) {
  return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function Wl(t) {
  return t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function Mn(t) {
  return t.toLowerCase().replace(/<[^>]+>/g, "").replace(/&[a-z]+;/g, "").replace(/[^\p{L}\p{N}\s-]/gu, "").trim().replace(/\s+/g, "-").slice(0, 80) || "section";
}
function kr(t) {
  return t.replace(/^---\s*\n[\s\S]*?\n---\s*(\n|$)/, "");
}
const Gl = /^ {0,3}(`{3,}|~{3,})[^\n]*\n[\s\S]*?^ {0,3}\1[ \t]*$/gm;
function jl(t, e) {
  let n = "", i = 0;
  for (const r of t.matchAll(Gl))
    n += e(t.slice(i, r.index)) + r[0], i = r.index + r[0].length;
  return n + e(t.slice(i));
}
function Zl(t) {
  return jl(
    t,
    (e) => e.replace(/%%[\s\S]*?%%/g, "").replace(/(^|[ \t])\^([A-Za-z0-9-]+)[ \t]*$/gm, (n, i, r) => `${i}<span class="lib-block" data-block="${r}"></span>`)
  );
}
function Kl(t, e) {
  const n = kr(t);
  if (!e) return n;
  const i = n.split(`
`);
  if (e.startsWith("^")) {
    const p = new RegExp(`(^|\\s)\\^${Wl(e.slice(1))}\\s*$`), u = i.findIndex((_) => p.test(_));
    if (u < 0) return null;
    const S = i[u].trim().startsWith("^");
    let y = S ? u - 1 : u;
    for (; S && y >= 0 && !i[y].trim(); ) y--;
    let T = y;
    for (; T > 0 && i[T - 1].trim(); ) T--;
    return y < 0 ? null : i.slice(T, y + 1).join(`
`);
  }
  const r = Mn(e);
  let l = !1, c = -1, o = 0;
  for (let p = 0; p < i.length; p++) {
    if (/^ {0,3}(`{3,}|~{3,})/.test(i[p]) && (l = !l), l) continue;
    const u = /^(#{1,6})\s+(.*?)\s*#*\s*$/.exec(i[p]);
    if (u) {
      if (c >= 0 && u[1].length <= o) return i.slice(c, p).join(`
`).trimEnd();
      c < 0 && Mn(u[2].replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (S, y, T) => T || y)) === r && (c = p, o = u[1].length);
    }
  }
  return c >= 0 ? i.slice(c).join(`
`).trimEnd() : null;
}
function ji(t, e, n) {
  return `/api/apps/notes-search/asset?${new URLSearchParams({ c: t, p: e, src: n }).toString()}`;
}
function Zi(t) {
  const e = Ul.exec(t.trim());
  return e ? ` width="${e[1]}"${e[2] ? ` height="${e[2]}"` : ""}` : "";
}
function Ki(t, e) {
  const n = [], i = /* @__PURE__ */ new Map(), r = e.idPrefix ?? "";
  let l = !1;
  const c = {
    name: "wikilink",
    level: "inline",
    start(f) {
      const v = f.indexOf("[[");
      if (!(v < 0))
        return v > 0 && f[v - 1] === "!" ? v - 1 : v;
    },
    tokenizer(f) {
      const v = /^(!?)\[\[([^\]\n|#]+)(#[^\]\n|]*)?(?:\|([^\]\n]+))?\]\]/.exec(f);
      if (v)
        return {
          type: "wikilink",
          raw: v[0],
          embed: v[1] === "!",
          target: v[2].trim(),
          heading: (v[3] || "").slice(1),
          alias: (v[4] || "").trim()
        };
    },
    renderer(f) {
      const v = String(f.target), E = String(f.heading || ""), O = String(f.alias || "");
      if (f.embed && Fl.test(v)) {
        const D = Zi(O), Y = O && !D ? O : v;
        return `<img src="${be(ji(e.collection, e.path, v))}" alt="${be(Y)}"${D} loading="lazy">`;
      }
      if (f.embed && ql.test(v))
        return `<span class="lib-embed-missing">Attachment: ${be(v)}</span>`;
      const L = (D) => `<a class="lib-wikilink" href="#" data-wikilink="${be(v)}" data-heading="${be(E)}">${be(D)}</a>`;
      return f.embed && e.embedded ? `<span class="lib-embed-missing">Embedded note: ${L(v)}</span>` : f.embed ? `<span class="lib-embed" data-embed="${be(v)}" data-heading="${be(E)}"><span class="lib-embed-head">${L(O || v + (E && !E.startsWith("^") ? ` › ${E}` : ""))}</span><span class="lib-embed-body lib-embed-loading">Loading…</span></span>` : L(O || v + (E && !E.startsWith("^") ? ` › ${E}` : ""));
    }
  }, o = {
    name: "highlight",
    level: "inline",
    start(f) {
      const v = f.indexOf("==");
      return v < 0 ? void 0 : v;
    },
    tokenizer(f) {
      const v = /^==(?=\S)([^\n]*?\S)==(?!=)/.exec(f);
      if (!v) return;
      const E = { type: "highlight", raw: v[0], tokens: [] };
      return this.lexer.inlineTokens(v[1], E.tokens), E;
    },
    renderer(f) {
      return `<mark class="lib-hl">${this.parser.parseInline(f.tokens)}</mark>`;
    }
  }, p = {
    name: "callout",
    level: "block",
    start(f) {
      const v = /^ {0,3}>[ \t]*\[!/m.exec(f);
      return v ? v.index : void 0;
    },
    tokenizer(f) {
      const v = /^ {0,3}>[ \t]*\[!([\w-]+)\]([+-]?)[ \t]*([^\n]*)(?:\n|$)((?: {0,3}>[^\n]*(?:\n|$))*)/.exec(f);
      if (!v) return;
      const E = v[1].toLowerCase(), O = Bl[E] ?? E, L = v[3].trim(), D = {
        type: "callout",
        raw: v[0],
        kind: O,
        fold: v[2],
        hasTitle: !!L,
        label: E.charAt(0).toUpperCase() + E.slice(1),
        titleTokens: [],
        tokens: []
      };
      return L && this.lexer.inline(L, D.titleTokens), this.lexer.blockTokens(v[4].replace(/^ {0,3}> ?/gm, ""), D.tokens), D;
    },
    childTokens: ["titleTokens", "tokens"],
    renderer(f) {
      const v = f.hasTitle ? this.parser.parseInline(f.titleTokens) : be(String(f.label)), E = this.parser.parse(f.tokens), O = be(String(f.kind)), L = Hl[String(f.kind)] ?? "accent", D = `class="lib-callout" data-callout="${O}" data-tone="${L}"`;
      return f.fold ? `<details ${D}${f.fold === "+" ? " open" : ""}><summary class="lib-callout-title"><span>${v}</span></summary>${E ? `<div class="lib-callout-body">${E}</div>` : ""}</details>
` : `<div ${D}><div class="lib-callout-title"><span>${v}</span></div>${E ? `<div class="lib-callout-body">${E}</div>` : ""}</div>
`;
    }
  }, u = {
    name: "hashtag",
    level: "inline",
    start(f) {
      const v = /(^|[\s(])#[A-Za-z][\w\-/]*/.exec(f);
      return v ? v.index + v[1].length : void 0;
    },
    tokenizer(f) {
      const v = /^#([A-Za-z][\w\-/]*)/.exec(f);
      if (v)
        return { type: "hashtag", raw: v[0], tag: v[1] };
    },
    renderer(f) {
      const v = String(f.tag);
      return `<span class="lib-ptag" role="button" tabindex="0" data-tag="${be(v)}">#${be(v)}</span>`;
    }
  }, S = new pr({ gfm: !0, breaks: !1 });
  S.use({
    extensions: [p, c, o, u],
    renderer: {
      heading({ tokens: f, depth: v, text: E }) {
        const O = this.parser.parseInline(f), L = E.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (ue, Z, oe) => oe || Z).replace(/<[^>]+>/g, "").trim();
        if (!l && (l = !0, v === 1 && e.title && L.toLowerCase() === e.title.trim().toLowerCase()))
          return "";
        const D = r + Mn(L), Y = i.get(D) ?? 0;
        i.set(D, Y + 1);
        const B = Y ? `${D}-${Y}` : D;
        return v <= 4 && n.push({ id: B, text: L.replace(/[*_`=]/g, ""), depth: v }), `<h${v} id="${be(B)}"><a class="lib-anchor" href="#${be(B)}" aria-hidden="true" tabindex="-1">#</a>${O}</h${v}>
`;
      },
      image({ href: f, title: v, text: E }) {
        const L = f && !/^[a-z][a-z0-9+.-]*:/i.test(f) && !f.startsWith("//") ? ji(e.collection, e.path, f) : f, D = /^(.*?)\|([^|]+)$/.exec(E || ""), Y = D ? Zi(D[2]) : "", B = Y && D ? D[1] : E || "";
        return `<img src="${be(L || "")}" alt="${be(B)}"${Y}${v ? ` title="${be(v)}"` : ""} loading="lazy">`;
      }
    }
  });
  const y = Zl(kr(t)), T = S.parse(y, { async: !1 });
  return { html: xr.sanitize(T, {
    ADD_ATTR: ["data-wikilink", "data-heading", "data-tag", "data-embed", "data-block", "data-callout", "data-tone", "target", "loading", "tabindex", "role", "open"],
    FORBID_TAGS: ["style", "form", "button", "textarea", "select", "iframe", "object", "embed"],
    FORBID_ATTR: ["style"]
  }), outline: n };
}
xr.addHook("afterSanitizeAttributes", (t) => {
  if (t.tagName === "A") {
    const e = t.getAttribute("href") || "";
    /^https?:/i.test(e) && (t.setAttribute("target", "_blank"), t.setAttribute("rel", "noopener noreferrer"));
  }
  t.tagName === "INPUT" && t.setAttribute("disabled", "");
});
function Yl(t) {
  return /* @__PURE__ */ h("div", { className: "lib-tabs", role: "tablist", "aria-label": "Open notes", children: [
    /* @__PURE__ */ s(
      "button",
      {
        type: "button",
        className: "lib-btn lib-btn-quiet lib-btn-icon",
        style: { marginBottom: 6, flex: "none" },
        "aria-pressed": t.leftOpen,
        "aria-label": t.leftOpen ? "Hide search" : "Show search",
        title: `${t.leftOpen ? "Hide" : "Show"} search (${Ot}\\)`,
        onClick: t.onToggleLeft,
        children: /* @__PURE__ */ s(z.PanelLeft, { size: 16 })
      }
    ),
    t.tabs.map((e) => {
      const n = X(e);
      return /* @__PURE__ */ h(
        "div",
        {
          role: "tab",
          tabIndex: 0,
          "aria-selected": t.active === n,
          "data-preview": e.preview,
          className: "lib-tab",
          title: `${e.title}
${e.collection}/${e.path}`,
          onClick: () => t.onActivate(n),
          onDoubleClick: () => t.onPin(n),
          onAuxClick: (i) => i.button === 1 && t.onClose(n),
          onKeyDown: (i) => {
            (i.key === "Enter" || i.key === " ") && t.onActivate(n);
          },
          children: [
            /* @__PURE__ */ s(z.File, { size: 13, "aria-hidden": "true" }),
            /* @__PURE__ */ s("span", { className: "lib-ell", children: e.title }),
            /* @__PURE__ */ s(
              "span",
              {
                className: "lib-tab-x",
                role: "button",
                "aria-label": `Close ${e.title}`,
                onClick: (i) => {
                  i.stopPropagation(), t.onClose(n);
                },
                children: /* @__PURE__ */ s(z.X, { size: 12, strokeWidth: 2.6 })
              }
            )
          ]
        },
        n
      );
    }),
    /* @__PURE__ */ h("div", { className: "lib-tabs-end", children: [
      /* @__PURE__ */ h(
        "button",
        {
          type: "button",
          className: "lib-btn lib-btn-quiet lib-btn-sm",
          "aria-pressed": t.foldersOpen,
          onClick: t.onToggleFolders,
          title: "Choose which folders to search",
          children: [
            /* @__PURE__ */ s(z.Folders, { size: 15 }),
            "Folders"
          ]
        }
      ),
      /* @__PURE__ */ h(
        "button",
        {
          type: "button",
          className: "lib-btn lib-btn-quiet lib-btn-sm",
          "aria-pressed": t.chatOpen,
          onClick: t.onToggleChat,
          title: `${t.chatOpen ? "Hide" : "Show"} chats (${Ot}J)`,
          children: [
            /* @__PURE__ */ s(z.Chat, { size: 15 }),
            "Chats",
            t.chatCount ? ` · ${t.chatCount}` : ""
          ]
        }
      )
    ] })
  ] });
}
function Xl(t) {
  const e = qn(), [n, i] = P(null), [r, l] = P(null), [c, o] = P(null), [p, u] = P(""), [S, y] = P(null), [T, _] = P(0), [f, v] = P(0), [E, O] = P(!1), L = et(null), D = et(null), Y = X(t.tab);
  Ce(() => {
    let w = !0;
    return i(null), l(null), o(null), _(0), e.get(`${he}/doc?${je({ c: t.tab.collection, p: t.tab.path })}`).then((N) => {
      w && (i(N), t.onDocLoaded(N));
    }).catch((N) => w && l(Ze(N))), e.get(`${he}/backlinks?${je({ c: t.tab.collection, p: t.tab.path })}`).then((N) => w && o(N.results)).catch(() => w && o([])), D.current?.scrollTo({ top: 0 }), () => {
      w = !1;
    };
  }, [e, Y]);
  const B = Fn(
    () => n ? Ki(n.markdown, { collection: n.collection, path: n.path, title: n.title }) : null,
    [n]
  );
  Hr(() => {
    const w = L.current;
    if (!w || !B) return;
    w.innerHTML = B.html, w.querySelectorAll("pre").forEach((F) => {
      if (F.querySelector(".lib-copy")) return;
      const q = document.createElement("button");
      q.type = "button", q.className = "lib-copy", q.textContent = "Copy", q.addEventListener("click", () => {
        const W = F.querySelector("code")?.textContent ?? F.textContent ?? "";
        navigator.clipboard?.writeText(W).then(() => {
          q.textContent = "Copied", window.setTimeout(() => q.textContent = "Copy", 1200);
        });
      }), F.appendChild(q);
    });
    const N = t.tab.words.filter((F) => F.length >= 2);
    let H = 0;
    if (N.length) {
      const F = new RegExp(`(${N.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi"), q = document.createTreeWalker(w, NodeFilter.SHOW_TEXT, {
        acceptNode: (k) => k.parentElement?.closest("pre, code, .lib-anchor, mark.lib-find, .lib-embed") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
      }), W = [];
      for (; q.nextNode(); ) W.push(q.currentNode);
      for (const k of W) {
        const $ = k.data;
        if (F.lastIndex = 0, !F.test($)) continue;
        F.lastIndex = 0;
        const re = document.createDocumentFragment();
        let ne = 0, ae;
        for (; ae = F.exec($); ) {
          ae.index > ne && re.appendChild(document.createTextNode($.slice(ne, ae.index)));
          const Ae = document.createElement("mark");
          Ae.className = "lib-find", Ae.dataset.find = String(H++), Ae.textContent = ae[0], re.appendChild(Ae), ne = ae.index + ae[0].length;
        }
        ne < $.length && re.appendChild(document.createTextNode($.slice(ne))), k.parentNode?.replaceChild(re, k);
      }
    }
    if (v(H), _(0), t.tab.heading?.startsWith("^")) {
      const F = w.querySelector(`[data-block="${CSS.escape(t.tab.heading.slice(1))}"]`), q = F?.closest("p, li, blockquote, table, .lib-callout") ?? F?.parentElement;
      q && (q.dataset.flash = "true", window.setTimeout(() => q.scrollIntoView({ block: "center" }), 30));
    } else if (t.tab.heading) {
      const F = t.tab.heading.toLowerCase(), q = B.outline.find((W) => W.text.toLowerCase() === F);
      q && window.setTimeout(() => document.getElementById(q.id)?.scrollIntoView({ block: "start" }), 30);
    } else H && window.setTimeout(() => w.querySelector("mark.lib-find")?.scrollIntoView({ block: "center" }), 30);
  }, [B, t.tab.words, t.tab.heading]), Ce(() => {
    const w = L.current;
    if (!w || !B || !n) return;
    const N = Array.from(w.querySelectorAll(".lib-embed[data-embed]"));
    if (!N.length) return;
    let H = !0;
    const F = /* @__PURE__ */ new Map(), q = (W) => {
      let k = F.get(W);
      return k || (k = e.get(`${he}/resolve?${je({ t: W, c: n.collection })}`).then(($) => e.get(`${he}/doc?${je({ c: $.collection, p: $.path })}`)), F.set(W, k)), k;
    };
    return N.forEach((W, k) => {
      const $ = W.querySelector(".lib-embed-body");
      if (!$) return;
      const re = W.dataset.heading || "";
      q(W.dataset.embed || "").then((ne) => {
        if (!H) return;
        const ae = Kl(ne.markdown, re);
        if (ae === null) {
          $.textContent = re.startsWith("^") ? "That block is no longer in the note." : `No heading “${re}” in this note.`, $.className = "lib-embed-body lib-embed-missing";
          return;
        }
        if (ne.private) {
          $.textContent = "Private note. Open it to read.", $.className = "lib-embed-body lib-embed-missing";
          return;
        }
        $.innerHTML = Ki(ae, { collection: ne.collection, path: ne.path, title: re ? void 0 : ne.title, embedded: !0, idPrefix: `embed-${k}-` }).html, $.className = "lib-embed-body";
      }).catch(() => {
        H && ($.textContent = "This note could not be found.", $.className = "lib-embed-body lib-embed-missing", W.querySelector(".lib-wikilink")?.setAttribute("data-broken", "true"));
      });
    }), () => {
      H = !1;
    };
  }, [e, B, n]), Ce(() => {
    const w = L.current;
    if (!w || !f) return;
    w.querySelectorAll("mark.lib-find[data-active]").forEach((H) => H.removeAttribute("data-active"));
    const N = w.querySelector(`mark.lib-find[data-find="${T}"]`);
    N && (N.dataset.active = "true", N.scrollIntoView({ block: "center", behavior: "smooth" }));
  }, [T, f]), Ce(() => {
    const w = L.current, N = D.current;
    if (!w || !N || !B?.outline.length) return;
    const H = B.outline.map((q) => document.getElementById(q.id)).filter(Boolean), F = () => {
      const q = N.getBoundingClientRect().top + 80;
      let W = H[0]?.id ?? null;
      for (const k of H)
        if (k.getBoundingClientRect().top <= q) W = k.id;
        else break;
      y(W);
    };
    return F(), N.addEventListener("scroll", F, { passive: !0 }), () => N.removeEventListener("scroll", F);
  }, [B]);
  const ue = de(
    (w) => {
      const N = w.target, H = N.closest("[data-wikilink]");
      if (H) {
        w.preventDefault(), t.onOpenLink(H.dataset.wikilink || "", H.dataset.heading || "", t.tab.collection);
        return;
      }
      const F = N.closest("[data-tag]");
      if (F) {
        w.preventDefault(), t.onTag(F.dataset.tag || "");
        return;
      }
      const q = N.closest('a[href^="#"]');
      if (q) {
        w.preventDefault();
        const k = decodeURIComponent(q.getAttribute("href").slice(1));
        document.getElementById(k)?.scrollIntoView({ block: "start", behavior: "smooth" });
        return;
      }
      const W = N.closest("a[href]");
      if (W && !/^[a-z][a-z0-9+.-]*:/i.test(W.getAttribute("href") || "") && /\.md(#.*)?$/i.test(W.getAttribute("href") || "")) {
        w.preventDefault();
        const k = decodeURIComponent(W.getAttribute("href")), re = ((t.tab.path.includes("/") ? t.tab.path.slice(0, t.tab.path.lastIndexOf("/") + 1) : "") + k.split("#")[0]).split("/"), ne = [];
        for (const ae of re)
          ae === ".." ? ne.pop() : ae && ae !== "." && ne.push(ae);
        t.onOpenHit({ collection: t.tab.collection, path: ne.join("/"), title: ne[ne.length - 1].replace(/\.md$/i, ""), uri: "", modified_at: null, score: 0, snippet: [] });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t.tab.collection, t.tab.path, t.onOpenLink, t.onTag, t.onOpenHit]
  );
  function Z() {
    if (!n) return;
    const w = p.trim();
    t.onAddToChat && w ? t.onAddToChat(n, w) : t.onChat(n, w), u("");
  }
  function oe(w) {
    w.nativeEvent.isComposing || w.key === "Enter" && !w.shiftKey && (w.preventDefault(), Z());
  }
  const ke = n ? Object.entries(n.properties).filter(([w]) => w !== "private") : [];
  return /* @__PURE__ */ h("div", { className: "lib-scroll", ref: D, onWheel: t.tab.preview ? t.onTouch : void 0, children: [
    r && /* @__PURE__ */ s("div", { className: "lib-welcome", children: /* @__PURE__ */ h("div", { className: "lib-alert", role: "alert", children: [
      /* @__PURE__ */ s(z.Alert, { size: 16 }),
      /* @__PURE__ */ s("span", { children: r })
    ] }) }),
    !n && !r && /* @__PURE__ */ s("div", { className: "lib-doc", children: /* @__PURE__ */ h("div", { className: "lib-article lib-skeleton", "aria-busy": "true", "aria-label": "Loading note", children: [
      /* @__PURE__ */ s("i", { style: { width: "30%" } }),
      /* @__PURE__ */ s("i", { style: { width: "70%", height: 36 } }),
      /* @__PURE__ */ s("i", { style: { width: "45%" } }),
      /* @__PURE__ */ s("br", {}),
      [92, 88, 95, 60, 90, 84, 40].map((w, N) => /* @__PURE__ */ s("i", { style: { width: `${w}%` } }, N))
    ] }) }),
    n && B && /* @__PURE__ */ h("div", { className: "lib-doc", children: [
      /* @__PURE__ */ h("article", { className: "lib-article", children: [
        f > 0 && /* @__PURE__ */ h("div", { className: "lib-findbar", role: "group", "aria-label": "Matches in this note", children: [
          /* @__PURE__ */ h("span", { children: [
            T + 1,
            " / ",
            f
          ] }),
          /* @__PURE__ */ s("button", { type: "button", className: "lib-btn lib-btn-quiet lib-btn-icon", "aria-label": "Previous match", onClick: () => _((w) => (w - 1 + f) % f), children: /* @__PURE__ */ s(z.ChevronUp, { size: 14 }) }),
          /* @__PURE__ */ s("button", { type: "button", className: "lib-btn lib-btn-quiet lib-btn-icon", "aria-label": "Next match", onClick: () => _((w) => (w + 1) % f), children: /* @__PURE__ */ s(z.ChevronDown, { size: 14 }) })
        ] }),
        /* @__PURE__ */ h("nav", { className: "lib-crumbs", "aria-label": "Location", children: [
          /* @__PURE__ */ s(z.Folder, { size: 13 }),
          er(n.collection, n.path).split(" / ").map((w, N, H) => /* @__PURE__ */ h("span", { className: "lib-row", style: { gap: 4 }, children: [
            w,
            N < H.length - 1 && /* @__PURE__ */ s(z.Chevron, { size: 12 })
          ] }, N))
        ] }),
        /* @__PURE__ */ s("h1", { className: "lib-title", children: n.title }),
        /* @__PURE__ */ h("div", { className: "lib-docmeta", children: [
          n.modified_at && /* @__PURE__ */ h("span", { title: $n(n.modified_at), children: [
            /* @__PURE__ */ s(z.Clock, { size: 13 }),
            " Edited ",
            Je(n.modified_at)
          ] }),
          /* @__PURE__ */ h("span", { children: [
            n.reading_minutes,
            " min read · ",
            n.words.toLocaleString(),
            " words"
          ] }),
          n.private && /* @__PURE__ */ h("span", { className: "lib-tag lib-tag-warn", children: [
            /* @__PURE__ */ s(z.Lock, { size: 11 }),
            " private"
          ] }),
          n.stale_index && /* @__PURE__ */ s("span", { className: "lib-tag", title: "The file changed after QMD last indexed it. Search results may lag until the next qmd update.", children: "edited since indexed" }),
          n.source === "index" && /* @__PURE__ */ s("span", { className: "lib-tag lib-tag-warn", children: "file deleted · showing indexed copy" })
        ] }),
        /* @__PURE__ */ h("div", { className: "lib-actions", children: [
          /* @__PURE__ */ h(
            "button",
            {
              type: "button",
              className: "lib-btn lib-btn-primary",
              disabled: n.private,
              title: n.private ? "Private notes are not shared with an agent" : "Start a new chat about this note",
              onClick: () => t.onChat(n, ""),
              children: [
                /* @__PURE__ */ s(z.ChatPlus, { size: 15 }),
                "Chat about this"
              ]
            }
          ),
          t.onAddToChat && !n.private && /* @__PURE__ */ h("button", { type: "button", className: "lib-btn lib-btn-secondary", onClick: () => t.onAddToChat(n, ""), title: `Bring this note into “${t.activeChatTitle}”`, children: [
            /* @__PURE__ */ s(z.Plus, { size: 15 }),
            "Add to current chat"
          ] }),
          t.sessionsForDoc.slice(0, 2).map((w) => /* @__PURE__ */ h("button", { type: "button", className: "lib-btn lib-btn-quiet", onClick: () => t.onResumeSession(w), title: `Reopen chat from ${$n(w.created_at)}`, children: [
            /* @__PURE__ */ s(z.Chat, { size: 14 }),
            "Resume · ",
            Je(w.created_at)
          ] }, w.slot_key)),
          /* @__PURE__ */ s("span", { className: "lib-grow" }),
          n.obsidian && /* @__PURE__ */ h(
            "a",
            {
              className: "lib-btn lib-btn-quiet lib-btn-sm",
              href: `obsidian://open?${je({ vault: n.obsidian.vault, file: n.obsidian.file })}`,
              title: `Open in the “${n.obsidian.vault}” vault in Obsidian`,
              children: [
                /* @__PURE__ */ s(z.External, { size: 14 }),
                "Open in Obsidian"
              ]
            }
          ),
          /* @__PURE__ */ s(
            "button",
            {
              type: "button",
              className: "lib-btn lib-btn-quiet lib-btn-icon",
              title: "Copy the file path",
              "aria-label": "Copy the file path",
              onClick: () => {
                navigator.clipboard?.writeText(n.abs_path).then(() => t.notify("Path copied"));
              },
              children: /* @__PURE__ */ s(z.Copy, { size: 15 })
            }
          ),
          /* @__PURE__ */ s(
            "button",
            {
              type: "button",
              className: "lib-btn lib-btn-quiet lib-btn-icon",
              title: "Copy the [[wikilink]]",
              "aria-label": "Copy the wikilink",
              onClick: () => {
                navigator.clipboard?.writeText(`[[${n.title}]]`).then(() => t.notify("Wikilink copied"));
              },
              children: /* @__PURE__ */ s(z.Link, { size: 15 })
            }
          ),
          ke.length > 0 && /* @__PURE__ */ s("button", { type: "button", className: "lib-btn lib-btn-quiet lib-btn-sm", "aria-pressed": E, onClick: () => O((w) => !w), children: "Properties" })
        ] }),
        E && ke.length > 0 && /* @__PURE__ */ s("dl", { className: "lib-props", children: ke.map(([w, N]) => /* @__PURE__ */ h("div", { style: { display: "contents" }, children: [
          /* @__PURE__ */ s("dt", { children: w }),
          /* @__PURE__ */ s("dd", { children: N })
        ] }, w)) }),
        /* @__PURE__ */ s(
          "div",
          {
            ref: L,
            className: "lib-prose",
            style: { marginTop: 26 },
            onClick: ue,
            onKeyDown: (w) => {
              const N = w.target;
              (w.key === "Enter" || w.key === " ") && N.dataset.tag && (w.preventDefault(), t.onTag(N.dataset.tag));
            }
          }
        ),
        c && c.length > 0 && /* @__PURE__ */ h("section", { className: "lib-backlinks", "aria-label": "Linked from", children: [
          /* @__PURE__ */ h("h3", { children: [
            "Linked from ",
            c.length,
            " note",
            c.length === 1 ? "" : "s"
          ] }),
          c.map((w) => /* @__PURE__ */ h("button", { type: "button", className: "lib-backlink", onClick: () => t.onOpenHit(w), children: [
            /* @__PURE__ */ h("div", { className: "lib-row", children: [
              /* @__PURE__ */ s("b", { className: "lib-grow lib-ell", children: w.title }),
              /* @__PURE__ */ s("span", { className: "lib-meta-sm", children: Je(w.modified_at) })
            ] }),
            w.snippet.length > 0 && /* @__PURE__ */ s("div", { className: "lib-hit-snippet", children: /* @__PURE__ */ s(Ji, { parts: w.snippet, onLink: (N) => t.onOpenLink(N, "", w.collection) }) })
          ] }, X(w)))
        ] })
      ] }),
      B.outline.length > 1 && /* @__PURE__ */ h("nav", { className: "lib-outline", "aria-label": "On this page", children: [
        /* @__PURE__ */ s("h4", { children: "On this page" }),
        B.outline.map((w) => /* @__PURE__ */ s(
          "a",
          {
            href: `#${w.id}`,
            "data-depth": w.depth,
            "aria-current": S === w.id,
            onClick: (N) => {
              N.preventDefault(), document.getElementById(w.id)?.scrollIntoView({ block: "start", behavior: "smooth" });
            },
            children: w.text
          },
          w.id
        ))
      ] })
    ] }),
    n && !n.private && /* @__PURE__ */ h("div", { className: "lib-ask", children: [
      /* @__PURE__ */ s(z.Sparkles, { size: 17, "aria-hidden": "true" }),
      /* @__PURE__ */ s(
        "textarea",
        {
          rows: 1,
          value: p,
          onChange: (w) => {
            u(w.target.value), w.target.style.height = "auto", w.target.style.height = `${Math.min(160, w.target.scrollHeight)}px`;
          },
          onKeyDown: oe,
          placeholder: t.onAddToChat ? `Ask in “${t.activeChatTitle}” about this note…` : "Ask anything about this note…",
          "aria-label": "Ask about this note"
        }
      ),
      /* @__PURE__ */ s("button", { type: "button", className: "lib-btn lib-btn-primary lib-btn-icon", "aria-label": "Ask", onClick: Z, children: /* @__PURE__ */ s(z.ArrowUp, { size: 16, strokeWidth: 2.6 }) })
    ] })
  ] });
}
function Ql(t) {
  const e = Gr(), n = t.open.find((o) => o.slot_key === t.active) ?? null, i = new Set(t.open.map((o) => o.slot_key)), r = t.sessions.filter((o) => !i.has(o.slot_key)), l = t.currentDocKey ? r.filter((o) => o.docs.some((p) => X(p) === t.currentDocKey)) : [], c = r.filter((o) => !l.includes(o));
  return /* @__PURE__ */ h("aside", { className: "lib-right", "aria-label": "Chats", children: [
    /* @__PURE__ */ h("div", { className: "lib-chathead", children: [
      /* @__PURE__ */ s("h2", { className: "lib-grow", children: "Chats" }),
      n && /* @__PURE__ */ s(
        "button",
        {
          type: "button",
          className: "lib-btn lib-btn-quiet lib-btn-icon",
          title: "Open this chat full screen",
          "aria-label": "Open this chat full screen",
          onClick: () => e(`/chat?sid=${encodeURIComponent(n.slot_key)}`),
          children: /* @__PURE__ */ s(z.External, { size: 15 })
        }
      ),
      /* @__PURE__ */ s("button", { type: "button", className: "lib-btn lib-btn-quiet lib-btn-icon", "aria-label": "Hide chats", onClick: t.onCloseDrawer, children: /* @__PURE__ */ s(z.PanelRight, { size: 16 }) })
    ] }),
    t.open.length > 0 && /* @__PURE__ */ s("div", { className: "lib-chattabs", role: "tablist", "aria-label": "Open chats", children: t.open.map((o) => /* @__PURE__ */ h(
      "div",
      {
        role: "tab",
        tabIndex: 0,
        "aria-selected": o.slot_key === t.active,
        className: "lib-chattab",
        title: o.title,
        onClick: () => t.onActivate(o.slot_key),
        onKeyDown: (p) => (p.key === "Enter" || p.key === " ") && t.onActivate(o.slot_key),
        children: [
          /* @__PURE__ */ s("span", { className: "lib-dot", "data-live": t.starting === o.slot_key }),
          /* @__PURE__ */ s("span", { className: "lib-ell", children: o.title.replace(/^📄\s*/, "") }),
          /* @__PURE__ */ s(
            "span",
            {
              className: "lib-tab-x",
              role: "button",
              "aria-label": `Close ${o.title}`,
              onClick: (p) => {
                p.stopPropagation(), t.onClose(o.slot_key);
              },
              children: /* @__PURE__ */ s(z.X, { size: 12, strokeWidth: 2.6 })
            }
          )
        ]
      },
      o.slot_key
    )) }),
    n ? /* @__PURE__ */ h(Jt, { children: [
      n.docs.length > 0 && /* @__PURE__ */ h("div", { className: "lib-context", children: [
        /* @__PURE__ */ s("span", { children: "About" }),
        n.docs.map((o) => /* @__PURE__ */ h("button", { type: "button", className: "lib-docchip", onClick: () => t.onOpenDoc(o), title: `${o.collection}/${o.path}`, children: [
          /* @__PURE__ */ s(z.File, { size: 12 }),
          /* @__PURE__ */ s("span", { className: "lib-ell", children: o.title })
        ] }, X(o)))
      ] }),
      /* @__PURE__ */ s("div", { className: "lib-chatbody", children: /* @__PURE__ */ s(jr, { slotKey: n.slot_key, frameless: !0, startAtBottom: !0, placeholder: "Reply…" }, n.slot_key) })
    ] }) : /* @__PURE__ */ h("div", { className: "lib-convos", children: [
      t.sessions.length === 0 && /* @__PURE__ */ h("div", { className: "lib-empty", children: [
        /* @__PURE__ */ s("h3", { children: "No chats yet" }),
        /* @__PURE__ */ h("p", { children: [
          "Open a note and press ",
          /* @__PURE__ */ s("b", { children: "Chat about this" }),
          ", or select several results and chat about them together. Each chat is a full session in your sidebar."
        ] })
      ] }),
      l.length > 0 && /* @__PURE__ */ s("div", { className: "lib-section", children: "About this note" }),
      l.map((o) => /* @__PURE__ */ s(Yi, { s: o, onResume: t.onResume, onForget: t.onForget }, o.slot_key)),
      c.length > 0 && /* @__PURE__ */ s("div", { className: "lib-section", children: "Earlier" }),
      c.map((o) => /* @__PURE__ */ s(Yi, { s: o, onResume: t.onResume, onForget: t.onForget }, o.slot_key))
    ] })
  ] });
}
function Yi({ s: t, onResume: e, onForget: n }) {
  return /* @__PURE__ */ h("div", { className: "lib-row", style: { alignItems: "flex-start" }, children: [
    /* @__PURE__ */ h("button", { type: "button", className: "lib-convo lib-grow", onClick: () => e(t), title: $n(t.created_at), children: [
      /* @__PURE__ */ s("b", { className: "lib-ell", style: { maxWidth: "100%" }, children: t.title.replace(/^📄\s*/, "") }),
      /* @__PURE__ */ h("span", { className: "lib-meta-sm lib-ell", style: { maxWidth: "100%" }, children: [
        Je(t.created_at),
        " · ",
        t.docs.map((i) => i.title).join(", ")
      ] })
    ] }),
    /* @__PURE__ */ s("button", { type: "button", className: "lib-btn lib-btn-quiet lib-btn-icon", style: { marginTop: 8 }, "aria-label": `Remove ${t.title} from this list`, title: "Remove from this list (the chat stays in your sidebar)", onClick: () => n(t), children: /* @__PURE__ */ s(z.X, { size: 13 }) })
  ] });
}
const Vl = { obsidian: "Obsidian vault", reflect: "Reflect graph", markdown: "Markdown" };
function Jl(t) {
  return t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "notes";
}
function eo(t) {
  return t.replace(/[\\/]+$/, "").split(/[\\/]/).pop() || "";
}
const Dt = (t) => t.state === "queued" || t.state === "running";
function vr(t) {
  const e = qn(), [n, i] = P(null), [r, l] = P(null), [c, o] = P(""), [p, u] = P(""), [S, y] = P(!1), [T, _] = P(""), [f, v] = P(!1), [E, O] = P(null), [L, D] = P(!1), [Y, B] = P(null), ue = et(/* @__PURE__ */ new Set()), Z = de(() => e.get(`${he}/folders`).then((k) => {
    i(k), l(null);
    let $ = !1;
    for (const re of k.jobs)
      !Dt(re) && !ue.current.has(re.id) && (ue.current.add(re.id), $ = !0);
    return $ && t.onChanged(), k;
  }).catch((k) => l(Ze(k))), [e]);
  Ce(() => {
    Z().then((k) => k && k.jobs.forEach(($) => !Dt($) && ue.current.add($.id)));
  }, [Z]);
  const oe = n?.jobs.some(Dt) ?? !1;
  Ce(() => {
    if (!oe) return;
    const k = window.setInterval(() => {
      Z();
    }, 1500);
    return () => window.clearInterval(k);
  }, [oe, Z]);
  function ke(k) {
    o(k), O(null), S || u(Jl(eo(k)));
  }
  async function w(k) {
    D(!0), O(null);
    try {
      await e.post(`${he}/folders`, k), o(""), u(""), y(!1), _(""), v(!1), await Z();
    } catch ($) {
      O(Ze($));
    } finally {
      D(!1);
    }
  }
  function N(k) {
    k.preventDefault(), c.trim() && w({ path: c.trim(), name: p.trim(), mask: T.trim() || void 0 });
  }
  async function H(k, $) {
    B(null);
    try {
      k === "remove" ? await e.del(`${he}/folders/${encodeURIComponent($)}`) : await e.post(`${he}/folders/${encodeURIComponent($)}/reindex`, {}), await Z();
    } catch (re) {
      O(Ze(re));
    }
  }
  if (r && !n)
    return /* @__PURE__ */ h("div", { className: "lib-alert", role: "alert", children: [
      /* @__PURE__ */ s(z.Alert, { size: 16 }),
      /* @__PURE__ */ s("span", { children: r })
    ] });
  if (!n)
    return /* @__PURE__ */ h("div", { className: "lib-skeleton", "aria-busy": "true", "aria-label": "Loading folders", children: [
      /* @__PURE__ */ s("i", { style: { width: "60%" } }),
      /* @__PURE__ */ s("i", { style: { width: "85%" } })
    ] });
  const F = (k) => n.jobs.find(($) => $.collection === k && Dt($)), q = n.jobs.filter((k) => k.kind === "add" && Dt(k) && !n.folders.some(($) => $.name === k.collection)), W = n.jobs.filter((k) => k.state === "failed").slice(0, 3);
  return /* @__PURE__ */ h("div", { className: "lib-folders", children: [
    !n.qmd && /* @__PURE__ */ h("div", { className: "lib-alert", role: "alert", children: [
      /* @__PURE__ */ s(z.Terminal, { size: 16 }),
      /* @__PURE__ */ h("div", { children: [
        /* @__PURE__ */ s("b", { children: "QMD isn’t installed." }),
        " Notes Search uses it to index your notes. Install it with Node 22 or newer, then reload this page:",
        /* @__PURE__ */ s("pre", { className: "lib-cmd", children: "npm install -g @tobilu/qmd" })
      ] })
    ] }),
    n.suggestions.length > 0 && /* @__PURE__ */ h("section", { "aria-label": "Obsidian vaults on this computer", children: [
      /* @__PURE__ */ s("div", { className: "lib-section", style: { paddingLeft: 0 }, children: "Found on this computer" }),
      n.suggestions.map((k) => /* @__PURE__ */ h("div", { className: "lib-folder", children: [
        /* @__PURE__ */ h("div", { className: "lib-grow", style: { minWidth: 0 }, children: [
          /* @__PURE__ */ h("div", { className: "lib-row", style: { gap: 8 }, children: [
            /* @__PURE__ */ s("b", { className: "lib-ell", children: k.label }),
            /* @__PURE__ */ s("span", { className: "lib-tag", children: "Obsidian vault" })
          ] }),
          /* @__PURE__ */ s("div", { className: "lib-folder-path lib-ell", title: k.path, children: k.path })
        ] }),
        /* @__PURE__ */ h("button", { type: "button", className: "lib-btn lib-btn-secondary lib-btn-sm", disabled: !n.qmd || L, onClick: () => {
          w({ path: k.path, name: k.name });
        }, children: [
          /* @__PURE__ */ s(z.Plus, { size: 14 }),
          " Add"
        ] })
      ] }, k.path))
    ] }),
    /* @__PURE__ */ h("form", { className: "lib-folder-form", onSubmit: N, "aria-label": "Add a folder", children: [
      /* @__PURE__ */ s("div", { className: "lib-section", style: { paddingLeft: 0 }, children: t.firstRun ? "Add a folder of notes" : "Add a folder" }),
      /* @__PURE__ */ h("label", { className: "lib-field", children: [
        /* @__PURE__ */ s("span", { children: "Folder" }),
        /* @__PURE__ */ s(
          "input",
          {
            value: c,
            onChange: (k) => ke(k.target.value),
            placeholder: "~/Documents/Notes",
            spellCheck: !1,
            autoComplete: "off",
            "aria-describedby": "lib-folder-hint"
          }
        )
      ] }),
      /* @__PURE__ */ h("div", { id: "lib-folder-hint", className: "lib-meta-sm", children: [
        "An Obsidian vault, a Reflect graph, or any folder of .md files. For a vault, use the folder that contains ",
        /* @__PURE__ */ s("code", { children: ".obsidian" }),
        "."
      ] }),
      f && /* @__PURE__ */ h("div", { className: "lib-row", style: { gap: 10, alignItems: "flex-start" }, children: [
        /* @__PURE__ */ h("label", { className: "lib-field lib-grow", children: [
          /* @__PURE__ */ s("span", { children: "Name" }),
          /* @__PURE__ */ s(
            "input",
            {
              value: p,
              onChange: (k) => {
                u(k.target.value), y(!0);
              },
              placeholder: "notes",
              spellCheck: !1
            }
          )
        ] }),
        /* @__PURE__ */ h("label", { className: "lib-field lib-grow", children: [
          /* @__PURE__ */ s("span", { children: "Files" }),
          /* @__PURE__ */ s("input", { value: T, onChange: (k) => _(k.target.value), placeholder: "**/*.md", spellCheck: !1 })
        ] })
      ] }),
      E && /* @__PURE__ */ h("div", { className: "lib-alert lib-alert-error", role: "alert", children: [
        /* @__PURE__ */ s(z.Alert, { size: 16 }),
        /* @__PURE__ */ s("span", { children: E })
      ] }),
      /* @__PURE__ */ h("div", { className: "lib-row", style: { gap: 8 }, children: [
        /* @__PURE__ */ h("button", { type: "submit", className: "lib-btn lib-btn-primary", disabled: !n.qmd || L || !c.trim(), children: [
          L ? /* @__PURE__ */ s(z.Loader, { size: 15, className: "lib-spin" }) : /* @__PURE__ */ s(z.FolderPlus, { size: 15 }),
          "Add and index"
        ] }),
        /* @__PURE__ */ s("button", { type: "button", className: "lib-btn lib-btn-quiet lib-btn-sm", "aria-expanded": f, onClick: () => v((k) => !k), children: f ? "Fewer options" : "Name and file pattern" })
      ] })
    ] }),
    (n.folders.length > 0 || q.length > 0) && /* @__PURE__ */ h("section", { "aria-label": "Searched folders", children: [
      /* @__PURE__ */ s("div", { className: "lib-section", style: { paddingLeft: 0 }, children: "Searched folders" }),
      q.map((k) => /* @__PURE__ */ s("div", { className: "lib-folder", "aria-busy": "true", children: /* @__PURE__ */ h("div", { className: "lib-grow", style: { minWidth: 0 }, children: [
        /* @__PURE__ */ s("b", { children: k.collection }),
        /* @__PURE__ */ s(Xi, { job: k })
      ] }) }, k.id)),
      n.folders.map((k) => {
        const $ = F(k.name);
        return /* @__PURE__ */ h("div", { className: "lib-folder", "aria-busy": $ ? !0 : void 0, children: [
          /* @__PURE__ */ h("div", { className: "lib-grow", style: { minWidth: 0 }, children: [
            /* @__PURE__ */ h("div", { className: "lib-row", style: { gap: 8 }, children: [
              /* @__PURE__ */ s("b", { className: "lib-ell", children: k.name }),
              /* @__PURE__ */ s("span", { className: "lib-tag", children: Vl[k.kind] }),
              /* @__PURE__ */ h("span", { className: "lib-meta-sm", children: [
                k.docs.toLocaleString(),
                " notes"
              ] })
            ] }),
            /* @__PURE__ */ s("div", { className: "lib-folder-path lib-ell", title: k.path, children: k.path }),
            $ && /* @__PURE__ */ s(Xi, { job: $ }),
            Y === k.name && /* @__PURE__ */ h("div", { className: "lib-folder-confirm", role: "group", "aria-label": `Remove ${k.name}`, children: [
              /* @__PURE__ */ h("span", { children: [
                "Remove “",
                k.name,
                "” from Notes Search? Your files stay on disk, and you can add the folder again later."
              ] }),
              /* @__PURE__ */ h("div", { className: "lib-row", style: { gap: 6 }, children: [
                /* @__PURE__ */ s("button", { type: "button", className: "lib-btn lib-btn-danger lib-btn-sm", onClick: () => {
                  H("remove", k.name);
                }, children: "Remove" }),
                /* @__PURE__ */ s("button", { type: "button", className: "lib-btn lib-btn-quiet lib-btn-sm", onClick: () => B(null), children: "Cancel" })
              ] })
            ] })
          ] }),
          !$ && Y !== k.name && /* @__PURE__ */ h("div", { className: "lib-row", style: { gap: 2, flex: "none" }, children: [
            /* @__PURE__ */ h("button", { type: "button", className: "lib-btn lib-btn-quiet lib-btn-sm", disabled: !n.qmd, title: "Re-read changed files and refresh search by meaning", onClick: () => {
              H("reindex", k.name);
            }, children: [
              /* @__PURE__ */ s(z.Refresh, { size: 14 }),
              " Re-index"
            ] }),
            /* @__PURE__ */ s("button", { type: "button", className: "lib-btn lib-btn-quiet lib-btn-icon", disabled: !n.qmd, "aria-label": `Remove ${k.name}`, title: "Remove from Notes Search", onClick: () => B(k.name), children: /* @__PURE__ */ s(z.Trash, { size: 14 }) })
          ] })
        ] }, k.name);
      })
    ] }),
    W.length > 0 && /* @__PURE__ */ s("section", { "aria-label": "Recent problems", children: W.map((k) => /* @__PURE__ */ h("div", { className: "lib-alert lib-alert-error", role: "alert", children: [
      /* @__PURE__ */ s(z.Alert, { size: 16 }),
      /* @__PURE__ */ h("span", { children: [
        /* @__PURE__ */ h("b", { children: [
          k.kind === "add" ? "Adding" : k.kind === "remove" ? "Removing" : "Re-indexing",
          " “",
          k.collection,
          "” failed"
        ] }),
        k.step ? ` while ${k.step.toLowerCase()}` : "",
        ": ",
        k.message || "qmd exited with an error",
        k.finished_at ? ` · ${Je(k.finished_at)}` : ""
      ] })
    ] }, k.id)) }),
    /* @__PURE__ */ h("div", { className: "lib-meta-sm lib-folders-foot", children: [
      "QMD doesn’t watch for changes. Re-index after editing notes, or schedule ",
      /* @__PURE__ */ s("code", { children: "qmd update && qmd embed" }),
      " to run on its own. Index: ",
      /* @__PURE__ */ s("code", { children: n.index })
    ] })
  ] });
}
function Xi({ job: t }) {
  return /* @__PURE__ */ h("div", { className: "lib-folder-job", role: "status", children: [
    /* @__PURE__ */ s(z.Loader, { size: 13, className: "lib-spin" }),
    /* @__PURE__ */ h("span", { children: [
      t.state === "queued" ? "Waiting…" : `${t.step}…`,
      t.kind === "add" && t.step.startsWith("Building") ? " Keyword search already works. The first run downloads models and can take a few minutes." : ""
    ] }),
    t.message && /* @__PURE__ */ s("span", { className: "lib-ell lib-meta-sm", children: t.message })
  ] });
}
const yr = "notes-search:v1";
function to() {
  try {
    const t = window.localStorage.getItem(yr);
    return t ? JSON.parse(t) : {};
  } catch {
    return {};
  }
}
function oo() {
  const t = qn(), e = Zr(), n = Fn(to, []), [i, r] = P(null), [l, c] = P(""), [o, p] = P(n.collection ?? null), [u, S] = P(n.sort === "recent" ? "recent" : "relevance"), [y, T] = P(0), [_, f] = P([]), [v, E] = P(/* @__PURE__ */ new Map()), [O, L] = P((n.tabs ?? []).map((x) => ({ ...x, preview: !1 }))), [D, Y] = P(n.active ?? null), [B, ue] = P(n.leftOpen ?? !0), [Z, oe] = P([]), [ke, w] = P(n.chats ?? []), [N, H] = P(n.activeChat ?? null), [F, q] = P(n.chatOpen ?? !1), [W, k] = P(null), [$, re] = P(null), ne = et(null), ae = et(/* @__PURE__ */ new Map()), Ae = Xr(t, l, o, u), ze = Qr(t), qt = tr({ query: l, suggest: Ae.result, deep: ze.result, recent: _, sort: u }), Ue = de((x, A = "info") => {
    re({ msg: x, kind: A }), window.setTimeout(() => re((C) => C?.msg === x ? null : C), A === "error" ? 6e3 : 2200);
  }, []);
  Ce(() => {
    const x = { tabs: O.filter((A) => !A.preview || X(A) === D), active: D, chats: ke, activeChat: N, chatOpen: F, leftOpen: B, collection: o, sort: u };
    try {
      window.localStorage.setItem(yr, JSON.stringify(x));
    } catch {
    }
  }, [O, D, ke, N, F, B, o, u]);
  const Oe = de(() => {
    t.get(`${he}/sessions`).then((x) => oe(x.sessions)).catch(() => {
    });
  }, [t]), [Q, vt] = P(!1), [an, ln] = P(0), st = de(() => {
    t.get(`${he}/status`).then(r).catch((x) => r({ index: "", qmd: null, schema_ok: !1, collections: [], documents: 0, index_updated_at: null, error: Ze(x) }));
  }, [t]), Ut = de(() => {
    st(), ln((x) => x + 1);
  }, [st]);
  Ce(() => {
    st(), Oe();
  }, [st, Oe]), Ce(() => {
    t.get(`${he}/recent?${je({ c: o, limit: 30 })}`).then((x) => f(x.results)).catch(() => f([]));
  }, [t, o, an]), Ce(() => {
    ze.result && ze.result.query !== l.trim() && ze.clear();
  }, [l]);
  const Pe = de((x, A = {}) => {
    const C = X(x);
    L((K) => {
      const J = A.words ?? [];
      if (K.find((ve) => X(ve) === C))
        return K.map((ve) => X(ve) === C ? { ...ve, preview: ve.preview && !A.pin, words: J, heading: A.heading } : ve);
      const Be = { collection: x.collection, path: x.path, title: x.title, preview: !A.pin, words: J, heading: A.heading }, He = K.findIndex((ve) => ve.preview);
      if (He >= 0) {
        const ve = [...K];
        return ve[He] = Be, ve;
      }
      return [...K, Be];
    }), Y(C), vt(!1);
  }, []), Bt = de(
    (x) => {
      L((A) => {
        const C = A.findIndex((J) => X(J) === x), K = A.filter((J) => X(J) !== x);
        if (D === x) {
          const J = K[Math.min(C, K.length - 1)];
          Y(J ? X(J) : null);
        }
        return K;
      });
    },
    [D]
  ), yt = de((x) => L((A) => A.map((C) => X(C) === x ? { ...C, preview: !1 } : C)), []), wt = de(
    (x, A, C) => {
      t.get(`${he}/resolve?${je({ t: x, c: C })}`).then((K) => Pe(K, { pin: !0, heading: A || void 0 })).catch(() => Ue(`No note is titled “${x}” yet`, "error"));
    },
    [t, Pe, Ue]
  ), te = de(
    (x, A) => {
      if (T(x), A) {
        const C = qt.flat[x];
        C && Pe(C.hit, { words: C.words });
      }
    },
    [qt.flat, Pe]
  ), Tt = de((x) => {
    E((A) => {
      const C = new Map(A), K = X(x);
      return C.has(K) ? C.delete(K) : C.set(K, x), C;
    });
  }, []), V = de(
    async (x, A) => {
      q(!0), k("pending");
      try {
        const C = await ea(t, x, A);
        return w((K) => [C, ...K.filter((J) => J.slot_key !== C.slot_key)]), H(C.slot_key), k(C.slot_key), window.setTimeout(() => k((K) => K === C.slot_key ? null : K), 8e3), Oe(), C;
      } catch (C) {
        return k(null), Ue(Ze(C), "error"), null;
      }
    },
    [t, Ue, Oe]
  ), St = de(() => {
    const x = [...v.values()].map((A) => ({ collection: A.collection, path: A.path, title: A.title }));
    V(x, "").then((A) => A && E(/* @__PURE__ */ new Map()));
  }, [v, V]), se = ke.find((x) => x.slot_key === N) ?? null, tt = de(
    (x, A) => {
      if (!se) return;
      const C = se.docs.some((J) => X(J) === X(x)), K = C ? A.trim() || "Look at this note again." : ta(x, A);
      if (q(!0), Vi(t, se.slot_key, K).catch((J) => Ue(Ze(J), "error")), !C) {
        const J = { ...se, docs: [...se.docs, { collection: x.collection, path: x.path, title: x.title }] };
        w((we) => we.map((Be) => Be.slot_key === J.slot_key ? J : Be)), t.post(`${he}/sessions`, J).then(Oe).catch(() => {
        });
      }
    },
    [t, se, Ue, Oe]
  ), ct = de((x) => {
    w((A) => A.some((C) => C.slot_key === x.slot_key) ? A : [x, ...A]), H(x.slot_key), q(!0);
  }, []), Me = de(
    (x) => {
      w((A) => {
        const C = A.filter((K) => K.slot_key !== x);
        return N === x && H(C[0]?.slot_key ?? null), C;
      });
    },
    [N]
  ), Ht = de(
    (x) => {
      t.del(`${he}/sessions/${encodeURIComponent(x.slot_key)}`).then(Oe).catch(() => {
      });
    },
    [t, Oe]
  );
  Ce(() => {
    const x = (A) => {
      const C = A.target, K = !!C && (C.tagName === "INPUT" || C.tagName === "TEXTAREA" || C.isContentEditable), J = A.metaKey || A.ctrlKey;
      if (J && A.key.toLowerCase() === "k" || !K && A.key === "/")
        A.preventDefault(), ue(!0), window.setTimeout(() => {
          ne.current?.focus(), ne.current?.select();
        }, 0);
      else if (J && A.key.toLowerCase() === "j")
        A.preventDefault(), q((we) => !we);
      else if (J && A.key === "\\")
        A.preventDefault(), ue((we) => !we);
      else if (!K && A.altKey && /^[1-9]$/.test(A.key)) {
        const we = O[Number(A.key) - 1];
        we && Y(X(we));
      }
    };
    return window.addEventListener("keydown", x), () => window.removeEventListener("keydown", x);
  }, [O]);
  const $e = O.find((x) => X(x) === D) ?? null, Wt = $e ? Z.filter((x) => x.docs.some((A) => X(A) === X($e))) : [], _t = i ? { documents: i.documents, updated: i.index_updated_at, error: i.error } : null;
  return /* @__PURE__ */ h("div", { className: "lib", "data-mode": e?.mode === "light" ? "light" : "dark", "data-testid": "notes-search-root", children: [
    /* @__PURE__ */ s("style", { children: Yr }),
    $ && /* @__PURE__ */ s("div", { className: "lib-toast", role: "status", "data-kind": $.kind, children: $.msg }),
    /* @__PURE__ */ h("div", { className: "lib-frame", "data-chat": F ? "open" : "closed", "data-left": B ? "open" : "closed", children: [
      B ? /* @__PURE__ */ s(
        oa,
        {
          ref: ne,
          query: l,
          onQuery: c,
          collections: i?.collections ?? [],
          collection: o,
          onCollection: p,
          suggest: Ae.result,
          suggestLoading: Ae.loading,
          suggestError: Ae.error,
          deep: ze.result,
          deepRunning: ze.running,
          deepError: ze.error,
          onDeep: () => ze.run(l, o),
          recent: _,
          activeKey: D,
          selected: y,
          onSelected: te,
          onOpen: (x, A) => Pe(x, A),
          onLink: (x, A) => wt(x, "", A),
          picks: v,
          onTogglePick: Tt,
          onClearPicks: () => E(/* @__PURE__ */ new Map()),
          onChatPicks: St,
          indexInfo: _t,
          sort: u,
          onSort: S
        }
      ) : /* @__PURE__ */ s("div", {}),
      /* @__PURE__ */ h("main", { className: "lib-center", "aria-label": "Reader", children: [
        /* @__PURE__ */ s(
          Yl,
          {
            tabs: O,
            active: D,
            onActivate: Y,
            onClose: Bt,
            onPin: yt,
            leftOpen: B,
            onToggleLeft: () => ue((x) => !x),
            chatOpen: F,
            chatCount: ke.length,
            onToggleChat: () => q((x) => !x),
            foldersOpen: Q,
            onToggleFolders: () => vt((x) => !x)
          }
        ),
        Q ? /* @__PURE__ */ s("div", { className: "lib-scroll", children: /* @__PURE__ */ h("div", { className: "lib-welcome", style: { paddingTop: 48 }, children: [
          /* @__PURE__ */ h("div", { className: "lib-row", style: { gap: 10 }, children: [
            /* @__PURE__ */ s("h2", { className: "lib-grow", children: "Folders" }),
            /* @__PURE__ */ s("button", { type: "button", className: "lib-btn lib-btn-quiet lib-btn-icon", "aria-label": "Close folders", onClick: () => vt(!1), children: /* @__PURE__ */ s(z.X, { size: 16 }) })
          ] }),
          /* @__PURE__ */ s("p", { children: "Notes Search looks in every folder listed here. Each one is a QMD collection on this computer." }),
          /* @__PURE__ */ s(vr, { onChanged: Ut })
        ] }) }) : $e ? /* @__PURE__ */ s(
          Xl,
          {
            tab: $e,
            onTouch: () => yt(X($e)),
            onOpenLink: wt,
            onOpenHit: (x) => Pe(x, { pin: !0 }),
            onTag: (x) => {
              ue(!0), c(x), T(0);
            },
            onChat: (x, A) => {
              yt(X(x)), V([{ collection: x.collection, path: x.path, title: x.title }], A);
            },
            onAddToChat: se && F ? tt : null,
            activeChatTitle: se ? se.title.replace(/^📄\s*/, "") : null,
            sessionsForDoc: Wt.filter((x) => x.slot_key !== N),
            onResumeSession: ct,
            notify: Ue,
            onDocLoaded: (x) => {
              ae.current.set(X(x), x), x.title !== $e.title && L((A) => A.map((C) => X(C) === X(x) ? { ...C, title: x.title } : C));
            }
          },
          X($e)
        ) : /* @__PURE__ */ s(no, { status: i, sessions: Z, onResume: ct, onSearch: () => ne.current?.focus(), recent: _, onOpen: (x) => Pe(x, { pin: !0 }), onFoldersChanged: Ut })
      ] }),
      F ? /* @__PURE__ */ s(
        Ql,
        {
          open: ke,
          active: N,
          starting: W,
          sessions: Z,
          currentDocKey: D,
          onActivate: H,
          onClose: Me,
          onCloseDrawer: () => q(!1),
          onResume: ct,
          onOpenDoc: (x) => Pe(x, { pin: !0 }),
          onForget: Ht
        }
      ) : /* @__PURE__ */ s("div", {})
    ] })
  ] });
}
function no(t) {
  const e = (/* @__PURE__ */ new Date()).getHours(), n = e < 12 ? "Good morning" : e < 18 ? "Good afternoon" : "Good evening";
  return t.status && (t.status.collections.length === 0 || /index not found/i.test(t.status.error ?? "")) ? /* @__PURE__ */ s("div", { className: "lib-scroll", children: /* @__PURE__ */ h("div", { className: "lib-welcome", children: [
    /* @__PURE__ */ s("h2", { children: "Point Notes Search at your notes" }),
    /* @__PURE__ */ s("p", { children: "Add a folder of markdown, such as an Obsidian vault or a Reflect graph. Notes Search indexes it with QMD on this computer, then you can search it, read notes and chat about them. Nothing leaves your machine until you start a chat." }),
    /* @__PURE__ */ s("div", { className: "lib-welcome-folders", children: /* @__PURE__ */ s(vr, { onChanged: t.onFoldersChanged, firstRun: !0 }) })
  ] }) }) : /* @__PURE__ */ s("div", { className: "lib-scroll", children: /* @__PURE__ */ h("div", { className: "lib-welcome lib-welcome-quiet", children: [
    /* @__PURE__ */ s("div", { className: "lib-meta-sm", children: n }),
    /* @__PURE__ */ s("h2", { children: "Search your notes" }),
    /* @__PURE__ */ s("p", { children: "Matching passages appear as you type. Open a note to read it, then chat about it, or select a few results and talk about them together." }),
    /* @__PURE__ */ h("div", { className: "lib-row", style: { gap: 8 }, children: [
      /* @__PURE__ */ h("button", { type: "button", className: "lib-btn lib-btn-primary", onClick: t.onSearch, children: [
        /* @__PURE__ */ s(z.Search, { size: 15 }),
        " Start searching"
      ] }),
      t.recent[0] && /* @__PURE__ */ h("button", { type: "button", className: "lib-btn lib-btn-secondary lib-ell", style: { maxWidth: 320 }, onClick: () => t.onOpen(t.recent[0]), children: [
        /* @__PURE__ */ s(z.Clock, { size: 15 }),
        " ",
        /* @__PURE__ */ h("span", { className: "lib-ell", children: [
          "Continue “",
          t.recent[0].title,
          "”"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ h("div", { className: "lib-keyline", "aria-label": "Keyboard shortcuts", children: [
      /* @__PURE__ */ h("span", { children: [
        /* @__PURE__ */ s("span", { className: "lib-kbd", children: "/" }),
        " search"
      ] }),
      /* @__PURE__ */ h("span", { children: [
        /* @__PURE__ */ h("span", { className: "lib-kbd", children: [
          Ot,
          "↵"
        ] }),
        " search by meaning"
      ] }),
      /* @__PURE__ */ h("span", { children: [
        /* @__PURE__ */ s("span", { className: "lib-kbd", children: "⇧↵" }),
        " select several"
      ] }),
      /* @__PURE__ */ h("span", { children: [
        /* @__PURE__ */ h("span", { className: "lib-kbd", children: [
          Ot,
          "J"
        ] }),
        " chats"
      ] })
    ] }),
    t.sessions.length > 0 && /* @__PURE__ */ h("div", { style: { marginTop: 12 }, children: [
      /* @__PURE__ */ s("div", { className: "lib-section", style: { paddingLeft: 0 }, children: "Recent chats" }),
      t.sessions.slice(0, 5).map((i) => /* @__PURE__ */ h("button", { type: "button", className: "lib-convo", onClick: () => t.onResume(i), children: [
        /* @__PURE__ */ s("b", { children: i.title.replace(/^📄\s*/, "") }),
        /* @__PURE__ */ s("span", { className: "lib-meta-sm", children: Je(i.created_at) })
      ] }, i.slot_key))
    ] })
  ] }) });
}
export {
  oo as default
};
