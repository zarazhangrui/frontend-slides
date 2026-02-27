# Vibe Slides

An agent skill for creating stunning, zero-dependency HTML presentations — from scratch or by converting PowerPoint files. Works with Claude Code, Codex, Gemini CLI, Cursor, and [40+ other agents](https://add-skill.org).

## Install

**macOS / Linux:**

```bash
git clone https://github.com/arcniko/vibe-slides.git /tmp/vibe-slides && cp -r /tmp/vibe-slides/skills/* ~/.claude/skills/ && rm -rf /tmp/vibe-slides
```

**Windows (PowerShell):**

```powershell
git clone https://github.com/arcniko/vibe-slides.git $env:TEMP\vibe-slides; Copy-Item -Recurse $env:TEMP\vibe-slides\skills\* $HOME\.claude\skills\; Remove-Item -Recurse -Force $env:TEMP\vibe-slides
```

**Manual (no terminal):**

1. Download the [`skills/vibe-slides/`](skills/vibe-slides/) folder from this repo
2. Copy it into one of these locations:
   - `~/.claude/skills/vibe-slides/` — available in all projects
   - `<project>/.claude/skills/vibe-slides/` — available in one project
   - `<project>/.agents/vibe-slides/` — for non-Claude agents

Then use `/vibe-slides` in Claude Code.

## What it does

- **Zero dependencies** — Single HTML files with inline CSS/JS. No npm, no build tools.
- **Visual style discovery** — Generates previews so you pick what looks good, not describe it.
- **PowerPoint conversion** — Extracts text, images, and notes from .pptx files.
- **Production quality** — Accessible, responsive, well-commented code.
- **Viewport-perfect** — Every slide fits exactly within the viewport. No scrolling.

## Available styles

12 curated presets spanning dark themes (Archon, Neon Cyber, Terminal Green), light themes (Swiss Modern, Paper & Ink, Soft Pastel), and specialty styles (Brutalist, Gradient Wave). See [STYLE_PRESETS.md](skills/vibe-slides/STYLE_PRESETS.md) for the full catalog.

## Included templates

Two ready-to-use templates with assets (logos, patterns, SVGs):

- **Archon** — Deep-tech cinematic with corporate polish. Dark midnight blue, neon green accents, glass-morphism cards, triangle mosaics.
- **Archon Grid** — Same as Archon with an animated canvas grid glow overlay.

## Credits

Based on [frontend-slides](https://github.com/zarazhangrui/frontend-slides) by [@zarazhangrui](https://github.com/zarazhangrui). Extended with templates, additional style presets, and enhanced viewport fitting.

## License

[MIT](LICENSE) — Use it, modify it, share it.
