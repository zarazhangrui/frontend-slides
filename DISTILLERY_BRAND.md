# Distillery Brand Spec

The full brand-system reference for any presentation made for Distillery. This file is loaded in Phase 3 whenever the user picks the **Distillery Brand** style — its values are mandatory, not suggestions.

**Source of truth:** Distillery Brand Identity Guidelines (brand book). Colors, typography, and the curved-arc motif here are taken directly from the book.

---

## Brand Voice

- **Tagline:** *Never Settle*
- **Brand values:** Unyielding Commitment · Courageous Ambition · Relentless Pursuit · Authentic Connection
- **Vision:** "We're not here to reinvent nearshore software development. We're here to perfect it."
- **Tone for slide copy:** confident, precise, no fluff. Short sentences. Active voice. Avoid generic SaaS clichés ("synergy", "leverage", "best-in-class").

---

## Color System

```css
:root {
    /* Primary */
    --d-navy:        #0B2051;  /* deep navy — dominant background */
    --d-blue:        #124EC6;  /* royal blue — primary accent */
    --d-cyan:        #61E9EE;  /* cyan — bright accent / highlights */

    /* Secondary */
    --d-sky:         #19B8E8;  /* sky blue */
    --d-periwinkle:  #5070E1;  /* periwinkle */
    --d-magenta:     #C621EF;  /* magenta — sparing use only */

    /* Neutrals (derived for readable web text) */
    --d-white:       #ffffff;
    --d-paper:       #f6f8fc;
    --d-ink:         #0B2051;  /* same as navy — body text on light */
    --d-muted:       #6a7896;  /* slate gray — secondary text on light */
    --d-line:        rgba(255,255,255,0.18); /* hairline on dark */

    /* Brand gradients (from the book) */
    --d-grad-hero:   linear-gradient(135deg, #0B2051 0%, #124EC6 100%);
    --d-grad-accent: linear-gradient(135deg, #124EC6 0%, #C621EF 100%);
    --d-grad-cool:   linear-gradient(135deg, #124EC6 0%, #5070E1 100%);
    --d-grad-cyan:   linear-gradient(135deg, #124EC6 0%, #19B8E8 100%);
}
```

**Usage rules:**
- **Default canvas is `--d-navy`** with white type. White slides are allowed for content-heavy "report" decks but the title and closing slides must be navy.
- `--d-blue` is the primary accent — used for active states, key numbers, link-style emphasis.
- `--d-cyan` is the bright accent — used sparingly for one-color highlights, dot markers, underlines.
- `--d-magenta` is reserved for at-most-one-element-per-slide emphasis. Never as a background.
- Never invent colors. Tints/shades of the six brand hues are fine; new hues are not.

---

## Typography

The book specifies **Graphik** (primary) and **Hanken Grotesk** (secondary). Graphik is a paid foundry font, so the web build uses **Hanken Grotesk** as the working primary and pairs it with **Inter Tight** as a near-Graphik substitute when a second weight contrast is needed.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@300;400;500;600;700;800&family=Inter+Tight:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
```

```css
:root {
    --d-font-display: 'Hanken Grotesk', 'Inter Tight', -apple-system, sans-serif;
    --d-font-body:    'Hanken Grotesk', -apple-system, sans-serif;
}
```

**Type scale (use `clamp()`, never fixed):**

| Role            | Size                                       | Weight | Tracking   |
| --------------- | ------------------------------------------ | ------ | ---------- |
| Hero title      | `clamp(2.8rem, 6.5vw, 6rem)`               | 300    | -0.02em    |
| Section title   | `clamp(2rem, 4.5vw, 4rem)`                 | 400    | -0.015em   |
| Subhead         | `clamp(1.1rem, 1.6vw, 1.5rem)`             | 500    | -0.005em   |
| Body            | `clamp(0.95rem, 1.2vw, 1.15rem)`           | 400    | 0          |
| Eyebrow / label | `clamp(0.7rem, 0.85vw, 0.85rem)`           | 600    | 0.18em UPPERCASE |
| Footer / page#  | `clamp(0.7rem, 0.8vw, 0.8rem)`             | 500    | 0.05em     |

**Headings are LIGHT (300/400), not bold.** This matches the book's Graphik Light treatment ("Brand Identity Guidelines", "Color Palette" pages). Bold weight is reserved for buttons, eyebrows, and small emphasis runs.

---

## Background System — Two-BG (House Default)

Distillery decks use a **two-background system**: one image for content slides, a more dramatic one for title / section / closing slides. The skill ships a default pair (`assets/bg-content.svg`, `assets/bg-separator.svg`); a deck can swap the pair for client-themed branding while keeping the structure.

```css
/* Default for every slide */
.slide {
    background: url("assets/bg-content.svg") center/cover no-repeat var(--d-navy);
}

