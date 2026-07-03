# HTML Presentation Template

Reference architecture for generating slide presentations. Every presentation follows a fixed 16:9 stage model: slides are authored at 1920×1080 and the whole stage scales to fit the browser window.

## Base HTML Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Presentation Title</title>

    <!-- Fonts: use Fontshare or Google Fonts — never system fonts -->
    <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=...">

    <style>
        /* ===========================================
           CSS CUSTOM PROPERTIES (THEME)
           Change these to change the whole look
           =========================================== */
        :root {
            /* Colors — from chosen style preset */
            --bg-primary: #0a0f1c;
            --bg-secondary: #111827;
            --text-primary: #ffffff;
            --text-secondary: #9ca3af;
            --accent: #00ffcc;
            --accent-glow: rgba(0, 255, 204, 0.3);

            /* Typography — authored at 1920×1080 stage size */
            --font-display: 'Clash Display', sans-serif;
            --font-body: 'Satoshi', sans-serif;
            --title-size: 112px;
            --subtitle-size: 34px;
            --body-size: 28px;

            /* Spacing — authored at 1920×1080 stage size */
            --slide-padding: 72px;
            --content-gap: 32px;

            /* Animation */
            --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
            --duration-normal: 0.6s;
        }

        /* ===========================================
           BASE STYLES
           =========================================== */
        * { margin: 0; padding: 0; box-sizing: border-box; }

        /* --- PASTE viewport-base.css CONTENTS HERE --- */

        /* ===========================================
           ANIMATIONS
           Trigger via .visible class on the active slide
           =========================================== */
        .reveal {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity var(--duration-normal) var(--ease-out-expo),
                        transform var(--duration-normal) var(--ease-out-expo);
        }

        .slide.visible .reveal {
            opacity: 1;
            transform: translateY(0);
        }

        /* Stagger children for sequential reveal */
        .reveal:nth-child(1) { transition-delay: 0.1s; }
        .reveal:nth-child(2) { transition-delay: 0.2s; }
        .reveal:nth-child(3) { transition-delay: 0.3s; }
        .reveal:nth-child(4) { transition-delay: 0.4s; }

        /* ... preset-specific styles ... */
    </style>
</head>
<body>
    <div class="deck-viewport">
        <main class="deck-stage" id="deckStage">
            <section class="slide title-slide active" data-slide-id="slide-001" data-slide-index="0" data-title="Presentation Title" data-original-skipped="false">
                <h1 class="reveal">Presentation Title</h1>
                <p class="reveal">Subtitle or author</p>
            </section>

            <section class="slide" data-slide-id="slide-002" data-slide-index="1" data-title="Slide Title" data-original-skipped="false">
                <div class="slide-content">
                    <h2 class="reveal">Slide Title</h2>
                    <p class="reveal">Content...</p>
                </div>
            </section>

            <!-- More slides... -->
        </main>
    </div>

    <nav class="deck-controls" aria-label="Presentation controls">
        <button class="control-button" id="prevButton" type="button" aria-label="Previous slide">‹</button>
        <span class="slide-count" id="slideCount">
            <button class="slide-count-current" id="slideJumpButton" type="button" title="Jump to slide">1</button>
            <span class="slide-count-separator">/</span>
            <span id="slideTotal">2</span>
        </span>
        <button class="control-button" id="nextButton" type="button" aria-label="Next slide">›</button>
        <button class="control-button" id="pagesButton" type="button" title="Edit slides">E</button>
    </nav>

    <div class="slide-menu-overlay" id="slideMenuOverlay" role="dialog" aria-modal="true" aria-label="Slide menu" hidden>
        <section class="slide-menu-panel">
            <header class="slide-menu-header">
                <div class="slide-menu-actions" aria-label="Slide menu actions">
                    <button class="control-button" id="selectAllPages" type="button">All</button>
                    <button class="control-button" id="showSelectedPages" type="button">Selection</button>
                    <button class="control-button" id="savePageSelection" type="button">Save</button>
                    <button class="control-button" id="addTextSlide" type="button">+ Slide</button>
                </div>
                <button class="control-button" id="slideMenuClose" type="button" aria-label="Close slide menu">×</button>
            </header>
            <section class="text-slide-editor" id="textSlideEditor" hidden aria-label="Text slide editor">
                <!-- Text, color, X, Y, and size controls for user-added text slides -->
            </section>
            <p class="slide-menu-summary" id="slideMenuSummary"></p>
            <div class="slide-menu-list" id="slideMenuList"></div>
        </section>
    </div>

    <script>
        /* ===========================================
           SLIDE PRESENTATION CONTROLLER
           =========================================== */
        class SlidePresentation {
            constructor() {
                this.slides = document.querySelectorAll('.slide');
                this.currentSlide = 0;
                this.stage = document.getElementById('deckStage');
                this.storagePrefix = `frontend-slides:${document.title || location.pathname}`;
                this.setupStageScale();
                this.setupKeyboardNav();
                this.setupTouchNav();
                this.setupPresenterRuntime();
                this.showSlide(0);
            }

            setupStageScale() {
                const scale = () => {
                    const factor = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
                    const x = (window.innerWidth - 1920 * factor) / 2;
                    const y = (window.innerHeight - 1080 * factor) / 2;
                    this.stage.style.transform = `translate(${x}px, ${y}px) scale(${factor})`;
                };
                scale();
                window.addEventListener('resize', scale);
            }

            setupKeyboardNav() {
                // Arrow keys, Space, Page Up/Down, Home/End, E menu, F fullscreen, M mute when media exists.
                // Do not trigger shortcuts while focus is inside an input, textarea, select, or contenteditable element.
            }

            setupTouchNav() {
                // Touch/swipe support for mobile
            }

            showSlide(index) {
                this.currentSlide = Math.max(0, Math.min(index, this.slides.length - 1));
                this.slides.forEach((slide, i) => {
                    slide.classList.toggle('active', i === this.currentSlide);
                    slide.classList.toggle('visible', i === this.currentSlide);
                });
            }

            setupPresenterRuntime() {
                // Implement presenter-runtime.md here:
                // bottom controls, editable slide-count jump, E slide menu, All/Selection/Save,
                // + Slide user text slides, title edits, deletion, localStorage persistence,
                // fullscreen chrome hiding, and optional media mute/playback handling.
            }
        }

        new SlidePresentation();
    </script>
