#!/usr/bin/env bash
# export-pptx.sh — Export an HTML presentation to a native, editable PPTX
#
# Usage:
#   bash scripts/export-pptx.sh <path-to-html> [output.pptx]
#
# Examples:
#   bash scripts/export-pptx.sh ./my-deck/index.html
#   bash scripts/export-pptx.sh ./presentation.html ./presentation.pptx
#
# What this does:
#   1. Starts a local server to serve the HTML (fonts/assets need HTTP)
#   2. Launches headless Chromium via Playwright at 1920x1080
#   3. Injects dom-to-pptx (https://github.com/atharva9167/dom-to-pptx) into the page
#   4. Walks every .slide element, mapping its computed styles to native
#      PowerPoint shapes (text boxes, gradients, shadows, images)
#   5. Writes a single .pptx file with editable text and vector primitives
#
# Unlike PDF export, the output is fully editable in PowerPoint, Keynote, or WPS:
# every text run is a native text frame; gradients become vector SVGs;
# images are embedded as picture shapes. Animations are not preserved.
set -euo pipefail

# ─── Colors ────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
BOLD='\033[1m'
NC='\033[0m'

info()  { echo -e "${CYAN}ℹ${NC} $*"; }
ok()    { echo -e "${GREEN}✓${NC} $*"; }
warn()  { echo -e "${YELLOW}⚠${NC} $*"; }
err()   { echo -e "${RED}✗${NC} $*" >&2; }

# ─── Parse flags ──────────────────────────────────────────

# Default canvas: 1920x1080 (matches the rest of the skill's design canvas).
# PowerPoint slide dims are reported in inches; 13.333" x 7.5" is the standard
# 16:9 widescreen layout that maps 1:1 to a 1920x1080 web design.
VIEWPORT_W=1920
VIEWPORT_H=1080
SLIDE_W_IN=13.333
SLIDE_H_IN=7.5

POSITIONAL=()
for arg in "$@"; do
    case $arg in
        *)
            POSITIONAL+=("$arg")
            ;;
    esac
done
set -- "${POSITIONAL[@]}"

# ─── Input validation ─────────────────────────────────────

