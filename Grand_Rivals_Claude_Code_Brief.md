# Grand Rivals — Claude Code Build Brief v2.0

## What is Grand Rivals?
Grand Rivals is a mobile-first F1 prediction web app. Players predict the top 10 finishing order before each race and earn points based on accuracy. It includes strategic tokens, Spotlight Race weekends, a tiered badge system, group leagues, and season-long champion predictions. Think Fantasy Football but for F1, built for friend groups.

---

## Tech Stack
- **Frontend**: React + Vite (already scaffolded)
- **Backend/Auth/DB**: Supabase (already connected — project: xtzyvjulecbcdkxlufqw.supabase.co)
- **Styling**: Tailwind CSS, mobile-first
- **F1 Data**: Ergast F1 API (or Motorsport Data API) for automated result population. Architecture must support both API-driven AND manual admin result entry.
- **Target**: Mobile-first webapp. Native app later.

---

## Authentication
- Email + password with email verification
- Google OAuth
- Apple login (required for future App Store)
- Password reset flow
- On first login: guided onboarding — display name, photo, favourite driver/team, create or join group, tutorial prediction

---

## User Profile Fields
```
display_name        required
profile_photo       upload or avatar
favourite_driver    used for Loyal badge + team league
favourite_team      used for team league placement
country             used for country league (optional privacy)
bio                 optional
tag                 auto-assigned: 'rookie' (first season) | 'veteran' (2+ seasons)
```

---

## Core Scoring Engine

### Base points per driver pick:
```
Exact position                                    → +15 pts
1 position off                                    → +8 pts
2 positions off                                   → +4 pts
3-4 positions off                                 →  0 pts
5+ positions off                                  → -5 pts
Predicted top 10, driver DNF or outside top 10   → -5 pts
Did not predict driver who finished top 10        → -5 pts
```

### Bonus points:
```
Correct race winner (exact P1)               → +10 pts  [always applies]

Podium bonuses — MUTUALLY EXCLUSIVE, highest tier only:
  All 3 podium exact, correct order          → +15 pts
  All 3 podium drivers correct, wrong order  → +8 pts
  Exact P1 + P2 only                         → +5 pts

5 or more exact positions                    → +15 pts  [independent]
Perfect top 10 (all 10 exact)               → +50 pts  [independent]
```

### Tiebreakers (applied in order):
1. Most exact predictions across the season
2. Most 1-off predictions
3. Earliest average prediction submission time

### CRITICAL — Scoring rules:
- Full Throttle token doubles BASE points only, not bonuses
- Safety Car token: set base points to max(0, basePoints) before bonuses
- Recalculation engine MUST be idempotent — running multiple times on same race always gives correct result, never double-counts
- Maximum possible score per race: 240 pts

---

## Tokens
All given at season start. Max 1 per race. No stacking. Mid-season joiners get full set.

| Token | Effect | Uses |
|-------|--------|------|
| Full Throttle | Double base position points (not bonuses) | 1x |
| Safety Car | No negative points that race | 1x |
| Slipstream | Double points AND penalties for 1 selected driver | 3x |
| Purple Sector | Predict fastest lap driver — bonus if correct | 3x |
| Undercut | Extra driver outside top 10 — correct +12, wrong -5 | 3x |

Tokens visible ONLY on prediction screen. No separate tab.

---

## Spotlight Races
Max 4 per season. Randomised at season start. Highlighted on calendar. Same scoring unless noted.

| Name | Format |
|------|--------|
| The Grid | Predict qualifying top 10 |
| Sprint Start | Predict sprint top 8 |
| Full Field | Predict all 22 drivers |
| Pit Wall | Predict constructor top 5 |
| Wheel to Wheel | Predict which driver beats teammate (+5 if correct) |

---

## App Navigation (5 tabs, mobile-first)
```
Home       → Countdown, current picks, group activity feed
Calendar   → Full season, Spotlight Races highlighted, predict ahead
Results    → Race results, personal score breakdown, history
Rankings   → Group leaderboard, global/country/team/friend leagues, streak indicators
Profile    → Badges, stats, fav driver/team, season history, prediction history
```

