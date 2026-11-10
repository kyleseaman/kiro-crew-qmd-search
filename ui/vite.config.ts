import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Notes Search build: one ESM file the dashboard imports at
 * `/apps/notes-search/ui/dist/index.mjs`.
 *
 * Everything in `external` comes from the HOST import map. Bundling any of them
 * would give the page its own React, and the host SDK's hooks would throw.
 * marked and DOMPurify are not host modules, so they are bundled.
 */
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/App.tsx',
      formats: ['es'],
      fileName: () => 'index.mjs',
    },
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2022',
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react-dom/client',
        'react/jsx-runtime',
        '@kirocrew/app-sdk',
        '@kirocrew/app-sdk/ui',
        'lucide-react',
        '@tanstack/react-query',
      ],
    },
  },
})
