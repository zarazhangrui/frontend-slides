#!/usr/bin/env bash
# export-pdf.sh — Export an HTML presentation to PDF.
#
# Usage:
#   bash scripts/export-pdf.sh <path-to-html> [output.pdf] [--compact]
#
# Examples:
#   bash scripts/export-pdf.sh ./my-deck/index.html
#   bash scripts/export-pdf.sh ./presentation.html ./presentation.pdf
#   bash scripts/export-pdf.sh ./presentation.html --compact
#
# The PDF is static: animations/interactivity are flattened into the final visible state.

set -euo pipefail

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

VIEWPORT_W=1920
VIEWPORT_H=1080
COMPACT=false

POSITIONAL=()
for arg in "$@"; do
  case "$arg" in
    --compact)
      COMPACT=true
      VIEWPORT_W=1280
      VIEWPORT_H=720
      ;;
    -h|--help)
      echo "Usage: bash scripts/export-pdf.sh <path-to-html> [output.pdf] [--compact]"
      exit 0
      ;;
    *)
      POSITIONAL+=("$arg")
      ;;
  esac
done
set -- "${POSITIONAL[@]}"

if [[ $# -lt 1 ]]; then
  err "Usage: bash scripts/export-pdf.sh <path-to-html> [output.pdf] [--compact]"
  err ""
  err "Examples:"
  err "  bash scripts/export-pdf.sh ./my-deck/index.html"
  err "  bash scripts/export-pdf.sh ./presentation.html ./slides.pdf"
  err "  bash scripts/export-pdf.sh ./presentation.html --compact"
  exit 1
fi

INPUT_HTML="$1"
if [[ ! -f "$INPUT_HTML" ]]; then
  err "File not found: $INPUT_HTML"
  exit 1
fi

INPUT_HTML="$(cd "$(dirname "$INPUT_HTML")" && pwd)/$(basename "$INPUT_HTML")"

if [[ $# -ge 2 ]]; then
  OUTPUT_PDF="$2"
else
  OUTPUT_PDF="$(dirname "$INPUT_HTML")/$(basename "$INPUT_HTML" .html).pdf"
fi

OUTPUT_DIR="$(dirname "$OUTPUT_PDF")"
mkdir -p "$OUTPUT_DIR"
OUTPUT_DIR="$(cd "$OUTPUT_DIR" && pwd)"
OUTPUT_PDF="$OUTPUT_DIR/$(basename "$OUTPUT_PDF")"

TEMP_DIR=""
cleanup() {
  if [[ -n "$TEMP_DIR" && -d "$TEMP_DIR" ]]; then
    rm -rf "$TEMP_DIR"
  fi
}
trap cleanup EXIT

echo ""
echo -e "${BOLD}╔══════════════════════════════════════╗${NC}"
echo -e "${BOLD}║       Export Slides to PDF           ║${NC}"
echo -e "${BOLD}╚══════════════════════════════════════╝${NC}"
echo ""

info "Checking dependencies..."

if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1 || ! command -v npx >/dev/null 2>&1; then
  err "Node.js, npm, and npx are required."
  err ""
  err "Install Node.js:"
  err "  macOS: brew install node"
  err "  or download from https://nodejs.org"
  exit 1
fi

ok "Node.js found"

TEMP_DIR="$(mktemp -d)"
TEMP_SCRIPT="$TEMP_DIR/export-slides.mjs"
SERVE_DIR="$(dirname "$INPUT_HTML")"
HTML_FILENAME="$(basename "$INPUT_HTML")"
SCREENSHOT_DIR="$TEMP_DIR/screenshots"

cat > "$TEMP_SCRIPT" <<'EXPORT_SCRIPT'
// export-slides.mjs — Playwright script to export HTML slides to PDF.
//
// Security/quality notes:
// - The local static server binds to 127.0.0.1 only.
// - Requested paths are resolved under the HTML file's parent directory.
// - Slide export forces reveal animations into their final visible state.
// - The output remains a screenshot-based PDF because browsers cannot preserve
//   animated/interactable HTML semantics in a normal PDF export.

import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync, mkdirSync, unlinkSync, existsSync } from 'node:fs';
import { extname, join, resolve, sep } from 'node:path';

const SERVE_DIR = resolve(process.argv[2]);
const HTML_FILE = process.argv[3];
const OUTPUT_PDF = process.argv[4];
const SCREENSHOT_DIR = process.argv[5];
const VP_WIDTH = parseInt(process.argv[6], 10) || 1920;
const VP_HEIGHT = parseInt(process.argv[7], 10) || 1080;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.eot': 'application/vnd.ms-fontobject',
};

function safeResolveFromUrl(requestUrl) {
  const url = new URL(requestUrl || '/', 'http://127.0.0.1');
  let pathname = decodeURIComponent(url.pathname);

  if (pathname === '/') {
    pathname = `/${HTML_FILE}`;
  }

  const resolved = resolve(SERVE_DIR, `.${pathname}`);
  const insideRoot = resolved === SERVE_DIR || resolved.startsWith(`${SERVE_DIR}${sep}`);

  if (!insideRoot) {
    return null;
  }

  return resolved;
}

const server = createServer((req, res) => {
  try {
    const filePath = safeResolveFromUrl(req.url);

    if (!filePath) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Forbidden');
      return;
    }

    if (!existsSync(filePath)) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }

    const content = readFileSync(filePath);
    const ext = extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    res.end(content);
  } catch (error) {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`Bad request: ${error.message}`);
  }
});