/* Stronger background for title, section dividers, and closing */
.slide.title,
.slide.section,
.slide.closing {
    background: url("assets/bg-separator.svg") center/cover no-repeat var(--d-navy);
}

/* Light-report variant (T9) keeps paper bg, no SVG */
.slide.light {
    background: var(--d-paper);
}
```

**Background rules:**
- The two SVGs are the **single source of brand atmosphere**. Do not stack additional gradients on top.
- Apply `.title` / `.section` / `.closing` classes to the `.slide` element — never inline-override the background.
- For client-themed decks, replace the two files in `assets/` with the client's pair. Filenames stay the same.
- Never use a busy photo as a slide background.

### Layered Curved Arcs (legacy decorative motif)

The skill historically used a hand-drawn arcs SVG as the background motif. With the two-bg system as the new default, **arcs are now optional** — only add them when:

- The deck uses a **plain navy bg** (no SVG bg, e.g. minimal/internal decks)
- A specific slide needs an extra decorative accent (e.g. a stats slide that's otherwise empty)

```html
<svg class="d-arcs" viewBox="0 0 1000 1000" preserveAspectRatio="xMaxYMid meet" aria-hidden="true">
  <g fill="none" stroke="url(#dGradArc)" stroke-linecap="butt">
    <path d="M1000,150 A350,350 0 0 0 1000,850" stroke-width="38" opacity="0.20"/>
    <path d="M1000,220 A280,280 0 0 0 1000,780" stroke-width="34" opacity="0.30"/>
    <path d="M1000,290 A210,210 0 0 0 1000,710" stroke-width="30" opacity="0.45"/>
    <path d="M1000,360 A140,140 0 0 0 1000,640" stroke-width="26" opacity="0.65"/>
    <path d="M1000,430 A70,70  0 0 0 1000,570" stroke-width="22" opacity="0.85"/>
  </g>
  <defs>
    <linearGradient id="dGradArc" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%"  stop-color="#124EC6"/>
      <stop offset="60%" stop-color="#19B8E8"/>
      <stop offset="100%" stop-color="#61E9EE"/>
    </linearGradient>
  </defs>
</svg>
```

```css
.d-arcs {
    position: absolute;
    inset: 0 0 0 auto;
    width: min(60vh, 60%);
    height: 100%;
    pointer-events: none;
    z-index: 0;
}
.slide > * { position: relative; z-index: 1; }
```

When using both the two-bg SVGs and arcs together (rarely), drop arc opacity to **0.10 max** so the layers don't fight.

---

## Layout Anatomy

Every slide has a consistent chrome — copy this exactly:

```
┌─────────────────────────────────────────────────────────────┐
│  [DISTILLERY logo, top-left, white-mono on dark]            │
│                                                             │
│                                                             │
│      [Eyebrow / section number]                             │
│      [Hero or section title — light weight, large]          │
│      [Subtitle / supporting line]                           │
│                                                       ╭─╮   │
│                                                     ╭─┤ │   │
│                                                   ╭─┤ │ │   │
│                                                 ╭─┤ │ │ │   │  ← arcs
│                                                                 │
│  Distillery · Never Settle              02 / 14   │
└─────────────────────────────────────────────────────────────┘
```

**Margins:** outer padding `clamp(2.5rem, 5vw, 5rem)` left / `clamp(2.5rem, 5vw, 5rem)` top, `clamp(2rem, 3.5vw, 3.5rem)` bottom.

**Header chrome (every slide):**
```html
<header class="d-chrome-top">
  <img src="assets/logo-wordmark-white.svg" class="d-logo" alt="Distillery">
</header>
```

```css
.d-logo {
    height: clamp(24px, 2.4vw, 34px);
    width: auto;
    display: block;
}
```

**Footer chrome (every slide except title):**
```html
<footer class="d-chrome-bottom">
  <span class="d-tagline">Distillery · Never Settle</span>
  <span class="d-pagenum">02 / 14</span>
