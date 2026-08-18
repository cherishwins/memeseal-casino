

# MEMESEAL CASINO — Telegram Mini App Starter Kit

A complete, ready-to-deploy Telegram Mini App casino built with React 18, Vite 5, TON Connect, and Telegram Stars. Three working games, lottery system, loyalty cards, and a fully-themable Matrix/meme UI.

**Runs out of the box in demo mode** (no backend required). Wire your own backend when you're ready to take real payments.

---

## What's Included

| Feature | Status |
| --- | --- |
| Slots game (3-reel, configurable paytable) | Working |
| Roulette game (3-way bet, weighted RNG) | Working |
| Crash game (canvas-rendered curve, exponential multiplier, ~3% house edge) | Working |
| Optional 3D crash variant (Three.js / React-Three-Fiber) | Working |
| Global lottery pot (20% of bets auto-feed) | Working |
| Loyalty card system (7-digit redemption codes) | Working |
| Daily login rewards + 7-day streak ladder | Working |
| Daily / weekly quests with progress bars | Working |
| Lifetime achievements (7 badges) | Working |
| Top-10 leaderboard (today / all-time / streaks) | Working |
| Big-win celebration overlay + share-to-Telegram | Working |
| Two-sided referral system | Working |
| TON Connect wallet integration | Working |
| Telegram Stars payment flow | Working |
| Matrix rain background (Canvas + WebGL variants) | Working |
| Demo mode (localStorage, zero backend) | Working |
| Responsive mobile-first UI (Tailwind) | Working |
| Vercel one-click deploy | Working |
| White-label brand config via env vars | Working |

---

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. You get 500 chips and all three games work immediately. No backend, no config, no Telegram needed.

## Deploy

```bash
npm run build
npx vercel --prod
```

Then in [@BotFather](https://t.me/BotFather): `/newapp` → set Web App URL to your Vercel URL → add menu button to your bot.

Before going live with your own deployment, update `public/tonconnect-manifest.json` and the `manifestUrl` in `src/main.jsx` to point at your Vercel URL.

---

## Customizing

### Re-brand in 30 seconds

Copy `.env.example` to `.env` and edit:

```env
VITE_THEME=vegas             # built-in skins: memeseal | vegas | cyber
VITE_BRAND_NAME=YOUR CASINO  # optional override
VITE_STARTING_CHIPS=1000
```

### Built-in themes

Three ready-to-use skins in `src/themes.js`:

| Theme | Vibe | Symbols |
| --- | --- | --- |
| `memeseal` (default) | Matrix / crypto / meme | 🐸 🚀 💎 🔥 ⚡ 👑 💰 |
| `vegas` | Classic slots | 7️⃣ 🍒 🔔 🅱️ 🍋 💎 🐴 |
| `cyber` | Cyberpunk / netrunner | 🧠 👁️ 🔌 🤖 💀 🚀 ⚡ |

### Add your own theme

Open `src/themes.js`, add an entry under `THEMES`, set `VITE_THEME` to its key. The theme controls slot symbols, jackpot payouts, roulette bet options, and brand strings.

### Re-skin the colors

`tailwind.config.js` — the `colors` object defines `matrix-green`, `casino-gold`, `frog-green`, etc.

### Wire your own backend

Set `VITE_DEMO_MODE=false` and `VITE_API_URL=https://your-api.com`. Expected endpoints:

```
GET  /api/v1/casino/balance/:userId   -> { success, chips }
POST /api/v1/casino/buy-chips         -> { success, invoice_url }
POST /api/v1/casino/play              -> { success, chips, error? }
GET  /api/v1/lottery/pot              -> { pot_stars }
```

A reference Node/Express backend is sold separately (see SALES.md for upgrade path) — or roll your own; the contract is small.

---

## Stack

- React 18 + Vite 5
- Tailwind CSS 3
- TON Connect SDK 2.0 (wallet)
- Telegram Mini Apps SDK
- Three.js + React-Three-Fiber (optional 3D crash)
- Zustand (state)

---

## Important — Legal

This is **software**, not a casino license. Operating a real-money casino requires gambling licensing in nearly every jurisdiction. Common safe uses of this kit:

- Demo / portfolio piece
- Play-money / sweepstakes app (no real-money stakes)
- Licensed operator front-end (you provide the license)
- White-label sale to a licensed operator

The authors take no responsibility for how you use it. Run it past a lawyer before charging real money. The "Telegram Stars" payment flow is included as a code reference; you're responsible for the underlying compliance.

---

## License

See `LICENSE.md`. TL;DR: use it for your own projects (one or many), don't resell the source code itself.

---

## Engagement & retention

The casino ships with a complete engagement loop: daily streak rewards, quests, achievements, leaderboard, big-win celebration, and a two-sided referral system. See `docs/ENGAGEMENT_STRATEGY.md` for the full playbook, target metrics, A/B test order, and monetization hooks.

Marketing assets ready to use are in `public/banners/` (SVG — scale anywhere). Set `VITE_TG_BOT_USERNAME=your_bot` in your `.env` so the referral and share links point at your actual bot.

---

## Support

- Issues: open a GitHub issue
- Customization / backend / white-label: contact the author
