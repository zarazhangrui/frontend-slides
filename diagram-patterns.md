# Diagram Patterns Reference

Zero-dependency layouts for relationship diagrams, flowcharts, and topology maps. **Use these when the source material contains visual diagrams — never downgrade them into card grids or bullet lists.**

All patterns are pure HTML/CSS/SVG with no external dependencies. They respect the same viewport-fitting rules as the rest of the presentation system.

---

## When to Use

| Source Visual | Use Pattern | Never Use |
|-------------|-------------|-----------|
| Circular process / flywheel | `cycle-diagram` | `card-grid`, `bullet-list` |
| Linear input → process → output | `pipeline-diagram` | `compare-row`, `process-flow` |
| Feedback loop / reinforcement cycle | `feedback-diagram` | `process-flow` with text-only return |
| Org chart / decision tree | `hierarchy-diagram` | Nested `bullet-list` |
| Hub-and-spoke architecture | `hub-diagram` | `card-grid` centered arbitrarily |

**Detection rule:** If the source image shows nodes connected by lines/ arrows forming a specific spatial topology (circle, tree, star, loop), it is a diagram. Diagrams convey meaning through **spatial relationships** — altering the layout destroys the meaning.

---

## 1. Cycle / Flywheel Diagram

For circular processes with 4-8 nodes. Nodes arranged on a circle with directional arrows.

### HTML Structure

```html
<div class="cycle-diagram">
    <svg class="cycle-svg" viewBox="0 0 720 420">
        <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="var(--accent)"/>
            </marker>
        </defs>
        <!-- Track -->
        <circle cx="360" cy="210" r="155" fill="none" stroke="rgba(128,128,128,0.2)"
                stroke-width="2" stroke-dasharray="6 4"/>
        <!-- Animated arrow path -->
        <path d="M 360 60 A 152 152 0 1 1 359 60" fill="none" stroke="var(--accent)"
              stroke-width="2" marker-end="url(#arrowhead)"
              stroke-dasharray="1000" stroke-dashoffset="1000">
            <animate attributeName="stroke-dashoffset" from="1000" to="0"
                     dur="2s" fill="freeze" begin="0.3s"/>
        </path>
        <!-- Moving arrowhead following the path -->
        <polygon points="0,-6 10,0 0,6" fill="var(--accent)">
            <animateMotion path="M 360 60 A 152 152 0 1 1 359 60"
                           dur="2s" fill="freeze" begin="0.3s" rotate="auto"/>
        </polygon>
    </svg>
    <!-- Center -->
    <div class="cycle-center">
        <div class="cycle-center-title">Center Label</div>
        <div class="cycle-center-sub">Subtitle</div>
    </div>
    <!-- Nodes: position with style="left:X%;top:Y%" -->
    <div class="cycle-node" style="left:50%;top:11%">
        <div class="cycle-node-num">1</div>
        <div class="cycle-node-text">Label</div>
    </div>
    <!-- ... more nodes ... -->
</div>
```

### Node Positioning Guide

For `viewBox="0 0 720 420"` and radius ~155px (center 360,210):

| Nodes | Key Positions (left%, top%) |
|-------|----------------------------|
| 4 nodes | 50%/11%, 83%/32%, 50%/87%, 17%/32% |
| 5 nodes | 50%/11%, 79%/27%, 71%/68%, 29%/68%, 21%/27% |
| 6 nodes | 50%/11%, 76%/24%, 76%/64%, 50%/87%, 24%/64%, 24%/24% |
| 7 nodes | 50%/11%, 67%/27%, 71%/58%, 59%/83%, 41%/83%, 29%/58%, 33%/27% |

**Responsive:** On narrow viewports, switch to `flex-wrap` horizontal layout or reduce to 4 core nodes.

---

## 2. Pipeline / Flow Diagram

For input → process → output flows. Emphasizes directionality with connecting lines.

### HTML Structure

