#!/usr/bin/env node
// Lemon Squeezy bulk product uploader.
//
// Usage: node index.js --items ./items [--dry] [--throttle 250]
//
// Reads each items/<name>/manifest.json, creates Product + Variants + Prices on
// Lemon Squeezy, writes results back to items/<name>/manifest.lock.json so re-runs
// are idempotent.

import { readFile, writeFile, readdir, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { argv, env, exit } from 'node:process';

const API = 'https://api.lemonsqueezy.com/v1';

function parseArgs(args) {
  const out = { items: './items', dry: false, throttle: 250 };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--items') out.items = args[++i];
    else if (a === '--dry') out.dry = true;
    else if (a === '--throttle') out.throttle = Number(args[++i]) || 250;
    else if (a === '--help' || a === '-h') {
      console.log('Usage: node index.js --items ./items [--dry] [--throttle 250]');
      exit(0);
    }
  }
  return out;
}

function need(name) {
  const v = env[name];
  if (!v) { console.error(`Missing env var: ${name}`); exit(1); }
  return v;
}

async function api(method, path, body, token) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`${method} ${path} -> ${res.status}: ${text}`);
  }
  return text ? JSON.parse(text) : null;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function listItems(itemsDir) {
  const entries = await readdir(itemsDir, { withFileTypes: true });
  const dirs = entries.filter((e) => e.isDirectory()).map((e) => e.name);
  const items = [];
  for (const name of dirs) {
    const manifestPath = join(itemsDir, name, 'manifest.json');
    try {
      const raw = await readFile(manifestPath, 'utf8');
      const manifest = JSON.parse(raw);
      const lockPath = join(itemsDir, name, 'manifest.lock.json');
      let lock = null;
      try { lock = JSON.parse(await readFile(lockPath, 'utf8')); } catch { /* no lock yet */ }
      items.push({ name, dir: join(itemsDir, name), manifest, lock, lockPath });
    } catch (e) {
      console.warn(`! Skipping ${name}: ${e.message}`);
    }
  }
  return items;
}

async function createProduct(storeId, manifest, token) {
  const body = {
    data: {
      type: 'products',
      attributes: {
        name: manifest.name,
        description: manifest.description || '',
        status: manifest.status || 'draft',
        thank_you_note: manifest.thank_you_note || null,
      },
      relationships: {
        store: { data: { type: 'stores', id: String(storeId) } },
      },
    },
  };
  const res = await api('POST', '/products', body, token);
  return res.data;
}

async function createVariant(productId, variant, token) {
  const body = {
    data: {
      type: 'variants',
      attributes: {
        name: variant.name,
        description: variant.description || '',
        is_subscription: false,
      },
      relationships: {
        product: { data: { type: 'products', id: String(productId) } },
      },
    },
  };
  const res = await api('POST', '/variants', body, token);
  return res.data;
}

async function createPrice(variantId, priceCents, token) {
  const body = {
    data: {
      type: 'prices',
      attributes: {
        category: 'one_time',
        scheme: 'standard',
        usage_aggregation: null,
        unit_price: priceCents,
        tax_code: 'eservice',
      },
      relationships: {
        variant: { data: { type: 'variants', id: String(variantId) } },
      },
    },
  };
  const res = await api('POST', '/prices', body, token);
  return res.data;
}

async function processItem(storeId, item, token, opts) {
  if (item.lock?.productId) {
    console.log(`✓ ${item.name} — already created (product ${item.lock.productId}), skipping`);
    return item.lock;
  }

  console.log(`→ ${item.name}`);

  if (opts.dry) {
    console.log(`  [dry] would create product: ${item.manifest.name}`);
    for (const v of item.manifest.variants || []) {
      console.log(`  [dry]   variant: ${v.name} @ $${(v.price_cents / 100).toFixed(2)}`);
    }
    return { dry: true };
  }

  const product = await createProduct(storeId, item.manifest, token);
  await sleep(opts.throttle);

  const variantResults = [];
  for (const v of item.manifest.variants || []) {
    const variant = await createVariant(product.id, v, token);
    await sleep(opts.throttle);
    const price = await createPrice(variant.id, v.price_cents, token);
    await sleep(opts.throttle);
    variantResults.push({
      name: v.name,
      variantId: variant.id,
      priceId: price.id,
      priceCents: v.price_cents,
    });
    console.log(`  ✓ variant ${v.name} → $${(v.price_cents / 100).toFixed(2)} (id ${variant.id})`);
  }

  const lock = {
    productId: product.id,
    productUrl: product.attributes?.buy_now_url || product.links?.self || null,
    productName: item.manifest.name,
    variants: variantResults,
    createdAt: new Date().toISOString(),
  };

  await writeFile(item.lockPath, JSON.stringify(lock, null, 2));
  console.log(`  ✓ product created (id ${product.id}), wrote ${item.lockPath}`);
  return lock;
}

async function main() {
  const opts = parseArgs(argv.slice(2));
  const itemsDir = resolve(opts.items);

  try {
    const s = await stat(itemsDir);
    if (!s.isDirectory()) throw new Error('not a directory');
  } catch {
    console.error(`Items directory not found: ${itemsDir}`);
    console.error(`Pass --items <dir>, or copy items.example/ to items/ to get started.`);
    exit(1);
  }

  const token = opts.dry ? 'dry-run' : need('LS_API_KEY');
  const storeId = opts.dry ? 'dry-run' : need('LS_STORE_ID');

  if (!opts.dry) {
    try { await api('GET', '/stores', null, token); }
    catch (e) { console.error(`API auth failed: ${e.message}`); exit(1); }
    console.log(`✓ Authenticated with Lemon Squeezy (store ${storeId})`);
  } else {
    console.log('[dry run — no API calls will be made]');
  }

  const items = await listItems(itemsDir);
  if (!items.length) {
    console.error(`No items found in ${itemsDir}`);
    exit(1);
  }
  console.log(`Found ${items.length} item(s)\n`);

  let created = 0;
  let skipped = 0;
  for (const item of items) {
    try {
      const result = await processItem(storeId, item, token, opts);
      if (result.dry || !result.productId) skipped++;
      else if (result.createdAt) created++;
      else skipped++;
    } catch (e) {
      console.error(`✗ ${item.name}: ${e.message}`);
    }
  }

  console.log(`\nDone. ${created} created, ${skipped} skipped/dry.`);
  if (created > 0) {
    console.log(`\nNext steps:`);
    console.log(`  1. Visit https://app.lemonsqueezy.com → Products`);
    console.log(`  2. Add cover image and downloadable file to each draft`);
    console.log(`  3. Flip status from "draft" to "published"`);
  }
}

main().catch((e) => { console.error(e); exit(1); });