---

## Prediction Screen (most important screen)
- Drag and drop driver ordering with team-coloured driver cards
- Driver form cards — recent results, circuit history
- Token selection UI — available tokens, select before confirming
- Confirmation step before locking
- Predictions lock at race/quali/sprint session start
- Locked predictions shared with group ONLY after lock moment
- Players can predict multiple future races in advance
- Shareable prediction card generated after lock

---

## Race Results and API Integration

### F1 API Flow:
```
Race ends
  → API polled for results (Ergast or Motorsport Data API)
  → Results auto-populated as PROVISIONAL
  → Admin reviews in admin panel
  → Admin confirms results
  → Score calculation triggered for all players
  → If results change (post-race penalties)
    → Admin updates result
    → Recalculation triggered automatically
    → All scores updated
    → Push notification sent to all affected players: "Results updated for [Race Name]"
```

### Manual fallback:
If API unavailable, admin enters full finishing order manually in admin panel. Same confirmation and recalculation flow applies.

### Result states:
```
upcoming → active → provisional → confirmed
```
Scores only calculated on 'confirmed'. Recalculation available at any time after.

---

## Driver Management

### Global driver list:
Master list for the season — name, team, car number, team colour hex. Drives prediction screen and scoring.

### Per-race driver overrides (CRITICAL):
Each race has its own confirmed driver lineup. Changes to one race NEVER affect other races or historical data.

```
Types of change:
  temporary_standin   — driver added for one race only
  permanent_swap      — new driver from this race onwards, old driver removed from future races
  driver_return       — original driver reinstated from specified race forward
```

### Standin announced AFTER predictions submitted:
- Option A: Admin reopens predictions for affected players only
- Option B: Substituted driver automatically scored as DNF/outside top 10

### Driver change audit:
All lineup changes logged — admin, timestamp, race affected, before/after. Past predictions and results referencing old drivers are NEVER modified.

---

## Admin Panel

### Two admin roles:
```
super_admin   — full platform access
group_admin   — their group only (prediction override, nudge, remove members)
```

### Race Management:
- Create and schedule races
- Set lock times for qualifying, sprint, race
- Mark Spotlight Race and set type
- Enter/update race results (provisional → confirmed)
- Trigger score recalculation
- Manage per-race driver lineups

### Season Management:
- Open and close seasons
- Set and announce Spotlight Races at season start
- Set difficulty tiers for champion predictions
- Distribute tokens at season start
- Close season and trigger recap generation

### User Management:
- View any player's predictions, scores, token usage
- Override a player's prediction post-lock (MANDATORY audit log entry required)
- Remove player from group
- Reset a specific token for verified technical issues
- Suspend or ban account

### Content Management:
- Update master driver list
- Update team colours/names
- Manage per-race driver overrides

### Audit Log (CRITICAL):
Every admin action logged permanently — cannot be deleted.
```
Fields: action_type, admin_user_id, affected_table, affected_record_id, 
        before_value (jsonb), after_value (jsonb), timestamp, notes
```

---

## Database Schema

