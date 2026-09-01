# Lumière — 3D Product Visualization Website

> **Live site:** <https://mdnr.github.io/AgoraXchangeExperimental/>

A premium, modern web-based 3D product visualization website built with **Next.js 16 (App Router)**, **React Three Fiber**, and **Tailwind CSS v4**.

## Features

- **Home page** — product-focused hero, featured catalogue, collection grid, CTA
- **Product catalogue** — category filters + price sorting (empty state handled)
- **Product detail page** — specs, features, variants, image gallery, related products
- **Interactive 3D viewer** — reusable `ProductViewer` component that loads any GLB/glTF:
  - Rotate (drag), Zoom (scroll), Pan (right-drag)
  - Reset view button
  - Loading state ("Loading 3D model…")
  - Error state ("Couldn't load the 3D model") with retry
  - Auto-rotate, contact shadows, environment lighting
- **Responsive** desktop/mobile layout, smooth CSS/Framer animations
- **Sample data** — 4 realistic products with 4 procedural GLB models

## Stack

- Next.js 16 + TypeScript (strict) + App Router
- React 19 + React Three Fiber + drei
- Three.js (r185) with GLTF/GLB loader
- Tailwind CSS v4

## Code layout

```
src/
├── app/                      # Next.js routes (home, catalogue, products/[slug])
│   ├── page.tsx              # Home page
│   ├── catalogue/page.tsx    # Catalogue with filters/sorting
│   └── products/[slug]/page.tsx  # Product detail with 3D viewer
├── components/
│   ├── three/
│   │   ├── ProductViewer.tsx      # Reusable 3D viewer (canvas/controls/states)
│   │   ├── ProductModel.tsx       # GLB loading, normalization, Draco ready
│   │   ├── ViewerLoading.tsx      # Loading overlay
│   │   └── ViewerControls.tsx     # Reset view / hint UI
│   ├── layout/               # Header, Footer
│   └── ui/                   # ProductCard, SortSelect, ProductVariantPicker
├── data/
│   └── products.ts           # Product types + sample data (single source of truth)
└── lib/
    └── modelConfig.ts        # 3D config: quality profiles, Draco, model URL resolver
```

## 3D architecture & future-ready structure

The 3D implementation is deliberately separable so these are easy to add later:

- **Draco/KTX2 compression** — `modelQualityProfiles` in `src/lib/modelConfig.ts` already define per-quality loader setups; `useGLTF`'s Draco param is wired in `ProductModel`.
- **Lazy loading / prefetch** — `preloadModel()` helper is ready; the viewer only mounts its `Canvas` when the page needs it.
- **CDN-hosted models** — `resolveModelUrl()` in `modelConfig.ts` is the single choke point to prefix a CDN.
- **Multiple quality levels** — `ProductViewer` accepts a `quality` prop (high/medium/low).
- **360° showroom, hotspots, AR, configurator, CMS/e-commerce** — product data is normalized in `products.ts` (variants, specs, features, pricing) and the viewer exposes `onLoad/onError/reset` that these features can hook into.

## Development

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run lint       # eslint
```

Regenerate the placeholder GLB models:

```bash
node scripts/generate-models.cjs
```

Browser-verify the 3D viewer (requires a local Edge/Chrome and `puppeteer-core`):

```bash
node scripts/verify-browser.cjs
```

## Notes

- Models are procedurally generated placeholders (`public/models/*.glb`); drop in real GLB/glTF files and update `model3d` in `src/data/products.ts`.
- No C# code is present in this project — it is a TypeScript/Next.js application.