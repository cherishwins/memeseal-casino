/**
 * Generates PNG brand icons from SVG sources.
 * Run once: node scripts/generate-brand-icons.mjs
 * Requires: npm install --save-dev sharp
 */
import sharp from 'sharp';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pub = (f) => resolve(__dirname, '../public', f);

const monogram = readFileSync(pub('icon-monogram.svg'));
const touchIcon = readFileSync(pub('apple-touch-icon.svg'));
const ogImage   = readFileSync(pub('og-image.svg'));
const houseOg   = readFileSync(pub('og-image-the-house.svg'));

const jobs = [
  // Favicons
  { src: monogram,  out: pub('favicon-16x16.png'),  w: 16,   h: 16   },
  { src: monogram,  out: pub('favicon-32x32.png'),  w: 32,   h: 32   },
  { src: monogram,  out: pub('favicon-48x48.png'),  w: 48,   h: 48   },
  // Apple touch icon
  { src: touchIcon, out: pub('apple-touch-icon.png'), w: 180, h: 180 },
  // PWA icons
  { src: monogram,  out: pub('icon-192x192.png'),   w: 192,  h: 192  },
  { src: monogram,  out: pub('icon-512x512.png'),   w: 512,  h: 512  },
  // OG images
  { src: ogImage,   out: pub('og-image.png'),       w: 1200, h: 630  },
  { src: houseOg,   out: pub('og-image-the-house.png'), w: 1200, h: 630 },
];

console.log('▲ Generating brand icons...\n');

for (const { src, out, w, h } of jobs) {
  await sharp(src).resize(w, h).png().toFile(out);
  console.log(`  ✓ ${out.split('/').pop()} (${w}×${h})`);
}

console.log('\n▲ Done. All icons generated in /public.\n');