```sql
-- Users
users (
  id uuid primary key,
  email text unique,
  display_name text,
  photo_url text,
  favourite_driver text,
  favourite_team text,
  country text,
  bio text,
  tag text default 'rookie',  -- rookie | veteran
  role text default 'user',   -- user | group_admin | super_admin
  created_at timestamptz
)

-- Seasons
seasons (
  id uuid primary key,
  year int,
  status text,  -- upcoming | active | closed
  spotlight_races jsonb,  -- array of race_ids marked as spotlight
  champion_predictions_locked bool default false,
  created_at timestamptz
)

-- Races
races (
  id uuid primary key,
  season_id uuid references seasons,
  round_number int,
  name text,
  circuit text,
  country text,
  race_start timestamptz,
  quali_start timestamptz,
  sprint_start timestamptz,
  predictions_close timestamptz,
  status text,  -- upcoming | active | provisional | confirmed
  is_spotlight bool default false,
  spotlight_type text,  -- the_grid | sprint_start | full_field | pit_wall | wheel_to_wheel
  created_at timestamptz
)

-- Race Driver Lineups (per-race overrides)
race_drivers (
  id uuid primary key,
  race_id uuid references races,
  driver_id text,
  driver_name text,
  team text,
  car_number int,
  change_type text,  -- regular | temporary_standin | permanent_swap
  created_at timestamptz
)

-- Master Driver List
drivers (
  id text primary key,
  name text,
  team text,
  car_number int,
  team_colour text,
  active_from_race uuid,
  active_to_race uuid,
  created_at timestamptz
)

-- Results
results (
  id uuid primary key,
  race_id uuid references races unique,
  positions jsonb,        -- full finishing order array [{position, driver_id, status}]
  fastest_lap_driver text,
  status text,            -- provisional | confirmed
  updated_at timestamptz,
  confirmed_by uuid references users,
  created_at timestamptz
)

-- Predictions
predictions (
  id uuid primary key,
  user_id uuid references users,
  race_id uuid references races,
  picks jsonb,              -- ordered array of 10 driver_ids
  token_played text,        -- full_throttle | safety_car | slipstream | purple_sector | undercut | null
  token_target_driver text, -- for slipstream
  undercut_pick text,       -- for undercut token
  purple_sector_pick text,  -- for purple sector token
  admin_entered bool default false,
  admin_id uuid,            -- if admin_entered = true
  submitted_at timestamptz,
  unique (user_id, race_id)
)

-- Scores
scores (
  id uuid primary key,
  user_id uuid references users,
  race_id uuid references races,
  base_points int default 0,
  bonus_points int default 0,
  total_points int default 0,
  breakdown jsonb,
  calculated_at timestamptz,
  unique (user_id, race_id)
)

-- Tokens Used
tokens_used (
  id uuid primary key,
  user_id uuid references users,
  season_id uuid references seasons,
  race_id uuid references races,
  token_type text,
  created_at timestamptz
)

-- Groups
groups (
  id uuid primary key,
  name text,
  join_code text unique,
  admin_user_id uuid references users,
  season_id uuid references seasons,
  status text default 'active',  -- active | closed
  created_at timestamptz
)

-- Group Members
group_members (
  id uuid primary key,
  group_id uuid references groups,
  user_id uuid references users,
  joined_at timestamptz,
  unique (group_id, user_id)
)

-- Badges
badges (
  id uuid primary key,
  user_id uuid references users,
  season_id uuid references seasons,
  badge_key text,
  tier text,  -- bronze | silver | gold | legendary
  points_awarded int,
  earned_at timestamptz
)

-- Champion Picks
champion_picks (
  id uuid primary key,
  user_id uuid references users,
  season_id uuid references seasons,
  driver_champion text,
  constructor_champion text,
  driver_pts int,
  constructor_pts int,
  locked_at timestamptz,
  unique (user_id, season_id)
)

-- Audit Log
audit_log (
  id uuid primary key,
  action_type text,
  admin_user_id uuid references users,
  affected_table text,
  affected_record_id text,
  before_value jsonb,
  after_value jsonb,
  notes text,
  created_at timestamptz
)
```

---

## Scoring Function Reference