const port = await new Promise((resolvePort) => {
  server.listen(0, '127.0.0.1', () => resolvePort(server.address().port));
});

console.log(`  Local server: http://127.0.0.1:${port}/`);

let browser;
let pdfBrowser;

try {
  browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: VP_WIDTH, height: VP_HEIGHT },
    deviceScaleFactor: 1,
  });

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(`http://127.0.0.1:${port}/`, {
    waitUntil: 'networkidle',
    timeout: 60000,
  });

  await page.evaluate(async () => {
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }
  });

  await page.waitForTimeout(500);

  const slideCount = await page.evaluate(() => document.querySelectorAll('.slide').length);
  console.log(`  Found ${slideCount} slides`);

  if (slideCount === 0) {
    console.error('');
    console.error('  ERROR: No .slide elements found in the presentation.');
    console.error('  The export script expects generated decks to use class="slide".');
    console.error('  Check that your HTML contains <section class="slide"> or <div class="slide">.');
    process.exit(1);
  }

  mkdirSync(SCREENSHOT_DIR, { recursive: true });
  const screenshotPaths = [];

  for (let i = 0; i < slideCount; i += 1) {
    await page.evaluate((index) => {
      const slides = Array.from(document.querySelectorAll('.slide'));

      document.body.dataset.frontendSlidesExport = 'true';

      let exportStyle = document.getElementById('__frontend_slides_export_css');
      if (!exportStyle) {
        exportStyle = document.createElement('style');
        exportStyle.id = '__frontend_slides_export_css';
        exportStyle.textContent = `
          html, body {
            margin: 0 !important;
            overflow: hidden !important;
            background: #000 !important;
          }
          *, *::before, *::after {
            animation-delay: 0ms !important;
            animation-duration: 1ms !important;
            animation-iteration-count: 1 !important;
            transition-delay: 0ms !important;
            transition-duration: 0ms !important;
            scroll-behavior: auto !important;
          }
          .reveal,
          [data-reveal],
          .animate-in,
          [data-animate],
          [data-animation] {
            opacity: 1 !important;
            visibility: visible !important;
            transform: none !important;
            filter: none !important;
          }
        `;
        document.head.appendChild(exportStyle);
      }

      // If the generated deck exposes a controller, let it update any progress bars
      // or slide-number UI before we apply screenshot-specific visibility overrides.
      if (window.presentation && typeof window.presentation.goToSlide === 'function') {
        try {
          window.presentation.goToSlide(index);
        } catch {
          // Continue with direct DOM control.
        }
      }

      window.currentSlide = index;

      slides.forEach((slide, idx) => {
        const current = idx === index;

        slide.classList.toggle('active', current);
        slide.classList.toggle('visible', current);
        slide.setAttribute('aria-hidden', current ? 'false' : 'true');

        // Generated decks should use visibility/opacity rather than display,
        // but export must also handle external decks that did use display:none.
        slide.style.display = current ? '' : 'none';
        slide.style.opacity = current ? '1' : '0';
        slide.style.visibility = current ? 'visible' : 'hidden';
        slide.style.pointerEvents = current ? 'auto' : 'none';

        if (current) {
          slide.style.transform = 'none';
          slide.querySelectorAll('.reveal, [data-reveal], .animate-in, [data-animate], [data-animation]').forEach((el) => {
            el.style.opacity = '1';
            el.style.visibility = 'visible';
            el.style.transform = 'none';
            el.style.filter = 'none';
          });
          slide.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
        }
      });
    }, i);

    await page.waitForTimeout(150);

    const screenshotPath = join(SCREENSHOT_DIR, `slide-${String(i + 1).padStart(3, '0')}.png`);
    await page.screenshot({
      path: screenshotPath,
      fullPage: false,
      animations: 'disabled',
    });
    screenshotPaths.push(screenshotPath);
    console.log(`  Captured slide ${i + 1}/${slideCount}`);
  }

  await browser.close();
  browser = null;

  console.log('  Assembling PDF...');

  pdfBrowser = await chromium.launch();
  const pdfPage = await pdfBrowser.newPage({
    viewport: { width: VP_WIDTH, height: VP_HEIGHT },
  });

  const imagesHtml = screenshotPaths.map((path) => {
    const imgData = readFileSync(path).toString('base64');
    return `<div class="page"><img src="data:image/png;base64,${imgData}" alt="" /></div>`;
  }).join('\n');

  const pdfHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: ${VP_WIDTH}px; margin: 0; background: #fff; }
  @page { size: ${VP_WIDTH}px ${VP_HEIGHT}px; margin: 0; }
  .page {
    width: ${VP_WIDTH}px;
    height: ${VP_HEIGHT}px;
    overflow: hidden;
    page-break-after: always;
    break-after: page;
  }
  .page:last-child {
    page-break-after: auto;
    break-after: auto;
  }
  img {
    display: block;
    width: ${VP_WIDTH}px;
    height: ${VP_HEIGHT}px;
    object-fit: contain;
  }
