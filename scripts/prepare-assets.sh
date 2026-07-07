#!/usr/bin/env bash
set -euo pipefail

REPO="/Users/jan/Documents/Claude/zllhff.github.io"
mkdir -p "$REPO/assets/icons"
for app in faro roll kept shin vow; do
  mkdir -p "$REPO/assets/screenshots/$app/de" "$REPO/assets/screenshots/$app/en"
done

# --- Icons ---
# Sources from .xcarchive builds are Apple-optimized PNGs (CgBI chunk), which
# standard browsers cannot render. Re-encode through `sips -s format png` to
# strip CgBI and produce a standard PNG. The Vow source (Debug simulator
# build) is already a standard PNG, but is re-encoded too for consistency.
icon() {
  local src="$1" dest="$2"
  sips -s format png "$src" --out "$dest" >/dev/null
}
icon "/Users/jan/Documents/Claude/Faro/build/Faro.xcarchive/Products/Applications/Faro.app/Faro60x60@2x.png" \
  "$REPO/assets/icons/faro.png"
icon "/Users/jan/Documents/Claude/roll/.asc/artifacts/Roll-IOS-1.2.0-1.xcarchive/Products/Applications/Roll.app/AppIcon60x60@2x.png" \
  "$REPO/assets/icons/roll.png"
icon "/Users/jan/Documents/Claude/kept app/release/Filed.xcarchive/Products/Applications/Filed.app/AppIcon60x60@2x.png" \
  "$REPO/assets/icons/kept.png"
icon "/Users/jan/Documents/Claude/shin app/.asc/artifacts/Shin-1.2.1-11.xcarchive/Products/Applications/shin.app/AppIcon60x60@2x.png" \
  "$REPO/assets/icons/shin.png"
icon "/Users/jan/Documents/Claude/Still/build/Build/Products/Debug-iphonesimulator/Still.app/AppIcon60x60@2x.png" \
  "$REPO/assets/icons/vow.png"

# --- Screenshots: resize to 480px width, convert to JPEG quality 82 ---
resize() {
  local src="$1" dest="$2"
  sips -s format jpeg -s formatOptions 82 --resampleWidth 480 "$src" --out "$dest" >/dev/null
}

FARO_SRC_DE="/Users/jan/Documents/Claude/Faro/store_assets/screenshots/de-DE"
FARO_SRC_EN="/Users/jan/Documents/Claude/Faro/store_assets/screenshots/en-US"
resize "$FARO_SRC_DE/01-hero.png"      "$REPO/assets/screenshots/faro/de/1.jpg"
resize "$FARO_SRC_DE/04-challenge.png" "$REPO/assets/screenshots/faro/de/2.jpg"
resize "$FARO_SRC_DE/05a-atlas.png"    "$REPO/assets/screenshots/faro/de/3.jpg"
resize "$FARO_SRC_EN/01-hero.png"      "$REPO/assets/screenshots/faro/en/1.jpg"
resize "$FARO_SRC_EN/04-challenge.png" "$REPO/assets/screenshots/faro/en/2.jpg"
resize "$FARO_SRC_EN/05a-atlas.png"    "$REPO/assets/screenshots/faro/en/3.jpg"

ROLL_SRC_DE="/Users/jan/Documents/Claude/roll/store_assets/screenshots/de/raw"
ROLL_SRC_EN="/Users/jan/Documents/Claude/roll/store_assets/screenshots/en/raw"
resize "$ROLL_SRC_DE/scene-01-hero.png"       "$REPO/assets/screenshots/roll/de/1.jpg"
resize "$ROLL_SRC_DE/scene-02-cleanup.png"    "$REPO/assets/screenshots/roll/de/2.jpg"
resize "$ROLL_SRC_DE/scene-04-fullscreen.png" "$REPO/assets/screenshots/roll/de/3.jpg"
resize "$ROLL_SRC_EN/scene-01-hero.png"       "$REPO/assets/screenshots/roll/en/1.jpg"
resize "$ROLL_SRC_EN/scene-02-cleanup.png"    "$REPO/assets/screenshots/roll/en/2.jpg"
resize "$ROLL_SRC_EN/scene-04-fullscreen.png" "$REPO/assets/screenshots/roll/en/3.jpg"

KEPT_SRC="/Users/jan/Documents/Claude/kept app/docs/asc/screenshots-raw"
resize "$KEPT_SRC/iphone69_de_library.png" "$REPO/assets/screenshots/kept/de/1.jpg"
resize "$KEPT_SRC/iphone69_de_actions.png" "$REPO/assets/screenshots/kept/de/2.jpg"
resize "$KEPT_SRC/iphone69_de_search.png"  "$REPO/assets/screenshots/kept/de/3.jpg"
resize "$KEPT_SRC/iphone69_en_library.png" "$REPO/assets/screenshots/kept/en/1.jpg"
resize "$KEPT_SRC/iphone69_en_actions.png" "$REPO/assets/screenshots/kept/en/2.jpg"
resize "$KEPT_SRC/iphone69_en_search.png"  "$REPO/assets/screenshots/kept/en/3.jpg"

SHIN_SRC_DE="/Users/jan/Documents/Claude/shin app/store_assets/screenshots/de-DE"
SHIN_SRC_EN="/Users/jan/Documents/Claude/shin app/store_assets/screenshots/en-US"
resize "$SHIN_SRC_DE/6_9_01_hero.png"   "$REPO/assets/screenshots/shin/de/1.jpg"
resize "$SHIN_SRC_DE/6_9_02_today.png"  "$REPO/assets/screenshots/shin/de/2.jpg"
resize "$SHIN_SRC_DE/6_9_05_letter.png" "$REPO/assets/screenshots/shin/de/3.jpg"
resize "$SHIN_SRC_EN/6_9_01_hero.png"   "$REPO/assets/screenshots/shin/en/1.jpg"
resize "$SHIN_SRC_EN/6_9_02_today.png"  "$REPO/assets/screenshots/shin/en/2.jpg"
resize "$SHIN_SRC_EN/6_9_05_letter.png" "$REPO/assets/screenshots/shin/en/3.jpg"

echo "Done. Vow screenshots are NOT handled by this script (no existing source), see Task 3 Step 3 of the plan."