if [[ $# -lt 1 ]]; then
    err "Usage: bash scripts/export-pptx.sh <path-to-html> [output.pptx]"
    err ""
    err "Examples:"
    err "  bash scripts/export-pptx.sh ./my-deck/index.html"
    err "  bash scripts/export-pptx.sh ./presentation.html ./slides.pptx"
    exit 1
fi

INPUT_HTML="$1"
if [[ ! -f "$INPUT_HTML" ]]; then
    err "File not found: $INPUT_HTML"
    exit 1
fi

# Resolve to absolute path
INPUT_HTML=$(cd "$(dirname "$INPUT_HTML")" && pwd)/$(basename "$INPUT_HTML")

# Output PPTX path: use second argument or derive from input name
if [[ $# -ge 2 ]]; then
    OUTPUT_PPTX="$2"
else
    OUTPUT_PPTX="$(dirname "$INPUT_HTML")/$(basename "$INPUT_HTML" .html).pptx"
fi

# Resolve output to absolute path so a later `cd` into a temp dir doesn't
# silently relocate the output file.
OUTPUT_DIR=$(dirname "$OUTPUT_PPTX")
mkdir -p "$OUTPUT_DIR"
OUTPUT_DIR=$(cd "$OUTPUT_DIR" && pwd)
OUTPUT_PPTX="$OUTPUT_DIR/$(basename "$OUTPUT_PPTX")"

echo ""
echo -e "${BOLD}╔══════════════════════════════════════╗${NC}"
echo -e "${BOLD}║       Export Slides to PPTX           ║${NC}"
echo -e "${BOLD}╚══════════════════════════════════════╝${NC}"
echo ""

# ─── Step 1: Check dependencies ───────────────────────────

info "Checking dependencies..."

if ! command -v npx &>/dev/null; then
    err "Node.js is required but not installed."
    err ""
    err "Install Node.js:"
    err "  macOS:   brew install node"
    err "  or visit https://nodejs.org and download the installer"
    exit 1
fi

ok "Node.js found"

# ─── Step 2: Create the export script ─────────────────────

# We use a temporary Node.js script that:
# 1. Starts a local HTTP server (so fonts/assets resolve correctly)
# 2. Opens the deck in headless Chromium at 1920x1080
# 3. Loads dom-to-pptx into the page
# 4. Hands every .slide element to dom-to-pptx in one call
# 5. Pipes the resulting Blob out as base64, which bash writes to disk

TEMP_DIR=$(mktemp -d)
TEMP_SCRIPT="$TEMP_DIR/export-slides.mjs"

# Figure out which directory to serve (the folder containing the HTML)
SERVE_DIR=$(dirname "$INPUT_HTML")
HTML_FILENAME=$(basename "$INPUT_HTML")

cat > "$TEMP_SCRIPT" << 'EXPORT_SCRIPT'
// export-slides.mjs — Playwright driver that turns HTML slides into a
// native, editable PPTX file using the dom-to-pptx style engine.
//
// How it works:
// 1. Starts a tiny local HTTP server (fonts + relative assets need HTTP)
// 2. Opens the presentation in headless Chromium at 1920x1080
// 3. Loads dom-to-pptx (already npm-installed alongside this script)
// 4. Scrolls each slide into view so its layout is committed by the
//    browser, then invokes exportToPptx(slides, { skipDownload: true })
// 5. Receives the PPTX Blob as base64 from the page and writes it to disk

import { chromium } from 'playwright';
import { createServer } from 'http';
import { readFileSync, writeFileSync } from 'fs';
import { join, extname, resolve } from 'path';
import { fileURLToPath } from 'url';

const SERVE_DIR  = process.argv[2];
const HTML_FILE  = process.argv[3];
const OUTPUT_PPTX = process.argv[4];
const VP_WIDTH   = parseInt(process.argv[5]) || 1920;
const VP_HEIGHT  = parseInt(process.argv[6]) || 1080;
const SLIDE_W_IN = parseFloat(process.argv[7]) || 13.333;
const SLIDE_H_IN = parseFloat(process.argv[8]) || 7.5;

// Resolve the dom-to-pptx browser bundle that was installed in this temp dir.
const BUNDLE_PATH = resolve(
    fileURLToPath(import.meta.url),
    '..',
    'node_modules',
    'dom-to-pptx',
    'dist',
    'dom-to-pptx.bundle.js'
);

// ─── Simple static file server ────────────────────────────
// (We need HTTP so that Google Fonts and relative assets load correctly.)

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
};

const server = createServer((req, res) => {
  // Decode URL-encoded characters (e.g., %20 → space) so filenames with
  // spaces resolve correctly.
  const decodedUrl = decodeURIComponent(req.url);
  const filePath = join(SERVE_DIR, decodedUrl === '/' ? HTML_FILE : decodedUrl);
  try {
    const content = readFileSync(filePath);
    const ext = extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
      // dom-to-pptx fetches font files via fetch(); allow it.
      'Access-Control-Allow-Origin': '*',
    });
    res.end(content);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
});

const port = await new Promise((r) => {
  server.listen(0, () => r(server.address().port));
});

console.log(`  Local server on port ${port}`);

// ─── Load the deck ────────────────────────────────────────

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: VP_WIDTH, height: VP_HEIGHT },
});
const page = await ctx.newPage();

// Surface page errors so the user can see what went wrong on the browser side.
page.on('pageerror', e => console.error('  [page error]', e.message));

await page.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle' });

// Wait for fonts to load (dom-to-pptx embeds them by URL — they must
// already be resolvable in the document).
await page.evaluate(() => document.fonts && document.fonts.ready);
await page.waitForTimeout(800);

// Inject the dom-to-pptx browser bundle directly. This avoids a CORS
// roundtrip to jsdelivr and pins the version we just installed.
const bundleSrc = readFileSync(BUNDLE_PATH, 'utf8');
await page.addScriptTag({ content: bundleSrc });

const slideCount = await page.$$eval('.slide', els => els.length);
if (slideCount === 0) {
  console.error('  ERROR: No .slide elements found in the presentation.');
  console.error('  Make sure your HTML uses <section class="slide"> or <div class="slide">.');
  await browser.close();
  server.close();
  process.exit(1);
}
console.log(`  Found ${slideCount} slides`);