</body>
</html>
```

## Required JavaScript Features

Every presentation must include:

1. **SlidePresentation Class** — Main controller with:
   - Keyboard navigation (arrows, space, page up/down, home/end)
   - `E` slide menu, `F` fullscreen, `?` help, and `M` mute when media exists
   - Touch/swipe support
   - Mouse wheel navigation
   - Minimal bottom controls and editable/clickable page count, kept outside the slide stage

2. **Stage Scaling** — For fixed 16:9 presentation behavior:
   - Keep all slides at 1920×1080 inside `.deck-stage`
   - Scale the whole stage with one transform
   - Letterbox/pillarbox as needed; never reflow slide content per device

3. **Local Presenter Runtime** (mandatory):
   - Read and implement `presenter-runtime.md` in the delivered HTML
   - Add stable slide metadata (`data-slide-id`, `data-title`, `data-original-skipped`)
   - Add bottom controls: previous, slide count jump, next, and `E`
   - Add the `E` slide menu with All, Selection, Save, `+ Slide`, row preview, visibility checkboxes, title editing, delete, media tags, and user text slide editor
   - Persist menu changes to `localStorage` only when Save is clicked
   - Hide controls, progress chrome, and cursor over the slide area in fullscreen
   - Do not include private domains, project-specific deploy URLs, or any unauthenticated browser-to-server save API

4. **Optional Enhancements** (match to chosen style):
   - Custom cursor with trail
   - Particle system background (canvas)
   - Parallax effects
   - 3D tilt on hover
   - Magnetic buttons
   - Counter animations

5. **Menu-Based Editing** (included by default after draft generation):
   - Slide title editing inside the `E` menu
   - Visibility selection and deletion inside the `E` menu
   - User-added text slides with editable content, color, X/Y position, and size
   - Save button writes local browser state to `localStorage`
   - See "Presenter Runtime Implementation" below

## Presenter Runtime Implementation

The presenter runtime is a lightweight post-draft affordance. Do not ask the user whether they want it during the pre-generation Q&A. Include it by default unless the user explicitly asks for a locked/export-only presentation or no editing controls.

The `E` key belongs to the slide menu, not a free-floating edit toggle. Keep all editing controls in the menu so the slide stage remains clean and presentation-ready.

**Required deck chrome:**

HTML:
```html
<nav class="deck-controls" aria-label="Presentation controls">
  <button id="prevButton" type="button">‹</button>
  <span class="slide-count">
    <button id="slideJumpButton" type="button">1</button>
    <span>/</span>
    <span id="slideTotal">12</span>
  </span>
  <button id="nextButton" type="button">›</button>
  <button id="pagesButton" type="button">E</button>
