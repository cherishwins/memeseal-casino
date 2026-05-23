#!/usr/bin/env bash
# Package the repo into a clean buyer-ready zip.
# Excludes /seller, /node_modules, /dist, /.git, .env files.
#
# Usage: ./seller/tools/package-for-sale.sh [version]
# Output: ./memeseal-casino-vX.Y.Z.zip

set -euo pipefail

VERSION="${1:-1.0.0}"
REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
OUT="${REPO_ROOT}/memeseal-casino-v${VERSION}.zip"

cd "$REPO_ROOT"

if [ -f "$OUT" ]; then
  echo "Removing existing $OUT"
  rm "$OUT"
fi

echo "Packaging $REPO_ROOT -> $OUT"

zip -r "$OUT" . \
  -x "node_modules/*" \
  -x "dist/*" \
  -x ".git/*" \
  -x ".env" \
  -x ".env.local" \
  -x ".vercel/*" \
  -x "seller/*" \
  -x "SALES.md" \
  -x "*.zip" \
  -x ".DS_Store" \
  -x "*/.DS_Store"

echo ""
echo "Done. Sanity check:"
unzip -l "$OUT" | grep -E "(seller/|node_modules/|\.env$|\.git/)" || echo "  ✓ no excluded paths leaked"
echo ""
echo "Final size:"
ls -lh "$OUT" | awk '{print "  " $5 "  " $9}'
echo ""
echo "Upload $OUT to Gumroad / LemonSqueezy."
