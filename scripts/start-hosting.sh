#!/usr/bin/env bash
# start-hosting.sh — Three-phase slide hosting
# Phase 1 (Auto): Local network via docker/python/node
# Phase 2 (Auto): Tailscale Serve (if available)
# Phase 3 (Ask):  Cloudflare Tunnel (if available + user confirms)
set -euo pipefail

SLIDES_DIR="${SLIDES_DIR:-$HOME/frontend-slides}"
PORT_RANGE_START=9100
PORT_RANGE_END=9199
STATE_FILE="$SLIDES_DIR/.hosting-state"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
BOLD='\033[1m'
NC='\033[0m'

info()  { echo -e "${CYAN}ℹ${NC} $*"; }
ok()    { echo -e "${GREEN}✓${NC} $*"; }
warn()  { echo -e "${YELLOW}⚠${NC} $*"; }
err()   { echo -e "${RED}✗${NC} $*"; }

# ─── Helpers ───────────────────────────────────────────────

find_free_port() {
    for port in $(seq $PORT_RANGE_START $PORT_RANGE_END); do
        if ! lsof -i :"$port" &>/dev/null; then
            echo "$port"
            return 0
        fi
    done
    err "No free port found in range $PORT_RANGE_START-$PORT_RANGE_END"
    exit 1
}

get_lan_ip() {
    # macOS
    if command -v ipconfig &>/dev/null; then
        ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "unknown"
        return 0
    fi
    # Linux
    if command -v hostname &>/dev/null; then
        hostname -I 2>/dev/null | awk '{print $1}' || echo "unknown"
        return 0
    fi
    echo "unknown"
}

detect_tailscale() {
    # macOS app location
    local ts_cli="/Applications/Tailscale.app/Contents/MacOS/Tailscale"
    if [[ -x "$ts_cli" ]]; then
        echo "$ts_cli"
        return 0
    fi
    # Standard PATH
    if command -v tailscale &>/dev/null; then
        echo "tailscale"
        return 0
    fi
    return 1
}

get_tailscale_domain() {
    local ts_cli="$1"
    local domain
    # Try python parsing first (reliable), fall back to grep
    domain=$("$ts_cli" status --json 2>/dev/null | python3 -c "import sys,json; print(json.load(sys.stdin).get('Self',{}).get('DNSName',''))" 2>/dev/null | sed 's/\.$//')
    if [[ -z "$domain" ]]; then
        domain=$("$ts_cli" status --json 2>/dev/null | grep -o '"DNSName":"[^"]*"' | head -1 | cut -d'"' -f4 | sed 's/\.$//')
    fi
    echo "$domain"
}

save_state() {
    cat > "$STATE_FILE" << EOF
PORT=$PORT
SERVER_TYPE=$SERVER_TYPE
SERVER_PID=${SERVER_PID:-}
CONTAINER_NAME=${CONTAINER_NAME:-}
TAILSCALE_REGISTERED=${TAILSCALE_REGISTERED:-false}
TAILSCALE_CLI=${TAILSCALE_CLI:-}
CLOUDFLARE_PID=${CLOUDFLARE_PID:-}
EOF
}

# ─── Pre-flight ────────────────────────────────────────────

if [[ ! -d "$SLIDES_DIR" ]]; then
    info "Creating slides directory: $SLIDES_DIR"
    mkdir -p "$SLIDES_DIR"
fi

SLIDE_COUNT=$(find "$SLIDES_DIR" -maxdepth 2 -name "index.html" 2>/dev/null | wc -l | tr -d ' ')
if [[ "$SLIDE_COUNT" -eq 0 ]]; then
    warn "No slide decks found in $SLIDES_DIR"
    warn "Add folders with index.html files, e.g.: $SLIDES_DIR/my-deck/index.html"
fi

# Check if already running
if [[ -f "$STATE_FILE" ]]; then
    warn "Hosting appears to be running already. Run stop-hosting.sh first."
    exit 1
fi

PORT=$(find_free_port)
LAN_IP=$(get_lan_ip)

echo ""
echo -e "${BOLD}╔══════════════════════════════════════╗${NC}"
echo -e "${BOLD}║     Frontend Slides Hosting           ║${NC}"
echo -e "${BOLD}╚══════════════════════════════════════╝${NC}"
echo ""

# ─── Phase 1: Local Network ───────────────────────────────

echo -e "${BOLD}Phase 1: Local Network${NC}"
echo "─────────────────────"

if command -v docker &>/dev/null && docker info &>/dev/null 2>&1; then
    SERVER_TYPE="docker"
    CONTAINER_NAME="slides-server-$PORT"

    # Write nginx config (no directory listing)
    NGINX_CONF="$SLIDES_DIR/.nginx.conf"
    cat > "$NGINX_CONF" << 'NGINX'
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    autoindex off;

    location / {
        try_files $uri $uri/index.html =404;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 7d;
        add_header Cache-Control "public, immutable";
    }

    # HTML: revalidate
    location ~* \.html$ {
        expires 1h;
        add_header Cache-Control "public, must-revalidate";
    }
}
NGINX

    docker run -d \
        --name "$CONTAINER_NAME" \
        -p "$PORT:80" \
        -v "$SLIDES_DIR:/usr/share/nginx/html:ro" \
        -v "$NGINX_CONF:/etc/nginx/conf.d/default.conf:ro" \
        nginx:alpine &>/dev/null

    ok "Docker (nginx:alpine) on port $PORT"

