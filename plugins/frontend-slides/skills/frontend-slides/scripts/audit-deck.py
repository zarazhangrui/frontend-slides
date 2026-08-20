#!/usr/bin/env python3
"""
audit-deck.py — Automated layout audit for Frontend Slides presentations.

Loads a deck in headless Chromium and checks every slide for:
  1. Content overflow        (text elements clipped by slide bounds)
  2. Text-on-text overlap    (sibling elements colliding, parent/child aware)
  3. Floating chrome         (fixed navigation overlapping the slide stage)
  4. Stage geometry          (16:9 ratio + viewport centering)
  5. Vertical fill ratio     (empty-space / sparse-slide detection)
  6. Vertical rhythm         (deck-wide gap consistency between major blocks)

Usage:
    python scripts/audit-deck.py <presentation.html> [--min-fill 50] [--warn-fill 40]

Exit codes:
    0 = pass (no critical issues)
    1 = critical issues found, or deck average fill below --min-fill
    2 = file or runtime error
"""

import argparse
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

AUDIT_JS = r"""
() => {
    const stage = document.querySelector('.deck-stage');
    const viewportEl = document.querySelector('.deck-viewport') || document.body;
    const slides = Array.from(document.querySelectorAll('.slide'));
    const out = { stage: null, slides: [], fixedCollisions: [], errors: [] };
    if (!stage) { out.errors.push('No .deck-stage element found'); return out; }
    if (!slides.length) { out.errors.push('No .slide elements found'); return out; }

    const rect = (el) => el.getBoundingClientRect();
    const hasDirectText = (el) => Array.from(el.childNodes)
        .some(n => n.nodeType === 3 && n.textContent.trim().length > 0);

    // Neutralize entrance-animation transforms so measured positions are final
    document.querySelectorAll('.reveal, [class*="fade"], [class*="slide-in"]').forEach(el => {
        el.style.transform = 'none';
        el.style.transition = 'none';
    });

    const scale = rect(stage).width / 1920;

    // ---------- Stage geometry: 16:9 ratio + centering ----------
    const sr = rect(stage);
    const vr = rect(viewportEl);
    const ratio = sr.height > 0 ? sr.width / sr.height : 0;
    out.stage = {
        w: Math.round(sr.width), h: Math.round(sr.height),
        ratio: Math.round(ratio * 1000) / 1000,
        ratioOk: Math.abs(ratio - 16 / 9) < 0.02,
        centeredX: Math.abs((sr.x - vr.x) - (vr.width - sr.width) / 2) < 4,
        centeredY: Math.abs((sr.y - vr.y) - (vr.height - sr.height) / 2) < 4,
        slideCount: slides.length
    };

    // ---------- Floating chrome colliding with the stage ----------
    const insideStage = (el) => { let n = el; while (n) { if (n === stage) return true; n = n.parentElement; } return false; };
    document.querySelectorAll('body *').forEach(el => {
        const cs = getComputedStyle(el);
        if (cs.position !== 'fixed' || insideStage(el)) return;
        if (el.contains(stage)) return;   // viewport/container, not overlay chrome
        if (cs.display === 'none' || parseFloat(cs.opacity) === 0) return;
        const r = rect(el);
        if (r.width < 8 || r.height < 8) return;
        const cls = (el.getAttribute('class') || '');
        if (/edit/i.test(cls)) return;   // inline-editing affordances are expected
        const hasText = (el.textContent || '').trim().length > 0;
        const hasButton = !!el.querySelector('button');
        if (!hasText && !hasButton) return;
        const ox = Math.min(r.right, sr.right) - Math.max(r.left, sr.left);
        const oy = Math.min(r.bottom, sr.bottom) - Math.max(r.top, sr.top);
        if (ox > 8 && oy > 8) {
            out.fixedCollisions.push({
                el: cls || el.tagName.toLowerCase(),
                overlap: Math.round(Math.min(ox, oy))
            });
        }
    });

    // ---------- Per-slide audit ----------
    slides.forEach((slide, i) => {
        const sRect = rect(slide);
        const rep = {
            idx: i + 1,
            cls: (slide.getAttribute('class') || '').replace(/\s+/g, ' ').trim(),
            overflow: [], overlaps: [], fill: null, gaps: []
        };

        // Vertical rhythm: gaps between major blocks (title -> content rhythm).
        // Cover slides are excluded (full-bleed image layout has its own rules).
        if (!slide.classList.contains('cover') && scale > 0) {
            const container = slide.querySelector('.content') || slide;
            const kids = Array.from(container.children).filter(el => {
                const cls = el.getAttribute('class') || '';
                if (/chrome-(top|bottom)/.test(cls)) return false;
                const r = rect(el);
                return r.width > 4 && r.height > 4;
            }).sort((a, b) => rect(a).top - rect(b).top);
            for (let k = 1; k < kids.length; k++) {
                const gapPx = rect(kids[k]).top - rect(kids[k - 1]).bottom;
                const designGap = Math.round(gapPx / scale);
                if (designGap >= 0) rep.gaps.push(designGap);
            }
        }

        const isChrome = (el) => {
            const cls = el.getAttribute('class') || '';
            if (/chrome|counter|pagination|page-num|slide-num|deck-controls|edit/i.test(cls)) return true;
            const r = rect(el);
            const fs = parseFloat(getComputedStyle(el).fontSize);
            const nearTop = (r.top - sRect.top) < 130;
            const nearBottom = (sRect.bottom - r.bottom) < 130;
            return fs < 26 && (nearTop || nearBottom);
        };

        const els = Array.from(slide.querySelectorAll('*')).filter(el => {
            if (el.closest('.deck-controls')) return false;
            if (getComputedStyle(el).display === 'none') return false;
            const r = rect(el);
            return r.width >= 4 && r.height >= 4;
        });

        // Overflow: element extends beyond slide bounds (clipped content)
        els.forEach(el => {
            const r = rect(el);
            const beyondY = r.top < sRect.top - 4 || r.bottom > sRect.bottom + 4;
            const beyondX = r.left < sRect.left - 4 || r.right > sRect.right + 4;
            if (beyondY || beyondX) {
                rep.overflow.push({
                    el: el.getAttribute('class') || el.tagName.toLowerCase(),
                    text: hasDirectText(el),
                    detail: `y:${Math.round(r.top - sRect.top)}..${Math.round(r.bottom - sRect.top)} x:${Math.round(r.left - sRect.left)}..${Math.round(r.right - sRect.left)} (slide h=${Math.round(sRect.height)})`
                });
            }
        });

        // Overlap: non ancestor/descendant pairs intersecting
        for (let a = 0; a < els.length; a++) {
            for (let b = a + 1; b < els.length; b++) {
                const A = els[a], B = els[b];
                if (A.contains(B) || B.contains(A)) continue;
                const ra = rect(A), rb = rect(B);
                const oy = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top);
                const ox = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left);
                if (oy > 8 && ox > 8) {
                    const bothText = hasDirectText(A) && hasDirectText(B);
                    rep.overlaps.push({
                        a: A.getAttribute('class') || A.tagName.toLowerCase(),
                        b: B.getAttribute('class') || B.tagName.toLowerCase(),
                        oy: Math.round(oy), ox: Math.round(ox),
                        textOnText: bothText
                    });
                }
            }
        }

        // Vertical fill: union span of text leaves, chrome excluded
        const textLeaves = els.filter(el => hasDirectText(el) && !isChrome(el));
        if (textLeaves.length) {
            const top = Math.min(...textLeaves.map(el => rect(el).top));
            const bot = Math.max(...textLeaves.map(el => rect(el).bottom));
            rep.fill = Math.round((bot - top) / sRect.height * 100);
        }

        out.slides.push(rep);
    });

    return out;
}
"""


