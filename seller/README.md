# Seller Toolkit

Everything in this directory is **for you, the author** — not the buyer.

**Before zipping this repo for sale, delete `/seller/`** (or add it to your exclude list).

## Contents

- `CATALOGUE-CHECKLIST.md` — saleability scorecard. Apply this to every item in your catalogue before listing it.
- `OUTREACH.md` — copy-paste templates for Reddit posts, X threads, cold DMs, Indie Hackers launches.
- `LISTING-COPY.md` — pre-written titles, subtitles, descriptions, and tag lists for Gumroad / LemonSqueezy / CodeCanyon.
- `tools/lemonsqueezy/` — Node CLI that bulk-creates products on Lemon Squeezy from a folder of items.

## Pre-sale exclude list

When you zip the repo for buyers, exclude:

```
/seller
/node_modules
/.git
/dist
.env
```

A one-liner that does it right:

```bash
zip -r memeseal-casino-v1.0.0.zip . \
  -x "node_modules/*" "dist/*" ".git/*" ".env" "seller/*"
```
