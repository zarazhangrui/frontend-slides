---
name: frontend-slides
description: >
  Create beautiful, animation-rich HTML presentations and slide decks. Use when
  the user asks to build a presentation, pitch deck, or slides for a talk, or
  wants to convert a PowerPoint/PPTX file to a web format. Helps non-designers
  discover their aesthetic through visual previews rather than abstract choices.
---

# Frontend Slides

Use this skill whenever the user asks for a slide deck or presentation, or wants to convert a PowerPoint/PPTX file into a web-based HTML presentation.

Create zero-dependency, animation-rich HTML presentations that run entirely in
the browser. Single self-contained `.html` file — no npm, no build tools,
no frameworks.

## Core Principles

- **Zero Dependencies** — Inline CSS/JS only. No external dependencies.
- **Show, Don't Tell** — Generate visual style previews; let the user pick. Never ask them to describe aesthetics in the abstract.
- **Distinctive Design** — Avoid generic "AI slop." No purple gradients on white. Every deck should feel custom-crafted.

---

## WORKFLOW

### A. New Presentation from Scratch

**Step 1 — Gather content**

Ask:
1. What is the presentation about? Who is the audience?
2. Approximate slide count and main topics/sections?
3. Any specific content, data, or images to include?
4. What feeling should it evoke? (impressed, excited, calm, urgent…)

**Step 2 — Style discovery (MANDATORY — never skip)**

Tell the user: "I'll generate 3 mini style previews using your actual content so you can choose visually."

Load `references/STYLE_PRESETS.md` for the style library. Generate 3 distinct single-slide HTML previews (~60 lines each), each showing:
- A title and subtitle drawn from the user's actual content
- The full visual aesthetic: colors, fonts, layout, animation
- A style name and one-line description

Save as `preview_1.html`, `preview_2.html`, `preview_3.html`. Ask: "Which style do you prefer? Or describe what to change."

**Step 3 — Generate full presentation**

Build `presentation.html` in the chosen style. Follow all technical requirements below.

---

### B. Convert PowerPoint to Web

**Step 1 — Extract content**

```bash
pip install python-pptx pillow
```

Write and run a Python script to extract all slide text (titles, body, notes) and images (save to `ppt_images/`). Show the user the extracted content for confirmation.

**Step 2 — Style discovery**

Same as Step 2 above. Use real slide titles in the previews.

**Step 3 — Generate HTML with assets**

Embed images as base64 to keep the file self-contained:

```python
import base64
with open("ppt_images/slide_1_img_0.png", "rb") as f:
    b64 = base64.b64encode(f.read()).decode()
# Use as: <img src="data:image/png;base64,{b64}">
```

---

## TECHNICAL REQUIREMENTS

### Viewport Fitting (MANDATORY — no exceptions)

Every slide fits exactly one viewport. No scrolling within slides. Ever.

```css
html, body { height: 100%; overflow-x: hidden; }
html { scroll-snap-type: y mandatory; scroll-behavior: smooth; }

.slide {
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  position: relative;
}

.slide-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-height: 100%;
  overflow: hidden;
  padding: var(--slide-padding);
}
```

Content limits per slide: title ≤ 8 words, bullets ≤ 5 at ≤ 12 words each, text blocks ≤ 60 words. Too much content? Split into multiple slides.

### Responsive Typography (MANDATORY)

```css
:root {
  --title-size: clamp(1.5rem, 5vw, 4rem);
  --h2-size: clamp(1.25rem, 3.5vw, 2.5rem);
  --body-size: clamp(0.75rem, 1.5vw, 1.125rem);
  --small-size: clamp(0.65rem, 1vw, 0.875rem);
  --slide-padding: clamp(1rem, 4vw, 4rem);
  --content-gap: clamp(0.5rem, 2vw, 2rem);
}

.card, .container { max-width: min(90vw, 1000px); max-height: min(80vh, 700px); }
img { max-width: 100%; max-height: min(50vh, 400px); object-fit: contain; }

@media (max-height: 700px) {
  :root { --slide-padding: clamp(0.75rem, 3vw, 2rem); --title-size: clamp(1.25rem, 4.5vw, 2.5rem); }
}
@media (max-height: 600px) {
  .nav-dots, .keyboard-hint, .decorative { display: none; }
}
```

### Navigation (MANDATORY)

```javascript
let current = 0;
const slides = document.querySelectorAll('.slide');

function goTo(n) {
  current = Math.max(0, Math.min(n, slides.length - 1));
  slides[current].scrollIntoView({ behavior: 'smooth' });
}

document.addEventListener('keydown', e => {
  if (['ArrowDown', 'ArrowRight', ' '].includes(e.key)) { e.preventDefault(); goTo(current + 1); }
  if (['ArrowUp', 'ArrowLeft'].includes(e.key)) { e.preventDefault(); goTo(current - 1); }
});

let touchStartY = 0;
document.addEventListener('touchstart', e => touchStartY = e.touches[0].clientY);
document.addEventListener('touchend', e => {
  const diff = touchStartY - e.changedTouches[0].clientY;
  if (Math.abs(diff) > 50) goTo(current + (diff > 0 ? 1 : -1));
});
```

Include a progress bar or slide counter and navigation dots.

### Scroll-Triggered Animations

```javascript
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.3 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
```

```css
.reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.7s ease, transform 0.7s ease; }
.reveal.visible { opacity: 1; transform: translateY(0); }
```

---

## OUTPUT

- Single self-contained `.html` file (all CSS and JS inline)
- Google Fonts via CDN only, or system fonts
- Accessible: proper heading hierarchy, `aria-label` on nav elements
- Well-commented code
- Open in browser after creation:
  ```bash
  open presentation.html       # macOS
  xdg-open presentation.html  # Linux
  start presentation.html     # Windows
  ```

---

## STYLE REFERENCE

Load `references/STYLE_PRESETS.md` for 10 curated visual styles with complete CSS.
Never default to generic gradients — every presentation must feel intentional.