```javascript
function calculateScore(picks, actualTop10, fullResults, tokenPlayed, tokenTargetDriver, undercutPick, fastestLapDriver, purpleSectorPick) {
  const PTS_MAP = { 0: 15, 1: 8, 2: 4, 3: 0, 4: 0 };
  let basePoints = 0;
  let breakdown = [];

  // Score each pick
  picks.forEach((driverId, predictedPos) => {
    const actualPos = actualTop10.indexOf(driverId);
    let pts = 0;

    if (actualPos === -1) {
      pts = -5; // DNF or outside top 10
      breakdown.push({ driverId, predictedPos, actualPos: null, pts, reason: 'outside_top10' });
    } else {
      const diff = Math.abs(actualPos - predictedPos);
      pts = diff in PTS_MAP ? PTS_MAP[diff] : -5;
      breakdown.push({ driverId, predictedPos, actualPos, pts, reason: diff === 0 ? 'exact' : `${diff}_off` });
    }

    // Slipstream token doubles this driver's points
    if (tokenPlayed === 'slipstream' && driverId === tokenTargetDriver) pts *= 2;
    basePoints += pts;
  });

  // Penalty for top 10 drivers not predicted
  actualTop10.forEach(driverId => {
    if (!picks.includes(driverId)) {
      basePoints -= 5;
      breakdown.push({ driverId, predictedPos: null, actualPos: actualTop10.indexOf(driverId), pts: -5, reason: 'missed_top10' });
    }
  });

  // Apply token effects to base points
  if (tokenPlayed === 'safety_car') basePoints = Math.max(0, basePoints);
  if (tokenPlayed === 'full_throttle') basePoints *= 2;

  // Bonus points
  let bonusPoints = 0;
  const exactCount = breakdown.filter(b => b.reason === 'exact').length;

  // Winner bonus (always applies if correct)
  if (picks[0] === actualTop10[0]) bonusPoints += 10;

  // Podium bonus — mutually exclusive, highest tier only
  const podiumExact = [0,1,2].every(i => picks[i] === actualTop10[i]);
  const podiumAnyOrder = [0,1,2].every(i => actualTop10.slice(0,3).includes(picks[i]));
  const p1p2Exact = picks[0] === actualTop10[0] && picks[1] === actualTop10[1];

  if (podiumExact) bonusPoints += 15;
  else if (podiumAnyOrder) bonusPoints += 8;
  else if (p1p2Exact) bonusPoints += 5;

  // Exact count bonuses
  if (exactCount >= 10) bonusPoints += 50;      // perfect top 10
  else if (exactCount >= 5) bonusPoints += 15;  // 5+ exact

  // Undercut token
  if (tokenPlayed === 'undercut' && undercutPick) {
    const undercutActualPos = fullResults.indexOf(undercutPick);
    if (undercutActualPos !== -1 && undercutActualPos < 10) bonusPoints += 12;
    else bonusPoints -= 5;
  }

  // Purple Sector token
  if (tokenPlayed === 'purple_sector' && purpleSectorPick) {
    if (purpleSectorPick === fastestLapDriver) bonusPoints += 10;
    else bonusPoints -= 5;
  }

  return {
    basePoints,
    bonusPoints,
    total: basePoints + bonusPoints,
    breakdown
  };
}
```

---

## Key UX Principles
- Mobile first — every interaction one-thumb usable
- Prediction deadline countdown prominent on home screen
- Post-race summary screen must be beautiful and shareable — this is the viral moment
- Onboarding: pick favourite driver/team → create or join group → tutorial → done
- Empty states must be welcoming, not blank
- Offline prediction caching — save locally, sync on reconnect
- Streak/form indicators on rankings (last 5 races, green/red)
- Activity feed: "Jamie played Full Throttle on Barcelona", "Alex earned Oracle badge"
- Result update notification: "Monaco GP results updated — your score has changed"

---

## Phase Roadmap
```
Phase 1 — Core:
  Auth, user profiles, onboarding
  Prediction screen with drag-and-drop
  Scoring engine (calculateScore as above)
  Race lock mechanism
  Groups — create, join, admin tools
  Rankings — group + global leagues
  Badge system
  Season structure — tokens, champion picks, calendar
  Admin panel — full super_admin + group_admin
  Driver management — global list + per-race overrides
  F1 API integration + manual fallback
  Score recalculation engine (idempotent)
  Audit log
  Post-race results and score breakdown screen
  Prediction history

Phase 2:
  Live Tracker — real-time points during race
  Shareable cards (prediction, post-race summary, season podium)
  Advance predictions for future races
  Push notifications

Phase 3:
  Native mobile app
  Apple login
  Expanded league features
```

---

## UI/UX Structure Reference

The following structural and design patterns should be used as inspiration throughout the app. These are based on reference screenshots from a similar prediction app (MPP). The goal is NOT to copy the visual style but to adopt the structural and interaction patterns that make it feel polished and intuitive.

