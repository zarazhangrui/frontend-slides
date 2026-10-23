#!/usr/bin/env bash
# Regression for #106: a relative output path must be absolute before
# export-pdf.sh cd's into the temp directory it later deletes.
# The repository ships two copies of that script. Both must resolve the path.
# EXPORT_PDF_RESOLVE_ONLY stops the real script after that resolution.
set -euo pipefail

ROOT=$(cd "$(dirname "$0")/.." && pwd)
SCRIPTS=(
    "$ROOT/scripts/export-pdf.sh"
    "$ROOT/plugins/frontend-slides/skills/frontend-slides/scripts/export-pdf.sh"
)

fail() { echo "FAIL: $*" >&2; exit 1; }

check_script() {
    local script="$1"
    local workdir
    workdir=$(mktemp -d)
    mkdir -p "$workdir/deck" "$workdir/start"
    printf '<html><body>slide</body></html>\n' > "$workdir/deck/index.html"

    local resolved
    resolved=$(
        cd "$workdir/start"
        EXPORT_PDF_RESOLVE_ONLY=1 bash "$script" "$workdir/deck/index.html" ./out.pdf
    )
    case "$resolved" in
        /*) ;;
        *) fail "$script left a relative path: $resolved" ;;
    esac
    [[ "$resolved" == "$workdir/start/out.pdf" ]] || fail "$script expected $workdir/start/out.pdf, got $resolved"

    # Same write the exporter does after cd, then the same cleanup.
    local temp_dir
    temp_dir=$(mktemp -d "$workdir/tmp.XXXX")
    (
        cd "$temp_dir"
        printf '%%PDF-1.4\n' > "$resolved"
    )
    rm -rf "$temp_dir"
    test -f "$workdir/start/out.pdf" || fail "$script: PDF was removed with the temp directory"

    local nested derived
    nested=$(
        cd "$workdir/start"
        EXPORT_PDF_RESOLVE_ONLY=1 bash "$script" ../deck/index.html ../exports/deck.pdf
    )
    [[ "$nested" == "$workdir/exports/deck.pdf" ]] || fail "$script expected nested path, got $nested"
    test -d "$workdir/exports" || fail "$script did not create the output directory"

    derived=$(EXPORT_PDF_RESOLVE_ONLY=1 bash "$script" "$workdir/deck/index.html")
    [[ "$derived" == "$workdir/deck/index.pdf" ]] || fail "$script expected derived path, got $derived"

    rm -rf "$workdir"
    echo "ok: $script"
}

for script in "${SCRIPTS[@]}"; do
    test -f "$script" || fail "missing $script"
    check_script "$script"
done

echo "ok: relative output paths are absolute before the temp-dir cleanup"
