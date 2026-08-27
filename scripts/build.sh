#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DIST_DIR="$ROOT_DIR/dist"
PACKAGE_NAME="youtune-${1:-dev}"

rm -rf "$DIST_DIR"
mkdir -p "$DIST_DIR/$PACKAGE_NAME"

node --check "$ROOT_DIR/prototype/background.js"
node --check "$ROOT_DIR/prototype/content.js"
node --check "$ROOT_DIR/prototype/popup.js"
node --check "$ROOT_DIR/prototype/options.js"
node "$ROOT_DIR/prototype/validate-extension.mjs"
node "$ROOT_DIR/lab/test-dsp.mjs"

cp "$ROOT_DIR/prototype/manifest.json" "$DIST_DIR/$PACKAGE_NAME/manifest.json"
cp "$ROOT_DIR/prototype/background.js" "$DIST_DIR/$PACKAGE_NAME/background.js"
cp "$ROOT_DIR/prototype/content.js" "$DIST_DIR/$PACKAGE_NAME/content.js"
cp "$ROOT_DIR/prototype/popup.html" "$DIST_DIR/$PACKAGE_NAME/popup.html"
cp "$ROOT_DIR/prototype/popup.js" "$DIST_DIR/$PACKAGE_NAME/popup.js"
cp "$ROOT_DIR/prototype/presets.js" "$DIST_DIR/$PACKAGE_NAME/presets.js"
cp "$ROOT_DIR/prototype/options.html" "$DIST_DIR/$PACKAGE_NAME/options.html"
cp "$ROOT_DIR/prototype/options.js" "$DIST_DIR/$PACKAGE_NAME/options.js"
cp -R "$ROOT_DIR/prototype/icons" "$DIST_DIR/$PACKAGE_NAME/icons"

(cd "$DIST_DIR/$PACKAGE_NAME" && zip -qr "$DIST_DIR/$PACKAGE_NAME.zip" .)
rm -rf "$DIST_DIR/$PACKAGE_NAME"
printf 'Built %s\n' "$DIST_DIR/$PACKAGE_NAME.zip"
