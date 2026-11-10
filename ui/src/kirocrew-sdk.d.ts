/**
 * Ambient declarations for the slice of the HOST modules this page uses.
 *
 * The packages are provided at runtime through the dashboard's import map and
 * are deliberately not installed. Every name declared here was checked against
 * the live `/vendor/kirocrew-app-sdk.mjs` stub, whose `export const { ... }`
 * list is the real surface: naming anything outside it is a module-link failure
 * that blanks the page before a single component renders.
 */

declare module '@kirocrew/app-sdk' {
  import type * as React from 'react'

  export interface AppApi {
    get<T = unknown>(path: string, init?: RequestInit): Promise<T>
    post<T = unknown>(path: string, body?: unknown): Promise<T>
    patch<T = unknown>(path: string, body?: unknown): Promise<T>
    del<T = unknown>(path: string): Promise<T>
  }

  export interface AppTheme {
    mode: 'dark' | 'light'
    accent: string
    colorTheme: string
  }

  export function useAppApi(): AppApi
  export function useTheme(): AppTheme
  export function useNavigate(): (path: string) => void
  export function useNavBadge(): (count: number) => void

  export interface ChatEmbedProps {
    slotKey: string
    agent?: string
    placeholder?: string
    frameless?: boolean
    startAtBottom?: boolean
  }
  export const ChatEmbed: React.ComponentType<ChatEmbedProps>
}

declare module 'lucide-react' {
  import type * as React from 'react'

  export type LucideIcon = React.ComponentType<{
    size?: number | string
    strokeWidth?: number | string
    className?: string
    'aria-hidden'?: boolean | 'true' | 'false'
  }>

  /**
   * DEFAULT EXPORT ONLY. The host stub named-exports ~41 icons and proxies the
   * rest through the default export; importing a named icon outside that list
   * fails at link time and takes down the whole page.
   */
  const icons: Record<string, LucideIcon | undefined>
  export default icons
}
