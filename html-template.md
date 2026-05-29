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
        /* --- PASTE deck-layout.css CONTENTS HERE --- */

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
    <div class="edit-hotzone"></div>
    <div class="edit-toolbar" id="editToolbar">
        <button type="button" class="edit-btn" id="editSave" title="保存修改 (Ctrl+S)" aria-label="保存修改">
            <svg class="edit-btn-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
        </button>
        <button type="button" class="edit-btn" id="editDownload" title="下载修改后的 HTML" aria-label="下载 HTML">
            <svg class="edit-btn-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12 3v12m0 0 4-4m-4 4-4-4"/><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M4 21h16"/></svg>
        </button>
    </div>
    <input type="file" id="imageUploadInput" accept="image/*" hidden>
    <div class="deck-counter" id="deckCounter" aria-live="polite"></div>
    <div class="progress-bar" id="progressBar"></div>

    <div class="deck-viewport">
        <main class="deck-stage" id="deckStage">
            <section class="slide title-slide active">
                <div class="title-left">
                    <div class="accent-bar reveal"></div>
                    <h1 class="reveal" data-editable>Presentation Title</h1>
                    <p class="subtitle reveal" data-editable>Subtitle or author</p>
                </div>
            </section>

            <section class="slide concept-slide">
                <div class="slide-content">
                    <div class="slide-header reveal">
                        <h2 data-editable>Section Title</h2>
                    </div>
                    <div class="concept-layout">
                        <div class="concept-left reveal">
                            <div class="case-box">
                                <h4 data-editable>Key point</h4>
                                <ul><li data-editable>Detail one</li></ul>
                            </div>
                            <div class="question-box">
                                <h4 data-editable>Prompt</h4>
                                <p data-editable>Discussion question</p>
                            </div>
                        </div>
                        <div class="concept-visual reveal">
                            <div class="concept-visual-panel">
                                <div class="concept-visual-icon" data-editable>◎</div>
                                <p class="concept-visual-caption" data-editable>Visual caption</p>
                            </div>
                        </div>
                    </div>
                    <span class="page-number">02</span>
                </div>
            </section>

            <!-- More slides... -->
        </main>
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
                this.counter = document.getElementById('deckCounter');
                this.progressBar = document.getElementById('progressBar');
                if (!this.stage) return;
                this.setupStageScale();
                this.setupKeyboardNav();
                this.setupTouchNav();
                this.setupWheelNav();
                this.setupClickNav();
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
                document.addEventListener('keydown', (e) => {
                    if (e.target.isContentEditable) return;
                    if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ' || e.key === 'PageDown') {
                        e.preventDefault();
                        this.nextSlide();
                    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') {
                        e.preventDefault();
                        this.prevSlide();
                    } else if (e.key === 'Home') {
                        e.preventDefault();
                        this.showSlide(0);
                    } else if (e.key === 'End') {
                        e.preventDefault();
                        this.showSlide(this.slides.length - 1);
                    }
                });
            }

            setupTouchNav() {
                let startX = 0, startY = 0;
                document.addEventListener('touchstart', (e) => {
                    startX = e.touches[0].clientX;
                    startY = e.touches[0].clientY;
                }, { passive: true });
                document.addEventListener('touchend', (e) => {
                    const dx = e.changedTouches[0].clientX - startX;
                    const dy = e.changedTouches[0].clientY - startY;
                    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
                        if (dx < 0) this.nextSlide();
                        else this.prevSlide();
                    }
                }, { passive: true });
            }

            setupWheelNav() {
                let wheelTimer = null;
                document.addEventListener('wheel', (e) => {
                    if (e.target.closest('.edit-toolbar, .edit-hotzone')) return;
                    if (wheelTimer) return;
                    wheelTimer = setTimeout(() => { wheelTimer = null; }, 400);
                    if (e.deltaY > 0) this.nextSlide();
                    else if (e.deltaY < 0) this.prevSlide();
                }, { passive: true });
            }

            setupClickNav() {
                document.addEventListener('click', (e) => {
                    if (e.target.closest('.edit-toolbar, .edit-hotzone, [data-editable], .editable-image, button, a, input')) return;
                    if (e.clientX > window.innerWidth * 0.55) this.nextSlide();
                    else if (e.clientX < window.innerWidth * 0.45) this.prevSlide();
                });
            }

            showSlide(index) {
                this.currentSlide = Math.max(0, Math.min(index, this.slides.length - 1));
                this.slides.forEach((slide, i) => {
                    slide.classList.toggle('active', i === this.currentSlide);
                    slide.classList.toggle('visible', i === this.currentSlide);
                });
                if (this.counter) {
                    this.counter.textContent = (this.currentSlide + 1) + ' / ' + this.slides.length;
                }
                if (this.progressBar) {
                    this.progressBar.style.width = ((this.currentSlide + 1) / this.slides.length * 100) + '%';
                }
            }

            nextSlide() {
                if (this.currentSlide < this.slides.length - 1) this.showSlide(this.currentSlide + 1);
            }

            prevSlide() {
                if (this.currentSlide > 0) this.showSlide(this.currentSlide - 1);
            }

            refreshSlides() {
                this.slides = document.querySelectorAll('.slide');
                if (!this.slides.length) return;
                this.currentSlide = Math.max(0, Math.min(this.currentSlide, this.slides.length - 1));
                this.showSlide(this.currentSlide);
            }
        }

        const deckEditor = new DeckEditor();
        deckEditor.restoreFromStorage();
        const presentation = new SlidePresentation();
        deckEditor.attachPresentation(presentation);
    </script>
