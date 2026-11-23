# Frontend Slides — Reference Library

These guides extend `SKILL.md` without loading implementation details for every task. Read the smallest relevant document when a request needs it.

| Task | Read on demand |
| --- | --- |
| Choose a visual direction | [STYLE_PRESETS.md](../STYLE_PRESETS.md), then [bold-template-pack/README.md](../bold-template-pack/README.md) if using bold templates |
| Implement the fixed 16:9 stage | [viewport-base.css](../viewport-base.css) and [html-template.md](../html-template.md) |
| Choose entrance or background animation | [animation-patterns.md](../animation-patterns.md) |
| Build data visuals, explainers or controlled interactions | [infographics-and-interactions.md](infographics-and-interactions.md) |
| Audit a finished presentation | [verification-checklist.md](verification-checklist.md) |

## Reading rules

1. Read `SKILL.md` first to determine new-deck, conversion or enhancement mode.
2. Read `viewport-base.css` before implementing a deck; include its full stage rules.
3. Open additional references only when the task requires them. Avoid copying unrelated guidance into the agent context.
4. Resolve conflicts in favor of `SKILL.md`, especially the zero-dependency single-HTML goal and fixed 1920×1080 stage.
5. Treat examples as patterns, not validated facts or licenses for third-party assets.

The skill is also packaged under `plugins/frontend-slides/skills/frontend-slides/`. Keep reference files and pointers synchronized between the root skill and the packaged copy.
