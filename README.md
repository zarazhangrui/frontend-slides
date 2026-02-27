# Frontend Slides

A Claude Code skill for creating stunning, animation-rich HTML presentations — from scratch or by converting PowerPoint files.

## What This Does

**Frontend Slides** helps non-designers create beautiful web presentations without knowing CSS or JavaScript. It uses a "show, don't tell" approach: instead of asking you to describe your aesthetic preferences in words, it generates visual previews and lets you pick what you like.

### Key Features

- **Zero Dependencies** — Single HTML files with inline CSS/JS. No npm, no build tools, no frameworks.
- **Visual Style Discovery** — Can't articulate design preferences? No problem. Pick from generated visual previews.
- **PPT Conversion** — Convert existing PowerPoint files to web, preserving all images and content.
- **Anti-AI-Slop** — Curated distinctive styles that avoid generic AI aesthetics (bye-bye, purple gradients on white).
- **Production Quality** — Accessible, responsive, well-commented code you can customize.

## Installation

### For Claude Code Users

Copy the skill files to your Claude Code skills directory:

```bash
# Create the skill directory
mkdir -p ~/.claude/skills/frontend-slides

# Copy the files (or download from this repo)
cp SKILL.md ~/.claude/skills/frontend-slides/
cp STYLE_PRESETS.md ~/.claude/skills/frontend-slides/
```

Then use it by typing `/frontend-slides` in Claude Code.

### Manual Download

1. Download `SKILL.md` and `STYLE_PRESETS.md` from this repo
2. Place them in `~/.claude/skills/frontend-slides/`
3. Restart Claude Code

## Usage

### Create a New Presentation

```
/frontend-slides

> "I want to create a pitch deck for my AI startup"
```

The skill will:
1. Ask about your content (slides, messages, images)
2. Ask about the feeling you want (impressed? excited? calm?)
3. Generate 3 visual style previews for you to compare
4. Create the full presentation in your chosen style
5. Open it in your browser

### Convert a PowerPoint

```
/frontend-slides

> "Convert my presentation.pptx to a web slideshow"
```

The skill will:
1. Extract all text, images, and notes from your PPT
2. Show you the extracted content for confirmation
3. Let you pick a visual style
4. Generate an HTML presentation with all your original assets

## Included Styles

### Dark Themes
- **Neon Cyber** — Futuristic, techy, particle effects
- **Midnight Executive** — Premium, corporate, trustworthy
- **Deep Space** — Cinematic, inspiring, vast
- **Terminal Green** — Developer-focused, hacker aesthetic

### Light Themes
- **Paper & Ink** — Editorial, literary, refined
- **Swiss Modern** — Clean, Bauhaus-inspired, geometric
- **Soft Pastel** — Friendly, playful, creative
- **Warm Editorial** — Magazine-style, photographic

### Specialty
- **Brutalist** — Raw, bold, attention-grabbing
- **Gradient Wave** — Modern SaaS aesthetic

## Output Example

Each presentation is a single, self-contained HTML file:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Fonts, CSS variables, all styles inline -->
</head>
<body>
    <section class="slide title-slide">
        <h1 class="reveal">Your Title</h1>
    </section>

    <section class="slide">
        <h2 class="reveal">Slide Content</h2>
    </section>

    <!-- Navigation: Arrow keys, scroll, swipe, or click dots -->
    <script>
        // SlidePresentation controller, animations, interactions
    </script>
</body>
</html>
```

Features included:
- Keyboard navigation (arrows, space)
- Touch/swipe support
- Mouse wheel scrolling
- Progress bar
- Navigation dots
- Scroll-triggered animations
- Responsive design
- Reduced motion support

## Publish & Share

Got a beautiful presentation? Publish it to a live URL without leaving Claude Code.

[**MyVibe**](https://www.myvibe.so) provides a Claude Code skill ([`myvibe-publish`](https://github.com/ArcBlock/agent-skills/tree/main/skills/myvibe-publish)) that deploys your slides directly from the terminal — no browser, no drag-and-drop, no context switching.

### Skill-to-Skill workflow

```
/frontend-slides  →  generate your slides
/myvibe-publish   →  deploy to a live URL instantly
```

That's it. Two skills, zero friction. Your presentation goes from idea to shareable link in one session.

### Install the publish skill

```bash
mkdir -p ~/.claude/skills/myvibe-publish
curl -sL https://raw.githubusercontent.com/ArcBlock/agent-skills/main/skills/myvibe-publish/SKILL.md \
  -o ~/.claude/skills/myvibe-publish/SKILL.md
```

### Why MyVibe + Frontend Slides

- **Stay in the terminal** — No need to open a browser or configure hosting. `/myvibe-publish` handles everything.
- **Built for single-file projects** — MyVibe is optimized for exactly the self-contained HTML that this skill produces.
- **Instant sharing** — Get a live URL in seconds. Share it in Slack, email, or social media.
- **Free tier available** — Publish and share without paying anything.

You can also upload manually at [www.myvibe.so](https://www.myvibe.so) if you prefer a visual interface.

> *MyVibe is an open platform for hosting vibe-coded web projects. Built by [ArcBlock](https://www.arcblock.io).*

## Philosophy

This skill was born from the belief that:

1. **You don't need to be a designer to make beautiful things.** You just need to react to what you see.

2. **Dependencies are debt.** A single HTML file will work in 10 years. A React project from 2019? Good luck.

3. **Generic is forgettable.** Every presentation should feel custom-crafted, not template-generated.

4. **Comments are kindness.** Code should explain itself to future-you (or anyone else who opens it).

## Files

| File | Purpose |
|------|---------|
| `SKILL.md` | Main skill instructions for Claude Code |
| `STYLE_PRESETS.md` | Reference file with 10 curated visual styles |

## Requirements

- [Claude Code](https://claude.ai/claude-code) CLI
- For PPT conversion: Python with `python-pptx` library

## Credits

Created by [@zarazhangrui](https://github.com/zarazhangrui) with Claude Code.

Inspired by the "Vibe Coding" philosophy — building beautiful things without being a traditional software engineer.

## License

MIT — Use it, modify it, share it.