</footer>
```

The logo top-left and the page number bottom-right are **non-negotiable** — they appear on every slide and never move.

---

## Slide Templates

Each presentation should mix from these archetypes. Pick the one that matches the slide's job; do not invent new ones.

### T1. Title / Cover (navy + arcs)
- Eyebrow: kind of deck (e.g. `SALES PROPOSAL · 2026`)
- Hero title: light weight, 2-3 words
- Subtitle: one line, ≤ 80 chars
- Bottom-left: client name + date

### T2. Section Divider (navy + bigger arcs)
- Section number `01`, `02`, etc., in cyan
- Section name, light weight
- One-line description

### T3. Statement / Pull-quote (navy)
- Single-line statement, large light weight
- Optional small attribution (`— Name, Role`)
- No bullets, no chrome other than the standard logo+page#

### T4. Content + Visual (navy or paper)
- Left column: title + 3-5 short bullets (each ≤ 12 words)
- Right column: one image, chart, or `--d-grad-cyan` block
- Bullets use a `0.4em × 0.4em` cyan square as marker, not a disc

### T5. Three-up Cards (navy)
- Eyebrow + section title at top
- 3 cards in a row, each with: number `01`/`02`/`03` in cyan, short headline, 2-line body
- Cards have `1px solid var(--d-line)` border, no fill

### T6. Stats / Numbers (navy)
- 2-4 large numbers in `--d-cyan`, 600 weight, with one-line caption underneath in white
- Numbers `clamp(3rem, 7vw, 6rem)`

### T7. People — "Presenting Myself" (navy)
- **Use this for the Phase 1.5 intro slide.**
- Left 40%: circular portrait, `clamp(220px, 28vw, 360px)`, 4px solid `--d-cyan` ring
- Right 60%: eyebrow `MEET YOUR CONTACT`, name in light weight, role in cyan, then a 2-3 line bio. Email + LinkedIn-style row at the bottom.

### T8. Closing / Thank You (navy + extra-large arcs)
- Hero: `Thank you.` or `Let's build it.`
- Below: contact block (name, role, email)
- Arcs scaled to full slide on the right

### T9. Light Report (paper background)
- Used for content-heavy decks (delivery reports, internal updates)
- Background: `--d-paper`
- Title navy, body navy, accents blue/cyan
- Faint navy arcs at 0.12 opacity bottom-right

### T10. Split (text + visual) — **Default for ≤4-bullet content slides**
- Two equal columns (`.split` class). Text on one side, visual on the other.
- **Vary the side per slide** to avoid monotony — alternate `.split` and `.split.reverse`.
- Visual side accepts: image, chart, animated SVG, icon grid, color block, or KPI tile.
- Text side: eyebrow + heading + 3–4 short bullets, OR heading + one supporting paragraph.
- Use this whenever a slide would otherwise be a centered single-column with empty space.

```html
<section class="slide">
  <div class="slide-content">
    <div class="split">
      <div>
        <span class="d-eyebrow">Capability</span>
        <h2>Heading on the left</h2>
        <ul class="d-bullets">
          <li>Short, scannable point</li>
          <li>Another short point</li>
          <li>Third point, max 12 words</li>
        </ul>
      </div>
      <div class="visual">
        <!-- chart, image, animated svg, or icon grid -->
      </div>
    </div>
  </div>
</section>
```

### T11. Two-column Compare — **Mandatory for "X vs Y" content**
- Mirrored columns with a center divider (`.compare` class).
- Use whenever the slide is an opposition: in scope vs out of scope, before vs after, option A vs option B, risks vs mitigations, what we own vs what client owns.
- Each column gets a `col-label` eyebrow at the top, then matched-shape items below.

```html
<section class="slide">
  <div class="slide-content">
    <h2>Compare heading</h2>
    <div class="compare">
      <div class="col">
        <span class="col-label">Option A</span>
        <ul class="d-bullets"> ... </ul>
      </div>
      <div class="divider"></div>
      <div class="col">
        <span class="col-label">Option B</span>
        <ul class="d-bullets"> ... </ul>
      </div>
    </div>
  </div>
</section>
```

---

## Component Snippets

