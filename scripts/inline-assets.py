#!/usr/bin/env python3
"""
Inline a deck's local assets as base64 data URLs so the HTML file is fully
self-contained and can be emailed, Slacked, or copied anywhere.

Usage:
    python3 inline-assets.py <input.html> [output.html] [options]

Options:
    --in-place       Rewrite the input file instead of writing a new file.
    --max-bytes N    Skip any single asset larger than N bytes (default 10485760 = 10MB).
    --quiet          Print only the final summary.

Examples:
    python3 scripts/inline-assets.py ./my-deck/index.html
    python3 scripts/inline-assets.py ./presentation.html ./presentation-shareable.html
    python3 scripts/inline-assets.py ./presentation.html --in-place

What gets inlined:
    Local images, video, audio, and font files referenced from HTML attributes
    (src, href, poster, srcset, data-src, ...) or from CSS url(...) — whether the
    CSS lives in a <style> block or an inline style="..." attribute.

What is left alone:
    Remote http(s) URLs, protocol-relative //urls, existing data:/blob: URLs,
    page anchors, mailto: links, and anything that is not a media/font file
    (a link to another .html page stays a link).

Requires: Python 3.7+ — standard library only.
"""

import base64
import os
import re
import sys
from urllib.parse import unquote
from urllib.request import url2pathname

# ─── What counts as an inlinable asset ─────────────────────────────
# Explicit map rather than the `mimetypes` module: the extensions a deck
# actually uses are few, and the answer should not vary by platform.
MIME_BY_EXT = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".avif": "image/avif",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".bmp": "image/bmp",
    ".mp4": "video/mp4",
    ".webm": "video/webm",
    ".ogv": "video/ogg",
    ".mp3": "audio/mpeg",
    ".wav": "audio/wav",
    ".m4a": "audio/mp4",
    ".ogg": "audio/ogg",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".ttf": "font/ttf",
    ".otf": "font/otf",
}

DEFAULT_MAX_BYTES = 10 * 1024 * 1024  # 10MB per asset
SIZE_WARNING_BYTES = 25 * 1024 * 1024  # warn if the output grows past this

# Attributes that can point at a single asset.
ATTR_PATTERN = re.compile(
    r"""(?P<attr>src|href|poster|data-src|data-image|data-background|data-background-image)"""
    r"""(?P<between>\s*=\s*)"""
    r"""(?P<quote>["'])(?P<value>[^"']*)(?P=quote)""",
    re.IGNORECASE,
)

# Attributes that hold a comma-separated candidate list with descriptors.
SRCSET_PATTERN = re.compile(
    r"""(?P<attr>srcset|data-srcset)(?P<between>\s*=\s*)"""
    r"""(?P<quote>["'])(?P<value>[^"']*)(?P=quote)""",
    re.IGNORECASE,
)

# CSS url(...) — quoted or bare.
CSS_URL_PATTERN = re.compile(
    r"""url\(\s*(?P<quote>["']?)(?P<value>[^"')]+)(?P=quote)\s*\)""",
    re.IGNORECASE,
)


def is_external(ref):
    """True for anything that is already portable or is not a file path at all."""
    ref = ref.strip()
    if not ref:
        return True
    if ref.startswith(("#", "//", "?")):
        return True
    # A scheme of two or more letters (data:, http:, mailto:, blob:). A single
    # letter is a Windows drive, e.g. C:\deck\logo.png.
    scheme = re.match(r"^([A-Za-z][A-Za-z0-9+.\-]+):", ref)
    if scheme and scheme.group(1).lower() != "file":
        return True
    return False


def resolve_path(ref, base_dir):
    """Map an HTML/CSS reference to a filesystem path, or None if unusable."""
    ref = ref.strip()

    if ref.lower().startswith("file:"):
        path = url2pathname(ref[len("file:") :].lstrip("/"))
        path = os.sep + path if ref.lower().startswith("file:///") else path
    else:
        # Drop cache-busting queries and fragments: logo.png?v=2, sprite.svg#icon
        path = re.split(r"[?#]", ref, maxsplit=1)[0]
        path = unquote(path)

    if not path:
        return None
    if not os.path.isabs(path):
        path = os.path.join(base_dir, path)
    return os.path.normpath(path)