</body>
</html>
```

## Required JavaScript Features

Every presentation must include:

1. **SlidePresentation Class** — Main controller with:
   - Keyboard navigation (arrows, space, page up/down)
   - Touch/swipe support
   - Mouse wheel navigation
   - Optional progress indicator or page count, kept outside the slide stage

2. **Stage Scaling** — For fixed 16:9 presentation behavior:
   - Keep all slides at 1920×1080 inside `.deck-stage`
   - Scale the whole stage with one transform
   - Letterbox/pillarbox as needed; never reflow slide content per device

3. **Optional Enhancements** (match to chosen style):
   - Custom cursor with trail
   - Particle system background (canvas)
   - Parallax effects
   - 3D tilt on hover
   - Magnetic buttons
   - Counter animations

## Mandatory Layout System

**Every generated deck must look like a designed slide, not a pasted document.** Include the FULL contents of [deck-layout.css](deck-layout.css) in the `<style>` block (after `viewport-base.css`).

**HTML structure rules (NON-NEGOTIABLE):**

| Rule | Requirement |
|------|-------------|
| Content slides | Every non-title slide uses `<div class="slide-content">` filling the 1920×1080 slide |
| Section title | Use `.slide-header` + `h2` inside `.slide-content` |
| Two-column teaching slides | Use `.concept-layout` → `.concept-left` + `.concept-visual` (never bare stacked `h4`/`p` in a corner) |
| Visual panel | Put graphics/emoji/quotes in `.concept-visual` → `.concept-visual-panel` (centered) |
| Page index | End each `.slide-content` with `<span class="page-number">NN</span>` |
| Chrome | Outside stage: `#deckCounter`, `#progressBar`, edit toolbar |

**Forbidden patterns (cause “messy” decks):**

- Raw text blocks directly under `.slide` with no `.slide-content`
- Inline `style="margin-top:12px"` instead of layout classes
- Emoji or visuals floating without `.concept-visual-panel`
- Skipping `deck-layout.css` or `SlidePresentation.setupStageScale()`
- Stub navigation (`// Arrow keys` comments) — copy the full `SlidePresentation` class from this file

**Swiss Modern fast preset:** After pasting `deck-layout.css`, add theme overrides only (colors, fonts, title-slide art). Do not delete layout grids.

4. **Inline Editing (MANDATORY — NON-NEGOTIABLE)** — Every presentation MUST include the complete `DeckEditor` implementation from the section below. No exceptions unless the user explicitly requests a locked/export-only file with zero editing UI.
   - **Enter edit mode:** Double-click any slide text (`[data-editable]`)
   - **Replace image:** Double-click any slide image (`.editable-image`) → file picker → auto-save
   - **Save:** Top-left **保存** button (hover hotzone or edit mode), `E` to exit edit mode, or `Ctrl+S` / `Cmd+S` — persists to localStorage only
   - **Download:** Top-left **下载** button — downloads the current HTML file (with navigation intact)

## Inline Editing Implementation

**MANDATORY.** Copy this entire block into every generated presentation. Do not omit, simplify, or skip any part. The only opt-out is an explicit user request for a locked/export-only deck.

### Markup requirements

- Wrap every user-facing text node in `[data-editable]` (on `h1`–`h6`, `p`, `li`, `span`, `blockquote`, etc.)
- Wrap every replaceable image in a fixed-size container; the `img` keeps the container's exact box via `object-fit: fill`
- Place editor chrome **outside** `.deck-stage` so it is not scaled with slides

