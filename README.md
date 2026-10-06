# MEMESEAL CASINO — Telegram Mini App Starter Kit

A complete, ready-to-deploy Telegram Mini App casino built with React 18, Vite 5, TON Connect, and Telegram Stars. Three working games, lottery system, loyalty cards, and a fully-themable Matrix/meme UI.

**Runs out of the box in demo mode** (no backend required). **This is a play-money demo.** Chips have no cash value, there are no real-value prizes, and every game outcome is decided in the browser. Read [Demo / play-money only](#demo--play-money-only) before you connect it to anything that costs money.

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
| Top-10 leaderboard (today / all-time / streaks) | Sample data, generated in the browser |
| Big-win celebration overlay + share-to-Telegram | Working |
| Two-sided referral system | Working |
| TON Connect wallet integration | Working |
| Telegram Stars payment flow | Code reference only (needs a backend this kit doesn't include) |
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

Set `VITE_DEMO_MODE=false` and `VITE_API_URL=https://your-api.com`. The app then calls these endpoints:

```
GET  /api/v1/casino/balance/:userId   -> { success, chips }
POST /api/v1/casino/buy-chips         -> { success, invoice_url }
POST /api/v1/casino/play              -> { success, chips, error? }
GET  /api/v1/lottery/pot              -> { pot_stars }
```

**Do not implement `/play` the way the app calls it.** The app sends a `result` and `payout` it worked out in the browser. A server that credits that `payout` lets anyone give themselves chips. [docs/API_CONTRACT.md](./docs/API_CONTRACT.md) lists every request the app sends, what is wrong with each one, and what a server has to do instead. Any backend you use, including the one SALES.md offers, has to meet those requirements. The next section explains why.

---

## Demo / play-money only

This kit is a demo. Use it with play money only, where nothing can be bought for real value or cashed out.

- **The browser decides every outcome.** Slots, Roulette and Crash each pick their result with `Math.random()` in `src/games/`. Anyone can open devtools and choose to win.
- **The backend contract trusts the client.** With demo mode off, `POST /api/v1/casino/play` sends the client's `result` and `payout`. Roulette and Crash wins never reach the server at all: they only change the number on screen. The app identifies the player by an unverified `user_id` in the URL or body.
- **The backend this kit was written against no longer accepts those requests.** It refuses any claimed win or payout (HTTP 501). It also requires Telegram Mini App `initData` in an `X-Telegram-Init-Data` header on every casino call, and this kit never sends that header. So turning demo mode off against that backend does not work today.
- **Rewards, loyalty codes, the lottery pot and the leaderboard are also local.** In demo mode they live in `localStorage`, and the leaderboard shows generated names and scores.

Before any real-value use, which includes selling chips for Telegram Stars and offering any prize with real-world value, all of the following need to change:

1. The server computes every outcome. The client sends only the bet and the player's choice, and the server draws the result and settles it.
2. The server holds balances and authenticates each request by verifying Telegram `initData` against the bot token. It never takes a user ID from the client.
3. You get a gambling license wherever you operate. **Real-money operation is out of scope for this kit.** It contains no licensing, KYC, responsible-gambling or anti-fraud support, and no server.

The app shows a "Play money — demo only, no real-value prizes" notice in the header for these reasons. Keep it unless all three points above are true for your deployment.

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
- Play-money app (chips can't be bought for real value, nothing is redeemable)
- Front-end for a licensed operator (you provide the license and the server), once outcomes, balances and auth have moved server-side as described in [Demo / play-money only](#demo--play-money-only)

The authors take no responsibility for how you use it. Run it past a lawyer before charging real money. The "Telegram Stars" payment flow is included as a code reference only. Selling chips for Stars takes the app out of play-money territory, and you're responsible for the compliance that follows.

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