</nav>
```

**Required menu shell:**

HTML:
```html
<div class="slide-menu-overlay" id="slideMenuOverlay" role="dialog" aria-modal="true" hidden>
  <section class="slide-menu-panel">
    <header class="slide-menu-header">
      <button id="selectAllPages" type="button">All</button>
      <button id="showSelectedPages" type="button">Selection</button>
      <button id="savePageSelection" type="button">Save</button>
      <button id="addTextSlide" type="button">+ Slide</button>
      <button id="slideMenuClose" type="button">×</button>
    </header>
    <section class="text-slide-editor" id="textSlideEditor" hidden></section>
    <p class="slide-menu-summary" id="slideMenuSummary"></p>
    <div class="slide-menu-list" id="slideMenuList"></div>
  </section>
</div>
```

Localize visible button labels to the deck language. For Dutch decks, use `Alles aan`, `Selectie`, `Opslaan`, and `+ Slide`.

CSS:
```css
body.is-fullscreen .deck-controls,
body.is-fullscreen .progress-rail,
body.is-fullscreen .media-hud {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
}

body.is-fullscreen .deck-viewport,
body.is-fullscreen .deck-stage,
body.is-fullscreen .slide {
    cursor: none;
}
```

JS:
```javascript
document.addEventListener('keydown', (e) => {
    const target = e.target;
    const isFormField = target.closest?.('input, textarea, select, [contenteditable="true"]');
    if (isFormField) return;
    if (e.key === 'e' || e.key === 'E') {
        presentation.toggleSlideMenu();
    }
});
```

See `presenter-runtime.md` for the complete behavior contract. Treat that file as mandatory for generated decks.

## Image Pipeline (Skip If No Images)

If user chose "No images" in Phase 1, skip this entirely. If images were provided, process them before generating HTML.

**Dependency:** `pip install Pillow`

### Image Processing

```python
from PIL import Image, ImageDraw

# Circular crop (for logos on modern/clean styles)
def crop_circle(input_path, output_path):
    img = Image.open(input_path).convert('RGBA')
    w, h = img.size
    size = min(w, h)
    left, top = (w - size) // 2, (h - size) // 2
    img = img.crop((left, top, left + size, top + size))
    mask = Image.new('L', (size, size), 0)
    ImageDraw.Draw(mask).ellipse([0, 0, size, size], fill=255)
    img.putalpha(mask)
    img.save(output_path, 'PNG')

# Resize (for oversized images that inflate HTML)
def resize_max(input_path, output_path, max_dim=1200):
    img = Image.open(input_path)
    img.thumbnail((max_dim, max_dim), Image.LANCZOS)
    img.save(output_path, quality=85)
```

| Situation | Operation |
|-----------|-----------|
| Square logo on rounded aesthetic | `crop_circle()` |
| Image > 1MB | `resize_max(max_dim=1200)` |
| Wrong aspect ratio | Manual crop with `img.crop()` |

Save processed images with `_processed` suffix. Never overwrite originals.

### Image Placement

**Use direct file paths** (not base64) — presentations are viewed locally:

```html
<img src="assets/logo_round.png" alt="Logo" class="slide-image logo">
<img src="assets/screenshot.png" alt="Screenshot" class="slide-image screenshot">
```

```css
.slide-image {
    max-width: 100%;
    max-height: min(50vh, 400px);
    object-fit: contain;
    border-radius: 8px;
}
.slide-image.screenshot {
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
.slide-image.logo {
    max-height: min(30vh, 200px);
}
```

**Adapt border/shadow colors to match the chosen style's accent.** Never repeat the same image on multiple slides (except logos on title + closing).

**Placement patterns:** Logo centered on title slide. Screenshots in two-column layouts with text. Full-bleed images as slide backgrounds with text overlay (use sparingly).

---

## Code Quality

**Comments:** Every section needs clear comments explaining what it does and how to modify it.

**Accessibility:**
- Semantic HTML (`<section>`, `<nav>`, `<main>`)
- Keyboard navigation works fully
- ARIA labels where needed
- `prefers-reduced-motion` support (included in viewport-base.css)

## File Structure

Single presentations:
```
presentation.html    # Self-contained, all CSS/JS inline
assets/              # Images only, if any
```

Multiple presentations in one project:
```
[name].html
[name]-assets/
```
