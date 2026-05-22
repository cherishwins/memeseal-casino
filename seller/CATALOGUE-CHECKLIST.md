# Catalogue Saleability Checklist

Run every item in your catalogue through this scorecard **before** spending time listing it. Anything below 7/10 will refund-fight you to death — fix it or skip it.

## The 10-point scorecard

Score 1 point each. Total below 7 = not ready.

1. **Runs in one command.** Buyer can clone, `npm install`, `npm run dev` (or equivalent), and see the thing work. No env vars, no API keys, no databases required for first run.
2. **No author-specific secrets.** No hardcoded analytics tokens, API keys, account IDs, vercel project URLs, or `localhost` references left in. (This was the #1 problem with the casino — the analytics token leaked to every buyer.)
3. **README is buyer-facing.** First line answers "what is this and why would I buy it". Has a feature table. Has install steps. Has customization guide. NOT a dev journal.
4. **License file present.** Standard / Extended / White-label tiers spelled out. Buyer understands what they can/can't do.
5. **Live demo URL.** Deployed somewhere free (Vercel, Netlify, Render). Shareable in 1 click. Doubles your conversion rate vs screenshots alone.
6. **6+ screenshots OR a 30s video.** Hero shot, key feature, mobile view, dark/light if applicable. Plus the demo URL above.
7. **No half-finished features.** Anything mentioned in the README must actually work in the demo. Remove TODO comments, dead routes, commented-out blocks.
8. **Production build succeeds without warnings.** No bundle-size warnings, no console errors on demo page, no broken images.
9. **Themable / configurable.** At minimum, brand name + colors in env vars or one config file. Buyers re-skinning your work is a feature.
10. **Up-to-date dependencies.** No CVE-flagged packages, no React 17, no Node 14. `npm audit` clean.

## Per-item file structure (recommended)

```
items/
  casino-template/
    src/                     # the actual product
    seller/                  # author-only, EXCLUDED FROM ZIP
      manifest.json          # for the bulk uploader
      screenshots/           # 6+ images
      demo.mp4               # 30s recording
      LISTING.md             # the listing copy for this item
    README.md
    LICENSE.md
    .env.example
    package.json
```

## Pricing rule-of-thumb

- **Small utility, single-file, <500 LOC:** $9–$19
- **Component / hook / single-feature kit:** $29–$49
- **Full app starter (this casino tier):** $59–$99
- **App + admin dashboard + backend:** $149–$249
- **White-label rights on top of any tier:** +5–10x base price

Anchor at the upper end. Discounting later is easy; raising prices on a listing with no sales is harder.

## What to skip listing

Items that score below 7 — fix them first. Specifically, if any of these are true, **do not list**:

- Requires a paid 3rd-party service to run the demo (Firebase Blaze, paid API key, paid SaaS).
- Hardcoded to a specific deployment URL the buyer can't change.
- Includes binary assets you don't own the license for (stock photos, paid fonts, copyrighted characters).
- Game / casino / gambling content marketed as real-money — most marketplaces ban this regardless of jurisdiction. Sell it as "template / educational / demo" only.
- Anything that needs a >100MB asset bundle. Marketplaces have upload limits.

## Order to list in

1. Highest-score item first. It builds your reviews/ratings, which lift everything else you list later.
2. The one with the most search demand (run the title past `keywords.io` or just check what's already listed and selling on Gumroad).
3. Bundles last — once you have 3+ individual sellers, package 2 of them at a 20% discount.
