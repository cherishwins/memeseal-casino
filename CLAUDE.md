# memeseal-casino

Telegram Mini App casino starter kit — React 18, Vite 5, TON Connect, Telegram Stars.
Three working games (Slots, Roulette, Crash), loyalty system, leaderboard, referrals.

**Demo / play-money only.** Every game outcome is computed in the browser
(`Math.random()` in `src/games/`), so the client decides who wins. Chips have no
cash value and there are no real-value prizes. Before any real-value use, which
includes selling chips for Stars, outcomes must be computed server-side.
Real-money operation needs a gambling license and is out of scope (see README
"Demo / play-money only").

## Stack

- **Language:** JavaScript (JSX)
- **Framework:** React 18 + Vite 5
- **Styling:** Tailwind CSS 3
- **State:** Zustand
- **3D (optional):** Three.js + React-Three-Fiber (crash game variant)
- **Payments:** TON Connect 2.0 (wallet) + Telegram Stars
- **Platform SDK:** `@telegram-apps/sdk-react`
- **Deploy:** Vercel (`vercel.json` included)

## Local setup

```bash
npm install
npm run dev
# Opens at http://localhost:5173 — starts in demo mode, 500 chips, no backend needed
```

## Key config

Copy `.env.example` → `.env` before starting real work:

```env
VITE_THEME=memeseal         # memeseal | vegas | cyber
VITE_BRAND_NAME=MY CASINO
VITE_STARTING_CHIPS=500
VITE_DEMO_MODE=true         # false = real backend required
VITE_API_URL=               # backend base URL when demo mode is off
VITE_TG_BOT_USERNAME=       # your bot username for referral links
```

## Project structure

```
src/
├── themes.js           ← all theme symbols/payouts/colors live here
├── store/              ← Zustand stores (balance, game state, etc.)
├── components/         ← shared UI components
├── games/              ← Slots, Roulette, Crash game components
└── pages/              ← top-level route pages
public/banners/         ← marketing SVG assets
docs/                   ← engagement strategy, API contract (docs/API_CONTRACT.md)
seller/                 ← sales/white-label materials (ignore for dev)
```

## Backend API contract (when demo mode is off)

These are the requests the app sends today. The contract is unsafe as written;
see `docs/API_CONTRACT.md` before building anything against it.

```
GET  /api/v1/casino/balance/:userId   -> { success, chips }
POST /api/v1/casino/buy-chips         -> { success, invoice_url }
POST /api/v1/casino/play              -> { success, chips, error? }
GET  /api/v1/lottery/pot              -> { pot_stars }
```

- `/play` sends the client's own `result` and `payout`. Never write a server
  that credits them, because that lets anyone mint chips. Roulette and Crash
  wins never reach the server at all and only change the on-screen balance.
- The app sends an unverified `user_id` and never sends the
  `X-Telegram-Init-Data` header. The backend this kit was written against now
  requires that header and refuses client-claimed wins (501), so demo mode off
  does not work against it.
- Do not build a backend in this repo. That work is out of scope (see below).

## Theming

- Add themes in `src/themes.js` under the `THEMES` object
- Colors in `tailwind.config.js` (`matrix-green`, `casino-gold`, `frog-green`, etc.)
- Set `VITE_THEME` env var to switch theme

## Gotchas

- Demo mode stores all state in localStorage — clear it to reset chip balance
- The leaderboard (`src/components/engagement/Leaderboard.jsx`) is generated
  sample data and is labelled that way in the UI. Keep the label until it reads
  from a real backend
- The "Play money — demo only, no real-value prizes" header notice
  (`src/components/PlayMoneyNotice.jsx`, text in `src/themes.js`) shows in every
  theme. Don't remove it while outcomes are client-side
- The 3D crash variant uses React-Three-Fiber; the 2D canvas version is the default
- TON Connect requires a manifest URL at deploy time — set in `.env` before deploying
- Telegram Mini App context (`window.Telegram.WebApp`) is undefined in browser dev; mock it or test in Telegram

## Out of scope

- Real-money gambling compliance / licensing — this is a code kit only
- Server-side game outcomes, balances and initData auth. These are required
  before any real-value use, but they belong in a backend, not in this kit
- The reference Node/Express backend (sold separately per SALES.md)
- Modifying seller/ marketing materials