### Overall App Feel
- Dark background throughout — near black base (#0D0D0D or similar)
- Cards with subtle borders and clear breathing room (padding, not cramped)
- Clean bold typography, high contrast
- Gold/accent colour used sparingly for active states, highlights, CTAs
- Everything feels substantial and premium, not lightweight or flat

### Bottom Navigation
- Always visible sticky bottom nav, 5 tabs
- Active tab highlighted clearly
- Icons + labels, no ambiguity
- Never hidden or auto-collapsed

### Card Containers
- Each race/prediction sits in its own clearly defined card
- Cards have consistent padding, rounded corners, subtle border or shadow
- Contextual actions (token activation, confirm button) live INSIDE the card — not on a separate screen
- Cards are visually separated, never merged or blurred together
- Date headers group cards by day — clean label above the group, not inside the card

### Prediction Screen
- Countdown timer prominent at top of screen — always visible before lock
- Each race card shows the key info clearly: session name, time, lock time
- Token/bonus activation button sits inside the race card — one tap to activate, clear state change when active
- Odds or form context shown subtly inside the card (driver form for Grand Rivals)
- Predictions grouped by date with clear day separators

### Rankings Screen
- TOP OF SCREEN: Podium hero section — P1 centre and elevated, P2 left, P3 right
- Each podium position shows: avatar, display name, points, key stats (Good predictions, Exacts)
- Below podium: full scrollable player list
- List columns: Position number, Avatar, Display name, Country flag, Good, Exacts, Points
- "Show favorites" filter toggle to show only friends/group members
- Streak or form indicator next to player name (last 5 races)
- Current user's row always highlighted/pinned so they can find themselves instantly

### Profile Screen
- Full-width artistic header — background themed to favourite team/driver, profile photo centred in circular frame with country flag badge
- Display name large and bold, username below
- Tabs within profile: Stats, Predictions, Badges, Friends — no deep navigation needed
- Badge grid: 5 columns, circular badges, locked badges shown as darkened with lock icon
- Badge grid creates visual progression hunger — you can see what you're working toward
- Stats tab shows season summary cards: total points, races predicted, exact predictions, best race, worst race

### My Leagues / Groups Screen
- Each group/league as a full-width visual card with cover image, group name, player count
- Cards are bold and visual — not just text rows
- Sticky "New league" / "Create group" CTA button at bottom of screen, always accessible
- Competition/season switcher accessible from top of screen — quick toggle between active groups
- Clear distinction between private groups and public leagues visually

### General Interaction Patterns
- Contextual actions always within reach — never bury important actions in submenus
- Tabs within pages preferred over deeper navigation stacks
- Confirmation steps for irrelevant actions (locking predictions, playing a token) but kept minimal — one tap confirm, not multi-step
- Empty states are visual and encouraging — not blank screens with small grey text
- Loading states use skeleton screens, not spinners where possible
- All interactions designed for one-thumb mobile use — primary actions in the bottom half of screen

### Competition Switcher
- A quick-access switcher in the top corner of the predictions screen to toggle between competitions/groups
- Allows switching context without going into a separate leagues screen
- Shows current active competition name + icon

---

## Legal Constraints (MUST follow in implementation)

- NO F1 logos, team logos, circuit logos, race posters, broadcast imagery anywhere
- NO driver photos, recognisable illustrations, helmet designs, or personal driver logos — use generic team-coloured cards with names/initials/numbers only
- Team colours = generic colour approximations, NEVER exact livery designs, sponsor layouts, or team typefaces
- Driver and team names rendered as plain text in the app's own typography — identification only
- Circuit visuals (if any) must be original simplified drawings, never reproductions
- Non-affiliation disclaimer in app footer and about page: "Grand Rivals is not affiliated with, endorsed by, or associated with Formula 1, Formula One Licensing BV, the FIA, or any Formula 1 team or driver. All driver and team names are used for identification purposes only."
- App name/branding never includes "F1", "Formula 1", or "Grand Prix"
- Free to play — no paid entry, no cash prizes (gambling compliance)
- GDPR: privacy policy, cookie consent, account deletion flow, data export capability
- Data API must have terms permitting this use; no official F1 live timing feeds
