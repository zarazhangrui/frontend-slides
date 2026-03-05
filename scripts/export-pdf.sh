#!/usr/bin/env bash
set -euo pipefail

# Usage: export-pdf.sh input.html [output.pdf]

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 input.html [output.pdf]" >&2
  exit 1
fi

INPUT="$1"
if [[ ! -f "$INPUT" ]]; then
  echo "Input file not found: $INPUT" >&2
  exit 1
fi

if [[ $# -ge 2 ]]; then
  OUTPUT="$2"
else
  OUTPUT="${INPUT%.*}.pdf"
fi

abs_path() {
  python3 - <<'PY' "$1"
import os,sys
print(os.path.abspath(sys.argv[1]))
PY
}

INPUT_ABS="$(abs_path "$INPUT")"
OUTPUT_ABS="$(abs_path "$OUTPUT")"
INPUT_URL="file://${INPUT_ABS}"

# Find a Chromium-based browser
BROWSER=""
for candidate in \
  "${CHROME_BIN:-}" \
  "$(command -v google-chrome || true)" \
  "$(command -v chromium || true)" \
  "$(command -v chromium-browser || true)" \
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"; do
  if [[ -n "$candidate" && -x "$candidate" ]]; then
    BROWSER="$candidate"
    break
  fi
done

if [[ -z "$BROWSER" ]]; then
  echo "No Chromium-based browser found. Set CHROME_BIN or install Chrome/Chromium." >&2
  exit 1
fi

"$BROWSER" \
  --headless \
  --disable-gpu \
  --run-all-compositor-stages-before-draw \
  --virtual-time-budget=12000 \
  --print-to-pdf="$OUTPUT_ABS" \
  "$INPUT_URL"

echo "Exported PDF: $OUTPUT_ABS"