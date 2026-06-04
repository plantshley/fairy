# AGENTS.md

## Repository Structure
- App code: `fairy-shop/`
- Other assets: `images/`, `other/` (not in app build)
- Run all commands from `fairy-shop/`

## Core Commands
```bash
npm run dev              # Vite dev server at localhost:5173
npm run build            # Production build (GitHub Pages base "/fairy/")
npm run lint             # ESLint over the project
npm run preview          # Preview production build
npm run update-gallery    # Regenerate src/galleryManifest.json
npm run deploy           # Build + publish via gh-pages
```

## Key Implementation Patterns
- React 19 + Vite 7. JSX-only (no TypeScript), ESM modules
- Tailwind v3 with `@tailwindcss/forms`
- Pages/components use named exports: `import { Home } from './pages/Home'`
- No tests configured

## Routing & Shell
[src/App.jsx](fairy-shop/src/App.jsx) is the single shell. It uses `react-router-dom` with a hardcoded `pathToTab` / `tabToPath` map (`/`, `/shop`, `/links`, `/gallery`, `/build`) — when adding a route, update **both** maps and the `<Routes>` block, or `activeTab` will fall back to `home`. Page transitions use `framer-motion`'s `AnimatePresence` keyed by `location.pathname`.

## Theming System
Themes defined in [src/themes.js](fairy-shop/src/themes.js). Adding new themes requires:
1. Keeping the same color/font/emoji/decorations shape
2. Using `applyTheme` to write CSS custom properties to `:root`
3. Components consume theme values via `currentTheme` prop and CSS variables

## Asset Paths
Always route public-folder asset URLs through `getAssetPath()` from [src/utils/assetPath.js](fairy-shop/src/utils/assetPath.js) — it prepends `import.meta.env.BASE_URL`. Hardcoding paths will 404 on deployed site.

## Gallery System
Gallery images in `public/gallery/<category>/`. Run `npm run update-gallery` after adding/removing images to regenerate [src/galleryManifest.json](fairy-shop/src/galleryManifest.json), which is imported at build time. Script at [scripts/generateGalleryManifest.js](fairy-shop/scripts/generateGalleryManifest.js) scans folders and writes manifest.

## Build-Your-Own Designer
[src/pages/BuildYourOwnV2.jsx](fairy-shop/src/pages/BuildYourOwnV2.jsx) (~3k lines) is the plushie designer. Uses `react-konva` with SVG assets from `public/build-svgs/` via `useImage`. Mobile UI split under [src/components/mobile/](fairy-shop/src/components/mobile/).

## Analytics
GA4 inlined in `index.html`. [src/utils/analytics.js](fairy-shop/src/utils/analytics.js) wraps `gtag` with `trackEvent`/`trackPageView`/`trackTiming` (no-ops if `gtag` missing). `App.jsx` tracks page views, time, session duration.

## Conventions
- Pages and components are named exports
- Page components receive `currentTheme` as a prop
- Consume theme values from both the `currentTheme` prop and CSS variables