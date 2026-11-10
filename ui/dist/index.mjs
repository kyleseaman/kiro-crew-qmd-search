import { jsx as s, Fragment as Qt, jsxs as h } from "react/jsx-runtime";
import { useState as D, useRef as Ve, useEffect as Ee, useCallback as oe, forwardRef as Tr, useMemo as Nn, useLayoutEffect as Sr } from "react";
import { useAppApi as _r, useNavigate as Ar, ChatEmbed as Er, useTheme as Nr } from "@kirocrew/app-sdk";
import Rr from "lucide-react";
const Cr = `
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
.lib button { font: inherit; color: inherit; }
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
  width: 32px;
  height: 32px;
  flex: none;
  border-radius: 999px;
  background: var(--accent);
  color: var(--accent-on);
  display: grid;
  place-items: center;
}
.lib-brand h1 {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 23px;
  letter-spacing: -0.01em;
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
.lib-hit[aria-selected="true"] { background: var(--raised); box-shadow: var(--shadow-sm); }
.lib-hit[aria-selected="true"]::before {
  content: "";
  position: absolute;
  left: 0;
  top: 12px;
  bottom: 12px;
  width: 3px;
  border-radius: 3px;
  background: var(--accent);
}
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
  width: 22px;
  height: 22px;
  border-radius: 999px;
  border: 2px solid var(--sage);
  background: var(--raised);
  color: var(--accent-on);
  display: grid;
  place-items: center;
  cursor: pointer;
  padding: 0;
  opacity: 0;
  transition: opacity .12s;
}
.lib-hit:hover .lib-check, .lib-hit:focus-within .lib-check, .lib-results[data-picking="true"] .lib-check { opacity: 1; }
.lib-check[aria-checked="true"] { background: var(--sage); border-color: var(--sage); opacity: 1; }
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
function W(t) {
  const e = Rr[t];
  return e || (({ size: i = 16 }) => /* @__PURE__ */ s("span", { "aria-hidden": "true", "data-missing-icon": t, style: { display: "inline-block", width: i, height: i } }));
}
const $ = {
  Search: W("Search"),
  Brand: W("Search"),
  File: W("FileText"),
  Calendar: W("CalendarDays"),
  Sparkles: W("Sparkles"),
  Chat: W("MessageSquare"),
  ChatPlus: W("MessageSquarePlus"),
  X: W("X"),
  Check: W("Check"),
  Chevron: W("ChevronRight"),
  ChevronUp: W("ChevronUp"),
  ChevronDown: W("ChevronDown"),
  ArrowUp: W("ArrowUp"),
  External: W("ExternalLink"),
  Copy: W("Copy"),
  Link: W("Link2"),
  Clock: W("Clock"),
  Lock: W("Lock"),
  Alert: W("AlertTriangle"),
  Loader: W("Loader2"),
  PanelLeft: W("PanelLeft"),
  PanelRight: W("PanelRight"),
  Plus: W("Plus"),
  ListTree: W("ListTree"),
  Brain: W("Brain"),
  Hash: W("Hash"),
  Refresh: W("RefreshCw"),
  Folder: W("Folder"),
  Back: W("ArrowLeft"),
  FolderPlus: W("FolderPlus"),
  Folders: W("FolderTree"),
  Trash: W("Trash2"),
  Terminal: W("Terminal")
}, he = "/api/apps/notes-search";
function Ge(t) {
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
function We(t) {
  const e = new URLSearchParams();
  for (const [n, i] of Object.entries(t)) i != null && i !== "" && e.set(n, String(i));
  return e.toString();
}
function X(t) {
  return `${t.collection}/${t.path}`;
}
function Mi(t) {
  return t.map((e, n) => ({ it: e, i: n, t: e.modified_at && Date.parse(e.modified_at) || 0 })).sort((e, n) => n.t - e.t || e.i - n.i).map((e) => e.it);
}
function $r(t, e, n, i = "relevance") {
  const [r, l] = D(null), [c, o] = D(!1), [p, u] = D(null), T = Ve(0);
  return Ee(() => {
    const v = e;
    if (!v.trim()) {
      T.current++, l(null), o(!1), u(null);
      return;
    }
    const y = ++T.current;
    o(!0);
    const _ = window.setTimeout(() => {
      t.get(`${he}/suggest?${We({ q: v, c: n, limit: 14, sort: i === "recent" ? "recent" : void 0 })}`).then((f) => {
        y === T.current && (l(i === "recent" ? { ...f, results: Mi(f.results) } : f), u(null));
      }).catch((f) => {
        y === T.current && u(Ge(f));
      }).finally(() => {
        y === T.current && o(!1);
      });
    }, 70);
    return () => window.clearTimeout(_);
  }, [t, e, n, i]), { result: r, loading: c, error: p };
}
function zr(t) {
  const [e, n] = D(null), [i, r] = D(null), [l, c] = D(null), o = Ve(0), p = oe(
    (T, v) => {
      const y = T.trim();
      if (!y) return;
      const _ = ++o.current;
      r(y), c(null), t.get(`${he}/deep?${We({ q: y, c: v, limit: 12 })}`).then((f) => _ === o.current && n(f)).catch((f) => _ === o.current && c(Ge(f))).finally(() => _ === o.current && r(null));
    },
    [t]
  ), u = oe(() => {
    o.current++, n(null), r(null), c(null);
  }, []);
  return { result: e, running: i, error: l, run: p, clear: u };
}
function Rn() {
  return _r();
}
const li = "Notes Search";
async function Lr(t, e) {
  try {
    const n = await t.get("/api/chat/folders");
    let r = (Array.isArray(n) ? n : n?.folders ?? []).find((l) => l.name === li);
    r || (r = await t.post("/api/chat/folders", { name: li })), r?.id && await t.patch(`/api/chat/slots/${encodeURIComponent(e)}/folder`, { folder_id: r.id });
  } catch {
  }
}
function Or() {
  const t = Math.random().toString(36).slice(2, 8);
  return `library-${Date.now().toString(36)}-${t}`;
}
function Fi(t, e, n) {
  return t.post("/api/chat", { message: n, slot: e, agent: "" }).then(() => {
  }).catch((i) => {
    if (!(i instanceof SyntaxError))
      throw i;
  });
}
async function Ir(t, e, n) {
  const i = await t.post(`${he}/seed`, {
    docs: e,
    question: n
  }), r = await t.post("/api/chat/slots", { name: Or(), agent: "" }), l = `📄 ${i.title}`;
  await t.patch(`/api/chat/slots/${encodeURIComponent(r.key)}/title`, { title: l }).catch(() => {
  });
  const c = await t.post(`${he}/sessions`, {
    slot_key: r.key,
    title: l,
    docs: i.docs
  });
  return Lr(t, r.key), Fi(t, r.key, i.message).catch(() => {
  }), c;
}
function Dr(t, e) {
  const n = e.trim() || "How does this relate to what we have been discussing?";
  return `Also read **${t.title}** · \`${t.abs_path}\` and bring it into this conversation.

${n}`;
}
function Qe(t, e = Date.now()) {
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
function yn(t) {
  if (!t) return "";
  const e = Date.parse(t);
  return Number.isNaN(e) ? "" : new Date(e).toLocaleString([], { weekday: "short", month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}
const Pr = /\[\[([^\]\n|#]+)(?:#[^\]\n|]*)?(?:\|([^\]\n]+))?\]\]/g;
function qi({ parts: t, onLink: e }) {
  let n = "";
  const i = [];
  for (const o of t)
    o.hit && i.push([n.length, n.length + o.text.length]), n += o.text;
  const r = (o, p, u) => {
    const T = [];
    let v = o;
    for (const [y, _] of i) {
      if (_ <= v || y >= p) continue;
      const f = Math.max(y, v), x = Math.min(_, p);
      f > v && T.push(/* @__PURE__ */ s("span", { children: n.slice(v, f) }, `${u}-${v}`)), T.push(/* @__PURE__ */ s("mark", { children: n.slice(f, x) }, `${u}-m${f}`)), v = x;
    }
    return v < p && T.push(/* @__PURE__ */ s("span", { children: n.slice(v, p) }, `${u}-${v}`)), T;
  }, l = [];
  let c = 0;
  for (const o of n.matchAll(Pr)) {
    const p = o.index ?? 0, u = p + o[0].length;
    p > c && l.push(...r(c, p, `t${c}`));
    const T = o[1].trim(), v = o[2] ? p + o[0].lastIndexOf("|") + 1 : p + 2, y = o[2] ? u - 2 : p + 2 + o[1].length, _ = i.some(([f, x]) => f < u && x > p);
    l.push(
      /* @__PURE__ */ s(
        "span",
        {
          className: "lib-snip-link",
          "data-hit": _,
          title: T,
          onClick: e ? (f) => {
            f.stopPropagation(), e(T);
          } : void 0,
          children: r(v, y, `l${p}`)
        },
        `l${p}`
      )
    ), c = u;
  }
  return c < n.length && l.push(...r(c, n.length, `t${c}`)), /* @__PURE__ */ s(Qt, { children: l });
}
function Mr(t) {
  return t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function Fr(t, e) {
  const n = e.filter((c) => c.length >= 2);
  if (!n.length) return t;
  const i = new RegExp(`(${n.map(Mr).join("|")})`, "ig"), r = [];
  let l = 0;
  return t.replace(i, (c, o, p) => (p > l && r.push(t.slice(l, p)), r.push(/* @__PURE__ */ s("mark", { children: c }, p)), l = p + c.length, c)), l < t.length && r.push(t.slice(l)), r;
}
function Ui(t, e) {
  const n = e.lastIndexOf("/");
  return n < 0 ? t : `${t} / ${e.slice(0, n).replace(/\//g, " / ")}`;
}
function qr(t) {
  return /(^|\/)\d{4}-\d{2}-\d{2}\.md$/.test(t);
}
function Ur() {
  return typeof navigator < "u" && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
}
const xt = Ur() ? "⌘" : "Ctrl";
function Bi(t) {
  return Nn(() => {
    const e = [];
    if (!t.query.trim())
      e.push({ id: "recent", label: "Recently edited", rows: t.recent.map((n) => ({ hit: n, words: [] })) });
    else {
      const n = /* @__PURE__ */ new Set();
      if (t.deep && t.deep.query === t.query.trim() && t.deep.results.length) {
        const r = (t.sort === "recent" ? Mi(t.deep.results) : t.deep.results).map((l) => ({ hit: l, words: t.deep.words }));
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
const Br = Tr(function(e, n) {
  const { sections: i, flat: r } = Bi(e), l = Ve(null);
  Ee(() => {
    l.current?.querySelector(`[data-row="${e.selected}"]`)?.scrollIntoView({ block: "nearest" });
  }, [e.selected]);
  function c(y) {
    if (!y.nativeEvent.isComposing)
      if (y.key === "ArrowDown")
        y.preventDefault(), e.onSelected(Math.min(r.length - 1, e.selected + 1), !0);
      else if (y.key === "ArrowUp")
        y.preventDefault(), e.onSelected(Math.max(0, e.selected - 1), !0);
      else if (y.key === "Enter" && (y.metaKey || y.ctrlKey))
        y.preventDefault(), e.onDeep();
      else if (y.key === "Enter" && y.shiftKey) {
        y.preventDefault();
        const _ = r[e.selected];
        _ && e.onTogglePick(_.hit);
      } else if (y.key === "Enter") {
        y.preventDefault();
        const _ = r[e.selected];
        _ && e.onOpen(_.hit, { pin: !0, words: _.words });
      } else y.key === "Escape" && e.query && (y.preventDefault(), e.onQuery(""));
  }
  const o = e.query.trim(), p = e.deepRunning === o, u = o.length > 0 && !(e.deep && e.deep.query === o), T = e.picks.size > 0;
  let v = -1;
  return /* @__PURE__ */ h("aside", { className: "lib-left", "aria-label": "Search", children: [
    /* @__PURE__ */ h("div", { className: "lib-brand", children: [
      /* @__PURE__ */ s("span", { className: "lib-logo", "aria-hidden": "true", children: /* @__PURE__ */ s($.Brand, { size: 17, strokeWidth: 2.5 }) }),
      /* @__PURE__ */ s("h1", { children: "Notes Search" }),
      e.indexInfo && /* @__PURE__ */ h("span", { className: "lib-meta lib-meta-sm", title: e.indexInfo.updated ? `Index file updated ${e.indexInfo.updated}` : void 0, children: [
        e.indexInfo.documents.toLocaleString(),
        " notes",
        /* @__PURE__ */ s("br", {}),
        e.indexInfo.updated ? `indexed ${Qe(e.indexInfo.updated)}` : ""
      ] })
    ] }),
    /* @__PURE__ */ s("div", { className: "lib-search", role: "search", children: /* @__PURE__ */ h("label", { className: "lib-search-box", children: [
      e.suggestLoading || p ? /* @__PURE__ */ s($.Loader, { size: 18, className: "lib-spin", "aria-hidden": "true" }) : /* @__PURE__ */ s($.Search, { size: 18, strokeWidth: 2.4, "aria-hidden": "true" }),
      /* @__PURE__ */ s("span", { className: "lib-sr", children: "Search your notes" }),
      /* @__PURE__ */ s(
        "input",
        {
          ref: n,
          value: e.query,
          onChange: (y) => {
            e.onQuery(y.target.value), e.onSelected(0);
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
      e.query ? /* @__PURE__ */ s("button", { type: "button", className: "lib-btn lib-btn-quiet lib-btn-icon", "aria-label": "Clear search", onClick: () => e.onQuery(""), children: /* @__PURE__ */ s($.X, { size: 15 }) }) : /* @__PURE__ */ s("span", { className: "lib-kbd", "aria-hidden": "true", children: "/" })
    ] }) }),
    e.collections.length > 1 && /* @__PURE__ */ h("div", { className: "lib-filters", role: "group", "aria-label": "Collection", children: [
      /* @__PURE__ */ s("button", { type: "button", className: "lib-chip", "aria-pressed": e.collection === null, onClick: () => e.onCollection(null), children: "All" }),
      e.collections.map((y) => /* @__PURE__ */ h(
        "button",
        {
          type: "button",
          className: "lib-chip",
          "aria-pressed": e.collection === y.name,
          onClick: () => e.onCollection(e.collection === y.name ? null : y.name),
          children: [
            y.name,
            " ",
            /* @__PURE__ */ s("span", { className: "lib-count", children: y.docs.toLocaleString() })
          ]
        },
        y.name
      ))
    ] }),
    o && /* @__PURE__ */ h("div", { className: "lib-sortbar", children: [
      /* @__PURE__ */ s("span", { className: "lib-meta-sm", children: "Sort" }),
      /* @__PURE__ */ s("div", { className: "lib-seg", role: "radiogroup", "aria-label": "Sort results", children: [
        ["relevance", "Best match"],
        ["recent", "Newest"]
      ].map(([y, _]) => /* @__PURE__ */ h(
        "button",
        {
          type: "button",
          role: "radio",
          "aria-checked": e.sort === y,
          className: "lib-seg-opt",
          onClick: () => {
            e.onSort(y), e.onSelected(0);
          },
          children: [
            y === "recent" && /* @__PURE__ */ s($.Clock, { size: 12, "aria-hidden": "true" }),
            _
          ]
        },
        y
      )) })
    ] }),
    /* @__PURE__ */ h("div", { className: "lib-results", id: "lib-results", role: "listbox", ref: l, "data-picking": T, children: [
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
      i.map((y) => /* @__PURE__ */ h("div", { children: [
        /* @__PURE__ */ h("div", { className: "lib-section", children: [
          y.id === "deep" && /* @__PURE__ */ s($.Sparkles, { size: 13, "aria-hidden": "true" }),
          y.id === "recent" && /* @__PURE__ */ s($.Clock, { size: 13, "aria-hidden": "true" }),
          y.label,
          y.meta && /* @__PURE__ */ s("span", { className: "lib-meta-sm", children: y.meta })
        ] }),
        y.rows.map((_) => {
          v += 1;
          const f = v, x = X(_.hit), A = e.picks.has(x), I = qr(_.hit.path) ? $.Calendar : $.File;
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
              "data-active": e.activeKey === x,
              children: [
                /* @__PURE__ */ s("span", { className: "lib-hit-icon", "aria-hidden": "true", children: /* @__PURE__ */ s(I, { size: 16, strokeWidth: 2.2 }) }),
                /* @__PURE__ */ s("span", { className: "lib-hit-title", children: /* @__PURE__ */ s("span", { children: Fr(_.hit.title, _.words) }) }),
                /* @__PURE__ */ h("span", { className: "lib-hit-path", children: [
                  Ui(_.hit.collection, _.hit.path),
                  _.hit.modified_at ? ` · ${Qe(_.hit.modified_at)}` : ""
                ] }),
                _.hit.snippet.length > 0 && /* @__PURE__ */ s("span", { className: "lib-hit-snippet", children: /* @__PURE__ */ s(qi, { parts: _.hit.snippet, onLink: e.onLink ? (L) => e.onLink(L, _.hit.collection) : void 0 }) }),
                /* @__PURE__ */ s(
                  "button",
                  {
                    type: "button",
                    className: "lib-check",
                    role: "checkbox",
                    "aria-checked": A,
                    "aria-label": A ? `Remove ${_.hit.title} from selection` : `Select ${_.hit.title} to chat about together`,
                    title: "Select for a chat across several notes (⇧Enter)",
                    onClick: (L) => {
                      L.stopPropagation(), e.onTogglePick(_.hit);
                    },
                    children: A && /* @__PURE__ */ s($.Check, { size: 13, strokeWidth: 3.2 })
                  }
                )
              ]
            },
            `${y.id}:${x}`
          );
        })
      ] }, y.id)),
      o && u && /* @__PURE__ */ h("button", { type: "button", className: "lib-deep-row", onClick: e.onDeep, "aria-busy": p, disabled: p, children: [
        p ? /* @__PURE__ */ s($.Loader, { size: 17, className: "lib-spin" }) : /* @__PURE__ */ s($.Sparkles, { size: 17 }),
        /* @__PURE__ */ s("span", { className: "lib-grow", children: p ? /* @__PURE__ */ h(Qt, { children: [
          /* @__PURE__ */ s("b", { children: "Searching by meaning…" }),
          /* @__PURE__ */ s("br", {}),
          /* @__PURE__ */ s("span", { className: "lib-meta-sm", children: "QMD is expanding and reranking. This takes a few seconds." })
        ] }) : /* @__PURE__ */ h(Qt, { children: [
          /* @__PURE__ */ s("b", { children: "Search by meaning" }),
          /* @__PURE__ */ s("br", {}),
          /* @__PURE__ */ s("span", { className: "lib-meta-sm", children: "Hybrid QMD search with query expansion and reranking" })
        ] }) }),
        !p && /* @__PURE__ */ h("span", { className: "lib-row", children: [
          /* @__PURE__ */ s("span", { className: "lib-kbd", children: xt }),
          /* @__PURE__ */ s("span", { className: "lib-kbd", children: "↵" })
        ] })
      ] }),
      e.deepError && o && /* @__PURE__ */ h("div", { className: "lib-alert", role: "alert", style: { marginTop: 8 }, children: [
        /* @__PURE__ */ s($.Alert, { size: 16 }),
        /* @__PURE__ */ s("span", { children: e.deepError })
      ] }),
      e.suggestError && /* @__PURE__ */ h("div", { className: "lib-alert", role: "alert", style: { marginTop: 8 }, children: [
        /* @__PURE__ */ s($.Alert, { size: 16 }),
        /* @__PURE__ */ s("span", { children: e.suggestError })
      ] }),
      o && e.suggest && !e.suggestLoading && r.length === 0 && !p && /* @__PURE__ */ h("div", { className: "lib-empty", children: [
        /* @__PURE__ */ s("h3", { children: "No keyword matches" }),
        /* @__PURE__ */ s("p", { children: "Try fewer words, or search by meaning to find notes that say it differently." })
      ] })
    ] }),
    T && /* @__PURE__ */ h("div", { className: "lib-tray", role: "status", children: [
      /* @__PURE__ */ h("span", { className: "lib-grow", children: [
        e.picks.size,
        " note",
        e.picks.size === 1 ? "" : "s",
        " selected"
      ] }),
      /* @__PURE__ */ s("button", { type: "button", className: "lib-btn lib-btn-quiet lib-btn-sm", onClick: e.onClearPicks, children: "Clear" }),
      /* @__PURE__ */ h("button", { type: "button", className: "lib-btn lib-btn-primary lib-btn-sm", onClick: e.onChatPicks, children: [
        /* @__PURE__ */ s($.ChatPlus, { size: 14 }),
        "Chat about ",
        e.picks.size === 1 ? "it" : "them"
      ] })
    ] })
  ] });
});
function Cn() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var at = Cn();
function Hi(t) {
  at = t;
}
var it = { exec: () => null };
function mt(t) {
  let e = [];
  return (n) => {
    let i = Math.max(0, Math.min(3, n - 1)), r = e[i];
    return r || (r = t(i), e[i] = r), r;
  };
}
function P(t, e = "") {
  let n = typeof t == "string" ? t : t.source, i = { replace: (r, l) => {
    let c = typeof l == "string" ? l : l.source;
    return c = c.replace(me.caret, "$1"), n = n.replace(r, c), i;
  }, getRegex: () => new RegExp(n, e) };
  return i;
}
var Hr = ((t = "") => {
  try {
    return !!new RegExp("(?<=1)(?<!1)" + t);
  } catch {
    return !1;
  }
})(), me = { codeRemoveIndent: /^(?: {0,3}\t| {1,4})/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, endingSpaceTabChar: /[ \t]$/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, leadingSpaceTab: /^[ \t]+/, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, numericCharacterReference: /&#(?:(\d{1,7})|[Xx]([A-Fa-f0-9]{1,6}));/g, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (t) => new RegExp(`^( {0,3}${t})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: mt((t) => new RegExp(`^ {0,${t}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`)), hrRegex: mt((t) => new RegExp(`^ {0,${t}}((?:-[ 	]*){3,}|(?:_[ 	]*){3,}|(?:\\*[ 	]*){3,})(?:\\n+|$)`)), fencesBeginRegex: mt((t) => new RegExp(`^ {0,${t}}(?:\`\`\`|~~~)`)), headingBeginRegex: mt((t) => new RegExp(`^ {0,${t}}#`)), htmlBeginRegex: mt((t) => new RegExp(`^ {0,${t}}(?:</?(?:${It})(?: +|$|/?>)|<(?:script|pre|style|textarea|!--))`, "i")), blockquoteBeginRegex: mt((t) => new RegExp(`^ {0,${t}}>`)) }, Wr = /^(?:[ \t]*(?:\n|$))+/, Gr = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, jr = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, Ot = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, Zr = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, $n = / {0,3}(?:[*+-]|\d{1,9}[.)])/, Wi = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |fences|blockquote|heading|hr|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, Gi = P(Wi).replace(/bull/g, $n).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\s|$)/).replace(/hr/g, / {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), Kr = P(Wi).replace(/bull/g, $n).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\s|$)/).replace(/hr/g, / {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), zn = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table|[ \t]+\n)[^\n]+)*)/, Yr = /^[^\n]+/, Ln = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, Xr = P(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Ln).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), Qr = P(/^(bull)([ \t][^\n]*?)?(?:\n|$)/).replace(/bull/g, $n).getRegex(), It = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", On = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, Vr = P("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n*|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>[^\\n]*\\n*|$)|<![A-Z][\\s\\S]*?(?:>[^\\n]*\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>[^\\n]*\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][a-z0-9-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][a-z0-9-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", On).replace("tag", It).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), ji = (t) => P(zn).replace("hr", Ot).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", t).replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", It).getRegex(), Jr = ji(/ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/), ea = ji(/ {0,3}(?:[*+-]|\d{1,9}[.)])(?:[ \t]|\n|$)/), ta = P(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", ea).getRegex(), In = { blockquote: ta, code: Gr, def: Xr, fences: jr, heading: Zr, hr: Ot, html: Vr, lheading: Gi, list: Qr, newline: Wr, paragraph: Jr, table: it, text: Yr }, oi = P("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", Ot).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", It).getRegex(), na = { ...In, lheading: Kr, table: oi, paragraph: P(zn).replace("hr", Ot).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", oi).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", It).getRegex() }, ia = { ...In, html: P(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", On).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: it, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: P(zn).replace("hr", Ot).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", Gi).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, ra = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, aa = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, Zi = /^( {2,}|\\)\n(?!\s*$)[ \t]*/, la = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, je = /[\p{P}\p{S}]/u, vt = /[\s\p{P}\p{S}]/u, Dt = /[^\s\p{P}\p{S}]/u, oa = P(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, vt).getRegex(), sa = /[\p{Pi}\p{Ps}"']/u, Ki = /(?!~)[\p{P}\p{S}]/u, ca = /(?!~)[\s\p{P}\p{S}]/u, da = /(?:[^\s\p{P}\p{S}]|~)/u, pa = P(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", Hr ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), Yi = /^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/, ua = P(Yi, "u").replace(/punct/g, je).getRegex(), ha = P(Yi, "u").replace(/punct/g, Ki).getRegex(), fa = /^(?:\*+(?:((?!\*)(?!openQuote)punct)|([^\s*]))?)|^_+(?:((?!_)(?!openQuote)punct)|([^\s_]))?/, ba = P(fa, "u").replace(/openQuote/g, sa).replace(/punct/g, je).getRegex(), Xi = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", ma = P(Xi, "gu").replace(/notPunctSpace/g, Dt).replace(/punctSpace/g, vt).replace(/punct/g, je).getRegex(), ga = P(Xi, "gu").replace(/notPunctSpace/g, da).replace(/punctSpace/g, ca).replace(/punct/g, Ki).getRegex(), xa = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)[\\s](\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|(?:(?!\\*)punct|notPunctSpace)(\\*+)(?!\\*)(?=notPunctSpace)", ka = P(xa, "gu").replace(/notPunctSpace/g, Dt).replace(/punctSpace/g, vt).replace(/punct/g, je).getRegex(), va = P("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, Dt).replace(/punctSpace/g, vt).replace(/punct/g, je).getRegex(), ya = "^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)[\\s](_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)|(?:(?!_)punct|notPunctSpace)(_+)(?!_)(?=notPunctSpace)", wa = P(ya, "gu").replace(/notPunctSpace/g, Dt).replace(/punctSpace/g, vt).replace(/punct/g, je).getRegex(), Ta = P(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, je).getRegex(), Sa = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", _a = P(Sa, "gu").replace(/notPunctSpace/g, Dt).replace(/punctSpace/g, vt).replace(/punct/g, je).getRegex(), Aa = P(/\\(punct)/, "gu").replace(/punct/g, je).getRegex(), Ea = P(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), Na = P(On).replace("(?:-->|$)", "-->").getRegex(), Ra = P("^comment|^</[a-zA-Z][a-zA-Z0-9-]*\\s*>|^<[a-zA-Z][a-zA-Z0-9-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", Na).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), Qi = /\[(?:\\[\s\S]|[^\[\]\\])*\]/, Vt = P(/(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/).replace("brackets", Qi).getRegex(), Ca = P(/^!?\[(label)\]\([ \t\n]*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?[ \t\n]*\)/).replace("label", Vt).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]+|(?=\))/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), $a = P(/^!?\[(label)\]\[(ref)\]/).replace("label", Vt).replace("ref", Ln).getRegex(), za = P(/^!?\[(ref)\](?:\[\])?/).replace("ref", Ln).getRegex(), si = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\]){1,999}/, La = P(/(?:[^\[\]\\`]*(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\]))){0,999}?[^\[\]\\`]*?/).replace("brackets", Qi).getRegex(), Oa = P("reflink|nolink(?!\\()", "g").replace("reflink", P(/^!?\[(label)\]\[(ref)\]/).replace("label", La).replace("ref", si).getRegex()).replace("nolink", P(/^!?\[(ref)\](?:\[\])?/).replace("ref", si).getRegex()).getRegex(), ci = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, Ia = /[A-Za-z0-9._+-]+@[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/, Da = P(/(?:mailto:email|xmpp:email(?:\/[A-Za-z0-9@.]+)?)/).replace(/email/g, Ia).getRegex(), Dn = { _backpedal: it, anyPunctuation: Aa, autolink: Ea, blockSkip: pa, br: Zi, code: aa, del: it, delLDelim: it, delRDelim: it, emStrongLDelim: ua, emStrongRDelimAst: ma, emStrongRDelimUnd: va, escape: ra, link: Ca, nolink: za, punctuation: oa, reflink: $a, reflinkSearch: Oa, tag: Ra, text: la, url: it }, Pa = { ...Dn, emStrongLDelim: ba, emStrongRDelimAst: ka, emStrongRDelimUnd: wa, link: P(/^!?\[(label)\]\((.*?)\)/).replace("label", Vt).getRegex(), reflink: P(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", Vt).getRegex() }, wn = { ...Dn, emStrongRDelimAst: ga, emStrongLDelim: ha, delLDelim: Ta, delRDelim: _a, url: P(/^emailProtocol|^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("emailProtocol", Da).replace("protocol", ci).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: P(/^(?:[^a-zA-Z0-9](?=emailProtocol)|(`+|~+|[^`~])(?:(?=[`~])|(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9](?=emailProtocol)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))))/).replace("protocol", ci).replace(/emailProtocol/g, /(?:mailto|xmpp):/).getRegex() }, Ma = { ...wn, br: P(Zi).replace("{2,}", "*").getRegex(), text: P(wn.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, Yt = { normal: In, gfm: na, pedantic: ia }, Et = { normal: Dn, gfm: wn, breaks: Ma, pedantic: Pa }, Fa = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, di = (t) => Fa[t];
function _e(t, e) {
  if (e) {
    if (me.escapeTest.test(t)) return t.replace(me.escapeReplace, di);
  } else if (me.escapeTestNoEncode.test(t)) return t.replace(me.escapeReplaceNoEncode, di);
  return t;
}
function qa(t) {
  return t.replace(me.numericCharacterReference, (e, n, i) => {
    let r = n === void 0 ? Number.parseInt(i, 16) : Number.parseInt(n, 10);
    return r === 0 || r > 1114111 || r >= 55296 && r <= 57343 ? "�" : String.fromCodePoint(r);
  });
}
function pi(t) {
  try {
    t = encodeURI(t).replace(me.percentDecode, "%");
  } catch {
    return null;
  }
  return t;
}
function ui(t, e) {
  let n = t.replace(me.findPipe, (l, c, o) => {
    let p = !1, u = c;
    for (; --u >= 0 && o[u] === "\\"; ) p = !p;
    return p ? "|" : " |";
  }), i = n.split(me.splitPipe), r = 0;
  if (i[0].trim() || i.shift(), i.length > 0 && !i.at(-1)?.trim() && i.pop(), e) if (i.length > e) i.splice(e);
  else for (; i.length < e; ) i.push("");
  for (; r < i.length; r++) i[r] = i[r].trim().replace(me.slashPipe, "|");
  return i;
}
function Ke(t, e, n) {
  let i = t.length;
  if (i === 0) return "";
  let r = 0;
  for (; r < i && t.charAt(i - r - 1) === e; )
    r++;
  return t.slice(0, i - r);
}
function hi(t) {
  let e = t.split(`
`), n = e.length - 1;
  for (; n >= 0 && me.blankLine.test(e[n]); ) n--;
  return e.length - n <= 2 ? t : e.slice(0, n + 1).join(`
`);
}
function Jt(t) {
  return t.trim().toLowerCase().toUpperCase().toLowerCase();
}
function fi(t, e) {
  if (t.indexOf(e[0]) === -1 && t.indexOf(e[1]) === -1) return -1;
  let n = 0;
  for (let i = 0; i < t.length; i++) if (t[i] === "\\") i++;
  else if (t[i] === e[0]) n++;
  else if (t[i] === e[1] && (n--, n < 0)) return i;
  return n > 0 ? -2 : -1;
}
function bi(t, e = 0) {
  let n = e, i = "";
  for (let r of t) if (r === "	") {
    let l = 4 - n % 4;
    i += " ".repeat(l), n += l;
  } else i += r, n++;
  return i;
}
function mi(t, e, n, i, r) {
  let l = e.href, c = e.title || null, o = t[1].replace(r.other.outputLinkReplace, "$1"), p = t[0].charAt(0) === "!";
  i.state.inLink = !0;
  let u = i.state.linkEmitted, T = i.state.inRawBlock;
  i.state.linkEmitted = !1;
  let v = i.inlineTokens(o), y = i.state.linkEmitted;
  if (i.state.linkEmitted = u, i.state.inLink = !1, !p) {
    if (y) {
      i.state.inRawBlock = T;
      return;
    }
    i.state.linkEmitted = !0;
  }
  return { type: p ? "image" : "link", raw: n, href: l, title: c, text: o, tokens: v };
}
function Ua(t, e, n) {
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
function gi(t, e, n, i) {
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
var en = class {
  options;
  rules;
  lexer;
  constructor(t) {
    this.options = t || at;
  }
  space(t) {
    let e = this.rules.block.newline.exec(t);
    if (e && e[0].length > 0) return { type: "space", raw: e[0] };
  }
  code(t) {
    let e = this.rules.block.code.exec(t);
    if (e) {
      let n = this.options.pedantic ? e[0] : hi(e[0]), i = n.replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: n, codeBlockStyle: "indented", text: i };
    }
  }
  fences(t) {
    let e = this.rules.block.fences.exec(t);
    if (e) {
      let n = e[0], i = Ua(n, e[3] || "", this.rules);
      return { type: "code", raw: n, lang: e[2] ? e[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : e[2], text: i };
    }
  }
  heading(t) {
    let e = this.rules.block.heading.exec(t);
    if (e) {
      let n = e[2].trim();
      if (this.rules.other.endingHash.test(n)) {
        let i = Ke(n, "#");
        (this.options.pedantic || !i || this.rules.other.endingSpaceTabChar.test(i)) && (n = i.trim());
      }
      return { type: "heading", raw: Ke(e[0], `
`), depth: e[1].length, text: n, tokens: this.lexer.inline(n) };
    }
  }
  hr(t) {
    let e = this.rules.block.hr.exec(t);
    if (e) return { type: "hr", raw: Ke(e[0], `
`) };
  }
  blockquote(t) {
    let e = this.rules.block.blockquote.exec(t);
    if (e) {
      let n = Ke(e[0], `
`).split(`
`), i = "", r = "", l = [];
      for (; n.length > 0; ) {
        let c = !1, o = [], p;
        for (p = 0; p < n.length; p++) if (this.rules.other.blockquoteStart.test(n[p])) o.push(n[p]), c = !0;
        else if (!c) o.push(n[p]);
        else break;
        n = n.slice(p);
        let u = o.join(`
`), T = u.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        i = i ? `${i}
${u}` : u, r = r ? `${r}
${T}` : T;
        let v = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(T, l, !0), this.lexer.state.top = v, n.length === 0) break;
        let y = l.at(-1);
        if (y?.type === "code") break;
        if (y?.type === "blockquote") {
          let _ = y, f = n.join(`
`), x = _.raw + `
` + f.replace(this.rules.other.blockquoteSetextReplace2, ""), A = this.blockquote(x);
          l[l.length - 1] = A;
          let I = x.substring(A.raw.length).replace(/^\n/, ""), L = I ? I.split(`
`).length : 0, z = L ? n.slice(0, -L) : n;
          z.length > 0 && (i = `${i}
${z.join(`
`)}`), r = r.substring(0, r.length - _.text.length) + A.text;
          break;
        } else if (y?.type === "list") {
          let _ = y, f = _.raw + `
` + n.join(`
`), x = this.list(f);
          l[l.length - 1] = x, i = i.substring(0, i.length - y.raw.length) + x.raw, r = r.substring(0, r.length - _.raw.length) + x.raw, n = f.substring(l.at(-1).raw.length).split(`
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
        let p = !1, u = "", T = "";
        if (!(e = l.exec(t)) || this.rules.block.hr.test(t)) break;
        u = e[0], t = t.substring(u.length);
        let v = e[2].split(`
`, 1)[0], y = e[1].length, _ = this.options.pedantic ? bi(v, y) : v.replace(this.rules.other.leadingSpaceTab, (I) => bi(I, y)), f = t.split(`
`, 1)[0], x = !_.trim(), A = 0;
        if (this.options.pedantic ? (A = 2, T = _.trimStart()) : x ? A = y + 1 : (A = _.search(this.rules.other.nonSpaceChar), A = A > 4 ? 1 : A, T = _.slice(A), A += y), x && this.rules.other.blankLine.test(f) && (u += f + `
`, t = t.substring(f.length + 1), p = !0), !p) {
          let I = this.rules.other.nextBulletRegex(A), L = this.rules.other.hrRegex(A), z = this.rules.other.fencesBeginRegex(A), K = this.rules.other.headingBeginRegex(A), q = this.rules.other.htmlBeginRegex(A), pe = this.rules.other.blockquoteBeginRegex(A);
          for (; t; ) {
            let ie = t.split(`
`, 1)[0], ue;
            if (f = ie, this.options.pedantic ? (f = f.replace(this.rules.other.listReplaceNesting, "  "), ue = f) : ue = f.replace(this.rules.other.leadingSpaceTab, (Q) => Q.replace(this.rules.other.tabCharGlobal, "    ")), z.test(f) || K.test(f) || q.test(f) || pe.test(f) || I.test(f) || L.test(f)) break;
            if (ue.search(this.rules.other.nonSpaceChar) >= A || !f.trim()) T += `
` + ue.slice(A);
            else {
              if (x || _.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || z.test(_) || K.test(_) || L.test(_)) break;
              T += `
` + f;
            }
            x = !f.trim(), u += ie + `
`, t = t.substring(ie.length + 1), _ = ue.slice(A);
          }
        }
        r.loose || (c ? r.loose = !0 : this.rules.other.doubleBlankLine.test(u) && (c = !0)), r.items.push({ type: "list_item", raw: u, task: !!this.options.gfm && this.rules.other.listIsTask.test(T), loose: !1, text: T, tokens: [] }), r.raw += u;
      }
      let o = r.items.at(-1);
      if (o) o.raw = o.raw.trimEnd(), o.text = o.text.trimEnd();
      else return;
      r.raw = r.raw.trimEnd();
      for (let p of r.items) if (this.lexer.state.top = !1, p.tokens = this.lexer.blockTokens(p.text, []), !r.loose) {
        let u = p.tokens.filter((v) => v.type === "space"), T = u.length > 0 && u.some((v) => this.rules.other.anyLine.test(v.raw));
        r.loose = T;
      }
      for (let p of r.items) {
        let u = p.tokens[0];
        if (p.task && (u?.type === "text" || u?.type === "paragraph")) {
          p.text = p.text.replace(this.rules.other.listReplaceTask, ""), u.raw = u.raw.replace(this.rules.other.listReplaceTask, ""), u.text = u.text.replace(this.rules.other.listReplaceTask, "");
          for (let v = this.lexer.inlineQueue.length - 1; v >= 0; v--) if (this.rules.other.listIsTask.test(this.lexer.inlineQueue[v].src)) {
            this.lexer.inlineQueue[v].src = this.lexer.inlineQueue[v].src.replace(this.rules.other.listReplaceTask, "");
            break;
          }
          let T = this.rules.other.listTaskCheckbox.exec(p.raw);
          if (T) {
            let v = { type: "checkbox", raw: T[0] + " ", checked: T[0] !== "[ ]" };
            p.checked = v.checked, r.loose ? p.tokens[0] && ["paragraph", "text"].includes(p.tokens[0].type) && "tokens" in p.tokens[0] && p.tokens[0].tokens ? (p.tokens[0].raw = v.raw + p.tokens[0].raw, p.tokens[0].text = v.raw + p.tokens[0].text, p.tokens[0].tokens.unshift(v)) : p.tokens.unshift({ type: "paragraph", raw: v.raw, text: v.raw, tokens: [v] }) : p.tokens.unshift(v);
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
      let n = hi(e[0]);
      return { type: "html", block: !0, raw: n, pre: e[1] === "pre" || e[1] === "script" || e[1] === "style", text: n };
    }
  }
  def(t) {
    let e = this.rules.block.def.exec(t);
    if (e) {
      if (!this.rules.other.startAngleBracket.test(e[2]) && fi(e[2], "()") !== -1) return;
      let n = Jt(e[1]).replace(this.rules.other.multipleSpaceGlobal, " "), i = e[2] ? e[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", r = e[3] ? e[3].substring(1, e[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : e[3];
      return { type: "def", tag: n, raw: Ke(e[0], `
`), href: i, title: r };
    }
  }
  table(t) {
    let e = this.rules.block.table.exec(t);
    if (!e || !this.rules.other.tableDelimiter.test(e[2])) return;
    let n = ui(e[1]), i = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), r = e[3]?.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], l = { type: "table", raw: Ke(e[0], `
`), header: [], align: [], rows: [] };
    if (n.length === i.length) {
      for (let c of i) this.rules.other.tableAlignRight.test(c) ? l.align.push("right") : this.rules.other.tableAlignCenter.test(c) ? l.align.push("center") : this.rules.other.tableAlignLeft.test(c) ? l.align.push("left") : l.align.push(null);
      for (let c = 0; c < n.length; c++) l.header.push({ text: n[c], tokens: this.lexer.inline(n[c]), header: !0, align: l.align[c] });
      for (let c of r) l.rows.push(ui(c, l.header.length).map((o, p) => ({ text: o, tokens: this.lexer.inline(o), header: !1, align: l.align[p] })));
      return l;
    }
  }
  lheading(t) {
    let e = this.rules.block.lheading.exec(t);
    if (e) {
      let n = e[1].trim();
      return { type: "heading", raw: Ke(e[0], `
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
      if (!this.options.pedantic && gi(t, e[1], n, this.rules)) return;
      let i = e[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(i)) {
        if (!this.rules.other.endAngleBracket.test(i)) return;
        let c = Ke(i.slice(0, -1), "\\");
        if ((i.length - c.length) % 2 === 0) return;
      } else {
        let c = fi(e[2], "()");
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
      return r = r.trim(), this.rules.other.startAngleBracket.test(r) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(i) ? r = r.slice(1) : r = r.slice(1, -1)), mi(e, { href: r && r.replace(this.rules.inline.anyPunctuation, "$1"), title: l && l.replace(this.rules.inline.anyPunctuation, "$1") }, e[0], this.lexer, this.rules);
    }
  }
  reflink(t, e) {
    let n;
    if ((n = this.rules.inline.reflink.exec(t)) || (n = this.rules.inline.nolink.exec(t))) {
      let i = n[0].charAt(0) === "!" ? 2 : 1;
      if (!this.options.pedantic && gi(t, n[1], i, this.rules)) return;
      let r = (n[2] || n[1]).replace(this.rules.other.multipleSpaceGlobal, " "), l = e[Jt(r)];
      if (!l) {
        let c = n[0].charAt(0);
        return { type: "text", raw: c, text: c };
      }
      return mi(n, l, n[0], this.lexer, this.rules);
    }
  }
  emStrong(t, e, n = "") {
    let i = this.rules.inline.emStrongLDelim.exec(t);
    if (!(!i || !i[1] && !i[2] && !i[3] && !i[4] || i[4] && n.match(this.rules.other.unicodeAlphaNumeric)) && (!(i[1] || i[3]) || !n || this.rules.inline.punctuation.exec(n))) {
      let r = [...i[0]].length - 1, l, c, o = r, p = 0, u = i[0][0], T = n === u, v = u === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (v.lastIndex = 0, e = e.slice(-1 * t.length + r); (i = v.exec(e)) !== null; ) {
        if (l = i[1] || i[2] || i[3] || i[4] || i[5] || i[6], !l) continue;
        if (c = [...l].length, i[3] || i[4]) {
          o += c;
          continue;
        } else if (i[5] || i[6]) {
          if (r % 3 && !((r + c) % 3)) {
            p += c;
            continue;
          }
          if (T) break;
        }
        if (o -= c, o > 0) continue;
        c = Math.min(c, c + o + p);
        let y = [...i[0]][0].length, _ = t.slice(0, r + i.index + y + c);
        if (Math.min(r, c) % 2) {
          let x = _.slice(1, -1);
          return { type: "em", raw: _, text: x, tokens: this.lexer.inlineTokens(x) };
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
        let u = [...i[0]][0].length, T = t.slice(0, r + i.index + u + c), v = T.slice(r, -r);
        return { type: "del", raw: T, text: v, tokens: this.lexer.inlineTokens(v) };
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
      return { type: "text", raw: e[0], text: n ? e[0] : qa(e[0]), escaped: n };
    }
  }
}, ze = class Tn {
  tokens;
  options;
  state;
  inlineQueue;
  tokenizer;
  constructor(e) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || at, this.options.tokenizer = this.options.tokenizer || new en(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, linkEmitted: !1, linkParenPossible: !0, top: !0 };
    let n = { other: me, block: Yt.normal, inline: Et.normal };
    this.options.pedantic ? (n.block = Yt.pedantic, n.inline = Et.pedantic) : this.options.gfm && (n.block = Yt.gfm, this.options.breaks ? n.inline = Et.breaks : n.inline = Et.gfm), this.tokenizer.rules = n;
  }
  static get rules() {
    return { block: Yt, inline: Et };
  }
  static lex(e, n) {
    return new Tn(n).lex(e);
  }
  static lexInline(e, n) {
    return new Tn(n).inlineTokens(e);
  }
  lex(e) {
    e = e.replace(me.carriageReturn, `
`), this.blockTokens(e, this.tokens);
    for (let n = 0; n < this.inlineQueue.length; n++) {
      let i = this.inlineQueue[n];
      this.inlineTokens(i.src, i.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, n = [], i = !1) {
    this.tokenizer.lexer = this, this.options.pedantic && (e = e.replace(me.tabCharGlobal, "    ").replace(me.spaceLine, ""));
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
        this.options.extensions.startBlock.forEach((T) => {
          u = T.call({ lexer: this }, p), typeof u == "number" && u >= 0 && (o = Math.min(o, u));
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
      if (!(r.charAt(0) === "!" || !Object.hasOwn(this.tokens.links, Jt(r.slice(l + 1, -1)))) && !(l > 1 && this.linkInText(r.slice(1, l - 1)))) return !0;
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
        let T = u.lastIndexOf("[");
        if (!Object.hasOwn(this.tokens.links, Jt(u.slice(T + 1, -1)))) return u;
        if (T > 1 && u.charAt(0) !== "!") {
          let v = u.slice(1, T - 1);
          if (this.linkInText(v)) return "[" + v.replace(o, p) + "][" + "a".repeat(u.length - T - 2) + "]";
        }
        return "[" + "a".repeat(u.length - 2) + "]";
      };
      i = i.replace(o, p);
    }
    i = i.replace(this.tokenizer.rules.inline.anyPunctuation, (o) => "+".repeat(o.length)), i = i.replace(this.tokenizer.rules.inline.blockSkip, (o, p, u) => {
      let T = u ? u.length : 0;
      return o.slice(0, T) + "[" + "a".repeat(o.length - T - 2) + "]";
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
        let u = 1 / 0, T = e.slice(1), v;
        this.options.extensions.startInline.forEach((y) => {
          v = y.call({ lexer: this }, T), typeof v == "number" && v >= 0 && (u = Math.min(u, v));
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
}, tn = class {
  options;
  parser;
  constructor(t) {
    this.options = t || at;
  }
  space(t) {
    return "";
  }
  code({ text: t, lang: e, escaped: n }) {
    let i = (e || "").match(me.notSpaceStart)?.[0], r = t ? t.replace(me.endingNewline, "") + `
` : "";
    return i ? '<pre><code class="language-' + _e(i) + '">' + (n ? r : _e(r, !0)) + `</code></pre>
` : "<pre><code>" + (n ? r : _e(r, !0)) + `</code></pre>
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
    return `<code>${_e(t, !0)}</code>`;
  }
  br(t) {
    return "<br>";
  }
  del({ tokens: t }) {
    return `<del>${this.parser.parseInline(t)}</del>`;
  }
  link({ href: t, title: e, text: n, tokens: i, autolink: r }) {
    let l = r ? _e(n, !0) : this.parser.parseInline(i), c = pi(t);
    if (c === null) return l;
    t = _e(c, r);
    let o = '<a href="' + t + '"';
    return e && (o += ' title="' + _e(e) + '"'), o += ">" + l + "</a>", o;
  }
  image({ href: t, title: e, text: n, tokens: i }) {
    i && (n = this.parser.parseInline(i, this.parser.textRenderer));
    let r = pi(t);
    if (r === null) return _e(n);
    t = r;
    let l = `<img src="${_e(t)}" alt="${_e(n)}"`;
    return e && (l += ` title="${_e(e)}"`), l += ">", l;
  }
  text(t) {
    return "tokens" in t && t.tokens ? this.parser.parseInline(t.tokens) : "escaped" in t && t.escaped ? t.text : _e(t.text);
  }
}, Pn = class {
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
}, Le = class Sn {
  options;
  renderer;
  textRenderer;
  constructor(e) {
    this.options = e || at, this.options.renderer = this.options.renderer || new tn(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new Pn();
  }
  static parse(e, n) {
    return new Sn(n).parse(e);
  }
  static parseInline(e, n) {
    return new Sn(n).parseInline(e);
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
}, zt = class {
  options;
  block;
  constructor(t) {
    this.options = t || at;
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
    return t ? ze.lex : ze.lexInline;
  }
  provideParser(t = this.block) {
    return t ? Le.parse : Le.parseInline;
  }
}, Vi = class {
  defaults = Cn();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = Le;
  Renderer = tn;
  TextRenderer = Pn;
  Lexer = ze;
  Tokenizer = en;
  Hooks = zt;
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
        let r = this.defaults.renderer || new tn(this.defaults);
        for (let l in n.renderer) {
          if (!(l in r)) throw new Error(`renderer '${l}' does not exist`);
          if (["options", "parser"].includes(l)) continue;
          let c = l, o = n.renderer[c], p = r[c];
          r[c] = (...u) => {
            let T = o.apply(r, u);
            return T === !1 && (T = p.apply(r, u)), T || "";
          };
        }
        i.renderer = r;
      }
      if (n.tokenizer) {
        let r = this.defaults.tokenizer || new en(this.defaults);
        for (let l in n.tokenizer) {
          if (!(l in r)) throw new Error(`tokenizer '${l}' does not exist`);
          if (["options", "rules", "lexer"].includes(l)) continue;
          let c = l, o = n.tokenizer[c], p = r[c];
          r[c] = (...u) => {
            let T = o.apply(r, u);
            return T === !1 && (T = p.apply(r, u)), T;
          };
        }
        i.tokenizer = r;
      }
      if (n.hooks) {
        let r = this.defaults.hooks || new zt();
        for (let l in n.hooks) {
          if (!(l in r)) throw new Error(`hook '${l}' does not exist`);
          if (["options", "block"].includes(l)) continue;
          let c = l, o = n.hooks[c], p = r[c];
          zt.passThroughHooks.has(l) ? r[c] = (u) => {
            if (this.defaults.async && zt.passThroughHooksRespectAsync.has(l)) return (async () => {
              let v = await o.call(r, u);
              return p.call(r, v);
            })();
            let T = o.call(r, u);
            return p.call(r, T);
          } : r[c] = (...u) => {
            if (this.defaults.async) return (async () => {
              let v = await o.apply(r, u);
              return v === !1 && (v = await p.apply(r, u)), v;
            })();
            let T = o.apply(r, u);
            return T === !1 && (T = p.apply(r, u)), T;
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
    return ze.lex(t, e ?? this.defaults);
  }
  parser(t, e) {
    return Le.parse(t, e ?? this.defaults);
  }
  parseMarkdown(t) {
    return (e, n) => {
      let i = { ...n }, r = { ...this.defaults, ...i }, l = this.onError(!!r.silent, !!r.async);
      if (this.defaults.async === !0 && i.async === !1) return l(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof e > "u" || e === null) return l(new Error("marked(): input parameter is undefined or null"));
      if (typeof e != "string") return l(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(e) + ", string expected"));
      if (r.hooks && (r.hooks.options = r, r.hooks.block = t), r.async) return (async () => {
        let c = r.hooks ? await r.hooks.preprocess(e) : e, o = await (r.hooks ? await r.hooks.provideLexer(t) : t ? ze.lex : ze.lexInline)(c, r), p = r.hooks ? await r.hooks.processAllTokens(o) : o;
        r.walkTokens && await Promise.all(this.walkTokens(p, r.walkTokens));
        let u = await (r.hooks ? await r.hooks.provideParser(t) : t ? Le.parse : Le.parseInline)(p, r);
        return r.hooks ? await r.hooks.postprocess(u) : u;
      })().catch(l);
      try {
        r.hooks && (e = r.hooks.preprocess(e));
        let c = (r.hooks ? r.hooks.provideLexer(t) : t ? ze.lex : ze.lexInline)(e, r);
        r.hooks && (c = r.hooks.processAllTokens(c)), r.walkTokens && this.walkTokens(c, r.walkTokens);
        let o = (r.hooks ? r.hooks.provideParser(t) : t ? Le.parse : Le.parseInline)(c, r);
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
        let i = "<p>An error occurred:</p><pre>" + _e(n.message + "", !0) + "</pre>";
        return e ? Promise.resolve(i) : i;
      }
      if (e) return Promise.reject(n);
      throw n;
    };
  }
}, rt = new Vi();
function ee(t, e) {
  return rt.parse(t, e);
}
ee.options = ee.setOptions = function(t) {
  return rt.setOptions(t), ee.defaults = rt.defaults, Hi(ee.defaults), ee;
};
ee.getDefaults = Cn;
ee.defaults = at;
function Ba(...t) {
  return rt.use(...t), ee.defaults = rt.defaults, Hi(ee.defaults), ee;
}
ee.use = Ba;
ee.walkTokens = function(t, e) {
  return rt.walkTokens(t, e);
};
ee.parseInline = rt.parseInline;
ee.Parser = Le;
ee.parser = Le.parse;
ee.Renderer = tn;
ee.TextRenderer = Pn;
ee.Lexer = ze;
ee.lexer = ze.lex;
ee.Tokenizer = en;
ee.Hooks = zt;
ee.parse = ee;
ee.options;
ee.setOptions;
ee.walkTokens;
ee.parseInline;
Le.parse;
ze.lex;
/*! @license DOMPurify 3.4.16 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.4.16/LICENSE */
function xi(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var n = 0, i = Array(e); n < e; n++) i[n] = t[n];
  return i;
}
function Ha(t) {
  if (Array.isArray(t)) return t;
}
function Wa(t, e) {
  var n = t == null ? null : typeof Symbol < "u" && t[Symbol.iterator] || t["@@iterator"];
  if (n != null) {
    var i, r, l, c, o = [], p = !0, u = !1;
    try {
      if (l = (n = n.call(t)).next, e !== 0) for (; !(p = (i = l.call(n)).done) && (o.push(i.value), o.length !== e); p = !0) ;
    } catch (T) {
      u = !0, r = T;
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
function Ga() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */
function ja(t, e) {
  return Ha(t) || Wa(t, e) || Za(t, e) || Ga();
}
function Za(t, e) {
  if (t) {
    if (typeof t == "string") return xi(t, e);
    var n = {}.toString.call(t).slice(8, -1);
    return n === "Object" && t.constructor && (n = t.constructor.name), n === "Map" || n === "Set" ? Array.from(t) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? xi(t, e) : void 0;
  }
}
const Ji = Object.entries, ki = Object.setPrototypeOf, Ka = Object.isFrozen, Ya = Object.getPrototypeOf, Xa = Object.getOwnPropertyDescriptor;
let de = Object.freeze, fe = Object.seal, gt = Object.create, er = typeof Reflect < "u" && Reflect, _n = er.apply, An = er.construct;
de || (de = function(e) {
  return e;
});
fe || (fe = function(e) {
  return e;
});
_n || (_n = function(e, n) {
  for (var i = arguments.length, r = new Array(i > 2 ? i - 2 : 0), l = 2; l < i; l++) r[l - 2] = arguments[l];
  return e.apply(n, r);
});
An || (An = function(e) {
  for (var n = arguments.length, i = new Array(n > 1 ? n - 1 : 0), r = 1; r < n; r++) i[r - 1] = arguments[r];
  return new e(...i);
});
const nt = se(Array.prototype.forEach), Qa = se(Array.prototype.lastIndexOf), vi = se(Array.prototype.pop), Nt = se(Array.prototype.push), Va = se(Array.prototype.splice), kt = Array.isArray, Lt = se(String.prototype.toLowerCase), bn = se(String.prototype.toString), yi = se(String.prototype.match), Rt = se(String.prototype.replace), wi = se(String.prototype.indexOf), Ja = se(String.prototype.trim), el = se(Number.prototype.toString), tl = se(Boolean.prototype.toString), Ti = typeof BigInt > "u" ? null : se(BigInt.prototype.toString), Si = typeof Symbol > "u" ? null : se(Symbol.prototype.toString), we = se(Object.prototype.hasOwnProperty), Ct = se(Object.prototype.toString), xe = se(RegExp.prototype.test), Ye = nl(TypeError);
function se(t) {
  return function(e) {
    e instanceof RegExp && (e.lastIndex = 0);
    for (var n = arguments.length, i = new Array(n > 1 ? n - 1 : 0), r = 1; r < n; r++) i[r - 1] = arguments[r];
    return _n(t, e, i);
  };
}
function nl(t) {
  return function() {
    for (var e = arguments.length, n = new Array(e), i = 0; i < e; i++) n[i] = arguments[i];
    return An(t, n);
  };
}
function G(t, e) {
  let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : Lt;
  if (ki && ki(t, null), !kt(e)) return t;
  let i = e.length;
  for (; i--; ) {
    let r = e[i];
    if (typeof r == "string") {
      const l = n(r);
      l !== r && (Ka(e) || (e[i] = l), r = l);
    }
    t[r] = !0;
  }
  return t;
}
function il(t) {
  for (let e = 0; e < t.length; e++) we(t, e) || (t[e] = null);
  return t;
}
function Ae(t) {
  const e = gt(null);
  for (const i of Ji(t)) {
    var n = ja(i, 2);
    const r = n[0], l = n[1];
    we(t, r) && (kt(l) ? e[r] = il(l) : l && typeof l == "object" && l.constructor === Object ? e[r] = Ae(l) : e[r] = l);
  }
  return e;
}
function rl(t) {
  switch (typeof t) {
    case "string":
      return t;
    case "number":
      return el(t);
    case "boolean":
      return tl(t);
    case "bigint":
      return Ti ? Ti(t) : "0";
    case "symbol":
      return Si ? Si(t) : "Symbol()";
    case "undefined":
      return Ct(t);
    case "function":
    case "object": {
      if (t === null) return Ct(t);
      const e = t, n = Ce(e, "toString");
      if (typeof n == "function") {
        const i = n(e);
        return typeof i == "string" ? i : Ct(i);
      }
      return Ct(t);
    }
    default:
      return Ct(t);
  }
}
function Ce(t, e) {
  for (; t !== null; ) {
    const i = Xa(t, e);
    if (i) {
      if (i.get) return se(i.get);
      if (typeof i.value == "function") return se(i.value);
    }
    t = Ya(t);
  }
  function n() {
    return null;
  }
  return n;
}
function al(t) {
  try {
    return xe(t, ""), !0;
  } catch {
    return !1;
  }
}
const _i = de([
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
]), mn = de([
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
]), gn = de([
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
]), ll = de([
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
]), xn = de([
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
]), ol = de([
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
]), Ai = de(["#text"]), Ei = de([
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
]), kn = de([
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
]), Ni = de([
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
]), Xt = de([
  "xlink:href",
  "xml:id",
  "xlink:title",
  "xml:space",
  "xmlns:xlink"
]), sl = fe(/{{[\w\W]*|^[\w\W]*}}/g), cl = fe(/<%[\w\W]*|^[\w\W]*%>/g), dl = fe(/\${[\w\W]*/g), pl = fe(/^data-[\-\w.\u00B7-\uFFFF]+$/), ul = fe(/^aria-[\-\w]+$/), Ri = fe(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i), hl = fe(/^(?:\w+script|data):/i), fl = fe(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g), bl = fe(/^html$/i), ml = fe(/^[a-z][.\w]*(-[.\w]+)+$/i), Ci = fe(/<[/\w!]/g), $i = fe(/<[/\w]/g), gl = fe(/<\/no(script|embed|frames)/i), xl = fe(/\/>/i), Se = {
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
}, tr = [
  "style",
  "script",
  "xmp",
  "iframe",
  "noembed",
  "noframes",
  "plaintext",
  "noscript"
], kl = de(G({}, tr)), vl = (function() {
  const t = {};
  return nt(tr, (e) => {
    t[e] = fe(new RegExp("</" + e + "(?=[\\t\\n\\f\\r />])", "i"));
  }), de(t);
})(), yl = function() {
  return typeof window > "u" ? null : window;
}, wl = function(e, n) {
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
}, zi = function() {
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
}, Xe = function(e, n, i, r) {
  return we(e, n) && kt(e[n]) ? G(r.base ? Ae(r.base) : {}, e[n], r.transform) : i;
}, vn = function(e, n, i) {
  const r = we(e, n) ? e[n] : void 0;
  return r && typeof r == "object" ? Ae(r) : i();
};
function nr() {
  let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : yl();
  const e = (w) => nr(w);
  if (e.version = "3.4.16", e.removed = [], !t || !t.document || t.document.nodeType !== Se.document || !t.Element)
    return e.isSupported = !1, e;
  let n = t.document;
  const i = n, r = i.currentScript;
  t.DocumentFragment;
  const l = t.HTMLTemplateElement, c = t.Node, o = t.Element, p = t.NodeFilter;
  t.NamedNodeMap === void 0 && (t.NamedNodeMap || t.MozNamedAttrMap), t.HTMLFormElement;
  const u = t.DOMParser, T = t.trustedTypes, v = o.prototype, y = Ce(v, "cloneNode"), _ = Ce(v, "remove"), f = Ce(v, "removeAttributeNode"), x = Ce(v, "nextSibling"), A = Ce(v, "childNodes"), I = Ce(v, "parentNode"), L = Ce(v, "shadowRoot"), z = Ce(v, "attributes"), K = c && c.prototype ? Ce(c.prototype, "nodeType") : null, q = c && c.prototype ? Ce(c.prototype, "nodeName") : null, pe = c && c.prototype ? Ce(c.prototype, "ownerDocument") : null, ie = function(a) {
    return K ? K(a) : a.nodeType;
  }, ue = function(a) {
    return q ? q(a) : a.nodeName;
  };
  if (typeof l == "function") {
    const w = n.createElement("template");
    w.content && w.content.ownerDocument && (n = w.content.ownerDocument);
  }
  let Q, k = "", N, Y = !1, M = 0;
  const F = function() {
    if (M > 0) throw Ye('A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.');
  }, B = function(a) {
    F(), M++;
    try {
      return Q.createHTML(a);
    } finally {
      M--;
    }
  }, b = function(a) {
    F(), M++;
    try {
      return Q.createScriptURL(a);
    } finally {
      M--;
    }
  }, O = function() {
    return Y || (N = wl(T, r), Y = !0), N;
  }, re = n, te = re.implementation, ce = re.createNodeIterator, $e = re.createDocumentFragment, Oe = re.getElementsByTagName, Pt = i.importNode;
  let j = zi();
  e.isSupported = typeof Ji == "function" && typeof I == "function" && te && te.createHTMLDocument !== void 0;
  const Ie = sl, Mt = cl, yt = dl, nn = pl, rn = ul, lt = hl, wt = fl, De = ml;
  let Ft = Ri, V = null;
  const ot = G({}, [
    ..._i,
    ...mn,
    ...gn,
    ...xn,
    ...Ai
  ]);
  let ne = null;
  const Tt = G({}, [
    ...Ei,
    ...kn,
    ...Ni,
    ...Xt
  ]);
  let ve = Object.seal(gt(null, {
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
  })), Je = null, Ne = null;
  const Pe = Object.seal(gt(null, {
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
  let st = !0, St = !0, qt = !1, Me = !0, Fe = !1, He = !0, m = !1, E = !1, R = null, Z = null, J = !1, ge = !1, qe = !1, et = !1, ye = !0, Mn = !1;
  const Fn = "user-content-";
  let an = !0, ln = !1, ct = {}, dt = null;
  const qn = G({}, [
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
  let Un = null;
  const Bn = G({}, [
    "audio",
    "video",
    "img",
    "source",
    "image",
    "track"
  ]);
  let Hn = null;
  const Wn = G({}, [
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
  ]), Ut = "http://www.w3.org/1998/Math/MathML", Bt = "http://www.w3.org/2000/svg", Ue = "http://www.w3.org/1999/xhtml";
  let pt = Ue, on = !1, sn = null;
  const or = G({}, [
    Ut,
    Bt,
    Ue
  ], bn), Gn = de([
    "mi",
    "mo",
    "mn",
    "ms",
    "mtext"
  ]);
  let cn = G({}, Gn);
  const jn = de(["annotation-xml"]);
  let dn = G({}, jn);
  const sr = G({}, [
    "title",
    "style",
    "font",
    "a",
    "script"
  ]);
  let _t = null;
  const cr = ["application/xhtml+xml", "text/html"], dr = "text/html";
  let le = null, ut = null;
  const pr = n.createElement("form"), Zn = function(a) {
    return a instanceof RegExp || a instanceof Function;
  }, pn = function() {
    let a = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (ut && ut === a) return;
    (!a || typeof a != "object") && (a = {}), a = Ae(a), _t = cr.indexOf(a.PARSER_MEDIA_TYPE) === -1 ? dr : a.PARSER_MEDIA_TYPE, le = _t === "application/xhtml+xml" ? bn : Lt, V = Xe(a, "ALLOWED_TAGS", ot, { transform: le }), ne = Xe(a, "ALLOWED_ATTR", Tt, { transform: le }), sn = Xe(a, "ALLOWED_NAMESPACES", or, { transform: bn }), Hn = Xe(a, "ADD_URI_SAFE_ATTR", Wn, {
      transform: le,
      base: Wn
    }), Un = Xe(a, "ADD_DATA_URI_TAGS", Bn, {
      transform: le,
      base: Bn
    }), dt = Xe(a, "FORBID_CONTENTS", qn, { transform: le }), Je = Xe(a, "FORBID_TAGS", Ae({}), { transform: le }), Ne = Xe(a, "FORBID_ATTR", Ae({}), { transform: le }), ct = we(a, "USE_PROFILES") ? a.USE_PROFILES && typeof a.USE_PROFILES == "object" ? Ae(a.USE_PROFILES) : a.USE_PROFILES : !1, st = a.ALLOW_ARIA_ATTR !== !1, St = a.ALLOW_DATA_ATTR !== !1, qt = a.ALLOW_UNKNOWN_PROTOCOLS || !1, Me = a.ALLOW_SELF_CLOSE_IN_ATTR !== !1, Fe = a.SAFE_FOR_TEMPLATES || !1, He = a.SAFE_FOR_XML !== !1, m = a.WHOLE_DOCUMENT || !1, ge = a.RETURN_DOM || !1, qe = a.RETURN_DOM_FRAGMENT || !1, et = a.RETURN_TRUSTED_TYPE || !1, J = a.FORCE_BODY || !1, ye = a.SANITIZE_DOM !== !1, Mn = a.SANITIZE_NAMED_PROPS || !1, an = a.KEEP_CONTENT !== !1, ln = a.IN_PLACE || !1, Ft = al(a.ALLOWED_URI_REGEXP) ? a.ALLOWED_URI_REGEXP : Ri, pt = typeof a.NAMESPACE == "string" ? a.NAMESPACE : Ue, cn = vn(a, "MATHML_TEXT_INTEGRATION_POINTS", () => G({}, Gn)), dn = vn(a, "HTML_INTEGRATION_POINTS", () => G({}, jn));
    const d = vn(a, "CUSTOM_ELEMENT_HANDLING", () => gt(null));
    if (ve = gt(null), we(d, "tagNameCheck") && Zn(d.tagNameCheck) && (ve.tagNameCheck = d.tagNameCheck), we(d, "attributeNameCheck") && Zn(d.attributeNameCheck) && (ve.attributeNameCheck = d.attributeNameCheck), we(d, "allowCustomizedBuiltInElements") && typeof d.allowCustomizedBuiltInElements == "boolean" && (ve.allowCustomizedBuiltInElements = d.allowCustomizedBuiltInElements), fe(ve), Fe && (St = !1), qe && (ge = !0), ct && (V = G({}, Ai), ne = gt(null), ct.html === !0 && (G(V, _i), G(ne, Ei)), ct.svg === !0 && (G(V, mn), G(ne, kn), G(ne, Xt)), ct.svgFilters === !0 && (G(V, gn), G(ne, kn), G(ne, Xt)), ct.mathMl === !0 && (G(V, xn), G(ne, Ni), G(ne, Xt))), Pe.tagCheck = null, Pe.attributeCheck = null, we(a, "ADD_TAGS") && (typeof a.ADD_TAGS == "function" ? Pe.tagCheck = a.ADD_TAGS : kt(a.ADD_TAGS) && (V === ot && (V = Ae(V)), G(V, a.ADD_TAGS, le))), we(a, "ADD_ATTR") && (typeof a.ADD_ATTR == "function" ? Pe.attributeCheck = a.ADD_ATTR : kt(a.ADD_ATTR) && (ne === Tt && (ne = Ae(ne)), G(ne, a.ADD_ATTR, le))), we(a, "ADD_FORBID_CONTENTS") && kt(a.ADD_FORBID_CONTENTS) && (dt === qn && (dt = Ae(dt)), G(dt, a.ADD_FORBID_CONTENTS, le)), an && (V["#text"] = !0), m && G(V, [
      "html",
      "head",
      "body"
    ]), V.table && (G(V, ["tbody"]), delete Je.tbody), a.TRUSTED_TYPES_POLICY) {
      if (typeof a.TRUSTED_TYPES_POLICY.createHTML != "function") throw Ye('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
      if (typeof a.TRUSTED_TYPES_POLICY.createScriptURL != "function") throw Ye('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
      const g = Q;
      Q = a.TRUSTED_TYPES_POLICY;
      try {
        k = B("");
      } catch (S) {
        throw Q = g, S;
      }
    } else a.TRUSTED_TYPES_POLICY === null ? (Q = void 0, k = "") : (Q === void 0 && (Q = O()), Q && typeof k == "string" && (k = B("")));
    de && de(a), ut = a;
  }, Kn = G({}, [
    ...mn,
    ...gn,
    ...ll
  ]), Yn = G({}, [...xn, ...ol]), ur = function(a, d, g) {
    return d.namespaceURI === Ue ? a === "svg" : d.namespaceURI === Ut ? a === "svg" && (g === "annotation-xml" || cn[g]) : !!Kn[a];
  }, hr = function(a, d, g) {
    return d.namespaceURI === Ue ? a === "math" : d.namespaceURI === Bt ? a === "math" && dn[g] : !!Yn[a];
  }, fr = function(a, d, g) {
    return d.namespaceURI === Bt && !dn[g] || d.namespaceURI === Ut && !cn[g] ? !1 : !Yn[a] && (sr[a] || !Kn[a]);
  }, br = function(a) {
    let d = I(a);
    (!d || !d.tagName) && (d = {
      namespaceURI: pt,
      tagName: "template"
    });
    const g = Lt(a.tagName), S = Lt(d.tagName);
    return sn[a.namespaceURI] ? a.namespaceURI === Bt ? ur(g, d, S) : a.namespaceURI === Ut ? hr(g, d, S) : a.namespaceURI === Ue ? fr(g, d, S) : !!(_t === "application/xhtml+xml" && sn[a.namespaceURI]) : !1;
  }, Ze = function(a) {
    Nt(e.removed, { element: a });
    try {
      I(a).removeChild(a);
    } catch {
      if (_(a), !I(a)) throw Ye("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place");
    }
  }, Xn = function(a, d, g) {
    try {
      f(a, d);
    } catch {
      try {
        a.removeAttribute(g);
      } catch {
      }
    }
  }, Ht = function(a) {
    Wt(a);
    const d = A(a);
    if (d) {
      const S = [];
      nt(d, (C) => {
        Nt(S, C);
      }), nt(S, (C) => {
        try {
          _(C);
        } catch {
        }
      });
    }
    const g = z(a);
    if (g) for (let S = g.length - 1; S >= 0; --S) {
      const C = g[S], U = C && C.name;
      typeof U == "string" && Xn(a, C, U);
    }
  }, tt = function(a, d, g) {
    if (!g) try {
      g = d.getAttributeNode(a);
    } catch {
      g = null;
    }
    Nt(e.removed, {
      attribute: g || null,
      from: d
    });
    try {
      g ? f(d, g) : d.removeAttribute(a);
    } catch {
      try {
        d.removeAttribute(a);
      } catch {
      }
    }
    if (a === "is")
      if (ge || qe) try {
        Ze(d);
      } catch {
      }
      else try {
        d.setAttribute(a, "");
      } catch {
      }
  }, mr = function(a) {
    const d = z(a);
    if (d)
      for (let g = d.length - 1; g >= 0; --g) {
        const S = d[g], C = S && S.name;
        typeof C != "string" || ne[le(C)] || Xn(a, S, C);
      }
  }, Wt = function(a) {
    const d = [a];
    for (; d.length > 0; ) {
      const g = d.pop();
      ie(g) === Se.element && mr(g);
      const S = A(g);
      if (S) for (let C = S.length - 1; C >= 0; --C) d.push(S[C]);
    }
  }, Qn = function(a, d) {
    return He ? a === "patchsrc" ? !0 : a === "for" && d !== "label" && d !== "output" : !1;
  }, gr = function(a) {
    if (!He) return;
    const d = [a];
    for (; d.length > 0; ) {
      const g = d.pop(), S = ie(g);
      if (S === Se.processingInstruction || S === Se.comment && xe($i, g.data)) {
        try {
          _(g);
        } catch {
        }
        continue;
      }
      if (S === Se.element) {
        const U = g, H = le(ue(g));
        try {
          U.hasAttribute && U.hasAttribute("patchsrc") && U.removeAttribute("patchsrc"), U.hasAttribute && U.hasAttribute("for") && Qn("for", H) && U.removeAttribute("for");
        } catch {
        }
      }
      const C = A(g);
      if (C) for (let U = C.length - 1; U >= 0; --U) d.push(C[U]);
    }
  }, Vn = function(a) {
    let d = null, g = null;
    if (J) a = "<remove></remove>" + a;
    else {
      const U = yi(a, /^[\r\n\t ]+/);
      g = U && U[0];
    }
    _t === "application/xhtml+xml" && pt === Ue && (a = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + a + "</body></html>");
    const S = Q ? B(a) : a;
    if (pt === Ue) try {
      d = new u().parseFromString(S, _t);
    } catch {
    }
    if (!d || !d.documentElement) {
      d = te.createDocument(pt, "template", null);
      try {
        d.documentElement.innerHTML = on ? k : S;
      } catch {
      }
    }
    const C = d.body || d.documentElement;
    return a && g && C.insertBefore(n.createTextNode(g), C.childNodes[0] || null), pt === Ue ? Oe.call(d, m ? "html" : "body")[0] : m ? d.documentElement : C;
  }, Jn = function(a) {
    const d = pe ? pe(a) : a.ownerDocument;
    return ce.call(d || a, a, p.SHOW_ELEMENT | p.SHOW_COMMENT | p.SHOW_TEXT | p.SHOW_PROCESSING_INSTRUCTION | p.SHOW_CDATA_SECTION, null);
  }, Gt = function(a) {
    return a = Rt(a, Ie, " "), a = Rt(a, Mt, " "), a = Rt(a, yt, " "), a;
  }, un = function(a) {
    var d;
    a.normalize();
    const g = pe ? pe(a) : a.ownerDocument, S = ce.call(g || a, a, p.SHOW_TEXT | p.SHOW_COMMENT | p.SHOW_CDATA_SECTION | p.SHOW_PROCESSING_INSTRUCTION, null);
    let C = S.nextNode();
    for (; C; )
      C.data = Gt(C.data), C = S.nextNode();
    const U = (d = a.querySelectorAll) === null || d === void 0 ? void 0 : d.call(a, "template");
    U && nt(U, (H) => {
      ht(H.content) && un(H.content);
    });
  }, jt = function(a) {
    const d = q ? q(a) : null;
    return typeof d != "string" || le(d) !== "form" ? !1 : typeof a.nodeName != "string" || typeof a.textContent != "string" || typeof a.removeChild != "function" || a.attributes !== z(a) || typeof a.removeAttribute != "function" || typeof a.removeAttributeNode != "function" || typeof a.getAttributeNode != "function" || typeof a.setAttribute != "function" || typeof a.namespaceURI != "string" || typeof a.insertBefore != "function" || typeof a.hasChildNodes != "function" || a.nodeType !== K(a) || a.childNodes !== A(a);
  }, ht = function(a) {
    if (!K || typeof a != "object" || a === null) return !1;
    try {
      return K(a) === Se.documentFragment;
    } catch {
      return !1;
    }
  }, At = function(a) {
    if (!K || typeof a != "object" || a === null) return !1;
    try {
      return typeof K(a) == "number";
    } catch {
      return !1;
    }
  };
  function Be(w, a, d) {
    w.length !== 0 && nt(w, (g) => {
      g.call(e, a, d, ut);
    });
  }
  const xr = function(a, d) {
    return !!(He && a.hasChildNodes() && !At(a.firstElementChild) && xe(Ci, a.textContent) && xe(Ci, a.innerHTML) || He && a.namespaceURI === Ue && kl[d] && (At(a.firstElementChild) || typeof a.textContent == "string" && xe(vl[d], a.textContent)) || a.nodeType === Se.processingInstruction || He && a.nodeType === Se.comment && xe($i, a.data));
  }, Zt = function(a, d) {
    if (a instanceof RegExp) return xe(a, d);
    if (a instanceof Function) {
      for (var g = arguments.length, S = new Array(g > 2 ? g - 2 : 0), C = 2; C < g; C++) S[C - 2] = arguments[C];
      return !!a(d, ...S);
    }
    return !1;
  }, kr = function(a, d, g) {
    if (!Je[d] && ii(d) && Zt(ve.tagNameCheck, d)) return !1;
    if (an && !dt[d]) {
      const S = I(a), C = A(a);
      if (C && S) {
        const U = C.length;
        for (let H = U - 1; H >= 0; --H) {
          const ae = a === g ? y(C[H], !0) : C[H];
          S.insertBefore(ae, x(a));
        }
      }
    }
    return Ze(a), !0;
  }, ei = function(a, d, g, S) {
    return a.length === 0 ? d : d === g || d === S ? Ae(d) : d;
  }, ft = function(a, d) {
    return a === d || I(a) !== null ? !1 : (ln && Wt(a), !0);
  }, ti = function(a, d) {
    if (Be(j.beforeSanitizeElements, a, null), ft(a, d)) return !0;
    if (jt(a))
      return Ze(a), !0;
    const g = le(ue(a));
    if (V = ei(j.uponSanitizeElement, V, ot, R), Be(j.uponSanitizeElement, a, {
      tagName: g,
      allowedTags: V
    }), ft(a, d)) return !0;
    if (xr(a, g))
      return Ze(a), !0;
    if (Je[g] || !(Pe.tagCheck instanceof Function && Pe.tagCheck(g)) && !V[g]) {
      const S = kr(a, g, d);
      return S === !1 && (Be(j.afterSanitizeElements, a, null), ft(a, d)) ? !0 : S;
    }
    if (ie(a) === Se.element && !br(a) || (g === "noscript" || g === "noembed" || g === "noframes") && xe(gl, a.innerHTML))
      return Ze(a), !0;
    if (Fe && a.nodeType === Se.text) {
      const S = Gt(a.textContent);
      a.textContent !== S && (Nt(e.removed, { element: a.cloneNode() }), a.textContent = S);
    }
    return Be(j.afterSanitizeElements, a, null), ft(a, d);
  }, ni = function(a, d, g) {
    if (Ne[d] || Qn(d, a) || ye && (d === "id" || d === "name") && (g in n || g in pr)) return !1;
    const S = ne[d] || Pe.attributeCheck instanceof Function && Pe.attributeCheck(d, a);
    return St && xe(nn, d) || st && xe(rn, d) ? !0 : S ? Hn[d] || xe(Ft, Rt(g, wt, "")) || (d === "src" || d === "xlink:href" || d === "href") && a !== "script" && wi(g, "data:") === 0 && Un[a] || qt && !xe(lt, Rt(g, wt, "")) ? !0 : !g : ii(a) && Zt(ve.tagNameCheck, a) && Zt(ve.attributeNameCheck, d, a) || d === "is" && ve.allowCustomizedBuiltInElements && Zt(ve.tagNameCheck, g);
  }, vr = G({}, [
    "annotation-xml",
    "color-profile",
    "font-face",
    "font-face-format",
    "font-face-name",
    "font-face-src",
    "font-face-uri",
    "missing-glyph"
  ]), ii = function(a) {
    return !vr[Lt(a)] && xe(De, a);
  }, yr = function(a, d, g, S) {
    if (Q && typeof T == "object" && typeof T.getAttributeType == "function" && !g) switch (T.getAttributeType(a, d)) {
      case "TrustedHTML":
        return B(S);
      case "TrustedScriptURL":
        return b(S);
    }
    return S;
  }, wr = function(a, d, g, S) {
    try {
      return g ? a.setAttributeNS(g, d, S) : a.setAttribute(d, S), jt(a) ? (Ze(a), !1) : !0;
    } catch {
      return tt(d, a), !1;
    }
  }, ri = function(a, d) {
    if (Be(j.beforeSanitizeAttributes, a, null), ft(a, d)) return;
    const g = a.attributes;
    if (!g || jt(a)) return;
    ne = ei(j.uponSanitizeAttribute, ne, Tt, Z);
    const S = {
      attrName: "",
      attrValue: "",
      keepAttr: !0,
      allowedAttributes: ne,
      forceKeepAttr: void 0
    };
    let C = g.length;
    const U = le(a.nodeName);
    for (; C--; ) {
      const H = g[C], ae = H.name, Re = H.namespaceURI, Te = H.value, bt = le(ae), fn = Te;
      let ke = ae === "value" ? fn : Ja(fn), ai = !1;
      if (S.attrName = bt, S.attrValue = ke, S.keepAttr = !0, S.forceKeepAttr = void 0, Be(j.uponSanitizeAttribute, a, S), ke = S.attrValue, Mn && (bt === "id" || bt === "name") && wi(ke, Fn) !== 0 && (tt(ae, a, H), ke = Fn + ke, ai = !0), He && xe(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, ke)) {
        tt(ae, a, H);
        continue;
      }
      if (bt === "attributename" && yi(ke, "href")) {
        tt(ae, a, H);
        continue;
      }
      if (!S.forceKeepAttr) {
        if (!S.keepAttr) {
          tt(ae, a, H);
          continue;
        }
        if (!Me && xe(xl, ke)) {
          tt(ae, a, H);
          continue;
        }
        if (Fe && (ke = Gt(ke)), !ni(U, bt, ke)) {
          tt(ae, a, H);
          continue;
        }
        ke = yr(U, bt, Re, ke), ke !== fn && wr(a, ae, Re, ke) && ai && vi(e.removed);
      }
    }
    Be(j.afterSanitizeAttributes, a, null), ft(a, d);
  }, Kt = function(a) {
    let d = null;
    const g = Jn(a);
    for (Be(j.beforeSanitizeShadowDOM, a, null); d = g.nextNode(); )
      if (Be(j.uponSanitizeShadowNode, d, null), ti(d, a), ri(d, a), ht(d.content) && Kt(d.content), ie(d) === Se.element) {
        const S = L(d);
        ht(S) && (hn(S), Kt(S));
      }
    Be(j.afterSanitizeShadowDOM, a, null);
  }, hn = function(a) {
    const d = [{
      node: a,
      shadow: null
    }];
    for (; d.length > 0; ) {
      const g = d.pop();
      if (g.shadow) {
        Kt(g.shadow);
        continue;
      }
      const S = g.node, C = ie(S) === Se.element, U = A(S);
      if (U) for (let H = U.length - 1; H >= 0; --H) d.push({
        node: U[H],
        shadow: null
      });
      if (C) {
        const H = q ? q(S) : null;
        if (typeof H == "string" && le(H) === "template") {
          const ae = S.content;
          ht(ae) && d.push({
            node: ae,
            shadow: null
          });
        }
      }
      if (C) {
        const H = L(S);
        ht(H) && d.push({
          node: null,
          shadow: H
        }, {
          node: H,
          shadow: null
        });
      }
    }
  };
  return e.sanitize = function(w) {
    let a = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, d = null, g = null, S = null, C = null;
    if (on = !w, on && (w = "<!-->"), typeof w != "string" && !At(w) && (w = rl(w), typeof w != "string"))
      throw Ye("dirty is not a string, aborting");
    if (!e.isSupported) return w;
    E ? (V = R, ne = Z) : pn(a), (j.uponSanitizeElement.length > 0 || j.uponSanitizeAttribute.length > 0) && (V = Ae(V)), j.uponSanitizeAttribute.length > 0 && (ne = Ae(ne)), e.removed = [];
    const U = ln && typeof w != "string" && At(w);
    if (U) {
      gr(w);
      const Re = ue(w);
      if (typeof Re == "string") {
        const Te = le(Re);
        if (!V[Te] || Je[Te])
          throw Ht(w), Ye("root node is forbidden and cannot be sanitized in-place");
      }
      if (jt(w))
        throw Ht(w), Ye("root node is clobbered and cannot be sanitized in-place");
      try {
        hn(w);
      } catch (Te) {
        throw Ht(w), Te;
      }
    } else if (At(w))
      d = Vn("<!---->"), g = d.ownerDocument.importNode(w, !0), g.nodeType === Se.element && g.nodeName === "BODY" || g.nodeName === "HTML" ? d = g : d.appendChild(g), hn(d);
    else {
      if (!ge && !Fe && !m && w.indexOf("<") === -1) return Q && et ? B(w) : w;
      if (d = Vn(w), !d) return ge ? null : et ? k : "";
    }
    d && J && Ze(d.firstChild);
    const H = U ? w : d;
    try {
      const Re = Jn(H);
      for (; S = Re.nextNode(); )
        ti(S, H), ri(S, H), ht(S.content) && Kt(S.content);
    } catch (Re) {
      throw U && (Ht(w), nt(e.removed, (Te) => {
        Te.element && Wt(Te.element);
      })), Re;
    }
    if (U) {
      let Re = !1;
      if (nt(e.removed, (Te) => {
        Te.element && (Te.element === w && (Re = !0), Wt(Te.element));
      }), Re) throw Ye("a node selected for removal could not be safely returned; refusing to sanitize in place");
      return Fe && un(w), w;
    }
    if (ge) {
      if (Fe && un(d), qe)
        for (C = $e.call(d.ownerDocument); d.firstChild; ) C.appendChild(d.firstChild);
      else C = d;
      return (ne.shadowroot || ne.shadowrootmode) && (C = Pt.call(i, C, !0)), C;
    }
    let ae = m ? d.outerHTML : d.innerHTML;
    return m && V["!doctype"] && d.ownerDocument && d.ownerDocument.doctype && d.ownerDocument.doctype.name && xe(bl, d.ownerDocument.doctype.name) && (ae = "<!DOCTYPE " + d.ownerDocument.doctype.name + `>
` + ae), Fe && (ae = Gt(ae)), Q && et ? B(ae) : ae;
  }, e.setConfig = function() {
    let w = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    pn(w), E = !0, R = V, Z = ne;
  }, e.clearConfig = function() {
    ut = null, E = !1, R = null, Z = null, Q = N, k = "";
  }, e.isValidAttribute = function(w, a, d) {
    ut || pn({});
    const g = le(w), S = le(a);
    return ni(g, S, d);
  }, e.addHook = function(w, a) {
    typeof a == "function" && we(j, w) && Nt(j[w], a);
  }, e.removeHook = function(w, a) {
    if (we(j, w)) {
      if (a !== void 0) {
        const d = Qa(j[w], a);
        return d === -1 ? void 0 : Va(j[w], d, 1)[0];
      }
      return vi(j[w]);
    }
  }, e.removeHooks = function(w) {
    we(j, w) && (j[w] = []);
  }, e.removeAllHooks = function() {
    j = zi();
  }, e;
}
var ir = nr();
const Tl = /\.(png|jpe?g|gif|webp|svg|avif|bmp)$/i, Sl = /\.(pdf|mp4|webm|mov|mkv|mp3|wav|m4a|ogg|flac|canvas|excalidraw|base)$/i, _l = /^(\d{1,4})(?:x(\d{1,4}))?$/, Al = {
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
}, El = {
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
function Nl(t) {
  return t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function En(t) {
  return t.toLowerCase().replace(/<[^>]+>/g, "").replace(/&[a-z]+;/g, "").replace(/[^\p{L}\p{N}\s-]/gu, "").trim().replace(/\s+/g, "-").slice(0, 80) || "section";
}
function rr(t) {
  return t.replace(/^---\s*\n[\s\S]*?\n---\s*(\n|$)/, "");
}
const Rl = /^ {0,3}(`{3,}|~{3,})[^\n]*\n[\s\S]*?^ {0,3}\1[ \t]*$/gm;
function Cl(t, e) {
  let n = "", i = 0;
  for (const r of t.matchAll(Rl))
    n += e(t.slice(i, r.index)) + r[0], i = r.index + r[0].length;
  return n + e(t.slice(i));
}
function $l(t) {
  return Cl(
    t,
    (e) => e.replace(/%%[\s\S]*?%%/g, "").replace(/(^|[ \t])\^([A-Za-z0-9-]+)[ \t]*$/gm, (n, i, r) => `${i}<span class="lib-block" data-block="${r}"></span>`)
  );
}
function zl(t, e) {
  const n = rr(t);
  if (!e) return n;
  const i = n.split(`
`);
  if (e.startsWith("^")) {
    const p = new RegExp(`(^|\\s)\\^${Nl(e.slice(1))}\\s*$`), u = i.findIndex((_) => p.test(_));
    if (u < 0) return null;
    const T = i[u].trim().startsWith("^");
    let v = T ? u - 1 : u;
    for (; T && v >= 0 && !i[v].trim(); ) v--;
    let y = v;
    for (; y > 0 && i[y - 1].trim(); ) y--;
    return v < 0 ? null : i.slice(y, v + 1).join(`
`);
  }
  const r = En(e);
  let l = !1, c = -1, o = 0;
  for (let p = 0; p < i.length; p++) {
    if (/^ {0,3}(`{3,}|~{3,})/.test(i[p]) && (l = !l), l) continue;
    const u = /^(#{1,6})\s+(.*?)\s*#*\s*$/.exec(i[p]);
    if (u) {
      if (c >= 0 && u[1].length <= o) return i.slice(c, p).join(`
`).trimEnd();
      c < 0 && En(u[2].replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (T, v, y) => y || v)) === r && (c = p, o = u[1].length);
    }
  }
  return c >= 0 ? i.slice(c).join(`
`).trimEnd() : null;
}
function Li(t, e, n) {
  return `/api/apps/notes-search/asset?${new URLSearchParams({ c: t, p: e, src: n }).toString()}`;
}
function Oi(t) {
  const e = _l.exec(t.trim());
  return e ? ` width="${e[1]}"${e[2] ? ` height="${e[2]}"` : ""}` : "";
}
function Ii(t, e) {
  const n = [], i = /* @__PURE__ */ new Map(), r = e.idPrefix ?? "";
  let l = !1;
  const c = {
    name: "wikilink",
    level: "inline",
    start(f) {
      const x = f.indexOf("[[");
      if (!(x < 0))
        return x > 0 && f[x - 1] === "!" ? x - 1 : x;
    },
    tokenizer(f) {
      const x = /^(!?)\[\[([^\]\n|#]+)(#[^\]\n|]*)?(?:\|([^\]\n]+))?\]\]/.exec(f);
      if (x)
        return {
          type: "wikilink",
          raw: x[0],
          embed: x[1] === "!",
          target: x[2].trim(),
          heading: (x[3] || "").slice(1),
          alias: (x[4] || "").trim()
        };
    },
    renderer(f) {
      const x = String(f.target), A = String(f.heading || ""), I = String(f.alias || "");
      if (f.embed && Tl.test(x)) {
        const z = Oi(I), K = I && !z ? I : x;
        return `<img src="${be(Li(e.collection, e.path, x))}" alt="${be(K)}"${z} loading="lazy">`;
      }
      if (f.embed && Sl.test(x))
        return `<span class="lib-embed-missing">Attachment: ${be(x)}</span>`;
      const L = (z) => `<a class="lib-wikilink" href="#" data-wikilink="${be(x)}" data-heading="${be(A)}">${be(z)}</a>`;
      return f.embed && e.embedded ? `<span class="lib-embed-missing">Embedded note: ${L(x)}</span>` : f.embed ? `<span class="lib-embed" data-embed="${be(x)}" data-heading="${be(A)}"><span class="lib-embed-head">${L(I || x + (A && !A.startsWith("^") ? ` › ${A}` : ""))}</span><span class="lib-embed-body lib-embed-loading">Loading…</span></span>` : L(I || x + (A && !A.startsWith("^") ? ` › ${A}` : ""));
    }
  }, o = {
    name: "highlight",
    level: "inline",
    start(f) {
      const x = f.indexOf("==");
      return x < 0 ? void 0 : x;
    },
    tokenizer(f) {
      const x = /^==(?=\S)([^\n]*?\S)==(?!=)/.exec(f);
      if (!x) return;
      const A = { type: "highlight", raw: x[0], tokens: [] };
      return this.lexer.inlineTokens(x[1], A.tokens), A;
    },
    renderer(f) {
      return `<mark class="lib-hl">${this.parser.parseInline(f.tokens)}</mark>`;
    }
  }, p = {
    name: "callout",
    level: "block",
    start(f) {
      const x = /^ {0,3}>[ \t]*\[!/m.exec(f);
      return x ? x.index : void 0;
    },
    tokenizer(f) {
      const x = /^ {0,3}>[ \t]*\[!([\w-]+)\]([+-]?)[ \t]*([^\n]*)(?:\n|$)((?: {0,3}>[^\n]*(?:\n|$))*)/.exec(f);
      if (!x) return;
      const A = x[1].toLowerCase(), I = Al[A] ?? A, L = x[3].trim(), z = {
        type: "callout",
        raw: x[0],
        kind: I,
        fold: x[2],
        hasTitle: !!L,
        label: A.charAt(0).toUpperCase() + A.slice(1),
        titleTokens: [],
        tokens: []
      };
      return L && this.lexer.inline(L, z.titleTokens), this.lexer.blockTokens(x[4].replace(/^ {0,3}> ?/gm, ""), z.tokens), z;
    },
    childTokens: ["titleTokens", "tokens"],
    renderer(f) {
      const x = f.hasTitle ? this.parser.parseInline(f.titleTokens) : be(String(f.label)), A = this.parser.parse(f.tokens), I = be(String(f.kind)), L = El[String(f.kind)] ?? "accent", z = `class="lib-callout" data-callout="${I}" data-tone="${L}"`;
      return f.fold ? `<details ${z}${f.fold === "+" ? " open" : ""}><summary class="lib-callout-title"><span>${x}</span></summary>${A ? `<div class="lib-callout-body">${A}</div>` : ""}</details>
` : `<div ${z}><div class="lib-callout-title"><span>${x}</span></div>${A ? `<div class="lib-callout-body">${A}</div>` : ""}</div>
`;
    }
  }, u = {
    name: "hashtag",
    level: "inline",
    start(f) {
      const x = /(^|[\s(])#[A-Za-z][\w\-/]*/.exec(f);
      return x ? x.index + x[1].length : void 0;
    },
    tokenizer(f) {
      const x = /^#([A-Za-z][\w\-/]*)/.exec(f);
      if (x)
        return { type: "hashtag", raw: x[0], tag: x[1] };
    },
    renderer(f) {
      const x = String(f.tag);
      return `<span class="lib-ptag" role="button" tabindex="0" data-tag="${be(x)}">#${be(x)}</span>`;
    }
  }, T = new Vi({ gfm: !0, breaks: !1 });
  T.use({
    extensions: [p, c, o, u],
    renderer: {
      heading({ tokens: f, depth: x, text: A }) {
        const I = this.parser.parseInline(f), L = A.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (pe, ie, ue) => ue || ie).replace(/<[^>]+>/g, "").trim();
        if (!l && (l = !0, x === 1 && e.title && L.toLowerCase() === e.title.trim().toLowerCase()))
          return "";
        const z = r + En(L), K = i.get(z) ?? 0;
        i.set(z, K + 1);
        const q = K ? `${z}-${K}` : z;
        return x <= 4 && n.push({ id: q, text: L.replace(/[*_`=]/g, ""), depth: x }), `<h${x} id="${be(q)}"><a class="lib-anchor" href="#${be(q)}" aria-hidden="true" tabindex="-1">#</a>${I}</h${x}>
`;
      },
      image({ href: f, title: x, text: A }) {
        const L = f && !/^[a-z][a-z0-9+.-]*:/i.test(f) && !f.startsWith("//") ? Li(e.collection, e.path, f) : f, z = /^(.*?)\|([^|]+)$/.exec(A || ""), K = z ? Oi(z[2]) : "", q = K && z ? z[1] : A || "";
        return `<img src="${be(L || "")}" alt="${be(q)}"${K}${x ? ` title="${be(x)}"` : ""} loading="lazy">`;
      }
    }
  });
  const v = $l(rr(t)), y = T.parse(v, { async: !1 });
  return { html: ir.sanitize(y, {
    ADD_ATTR: ["data-wikilink", "data-heading", "data-tag", "data-embed", "data-block", "data-callout", "data-tone", "target", "loading", "tabindex", "role", "open"],
    FORBID_TAGS: ["style", "form", "button", "textarea", "select", "iframe", "object", "embed"],
    FORBID_ATTR: ["style"]
  }), outline: n };
}
ir.addHook("afterSanitizeAttributes", (t) => {
  if (t.tagName === "A") {
    const e = t.getAttribute("href") || "";
    /^https?:/i.test(e) && (t.setAttribute("target", "_blank"), t.setAttribute("rel", "noopener noreferrer"));
  }
  t.tagName === "INPUT" && t.setAttribute("disabled", "");
});
function Ll(t) {
  return /* @__PURE__ */ h("div", { className: "lib-tabs", role: "tablist", "aria-label": "Open notes", children: [
    /* @__PURE__ */ s(
      "button",
      {
        type: "button",
        className: "lib-btn lib-btn-quiet lib-btn-icon",
        style: { marginBottom: 6, flex: "none" },
        "aria-pressed": t.leftOpen,
        "aria-label": t.leftOpen ? "Hide search" : "Show search",
        title: `${t.leftOpen ? "Hide" : "Show"} search (${xt}\\)`,
        onClick: t.onToggleLeft,
        children: /* @__PURE__ */ s($.PanelLeft, { size: 16 })
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
            /* @__PURE__ */ s($.File, { size: 13, "aria-hidden": "true" }),
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
                children: /* @__PURE__ */ s($.X, { size: 12, strokeWidth: 2.6 })
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
            /* @__PURE__ */ s($.Folders, { size: 15 }),
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
          title: `${t.chatOpen ? "Hide" : "Show"} chats (${xt}J)`,
          children: [
            /* @__PURE__ */ s($.Chat, { size: 15 }),
            "Chats",
            t.chatCount ? ` · ${t.chatCount}` : ""
          ]
        }
      )
    ] })
  ] });
}
function Ol(t) {
  const e = Rn(), [n, i] = D(null), [r, l] = D(null), [c, o] = D(null), [p, u] = D(""), [T, v] = D(null), [y, _] = D(0), [f, x] = D(0), [A, I] = D(!1), L = Ve(null), z = Ve(null), K = X(t.tab);
  Ee(() => {
    let k = !0;
    return i(null), l(null), o(null), _(0), e.get(`${he}/doc?${We({ c: t.tab.collection, p: t.tab.path })}`).then((N) => {
      k && (i(N), t.onDocLoaded(N));
    }).catch((N) => k && l(Ge(N))), e.get(`${he}/backlinks?${We({ c: t.tab.collection, p: t.tab.path })}`).then((N) => k && o(N.results)).catch(() => k && o([])), z.current?.scrollTo({ top: 0 }), () => {
      k = !1;
    };
  }, [e, K]);
  const q = Nn(
    () => n ? Ii(n.markdown, { collection: n.collection, path: n.path, title: n.title }) : null,
    [n]
  );
  Sr(() => {
    const k = L.current;
    if (!k || !q) return;
    k.innerHTML = q.html, k.querySelectorAll("pre").forEach((M) => {
      if (M.querySelector(".lib-copy")) return;
      const F = document.createElement("button");
      F.type = "button", F.className = "lib-copy", F.textContent = "Copy", F.addEventListener("click", () => {
        const B = M.querySelector("code")?.textContent ?? M.textContent ?? "";
        navigator.clipboard?.writeText(B).then(() => {
          F.textContent = "Copied", window.setTimeout(() => F.textContent = "Copy", 1200);
        });
      }), M.appendChild(F);
    });
    const N = t.tab.words.filter((M) => M.length >= 2);
    let Y = 0;
    if (N.length) {
      const M = new RegExp(`(${N.map((b) => b.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi"), F = document.createTreeWalker(k, NodeFilter.SHOW_TEXT, {
        acceptNode: (b) => b.parentElement?.closest("pre, code, .lib-anchor, mark.lib-find, .lib-embed") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
      }), B = [];
      for (; F.nextNode(); ) B.push(F.currentNode);
      for (const b of B) {
        const O = b.data;
        if (M.lastIndex = 0, !M.test(O)) continue;
        M.lastIndex = 0;
        const re = document.createDocumentFragment();
        let te = 0, ce;
        for (; ce = M.exec(O); ) {
          ce.index > te && re.appendChild(document.createTextNode(O.slice(te, ce.index)));
          const $e = document.createElement("mark");
          $e.className = "lib-find", $e.dataset.find = String(Y++), $e.textContent = ce[0], re.appendChild($e), te = ce.index + ce[0].length;
        }
        te < O.length && re.appendChild(document.createTextNode(O.slice(te))), b.parentNode?.replaceChild(re, b);
      }
    }
    if (x(Y), _(0), t.tab.heading?.startsWith("^")) {
      const M = k.querySelector(`[data-block="${CSS.escape(t.tab.heading.slice(1))}"]`), F = M?.closest("p, li, blockquote, table, .lib-callout") ?? M?.parentElement;
      F && (F.dataset.flash = "true", window.setTimeout(() => F.scrollIntoView({ block: "center" }), 30));
    } else if (t.tab.heading) {
      const M = t.tab.heading.toLowerCase(), F = q.outline.find((B) => B.text.toLowerCase() === M);
      F && window.setTimeout(() => document.getElementById(F.id)?.scrollIntoView({ block: "start" }), 30);
    } else Y && window.setTimeout(() => k.querySelector("mark.lib-find")?.scrollIntoView({ block: "center" }), 30);
  }, [q, t.tab.words, t.tab.heading]), Ee(() => {
    const k = L.current;
    if (!k || !q || !n) return;
    const N = Array.from(k.querySelectorAll(".lib-embed[data-embed]"));
    if (!N.length) return;
    let Y = !0;
    const M = /* @__PURE__ */ new Map(), F = (B) => {
      let b = M.get(B);
      return b || (b = e.get(`${he}/resolve?${We({ t: B, c: n.collection })}`).then((O) => e.get(`${he}/doc?${We({ c: O.collection, p: O.path })}`)), M.set(B, b)), b;
    };
    return N.forEach((B, b) => {
      const O = B.querySelector(".lib-embed-body");
      if (!O) return;
      const re = B.dataset.heading || "";
      F(B.dataset.embed || "").then((te) => {
        if (!Y) return;
        const ce = zl(te.markdown, re);
        if (ce === null) {
          O.textContent = re.startsWith("^") ? "That block is no longer in the note." : `No heading “${re}” in this note.`, O.className = "lib-embed-body lib-embed-missing";
          return;
        }
        if (te.private) {
          O.textContent = "Private note. Open it to read.", O.className = "lib-embed-body lib-embed-missing";
          return;
        }
        O.innerHTML = Ii(ce, { collection: te.collection, path: te.path, title: re ? void 0 : te.title, embedded: !0, idPrefix: `embed-${b}-` }).html, O.className = "lib-embed-body";
      }).catch(() => {
        Y && (O.textContent = "This note could not be found.", O.className = "lib-embed-body lib-embed-missing", B.querySelector(".lib-wikilink")?.setAttribute("data-broken", "true"));
      });
    }), () => {
      Y = !1;
    };
  }, [e, q, n]), Ee(() => {
    const k = L.current;
    if (!k || !f) return;
    k.querySelectorAll("mark.lib-find[data-active]").forEach((Y) => Y.removeAttribute("data-active"));
    const N = k.querySelector(`mark.lib-find[data-find="${y}"]`);
    N && (N.dataset.active = "true", N.scrollIntoView({ block: "center", behavior: "smooth" }));
  }, [y, f]), Ee(() => {
    const k = L.current, N = z.current;
    if (!k || !N || !q?.outline.length) return;
    const Y = q.outline.map((F) => document.getElementById(F.id)).filter(Boolean), M = () => {
      const F = N.getBoundingClientRect().top + 80;
      let B = Y[0]?.id ?? null;
      for (const b of Y)
        if (b.getBoundingClientRect().top <= F) B = b.id;
        else break;
      v(B);
    };
    return M(), N.addEventListener("scroll", M, { passive: !0 }), () => N.removeEventListener("scroll", M);
  }, [q]);
  const pe = oe(
    (k) => {
      const N = k.target, Y = N.closest("[data-wikilink]");
      if (Y) {
        k.preventDefault(), t.onOpenLink(Y.dataset.wikilink || "", Y.dataset.heading || "", t.tab.collection);
        return;
      }
      const M = N.closest("[data-tag]");
      if (M) {
        k.preventDefault(), t.onTag(M.dataset.tag || "");
        return;
      }
      const F = N.closest('a[href^="#"]');
      if (F) {
        k.preventDefault();
        const b = decodeURIComponent(F.getAttribute("href").slice(1));
        document.getElementById(b)?.scrollIntoView({ block: "start", behavior: "smooth" });
        return;
      }
      const B = N.closest("a[href]");
      if (B && !/^[a-z][a-z0-9+.-]*:/i.test(B.getAttribute("href") || "") && /\.md(#.*)?$/i.test(B.getAttribute("href") || "")) {
        k.preventDefault();
        const b = decodeURIComponent(B.getAttribute("href")), re = ((t.tab.path.includes("/") ? t.tab.path.slice(0, t.tab.path.lastIndexOf("/") + 1) : "") + b.split("#")[0]).split("/"), te = [];
        for (const ce of re)
          ce === ".." ? te.pop() : ce && ce !== "." && te.push(ce);
        t.onOpenHit({ collection: t.tab.collection, path: te.join("/"), title: te[te.length - 1].replace(/\.md$/i, ""), uri: "", modified_at: null, score: 0, snippet: [] });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t.tab.collection, t.tab.path, t.onOpenLink, t.onTag, t.onOpenHit]
  );
  function ie() {
    if (!n) return;
    const k = p.trim();
    t.onAddToChat && k ? t.onAddToChat(n, k) : t.onChat(n, k), u("");
  }
  function ue(k) {
    k.nativeEvent.isComposing || k.key === "Enter" && !k.shiftKey && (k.preventDefault(), ie());
  }
  const Q = n ? Object.entries(n.properties).filter(([k]) => k !== "private") : [];
  return /* @__PURE__ */ h("div", { className: "lib-scroll", ref: z, onWheel: t.tab.preview ? t.onTouch : void 0, children: [
    r && /* @__PURE__ */ s("div", { className: "lib-welcome", children: /* @__PURE__ */ h("div", { className: "lib-alert", role: "alert", children: [
      /* @__PURE__ */ s($.Alert, { size: 16 }),
      /* @__PURE__ */ s("span", { children: r })
    ] }) }),
    !n && !r && /* @__PURE__ */ s("div", { className: "lib-doc", children: /* @__PURE__ */ h("div", { className: "lib-article lib-skeleton", "aria-busy": "true", "aria-label": "Loading note", children: [
      /* @__PURE__ */ s("i", { style: { width: "30%" } }),
      /* @__PURE__ */ s("i", { style: { width: "70%", height: 36 } }),
      /* @__PURE__ */ s("i", { style: { width: "45%" } }),
      /* @__PURE__ */ s("br", {}),
      [92, 88, 95, 60, 90, 84, 40].map((k, N) => /* @__PURE__ */ s("i", { style: { width: `${k}%` } }, N))
    ] }) }),
    n && q && /* @__PURE__ */ h("div", { className: "lib-doc", children: [
      /* @__PURE__ */ h("article", { className: "lib-article", children: [
        f > 0 && /* @__PURE__ */ h("div", { className: "lib-findbar", role: "group", "aria-label": "Matches in this note", children: [
          /* @__PURE__ */ h("span", { children: [
            y + 1,
            " / ",
            f
          ] }),
          /* @__PURE__ */ s("button", { type: "button", className: "lib-btn lib-btn-quiet lib-btn-icon", "aria-label": "Previous match", onClick: () => _((k) => (k - 1 + f) % f), children: /* @__PURE__ */ s($.ChevronUp, { size: 14 }) }),
          /* @__PURE__ */ s("button", { type: "button", className: "lib-btn lib-btn-quiet lib-btn-icon", "aria-label": "Next match", onClick: () => _((k) => (k + 1) % f), children: /* @__PURE__ */ s($.ChevronDown, { size: 14 }) })
        ] }),
        /* @__PURE__ */ h("nav", { className: "lib-crumbs", "aria-label": "Location", children: [
          /* @__PURE__ */ s($.Folder, { size: 13 }),
          Ui(n.collection, n.path).split(" / ").map((k, N, Y) => /* @__PURE__ */ h("span", { className: "lib-row", style: { gap: 4 }, children: [
            k,
            N < Y.length - 1 && /* @__PURE__ */ s($.Chevron, { size: 12 })
          ] }, N))
        ] }),
        /* @__PURE__ */ s("h1", { className: "lib-title", children: n.title }),
        /* @__PURE__ */ h("div", { className: "lib-docmeta", children: [
          n.modified_at && /* @__PURE__ */ h("span", { title: yn(n.modified_at), children: [
            /* @__PURE__ */ s($.Clock, { size: 13 }),
            " Edited ",
            Qe(n.modified_at)
          ] }),
          /* @__PURE__ */ h("span", { children: [
            n.reading_minutes,
            " min read · ",
            n.words.toLocaleString(),
            " words"
          ] }),
          n.private && /* @__PURE__ */ h("span", { className: "lib-tag lib-tag-warn", children: [
            /* @__PURE__ */ s($.Lock, { size: 11 }),
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
                /* @__PURE__ */ s($.ChatPlus, { size: 15 }),
                "Chat about this"
              ]
            }
          ),
          t.onAddToChat && !n.private && /* @__PURE__ */ h("button", { type: "button", className: "lib-btn lib-btn-secondary", onClick: () => t.onAddToChat(n, ""), title: `Bring this note into “${t.activeChatTitle}”`, children: [
            /* @__PURE__ */ s($.Plus, { size: 15 }),
            "Add to current chat"
          ] }),
          t.sessionsForDoc.slice(0, 2).map((k) => /* @__PURE__ */ h("button", { type: "button", className: "lib-btn lib-btn-quiet", onClick: () => t.onResumeSession(k), title: `Reopen chat from ${yn(k.created_at)}`, children: [
            /* @__PURE__ */ s($.Chat, { size: 14 }),
            "Resume · ",
            Qe(k.created_at)
          ] }, k.slot_key)),
          /* @__PURE__ */ s("span", { className: "lib-grow" }),
          n.obsidian && /* @__PURE__ */ h(
            "a",
            {
              className: "lib-btn lib-btn-quiet lib-btn-sm",
              href: `obsidian://open?${We({ vault: n.obsidian.vault, file: n.obsidian.file })}`,
              title: `Open in the “${n.obsidian.vault}” vault in Obsidian`,
              children: [
                /* @__PURE__ */ s($.External, { size: 14 }),
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
              onClick: () => void navigator.clipboard?.writeText(n.abs_path).then(() => t.notify("Path copied")),
              children: /* @__PURE__ */ s($.Copy, { size: 15 })
            }
          ),
          /* @__PURE__ */ s(
            "button",
            {
              type: "button",
              className: "lib-btn lib-btn-quiet lib-btn-icon",
              title: "Copy the [[wikilink]]",
              "aria-label": "Copy the wikilink",
              onClick: () => void navigator.clipboard?.writeText(`[[${n.title}]]`).then(() => t.notify("Wikilink copied")),
              children: /* @__PURE__ */ s($.Link, { size: 15 })
            }
          ),
          Q.length > 0 && /* @__PURE__ */ s("button", { type: "button", className: "lib-btn lib-btn-quiet lib-btn-sm", "aria-pressed": A, onClick: () => I((k) => !k), children: "Properties" })
        ] }),
        A && Q.length > 0 && /* @__PURE__ */ s("dl", { className: "lib-props", children: Q.map(([k, N]) => /* @__PURE__ */ h("div", { style: { display: "contents" }, children: [
          /* @__PURE__ */ s("dt", { children: k }),
          /* @__PURE__ */ s("dd", { children: N })
        ] }, k)) }),
        /* @__PURE__ */ s(
          "div",
          {
            ref: L,
            className: "lib-prose",
            style: { marginTop: 26 },
            onClick: pe,
            onKeyDown: (k) => {
              const N = k.target;
              (k.key === "Enter" || k.key === " ") && N.dataset.tag && (k.preventDefault(), t.onTag(N.dataset.tag));
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
          c.map((k) => /* @__PURE__ */ h("button", { type: "button", className: "lib-backlink", onClick: () => t.onOpenHit(k), children: [
            /* @__PURE__ */ h("div", { className: "lib-row", children: [
              /* @__PURE__ */ s("b", { className: "lib-grow lib-ell", children: k.title }),
              /* @__PURE__ */ s("span", { className: "lib-meta-sm", children: Qe(k.modified_at) })
            ] }),
            k.snippet.length > 0 && /* @__PURE__ */ s("div", { className: "lib-hit-snippet", children: /* @__PURE__ */ s(qi, { parts: k.snippet, onLink: (N) => t.onOpenLink(N, "", k.collection) }) })
          ] }, X(k)))
        ] })
      ] }),
      q.outline.length > 1 && /* @__PURE__ */ h("nav", { className: "lib-outline", "aria-label": "On this page", children: [
        /* @__PURE__ */ s("h4", { children: "On this page" }),
        q.outline.map((k) => /* @__PURE__ */ s(
          "a",
          {
            href: `#${k.id}`,
            "data-depth": k.depth,
            "aria-current": T === k.id,
            onClick: (N) => {
              N.preventDefault(), document.getElementById(k.id)?.scrollIntoView({ block: "start", behavior: "smooth" });
            },
            children: k.text
          },
          k.id
        ))
      ] })
    ] }),
    n && !n.private && /* @__PURE__ */ h("div", { className: "lib-ask", children: [
      /* @__PURE__ */ s($.Sparkles, { size: 17, "aria-hidden": "true" }),
      /* @__PURE__ */ s(
        "textarea",
        {
          rows: 1,
          value: p,
          onChange: (k) => {
            u(k.target.value), k.target.style.height = "auto", k.target.style.height = `${Math.min(160, k.target.scrollHeight)}px`;
          },
          onKeyDown: ue,
          placeholder: t.onAddToChat ? `Ask in “${t.activeChatTitle}” about this note…` : "Ask anything about this note…",
          "aria-label": "Ask about this note"
        }
      ),
      /* @__PURE__ */ s("button", { type: "button", className: "lib-btn lib-btn-primary lib-btn-icon", "aria-label": "Ask", onClick: ie, children: /* @__PURE__ */ s($.ArrowUp, { size: 16, strokeWidth: 2.6 }) })
    ] })
  ] });
}
function Il(t) {
  const e = Ar(), n = t.open.find((o) => o.slot_key === t.active) ?? null, i = new Set(t.open.map((o) => o.slot_key)), r = t.sessions.filter((o) => !i.has(o.slot_key)), l = t.currentDocKey ? r.filter((o) => o.docs.some((p) => X(p) === t.currentDocKey)) : [], c = r.filter((o) => !l.includes(o));
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
          children: /* @__PURE__ */ s($.External, { size: 15 })
        }
      ),
      /* @__PURE__ */ s("button", { type: "button", className: "lib-btn lib-btn-quiet lib-btn-icon", "aria-label": "Hide chats", onClick: t.onCloseDrawer, children: /* @__PURE__ */ s($.PanelRight, { size: 16 }) })
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
              children: /* @__PURE__ */ s($.X, { size: 12, strokeWidth: 2.6 })
            }
          )
        ]
      },
      o.slot_key
    )) }),
    n ? /* @__PURE__ */ h(Qt, { children: [
      n.docs.length > 0 && /* @__PURE__ */ h("div", { className: "lib-context", children: [
        /* @__PURE__ */ s("span", { children: "About" }),
        n.docs.map((o) => /* @__PURE__ */ h("button", { type: "button", className: "lib-docchip", onClick: () => t.onOpenDoc(o), title: `${o.collection}/${o.path}`, children: [
          /* @__PURE__ */ s($.File, { size: 12 }),
          /* @__PURE__ */ s("span", { className: "lib-ell", children: o.title })
        ] }, X(o)))
      ] }),
      /* @__PURE__ */ s("div", { className: "lib-chatbody", children: /* @__PURE__ */ s(Er, { slotKey: n.slot_key, frameless: !0, startAtBottom: !0, placeholder: "Reply…" }, n.slot_key) })
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
      l.map((o) => /* @__PURE__ */ s(Di, { s: o, onResume: t.onResume, onForget: t.onForget }, o.slot_key)),
      c.length > 0 && /* @__PURE__ */ s("div", { className: "lib-section", children: "Earlier" }),
      c.map((o) => /* @__PURE__ */ s(Di, { s: o, onResume: t.onResume, onForget: t.onForget }, o.slot_key))
    ] })
  ] });
}
function Di({ s: t, onResume: e, onForget: n }) {
  return /* @__PURE__ */ h("div", { className: "lib-row", style: { alignItems: "flex-start" }, children: [
    /* @__PURE__ */ h("button", { type: "button", className: "lib-convo lib-grow", onClick: () => e(t), title: yn(t.created_at), children: [
      /* @__PURE__ */ s("b", { className: "lib-ell", style: { maxWidth: "100%" }, children: t.title.replace(/^📄\s*/, "") }),
      /* @__PURE__ */ h("span", { className: "lib-meta-sm lib-ell", style: { maxWidth: "100%" }, children: [
        Qe(t.created_at),
        " · ",
        t.docs.map((i) => i.title).join(", ")
      ] })
    ] }),
    /* @__PURE__ */ s("button", { type: "button", className: "lib-btn lib-btn-quiet lib-btn-icon", style: { marginTop: 8 }, "aria-label": `Remove ${t.title} from this list`, title: "Remove from this list (the chat stays in your sidebar)", onClick: () => n(t), children: /* @__PURE__ */ s($.X, { size: 13 }) })
  ] });
}
const Dl = { obsidian: "Obsidian vault", reflect: "Reflect graph", markdown: "Markdown" };
function Pl(t) {
  return t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "notes";
}
function Ml(t) {
  return t.replace(/[\\/]+$/, "").split(/[\\/]/).pop() || "";
}
const $t = (t) => t.state === "queued" || t.state === "running";
function ar(t) {
  const e = Rn(), [n, i] = D(null), [r, l] = D(null), [c, o] = D(""), [p, u] = D(""), [T, v] = D(!1), [y, _] = D(""), [f, x] = D(!1), [A, I] = D(null), [L, z] = D(!1), [K, q] = D(null), pe = Ve(/* @__PURE__ */ new Set()), ie = oe(() => e.get(`${he}/folders`).then((b) => {
    i(b), l(null);
    let O = !1;
    for (const re of b.jobs)
      !$t(re) && !pe.current.has(re.id) && (pe.current.add(re.id), O = !0);
    return O && t.onChanged(), b;
  }).catch((b) => l(Ge(b))), [e]);
  Ee(() => {
    ie().then((b) => b && b.jobs.forEach((O) => !$t(O) && pe.current.add(O.id)));
  }, [ie]);
  const ue = n?.jobs.some($t) ?? !1;
  Ee(() => {
    if (!ue) return;
    const b = window.setInterval(() => void ie(), 1500);
    return () => window.clearInterval(b);
  }, [ue, ie]);
  function Q(b) {
    o(b), I(null), T || u(Pl(Ml(b)));
  }
  async function k(b) {
    z(!0), I(null);
    try {
      await e.post(`${he}/folders`, b), o(""), u(""), v(!1), _(""), x(!1), await ie();
    } catch (O) {
      I(Ge(O));
    } finally {
      z(!1);
    }
  }
  function N(b) {
    b.preventDefault(), c.trim() && k({ path: c.trim(), name: p.trim(), mask: y.trim() || void 0 });
  }
  async function Y(b, O) {
    q(null);
    try {
      b === "remove" ? await e.del(`${he}/folders/${encodeURIComponent(O)}`) : await e.post(`${he}/folders/${encodeURIComponent(O)}/reindex`, {}), await ie();
    } catch (re) {
      I(Ge(re));
    }
  }
  if (r && !n)
    return /* @__PURE__ */ h("div", { className: "lib-alert", role: "alert", children: [
      /* @__PURE__ */ s($.Alert, { size: 16 }),
      /* @__PURE__ */ s("span", { children: r })
    ] });
  if (!n)
    return /* @__PURE__ */ h("div", { className: "lib-skeleton", "aria-busy": "true", "aria-label": "Loading folders", children: [
      /* @__PURE__ */ s("i", { style: { width: "60%" } }),
      /* @__PURE__ */ s("i", { style: { width: "85%" } })
    ] });
  const M = (b) => n.jobs.find((O) => O.collection === b && $t(O)), F = n.jobs.filter((b) => b.kind === "add" && $t(b) && !n.folders.some((O) => O.name === b.collection)), B = n.jobs.filter((b) => b.state === "failed").slice(0, 3);
  return /* @__PURE__ */ h("div", { className: "lib-folders", children: [
    !n.qmd && /* @__PURE__ */ h("div", { className: "lib-alert", role: "alert", children: [
      /* @__PURE__ */ s($.Terminal, { size: 16 }),
      /* @__PURE__ */ h("div", { children: [
        /* @__PURE__ */ s("b", { children: "QMD isn’t installed." }),
        " Notes Search uses it to index your notes. Install it with Node 22 or newer, then reload this page:",
        /* @__PURE__ */ s("pre", { className: "lib-cmd", children: "npm install -g @tobilu/qmd" })
      ] })
    ] }),
    n.suggestions.length > 0 && /* @__PURE__ */ h("section", { "aria-label": "Obsidian vaults on this computer", children: [
      /* @__PURE__ */ s("div", { className: "lib-section", style: { paddingLeft: 0 }, children: "Found on this computer" }),
      n.suggestions.map((b) => /* @__PURE__ */ h("div", { className: "lib-folder", children: [
        /* @__PURE__ */ h("div", { className: "lib-grow", style: { minWidth: 0 }, children: [
          /* @__PURE__ */ h("div", { className: "lib-row", style: { gap: 8 }, children: [
            /* @__PURE__ */ s("b", { className: "lib-ell", children: b.label }),
            /* @__PURE__ */ s("span", { className: "lib-tag", children: "Obsidian vault" })
          ] }),
          /* @__PURE__ */ s("div", { className: "lib-folder-path lib-ell", title: b.path, children: b.path })
        ] }),
        /* @__PURE__ */ h("button", { type: "button", className: "lib-btn lib-btn-secondary lib-btn-sm", disabled: !n.qmd || L, onClick: () => void k({ path: b.path, name: b.name }), children: [
          /* @__PURE__ */ s($.Plus, { size: 14 }),
          " Add"
        ] })
      ] }, b.path))
    ] }),
    /* @__PURE__ */ h("form", { className: "lib-folder-form", onSubmit: N, "aria-label": "Add a folder", children: [
      /* @__PURE__ */ s("div", { className: "lib-section", style: { paddingLeft: 0 }, children: t.firstRun ? "Add a folder of notes" : "Add a folder" }),
      /* @__PURE__ */ h("label", { className: "lib-field", children: [
        /* @__PURE__ */ s("span", { children: "Folder" }),
        /* @__PURE__ */ s(
          "input",
          {
            value: c,
            onChange: (b) => Q(b.target.value),
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
              onChange: (b) => {
                u(b.target.value), v(!0);
              },
              placeholder: "notes",
              spellCheck: !1
            }
          )
        ] }),
        /* @__PURE__ */ h("label", { className: "lib-field lib-grow", children: [
          /* @__PURE__ */ s("span", { children: "Files" }),
          /* @__PURE__ */ s("input", { value: y, onChange: (b) => _(b.target.value), placeholder: "**/*.md", spellCheck: !1 })
        ] })
      ] }),
      A && /* @__PURE__ */ h("div", { className: "lib-alert lib-alert-error", role: "alert", children: [
        /* @__PURE__ */ s($.Alert, { size: 16 }),
        /* @__PURE__ */ s("span", { children: A })
      ] }),
      /* @__PURE__ */ h("div", { className: "lib-row", style: { gap: 8 }, children: [
        /* @__PURE__ */ h("button", { type: "submit", className: "lib-btn lib-btn-primary", disabled: !n.qmd || L || !c.trim(), children: [
          L ? /* @__PURE__ */ s($.Loader, { size: 15, className: "lib-spin" }) : /* @__PURE__ */ s($.FolderPlus, { size: 15 }),
          "Add and index"
        ] }),
        /* @__PURE__ */ s("button", { type: "button", className: "lib-btn lib-btn-quiet lib-btn-sm", "aria-expanded": f, onClick: () => x((b) => !b), children: f ? "Fewer options" : "Name and file pattern" })
      ] })
    ] }),
    (n.folders.length > 0 || F.length > 0) && /* @__PURE__ */ h("section", { "aria-label": "Searched folders", children: [
      /* @__PURE__ */ s("div", { className: "lib-section", style: { paddingLeft: 0 }, children: "Searched folders" }),
      F.map((b) => /* @__PURE__ */ s("div", { className: "lib-folder", "aria-busy": "true", children: /* @__PURE__ */ h("div", { className: "lib-grow", style: { minWidth: 0 }, children: [
        /* @__PURE__ */ s("b", { children: b.collection }),
        /* @__PURE__ */ s(Pi, { job: b })
      ] }) }, b.id)),
      n.folders.map((b) => {
        const O = M(b.name);
        return /* @__PURE__ */ h("div", { className: "lib-folder", "aria-busy": O ? !0 : void 0, children: [
          /* @__PURE__ */ h("div", { className: "lib-grow", style: { minWidth: 0 }, children: [
            /* @__PURE__ */ h("div", { className: "lib-row", style: { gap: 8 }, children: [
              /* @__PURE__ */ s("b", { className: "lib-ell", children: b.name }),
              /* @__PURE__ */ s("span", { className: "lib-tag", children: Dl[b.kind] }),
              /* @__PURE__ */ h("span", { className: "lib-meta-sm", children: [
                b.docs.toLocaleString(),
                " notes"
              ] })
            ] }),
            /* @__PURE__ */ s("div", { className: "lib-folder-path lib-ell", title: b.path, children: b.path }),
            O && /* @__PURE__ */ s(Pi, { job: O }),
            K === b.name && /* @__PURE__ */ h("div", { className: "lib-folder-confirm", role: "group", "aria-label": `Remove ${b.name}`, children: [
              /* @__PURE__ */ h("span", { children: [
                "Remove “",
                b.name,
                "” from Notes Search? Your files stay on disk, and you can add the folder again later."
              ] }),
              /* @__PURE__ */ h("div", { className: "lib-row", style: { gap: 6 }, children: [
                /* @__PURE__ */ s("button", { type: "button", className: "lib-btn lib-btn-danger lib-btn-sm", onClick: () => void Y("remove", b.name), children: "Remove" }),
                /* @__PURE__ */ s("button", { type: "button", className: "lib-btn lib-btn-quiet lib-btn-sm", onClick: () => q(null), children: "Cancel" })
              ] })
            ] })
          ] }),
          !O && K !== b.name && /* @__PURE__ */ h("div", { className: "lib-row", style: { gap: 2, flex: "none" }, children: [
            /* @__PURE__ */ h("button", { type: "button", className: "lib-btn lib-btn-quiet lib-btn-sm", disabled: !n.qmd, title: "Re-read changed files and refresh search by meaning", onClick: () => void Y("reindex", b.name), children: [
              /* @__PURE__ */ s($.Refresh, { size: 14 }),
              " Re-index"
            ] }),
            /* @__PURE__ */ s("button", { type: "button", className: "lib-btn lib-btn-quiet lib-btn-icon", disabled: !n.qmd, "aria-label": `Remove ${b.name}`, title: "Remove from Notes Search", onClick: () => q(b.name), children: /* @__PURE__ */ s($.Trash, { size: 14 }) })
          ] })
        ] }, b.name);
      })
    ] }),
    B.length > 0 && /* @__PURE__ */ s("section", { "aria-label": "Recent problems", children: B.map((b) => /* @__PURE__ */ h("div", { className: "lib-alert lib-alert-error", role: "alert", children: [
      /* @__PURE__ */ s($.Alert, { size: 16 }),
      /* @__PURE__ */ h("span", { children: [
        /* @__PURE__ */ h("b", { children: [
          b.kind === "add" ? "Adding" : b.kind === "remove" ? "Removing" : "Re-indexing",
          " “",
          b.collection,
          "” failed"
        ] }),
        b.step ? ` while ${b.step.toLowerCase()}` : "",
        ": ",
        b.message || "qmd exited with an error",
        b.finished_at ? ` · ${Qe(b.finished_at)}` : ""
      ] })
    ] }, b.id)) }),
    /* @__PURE__ */ h("div", { className: "lib-meta-sm lib-folders-foot", children: [
      "QMD doesn’t watch for changes. Re-index after editing notes, or schedule ",
      /* @__PURE__ */ s("code", { children: "qmd update && qmd embed" }),
      " to run on its own. Index: ",
      /* @__PURE__ */ s("code", { children: n.index })
    ] })
  ] });
}
function Pi({ job: t }) {
  return /* @__PURE__ */ h("div", { className: "lib-folder-job", role: "status", children: [
    /* @__PURE__ */ s($.Loader, { size: 13, className: "lib-spin" }),
    /* @__PURE__ */ h("span", { children: [
      t.state === "queued" ? "Waiting…" : `${t.step}…`,
      t.kind === "add" && t.step.startsWith("Building") ? " Keyword search already works. The first run downloads models and can take a few minutes." : ""
    ] }),
    t.message && /* @__PURE__ */ s("span", { className: "lib-ell lib-meta-sm", children: t.message })
  ] });
}
const lr = "notes-search:v1";
function Fl() {
  try {
    const t = window.localStorage.getItem(lr);
    return t ? JSON.parse(t) : {};
  } catch {
    return {};
  }
}
function Gl() {
  const t = Rn(), e = Nr(), n = Nn(Fl, []), [i, r] = D(null), [l, c] = D(""), [o, p] = D(n.collection ?? null), [u, T] = D(n.sort === "recent" ? "recent" : "relevance"), [v, y] = D(0), [_, f] = D([]), [x, A] = D(/* @__PURE__ */ new Map()), [I, L] = D((n.tabs ?? []).map((m) => ({ ...m, preview: !1 }))), [z, K] = D(n.active ?? null), [q, pe] = D(n.leftOpen ?? !0), [ie, ue] = D([]), [Q, k] = D(n.chats ?? []), [N, Y] = D(n.activeChat ?? null), [M, F] = D(n.chatOpen ?? !1), [B, b] = D(null), [O, re] = D(null), te = Ve(null), ce = Ve(/* @__PURE__ */ new Map()), $e = $r(t, l, o, u), Oe = zr(t), Pt = Bi({ query: l, suggest: $e.result, deep: Oe.result, recent: _, sort: u }), j = oe((m, E = "info") => {
    re({ msg: m, kind: E }), window.setTimeout(() => re((R) => R?.msg === m ? null : R), E === "error" ? 6e3 : 2200);
  }, []);
  Ee(() => {
    const m = { tabs: I.filter((E) => !E.preview || X(E) === z), active: z, chats: Q, activeChat: N, chatOpen: M, leftOpen: q, collection: o, sort: u };
    try {
      window.localStorage.setItem(lr, JSON.stringify(m));
    } catch {
    }
  }, [I, z, Q, N, M, q, o, u]);
  const Ie = oe(() => {
    t.get(`${he}/sessions`).then((m) => ue(m.sessions)).catch(() => {
    });
  }, [t]), [Mt, yt] = D(!1), [nn, rn] = D(0), lt = oe(() => {
    t.get(`${he}/status`).then(r).catch((m) => r({ index: "", qmd: null, schema_ok: !1, collections: [], documents: 0, index_updated_at: null, error: Ge(m) }));
  }, [t]), wt = oe(() => {
    lt(), rn((m) => m + 1);
  }, [lt]);
  Ee(() => {
    lt(), Ie();
  }, [lt, Ie]), Ee(() => {
    t.get(`${he}/recent?${We({ c: o, limit: 30 })}`).then((m) => f(m.results)).catch(() => f([]));
  }, [t, o, nn]), Ee(() => {
    Oe.result && Oe.result.query !== l.trim() && Oe.clear();
  }, [l]);
  const De = oe((m, E = {}) => {
    const R = X(m);
    L((Z) => {
      const J = E.words ?? [];
      if (Z.find((ye) => X(ye) === R))
        return Z.map((ye) => X(ye) === R ? { ...ye, preview: ye.preview && !E.pin, words: J, heading: E.heading } : ye);
      const qe = { collection: m.collection, path: m.path, title: m.title, preview: !E.pin, words: J, heading: E.heading }, et = Z.findIndex((ye) => ye.preview);
      if (et >= 0) {
        const ye = [...Z];
        return ye[et] = qe, ye;
      }
      return [...Z, qe];
    }), K(R), yt(!1);
  }, []), Ft = oe(
    (m) => {
      L((E) => {
        const R = E.findIndex((J) => X(J) === m), Z = E.filter((J) => X(J) !== m);
        if (z === m) {
          const J = Z[Math.min(R, Z.length - 1)];
          K(J ? X(J) : null);
        }
        return Z;
      });
    },
    [z]
  ), V = oe((m) => L((E) => E.map((R) => X(R) === m ? { ...R, preview: !1 } : R)), []), ot = oe(
    (m, E, R) => {
      t.get(`${he}/resolve?${We({ t: m, c: R })}`).then((Z) => De(Z, { pin: !0, heading: E || void 0 })).catch(() => j(`No note is titled “${m}” yet`, "error"));
    },
    [t, De, j]
  ), ne = oe(
    (m, E) => {
      if (y(m), E) {
        const R = Pt.flat[m];
        R && De(R.hit, { words: R.words });
      }
    },
    [Pt.flat, De]
  ), Tt = oe((m) => {
    A((E) => {
      const R = new Map(E), Z = X(m);
      return R.has(Z) ? R.delete(Z) : R.set(Z, m), R;
    });
  }, []), ve = oe(
    async (m, E) => {
      F(!0), b("pending");
      try {
        const R = await Ir(t, m, E);
        return k((Z) => [R, ...Z.filter((J) => J.slot_key !== R.slot_key)]), Y(R.slot_key), b(R.slot_key), window.setTimeout(() => b((Z) => Z === R.slot_key ? null : Z), 8e3), Ie(), R;
      } catch (R) {
        return b(null), j(Ge(R), "error"), null;
      }
    },
    [t, j, Ie]
  ), Je = oe(() => {
    const m = [...x.values()].map((E) => ({ collection: E.collection, path: E.path, title: E.title }));
    ve(m, "").then((E) => E && A(/* @__PURE__ */ new Map()));
  }, [x, ve]), Ne = Q.find((m) => m.slot_key === N) ?? null, Pe = oe(
    (m, E) => {
      if (!Ne) return;
      const R = Ne.docs.some((J) => X(J) === X(m)), Z = R ? E.trim() || "Look at this note again." : Dr(m, E);
      if (F(!0), Fi(t, Ne.slot_key, Z).catch((J) => j(Ge(J), "error")), !R) {
        const J = { ...Ne, docs: [...Ne.docs, { collection: m.collection, path: m.path, title: m.title }] };
        k((ge) => ge.map((qe) => qe.slot_key === J.slot_key ? J : qe)), t.post(`${he}/sessions`, J).then(Ie).catch(() => {
        });
      }
    },
    [t, Ne, j, Ie]
  ), st = oe((m) => {
    k((E) => E.some((R) => R.slot_key === m.slot_key) ? E : [m, ...E]), Y(m.slot_key), F(!0);
  }, []), St = oe(
    (m) => {
      k((E) => {
        const R = E.filter((Z) => Z.slot_key !== m);
        return N === m && Y(R[0]?.slot_key ?? null), R;
      });
    },
    [N]
  ), qt = oe(
    (m) => {
      t.del(`${he}/sessions/${encodeURIComponent(m.slot_key)}`).then(Ie).catch(() => {
      });
    },
    [t, Ie]
  );
  Ee(() => {
    const m = (E) => {
      const R = E.target, Z = !!R && (R.tagName === "INPUT" || R.tagName === "TEXTAREA" || R.isContentEditable), J = E.metaKey || E.ctrlKey;
      if (J && E.key.toLowerCase() === "k" || !Z && E.key === "/")
        E.preventDefault(), pe(!0), window.setTimeout(() => {
          te.current?.focus(), te.current?.select();
        }, 0);
      else if (J && E.key.toLowerCase() === "j")
        E.preventDefault(), F((ge) => !ge);
      else if (J && E.key === "\\")
        E.preventDefault(), pe((ge) => !ge);
      else if (!Z && E.altKey && /^[1-9]$/.test(E.key)) {
        const ge = I[Number(E.key) - 1];
        ge && K(X(ge));
      }
    };
    return window.addEventListener("keydown", m), () => window.removeEventListener("keydown", m);
  }, [I]);
  const Me = I.find((m) => X(m) === z) ?? null, Fe = Me ? ie.filter((m) => m.docs.some((E) => X(E) === X(Me))) : [], He = i ? { documents: i.documents, updated: i.index_updated_at, error: i.error } : null;
  return /* @__PURE__ */ h("div", { className: "lib", "data-mode": e?.mode === "light" ? "light" : "dark", "data-testid": "notes-search-root", children: [
    /* @__PURE__ */ s("style", { children: Cr }),
    O && /* @__PURE__ */ s("div", { className: "lib-toast", role: "status", "data-kind": O.kind, children: O.msg }),
    /* @__PURE__ */ h("div", { className: "lib-frame", "data-chat": M ? "open" : "closed", "data-left": q ? "open" : "closed", children: [
      q ? /* @__PURE__ */ s(
        Br,
        {
          ref: te,
          query: l,
          onQuery: c,
          collections: i?.collections ?? [],
          collection: o,
          onCollection: p,
          suggest: $e.result,
          suggestLoading: $e.loading,
          suggestError: $e.error,
          deep: Oe.result,
          deepRunning: Oe.running,
          deepError: Oe.error,
          onDeep: () => Oe.run(l, o),
          recent: _,
          activeKey: z,
          selected: v,
          onSelected: ne,
          onOpen: (m, E) => De(m, E),
          onLink: (m, E) => ot(m, "", E),
          picks: x,
          onTogglePick: Tt,
          onClearPicks: () => A(/* @__PURE__ */ new Map()),
          onChatPicks: Je,
          indexInfo: He,
          sort: u,
          onSort: T
        }
      ) : /* @__PURE__ */ s("div", {}),
      /* @__PURE__ */ h("main", { className: "lib-center", "aria-label": "Reader", children: [
        /* @__PURE__ */ s(
          Ll,
          {
            tabs: I,
            active: z,
            onActivate: K,
            onClose: Ft,
            onPin: V,
            leftOpen: q,
            onToggleLeft: () => pe((m) => !m),
            chatOpen: M,
            chatCount: Q.length,
            onToggleChat: () => F((m) => !m),
            foldersOpen: Mt,
            onToggleFolders: () => yt((m) => !m)
          }
        ),
        Mt ? /* @__PURE__ */ s("div", { className: "lib-scroll", children: /* @__PURE__ */ h("div", { className: "lib-welcome", style: { paddingTop: 48 }, children: [
          /* @__PURE__ */ h("div", { className: "lib-row", style: { gap: 10 }, children: [
            /* @__PURE__ */ s("h2", { className: "lib-grow", children: "Folders" }),
            /* @__PURE__ */ s("button", { type: "button", className: "lib-btn lib-btn-quiet lib-btn-icon", "aria-label": "Close folders", onClick: () => yt(!1), children: /* @__PURE__ */ s($.X, { size: 16 }) })
          ] }),
          /* @__PURE__ */ s("p", { children: "Notes Search looks in every folder listed here. Each one is a QMD collection on this computer." }),
          /* @__PURE__ */ s(ar, { onChanged: wt })
        ] }) }) : Me ? /* @__PURE__ */ s(
          Ol,
          {
            tab: Me,
            onTouch: () => V(X(Me)),
            onOpenLink: ot,
            onOpenHit: (m) => De(m, { pin: !0 }),
            onTag: (m) => {
              pe(!0), c(m), y(0);
            },
            onChat: (m, E) => {
              V(X(m)), ve([{ collection: m.collection, path: m.path, title: m.title }], E);
            },
            onAddToChat: Ne && M ? Pe : null,
            activeChatTitle: Ne ? Ne.title.replace(/^📄\s*/, "") : null,
            sessionsForDoc: Fe.filter((m) => m.slot_key !== N),
            onResumeSession: st,
            notify: j,
            onDocLoaded: (m) => {
              ce.current.set(X(m), m), m.title !== Me.title && L((E) => E.map((R) => X(R) === X(m) ? { ...R, title: m.title } : R));
            }
          },
          X(Me)
        ) : /* @__PURE__ */ s(ql, { status: i, sessions: ie, onResume: st, onSearch: () => te.current?.focus(), recent: _, onOpen: (m) => De(m, { pin: !0 }), onFoldersChanged: wt })
      ] }),
      M ? /* @__PURE__ */ s(
        Il,
        {
          open: Q,
          active: N,
          starting: B,
          sessions: ie,
          currentDocKey: z,
          onActivate: Y,
          onClose: St,
          onCloseDrawer: () => F(!1),
          onResume: st,
          onOpenDoc: (m) => De(m, { pin: !0 }),
          onForget: qt
        }
      ) : /* @__PURE__ */ s("div", {})
    ] })
  ] });
}
function ql(t) {
  const e = (/* @__PURE__ */ new Date()).getHours(), n = e < 12 ? "Good morning" : e < 18 ? "Good afternoon" : "Good evening";
  return t.status && (t.status.collections.length === 0 || /index not found/i.test(t.status.error ?? "")) ? /* @__PURE__ */ s("div", { className: "lib-scroll", children: /* @__PURE__ */ h("div", { className: "lib-welcome", children: [
    /* @__PURE__ */ s("h2", { children: "Point Notes Search at your notes" }),
    /* @__PURE__ */ s("p", { children: "Add a folder of markdown, such as an Obsidian vault or a Reflect graph. Notes Search indexes it with QMD on this computer, then you can search it, read notes and chat about them. Nothing leaves your machine until you start a chat." }),
    /* @__PURE__ */ s("div", { className: "lib-welcome-folders", children: /* @__PURE__ */ s(ar, { onChanged: t.onFoldersChanged, firstRun: !0 }) })
  ] }) }) : /* @__PURE__ */ s("div", { className: "lib-scroll", children: /* @__PURE__ */ h("div", { className: "lib-welcome", children: [
    /* @__PURE__ */ h("h2", { children: [
      n,
      ". What are you looking for?"
    ] }),
    /* @__PURE__ */ s("p", { children: "Type anything into search and matching passages appear as you go. Open a note to read it, then chat about it, or select several results and talk about them together." }),
    t.status && !t.status.error && /* @__PURE__ */ h("div", { className: "lib-stats", children: [
      /* @__PURE__ */ h("div", { className: "lib-stat", children: [
        /* @__PURE__ */ s("b", { children: t.status.documents.toLocaleString() }),
        /* @__PURE__ */ s("span", { children: "notes indexed" })
      ] }),
      /* @__PURE__ */ h("div", { className: "lib-stat", children: [
        /* @__PURE__ */ s("b", { children: t.status.collections.length }),
        /* @__PURE__ */ h("span", { children: [
          "collection",
          t.status.collections.length === 1 ? "" : "s"
        ] })
      ] }),
      /* @__PURE__ */ h("div", { className: "lib-stat", children: [
        /* @__PURE__ */ s("b", { children: t.sessions.length }),
        /* @__PURE__ */ s("span", { children: "note chats" })
      ] })
    ] }),
    /* @__PURE__ */ h("div", { className: "lib-keys", "aria-label": "Keyboard shortcuts", children: [
      /* @__PURE__ */ h("span", { children: [
        /* @__PURE__ */ s("span", { className: "lib-kbd", children: "/" }),
        /* @__PURE__ */ h("span", { className: "lib-kbd", children: [
          xt,
          "K"
        ] })
      ] }),
      /* @__PURE__ */ s("span", { children: "Search" }),
      /* @__PURE__ */ h("span", { children: [
        /* @__PURE__ */ s("span", { className: "lib-kbd", children: "↑" }),
        /* @__PURE__ */ s("span", { className: "lib-kbd", children: "↓" })
      ] }),
      /* @__PURE__ */ s("span", { children: "Preview results in the reader" }),
      /* @__PURE__ */ s("span", { children: /* @__PURE__ */ s("span", { className: "lib-kbd", children: "↵" }) }),
      /* @__PURE__ */ s("span", { children: "Open the highlighted note" }),
      /* @__PURE__ */ s("span", { children: /* @__PURE__ */ h("span", { className: "lib-kbd", children: [
        xt,
        "↵"
      ] }) }),
      /* @__PURE__ */ s("span", { children: "Search by meaning (hybrid QMD query)" }),
      /* @__PURE__ */ s("span", { children: /* @__PURE__ */ s("span", { className: "lib-kbd", children: "⇧↵" }) }),
      /* @__PURE__ */ s("span", { children: "Select a result to chat about several notes" }),
      /* @__PURE__ */ s("span", { children: /* @__PURE__ */ h("span", { className: "lib-kbd", children: [
        xt,
        "J"
      ] }) }),
      /* @__PURE__ */ s("span", { children: "Show or hide chats" })
    ] }),
    /* @__PURE__ */ h("div", { className: "lib-row", style: { gap: 8, marginTop: 8 }, children: [
      /* @__PURE__ */ h("button", { type: "button", className: "lib-btn lib-btn-primary", onClick: t.onSearch, children: [
        /* @__PURE__ */ s($.Search, { size: 15 }),
        " Start searching"
      ] }),
      t.recent[0] && /* @__PURE__ */ h("button", { type: "button", className: "lib-btn lib-btn-secondary", onClick: () => t.onOpen(t.recent[0]), children: [
        /* @__PURE__ */ s($.Clock, { size: 15 }),
        " Open “",
        t.recent[0].title.slice(0, 40),
        "”"
      ] })
    ] }),
    t.sessions.length > 0 && /* @__PURE__ */ h("div", { style: { marginTop: 18 }, children: [
      /* @__PURE__ */ s("div", { className: "lib-section", style: { paddingLeft: 0 }, children: "Recent chats" }),
      t.sessions.slice(0, 5).map((i) => /* @__PURE__ */ h("button", { type: "button", className: "lib-convo", onClick: () => t.onResume(i), children: [
        /* @__PURE__ */ s("b", { children: i.title.replace(/^📄\s*/, "") }),
        /* @__PURE__ */ s("span", { className: "lib-meta-sm", children: Qe(i.created_at) })
      ] }, i.slot_key))
    ] })
  ] }) });
}
export {
  Gl as default
};
