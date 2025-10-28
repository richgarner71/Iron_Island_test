# IRON ISLAND — Mech Squad RPG (Next.js + Tailwind, Static Export)

Turn-based, party-based mobile RPG prototype built with Next.js (App Router) and Tailwind CSS. Features:
- 30-robot roster across Servites, Vectorons, Tekks
- 5 size/energy/power classes
- Squad selection (4 units), team overview with stat bars
- Orbital map mission selection
- Battle screen with target-selection flow and attack animations
- Visual equipment screen with drag-and-drop slots
- Pure JavaScript (no TypeScript)

## Local Development

Prereqs:
- Node.js 22.x
- npm

Install and run:
```bash
npm ci
npm run dev
```

Open http://localhost:3000

## Build (Static Export)
This app is configured for static export for GitHub Pages:

```bash
Copy
npm run build
```
Output will be in out/.

## Deploy to GitHub Pages
This repo includes a GitHub Actions workflow that builds and deploys on push to main.

### Steps:

Push your code to GitHub (branch main).
- In GitHub: Settings → Pages → Source → GitHub Actions.
- Wait for the Deploy to GitHub Pages workflow to finish.
- Your site will be available at:
- Repo page: https://<username>.github.io/<repo>/
Or, if the repo is username.github.io: https://<username>.github.io/
Notes:

The next.config.mjs uses output: 'export', trailingSlash: true, and sets basePath/assetPrefix when building in CI to match the repo path.
If you deploy to a user site repo named username.github.io, you should remove basePath and assetPrefix or ensure they are empty (the included config auto-sets them empty for local dev and sets from repo name in CI).

## Project Scripts
npm run dev: Start local dev server on port 3000.
npm run build: Build Next.js and export static site to out/.
npm start: Run Next.js server (not used for Pages).

## Tech Stack
Next.js 14 (App Router), React 18
Tailwind CSS
NO TypeScript
Structure
src/
  app/
    layout.js
    page.js
    globals.css
  components/
    ... (UI pieces inside page.js for now)
next.config.mjs
tailwind.config.js
postcss.config.mjs
License
MIT 
