# MEMESEAL CASINO — Engagement Strategy

A practical retention & growth playbook for the Telegram Mini App. Built around six loops that compound: **acquire → activate → habituate → monetize → reactivate → refer.**

---

## 0. North-Star metrics

Pick three. Hold the team to them.

| Metric | Target | Why |
| --- | --- | --- |
| **D1 / D7 / D30 retention** | 40% / 18% / 8% | Telegram mini-app benchmark for casual games |
| **Sessions per DAU** | ≥ 3.0 | Habit signal — proves the daily-reward loop works |
| **K-factor (viral coefficient)** | ≥ 0.4 | One invite per 2.5 players → growth without paid acquisition |

Everything below is in service of moving these three.

---

## 1. First-session activation (0 → 60 sec)

The first minute decides everything. Three jobs in this order:

1. **Land in a game, not a menu.** Auto-route a brand-new user to a single free pull on Slots. Symbols spin, a small win drops, the chip counter ticks up. They see the loop before they choose anything.
2. **Welcome bonus visible above the fold.** "500 free chips + 5 days of bonuses waiting" — quantified, time-boxed, scarce.
3. **One clear next action.** A single CTA: `CLAIM DAY 1 +100`. No wallet prompt, no theme picker, no tutorial wall.

**What to avoid**: KYC / wallet-connect / theme-picker as the first screen. Every gate before the first spin halves activation.

---

## 2. Daily-reward streak loop (the engine)

Login bonuses are not "nice to have" — they are the **single highest-leverage retention mechanic** in this category. The implementation in `src/components/engagement/DailyReward.jsx` follows the standard 7-day escalator with a streak multiplier.

### Reward ladder

| Day | Base chips | Streak bonus | Total |
| --- | --- | --- | --- |
| 1 | 100 | — | 100 |
| 2 | 150 | — | 150 |
| 3 | 250 | — | 250 |
| 4 | 400 | — | 400 |
| 5 | 600 | — | 600 |
| 6 | 900 | — | 900 |
| 7 | **2,000** + 1 lottery ticket | — | **2,000 + 🎟** |
| 8+ | Cycle repeats | +10% per streak week (cap 50%) | scales |

### Streak rules

- **24-hour window**: claim resets at user's local midnight (UTC-offset from Telegram).
- **One free recovery**: if a streak breaks, the user can "freeze" it once per 30 days. Surfaces as a feature, not a punishment.
- **Visible everywhere**: streak counter sits in the header (`StreakBadge`) so the cost of skipping a day is always one tap away.

### Why this works

The day-7 jackpot is what users actually optimize for; the day-1 reward is just how you start them on the track. Re-engagement push: "you're 1 day away from your 2,000-chip reward 🐸" outperforms generic "come play" by ~3×.

---

## 3. Quest system (session depth)

Streaks pull users back. **Quests pull them deeper into a session.** The `Quests.jsx` panel ships with three tiers:

### Daily (resets every 24h)

| Quest | Reward |
| --- | --- |
| Play 5 rounds (any game) | 50 chips |
| Win 3 rounds in a row | 100 chips |
| Bet 500 chips total | 75 chips |

### Weekly (resets every Monday)

| Quest | Reward |
| --- | --- |
| Play all 3 games | 500 chips |
| Hit a 5×+ multiplier on Crash | 1 lottery ticket |
| Get a 3-of-a-kind on Slots | 1,000 chips |

### Lifetime / Achievements

Shown in `Achievements.jsx`. Permanent badges, low-frequency dopamine, social proof on the profile. Examples:

- **First Blood** — first win
- **Diamond Hands** — cashed Crash above 10×
- **Frog God** — hit the triple-PEPE jackpot
- **Whale** — single bet of 1,000+ chips
- **OG** — 30-day streak

### Design rules

- Cap visible quests at 3 daily + 2 weekly. More than that overwhelms and reads as a chore.
- Show progress bars, not just "0/5" — a half-full bar is the gambler's fallacy in your favor.
- Auto-claim rewards on session start so the user sees a notification and a chip bump, not a button to click.

---

## 4. Big-win celebration (`WinCelebration.jsx`)

The most underrated retention mechanic in this category is **rewarding the player's nervous system, not their wallet.** Implementation:

- Trigger condition: any payout ≥ 5× bet, jackpot, or Crash cash-out > 10×.
- Full-screen overlay, ~1.8 sec total: scale-in from win source → confetti burst → final value count-up → fade.
- Haptic feedback via `window.Telegram.WebApp.HapticFeedback.notificationOccurred('success')`.
- "Share your win" CTA appears at the end — pre-fills a Telegram share URL with the user's referral code (see §6).

Why bother: video poker / slots data consistently shows that **win celebration intensity correlates with session length more than payout size does.** A 20× win that arrives quietly performs worse than a 5× win with confetti.

---

## 5. Leaderboards (social proof + competition)

`Leaderboard.jsx` shows three tabs:

1. **Today's Top Winners** (resets daily, midnight UTC)
2. **All-Time Whales** (lifetime profit)
3. **Streak Kings** (longest active login streak)

### Mechanics

- Top 10 only — beyond 10 is noise. Show "You: rank #237" at the bottom of the user's list.
- Anonymized usernames (`PEPE_***42`) unless the user opts in to display their Telegram handle.
- Top 3 of the daily leaderboard get a chip bonus at midnight (250 / 100 / 50). Cheap, but the *anticipation* drives evening play.
- Friend leaderboard mode: filter to "people my referral tree" — turns referrals into a competitive loop, not just a one-shot bonus.

### Anti-pattern to avoid

Don't show absolute chip counts on the leaderboard. It reveals the house edge and discourages new players from competing. Show **profit %, streak length, or win count.**

