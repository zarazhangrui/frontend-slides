#!/usr/bin/env bash
# stop-hosting.sh — Tear down all hosting phases
set -euo pipefail

SLIDES_DIR="${SLIDES_DIR:-$HOME/frontend-slides}"
STATE_FILE="$SLIDES_DIR/.hosting-state"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
BOLD='\033[1m'
NC='\033[0m'

ok()   { echo -e "${GREEN}✓${NC} $*"; }
warn() { echo -e "${YELLOW}⚠${NC} $*"; }
info() { echo -e "${CYAN}ℹ${NC} $*"; }

if [[ ! -f "$STATE_FILE" ]]; then
    warn "No hosting state found at $STATE_FILE"
    warn "Nothing to stop."
    exit 0
fi

source "$STATE_FILE"

echo ""
echo -e "${BOLD}Stopping Frontend Slides Hosting${NC}"
echo "════════════════════════════════════"

# ─── Phase 3: Cloudflare Tunnel ───────────────────────────

if [[ -n "${CLOUDFLARE_PID:-}" ]]; then
    if kill "$CLOUDFLARE_PID" 2>/dev/null; then
        ok "Cloudflare Tunnel stopped (PID: $CLOUDFLARE_PID)"
    else
        warn "Cloudflare Tunnel process $CLOUDFLARE_PID already gone"
    fi
    rm -f /tmp/cloudflared-slides.log
fi

# ─── Phase 2: Tailscale Serve ─────────────────────────────

if [[ "${TAILSCALE_REGISTERED:-false}" == "true" && -n "${TAILSCALE_CLI:-}" ]]; then
    if "$TAILSCALE_CLI" serve --set-path /slides off 2>/dev/null; then
        ok "Tailscale Serve unregistered (/slides)"
    else
        warn "Failed to unregister Tailscale Serve (may already be removed)"
    fi
fi

# ─── Phase 1: Local Server ───────────────────────────────

case "${SERVER_TYPE:-}" in
    docker)
        if docker stop "${CONTAINER_NAME:-slides-server}" &>/dev/null; then
            docker rm "${CONTAINER_NAME:-slides-server}" &>/dev/null
            ok "Docker container ${CONTAINER_NAME:-slides-server} stopped and removed"
        else
            warn "Docker container ${CONTAINER_NAME:-slides-server} already gone"
        fi
        # Clean up nginx config
        rm -f "$SLIDES_DIR/.nginx.conf"
        ;;
    python|node)
        if [[ -n "${SERVER_PID:-}" ]] && kill "$SERVER_PID" 2>/dev/null; then
            ok "Server stopped (PID: $SERVER_PID)"
        else
            warn "Server process ${SERVER_PID:-unknown} already gone"
        fi
        ;;
    *)
        warn "Unknown server type: ${SERVER_TYPE:-none}"
        ;;
esac

# ─── Cleanup ──────────────────────────────────────────────

rm -f "$STATE_FILE"

echo ""
ok "All hosting stopped."
echo ""
