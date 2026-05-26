# 🎰 MemeSeal Casino

> Production-ready Telegram Mini App casino. Three games. TON Connect. Telegram Stars. White-label in 30 minutes.

**[Live demo →](https://memeseal-casino.vercel.app)** · **[Buy a license →](#pricing)** · **[Book a build →](#white-label)**

[![License: See LICENSE](https://img.shields.io/badge/license-Commercial-blue.svg)](./LICENSE)
[![Forks](https://img.shields.io/github/forks/cherishwins/memeseal-casino?style=social)](https://github.com/cherishwins/memeseal-casino/network/members)

---

## What this is

A complete React 18 / Vite 5 casino front-end built as a Telegram Mini App. Three working games — **Slots, Roulette, Crash** — with TON Connect for non-custodial wallets and Telegram Stars for native in-app payments. Demo mode runs out of the box with zero config. Production mode is white-labelable through a single `.env` file.

You can have a branded casino Mini App deployed to your domain by tonight.

## What's in the box

- 🎰 **Slots** — configurable reels, paytables, themed assets
- 🎯 **Roulette** — European single-zero, with multipliers
- 📈 **Crash** — multiplier curve, cash-out logic, provably-fair-ready
- 💳 **TON Connect** — wallet integration tested against TON Mainnet
- ⭐ **Telegram Stars** — native in-app purchases for non-crypto users
- 🎨 **Theming** — colors, logo, name, payouts via `.env`
- 📱 **Mobile-first** — built for Telegram's Mini App viewport
- 🧪 **Demo mode** — no backend needed to evaluate

## What's not in the box

Real-money operation requires what every casino requires: a custodial wallet system or non-custodial payment integration, provably-fair RNG verification, anti-fraud, player limits, KYC routing, and a gambling license in your jurisdiction. This is the front-end. **See [SALES.md](./SALES.md) for what we can build for you.**

For non-custodial USDC payments on Base, we have a separate product — the **[x402 facilitator](https://github.com/cherishwins/x402-facilitator)** — used in production by our other consumer apps.

## Quick start (demo mode)

```bash
git clone https://github.com/cherishwins/memeseal-casino
cd memeseal-casino
npm install
npm run dev
```

Open in Telegram via the dev URL. Demo mode runs against simulated wallets and balances.

## Production setup

```bash
cp .env.example .env
# Edit .env with your brand, wallet, payout config
npm run build
# Deploy /dist to Vercel, Netlify, or your CDN of choice
```

Full integration guide: [docs/PRODUCTION.md](./docs/PRODUCTION.md)

---

## 💰 Pricing

| Tier | Price | What you get |
|---|---|---|
| **Personal / Portfolio** | $0 | Hobby and learning use. See LICENSE. |
| **Commercial License** | $399 | One project. Lifetime updates. White-label rights. |
| **Studio License** | $1,499 | Up to 5 projects. Priority support. |
| **White-Label Build** | from $2,500 | We theme, deploy, and hand you a launch-ready Mini App. |
| **Custom** | from $10,000 | New games, backend, payment rails, ongoing dev. |

**[→ Buy on Gumroad](https://gumroad.com/cherishwins/memeseal-casino)** · **[→ Book a 20-min call](https://cal.com/cherishwins/casino)**

Full terms, FAQs, and legal posture: **[SALES.md](./SALES.md)**

---

## ⚖️ Legal — read this

This software is sold under a software license. **It is not a gambling license.** Operating a real-money casino requires a gambling/gaming license in your jurisdiction. You are responsible for: securing all applicable licenses, KYC/AML compliance, responsible-gambling controls, tax compliance, and any losses or regulatory action arising from your deployment. We provide the software. We do not advise on licensing. See [LICENSE](./LICENSE) for warranty disclaimers.

---

## Architecture

```
memeseal-casino/
├── src/
│   ├── games/           # Slots, Roulette, Crash
│   ├── components/      # UI, modals, Telegram bridge
│   ├── wallet/          # TON Connect integration
│   ├── stars/           # Telegram Stars integration
│   ├── theme/           # Brand tokens (env-driven)
│   └── lib/             # Provably-fair helpers, RNG hooks
├── public/              # Static assets, manifest
├── docs/                # Production + integration guides
└── .env.example         # White-label config
```

## Tech stack

React 18 · Vite 5 · TypeScript · Tailwind · Zustand · TON Connect SDK · Telegram WebApp SDK · Framer Motion

## Roadmap

- [ ] Plinko (next release, Q3 2026)
- [ ] Mines
- [ ] Dice + Limbo
- [ ] Aviator-style multiplier
- [ ] Provably-fair RNG verification module
- [ ] Multi-language (EN, RU, PT, ES)

Sponsor a feature → priority dev. [Talk to us.](https://cal.com/cherishwins/casino)

## Support

- 🐛 Bugs: GitHub Issues
- 💬 Licensed customers: private Discord (link in your license delivery email)
- 📧 Sales: see [SALES.md](./SALES.md)

---

*Built by [cherishwins](https://github.com/cherishwins). Used in production by outlier-clothiers and other live consumer apps.*
