# Grand Rivals — Landing Page

The single-page marketing site for **Grand Rivals**, an F1 prediction game for you and your friends. Its job: make a visitor understand the game in seconds and want to join. It links out to the app at `app.grandrivals.com` — it is not the app itself.

Mobile-first, cinematic, race-engineering aesthetic: deep near-black canvas, one signal-red accent, condensed display type, and a signature scroll-driven wheel motif that runs the length of the page.

## Stack

- **React** + **Vite**
- **Tailwind CSS** (palette, type, and spacing scale locked to the design system)
- **Framer Motion** — scroll-reveal animations, the pinned Spotlight sequence, count-ups, micro-interactions
- **Lenis** — smooth scrolling
- **Lucide React** — icons
- Deployed on **Vercel**

## Getting started

Requires **Node 18+** (built with Node 20) and npm.

```bash
npm install     # install dependencies
npm run dev     # start the dev server (http://localhost:5173)
npm run build   # production build → dist/
npm run preview # preview the production build locally
```

## Project structure

```
src/
  App.jsx                 # composes the page: WheelStage + all sections + footer
  main.jsx, index.css     # entry + Tailwind base / global styles
  components/             # WheelStage (signature wheel/smoke), Navbar, Footer,
                          # Countdown, Counter, SectionHeading, MagneticButton, ...
  sections/               # Hero, HowItWorks, ScoreDrama, Tokens,
                          # SpotlightRaces, LeaderboardPreview, FinalCTA
  lib/                    # useLenis, useReducedMotion, raceSchedule
assets/                   # generated textures and licence-safe imagery
tailwind.config.js        # the locked colour / font / spacing tokens
```

The design rules (colours, fonts, spacing scale, motion language, legal copy) live in [`CLAUDE.md`](./CLAUDE.md). All motion respects `prefers-reduced-motion`.

## Deployment (Vercel)

1. In the [Vercel dashboard](https://vercel.com/new), **import** this GitHub repository.
2. Vercel auto-detects Vite — no config needed:
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
3. Deploy. Every push to `main` ships automatically.

## Notes

- Replace the placeholder race dates in `src/lib/raceSchedule.js` with the official calendar.
- Leaderboard names are invented placeholders — not real people.
- Grand Rivals is not affiliated with, endorsed by, or associated with Formula 1, Formula One Licensing BV, the FIA, or any Formula 1 team or driver. All driver and team names are used for identification purposes only. No official F1 imagery is used anywhere.
