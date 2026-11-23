# Infographics and Interactive Explanations

A focused implementation guide for presentation pages that need charts, comparisons, timelines, system diagrams or lightweight interaction. First follow the mode, design and fixed-stage rules in `../SKILL.md`; use `../html-template.md` and `../viewport-base.css` for the document scaffold.

## Choose the simplest rendering method

| Visual | Prefer | Why |
| --- | --- | --- |
| Comparison, process, timeline, architecture | Inline SVG | Sharp at 1920×1080, semantically labelable, easy to animate |
| Metric cards and highlighted conclusions | Semantic HTML + CSS | Readable and easy to edit |
| A few static chart marks | Inline SVG | No runtime chart library needed |
| Many particles or dense animated traces | Canvas 2D | Efficient when DOM/SVG node count would be excessive |
| 3D-looking exploded layers or depth | CSS transforms/perspective or SVG | Preserves the zero-dependency output |
| Complex true 3D | Separately evaluate trade-offs | Do not silently add Three.js or a CDN: the core skill targets zero dependencies |

Use original illustrations, or user-provided/appropriately licensed assets. Do not fabricate real-world data.

## Stage and readability contract

- Author every element within the fixed **1920×1080** slide stage. Let the stage scale uniformly; do not independently reflow the graphic at narrow viewport sizes.
- Use one dominant statement per graphic. Place the evidence and annotation close to what they describe.
- Set SVG `viewBox` explicitly. Avoid hardcoded viewport-responsive CSS that changes the aspect ratio of the slide.
- Keep type, chart labels and touch targets legible in an entire 16:9 slide at common display sizes; split dense material into multiple slides.
- Do not encode category or status by color alone. Add visible labels, patterns, icons or annotations.
- Always distinguish measured figures, illustrative values and assumptions; include a source or an explicit "illustrative" label when needed.

## Practical infographic patterns

### Before/after comparison

Use the same visual scale, baseline, unit and labeling on both sides. Avoid dramatic transforms that imply improvement not supported by the data. On entry, reveal the baseline first, then the comparison, then the conclusion.

### Timeline

Keep events in temporal order and use spacing proportionate to elapsed time if the diagram claims to be to scale. If spacing is only for legibility, label it "not to scale". Consider a progress path with clear step labels and keyboard-selectable detail buttons.

### Process or system diagram

Use SVG groups for nodes, lines for relationships and text labels for link meaning. Preserve arrow direction, avoid crossings where possible and provide a plain-language summary of the flow for screen readers.

### Chart

Normalize values against a clearly stated axis, including the zero baseline where meaningful. Label category, units, source and period. Avoid misleading truncated bars, uncertain ranges depicted as exact values or animation that changes the underlying data.

## Motion choreography

1. Establish context (headline and stable axes or diagram frame).
2. Reveal the first explanatory step.
3. Animate the relationship or change, not arbitrary decoration.
4. Hold the final state long enough to be understood.
5. Keep transitions reversible and deterministic when returning to a slide.

Favor `transform` and `opacity` over animating geometry and layout. Respect `prefers-reduced-motion`; reduced motion must reveal all final content rather than hide it. When a slide becomes inactive, pause loops and expensive Canvas rendering.

## Interaction contract

- Navigation remains operable with Arrow keys, Space, Escape (as applicable) and visible focus.
- Interactive reveals should be accessible with real `button` elements, not clickable `div` elements.
- Each control must have a clear label, purpose, pressed/expanded state when applicable and a visible result.
- Do not rely on hover-only tooltips; make supporting details accessible on click, focus or in persistent text.
- Reset or restore state predictably when revisiting slides. Don't trap keyboard focus or steal slide navigation keys from input controls.
- Include a static fallback for environments where JavaScript cannot run, especially for explanatory content.

## Minimal SVG example

The simple markup below is a visual pattern, not a complete slide. Place it inside the fixed stage:

```html
<figure aria-labelledby="chart-title">
  <svg viewBox="0 0 900 350" role="img" aria-labelledby="chart-title chart-desc">
    <title id="chart-title">Illustrative comparison</title>
    <desc id="chart-desc">Option A: 35 units; Option B: 60 units. Example values only.</desc>
    <text x="20" y="56">Option A</text>
    <rect x="220" y="25" width="245" height="42" rx="6" />
    <text x="490" y="56">35 units</text>
    <text x="20" y="138">Option B</text>
    <rect x="220" y="107" width="420" height="42" rx="6" />
    <text x="670" y="138">60 units</text>
  </svg>
  <figcaption>Illustrative values, not measured data.</figcaption>
</figure>
```

These widths share a 7 px/unit scale. In a real deck, establish foreground/background contrast through design tokens and make the visible title and data source explicit.
