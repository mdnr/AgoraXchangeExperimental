# Lumière — Product Plan (LumireXchangeExperimental)

> Status: planning / experiments. The GitHub Page exists for **public viewing** only. Real product work happens in code next.

## Vision

A multi-role marketplace built around 3D product visualization. Sellers publish products with interactive 3D models; visitors browse, rotate models, and (later) buy.

## Roles

- **Visitor (public)** — browse catalogue, view 3D models, no account
- **User** — same as visitor plus account features later (saved items, orders)
- **Seller** — can add/edit products, upload 3D models, and edit the 3D material properties

## MVP Features (not built yet)

- Authentication and role model (visitor / user / seller)
- Seller dashboard: add, edit, remove products; upload GLB/glTF 3D models
- **Material editor on the 3D model**:
  - Surface: texture image OR plain colour
  - Finish: chrome or matte
  - Sliders for the finish / material properties (basic set for now)

## Future Features (do NOT implement yet — keep architecture extensible)

- 360° virtual store tour
- Interactive showroom
- Clickable products inside the showroom
- Product configurator
- AR product visualization
- Product CMS
- Admin dashboard
- E-commerce integration
- CDN asset management
- Analytics

The future 360° showroom must connect to the **same product system** as everything else.

## Architecture Notes / Decisions

- GitHub Pages only serves a **static export** — seller uploads and persistence need a backend + database. Deferred until MVP design; do not build on Pages.
- `src/data/products.ts` is the single source of truth for products, so the showroom, configurator, and AR can all reuse it.
- Current `ProductGallery` "upload your own model" demo is **in-browser only** (no persistence) — it validates the viewer path, not storage.
- Deploy base path is hard-coded to `/LumireXchangeExperimental` (workflow env var + README link).

## Experiment Status (done so far)

- Static export + GitHub Pages deploy working (public repo: `mdnr/LumireXchangeExperimental`)
- Gallery viewer: thumbnails, "View in 3D", back button, in-browser model upload
- Contrast / dark-mode fixes, mobile overflow fixes
- Repo is public; no secrets or `.env` committed

## Privacy Audit (2026-09-01)

Nothing sensitive (no passwords, keys, or tokens). Two personal-information items exist; **decision: leave as-is for now, revisit later**:

- **Git commit email** — all commits authored by `mdnr <aiman.scolex@gmail.com>`, visible to anyone opening a commit on GitHub. If we ever want to hide it: rewrite git history (author + committer) and force-push, plus switch git config to a `noreply` address going forward.
- **Windows username in scripts** — `C:\Users\aiman\AppData\Local\Temp\opencode\...` hard-coded in `scripts/verify-browser.cjs`, `verify-centering.cjs`, `verify-upload.cjs`. If we later clean up: replace with `path.join(os.tmpdir(), ...)` (also makes scripts portable to Mac/Linux).