#!/usr/bin/env python3
"""export-deck.py — Export a Frontend Slides deck to PDF and/or PowerPoint.

Renders every slide at 1920x1080 and produces:
  - a PDF  (one 16:9 page per slide)
  - a PPTX (one 16:9 slide per screenshot)

Screenshot-based rendering preserves the exact design (fonts, colors, layout).
Note: PowerPoint slides are images, so text is not natively editable.

Usage:
  python scripts/export-deck.py <path-to-html> [--out <dir>] [--pdf] [--pptx] [--compact]

Options:
  --out <dir>    output directory (default: beside the HTML file)
  --pdf          export the PDF only
  --pptx         export the PPTX only
  --compact      render at 1280x720 instead of 1920x1080 (smaller files)
  --no-open      do not auto-open the output directory

Requires: python, playwright (browser), Pillow, python-pptx.
  pip install playwright pillow python-pptx
  python -m playwright install chromium
"""

import argparse
import hashlib
import http.server
import socketserver
import sys
import threading
import webbrowser
from pathlib import Path


def hash_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()

try:
    from playwright.sync_api import sync_playwright
except ImportError:
    sync_playwright = None

try:
    from PIL import Image
except ImportError:
    Image = None

try:
    from pptx import Presentation
    from pptx.util import Inches
except ImportError:
    Presentation = None


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


def _start_server(serve_dir: Path):
    """Start a local HTTP server for the deck folder. Returns (port, thread)."""
    handler = lambda *a, **k: QuietHandler(*a, directory=str(serve_dir), **k)
    httpd = socketserver.TCPServer(("127.0.0.1", 0), handler)
    port = httpd.server_address[1]
    t = threading.Thread(target=httpd.serve_forever, daemon=True)
    t.start()
    return port, httpd


def _open_slide_safely(page, index: int):
    """Show ONLY slide `index` and settle animations, hiding every other slide."""
    page.evaluate(
        """(idx) => {
            const slides = document.querySelectorAll('.slide');
            slides.forEach((s, k) => {
                s.classList.toggle('active', k === idx);
                s.classList.toggle('visible', k === idx);
                s.querySelectorAll('.reveal').forEach(el => {
                    el.style.transition = 'none';
                    el.style.transform = 'none';
                    el.style.opacity = '1';
                    el.style.visibility = 'visible';
                });
                if (k === idx) {
                    // target slide: fully visible, keep its CSS layout (absolute inset:0)
                    s.style.display = '';
                    s.style.opacity = '1';
                    s.style.visibility = 'visible';
                    s.style.pointerEvents = 'auto';
                } else {
                    // hide every other slide so it does not overlap the target
                    s.style.display = 'none';
                }
            });
        }""",
        index,
    )
    page.wait_for_timeout(200)


def export(input_html: Path, out_dir: Path, do_pdf: bool, do_pptx: bool, width: int, height: int, open_dir: bool):
    if sync_playwright is None:
        sys.exit("ERROR: Playwright (Python) is required. pip install playwright  &&  python -m playwright install chromium")
    if do_pdf and Image is None:
        sys.exit("ERROR: Pillow is required for PDF export. pip install pillow")
    if do_pptx and Presentation is None:
        sys.exit("ERROR: python-pptx is required for PPTX export. pip install python-pptx")

    out_dir.mkdir(parents=True, exist_ok=True)
    png_dir = out_dir / ".export-png"
    png_dir.mkdir(exist_ok=True)

    port, httpd = _start_server(input_html.parent)
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page(viewport={"width": width, "height": height})
            page.goto(f"http://127.0.0.1:{port}/{input_html.name}", wait_until="networkidle")
            page.evaluate("() => document.fonts.ready")
            page.wait_for_timeout(600)

            slide_count = page.evaluate("() => document.querySelectorAll('.slide').length")
            if slide_count == 0:
                sys.exit("ERROR: no .slide elements found in the presentation")

            pngs = []
            for i in range(slide_count):
                _open_slide_safely(page, i)
                p = png_dir / f"slide-{i+1:03d}.png"
                page.screenshot(path=str(p), clip={"x": 0, "y": 0, "width": width, "height": height})
                pngs.append(p)
                print(f"  captured slide {i+1}/{slide_count}")
            browser.close()
    finally:
        httpd.shutdown()
        httpd.server_close()

    # Integrity check: every slide must be a distinct image. If two captures are
    # identical, the export is showing the same slide everywhere (a real bug we
    # shipped once). Refuse to assemble a broken PDF/PPTX.
    if len(pngs) > 1:
        hashes = {}
        for p in pngs:
            h = hash_bytes(p.read_bytes())
            hashes.setdefault(h, []).append(p.name)
        duplicates = {k: v for k, v in hashes.items() if len(v) > 1}
        if duplicates:
            for v in duplicates.values():
                print(f"ERROR: identical captures: {', '.join(v)} — every slide must render differently.")
            sys.exit("Integrity check failed: the export would show the same slide on every page.")

    results = []
    if do_pdf:
        pdf_path = out_dir / (input_html.stem + ".pdf")
        imgs = [Image.open(p).convert("RGB") for p in pngs]
        imgs[0].save(pdf_path, save_all=True, append_images=imgs[1:], resolution=96, quality=95)
        results.append(pdf_path)
        print(f"PDF  -> {pdf_path}")

    if do_pptx:
        pptx_path = out_dir / (input_html.stem + ".pptx")
        prs = Presentation()
        prs.slide_width = Inches(13.333)
        prs.slide_height = Inches(7.5)
        blank = prs.slide_layouts[6]
        for p in pngs:
            slide = prs.slides.add_slide(blank)
            slide.shapes.add_picture(str(p), 0, 0, prs.slide_width, prs.slide_height)
        prs.save(pptx_path)
        results.append(pptx_path)
        print(f"PPTX -> {pptx_path}")

    # Clean up temp PNGs
    for p in png_dir.glob("*.png"):
        p.unlink()
    png_dir.rmdir()

    if open_dir:
        try:
            webbrowser.open(str(out_dir))
        except Exception:
            pass

    return results


def main():
    ap = argparse.ArgumentParser(description="Export a Frontend Slides deck to PDF and/or PPTX")
    ap.add_argument("html", help="path to the presentation HTML file")
    ap.add_argument("--out", default=None, help="output directory (default: beside the HTML)")
    ap.add_argument("--pdf", action="store_true", help="export PDF only")
    ap.add_argument("--pptx", action="store_true", help="export PPTX only")
    ap.add_argument("--compact", action="store_true", help="render at 1280x720")
    ap.add_argument("--no-open", action="store_true", help="do not auto-open the output directory")
    args = ap.parse_args()

    input_html = Path(args.html)
    if not input_html.is_file():
        sys.exit(f"ERROR: file not found: {input_html}")

    width, height = (1280, 720) if args.compact else (1920, 1080)
    out_dir = Path(args.out) if args.out else input_html.parent

    do_pdf = not args.pptx
    do_pptx = not args.pdf

    print(f"Exporting slides ({width}x{height}) -> {out_dir}")
    export(input_html, out_dir, do_pdf, do_pptx, width, height, open_dir=not args.no_open)
    print("Done.")


if __name__ == "__main__":
    main()
