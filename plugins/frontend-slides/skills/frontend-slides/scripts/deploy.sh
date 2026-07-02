#!/usr/bin/env bash
# deploy.sh — Deploy a slide deck to Vercel for instant sharing.
#
# Usage:
#   bash scripts/deploy.sh <path-to-slide-folder-or-html>
#
# Examples:
#   bash scripts/deploy.sh ./my-pitch-deck/
#   bash scripts/deploy.sh ./presentation.html
#
# The script accepts either:
# - a folder containing index.html, or
# - one standalone HTML file, with local referenced assets copied into a temp folder.

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

if [[ $# -lt 1 || "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  err "Usage: bash scripts/deploy.sh <path-to-slide-folder-or-html>"
  err ""
  err "Examples:"
  err "  bash scripts/deploy.sh ./my-pitch-deck/"
  err "  bash scripts/deploy.sh ./presentation.html"
  exit 1
fi

INPUT="$1"
DEPLOY_DIR=""
CLEANUP_TEMP=false

cleanup() {
  if [[ "$CLEANUP_TEMP" == "true" && -n "$DEPLOY_DIR" && -d "$DEPLOY_DIR" ]]; then
    rm -rf "$DEPLOY_DIR"
  fi
}
trap cleanup EXIT

copy_local_asset_references() {
  local html_file="$1"
  local parent_dir="$2"
  local deploy_dir="$3"
  local refs_file="$4"

  if command -v python3 >/dev/null 2>&1; then
    python3 - "$html_file" "$parent_dir" > "$refs_file" <<'PY'
from __future__ import annotations

import html.parser
import posixpath
import re
import sys
from pathlib import Path
from urllib.parse import unquote, urlparse

html_file = Path(sys.argv[1])
parent_dir = Path(sys.argv[2]).resolve()
text = html_file.read_text(encoding="utf-8", errors="replace")
refs: set[str] = set()

class RefParser(html.parser.HTMLParser):
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        for name in ("src", "href", "poster"):
            value = attrs.get(name)
            if value:
                refs.add(value)
        srcset = attrs.get("srcset")
        if srcset:
            for part in srcset.split(","):
                candidate = part.strip().split(" ")[0]
                if candidate:
                    refs.add(candidate)

parser = RefParser()
parser.feed(text)

for match in re.finditer(r"url\(\s*(['\"]?)(.*?)\1\s*\)", text, re.IGNORECASE):
    refs.add(match.group(2))

def is_local_ref(ref: str) -> bool:
    ref = ref.strip()
    if not ref or ref.startswith("#"):
        return False
    parsed = urlparse(ref)
    if parsed.scheme in {"http", "https", "data", "mailto", "tel", "javascript"}:
        return False
    if ref.startswith("//") or ref.startswith("/"):
        return False
    return True

safe_refs: list[str] = []
for ref in sorted(refs):
    if not is_local_ref(ref):
        continue

    path_only = unquote(ref.split("#", 1)[0].split("?", 1)[0]).strip()
    if not path_only:
        continue

    normalized = posixpath.normpath(path_only)
    if normalized.startswith("../") or normalized == "..":
        continue

    resolved = (parent_dir / normalized).resolve()
    try:
        resolved.relative_to(parent_dir)
    except ValueError:
        continue

    if resolved.exists():
        safe_refs.append(normalized)
    else:
        print(f"MISSING\t{normalized}", file=sys.stderr)

for ref in safe_refs:
    print(ref)
PY
  else
    warn "python3 not found; only assets/ and common asset folders will be copied."
    : > "$refs_file"
  fi

  while IFS= read -r ref; do
    [[ -z "$ref" ]] && continue

    local source_file="$parent_dir/$ref"
    local target_path="$deploy_dir/$ref"

    if [[ -e "$source_file" ]]; then
      mkdir -p "$(dirname "$target_path")"
      cp -R "$source_file" "$target_path"
    fi
  done < "$refs_file"

  for folder in assets images img fonts media videos static; do
    if [[ -d "$parent_dir/$folder" && ! -e "$deploy_dir/$folder" ]]; then
      cp -R "$parent_dir/$folder" "$deploy_dir/$folder"
    fi
  done
}

if [[ -f "$INPUT" && "$INPUT" == *.html ]]; then
  INPUT="$(cd "$(dirname "$INPUT")" && pwd)/$(basename "$INPUT")"
  PARENT_DIR="$(dirname "$INPUT")"
  DECK_BASENAME="$(basename "$INPUT" .html)"

  DEPLOY_DIR="$(mktemp -d -t frontend-slides-deploy.XXXXXX)"
  CLEANUP_TEMP=true

  cp "$INPUT" "$DEPLOY_DIR/index.html"

  REFS_FILE="$DEPLOY_DIR/.asset-refs.txt"
  info "Single HTML file detected — preparing local assets for deployment..."
  copy_local_asset_references "$INPUT" "$PARENT_DIR" "$DEPLOY_DIR" "$REFS_FILE"

  if [[ -s "$REFS_FILE" ]]; then
    ok "Copied referenced local assets"
  else
    warn "No local asset references detected. If the deck uses CSS background assets, verify them after deployment."
  fi

elif [[ -d "$INPUT" ]]; then
  INPUT="$(cd "$INPUT" && pwd)"

  if [[ ! -f "$INPUT/index.html" ]]; then
    err "Folder '$INPUT' does not contain an index.html file."
    err "Make sure your presentation folder has an index.html."
    exit 1
  fi

  DEPLOY_DIR="$INPUT"
  DECK_BASENAME="$(basename "$DEPLOY_DIR")"
else
  err "'$INPUT' is not a valid HTML file or directory."
  exit 1
fi

echo ""
echo -e "${BOLD}╔══════════════════════════════════════╗${NC}"
echo -e "${BOLD}║       Deploy Slides to Vercel        ║${NC}"
echo -e "${BOLD}╚══════════════════════════════════════╝${NC}"
echo ""

if ! command -v vercel >/dev/null 2>&1 && ! command -v npx >/dev/null 2>&1; then
  err "Vercel CLI or npx is required."
  err ""
  err "Install Node.js first:"
  err "  macOS: brew install node"
  err "  or download from https://nodejs.org"
  exit 1
fi

info "Checking Vercel CLI..."

if command -v vercel >/dev/null 2>&1; then
  VERCEL_CMD=(vercel)
  ok "Vercel CLI found"
else
  VERCEL_CMD=(npx --yes vercel)
  if "${VERCEL_CMD[@]}" --version >/dev/null 2>&1; then
    ok "Vercel CLI available via npx"
  else
    err "Could not run Vercel CLI through npx."
    err "Try: npm install vercel --save-dev"
    exit 1
  fi
fi

echo ""
info "Checking Vercel login status..."

if ! "${VERCEL_CMD[@]}" whoami >/dev/null 2>&1; then
  echo ""
  warn "You're not logged in to Vercel yet."
  echo ""
  echo -e "${BOLD}To log in, run this command and follow the prompts:${NC}"
  echo ""
  if [[ "${VERCEL_CMD[0]}" == "vercel" ]]; then
    echo "    vercel login"
  else
    echo "    npx --yes vercel login"
  fi
  echo ""
  echo "If you do not have a Vercel account yet:"
  echo "  1. Go to https://vercel.com/signup"
  echo "  2. Sign up with GitHub, Google, email, or another method"
  echo "  3. Run the login command above"
  echo "  4. Re-run this deploy script"
  echo ""
  echo -e "${YELLOW}Attempting interactive login now...${NC}"
  echo ""

  "${VERCEL_CMD[@]}" login || {
    err "Login failed. Please run the login command manually and try again."
    exit 1
  }

  echo ""
  ok "Logged in to Vercel!"
fi

VERCEL_USER="$("${VERCEL_CMD[@]}" whoami 2>/dev/null || echo "unknown")"
ok "Logged in as: $VERCEL_USER"

DECK_NAME="$(echo "$DECK_BASENAME" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9._-]/-/g' | sed 's/--*/-/g' | sed 's/^-//;s/-$//' | cut -c1-100)"
if [[ -z "$DECK_NAME" ]]; then
  DECK_NAME="frontend-slides-deck"
fi

# Vercel derives the project name from the directory. For temporary single-file
# deployments, rename the temp folder to a clean deck name.
if [[ "$CLEANUP_TEMP" == "true" ]]; then
  RENAMED_DIR="$(dirname "$DEPLOY_DIR")/$DECK_NAME"
  if [[ "$RENAMED_DIR" != "$DEPLOY_DIR" ]]; then
    rm -rf "$RENAMED_DIR"
    mv "$DEPLOY_DIR" "$RENAMED_DIR"
    DEPLOY_DIR="$RENAMED_DIR"
  fi
fi

echo ""
info "Deploying slides..."
echo ""

set +e
DEPLOY_OUTPUT="$("${VERCEL_CMD[@]}" deploy "$DEPLOY_DIR" --yes --prod 2>&1)"
DEPLOY_STATUS=$?
set -e

if [[ $DEPLOY_STATUS -ne 0 ]]; then
  err "Deployment failed:"
  echo "$DEPLOY_OUTPUT"
  exit 1
fi

DEPLOY_URL="$(echo "$DEPLOY_OUTPUT" | grep -Eo 'https://[^[:space:]]+' | grep -E 'vercel\.(app|sh)|now\.sh' | tail -1 || true)"
if [[ -z "$DEPLOY_URL" ]]; then
  DEPLOY_URL="$(echo "$DEPLOY_OUTPUT" | grep -Eo 'https://[^[:space:]]+' | tail -1 || true)"
fi

echo ""
echo -e "${BOLD}════════════════════════════════════════${NC}"
ok "Slides deployed successfully!"
echo ""

if [[ -n "$DEPLOY_URL" ]]; then
  echo -e "  ${BOLD}Live URL:${NC} $DEPLOY_URL"
else
  warn "Could not automatically extract a live URL from Vercel output."
  echo ""
  echo "$DEPLOY_OUTPUT"
fi

echo ""
echo "  This URL works on any device — phones, tablets, laptops."
echo "  Share it via Slack, email, text, or anywhere."
echo ""
echo -e "  ${CYAN}Tip:${NC} To take it down later, visit https://vercel.com/dashboard"
echo -e "       and delete the project '${DECK_NAME}'."
echo -e "${BOLD}════════════════════════════════════════${NC}"
echo ""
