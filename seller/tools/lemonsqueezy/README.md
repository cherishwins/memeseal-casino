# Lemon Squeezy Bulk Uploader

A small Node CLI that creates Lemon Squeezy products in bulk from a folder of items. Each item is a directory containing a `manifest.json` and optional asset files.

Why this exists: Gumroad and Envato have no public create-product API. Lemon Squeezy does. If you have a catalogue to list, this saves you hours of clicking.

## What it does

For each `items/<name>/manifest.json` it:

1. Creates a **Product** on Lemon Squeezy with your name, description, status.
2. Creates one or more **Variants** (e.g. Standard / Extended / White-label tiers).
3. Sets pricing on each variant.
4. Optionally uploads cover images and downloadable files.
5. Writes the resulting URLs back to `manifest.lock.json` so you can re-run without duplicating.

It does **not**:

- Publish items live by default (status is `draft` — you flip to `published` in the dashboard after reviewing).
- Touch payouts, tax, or store settings.
- Delete anything.

## Setup

```bash
cd seller/tools/lemonsqueezy
npm install   # no external deps; this is a no-op but creates the lockfile
```

Set two env vars:

```bash
export LS_API_KEY=sk_live_or_test_xxxxxxxx
export LS_STORE_ID=12345
```

Get your API key here: https://app.lemonsqueezy.com/settings/api
Get your store ID by listing stores: `curl -H "Authorization: Bearer $LS_API_KEY" https://api.lemonsqueezy.com/v1/stores` and grab `data[0].id`.

## Folder layout

```
items/
  casino-template/
    manifest.json
    cover.png              (optional, 1280x800 recommended)
    download.zip           (optional, the actual product file)
  other-product/
    manifest.json
```

A starter `items.example/casino-template/manifest.json` is included.

## manifest.json schema

```json
{
  "name": "Telegram Mini App Casino Template",
  "description": "Markdown supported. Production-ready React + TON Connect casino kit. 3 games, lottery, loyalty cards, demo mode. Deploys to Vercel in 5 minutes.",
  "status": "draft",
  "thank_you_note": "Thanks for your purchase! Open README.md to get started.",
  "variants": [
    { "name": "Standard",    "price_cents": 7900,  "description": "Use in one project." },
    { "name": "Extended",    "price_cents": 24900, "description": "Use in up to 5 client projects." },
    { "name": "White-label", "price_cents": 89900, "description": "Resale rights + 30 days priority support." }
  ],
  "cover": "./cover.png",
  "files": ["./download.zip"]
}
```

## Run it

```bash
# Dry run (prints what it WOULD do, makes no API calls)
node index.js --dry --items ./items

# Real run
node index.js --items ./items

# Re-run safely (skips items already in manifest.lock.json)
node index.js --items ./items
```

After it finishes:

1. Log into https://app.lemonsqueezy.com → Products
2. Review each draft, add screenshots / cover if you skipped them
3. Flip status to **Published**

## Rate limits

Lemon Squeezy's documented rate limit is 300 requests / minute. The CLI sleeps 250 ms between calls to stay well under that. For catalogues > 50 items, increase `--throttle 500` to be safe.

## Caveats

- Variant pricing requires a base **Price** object — the script handles this for you.
- File uploads use Lemon Squeezy's signed-URL flow (two-step). The script handles it.
- If a manifest has no `files`, the product will be created but won't be purchasable until you upload a file in the dashboard.
- The API can change. If something breaks, check https://docs.lemonsqueezy.com/api.