// ─── Reveal everything that was animation-gated ───────────
// frontend-slides decks typically rely on IntersectionObserver to add
// .visible / .active classes and remove opacity:0. For an off-screen
// snapshot dom-to-pptx needs the final visual state to be present in
// computed styles, so we force-reveal every .reveal element.
await page.evaluate(() => {
  document.querySelectorAll('.slide').forEach(s => {
    s.classList.add('visible', 'active');
    s.style.opacity = '1';
    s.style.visibility = 'visible';
  });
  document.querySelectorAll('.reveal').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
    el.style.visibility = 'visible';
  });
});
await page.waitForTimeout(300);

// ─── Run dom-to-pptx and pull the blob out ────────────────

console.log('  Mapping DOM to PowerPoint shapes...');

const b64 = await page.evaluate(async ({ widthIn, heightIn }) => {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const blob = await window.domToPptx.exportToPptx(slides, {
    fileName: 'export.pptx',
    width: widthIn,
    height: heightIn,
    svgAsVector: true,
    skipDownload: true,
  });
  const ab = await blob.arrayBuffer();
  // Chunked base64 to avoid call-stack blowups on large decks.
  const bytes = new Uint8Array(ab);
  let bin = '';
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    bin += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK));
  }
  return btoa(bin);
}, { widthIn: SLIDE_W_IN, heightIn: SLIDE_H_IN });

await browser.close();
server.close();

writeFileSync(OUTPUT_PPTX, Buffer.from(b64, 'base64'));

console.log(`  ✓ PPTX saved to: ${OUTPUT_PPTX}`);
EXPORT_SCRIPT

# ─── Step 3: Install Playwright + dom-to-pptx in temp dir ─

info "Setting up Playwright + dom-to-pptx (first run downloads ~150MB)..."
echo ""

cd "$TEMP_DIR"

# Minimal package.json so npm install works.
cat > "$TEMP_DIR/package.json" << 'PKG'
{ "name": "slide-export-pptx", "private": true, "type": "module" }
PKG

npm install playwright dom-to-pptx &>/dev/null || {
    err "Failed to install Playwright and dom-to-pptx."
    err "Try running: npm install playwright dom-to-pptx"
    rm -rf "$TEMP_DIR"
    exit 1
}

# Ensure Chromium is downloaded for Playwright.
npx playwright install chromium 2>/dev/null || {
    err "Failed to install Chromium browser for Playwright."
    err "Try running manually: npx playwright install chromium"
    rm -rf "$TEMP_DIR"
    exit 1
}
ok "Toolchain ready"
echo ""

# ─── Step 4: Run the export ───────────────────────────────

info "Exporting slides to PPTX..."
echo ""

node "$TEMP_SCRIPT" \
    "$SERVE_DIR" "$HTML_FILENAME" "$OUTPUT_PPTX" \
    "$VIEWPORT_W" "$VIEWPORT_H" \
    "$SLIDE_W_IN" "$SLIDE_H_IN" || {
    err "PPTX export failed."
    rm -rf "$TEMP_DIR"
    exit 1
}

# ─── Step 5: Cleanup and success ──────────────────────────

rm -rf "$TEMP_DIR"

echo ""
echo -e "${BOLD}════════════════════════════════════════${NC}"
ok "PPTX exported successfully!"
echo ""
echo -e "  ${BOLD}File:${NC}  $OUTPUT_PPTX"
echo ""
FILE_SIZE=$(du -h "$OUTPUT_PPTX" | cut -f1 | xargs)
echo "  Size: $FILE_SIZE"
echo ""
echo "  Editable in PowerPoint, Keynote, and WPS — every text run is a"
echo "  native text frame; gradients are vector SVGs; images are embedded"
echo "  as picture shapes. Animations are not preserved."
echo -e "${BOLD}════════════════════════════════════════${NC}"
echo ""

# Open the PPTX automatically when possible.
if command -v open &>/dev/null; then
    open "$OUTPUT_PPTX"
elif command -v xdg-open &>/dev/null; then
    xdg-open "$OUTPUT_PPTX"
fi