```html
<div class="pipeline-diagram">
    <div class="pipeline-col">
        <div class="pipeline-col-title">Input</div>
        <ul class="pipeline-list">
            <li>Item 1</li>
            <li>Item 2</li>
        </ul>
    </div>
    <div class="pipeline-connector-h"></div>
    <div class="pipeline-col-center">
        <div class="pipeline-hub">
            <div class="pipeline-hub-title">Process</div>
            <div class="pipeline-hub-sub">Detail</div>
        </div>
    </div>
    <div class="pipeline-connector-h"></div>
    <div class="pipeline-col">
        <div class="pipeline-col-title">Output</div>
        <ul class="pipeline-list">
            <li>Result 1</li>
            <li>Result 2</li>
        </ul>
    </div>
</div>
```

### Variants

**Two-stage** (input → output): Omit center hub, keep connector.
**Multi-stage** (A → B → C → D): Use multiple `pipeline-col` with `pipeline-connector-h` between each.
**With side branches**: Nest additional columns above/below using absolute positioning.

---

## 3. Feedback Loop Diagram

For systems with forward flow and feedback return path.

### HTML Structure

```html
<div class="feedback-diagram">
    <!-- Forward flow -->
    <div class="feedback-flow">
        <div class="feedback-node">
            <div class="feedback-node-title">Step 1</div>
            <div class="feedback-node-desc">Description</div>
        </div>
        <span class="feedback-arrow">→</span>
        <div class="feedback-node">
            <div class="feedback-node-title">Step 2</div>
            <div class="feedback-node-desc">Description</div>
        </div>
        <!-- ... more nodes ... -->
    </div>
    <!-- Return path -->
    <div class="feedback-return-path">
        <div class="feedback-return-label">↻ Feedback Label</div>
        <div class="feedback-return-content">
            <!-- Metrics, consequences, or loop-back elements -->
        </div>
    </div>
</div>
```

### Visual Variants

**Curved return** (SVG): Use an SVG `<path>` with `stroke-dasharray="6 4"` and `marker-end` for a curved arrow beneath the flow.
**Dashed container** (CSS): Use a `border: 2px dashed var(--accent)` container below the flow (simpler, no SVG needed).

---

## 4. Hierarchy / Tree Diagram

For org charts, decision trees, or nested categorization.

### HTML Structure

```html
<div class="tree-diagram">
    <div class="tree-root">Root</div>
    <div class="tree-children">
        <div class="tree-branch">
            <div class="tree-connector-v"></div>
            <div class="tree-node">Child A</div>
            <div class="tree-leaves">
                <div class="tree-leaf">Leaf A1</div>
                <div class="tree-leaf">Leaf A2</div>
            </div>
        </div>
        <div class="tree-branch">
            <div class="tree-connector-v"></div>
            <div class="tree-node">Child B</div>
        </div>
    </div>
</div>
```

### CSS Connectors

Use pseudo-elements for lines:
- `.tree-connector-v` — vertical line from parent (`border-left`)
- `.tree-children::before` — horizontal line connecting siblings (`border-top`)

**Constraint:** Max 2 levels deep per slide. Deeper hierarchies should span multiple slides.

---

## 5. Hub-and-Spoke Diagram

For architecture diagrams with a central element and satellite components.

### HTML Structure

```html
<div class="hub-diagram">
    <div class="hub-center">
        <div class="hub-center-inner">Core System</div>
    </div>
    <div class="hub-spoke" style="--angle: 0deg">
        <div class="hub-line"></div>
        <div class="hub-node">Module A</div>
    </div>
    <div class="hub-spoke" style="--angle: 60deg">
        <div class="hub-line"></div>
        <div class="hub-node">Module B</div>
    </div>
    <!-- ... more spokes ... -->
</div>
```

### CSS Technique

```css
.hub-spoke {
    position: absolute; top: 50%; left: 50%;
    transform: rotate(var(--angle)) translateX(var(--spoke-length)) rotate(calc(-1 * var(--angle)));
    transform-origin: 0 0;
}
.hub-line {
    position: absolute; right: 100%; top: 50%;
    width: var(--spoke-length); height: 2px; background: var(--accent);
    transform: translateY(-50%);
}
```

