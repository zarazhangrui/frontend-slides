# Share and Export Reference

Use this reference only after the HTML deck has been delivered and the user asks to deploy, share, export, or package it.

## Ask First

Ask the user which delivery format they want:

- **Deploy to URL** — public Vercel link that works on any device.
- **Export to PDF** — static file for email, Slack, Notion, print, or archives.
- **Both**.
- **No thanks**.

Do not deploy to a public URL without explicit user approval.

## Deploy to Vercel

Use:

```bash
bash scripts/deploy.sh <path-to-slide-folder-or-html>
```

The script accepts:

- a folder containing `index.html`, or
- a single `.html` file.

Prefer folder deployment when the presentation has many local assets. Folder deployment uploads the complete folder as-is and is less fragile than reconstructing asset references from a single HTML file.

### Before deploying

- Confirm the deck opens locally.
- Confirm image/video/font paths are relative, not absolute filesystem paths.
- If using a single HTML file, ensure referenced assets live beside it or in common asset folders such as `assets/`, `images/`, `fonts/`, or `media/`.
- If the user has never deployed before, explain that Vercel requires an account and CLI login.

### After deploying

Tell the user:

- the live URL from the script output,
- that the URL works on phones, tablets, and desktops,
- that they can remove it later from the Vercel dashboard,
- that they should visually check the live URL for missing assets.

## Export to PDF

Use:

```bash
bash scripts/export-pdf.sh <path-to-html> [output.pdf]
```

For a smaller PDF:

```bash
bash scripts/export-pdf.sh <path-to-html> [output.pdf] --compact
```

The export script:

- starts a localhost-only static server,
- opens the deck in Playwright/Chromium,
- screenshots each `.slide`,
- forces reveal animations into a static visible state,
- combines screenshots into a PDF.

### Set expectations

Tell the user that the PDF is static. Animations, keyboard navigation, inline editing, and browser interactivity are not preserved.

### Common fixes

- **0 slides found:** the HTML must contain `.slide` elements.
- **Missing images:** fix absolute paths; use relative paths beside the HTML or inside an asset folder.
- **First run is slow:** Playwright may need to download Chromium.
- **Large PDF:** rerun with `--compact`, which renders at 1280×720 instead of 1920×1080.
- **Corporate firewall blocks Chromium download:** run `npx playwright install chromium` on an allowed network or use a machine that already has Playwright browsers installed.

## Final Delivery Message

After deploy/export, include:

- file path or live URL,
- slide count,
- known limitations,
- one concise next action, such as "Review the live URL for assets" or "Use compact export if the PDF is too large."
