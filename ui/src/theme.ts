/**
 * The look of Notes Search: the Crew dashboard's own theme.
 *
 * The page paints only in the host's theme tokens (--bg, --card, --text,
 * --accent, ...), so it follows whichever Crew theme is active, light or dark,
 * default or Nord or Dracula, with no palette of its own to drift out of step.
 * The names below that the host does not define are derived from host tokens
 * in one block on `.lib`. Names the host already defines (--bg, --text,
 * --muted, --accent, --danger, the shadows) are deliberately NOT redeclared:
 * `--bg: var(--bg)` would be a cycle, so they are simply inherited.
 *
 * Every rule is scoped under `.lib`, so nothing here can repaint the rest of
 * the dashboard. The host compiles Tailwind from its own sources, so a utility
 * class this page invents would not exist; the page styles itself here instead.
 *
 * `CONTRAST_PAIRS` records the derived pairs as they resolve in the default
 * Crew theme, checked by `tests/test_contrast.py`, which reads this file.
 * Other themes are the host's to keep legible.
 */

/** (foreground, background, minimum ratio, what it is). Read by the contrast test. */
export const CONTRAST_PAIRS: ReadonlyArray<readonly [string, string, number, string]> = [
  // default Crew light theme
  ['#3f3f46', '#fafafa', 4.5, 'light: body on ground'],
  ['#3f3f46', '#ffffff', 4.5, 'light: body on card'],
  ['#3f3f46', '#f0f0f0', 4.5, 'light: body on hover / code'],
  ['#6d6d75', '#fafafa', 4.5, 'light: muted on ground'],
  ['#6d6d75', '#ffffff', 4.5, 'light: muted on card'],
  ['#047558', '#fafafa', 4.5, 'light: accent text on ground'],
  ['#047558', '#ffffff', 4.5, 'light: accent text on card'],
  ['#047558', '#f0f0f0', 4.5, 'light: accent link on hover'],
  ['#ffffff', '#047558', 4.5, 'light: primary label on fill'],
  ['#18181b', '#e1cfb6', 4.5, 'light: ==highlight=='],
  ['#dc2626', '#fafafa', 3, 'light: danger callout bar'],
  ['#ffffff', '#dc2626', 4.5, 'light: Remove button label'],
  // default Crew dark theme
  ['#e4e4e7', '#12141a', 4.5, 'dark: body on ground'],
  ['#e4e4e7', '#181b22', 4.5, 'dark: body on card'],
  ['#e4e4e7', '#262a35', 4.5, 'dark: body on hover / code'],
  ['#909098', '#12141a', 4.5, 'dark: muted on ground'],
  ['#909098', '#1a1d25', 4.5, 'dark: muted on elevated'],
  ['#00d492', '#12141a', 4.5, 'dark: accent text on ground'],
  ['#00d492', '#181b22', 4.5, 'dark: accent text on card'],
  ['#00d492', '#262a35', 4.5, 'dark: accent link on hover'],
  ['#000000', '#00d492', 4.5, 'dark: primary label on fill'],
  ['#fafafa', '#4e4115', 4.5, 'dark: ==highlight=='],
  ['#ef4444', '#12141a', 3, 'dark: danger callout bar'],
  ['#000000', '#ef4444', 4.5, 'dark: Remove button label'],
]

export const LIBRARY_CSS = `
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
  background: var(--bg);
  overflow: hidden;
}
.lib-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 16px 12px;
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
  margin: 2px 16px 10px;
  position: relative;
}
.lib-search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 38px;
  padding: 0 6px 0 11px;
  border-radius: 10px;
  background: var(--card);
  border: 1px solid var(--border);
  transition: border-color .15s, box-shadow .15s;
}
.lib-search-box:hover { border-color: var(--border-hover); }
.lib-search-box:focus-within { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-subtle); }
.lib-search-box svg { color: var(--muted); flex: none; }
.lib-search-box input {
  flex: 1;
  min-width: 0;
  border: 0;
  background: transparent;
  color: var(--text);
  caret-color: var(--accent-text);
  font: inherit;
  font-size: 14px;
  font-weight: 400;
  padding: 8px 0;
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
  padding: 0 16px 8px;
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
  width: 14px;
  height: 14px;
  border-radius: 3px;
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
.lib-hit[aria-selected="true"] .lib-check:not([aria-checked="true"]) { opacity: .55; }
.lib-check[aria-checked="true"] { background: var(--accent); border-color: var(--accent); color: var(--accent-fg); opacity: 1; }
.lib-hit:has(.lib-check) .lib-hit-title { padding-right: 20px; }
.lib-tray-hint { display: block; font-weight: 500; font-size: 11.5px; opacity: .7; }

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
.lib-tabs > .lib-btn-icon[aria-pressed] { background: transparent; color: var(--muted); }
.lib-tabs > .lib-btn-icon[aria-pressed]:hover { background: var(--hover); color: var(--text); }
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
  background: var(--bg);
  position: relative;
}
.lib-center > .lib-scroll {
  background: var(--card);
  border-radius: var(--r-md);
  margin: 0 10px 10px 0;
  box-shadow: var(--shadow-sm);
}
.lib-frame[data-left="closed"] .lib-center > .lib-scroll { margin-left: 10px; }
.lib-tabs {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  padding: 10px 10px 0;
  background: var(--bg);
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
.lib-tabs-end { margin-left: auto; display: flex; gap: 2px; align-items: center; padding: 0 4px 6px 0; flex: none; }

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
.lib-empty-reader {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 40px 24px;
  text-align: center;
  color: var(--muted);
}
.lib-empty-reader > svg { color: var(--faint); margin-bottom: 4px; }
.lib-empty-reader b { color: var(--text); font-size: 15px; font-weight: 650; }
.lib-empty-reader p { margin: 0; font-size: 13.5px; max-width: 340px; line-height: 1.55; }
.lib-keyline { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px 16px; font-size: 12px; color: var(--muted); margin-top: 10px; }
.lib-keyline .lib-kbd { margin-right: 4px; }
.lib-empty-chats { margin-top: 18px; width: min(360px, 100%); text-align: left; }
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
`
