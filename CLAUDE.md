# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Layout

The actual app lives in `fairy-shop/`. The repo root also holds `images/` (build SVGs and gallery source) and `other/` (standalone HTML reference docs and reference images, not part of the app build). Run all commands below from `fairy-shop/`.

## Common Commands

```bash
npm run dev              # Vite dev server at localhost:5173 (base "/")
npm run build            # Production build (base "/fairy/" for GitHub Pages)
npm run lint             # ESLint over the project
npm run preview          # Preview production build
npm run update-gallery   # Regenerate src/galleryManifest.json from public/gallery/
npm run deploy           # Build + publish dist/ via gh-pages
```

There is no test runner configured.

## Architecture

### Routing & shell
[src/App.jsx](fairy-shop/src/App.jsx) is the single shell. It uses `react-router-dom` with a hardcoded `pathToTab` / `tabToPath` map (`/`, `/shop`, `/links`, `/gallery`, `/build`) — when adding a route you must update **both** maps and the `<Routes>` block, or `activeTab` will fall back to `home`. Page transitions are wrapped in `framer-motion`'s `AnimatePresence` keyed by `location.pathname`.

The build page renders `BuildYourOwnV2` (not `BuildYourOwn` — V1 is kept around but unrouted). The build page suppresses `CursorSparkles` and is the only page that mounts `MobileNavigationMenu`.

### Theming
[src/themes.js](fairy-shop/src/themes.js) exports a `themes` object plus an `applyTheme` helper that writes CSS custom properties to `:root`. Components consume theme values both via the `currentTheme` prop (passed down from `App`) and via the CSS variables (used by Tailwind classes / inline `var(--...)` styles). Adding a new theme requires keeping the same color/font/emoji/decorations shape so `applyTheme` doesn't leave stale variables.

The accessible-fonts toggle adds a `accessible-fonts` class on `<body>` and persists to `localStorage`; theme choice itself is **not** persisted.

### Asset paths (GitHub Pages base path)
[vite.config.js](fairy-shop/vite.config.js) sets `base: '/fairy/'` in production. **Always** route public-folder asset URLs through `getAssetPath()` from [src/utils/assetPath.js](fairy-shop/src/utils/assetPath.js) — it prepends `import.meta.env.BASE_URL`. Hardcoding `/foo.png` will 404 on the deployed site. This applies to every SVG/image/audio path referenced from JS (the build page references hundreds of SVGs this way).

[index.html](fairy-shop/index.html) contains a GitHub Pages SPA redirect shim that rewrites `?/path` query strings back into real paths — paired with `public/404.html` it lets deep links work on GitHub Pages.

### Gallery manifest pipeline
Gallery images are dropped into `public/gallery/<category>/` (categories listed in [scripts/generateGalleryManifest.js](fairy-shop/scripts/generateGalleryManifest.js)). Running `npm run update-gallery` scans those folders and writes `src/galleryManifest.json`, which `Gallery.jsx` imports at build time. After adding/removing images you must re-run the script and commit the regenerated manifest — the app does not read the filesystem at runtime.

Sort order in the manifest: files starting with `preview` come first; `traditional works` sorts by filename desc; everything else sorts by mtime desc.

Note the category-name mismatch: [src/galleryData.js](fairy-shop/src/galleryData.js) declares folder `cards & sketches` but the script and actual folder use `cards-and-sketches`. If you touch gallery code, double-check which is authoritative for the path you're rendering.

### Build-Your-Own designer
[src/pages/BuildYourOwnV2.jsx](fairy-shop/src/pages/BuildYourOwnV2.jsx) (~3k lines) is the plushie designer. It uses `react-konva` (`Stage` / `Layer` / `KonvaImage` / `Transformer`) with SVG body+part assets loaded from `public/build-svgs/` via `useImage`. Mobile UI is split out under [src/components/mobile/](fairy-shop/src/components/mobile/) (bottom sheet + per-tab content). Convention for part assets: previews use the v1 SVG, canvas uses the `*2.svg` variant — don't unify these without checking which the part picker vs. the canvas expects.

### Analytics
GA4 is loaded inline in `index.html`; [src/utils/analytics.js](fairy-shop/src/utils/analytics.js) wraps `gtag` with `trackEvent`/`trackPageView`/`trackTiming` (no-ops if `gtag` is missing). `App.jsx` already tracks page views, page time, and session duration — don't re-instrument those.

## Conventions

- React 19 + Vite 7. JSX-only (no TypeScript), ESM modules.
- Tailwind v3 with `@tailwindcss/forms`; theme colors are CSS variables, not Tailwind theme extensions.
- Pages and components are named exports — `import { Home } from './pages/Home'`, not default.
- Page components receive `currentTheme` as a prop; consume theme values from there or from CSS variables.

## Workflow

The repo-level `.claude/CLAUDE.md` (one directory up) defines the design-and-build subagent loop (`code-reviewer` → `qa` → fix → ship). It applies here too.

## Other notes
- Always ask the user clarifying questions when needed or helpful
- Agent instructions (subagents, design/build workflow) are in the parent `.claude/CLAUDE.md` — not repeated here