HTML:
```html
<!-- Outside .deck-stage — fixed to viewport, not scaled -->
<div class="edit-hotzone"></div>
<div class="edit-toolbar" id="editToolbar">
    <button type="button" class="edit-btn" id="editSave" title="保存修改 (Ctrl+S)" aria-label="保存修改">
        <svg class="edit-btn-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
    </button>
    <button type="button" class="edit-btn" id="editDownload" title="下载修改后的 HTML" aria-label="下载 HTML">
        <svg class="edit-btn-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12 3v12m0 0 4-4m-4 4-4-4"/><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M4 21h16"/></svg>
    </button>
</div>
<input type="file" id="imageUploadInput" accept="image/*" hidden>
<div class="deck-counter" id="deckCounter" aria-live="polite"></div>
<div class="progress-bar" id="progressBar"></div>

<div class="deck-viewport">
    <main class="deck-stage" id="deckStage">
        <section class="slide title-slide active">
            <h1 class="reveal" data-editable>Presentation Title</h1>
            <p class="reveal" data-editable>Subtitle or author</p>
        </section>
        <section class="slide">
            <div class="img-box" style="width:480px;height:320px">
                <img src="assets/photo.png" alt="" class="editable-image slide-image">
            </div>
        </section>
    </main>
</div>
```

CSS:
```css
/* === INLINE EDITOR CHROME === */
.edit-hotzone {
    position: fixed; top: 0; left: 0;
    width: 72px; height: 120px;
    z-index: 10000;
}
.edit-toolbar {
    position: fixed; top: 12px; left: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
    z-index: 10001;
}
.edit-toolbar.show,
body.deck-editing .edit-toolbar {
    opacity: 1;
    pointer-events: auto;
}
.edit-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    padding: 0;
    border: 1px solid rgba(0,0,0,0.15);
    border-radius: 8px;
    background: #fff;
    color: #111;
    cursor: pointer;
}
.edit-btn-icon {
    width: 20px;
    height: 20px;
    display: block;
    flex-shrink: 0;
}
.edit-btn:hover { background: #f5f5f5; }
.edit-btn:active { background: #ebebeb; }
body.deck-editing .deck-stage {
    outline: 2px dashed rgba(0, 120, 255, 0.45);
    outline-offset: -2px;
}
[data-editable] { cursor: text; }
body.deck-editing [data-editable] {
    outline: 1px dashed rgba(0, 120, 255, 0.35);
    outline-offset: 2px;
}
/* Fixed box — replacement image always fills the same dimensions */
.img-box {
    overflow: hidden;
    flex-shrink: 0;
}
.editable-image {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: fill;
    cursor: pointer;
}
body.deck-editing .editable-image {
    outline: 2px dashed rgba(255, 140, 0, 0.6);
    outline-offset: 2px;
}
```

