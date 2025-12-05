# MEMESEAL CASINO 🎰🐸

> Las Vegas had sex with the Matrix. The baby was raised by frogs.

Telegram Mini App casino built with React + Vite + TON Connect.

## Features

- **Politician Slots** 🎰 - Trump, Harris, Biden, Pepe on the reels
- **Election Roulette** 🎯 - Red vs Blue (Trump vs Harris), with rare Pepe
- **Frog Rocket Crash** 🚀 - Cash out before the frog crashes
- **Global Lottery** 🏆 - 20% of all bets feed the pot
- **TON Connect** 💎 - Connect your wallet
- **Telegram Stars** ⭐ - Pay with Stars
- **Loyalty Cards** 🎁 - 7-digit codes for free credits

## Stack

- React 18
- Vite 5
- TailwindCSS
- TON Connect SDK
- Telegram Mini Apps SDK
- Framer Motion

## Deploy to Vercel

```bash
# Clone and enter directory
cd memeseal-casino

# Install deps
npm install

# Test locally
npm run dev

# Deploy to Vercel
npx vercel

# Production deploy
npx vercel --prod
```

## Configure Telegram Mini App

1. Message @BotFather
2. `/newapp` or `/editapp`
3. Set Web App URL: `https://your-vercel-url.vercel.app`
4. Add menu button to your bot

## Environment

Update `src/main.jsx` with your deployed manifest URL:
```js
const manifestUrl = 'https://YOUR-DOMAIN.vercel.app/tonconnect-manifest.json'
```

Update `public/tonconnect-manifest.json` with your domain.

## API Integration

The casino connects to the NotaryTON backend:

```
GET  /api/v1/lottery/pot       - Get pot size
GET  /api/v1/lottery/tickets/ID - Get user tickets
POST /api/v1/casino/bet        - Record bet + lottery entry
```

## License

DEGEN LICENSE - Do whatever you want, just don't rug.

🐸🚀 LFG
