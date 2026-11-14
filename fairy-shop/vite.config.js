import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dev-only visual editor. The import fails on CI and other machines, which skips the plugin.
const fairyPolish = await import('file:///C:/Users/ashle/Documents/GitHub/fairy-polish/vite-plugin/index.js').then((m) => m.default).catch(() => null)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), fairyPolish?.()],
  base: process.env.NODE_ENV === 'production' ? '/fairy/' : '/',
})