**Constraint:** 4-6 spokes max. More spokes = label collision.

---

## CSS Reference (Add to Presentation `<style>`)

```css
/* ===========================================
   DIAGRAM LAYOUTS
   =========================================== */

/* --- Cycle / Flywheel --- */
.cycle-diagram {
    position: relative; width: min(90vw, 720px); height: min(52vh, 420px);
    margin: 0 auto; flex-shrink: 0;
}
.cycle-svg {
    position: absolute; inset: 0; width: 100%; height: 100%;
    pointer-events: none; overflow: visible;
}
.cycle-track { fill: none; stroke: rgba(128,128,128,0.2); stroke-width: 2; stroke-dasharray: 6 4; }
.cycle-track-dark { stroke: rgba(128,128,128,0.35); }
.cycle-arrow { fill: none; stroke: var(--accent); stroke-width: 2; marker-end: url(#arrowhead); }
.cycle-center {
    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
    text-align: center; z-index: 2; max-width: min(30vw, 200px);
}
.cycle-center-title { font-size: clamp(0.75rem, 1.8vw, 1.1rem); font-weight: 800; color: var(--accent); line-height: 1.2; }
.cycle-center-sub { font-size: var(--small-size); color: var(--text-secondary); margin-top: 4px; }
.cycle-node {
    position: absolute; transform: translate(-50%, -50%);
    display: flex; flex-direction: column; align-items: center; gap: 4px;
    z-index: 2; width: clamp(65px, 11vw, 100px);
}
.cycle-node-num {
    width: clamp(22px, 2.8vw, 30px); height: clamp(22px, 2.8vw, 30px);
    border-radius: 50%; background: var(--accent); color: #fff;
    display: flex; align-items: center; justify-content: center;
    font-size: var(--small-size); font-weight: 700; flex-shrink: 0;
}
.cycle-node-text { font-size: var(--small-size); font-weight: 500; text-align: center; line-height: 1.3; }

/* --- Pipeline / Flow --- */
.pipeline-diagram {
    display: flex; align-items: center; gap: 0;
    width: 100%; max-width: min(92vw, 950px); margin: 0 auto;
}
.pipeline-col {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; text-align: center; gap: var(--element-gap);
    padding: clamp(0.4rem, 1vw, 0.8rem);
}
.pipeline-col-center { flex: 1.2; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.pipeline-hub {
    width: min(28vh, 200px); height: min(28vh, 200px); border-radius: 50%;
    border: 3px solid var(--accent); display: flex; flex-direction: column;
    align-items: center; justify-content: center; text-align: center;
    padding: clamp(0.5rem, 2vw, 1.5rem); background: rgba(128,128,128,0.03);
}
.pipeline-connector-h {
    width: clamp(20px, 4vw, 50px); height: 3px; background: var(--accent);
    position: relative; flex-shrink: 0;
}
.pipeline-connector-h::after {
    content: ''; position: absolute; right: -6px; top: -4px;
    width: 0; height: 0; border-top: 5px solid transparent;
    border-bottom: 5px solid transparent; border-left: 8px solid var(--accent);
}
.pipeline-list { list-style: none; display: flex; flex-direction: column; gap: clamp(0.2rem, 0.6vh, 0.4rem); text-align: center; }
.pipeline-list li { font-size: var(--body-size); line-height: 1.4; }

/* --- Feedback Loop --- */
.feedback-diagram { position: relative; width: 100%; max-width: min(92vw, 900px); margin: 0 auto; }
.feedback-flow {
    display: flex; align-items: center; justify-content: center;
    gap: clamp(0.4rem, 1.2vw, 1rem); flex-wrap: wrap;
}
.feedback-node {
    background: rgba(128,128,128,0.05); border: 1px solid rgba(128,128,128,0.15);
    border-radius: clamp(6px, 1vw, 10px);
    padding: clamp(0.5rem, 1.2vw, 1rem) clamp(0.75rem, 1.5vw, 1.25rem);
    font-size: var(--body-size); font-weight: 500; text-align: center; line-height: 1.4;
    max-width: min(35vw, 260px);
}
.feedback-return-path {
    margin-top: var(--content-gap); position: relative;
    padding: clamp(0.75rem, 1.5vw, 1.25rem); text-align: center;
    border: 2px dashed var(--accent); border-radius: clamp(8px, 1.5vw, 14px);
    border-top-color: transparent;
}
.feedback-return-path::before {
    content: '↻ Feedback'; position: absolute; top: -0.7em; left: 50%; transform: translateX(-50%);
    font-size: var(--small-size); font-weight: 700; color: var(--accent);
    background: var(--bg-primary); padding: 0 10px; white-space: nowrap;
}

/* --- Hub & Spoke --- */
.hub-diagram { position: relative; width: min(80vw, 600px); height: min(50vh, 400px); margin: 0 auto; }
.hub-center {
    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
    width: min(20vh, 140px); height: min(20vh, 140px); border-radius: 50%;
    border: 3px solid var(--accent); display: flex; align-items: center; justify-content: center;
    background: var(--bg-primary); z-index: 2;
}
.hub-spoke {
    position: absolute; top: 50%; left: 50%; transform-origin: 0 0;
    --spoke-len: min(20vw, 180px);
}
.hub-spoke .hub-line {
    position: absolute; right: 100%; top: 50%; transform: translateY(-50%);
    width: var(--spoke-len); height: 2px; background: var(--accent);
}
.hub-spoke .hub-node {
    position: absolute; left: var(--spoke-len); top: 50%; transform: translateY(-50%);
    white-space: nowrap; font-size: var(--body-size); font-weight: 500;
}

/* Responsive overrides for diagrams */
@media (max-width: 700px) {
    .cycle-diagram { height: min(65vh, 380px); }
    .pipeline-diagram { flex-direction: column; gap: var(--content-gap); }
    .pipeline-connector-h { width: 3px; height: clamp(20px, 4vw, 40px); }
    .pipeline-connector-h::after {
        right: -4px; top: auto; bottom: -6px;
        border-left: 5px solid transparent; border-right: 5px solid transparent;
        border-top: 8px solid var(--accent); border-bottom: none;
    }
    .feedback-flow { flex-direction: column; }
    .hub-diagram { height: min(70vh, 500px); }
    .hub-spoke { --spoke-len: min(16vw, 120px); }
}
@media (max-height: 650px) {
    .cycle-diagram { height: min(58vh, 320px); }
    .cycle-node { width: clamp(55px, 10vw, 85px); }
    .cycle-node-text { font-size: clamp(0.55rem, 0.9vw, 0.75rem); }
}
```