</style>
</head>
<body>${imagesHtml}</body>
</html>`;

  await pdfPage.setContent(pdfHtml, { waitUntil: 'load' });
  await pdfPage.pdf({
    path: OUTPUT_PDF,
    width: `${VP_WIDTH}px`,
    height: `${VP_HEIGHT}px`,
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  await pdfBrowser.close();
  pdfBrowser = null;

  screenshotPaths.forEach((path) => unlinkSync(path));
  console.log(`  ✓ PDF saved to: ${OUTPUT_PDF}`);
} finally {
  if (browser) {
    await browser.close();
  }
  if (pdfBrowser) {
    await pdfBrowser.close();
  }
  await new Promise((resolveClose) => server.close(resolveClose));
}
EXPORT_SCRIPT

info "Setting up Playwright (headless browser for screenshots)..."
info "This can take longer on first run because Chromium may need to download."
echo ""

cd "$TEMP_DIR"

cat > "$TEMP_DIR/package.json" <<'PKG'
{ "name": "frontend-slides-export", "private": true, "type": "module" }
PKG

npm install --silent playwright >/dev/null || {
  err "Failed to install Playwright in the temporary export directory."
  err "Try running manually: npm install playwright"
  exit 1
}

npx --yes playwright install chromium >/dev/null || {
  err "Failed to install the Chromium browser for Playwright."
  err "Try running manually: npx playwright install chromium"
  exit 1
}

ok "Playwright ready"
echo ""

info "Exporting slides to PDF..."
if [[ "$COMPACT" == "true" ]]; then
  info "Using compact mode (${VIEWPORT_W}×${VIEWPORT_H}) for smaller file size"
else
  info "Using full-HD mode (${VIEWPORT_W}×${VIEWPORT_H})"
fi
echo ""

node "$TEMP_SCRIPT" "$SERVE_DIR" "$HTML_FILENAME" "$OUTPUT_PDF" "$SCREENSHOT_DIR" "$VIEWPORT_W" "$VIEWPORT_H" || {
  err "PDF export failed."
  exit 1
}

echo ""
echo -e "${BOLD}════════════════════════════════════════${NC}"
ok "PDF exported successfully!"
echo ""
echo -e "  ${BOLD}File:${NC} $OUTPUT_PDF"
if [[ -f "$OUTPUT_PDF" ]]; then
  FILE_SIZE="$(du -h "$OUTPUT_PDF" | cut -f1 | xargs)"
  echo "  Size: $FILE_SIZE"
fi
echo ""
echo "  This PDF works everywhere — email, Slack, Notion, print."
echo "  Note: animations and browser interactivity are flattened into static slides."
echo -e "${BOLD}════════════════════════════════════════${NC}"
echo ""

if command -v open >/dev/null 2>&1; then
  open "$OUTPUT_PDF" || true
elif command -v xdg-open >/dev/null 2>&1; then
  xdg-open "$OUTPUT_PDF" >/dev/null 2>&1 || true
fi
