# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:5173
npm run build    # Build to dist/ — output is static, open dist/index.html with file://
npm run preview  # Preview built output
npm run optimize # Run image optimization (scripts/optimize-images.mjs)
```

## Tech Stack

- **Vite 7** + **React 19** with HashRouter (supports file:// in production)
- **react-router-dom v7** for routing
- Single `src/styles.css` (no CSS modules, no Tailwind)
- No state management library — all state is local or derived from data files
- Images: `.avif` prioritized, `.jpg`/`.webp` fallback

## Architecture

### Data Layer (content-first, drives the app)

Content is split into **individual record files** per entity, aggregated via `index.js`:

```
src/data/
├── corner-records/     # One .js file per corner (17 total)
│   ├── karussell.js    # { order, slug, name, chineseName, origin, history,
│   ├── flugplatz.js    #   story, driving, fame, tags, dangerLevel, difficulty }
│   └── index.js        # Aggregated array
├── brand-records/      # One .js file per brand (9 total)
│   ├── porsche.js      # { name, slug, story, technology, relationship,
│   ├── bmw.js          #   modelStories: [{ model, slug, type, hook, story, tags }] }
│   └── index.js
├── model-records/      # One .js per model — lazy-loaded via import.meta.glob
│   ├── porsche-911-gt3-rs.js  # { brandSlug, slug, name, stats, storySections,
│   └── ...                     #   systems, techDeck, timeline, sources }
├── corners.js          # Aggregation entry: merges records + photo library + auto-creates media/resources
├── brands.js           # Aggregation entry: adds default resources to brand records
├── models.js           # Lazy loader: getModelByBrandAndSlug(brandSlug, modelSlug)
└── lap-times.js        # Static lap time data
```

**Content pattern**: Individual records in `*-records/` dirs hold raw content. The aggregation files (`corners.js`, `brands.js`) add computed fields (media captions, default resources, readingFocus). The content guide in `CONTENT_GUIDE.md` documents the field schemas and writing conventions in detail.

### Routes (App.jsx — lazy-loaded pages)

| Route | Page | Purpose |
|---|---|---|
| `/` | HomePage | Hero + featured corners + brand preview |
| `/corners` | CornersPage | Corner list with search |
| `/corners/:slug` | CornerDetailPage | Single corner detail (story, driving, media) |
| `/brands` | BrandsPage | Brand overview grid |
| `/brands/:slug` | BrandDetailPage | Brand story + model cards |
| `/brands/:brandSlug/:modelSlug` | ModelDetailPage | Model in-depth (stats, storySections, systems, timeline) |
| `/lap-times` | LapTimesPage | Lap time table |

### Components

- **TrackMap** (`src/components/TrackMap.jsx`, ~450 lines) — Interactive SVG Nordschleife map with animated dash-path overlay
- **Header** — Nav + scroll-aware styling
- **Footer** — Site footer with links
- **CornerCard** — Card for corner list/grid
- **OptimizedImage** — Image component handling avif/jpg with object-position
- **ReadingProgress** / **TopLoadingBar** — Scroll progress + route transition loading bar
- **ResourceShelf** — External resources display (photos, videos, articles, sources)
- **SectionHeader** — Section title helper

### Custom Hooks

- `useScrollReveal` — IntersectionObserver-based reveal animations
- `useParallax` — Mouse-position parallax
- `useTilt3D` — 3D tilt on mouse hover
- `useMagnetic` — Magnetic button effect
- `useDocumentTitle` — Set document title per page

### Styling

All styles in `src/styles.css` — no CSS-in-JS, no modules, no Tailwind. Responsive, dark-themed layout.

### Deployment

- Hosted on Netlify (`netlify.toml`)
- Also deployed via Vercel (`.vercel/`)
- Built output (`dist/`) is fully static — can open `dist/index.html` directly via `file://` due to `base: './'` in Vite config and HashRouter

## Content Workflow

1. Add a record file to `src/data/*-records/` (copy existing file as template)
2. Register it in the corresponding `index.js`
3. If adding photos, add entry to the photo library in `corners.js`
4. If adding a model, the lazy-loader in `models.js` auto-discovers it by filename convention

**When filling real content**: Focus on data files, not page components. See `CONTENT_GUIDE.md` for field definitions and writing guidelines.