---

## SVG Tips

### Arrow Markers

Always define arrow markers in `<defs>` once per presentation:

```html
<defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="var(--accent)"/>
    </marker>
</defs>
```

Use `marker-end="url(#arrowhead)"` on `<path>` elements.

### Animated Stroke (Draw-on Effect)

```html
<path d="..." stroke-dasharray="1000" stroke-dashoffset="1000">
    <animate attributeName="stroke-dashoffset" from="1000" to="0" dur="2s" fill="freeze" begin="0.3s"/>
</path>
```

Set `stroke-dasharray` to a value larger than the path length. Works for any path.

### ViewBox Strategy

Use `viewBox="0 0 720 420"` for diagrams inside slides. This aspect ratio (12:7) maps well to typical slide proportions. Set `preserveAspectRatio="xMidYMid meet"` (default) to ensure the diagram centers and scales without distortion.

---

## Content Density for Diagrams

Diagram slides have different density limits than text slides:

| Diagram Type | Max Nodes | Max Connections |
|-------------|-----------|-----------------|
| Cycle | 7 | 7 (one loop) |
| Pipeline | 5 stages | 4 connectors |
| Feedback | 4 forward + 3 return metrics | 1 return path |
| Hierarchy | 1 root + 4 children + 8 leaves | — |
| Hub | 1 center + 6 spokes | 6 lines |

**Exceeds limits?** Split into 2 diagram slides or simplify the topology.
