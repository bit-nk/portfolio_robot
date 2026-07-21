# Portfolio (portfolio_robot)

Single-page developer portfolio for Nirvik KC. Deployed to **GitHub Pages** at
`/portfolio_robot/`. Dark cyberpunk / terminal-HUD aesthetic built around a 3D
Spline robot. Pure **JSX (no TypeScript)**.

## Stack
Vite 6 · React 18 · @react-three/fiber + drei + three r170 · @splinetool/react-spline.

## Run
- `npm run dev` — Vite dev server (port 5173, base path `/portfolio_robot/`, so open `/portfolio_robot/`).
- `npm run build` / `npm run preview`.
- Deploy: push to `main` → `.github/workflows/deploy.yml` builds and publishes to Pages.

## Architecture
- `src/App.jsx` — mounts the R3F `<Canvas>`, the Spline layer, the DOM HUD overlay, and an ErrorBoundary. Holds `openSection` state; a window click on the canvas (or Escape) closes the open section.
- `src/components/SplineRobot.jsx` — full-screen Spline scene, **lazy-loaded** to keep the ~2 MB runtime out of the entry chunk. Forwards pointer events to the layers beneath it.
- `src/components/canvas/` — `Scene` (lights + composition), `CameraRig` (damped camera that reframes per open section), `Particles`.
- `src/components/sections/` — Intro + the four nav sections. Experience/Education/Skills are card sliders; **all three share `src/hooks/useCardSlider.js`** (wheel / drag / swipe / ArrowLeft-Right, one correct direction). Add slider behaviour there, not per-section.
- `src/components/HomeOverlay.jsx` — DOM HUD (typewriter about-text, radar, sys-bars, CTA). Stays mounted; hidden via `.home-overlay:not(.visible)` (which also pauses its animations).
- `src/hooks/useIsMobile.js` — `useViewportScale()` returns `{ vw, isMobile }` only.
- `src/utils/data.js` — all CV content. `src/utils/motion.js` — `prefersReducedMotion()`.
- `src/styles/global.css` — everything; ~1000 lines, one file by design.

## Conventions
- Brand type is **Space Grotesk + Inter** and the accent is **cyan `#00f0ff`**; the primary "get in touch" CTA uses a deliberate **amber `#ffb043`** (cyan = system/HUD, amber = the one human action). These are intentional — don't "fix" them as generic.
- Continuous motion must respect reduced motion: CSS animations are covered by the `@media (prefers-reduced-motion: reduce)` guard at the end of global.css; **WebGL/JS motion (particles, ring rotation, typewriter) must gate on `prefersReducedMotion()` itself** — CSS can't reach it.
- Interactive controls use `clip-path`, which clips outset focus rings — use the **inset** `:focus-visible` box-shadow already defined in global.css.

## Gotchas
- **Volume corruption:** this repo lives on `/Volumes/Others`, which has silently zeroed working-tree files (correct size, all null bytes, shown as "modified" in git). If `git status` looks wrong, `xxd a-file | head` before trusting it; recover with `git restore` (and `rm -rf node_modules && npm install` if deps are hit).
- **Spline + CSP:** the scene loads from `prod.spline.design` but redirects to a shifting CloudFront/S3 CDN. The CSP in `index.html` keeps `script-src` tight (no `unsafe-eval`) but allows `connect/img/font-src https:` so the CDN can't break the robot. Tightening those back to named hosts will break Spline loading.
- **"Built with Spline" watermark** is drawn inside the WebGL canvas (not the DOM) — removing it requires a Spline Pro account, not code.
- GitHub Pages ignores `public/_headers`; the CSP meta tag is the only self-applied header that works.
