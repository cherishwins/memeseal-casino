# Backend API contract

> **Demo / play-money only.** This page lists the requests the app sends when
> `VITE_DEMO_MODE=false`. As written, the contract lets the client decide
> who wins and who they are. **Do not build a server that implements it as
> is.** The last section lists what has to change before chips can be worth
> anything real. Real-money operation also needs a gambling license and is
> out of scope for this kit.

This kit contains no backend, and it is not meant to. The calls below are in
`src/App.jsx`. `src/stores/casinoStore.js` also has a `placeBet` that posts
`/api/v1/casino/bet` with a client-chosen `win_amount`. Nothing imports it, but
it has the same problem.

## What the app sends today

| Call | Body / params | Expected reply |
|---|---|---|
| `GET /api/v1/casino/balance/:userId` | `userId` in the path | `{ success, chips }` |
| `POST /api/v1/casino/buy-chips` | `{ user_id, amount }` | `{ success, invoice_url }` |
| `POST /api/v1/casino/play` | `{ user_id, bet_amount, game, result, payout }` | `{ success, chips, error? }` |
| `GET /api/v1/lottery/pot` | none | `{ pot_stars }` |

No request carries any proof of who the player is. Headers are only
`Content-Type`.

## Why it is unsafe

**The client decides outcomes.** Slots, Roulette and Crash each pick their
result with `Math.random()` in `src/games/`. For Slots, `/play` then sends
`result: "win" | "lose"` and a `payout` that the browser worked out. A server
that credits `payout` lets anyone mint chips from devtools or curl. Roulette and
Crash call `/play` with the wager only (`payout` 0), then add the win to the
on-screen balance locally, so the server never hears about those wins at all.

**The client decides identity.** `user_id` comes from
`Telegram.WebApp.initDataUnsafe` (unverified), a hash of the connected wallet
address, or a random guest ID in `localStorage`. A server that trusts it lets
anyone read, spend or top up anyone else's balance.

**The backend this kit was written against no longer accepts these
requests.** It now:

- requires Telegram Mini App `initData` in an `X-Telegram-Init-Data` header on
  every casino call, verifies it against the bot token, and takes the user from
  it rather than from the path or body (401 without it, 403 if the path ID is
  someone else's);
- refuses any `/play` that claims a win or sends a non-zero `payout` (501), so
  it only debits wagers until outcomes are computed server-side.

This kit never sends `X-Telegram-Init-Data`, so turning demo mode off against
that backend fails on every call. That failure is the correct behaviour until
the client changes.

## What a real-value deployment needs

Real-value use includes selling chips for Telegram Stars, any prize with
real-world value, and any cash-out. Before any of those:

1. **Server-side outcomes.** The client sends only the wager and the player's
   choice (bet colour, cash-out request), for example
   `{ game, bet_amount, choice }`. The server draws the random result, settles
   the wager, and returns the outcome and new balance for the client to
   animate. For Crash, the server holds the crash point and decides whether a
   cash-out arrived in time. The client never sends `result` or `payout`.
2. **Verified identity.** Send `Telegram.WebApp.initData` (the signed string,
   not `initDataUnsafe`) on every call. The server checks its HMAC against the
   bot token and its `auth_date` for freshness, then uses the user ID inside it.
3. **Server-held state.** Balances, rewards, loyalty-code redemptions, lottery
   entries and the leaderboard all live on the server. Today they are local or
   generated in the browser.
4. **A gambling license** wherever you operate, plus the KYC,
   responsible-gambling and anti-fraud controls that come with it. This kit
   provides none of these, and they are out of scope.

Until all four are true, keep the in-app "Play money — demo only, no real-value
prizes" notice and run the app in demo mode.