elif command -v python3 &>/dev/null; then
    SERVER_TYPE="python"
    cd "$SLIDES_DIR"
    python3 -m http.server "$PORT" --bind 0.0.0.0 &>/dev/null &
    SERVER_PID=$!
    ok "Python http.server on port $PORT (PID: $SERVER_PID)"

elif command -v npx &>/dev/null; then
    SERVER_TYPE="node"
    npx -y serve "$SLIDES_DIR" -l "$PORT" --no-clipboard &>/dev/null &
    SERVER_PID=$!
    ok "Node serve on port $PORT (PID: $SERVER_PID)"

else
    err "No server available. Install docker, python3, or node."
    exit 1
fi

echo ""
info "Local access:"
echo "    http://localhost:$PORT/"
echo "    http://127.0.0.1:$PORT/"
if [[ "$LAN_IP" != "unknown" ]]; then
    echo "    http://$LAN_IP:$PORT/  (LAN / phone)"
fi

if [[ "$SLIDE_COUNT" -gt 0 ]]; then
    echo ""
    info "Hosted slides:"
    find "$SLIDES_DIR" -maxdepth 2 -name "index.html" | while read -r f; do
        name=$(basename "$(dirname "$f")")
        [[ "$name" == "frontend-slides" ]] && continue
        echo "    http://localhost:$PORT/$name/"
    done
fi

# ─── Phase 2: Tailscale ───────────────────────────────────

echo ""
echo -e "${BOLD}Phase 2: Tailscale${NC}"
echo "──────────────────"

TAILSCALE_REGISTERED=false
TAILSCALE_CLI=""

if TS_CLI=$(detect_tailscale); then
    TAILSCALE_CLI="$TS_CLI"
    TS_DOMAIN=$(get_tailscale_domain "$TS_CLI")

    if [[ -n "$TS_DOMAIN" ]]; then
        "$TS_CLI" serve --bg --set-path /slides "http://localhost:$PORT" 2>&1 || true
        TAILSCALE_REGISTERED=true
        ok "Tailscale Serve registered"
        echo ""
        info "Tailnet access:"
        echo "    https://$TS_DOMAIN/slides/"

        if [[ "$SLIDE_COUNT" -gt 0 ]]; then
            find "$SLIDES_DIR" -maxdepth 2 -name "index.html" | while read -r f; do
                name=$(basename "$(dirname "$f")")
                [[ "$name" == "frontend-slides" ]] && continue
                echo "    https://$TS_DOMAIN/slides/$name/"
            done
        fi
    else
        warn "Tailscale installed but not connected. Skipping."
    fi
else
    info "Tailscale not found. Skipping. (Install: https://tailscale.com/download)"
fi

# ─── Phase 3: Cloudflare Tunnel ───────────────────────────

echo ""
echo -e "${BOLD}Phase 3: Public Access${NC}"
echo "──────────────────────"

CLOUDFLARE_PID=""

if command -v cloudflared &>/dev/null; then
    echo ""
    echo -e "${YELLOW}Would you like to expose your slides publicly via Cloudflare Tunnel?${NC}"
    echo "This will create a temporary public URL (anonymous, no account needed)."
    echo "Directory listing is disabled — visitors need the exact slide URL."
    echo ""
    read -rp "Expose slides publicly? [y/N] " cf_answer

    if [[ "$cf_answer" =~ ^[Yy]$ ]]; then
        info "Starting Cloudflare Tunnel..."
        cloudflared tunnel --url "http://localhost:$PORT" &>/tmp/cloudflared-slides.log &
        CLOUDFLARE_PID=$!

        # Wait for URL to appear in logs
        for i in $(seq 1 30); do
            CF_URL=$(grep -o 'https://[a-z0-9-]*\.trycloudflare\.com' /tmp/cloudflared-slides.log 2>/dev/null | head -1 || true)
            if [[ -n "$CF_URL" ]]; then
                break
            fi
            sleep 1
        done

        if [[ -n "${CF_URL:-}" ]]; then
            ok "Cloudflare Tunnel active"
            echo ""
            info "Public access:"
            echo "    $CF_URL/"

            if [[ "$SLIDE_COUNT" -gt 0 ]]; then
                find "$SLIDES_DIR" -maxdepth 2 -name "index.html" | while read -r f; do
                    name=$(basename "$(dirname "$f")")
                    [[ "$name" == "frontend-slides" ]] && continue
                    echo "    $CF_URL/$name/"
                done
            fi
        else
            warn "Tunnel started but URL not detected yet. Check /tmp/cloudflared-slides.log"
        fi
    else
        info "Skipped public access."
    fi
else
    info "cloudflared not found. Skipping. (Install: brew install cloudflared)"
fi

# ─── Save state ───────────────────────────────────────────

save_state

echo ""
echo "─────────────────────────────────────"
ok "Hosting is running. Use ${BOLD}stop-hosting.sh${NC} to tear down."
echo ""
