# x402-facilitator

> A working third-party x402 facilitator. USDC on Base. No Stripe. No KYC. Wallet-to-wallet.
> Production-deployed. Used by multiple live consumer apps. Open source.

**[Live](https://x402-facilitator.onrender.com)** · **[Hire us for x402 integration →](https://cal.com/cherishwins/x402)**

---

## What this is

A reference implementation of an [x402 protocol](https://www.x402.org) facilitator. x402 is the open standard, co-stewarded by [Coinbase and Cloudflare's x402 Foundation](https://www.coinbase.com/blog/coinbase-and-cloudflare-will-launch-x402-foundation), that lets HTTP servers charge for resources using stablecoin payments — settled in seconds, no accounts, no chargebacks, no card networks.

This repo is a **lightweight, self-hostable facilitator** that handles:
- `POST /pay` — creates a payment challenge (returns HTTP 402)
- `GET /pay/{id}` — checks payment status
- `POST /webhook` — payment verification
- `GET /buy/{product}` — preconfigured product flow
- `POST /verify-onchain` — on-chain tx verification on Base

## Why this exists

For production, most builders should use [Coinbase's CDP Facilitator](https://docs.cdp.coinbase.com/x402/welcome) — it's free up to 1,000 tx/month, multi-chain (Base, Polygon, Arbitrum, Solana, World), gas-sponsored, and OFAC-screened.

**This facilitator is for the case where you want:**
- Self-hosted infrastructure with zero third-party dependency
- A learning reference for how x402 actually works under the hood
- A starting point for chains or token configurations Coinbase doesn't yet support
- A facilitator you control end-to-end for compliance or geographic reasons

## Who's using it

This facilitator currently powers:
- **[outlier-clothiers](https://outlier-clothiers.vercel.app)** — direct-to-wallet clothing sales
- **[notaryton-bot](https://t.me/NotaryTON_bot)** — TON-side notarization with USDC settlement
- **[memescan](https://github.com/cherishwins/memescan-astro)** — paid rug-score lookups
- **[music](https://github.com/MobilityLink/music)** — paid AI music generation

## Deploy in 2 minutes

```bash
git clone https://github.com/cherishwins/x402-facilitator
cd x402-facilitator
# Push to your GitHub
git remote set-url origin https://github.com/YOU/x402-facilitator
git push -u origin main
```

Then on [Render](https://render.com/new): connect repo, set `PAYMENT_ADDRESS` to your Base USDC wallet, deploy.

## Endpoints

| Endpoint | Method | What it does |
|---|---|---|
| `/pay` | POST | Create payment challenge, returns HTTP 402 |
| `/pay/{id}` | GET | Check payment status |
| `/webhook` | POST | Submit payment proof, triggers on-chain verification |
| `/buy/{product}` | GET/POST | Preconfigured product checkout |
| `/verify-onchain` | POST | Verify tx on Base mainnet |

## Quick usage

### Create a payment

```bash
curl -X POST https://x402-facilitator.onrender.com/pay \
  -H "Content-Type: application/json" \
  -d '{"item": "sweater", "amount": 100}'
```

Response (HTTP 402):
```json
{
  "status": "payment_required",
  "payment_id": "abc123",
  "amount": 100,
  "currency": "USDC",
  "network": "base",
  "pay_to": "0x14E6..."
}
```

### Quick buy (preconfigured products)

```bash
curl https://x402-facilitator.onrender.com/buy/seal
curl https://x402-facilitator.onrender.com/buy/music-track
curl https://x402-facilitator.onrender.com/buy/rug-score
```

### Verify after payment

```bash
curl -X POST https://x402-facilitator.onrender.com/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "payment_id": "abc123",
    "tx_hash": "0x...",
    "amount": 100,
    "sender": "0x..."
  }'
```

## Default product catalog

| Product | Price (USDC) |
|---|---|
| sweater | $100 |
| hoodie | $80 |
| music-track | $0.50 |
| album-art | $0.10 |
| brand-kit | $0.25 |
| seal | $0.05 |
| rug-score | $0.10 |

Edit `main.py` to customize.

## Integration example

```js
// 1. Request the resource
const res = await fetch('https://your-x402.example.com/buy/sweater');
const challenge = await res.json();

// 2. Show payment UI — Coinbase Pay, QR code, or deep link
window.location.href =
  `https://pay.coinbase.com/buy?address=${challenge.pay_to}&amount=${challenge.amount}`;

// 3. After user pays, verify on-chain
await fetch('https://your-x402.example.com/webhook', {
  method: 'POST',
  body: JSON.stringify({
    payment_id: challenge.payment_id,
    tx_hash: userTxHash,
    amount: challenge.amount,
    sender: userWallet,
  }),
});
```

## Architecture

```
x402-facilitator/
├── main.py            # FastAPI app: routes, payment state, verification
├── requirements.txt   # FastAPI, uvicorn, web3, httpx
├── render.yaml        # Render deployment config
└── .env.example       # PAYMENT_ADDRESS, BASE_RPC_URL, etc.
```

## Security posture

Before using in production:

- ✅ `/verify-onchain` confirms tx exists, is mined, correct recipient, correct amount
- ✅ `/webhook` rejects duplicate payment_ids (replay protection)
- ⚠️ State is in-memory by default — restart loses pending payments. **For production: enable the Postgres backend in `main.py`** (see `docs/PERSISTENCE.md`)
- ⚠️ No rate limiting by default — add Cloudflare or your reverse proxy of choice
- ⚠️ Free-tier Render sleeps after 15 min idle — use the $7/mo Starter plan minimum

## Need integration help?

If you want to add x402 to your app, API, or AI agent, we do this for a living. Our consumer apps prove the pattern works end-to-end — TON + Base, Telegram + browser, micropayments + larger purchases.

**Engagements:**
- 🛠️ **x402 integration sprint** — 1-2 weeks, your app gets paid endpoints. From $5,000.
- 🏗️ **Custom facilitator build** — self-hosted, multi-chain, your compliance needs. From $15,000.
- 🤝 **Strategic partnership** — ongoing dev partnership for x402-native product companies.

**[→ Book a 20-min scoping call](https://cal.com/cherishwins/x402)**

## License

MIT for the facilitator code. The reference implementation is free to use, fork, and adapt. Commercial integration consulting is a separate engagement.

---

*Built by [cherishwins](https://github.com/cherishwins). Used in production. Listed on the [x402 ecosystem page](https://www.x402.org/ecosystem) (pending submission).*