---

## 6. Referral loop (`ReferralCard.jsx`)

The K-factor target (≥ 0.4) lives or dies here. Telegram's deep-link infrastructure makes this nearly free — use it.

### Mechanic

- Every user gets a unique referral code (`?ref=<userId>`) baked into a shareable Telegram link.
- **Inviter** gets 200 chips when invitee plays their first round, +5% of invitee's lifetime chip purchases (paid out in chips, capped).
- **Invitee** gets 250 bonus chips on signup (vs. the default 500 → bumped to 750 with code).

### Why two-sided > one-sided

Asymmetric (only inviter rewarded) converts at 3-8%. Two-sided rewards convert at 12-22%. The extra cost is the cheapest user-acquisition channel you have.

### Make sharing one tap

- Pre-filled share message: *"I just hit 50× on Frog Rocket 🚀 Get 250 free chips: [link]"*
- Use the Telegram Web App `shareUrl` API — keeps the share in-app instead of bouncing to OS share sheet.
- Show the inviter their **referral count + total chips earned** in `ReferralCard` so the loop has a visible ROI.

---

## 7. Push & re-engagement (Telegram bot side)

Mini-apps can't push notifications directly — your **bot** has to. Three-touchpoint cadence:

| Trigger | Timing | Message |
| --- | --- | --- |
| Streak about to break | Hour 22 of the 24h window | *"⏰ Your day-{N} streak expires in 2 hours. Worth {2000} chips on day 7."* |
| Pot crosses a milestone | 5k / 10k / 25k Stars | *"🏆 Lottery pot just crossed {N}. Drawing in {hours}h."* |
| Inactive 3 / 7 / 14 days | Decaying frequency | Day 3: free 200 chips. Day 7: free 500 + 1 lottery ticket. Day 14: "come back" deal. |

Cap at **one push per 24h** per user across all triggers. The mute rate doubles for every additional ping. Let users disable push categories independently — gives you a softer alternative to "mute the bot."

---

## 8. Monetization tie-ins

Engagement features are only worth what they unlock in revenue.

| Feature | Monetization hook |
| --- | --- |
| Daily streak | Day-7 reward includes lottery ticket → makes the 20% pot cut worth more to repeat users |
| Quests | Reward in chips, not Stars. Increases bet volume → more Stars purchased to refill |
| Big-win celebration | "Share your win" share-CTA = K-factor lift = lower CAC |
| Leaderboard | Top-3 chip bonus paid on midnight reset → guaranteed evening play window |
| Achievements | Visible profile badges = social currency = whales optimize for it |
| Referrals | 5% lifetime cut paid in chips, not Stars → costs less than it returns once K > 0.3 |

### Pricing nudges to add to `BuyChipsModal`

- **Streak-saver pack**: 200 Stars → 250 chips + "freeze your streak for 48 hours." Sold at the moment a streak is about to break (highest willingness to pay you'll ever see).
- **Quest skip**: 50 Stars → instant-complete a daily quest. Sold to users at quest 2/3 the day before reset.
- **Lottery ticket bundle**: 100 Stars → 5 lottery tickets directly. Bypasses the bet-to-feed-pot mechanic for whales.

---

## 9. Soft-launch experiments (in priority order)

Ship the foundation, then earn each addition with an A/B test.

1. **Daily reward modal on app open** — expect +25% D7. Highest-leverage thing in this doc. Ship first.
2. **Big-win celebration** — expect +15% session length. Ship second.
3. **Three daily quests** — expect +20% sessions/DAU. Ship third.
4. **Referral two-sided bonus** — expect K-factor +0.15. Ship after the first three are proven.
5. **Leaderboard top-3 chip bonus** — measure evening-hours DAU shift. Easy to instrument.
6. **Streak-saver pack** — pure revenue lift. Watch user sentiment closely; it shouldn't feel predatory.

Each experiment: 7-day hold-out, 95% significance, ≥ 1,000 DAU sample. If a feature doesn't beat control, **delete it** — don't leave dead UI in the lobby.

---

## 10. What to measure per feature

| Feature | Primary metric | Guardrail |
| --- | --- | --- |
| Daily reward | Day-7 claim rate | Day-1 → Day-2 retention shouldn't drop |
| Quests | Quests completed per DAU | Bet volume / DAU shouldn't fall (proves they didn't just grind quests instead of playing) |
| Win celebration | Session length post-trigger | Crash rate of the mini-app (it's a heavy animation) |
| Leaderboard | Daily leaderboard view rate | Churn of rank-100+ users (don't punish the long tail) |
| Referrals | K-factor | Fraud rate (multi-account farming) |
| Push | CTR | Mute rate (cap at 4% / month) |

---

## 11. Files in this branch

- `docs/ENGAGEMENT_STRATEGY.md` — this document
- `src/stores/engagementStore.js` — Zustand store for streaks, quests, achievements, referrals
- `src/components/engagement/DailyReward.jsx` — 7-day login modal
- `src/components/engagement/StreakBadge.jsx` — header streak chip
- `src/components/engagement/Quests.jsx` — daily/weekly quest panel
- `src/components/engagement/Achievements.jsx` — lifetime badge grid
- `src/components/engagement/Leaderboard.jsx` — top-10 board with tabs
- `src/components/engagement/WinCelebration.jsx` — big-win overlay
- `src/components/engagement/ReferralCard.jsx` — invite + earn
- `src/components/engagement/EngagementHub.jsx` — tabbed container wiring the above
- `public/banners/*.svg` — marketing assets sized for Telegram / X / Discord

---

## TL;DR

Ship the daily streak first. Everything else is leverage on top of a working habit loop. If users don't come back tomorrow, no quest, achievement, or referral will save you. Get the streak right, then build outward.