JavaScript — include **in full** after `SlidePresentation`:
```javascript
/* ===========================================
   DECK EDITOR — MANDATORY
   Double-click text → edit | Double-click image → replace
   保存 → localStorage | 下载 → export HTML file
   =========================================== */
class DeckEditor {
    constructor(storageKey) {
        this.isActive = false;
        this.presentation = null;
        this.storageKey = storageKey || 'deck-edits-' + (document.title || 'presentation');
        this.stage = document.getElementById('deckStage');
        this.toolbar = document.getElementById('editToolbar');
        this.saveBtn = document.getElementById('editSave');
        this.downloadBtn = document.getElementById('editDownload');
        this.fileInput = document.getElementById('imageUploadInput');
        this.pendingImage = null;
        this.hideTimeout = null;

        this.bindEvents();
    }

    attachPresentation(presentation) {
        this.presentation = presentation;
    }

    bindEvents() {
        const hotzone = document.querySelector('.edit-hotzone');

        this.saveBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.saveOnly();
        });
        this.downloadBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.downloadHtml();
        });

        const showToolbar = () => {
            clearTimeout(this.hideTimeout);
            this.toolbar.classList.add('show');
        };
        const scheduleHideToolbar = () => {
            this.hideTimeout = setTimeout(() => {
                if (!this.isActive) this.toolbar.classList.remove('show');
            }, 400);
        };

        hotzone.addEventListener('mouseenter', showToolbar);
        hotzone.addEventListener('mouseleave', scheduleHideToolbar);
        this.toolbar.addEventListener('mouseenter', showToolbar);
        this.toolbar.addEventListener('mouseleave', scheduleHideToolbar);

        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                if (this.isActive) this.saveOnly();
                return;
            }
            if ((e.key === 'e' || e.key === 'E') && !e.target.isContentEditable) {
                e.preventDefault();
                this.toggleEditMode();
            }
        });

        this.stage.addEventListener('dblclick', (e) => {
            const img = e.target.closest('.editable-image');
            if (img) {
                e.preventDefault();
                e.stopPropagation();
                this.pendingImage = img;
                this.fileInput.click();
                return;
            }
            const textEl = e.target.closest('[data-editable]');
            if (textEl) {
                e.preventDefault();
                e.stopPropagation();
                if (!this.isActive) this.enterEditMode();
                this.focusTextElement(textEl);
            }
        });

        this.fileInput.addEventListener('change', () => {
            const file = this.fileInput.files && this.fileInput.files[0];
            this.fileInput.value = '';
            if (!file || !this.pendingImage) return;
            const reader = new FileReader();
            reader.onload = () => {
                this.pendingImage.src = reader.result;
                this.pendingImage = null;
                if (!this.isActive) this.enterEditMode();
                this.persist();
            };
            reader.readAsDataURL(file);
        });
    }

    enterEditMode() {
        if (this.isActive) return;
        this.isActive = true;
        document.body.classList.add('deck-editing');
        this.toolbar.classList.add('show');
        this.stage.querySelectorAll('[data-editable]').forEach((el) => {
            el.contentEditable = 'true';
            el.spellcheck = false;
        });
    }

    exitEditMode() {
        this.isActive = false;
        document.body.classList.remove('deck-editing');
        this.stage.querySelectorAll('[data-editable]').forEach((el) => {
            el.contentEditable = 'false';
        });
    }

    focusTextElement(el) {
        el.focus();
        const range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }

    toggleEditMode() {
        if (this.isActive) this.saveOnly();
        else this.enterEditMode();
    }

    saveOnly() {
        this.persist();
        if (this.isActive) this.exitEditMode();
    }

    persist() {
        try {
            localStorage.setItem(this.storageKey, this.stage.innerHTML);
        } catch (_) { /* quota — download still works */ }
        if (this.presentation) this.presentation.refreshSlides();
    }

    restoreFromStorage() {
        if (document.documentElement.dataset.deckExport === '1') return;
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (!saved) return;
            const probe = document.createElement('div');
            probe.innerHTML = saved;
            if (!probe.querySelector('.slide')) return;
            this.stage.innerHTML = saved;
            if (this.presentation) this.presentation.refreshSlides();
        } catch (_) { /* ignore */ }
    }

    downloadHtml() {
        if (this.isActive) {
            this.stage.querySelectorAll('[data-editable]').forEach((el) => {
                el.contentEditable = 'false';
            });
            document.body.classList.remove('deck-editing');
            this.isActive = false;
        }

        const clone = document.documentElement.cloneNode(true);
        clone.setAttribute('data-deck-export', '1');
        clone.querySelectorAll('[contenteditable]').forEach((el) => el.removeAttribute('contenteditable'));
        const body = clone.querySelector('body');
        if (body) body.classList.remove('deck-editing');
        clone.querySelectorAll('.edit-toolbar').forEach((el) => el.classList.remove('show'));

        const scripts = clone.querySelectorAll('script');
        const mainScript = scripts[scripts.length - 1];
        if (mainScript && mainScript.textContent) {
            const exportedInit = `const deckEditor = new DeckEditor();\n        const presentation = new SlidePresentation();\n        deckEditor.attachPresentation(presentation);`;
            mainScript.textContent = mainScript.textContent
                .replace(
                    /new\s+SlidePresentation\(\)\s*;\s*\n\s*new\s+DeckEditor\(\)\s*;/g,
                    exportedInit
                )
                .replace(
                    /const\s+deckEditor\s*=\s*new\s+DeckEditor\(\)\s*;\s*\n\s*deckEditor\.restoreFromStorage\(\)\s*;\s*\n\s*const\s+presentation\s*=\s*new\s+SlidePresentation\(\)\s*;\s*\n\s*deckEditor\.attachPresentation\(presentation\)\s*;/g,
                    exportedInit
                );
        }

        const html = '<!DOCTYPE html>\n' + clone.outerHTML;
        const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = (document.title || 'presentation').replace(/\s+/g, '-').toLowerCase() + '.html';
        a.click();
        URL.revokeObjectURL(a.href);
    }
}

const deckEditor = new DeckEditor();
deckEditor.restoreFromStorage();
const presentation = new SlidePresentation();
deckEditor.attachPresentation(presentation);
```

**Editor rules for generators:**
- **Icon-only edit buttons (required):** `#editSave` and `#editDownload` must contain icons only — no visible text inside the buttons. Put meaning in `title` / `aria-label`.
- Never skip `DeckEditor` — verify the output HTML contains `class DeckEditor` before delivery
- Verify `class SlidePresentation` includes `setupStageScale`, `setupClickNav`, and `refreshSlides`
- Verify full `deck-layout.css` is pasted and every content slide uses `.slide-content` + layout grids
- Every text the user might change must have `data-editable`
- Every `<img>` the user might replace must use `class="editable-image"` inside a sized `.img-box` (inline `width`/`height` on `.img-box` matching the authored layout)
- Image replacement preserves box size: `width:100%; height:100%; object-fit: fill` on `.editable-image`
- Do NOT use CSS `~` sibling selector for hover show/hide on the edit toolbar — use the JS delay pattern above
- Init order: `DeckEditor` → `restoreFromStorage()` → `SlidePresentation` → `attachPresentation()` — never restore after `SlidePresentation` constructs
- Downloaded HTML must set `data-deck-export="1"` and skip `restoreFromStorage()` so slide navigation keeps working

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
