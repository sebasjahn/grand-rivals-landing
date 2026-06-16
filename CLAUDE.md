# CLAUDE.md — grandrivals.com landing page

This file defines how this project is built. Follow it for everything. These are hard rules, not suggestions.

## What this is
A single-page marketing site for Grand Rivals, an F1 prediction game. Its only job is to make a visitor understand the game in seconds and want to join. It is NOT the app — it links to the app at app.grandrivals.com. Mobile-first, but must look excellent on desktop too.

## Stack (do not substitute)
- React + Vite
- Tailwind CSS
- Framer Motion — for scroll-reveal animations and micro-interactions
- Lenis — for smooth scrolling
- Lucide React — for icons (never emoji)
- Deployed on Vercel

## The look we are going for
Deep near-black canvas. One signal-red accent used sparingly — never as a background flood. Expansive whitespace. Cinematic, precise, race-engineering feel. High-contrast white display type. Sections breathe; nothing is cramped. Think premium hardware brand, not a gaming site. Restraint over decoration.

## Colour (only these)
- Base background: #0B0B0D
- Surface / card: #141417
- Border: rgba(255,255,255,0.08)
- Primary text: #FFFFFF
- Secondary text: #9A9A9F
- Accent (signal red): #E8001D — used only for CTAs, key highlights, and single emphasis moments. Never as a large fill.
- Success/points-positive: #2ECC71 (used only in the scoring section)
- Negative/points-loss: #E8001D (reuse the red)

Never introduce other colours. Never use gradients except, at most, a single subtle dark-to-darker vertical gradient on a section background (#0B0B0D to #141417). No blue/purple gradients ever — that is the #1 AI-site tell.

## Typography
- Display / headlines: a condensed, technical sans. Use "Archivo" or "Barlow Condensed" (font weight 600-700), uppercase for hero and section headers.
- Body: "Inter" (weight 400-500).
- Two fonts only. Never more.
- Hero headline: 72-96px desktop, 40-48px mobile, line-height 1.0-1.05, letter-spacing -0.02em.
- Section headers: 40-56px desktop, 28-32px mobile.
- Body: 16-18px, line-height 1.6.
- Negative letter-spacing on all large type. This is non-negotiable for the premium feel.
- Sentence case or uppercase only — never Title Case.

## Hard rules (these kill the "AI look")
- No emoji anywhere. Icons come from Lucide, at consistent sizes (20px inline, 24px feature).
- No default Tailwind blue/purple/indigo. No rainbow gradients.
- Never more than 2 fonts or the colours listed above.
- Spacing only from this scale: 8, 16, 24, 32, 48, 64, 96, 128px. No arbitrary values.
- All animations 200-400ms, ease-out. Nothing bouncy, floaty, or slow. F1 = precision.
- Every image has explicit width/height (no layout shift).
- Text never sits directly on a photo without a dark overlay or scrim behind it.
- Every interactive element has a hover state AND a visible focus state.
- Max content width 1280px, centred, with generous padding (24px mobile, 64px+ desktop).
- No centred long paragraphs — body copy left-aligned.
- Buttons: solid red primary, rounded 8px. One primary CTA per section maximum.

## Motion language
- Sections fade up + slight rise (16-24px) as they scroll into view, once, not every time.
- Stagger child elements by ~60ms for lists/grids.
- Count-up animation on any number (points totals) when scrolled into view.
- Magnetic / subtle scale (1.02) hover on the primary CTA.
- Smooth scroll via Lenis throughout.
- Respect prefers-reduced-motion — disable reveals if set.

## Workflow rules
- Build ONE section at a time. Do not generate the whole page in one pass.
- After each section, stop so it can be reviewed before moving on.
- Use real assets from /assets — never grey placeholder boxes.
- Keep all copy exactly as provided in the build brief unless asked to change it.

## Legal (must appear)
Footer must contain, in small secondary text:
"Grand Rivals is not affiliated with, endorsed by, or associated with Formula 1, Formula One Licensing BV, the FIA, or any Formula 1 team or driver. All driver and team names are used for identification purposes only."
Never use the F1 logo, team logos, driver photos, or any official imagery anywhere on the site.
