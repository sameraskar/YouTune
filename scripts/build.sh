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

cp -R "$ROOT_DIR/prototype/." "$DIST_DIR/$PACKAGE_NAME/"
cp "$ROOT_DIR/README.md" "$DIST_DIR/$PACKAGE_NAME/README.md"
cp "$ROOT_DIR/LICENSE" "$DIST_DIR/$PACKAGE_NAME/LICENSE"

(cd "$DIST_DIR/$PACKAGE_NAME" && zip -qr "$DIST_DIR/$PACKAGE_NAME.zip" .)
rm -rf "$DIST_DIR/$PACKAGE_NAME"
printf 'Built %s\n' "$DIST_DIR/$PACKAGE_NAME.zip"
