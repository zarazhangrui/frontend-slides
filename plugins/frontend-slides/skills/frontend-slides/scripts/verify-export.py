#!/usr/bin/env python3
"""verify-export.py — Verify an exported PDF or PPTX is not broken.

Checks that:
  - the file opens and has the expected number of pages/slides
  - the pages/slides are genuinely distinct (not the same slide repeated)

This catches a real failure mode: a broken capture produces a PDF where
every page shows the first slide. PIL cannot read PDFs, so this uses
PyMuPDF (fitz) for PDFs and python-pptx for PPTX.

Usage:
  python scripts/verify-export.py <file.pdf|file.pptx> [expected_pages]

Requires: pymupdf (PDF), python-pptx (PPTX).
  pip install pymupdf python-pptx
"""

import hashlib
import sys
from pathlib import Path

from PIL import Image  # only for hashing rendered page bitmaps


def _sha(b: bytes) -> str:
    return hashlib.sha256(b).hexdigest()


def verify_pdf(path: Path, expected=None) -> int:
    try:
        import pymupdf  # PyMuPDF modern import
    except ImportError:
        import fitz as pymupdf
    doc = pymupdf.open(path)
    n = doc.page_count
    print(f"PDF: {n} pages")

    if expected is not None and n != expected:
        print(f"ERROR: expected {expected} pages, found {n}")
        doc.close()
        return 1

    if n > 1:
        hashes = []
        for page in doc:
            pix = page.get_pixmap(matrix=pymupdf.Matrix(0.5, 0.5))
            hashes.append(_sha(pix.samples))
        distinct = len(set(hashes))
        doc.close()
        if distinct < n:
            print(f"ERROR: only {distinct} distinct page(s) out of {n} — " 
                  f"the same slide is repeated. The capture is broken.")
            return 1
        print(f"OK: {distinct} distinct pages")
    return 0


def verify_pptx(path: Path, expected=None) -> int:
    from pptx import Presentation

    prs = Presentation(path)
    n = len(prs.slides._sldIdLst)
    print(f"PPTX: {n} slides")

    if expected is not None and n != expected:
        print(f"ERROR: expected {expected} slides, found {n}")
        return 1

    if n > 1:
        hashes = []
        for slide in prs.slides:
            img = slide.shapes[0].image.blob if slide.shapes else b""
            hashes.append(_sha(img))
        distinct = len(set(hashes))
        if distinct < n:
            print(f"ERROR: only {distinct} distinct slide(s) out of {n} — "
                  f"the same slide is repeated.")
            return 1
        print(f"OK: {distinct} distinct slides")
    return 0


def main():
    if len(sys.argv) < 2:
        print("Usage: python scripts/verify-export.py <file> [expected_count]")
        return 2
    path = Path(sys.argv[1])
    expected = int(sys.argv[2]) if len(sys.argv) > 2 else None
    if not path.is_file():
        print(f"ERROR: file not found: {path}")
        return 2

    ext = path.suffix.lower()
    if ext == ".pdf":
        return verify_pdf(path, expected)
    if ext == ".pptx":
        return verify_pptx(path, expected)
    print(f"ERROR: unsupported format {ext}")
    return 2


if __name__ == "__main__":
    sys.exit(main())
