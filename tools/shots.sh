#!/usr/bin/env bash
# shots.sh: render index.html with headless Chrome under a throwaway profile, so a Worker can see the page
# without a signed-in browser. Writes shots/page-320.png (phone width), shots/page-1280.png (desktop) and
# shots/page.pdf (the print style). Run from the repo root: npm run shots (or bash tools/shots.sh).
set -euo pipefail
page="$PWD/index.html"
[ -f "$page" ] || { echo "shots: no index.html in $PWD" >&2; exit 1; }
chrome=""
for c in "${CHROME:-}" "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" google-chrome google-chrome-stable chromium chromium-browser; do
  [ -n "$c" ] && command -v "$c" >/dev/null 2>&1 && { chrome=$c; break; }
done
[ -n "$chrome" ] || { echo "shots: no Chrome or Chromium found (set CHROME to its path)" >&2; exit 1; }
profile=$(mktemp -d); trap 'rm -rf "$profile"' EXIT
mkdir -p shots
run() { "$chrome" --headless=new --user-data-dir="$profile" --no-first-run --disable-extensions --hide-scrollbars "$@" "file://$page" >/dev/null 2>&1; }
# Headless Chrome won't make a window narrower than about 500px, so the phone shot loads the page in a
# 320px-wide iframe centred in a 500px window, and crops the middle 320px (sips crops from the centre; on a
# machine without sips the 500px shot is kept).
printf '<!doctype html><body style="margin:0;background:#fff"><iframe src="file://%s" style="border:0;width:320px;height:2400px;margin-left:90px"></iframe>' "$page" > "$profile/phone.html"
"$chrome" --headless=new --user-data-dir="$profile" --no-first-run --disable-extensions --hide-scrollbars --allow-file-access-from-files --window-size=500,2400 --screenshot="$PWD/shots/page-320.png" "file://$profile/phone.html" >/dev/null 2>&1
command -v sips >/dev/null 2>&1 && sips -c 2400 320 "$PWD/shots/page-320.png" >/dev/null 2>&1 || true
run --window-size=1280,2000 --screenshot="$PWD/shots/page-1280.png"
run --no-pdf-header-footer --print-to-pdf="$PWD/shots/page.pdf"
ls -l shots/page-320.png shots/page-1280.png shots/page.pdf