def run_audit(html_path: Path, min_fill: int, warn_fill: int) -> int:
    url = html_path.resolve().as_uri()
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1280, "height": 720})
        try:
            try:
                page.goto(url, wait_until="networkidle", timeout=20000)
            except Exception:
                page.goto(url, wait_until="load", timeout=20000)
            page.evaluate("() => document.fonts.ready")
            page.wait_for_timeout(300)
            result = page.evaluate(AUDIT_JS)
        finally:
            browser.close()

    if result.get("errors"):
        for e in result["errors"]:
            print(f"ERROR: {e}")
        return 2

    stage = result["stage"]
    critical = []
    warnings = []
    fills = []
    all_gaps = []
    for s in result["slides"]:
        if s.get("gaps"):
            all_gaps.extend(s["gaps"])

    print("Frontend Slides — Deck Layout Audit")
    print("=" * 60)
    print(f"Stage: {stage['w']}x{stage['h']} (ratio {stage['ratio']}, "
          f"{'OK' if stage['ratioOk'] else 'NOT 16:9'}, "
          f"centering {'OK' if stage['centeredX'] and stage['centeredY'] else 'OFF'})")
    print(f"Slides: {stage['slideCount']}")
    print("-" * 60)

    for s in result["slides"]:
        fills.append(s["fill"] if s["fill"] is not None else 0)
        label = s["cls"].split(" ")[0] if s["cls"] else "slide"
        fill_str = f"{s['fill']}%" if s["fill"] is not None else "n/a"
        gaps_str = ("/".join(str(g) for g in s["gaps"]) + "px") if s["gaps"] else ""
        status = "OK"
        notes = []

        for o in s["overflow"]:
            sev = "CRITICAL" if o["text"] else "warning"
            notes.append(f"{sev}: overflow on .{o['el']} [{o['detail']}]")
        for o in s["overlaps"]:
            sev = "CRITICAL" if o["textOnText"] else "warning"
            notes.append(f"{sev}: overlap .{o['a']} x .{o['b']} ({o['oy']}px)")
        if s["fill"] is not None and s["fill"] < warn_fill:
            notes.append(f"warning: low vertical fill ({s['fill']}%)")

        if any(n.startswith("CRITICAL") for n in notes):
            status = "FAIL"
        elif any(n.startswith("warning") for n in notes):
            status = "WARN"
        if status != "OK":
            print(f"[{s['idx']:>2}] {label:<12} fill {fill_str:>5}  {gaps_str:<12} {status}")
            for n in notes:
                print(f"      - {n}")
        else:
            print(f"[{s['idx']:>2}] {label:<12} fill {fill_str:>5}  {gaps_str:<12} OK")

        for n in notes:
            if n.startswith("CRITICAL"):
                critical.append(f"slide {s['idx']}: {n}")
            else:
                warnings.append(f"slide {s['idx']}: {n}")

    print("-" * 60)
    for c in result["fixedCollisions"]:
        msg = f"CRITICAL: fixed element .{c['el']} overlaps the slide stage ({c['overlap']}px)"
        print(msg)
        critical.append(msg)

    if not stage["ratioOk"]:
        msg = f"CRITICAL: stage ratio {stage['ratio']} is not 16:9"
        print(msg)
        critical.append(msg)
    if not (stage["centeredX"] and stage["centeredY"]):
        msg = "warning: stage is not centered in the viewport (letterbox/pillarbox)"
        print(msg)
        warnings.append(msg)

    avg_fill = round(sum(fills) / len(fills)) if fills else 0
    print(f"\nDeck average fill: {avg_fill}% (minimum {min_fill}%)")
    if avg_fill < min_fill:
        msg = (f"CRITICAL: deck average fill {avg_fill}% is below {min_fill}% — "
               f"content does not justify this slide count, merge slides")
        print(msg)
        critical.append(msg)

    # Vertical rhythm: one deck-wide gap between major blocks
    if all_gaps:
        gmin, gmax = min(all_gaps), max(all_gaps)
        print(f"Vertical rhythm: gaps {gmin}-{gmax}px between major blocks across the deck")
        if gmax - gmin > 40:
            msg = (f"warning: inconsistent vertical gaps ({gmin}px on some slides, {gmax}px on others) — "
                   f"pick ONE deck-wide title-to-content gap (e.g. 72px at 1920x1080) and use it everywhere")
            print(msg)
            warnings.append(msg)
        if gmax > 160:
            msg = (f"warning: stretched layout — a {gmax}px gap between major blocks reads as a mid-slide hole; "
                   f"group title + content as one compact centered block with a fixed gap")
            print(msg)
            warnings.append(msg)

    print(f"\nSummary: {len(critical)} critical, {len(warnings)} warning(s)")
    if critical:
        print("RESULT: FAIL — fix critical issues and re-run")
        return 1
    if warnings:
        print("RESULT: PASS with warnings — fix or justify each warning before delivery")
    else:
        print("RESULT: PASS")
    return 0


def main():
    ap = argparse.ArgumentParser(description="Frontend Slides deck layout audit")
    ap.add_argument("html", help="path to the presentation HTML file")
    ap.add_argument("--min-fill", type=int, default=50,
                    help="minimum deck average vertical fill %% (default 50)")
    ap.add_argument("--warn-fill", type=int, default=40,
                    help="per-slide fill %% below which a warning is issued (default 40)")
    args = ap.parse_args()

    html_path = Path(args.html)
    if not html_path.is_file():
        print(f"ERROR: file not found: {html_path}")
        sys.exit(2)

    try:
        sys.exit(run_audit(html_path, args.min_fill, args.warn_fill))
    except Exception as e:
        print(f"ERROR: {e}")
        print("Hint: if Chromium is missing, run: python -m playwright install chromium")
        sys.exit(2)


if __name__ == "__main__":
    main()
