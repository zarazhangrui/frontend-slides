#!/usr/bin/env bash
# deploy.sh — Deploy a slide deck to Vercel for instant sharing
#
# Usage:
#   bash scripts/deploy.sh <path-to-slide-folder-or-html>
#
# Examples:
#   bash scripts/deploy.sh ./my-pitch-deck/
#   bash scripts/deploy.sh ./presentation.html
#
# What this does:
#   1. Checks if Vercel CLI is installed (installs if not)
#   2. Checks if user is logged in (guides through login if not)
#   3. Inlines local image refs for standalone HTML inputs
#   4. Deploys the slide deck to a public URL
#   5. Prints the live URL
#
# The deployed URL is permanent and works on any device (mobile, tablet, desktop).
# No server to maintain — Vercel hosts it for free.
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

inline_local_images() {
    local html_file="$1"
    local base_dir="$2"

    node - "$html_file" "$base_dir" <<'NODE'
const fs = require('fs');
const path = require('path');
const { fileURLToPath } = require('url');

const htmlFile = process.argv[2];
const baseDir = process.argv[3];
let html = fs.readFileSync(htmlFile, 'utf8');
let replacements = 0;

const mimeByExt = {
  '.apng': 'image/apng',
  '.avif': 'image/avif',
  '.bmp': 'image/bmp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.tif': 'image/tiff',
  '.tiff': 'image/tiff',
  '.webp': 'image/webp',
};

const cache = new Map();

function stripSuffixes(ref) {
  return ref.replace(/[?#].*$/, '');
}

function isRemoteReference(ref) {
  return /^(?:https?:)?\/\//i.test(ref)
    || /^(?:data:|mailto:|tel:|javascript:|#)/i.test(ref);
}

function resolveLocalFile(ref) {
  if (!ref) return null;

  const trimmed = ref.trim();
  if (!trimmed) return null;

  if (/^file:\/\//i.test(trimmed)) {
    try {
      return fileURLToPath(trimmed);
    } catch {
      return null;
    }
  }

  if (isRemoteReference(trimmed) || trimmed.startsWith('/')) {
    return null;
  }

  return path.resolve(baseDir, stripSuffixes(trimmed));
}

function getDataUrl(ref) {
  if (cache.has(ref)) {
    return cache.get(ref);
  }

  const resolved = resolveLocalFile(ref);
  if (!resolved) {
    cache.set(ref, null);
    return null;
  }

  let stats;
  try {
    stats = fs.statSync(resolved);
  } catch {
    cache.set(ref, null);
    return null;
  }

  if (!stats.isFile()) {
    cache.set(ref, null);
    return null;
  }

  const ext = path.extname(stripSuffixes(ref)).toLowerCase();
  const mime = mimeByExt[ext];
  if (!mime) {
    cache.set(ref, null);
    return null;
  }

  const dataUrl = `data:${mime};base64,${fs.readFileSync(resolved).toString('base64')}`;
  cache.set(ref, dataUrl);
  return dataUrl;
}

function replaceAttribute(attrName) {
  const regex = new RegExp(`(${attrName}\\s*=\\s*)(["'])([^"']+?)\\2`, 'gi');
  html = html.replace(regex, (match, prefix, quote, value) => {
    const dataUrl = getDataUrl(value);
    if (!dataUrl) {
      return match;
    }
    replacements += 1;
    return `${prefix}${quote}${dataUrl}${quote}`;
  });
}

function replaceSrcset() {
  html = html.replace(/(srcset\s*=\s*)(["'])([^"']+?)\2/gi, (match, prefix, quote, value) => {
    let changed = false;
    const rewritten = value
      .split(',')
      .map((candidate) => {
        const trimmed = candidate.trim();
        if (!trimmed) {
          return candidate;
        }

        const [url, ...descriptorParts] = trimmed.split(/\s+/);
        const dataUrl = getDataUrl(url);
        if (!dataUrl) {
          return candidate;
        }

        replacements += 1;
        changed = true;
        const descriptor = descriptorParts.length ? ` ${descriptorParts.join(' ')}` : '';
        return `${dataUrl}${descriptor}`;
      })
      .join(', ');

    return changed ? `${prefix}${quote}${rewritten}${quote}` : match;
  });
}

function replaceCssUrls() {
  html = html.replace(/(url\(\s*)(['"]?)([^"')]+?)\2(\s*\))/gi, (match, prefix, quote, value, suffix) => {
    const dataUrl = getDataUrl(value);
    if (!dataUrl) {
      return match;
    }
    replacements += 1;
    return `${prefix}${quote}${dataUrl}${quote}${suffix}`;
  });
}

['src', 'poster', 'href'].forEach(replaceAttribute);
replaceSrcset();
replaceCssUrls();

fs.writeFileSync(htmlFile, html);
process.stdout.write(String(replacements));
NODE
}

# ─── Input validation ─────────────────────────────────────

if [[ $# -lt 1 ]]; then
    err "Usage: bash scripts/deploy.sh <path-to-slide-folder-or-html>"
    err ""
    err "Examples:"
    err "  bash scripts/deploy.sh ./my-pitch-deck/"
    err "  bash scripts/deploy.sh ./presentation.html"
    exit 1
fi

INPUT="$1"

echo ""
echo -e "${BOLD}╔══════════════════════════════════════╗${NC}"
echo -e "${BOLD}║       Deploy Slides to Vercel         ║${NC}"
echo -e "${BOLD}╚══════════════════════════════════════╝${NC}"
echo ""

if ! command -v node &>/dev/null || ! command -v npx &>/dev/null; then
    err "Node.js and npm are required but not installed."
    err ""
    err "Install Node.js:"
    err "  macOS:   brew install node"
    err "  or visit https://nodejs.org and download the installer"
    exit 1
fi

# If input is a single HTML file, create a temp directory with it as index.html
if [[ -f "$INPUT" && "$INPUT" == *.html ]]; then
    DEPLOY_DIR=$(mktemp -d)
    cp "$INPUT" "$DEPLOY_DIR/index.html"
    PARENT_DIR=$(cd "$(dirname "$INPUT")" && pwd)

    INLINE_COUNT=$(inline_local_images "$DEPLOY_DIR/index.html" "$PARENT_DIR")
    if [[ "$INLINE_COUNT" =~ ^[0-9]+$ && "$INLINE_COUNT" -gt 0 ]]; then
        info "Inlined $INLINE_COUNT local image reference(s) into data URLs."
    fi

    # Parse the rewritten HTML for remaining local file references and copy them.
    grep -oE '(src|href|poster|url\()["'"'"']?[^"'"'"'>)]+' "$DEPLOY_DIR/index.html" 2>/dev/null | \
        sed "s/^src=//; s/^href=//; s/^poster=//; s/^url(//; s/[\"']//g" | \
        grep -v '^http' | grep -v '^data:' | grep -v '^#' | grep -v '^/' | \
        sort -u | while IFS= read -r ref; do
            SOURCE_REF=$(printf '%s' "$ref" | sed 's/[?#].*$//')
            SOURCE_FILE="$PARENT_DIR/$SOURCE_REF"
            if [[ -n "$SOURCE_REF" && -e "$SOURCE_FILE" ]]; then
                # Preserve directory structure for nested paths (e.g., assets/img.png)
                TARGET_DIR="$DEPLOY_DIR/$(dirname "$SOURCE_REF")"
                mkdir -p "$TARGET_DIR"
                cp -r "$SOURCE_FILE" "$TARGET_DIR/"
            fi
        done

    # Also copy any assets/ folder if it exists (common convention)
    if [[ -d "$PARENT_DIR/assets" ]]; then
        cp -r "$PARENT_DIR/assets" "$DEPLOY_DIR/assets" 2>/dev/null || true
    fi

    CLEANUP_TEMP=true
    info "Single HTML file detected — preparing for deployment..."
elif [[ -d "$INPUT" ]]; then
    # Verify the folder has an index.html
    if [[ ! -f "$INPUT/index.html" ]]; then
        err "Folder '$INPUT' does not contain an index.html file."
        err "Make sure your presentation folder has an index.html."
        exit 1
    fi
    DEPLOY_DIR="$INPUT"
    CLEANUP_TEMP=false
else
    err "'$INPUT' is not a valid HTML file or directory."
    exit 1
fi

# ─── Step 1: Check for Vercel CLI ─────────────────────────

info "Checking Vercel CLI..."

# Check if vercel is available (either globally or via npx)
if command -v vercel &>/dev/null; then
    VERCEL_CMD="vercel"
    ok "Vercel CLI found"
elif npx --yes vercel --version &>/dev/null 2>&1; then
    VERCEL_CMD="npx --yes vercel"
    ok "Vercel CLI available via npx"
else
    info "Installing Vercel CLI..."
    npm install -g vercel
    VERCEL_CMD="vercel"
    ok "Vercel CLI installed"
fi

# ─── Step 2: Check login status ───────────────────────────

echo ""
info "Checking Vercel login status..."

# Try to check if logged in by running whoami
if ! $VERCEL_CMD whoami &>/dev/null 2>&1; then
    echo ""
    warn "You're not logged in to Vercel yet."
    echo ""
    echo -e "${BOLD}To log in, run this command and follow the prompts:${NC}"
    echo ""
    echo "    vercel login"
    echo ""
    echo "If you don't have a Vercel account yet:"
    echo "  1. Go to https://vercel.com/signup"
    echo "  2. Sign up with GitHub, GitLab, email, or any method"
    echo "  3. Come back here and run: vercel login"
    echo "  4. Then re-run this deploy script"
    echo ""

    # Try interactive login
    echo -e "${YELLOW}Attempting interactive login now...${NC}"
    echo ""
    $VERCEL_CMD login || {
        err "Login failed. Please run 'vercel login' manually and try again."
        [[ "$CLEANUP_TEMP" == "true" ]] && rm -rf "$DEPLOY_DIR"
        exit 1
    }
    echo ""
    ok "Logged in to Vercel!"
fi

VERCEL_USER=$($VERCEL_CMD whoami 2>/dev/null || echo "unknown")
ok "Logged in as: $VERCEL_USER"

# ─── Step 3: Deploy ───────────────────────────────────────

echo ""
info "Deploying slides..."
echo ""

# Deploy with sensible defaults:
#   --yes: skip confirmation prompts
#   --prod: deploy to production URL (not preview)
#   --name: use the folder name as the project name
DECK_NAME=$(basename "$DEPLOY_DIR")
# If we used a temp dir, use the original filename without .html
if [[ "$CLEANUP_TEMP" == "true" ]]; then
    DECK_NAME=$(basename "$INPUT" .html)
fi

# Sanitize project name for Vercel:
# - lowercase, replace spaces/special chars with hyphens
# - collapse multiple hyphens, trim to 100 chars
DECK_NAME=$(echo "$DECK_NAME" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9._-]/-/g' | sed 's/--*/-/g' | sed 's/^-//;s/-$//' | cut -c1-100)

# Vercel uses the directory name as the project name, so rename the deploy
# directory to the sanitized deck name (avoids deprecated --name flag)
if [[ "$CLEANUP_TEMP" == "true" ]]; then
    RENAMED_DIR="$(dirname "$DEPLOY_DIR")/$DECK_NAME"
    mv "$DEPLOY_DIR" "$RENAMED_DIR"
    DEPLOY_DIR="$RENAMED_DIR"
fi

DEPLOY_OUTPUT=$($VERCEL_CMD deploy "$DEPLOY_DIR" --yes --prod 2>&1) || {
    err "Deployment failed:"
    echo "$DEPLOY_OUTPUT"
    [[ "$CLEANUP_TEMP" == "true" ]] && rm -rf "$DEPLOY_DIR"
    exit 1
}

# Extract the URL from output
DEPLOY_URL=$(echo "$DEPLOY_OUTPUT" | grep -o 'https://[^ ]*' | tail -1)

# ─── Step 4: Success ──────────────────────────────────────

echo ""
echo -e "${BOLD}════════════════════════════════════════${NC}"
ok "Slides deployed successfully!"
echo ""
echo -e "  ${BOLD}Live URL:${NC}  $DEPLOY_URL"
echo ""
echo "  This URL works on any device — phones, tablets, laptops."
echo "  Share it via Slack, email, text, or anywhere."
echo ""
echo -e "  ${CYAN}Tip:${NC} To take it down later, visit https://vercel.com/dashboard"
echo -e "       and delete the project '${DECK_NAME}'."
echo -e "${BOLD}════════════════════════════════════════${NC}"
echo ""

# ─── Cleanup ──────────────────────────────────────────────

if [[ "$CLEANUP_TEMP" == "true" ]]; then
    rm -rf "$DEPLOY_DIR"
fi
