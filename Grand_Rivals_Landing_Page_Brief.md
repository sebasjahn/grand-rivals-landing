# Grand Rivals — Landing Page Build Brief

Use alongside CLAUDE.md (design rules). This brief defines the page structure, the copy, and what each section does. Build one section at a time, top to bottom. Stop after each for review.

---

## Page goal
A visitor lands, understands Grand Rivals in 5 seconds, feels the excitement, and clicks to join. One page, scrolling top to bottom, ending in a sign-up call to action. Mobile-first.

## Global elements
- Sticky minimal top bar: wordmark left, single "Play now" button right (links to app.grandrivals.com). Transparent over hero, gains a subtle dark background after scrolling past hero.
- Smooth scroll throughout (Lenis).
- Footer with nav links, the legal disclaimer, and social links.

---

## Section 1 — Hero (full screen)
The dramatic first impression. Full viewport height.

- Background: deep near-black, with a subtle dark texture (tarmac/carbon — see /assets) at low opacity. Optional very slow subtle motion.
- Massive uppercase headline: "CALL EVERY POSITION."
- Sub-line below in white: "Predict the grid. Outscore your friends. Rule the season."
- Primary red CTA button: "Create your group"
- Secondary text link below: "or join with a code"
- A live countdown to the next real F1 race ("Next lights out in 04 : 12 : 33 : 09") — this small live detail makes the whole product feel real and current. Counts down in real time.
- Headline and sub animate up on load; countdown fades in last.

## Section 2 — How it works
Three steps, equal cards, slide/stagger in on scroll.

- Section header: "HOW IT WORKS"
- Step 1 — "Predict the top 10": Set your finishing order before lights out. Drag, drop, lock it in.
- Step 2 — "Score on accuracy": Nail exact positions for big points. Bold calls win seasons. Bad calls cost you.
- Step 3 — "Beat your group": Climb the leaderboard, earn badges, settle it over a full season.
- Each step: a Lucide icon, a short title, one line of body. Clean, lots of space.

## Section 3 — The scoring drama (the emotional hook)
This is the section that sells the feeling. Show the tension.

- Section header: "EVERY LAP COUNTS"
- Body line: "Get it exactly right and bank 15. Miss by one and take 8. But when your pick crashes out on lap one, you feel it."
- Visual: a simple animated points readout. Show a few picks resolving — a +15 counting up in green, a +8, then a dramatic -5 in red with a subtle shake. Numbers count up/down when scrolled into view.
- Pull the eye to the risk/reward. This is what makes it exciting, not just another predictor.

## Section 4 — Tokens
Tease the strategy layer.

- Section header: "PLAY YOUR HAND"
- Body line: "Five tokens. One per race. Spend them at the perfect moment."
- Five cards in a row (wrap on mobile), staggered reveal:
  - Full Throttle — "Double your points"
  - Safety Car — "Cancel the negatives"
  - Slipstream — "Double down on one driver"
  - Purple Sector — "Call the fastest lap"
  - Undercut — "Sneak an extra pick"
- Each card: name in display font, one-line effect below, subtle red border-glow on hover.

## Section 5 — Spotlight Races
Make them feel exclusive.

- Section header: "SPOTLIGHT RACES"
- Body: "A few weekends each season break the rules. Predict qualifying. Call the full grid. Pick the constructors. Announced at the start, marked on your calendar."
- Visual: a horizontal strip / calendar motif with a few races highlighted in red.

## Section 6 — Leaderboard preview
Social proof + the competitive pull.

- Section header: "CLIMB THE TABLE"
- A stylised leaderboard card: top 3 with a podium treatment, then a few rows below. Use placeholder names (made up — not real people). Columns: player, exacts, points.
- Body line: "Private groups with your friends. Global, country and team leagues with everyone else."

## Section 7 — Final CTA
Close it.

- Full-width, near-black, single focus.
- Large headline: "THE LIGHTS ARE ABOUT TO GO OUT."
- Sub: "Start your group. Share the code. Win the season."
- Big red CTA: "Create your group — free"
- Small text: "Free to play. No ads in the race."

## Footer
- Wordmark, short nav (How it works, Tokens, Leagues, Play now)
- Social icons (Lucide) — placeholders fine for now
- Legal disclaimer (see CLAUDE.md) in small secondary text
- Copyright line

---

## Assets to place in /assets before building
- Wordmark / logo (if available)
- 2-3 dark moody background textures (tarmac at night, carbon fibre, asphalt) — licence-safe, e.g. from Unsplash
- Any app screenshots from the beta build (for the leaderboard/scoring visuals if you want real ones rather than built-in HTML mockups)

## Reminders
- No real driver names, photos, team logos, or F1 official imagery.
- Placeholder leaderboard names must be invented, not real public figures.
- Keep copy as written above unless changing it deliberately.
- One section at a time. Review each before the next.