class Inliner:
    """Turns local asset references into data URLs, keeping a tally as it goes."""

    def __init__(self, base_dir, max_bytes=DEFAULT_MAX_BYTES, quiet=False):
        self.base_dir = base_dir
        self.max_bytes = max_bytes
        self.quiet = quiet
        self.cache = {}  # path -> data URL, so a reused asset is read once
        self.inlined = {}  # path -> source bytes
        self.skipped = []  # (ref, reason)

    def log(self, message):
        if not self.quiet:
            print(message)

    def convert(self, ref):
        """Return a data URL for `ref`, or None to leave the reference as-is."""
        if is_external(ref):
            return None

        ext = os.path.splitext(re.split(r"[?#]", ref.strip(), maxsplit=1)[0])[1].lower()
        mime = MIME_BY_EXT.get(ext)
        if mime is None:
            # Not a media/font reference — a link to another page, a stylesheet,
            # a script. Leaving these alone is the correct behavior.
            return None

        path = resolve_path(ref, self.base_dir)
        if path is None:
            return None

        if path in self.cache:
            return self.cache[path]

        if not os.path.isfile(path):
            self.skipped.append((ref, "file not found"))
            return None

        size = os.path.getsize(path)
        if size > self.max_bytes:
            self.skipped.append(
                (ref, "%s exceeds the %s limit" % (human(size), human(self.max_bytes)))
            )
            return None

        try:
            with open(path, "rb") as handle:
                payload = handle.read()
        except OSError as exc:
            self.skipped.append((ref, "could not read: %s" % exc))
            return None

        data_url = "data:%s;base64,%s" % (
            mime,
            base64.b64encode(payload).decode("ascii"),
        )
        self.cache[path] = data_url
        self.inlined[path] = size
        self.log("  inlined %s (%s)" % (ref, human(size)))
        return data_url

    # ─── Regex callbacks ──────────────────────────────────────────

    def _attr(self, match):
        data_url = self.convert(match.group("value"))
        if data_url is None:
            return match.group(0)
        quote = match.group("quote")
        return "%s%s%s%s%s" % (
            match.group("attr"),
            match.group("between"),
            quote,
            data_url,
            quote,
        )

    def _srcset(self, match):
        candidates = []
        changed = False
        for candidate in match.group("value").split(","):
            parts = candidate.strip().split()
            if not parts:
                continue
            data_url = self.convert(parts[0])
            if data_url is not None:
                parts[0] = data_url
                changed = True
            candidates.append(" ".join(parts))
        if not changed:
            return match.group(0)
        quote = match.group("quote")
        return "%s%s%s%s%s" % (
            match.group("attr"),
            match.group("between"),
            quote,
            ", ".join(candidates),
            quote,
        )

    def _css_url(self, match):
        data_url = self.convert(match.group("value"))
        if data_url is None:
            return match.group(0)
        # Keep whatever quoting the source used. Introducing a double quote here
        # would terminate a surrounding style="..." attribute early; a base64
        # data URL is a valid unquoted CSS url token on its own.
        quote = match.group("quote")
        return "url(%s%s%s)" % (quote, data_url, quote)

    def run(self, html):
        html = SRCSET_PATTERN.sub(self._srcset, html)
        html = ATTR_PATTERN.sub(self._attr, html)
        html = CSS_URL_PATTERN.sub(self._css_url, html)
        return html


def human(num_bytes):
    """Format a byte count the way a person would say it."""
    size = float(num_bytes)
    for unit in ("B", "KB", "MB", "GB"):
        if size < 1024 or unit == "GB":
            return "%.0f %s" % (size, unit) if unit == "B" else "%.1f %s" % (size, unit)
        size /= 1024


def parse_args(argv):
    positional = []
    in_place = False
    quiet = False
    max_bytes = DEFAULT_MAX_BYTES

    index = 0
    while index < len(argv):
        arg = argv[index]
        if arg == "--in-place":
            in_place = True
        elif arg == "--quiet":
            quiet = True
        elif arg == "--max-bytes":
            index += 1
            if index >= len(argv):
                fail("--max-bytes needs a value, e.g. --max-bytes 20971520")
            max_bytes = parse_int(argv[index])
        elif arg.startswith("--max-bytes="):
            max_bytes = parse_int(arg.split("=", 1)[1])
        elif arg in ("-h", "--help"):
            print(__doc__.strip())
            sys.exit(0)
        elif arg.startswith("-"):
            fail("Unknown option: %s" % arg)
        else:
            positional.append(arg)
        index += 1

    if not positional:
        print(__doc__.strip())
        sys.exit(1)
    if len(positional) > 2:
        fail("Too many paths given. Usage: inline-assets.py <input.html> [output.html]")

    return positional, in_place, quiet, max_bytes


def parse_int(value):
    try:
        parsed = int(value)
    except ValueError:
        fail("--max-bytes must be a whole number of bytes, got %r" % value)
    if parsed <= 0:
        fail("--max-bytes must be greater than zero")
    return parsed


def fail(message):
    print("Error: %s" % message, file=sys.stderr)
    sys.exit(1)


def main(argv):
    positional, in_place, quiet, max_bytes = parse_args(argv)

    input_path = positional[0]
    if not os.path.isfile(input_path):
        fail("'%s' is not a file." % input_path)

    if in_place:
        if len(positional) > 1:
            fail("Pass either an output path or --in-place, not both.")
        output_path = input_path
    elif len(positional) > 1:
        output_path = positional[1]
    else:
        stem, ext = os.path.splitext(input_path)
        output_path = "%s-standalone%s" % (stem, ext or ".html")

    with open(input_path, "r", encoding="utf-8") as handle:
        html = handle.read()

    base_dir = os.path.dirname(os.path.abspath(input_path))
    inliner = Inliner(base_dir, max_bytes=max_bytes, quiet=quiet)

    if not quiet:
        print("Inlining local assets in %s" % input_path)

    result = inliner.run(html)

    output_dir = os.path.dirname(os.path.abspath(output_path))
    if output_dir:
        os.makedirs(output_dir, exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as handle:
        handle.write(result)

    # ─── Summary ──────────────────────────────────────────────────
    asset_count = len(inliner.inlined)
    asset_bytes = sum(inliner.inlined.values())
    output_bytes = os.path.getsize(output_path)

    print("")
    if asset_count:
        print(
            "Inlined %d asset%s (%s of source files) into %s"
            % (asset_count, "" if asset_count == 1 else "s", human(asset_bytes), output_path)
        )
    else:
        print("No local assets to inline — wrote %s unchanged." % output_path)
    print("Output size: %s" % human(output_bytes))

    if inliner.skipped:
        print("")
        print("Left as-is (%d):" % len(inliner.skipped))
        for ref, reason in inliner.skipped:
            print("  %s — %s" % (ref, reason))
        print("")
        print("Those references still point at local files, so they will break")
        print("for anyone else. Fix the paths, or raise --max-bytes, and re-run.")

    if output_bytes > SIZE_WARNING_BYTES:
        print("")
        print(
            "Warning: %s is large for a single HTML file and may be slow to open"
            % human(output_bytes)
        )
        print("or too big to email. Consider compressing the images, or deploy to a")
        print("URL instead (scripts/deploy.sh).")

    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
