# frontend-slides (Gemini CLI)

A Gemini CLI Agent Skill for creating beautiful, animation-rich HTML presentations.

Ported from [zarazhangrui/frontend-slides](https://github.com/zarazhangrui/frontend-slides).

## Structure

```
frontend-slides/
├── SKILL.md                      # Core methodology + metadata
└── references/
    └── STYLE_PRESETS.md          # 10 curated visual styles (loaded on demand)
```

## Installation

```bash
# User scope (all workspaces)
gemini skills install /path/to/frontend-slides

# Workspace scope (this project only)
gemini skills install /path/to/frontend-slides --scope workspace

# Or manually
mkdir -p ~/.gemini/skills/frontend-slides/references
cp SKILL.md ~/.gemini/skills/frontend-slides/
cp references/STYLE_PRESETS.md ~/.gemini/skills/frontend-slides/references/
```

Or install directly from Git once published:

```bash
gemini skills install https://github.com/yourfork/frontend-slides.git
```

## Usage

Gemini activates the skill automatically when you describe a presentation task:

```
> Create a pitch deck for my fintech startup — 8 slides, targeting VCs
> Convert my quarterly-review.pptx to a web presentation
> Make a dark techy presentation about our API launch
```

## Requirements

- Gemini CLI
- Python + `python-pptx` for PPT conversion only

## License

MIT
