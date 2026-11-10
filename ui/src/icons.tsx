import lucide, { type LucideIcon } from 'lucide-react'

/**
 * Icons resolved off the host's lucide default export, never by named import
 * (see `kirocrew-sdk.d.ts`). A name the host catalog lacks renders as an empty
 * box of the right size rather than handing React `undefined`.
 */
function pick(name: string): LucideIcon {
  const found = lucide[name]
  if (found) return found
  const Missing: LucideIcon = ({ size = 16 }) => (
    <span aria-hidden="true" data-missing-icon={name} style={{ display: 'inline-block', width: size, height: size }} />
  )
  return Missing
}

export const I = {
  Search: pick('Search'),
  Brand: pick('Search'),
  File: pick('FileText'),
  Calendar: pick('CalendarDays'),
  Sparkles: pick('Sparkles'),
  Chat: pick('MessageSquare'),
  ChatPlus: pick('MessageSquarePlus'),
  X: pick('X'),
  Check: pick('Check'),
  Chevron: pick('ChevronRight'),
  ChevronUp: pick('ChevronUp'),
  ChevronDown: pick('ChevronDown'),
  ArrowUp: pick('ArrowUp'),
  External: pick('ExternalLink'),
  Copy: pick('Copy'),
  Link: pick('Link2'),
  Clock: pick('Clock'),
  Lock: pick('Lock'),
  Alert: pick('AlertTriangle'),
  Loader: pick('Loader2'),
  PanelLeft: pick('PanelLeft'),
  PanelRight: pick('PanelRight'),
  Plus: pick('Plus'),
  ListTree: pick('ListTree'),
  Brain: pick('Brain'),
  Hash: pick('Hash'),
  Refresh: pick('RefreshCw'),
  Folder: pick('Folder'),
  Back: pick('ArrowLeft'),
  FolderPlus: pick('FolderPlus'),
  Folders: pick('FolderTree'),
  Trash: pick('Trash2'),
  Terminal: pick('Terminal'),
}