**Eyebrow label:**
```html
<span class="d-eyebrow">Sales Proposal</span>
```
```css
.d-eyebrow {
    display: inline-block;
    font-size: clamp(0.7rem, 0.85vw, 0.85rem);
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--d-cyan);
    padding-bottom: 0.4em;
    border-bottom: 1px solid var(--d-cyan);
}
```

**Cyan square bullet:**
```css
.d-bullets li {
    list-style: none;
    padding-left: 1.4em;
    position: relative;
}
.d-bullets li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.55em;
    width: 0.4em;
    height: 0.4em;
    background: var(--d-cyan);
}
```

**Card (navy slide):**
```css
.d-card {
    border: 1px solid var(--d-line);
    padding: clamp(1.2rem, 2vw, 2rem);
    background: rgba(255,255,255,0.02);
    backdrop-filter: blur(2px);
}
.d-card .d-card-num {
    color: var(--d-cyan);
    font-size: clamp(1.6rem, 2.2vw, 2rem);
    font-weight: 300;
    margin-bottom: 0.6em;
}
```

---

## Motion

Distillery decks are calm and confident — not flashy. Use these animations only:

1. **Slide enter:** content fades in + translates up `8px` over `500ms ease-out`, with `80ms` stagger between elements.
2. **Arcs draw-on (title slide only):** each arc reveals via `stroke-dasharray` from 0 → full length, 200ms apart, 1.2s total.
3. **Eyebrow underline:** scales `0 → 100%` from left, 400ms ease-out.

No bouncy springs, no continuous loops, no parallax on scroll. Honor `prefers-reduced-motion: reduce` by skipping all transforms (keep opacity fades only).

---

## Assets in the Repo

| Path                              | Usage                                     |
| --------------------------------- | ----------------------------------------- |
| `assets/logo-wordmark-white.svg`  | **Default logo** — white wordmark for navy/dark slides. Use everywhere unless the slide is light-paper. |
| `assets/logo-wordmark-dark.svg`   | Dark wordmark for light-background slides (T9 light report) |
| `assets/logo-icon.svg`            | Icon-only mark (the gradient swirl). Use for favicons or where the wordmark won't fit. |
| `assets/bg-content.svg`           | **Default content-slide background.** Used on every `.slide`. |
| `assets/bg-separator.svg`         | **Title / section / closing background.** Used on `.slide.title`, `.slide.section`, `.slide.closing`. |
| `assets/distillery-logo.png`      | Legacy full-color PNG (kept for fallback only) |
| `assets/fran-maurici.png`         | Default headshot for the "presenting myself" slide (when the user is Francisco Maurici) |
| `assets/icons/*.svg`              | Curated Lucide icon set (~30 icons). Reference by path: `assets/icons/check.svg`. See SKILL.md "Icons". |

**Logo usage — the only correct way:**

```html
<!-- Dark slides (default) -->
<img src="assets/logo-wordmark-white.svg" class="d-logo" alt="Distillery">

<!-- Light slides (T9) -->
<img src="assets/logo-wordmark-dark.svg" class="d-logo" alt="Distillery">

<!-- Icon-only contexts (favicon, tiny chrome) -->
<img src="assets/logo-icon.svg" class="d-logo-icon" alt="Distillery">
```

**Hard rule:** Never hand-code the Distillery logo as inline SVG paths or `<text>` elements. Always reference one of the three asset files above. Hand-coded versions render with anti-aliasing artifacts at small sizes and don't match the brand mark.

---

## Hard Rules (Don'ts)

From the brand book + web adaptation:

- ❌ Do not use any font other than Hanken Grotesk / Inter Tight.
- ❌ Do not introduce non-brand colors (no purples that aren't `#C621EF`, no greens, no oranges).
- ❌ Do not stretch, recolor, or rotate the logo.
- ❌ Do not hand-code the logo — always reference the SVG asset files.
- ❌ Do not put the logo on a busy photo background — use the two-bg system.
- ❌ Do not use bold (700+) for slide titles. Light/regular only.
- ❌ Do not use a centered single-column layout for content slides ≤4 bullets — use T10 split instead.
- ❌ Do not use a single-column layout for "X vs Y" content — use T11 compare.
- ❌ Do not place an image on a white-background frame on a dark slide. Use `.image-photo` (transparent) or `.image-diagram` (dark plate). See SKILL.md.
- ❌ Do not use clip art, illustrations, or stock 3D renders. Photos of real people/work only.
