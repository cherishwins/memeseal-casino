# memeseal-casino

Telegram Mini App casino starter kit — React 18, Vite 5, TON Connect, Telegram Stars.
Three working games (Slots, Roulette, Crash), loyalty system, leaderboard, referrals.

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
docs/                   ← engagement strategy, API contract docs
seller/                 ← sales/white-label materials (ignore for dev)
```

## Backend API contract (when demo mode is off)

```
GET  /api/v1/casino/balance/:userId   -> { success, chips }
POST /api/v1/casino/buy-chips         -> { success, invoice_url }
POST /api/v1/casino/play              -> { success, chips, error? }
GET  /api/v1/lottery/pot              -> { pot_stars }
```

## Theming

- Add themes in `src/themes.js` under the `THEMES` object
- Colors in `tailwind.config.js` (`matrix-green`, `casino-gold`, `frog-green`, etc.)
- Set `VITE_THEME` env var to switch theme

## Gotchas

- Demo mode stores all state in localStorage — clear it to reset chip balance
- The 3D crash variant uses React-Three-Fiber; the 2D canvas version is the default
- TON Connect requires a manifest URL at deploy time — set in `.env` before deploying
- Telegram Mini App context (`window.Telegram.WebApp`) is undefined in browser dev; mock it or test in Telegram

## Out of scope

- Real-money gambling compliance / licensing — this is a code kit only
- The reference Node/Express backend (sold separately per SALES.md)
- Modifying seller/ marketing materials
