---
version: alpha
name: Kite
description: "A clinical-corporate presentation system in the register of a life-sciences house style. Two colors carry the entire deck — a deep clinical blue (#0065A8) that owns every panel, rule and field, and a warm chrome gray (#55565C) — supported by a near-identical companion blue (#0B64A6) and a single cyan (#40B2E1). Type is one neo-grotesque family (Inter, standing in for Helvetica) run at a single weight across the whole scale, with lighter weight reserved for the extremes and exactly one bold in the system. Text color, not text weight, carries hierarchy: a #404040 title over a #808080 subhead over pure black body. The signature chrome is a 13px full-height blue rule pinned to the left edge of every content slide, a 97px reserved bottom band holding a #A6A6A6 hairline legal line and a bold right-aligned slide number, and a crimson triangle bullet that is the deck's only warm accent. Layouts are strictly rectangular, flat, and grid-locked to a 104px left margin and a 1712px content column. The aesthetic is regulated-industry corporate: calm, evidence-led, high-formality, and built for dense clinical or scientific content that still has to read from the back of an auditorium."

colors:
  # --- Ground
  bg: "#FFFFFF"

  # --- Structural blues. These three do ~95% of all colored work.
  blue: "#0065A8"          # primary. Every rule, field, panel, tile.
  blue-deep: "#0B64A6"     # companion. Second tone in alternating sets.
  cyan: "#40B2E1"          # the one true accent. Use sparingly.

  # --- Text ladder. Hierarchy is carried by these, not by font weight.
  title-ink: "#404040"     # headings and titles
  subhead-ink: "#808080"   # subheads and secondary lines
  ink: "#000000"           # body copy
  legal-ink: "#A6A6A6"     # footer legal microtype
  gray: "#55565C"          # chrome gray: slide number, icon strokes

  # --- Surfaces
  panel-tint: "#F2F2F2"    # light tile / gray block fill
  gray-panel: "#E7E6E6"
  gray-line: "#C6CAC6"

  # --- Bullet accent. Reserved for the triangle glyph. Not a fill color.
  crimson: "#C30F3B"

  # --- Latent palette. Present in the theme, deliberately unused in layouts.
  # Reach for these ONLY when a categorical set genuinely needs a 4th+ hue.
  indigo: "#5080E0"
  purple: "#51438A"
  green: "#71BC51"
  orange: "#F26B43"

  # --- Treatments
  blue-wash: "rgba(0, 101, 168, 0.06)"
  scrim: "rgba(0, 0, 0, 0.34)"
  photo-scrim: "linear-gradient(120deg, rgba(255,255,255,0.68) 0%, rgba(255,255,255,0.74) 37%, rgba(255,255,255,0) 65%)"

typography:
  box-figure:
    fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: 120
    fontWeight: 300
    lineHeight: 1
    letterSpacing: -0.03em
  agenda-title:
    fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: 90
    fontWeight: 300
    lineHeight: 1
    letterSpacing: -0.02em
    color: "{colors.bg}"
  quote:
    fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: 80
    fontWeight: 300
    lineHeight: 1.2
    letterSpacing: -0.015em
  title:
    fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: 72
    fontWeight: 300
    lineHeight: 1.1
    letterSpacing: -0.015em
    color: "{colors.title-ink}"
  box-lead:
    fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: 72
    fontWeight: 300
    lineHeight: 1.05
    letterSpacing: -0.02em
  divider-title:
    fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: 66
    fontWeight: 300
    lineHeight: 1.12
    letterSpacing: -0.015em
  sidebar-quote:
    fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: 56
    fontWeight: 300
    lineHeight: 1.25
    letterSpacing: -0.01em
  slide-title:
    fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: 52
    fontWeight: 400
    lineHeight: 1.23
    letterSpacing: -0.01em
    color: "{colors.title-ink}"
  agenda-subhead:
    fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: 48
    fontWeight: 300
    lineHeight: 1.25
  subhead:
    fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: 40
    fontWeight: 400
    lineHeight: 1.6
    color: "{colors.subhead-ink}"
  body:
    fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: 40
    fontWeight: 400
    lineHeight: 1
    color: "{colors.ink}"
  body-md:
    fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: 36
    fontWeight: 400
    lineHeight: 1.35
    color: "{colors.ink}"
  block-heading:
    fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: 36
    fontWeight: 400
    lineHeight: 1.2
  chip:
    fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: 36
    fontWeight: 400
    lineHeight: 1
  body-sm:
    fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: 32
    fontWeight: 400
    lineHeight: 1.4
  body-xs:
    fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: 28
    fontWeight: 400
    lineHeight: 1.45
  date:
    fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: 28
    fontWeight: 400
    letterSpacing: 0.02em
    color: "{colors.title-ink}"
  slide-number:
    fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: 24
    fontWeight: 700
    color: "{colors.gray}"
  legal:
    fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: 14
    fontWeight: 300
    lineHeight: 1.5
    color: "{colors.legal-ink}"

spacing:
  margin-x: 104px
  content-width: 1712px
  rule-width: 13px
  header-title-y: 74px
  header-subhead-y: 142px
  content-y: 273px
  content-height: 700px
  safe-bottom: 983px
  chrome-band: 97px
  footer-y: 1022px
  gutter-2up: 68px
  gutter-3up: 45px
  gutter-4up: 32px
  bullet-indent: 36px
  bullet-leading: 40px
  bullet-gap: 20px
  card-pad: 43px

canvas:
  width: 1920px
  height: 1080px

components:
  edge-rule:
    description: "The system's signature chrome. A 13px-wide solid {colors.blue} bar pinned to the left edge of the stage, running the full 1080px height. Present on every content slide and every photo divider. Omitted only on full-field blue slides (quote, blue divider, dark closing) where the whole surface is already blue."
    width: "13px"
    background: "{colors.blue}"
    placement: "position:absolute; left:0; top:0; height:1080px"
  footer-band:
    description: "A 97px reserved band at the bottom of the stage (y 983-1080). No content block may enter it. It holds the hairline legal line and the slide number, and it is what makes the deck read as a regulated-industry document."
    height: "97px"
    top: "983px"
  legal-line:
    description: "A 14px weight-300 {colors.legal-ink} line of small print in the footer band at y=1022, width 648px starting at x=636. Deliberately the palest text in the system, chosen to hold on both white and photography. On photo dividers it stretches from the left edge instead. Use neutral placeholder wording such as a copyright line plus an optional one-line disclaimer."
    typography: "{typography.legal}"
    color: "{colors.gray}"
  slide-number:
    description: "A right-aligned 24px {colors.gray} numeral at (1816, 1005), 49x58, set in the system's only bold weight. Present on every slide except the title slide."
    typography: "{typography.slide-number}"
  slide-header:
    description: "The universal content-slide header: a 52px {colors.title-ink} title at (104, 74) spanning 1712px, and an optional 40px {colors.subhead-ink} subhead at (104, 142). Both run weight 400 on the same 64px leading and separate by size and darkness only; both are lighter than the black body copy below. Left-aligned to the 104px margin. Content starts at y=273."
    titleTypography: "{typography.slide-title}"
    subheadTypography: "{typography.subhead}"
  title-card:
    description: "A white card floating over a full-bleed photograph, 915x505 at (88, 439), carrying a 13px {colors.blue} bar on its own left edge. Holds the deck title (72px/300), subhead (40px/300), and date (28px). The card is the title slide's entire composition."
    size: "915x505"
    background: "{colors.bg}"
    accentBar: "13px {colors.blue} on the left edge"
  agenda-panel:
    description: "A solid {colors.blue} panel at (0, 0) 796x983 holding the section title (90px/300 white) and subhead (48px/300 white). The agenda list sits to its right starting at x=907. The panel stops at y=983 so the footer band stays white."
    size: "796x983"
    background: "{colors.blue}"
  list-bullet:
    description: "A crimson triangle marker at 120% of the text size, hanging 36px to the left of a 40px body line. Fixed 40px leading with a 20px gap before each item. The crimson marker on otherwise blue-and-gray slides is the system's one deliberate chromatic spark."
    marker: "triangle glyph"
    markerColor: "{colors.crimson}"
    indent: "36px"
  block-card:
    description: "A two-part vertical card: a header zone (icon or figure) on white, and a body zone filled solid {colors.blue-deep} (or {colors.panel-tint} in the gray variant) holding a 36px heading and 36px body copy at the same weight. 3-up cards are 539px wide; 4-up cards are 402px wide."
    bodyBackground: "{colors.blue-deep}"
    headingTypography: "{typography.block-heading}"
  gray-block-card:
    description: "The gray variant of block-card: a {colors.panel-tint} card 402x650 with a 13px {colors.blue-deep} bar sealing its bottom edge at y=921. Text is {colors.ink} instead of white."
    background: "{colors.gray-panel}"
    footBar: "13px {colors.blue-deep}"
  box-tile:
    description: "A flat rectangle, 792x132 (2-up) or 474x132 (3-up), filled {colors.blue} or {colors.blue-deep} in alternation, carrying a 72px/300 white lead phrase. A 36px description paragraph sits directly beneath the tile on white, not inside it."
    background: "{colors.blue}"
    leadTypography: "{typography.box-lead}"
  color-panel:
    description: "A full-height vertical panel, 403x580 at y=287, filled with one color from the cool ladder ({colors.blue} / {colors.blue-deep} / {colors.cyan}, reaching into {colors.indigo} or {colors.purple} only if a fourth and fifth category are unavoidable). Four sit side by side at x=103, 540, 976, 1413. Holds 32px white body copy inset 19px."
    size: "403x580"
  horizontal-bar-row:
    description: "A four-row stack of 160px-tall rows at y=275/452/630/808. Each row pairs a 624px label block on the left with a 1030px description on the right, and is marked by a 160x7 {colors.blue} tick that bleeds off the left edge at x=26."
    rowHeight: "160px"
    tick: "160x7 {colors.blue} at x=26"
  timeline-rail:
    description: "A horizontal 49px-tall rail at y=611 running x=94 to x=1825, built from a rounded-end cap (327px, border-radius 24.5px) at each end and flat 282px segments between. Segments alternate {colors.blue} and {colors.blue-deep} — a two-tone alternation, not a multicolor scale. Each segment carries a 36px white date chip."
    height: "49px"
    y: "611px"
  timeline-marker:
    description: "A 106x69 triangle in {colors.blue} pointing at the rail. Markers alternate above the rail (y=569, pointing down) and below it (y=635, pointing up), each anchoring a text column at y=275 (above) or y=728 (below)."
    size: "106x69"
  numbered-block:
    description: "A {colors.blue-deep} panel 797px wide: a 135px header band at y=265 holding a 40px heading, then a 561px body panel at y=400 holding three rows. Each row is tagged by a 78px white circle bearing the ordinal, half-overlapping the panel's left edge at x=65."
    circle: "78px, {colors.bg} fill, {colors.blue-deep} numeral"
  sidebar-panel:
    description: "A 674px full-height panel from x=1246 to the right edge. Either a {colors.blue} icon-list rail (four 130px icon slots at y=171/371/571/771 with 32px labels at x=1463) or a photo panel carrying a 56px/300 white pull-quote over a scrim."
    width: "674px"
  quote-field:
    description: "A full 1920x983 {colors.blue} field with an 80px/300 white quote at (254, 374) 1412px wide and a 48px attribution at (254, 766). The 97px footer band below stays white."
    background: "{colors.blue}"
  diagonal-cut:
    description: "A full-bleed photograph overlaid with a white wedge clipped diagonally from the top-right, leaving the lower-left free for a 66px title at (104, 630) and a 40px subhead at (104, 807). Implemented with clip-path, never with a rotated element."
  closing-slide:
    description: "A closing statement slide: a 72px/300 line at (104, 455) 1712px wide, an optional 24px disclaimer block at (103, 676), and a 24px date at (105, 802). Available white-on-blue (full field) or blue-on-white."
---

## Frontend Slides Fixed-Stage Policy

When this design system is used by the `frontend-slides` skill, generate the final deck as a **fixed 1920×1080 stage** that scales uniformly to the browser viewport. The deck should preserve a 16:9 slide canvas on every screen, including phones; it may letterbox or pillarbox, but it should not reflow slide content for mobile.

This policy has higher priority than any source-template responsive behavior described later in this file. If a later section says the original template is viewport-fluid, treat that as source history only, not as the target generation model for `frontend-slides`.

This policy applies even if the source template was originally implemented with viewport-fluid CSS such as `100vw`, `100vh`, `vw`, `vh`, or `clamp()`. Treat those values as design proportions to translate into 1920×1080 stage coordinates, not as live responsive rules in the generated deck.

Use `deck-stage.js` or an equivalent inline stage scaler for final output: render each slide at 1920×1080, scale the whole stage with one transform, and verify rendered screenshots for both text overflow and panel overlap.

## Overview

Kite is a **clinical-corporate presentation system** modeled on the house styles used by biotech and pharmaceutical organizations for scientific, medical-affairs, and investor communication. Its premise is the opposite of an editorial system: the design gets out of the way of the evidence. There is one typeface, one dominant color, one rule weight, and one margin. Everything else is content.

The foundation is a **deep clinical blue** (`{colors.blue}` — #0065A8). It is not an accent; it is the system's structural color. It fills section panels, quote fields, block-list bodies, box tiles, and timeline rails, and it appears on every other slide as a **13px full-height bar pinned to the left edge of the stage** (`{components.edge-rule}`). That bar is the single most recognizable thing about the system — a thin blue spine running down the left of the whole deck.

Typography is a **single neo-grotesque family run at essentially a single weight.** In the source, one regular cut carries the whole scale from the 12pt slide number to the 45pt agenda title; a light cut appears only at the two extremes (14px legal microtype, and the 66px+ display tier), and bold appears exactly once, on the slide number. There is no weight 500, no weight 600, no italic, and no second family anywhere in the system. Hierarchy is carried by size and — more distinctively — by color: a #404040 title sits above a #808080 subhead sits above pure black body copy, so the *content* is the darkest thing on the slide and its label recedes.

The palette beyond blue is a **six-hue categorical ladder** — cyan, indigo, purple, green, crimson, orange. These are not decorative. They exist to code parallel items in a set: four vertical panels, three multicolor block lists, a series of categorical bars. When a slide has no categorical dimension, it should be entirely blue, gray, and white. A slide that scatters purple and orange across unrelated elements has misused the ladder.

Every slide carries a **97px reserved bottom band** (y 983–1080) holding a 14px hairline legal line and a right-aligned slide number. No content block ever enters it. This band, more than anything else, is what makes the deck read as a document produced inside a regulated industry — it looks like a page that expects to be footnoted.

Depth is **completely flat**. No shadows, no gradients, no glass, no glow, no rounded corners except two: the end caps of the timeline rail and the numbered-block ordinal circles. Elevation is expressed by filling a rectangle solid blue and reversing the text to white. That inversion is the entire depth language.

**Density philosophy: content-dense but grid-locked.** Kite is designed for slides that genuinely carry a lot of information — a nine-item bulleted list, a six-box summary, a four-stage timeline with descriptions above and below. Density is acceptable *because* every element snaps to the same margin (104px), the same content column (1712px), and the same vertical anchors (title 74, subhead 142, content 273, floor 983). Crowding is prevented by the grid, not by removing content. What breaks the system is not density — it is an element that sits off-grid.

**Key Characteristics:**
- One neo-grotesque family at essentially one weight. Light only at the extremes of the scale (14px, 66px+); bold exactly once, on the slide number.
- Hierarchy carried by color, not weight, and inverted: title #404040, subhead #808080, body #000000.
- Deep clinical blue (`{colors.blue}`) as the structural color: panels, rails, tiles, and the 13px left edge rule.
- A 13px full-height blue bar on the left edge of every content slide and photo divider.
- A 97px reserved footer band with a 14px light legal line and a 24px **bold** slide number — never encroached on.
- Crimson triangle bullets at 120% size, hanging 36px, with fixed 40px leading — the only warm color on a content slide.
- Two near-identical blues plus one cyan carry ~95% of all colored surface; the rest of the theme palette is deliberately unused.
- Strict rectangles: zero border-radius except the timeline caps and ordinal circles.
- Flat fills only. Elevation = solid blue rectangle with reversed white text.
- Everything left-aligned to a 104px margin inside a 1712px content column.

## Colors

The single most important fact about this palette: **two colors do almost all the work.** Across the 77 layouts of the source house style, `#0065A8` and `#55565C` each appear in 63 of them, `#0B64A6` in 22, `#40B2E1` in 5, and `#C30F3B` in 4 (only ever as a bullet glyph). The remaining theme entries — indigo, purple, green, orange — appear in **zero** layouts. They exist in the theme so the palette swatch is complete, not because the design uses them.

Build slides accordingly. A correct Kite deck is overwhelmingly blue, gray, and white. If your slide has four different hues on it, you have almost certainly left the system.

### Palette

**Ground**

- **Background / White** (`{colors.bg}` — #FFFFFF): The default slide surface. Pure white, never off-white, never tinted. Clinical decks are read as documents; a warm paper cast reads as editorial and breaks the register.

**The structural blues** — these three carry the deck.

- **Blue** (`{colors.blue}` — #0065A8): The system's structural color and by far the most-used non-neutral. The left edge rule, the agenda panel, the quote field, the timeline rail, the box tiles, the horizontal-bar ticks, the dark divider field. When in doubt, this is the blue.
- **Blue Deep** (`{colors.blue-deep}` — #0B64A6): A near-identical sibling used for *fills that sit adjacent to* `{colors.blue}` — block-list bodies, numbered-block panels, alternating timeline segments, the bottom bar on gray block cards. **These two blues differ by roughly 2%.** That is deliberate. Do not "fix" the pair by darkening one for contrast; the effect you want is a surface that subtly articulates into panels, not a two-tone color scheme.
- **Cyan** (`{colors.cyan}` — #40B2E1): The one genuine accent in the system, and the only color that reliably reads as *different* rather than as another blue. Reserve it: the second tone in an alternating set, a single highlighted item, a quote mark. Used more than once or twice per slide it stops being an accent.

**The text ladder** — hierarchy in this system is carried by *color*, not by weight. All four levels run at the same weight; they separate purely by luminance.

- **Title Ink** (`{colors.title-ink}` — #404040): All titles and headings. Note that this is a dark gray, **not** black. A pure-black heading over black body copy gives you no hierarchy at all, which is exactly why the source lightens it.
- **Subhead Ink** (`{colors.subhead-ink}` — #808080): Subheads and secondary lines. A true mid-gray at 50% — deliberately much lighter than the title.
- **Ink** (`{colors.ink}` — #000000): Body copy on white. True black, and *darker than the heading above it*. This inversion is the system's most distinctive and most counterintuitive move: the content is the most emphatic thing on the slide, and the label above it recedes.
- **Legal Ink** (`{colors.legal-ink}` — #A6A6A6): The footer microtype only. Light enough to disappear on white and to survive over photography, which is precisely why the source uses one value for both cases.
- **Gray** (`{colors.gray}` — #55565C): Chrome gray — the slide number and icon strokes. A warm dark gray, and the only neutral in the system defined as its own hex rather than derived from black or white.

**Surfaces**

- **Panel Tint** (`{colors.panel-tint}` — #F2F2F2): The light tile fill (white darkened 5%). The default "supporting, not primary" surface — gray block cards, muted tiles, inset wells.
- **Gray Panel** (`{colors.gray-panel}` — #E7E6E6): A slightly heavier neutral card fill, for when a tinted panel must separate from an adjacent `{colors.panel-tint}` surface.
- **Gray Line** (`{colors.gray-line}` — #C6CAC6): Hairline rules and table dividers. 1px only.

**The bullet accent**

- **Crimson** (`{colors.crimson}` — #C30F3B): The triangle bullet marker, and essentially nothing else. In the source it appears in four layouts, always as a glyph color, **never as a fill.** It is the only warm color a routine content slide is permitted, and its scarcity is the point. It is also correct for a negative delta or a risk callout — but a crimson panel is not this system.

**Latent palette** — present in the theme, unused in the design.

- **Indigo** (`{colors.indigo}` — #5080E0), **Purple** (`{colors.purple}` — #51438A), **Green** (`{colors.green}` — #71BC51), **Orange** (`{colors.orange}` — #F26B43): Available if a categorical set genuinely needs a fourth or fifth hue and the blues have run out. Prefer running out of colors and repeating a blue over reaching into this group. If you use one, use it for a real category, and never mix a warm one (green/orange) into a cool set.

**Treatments**

- **Blue Wash** (`{colors.blue-wash}` — `rgba(0, 101, 168, 0.06)`): A 6% blue tint for table header rows and zebra striping.
- **Scrim** (`{colors.scrim}` — `rgba(0, 0, 0, 0.34)`): A dark overlay for photographs carrying white text. Never lighter than 0.30 or the text fails contrast.
- **Photo Scrim** (`{colors.photo-scrim}`): The source's actual photo treatment for *dark text on an image* — a 120° white gradient, 68% at the origin, peaking at 74% around the 37% stop, and clearing to transparent by 65%. It bleaches the corner where the text sits while leaving the rest of the photograph intact. Use this instead of a flat white box whenever a title or divider needs to sit directly on an image.

### Defaults
- **Default slide background**: `{colors.bg}` (white). Reach for a full `{colors.blue}` field only for agenda, section-divider, quote, and closing slides.
- **Default title color on white**: `{colors.title-ink}` — not black.
- **Default body text color on white**: `{colors.ink}`.
- **Default body text color on blue**: `{colors.bg}` (white). Never gray-on-blue.
- **Default subhead color on white**: `{colors.subhead-ink}`.
- **Default subhead color on blue**: `{colors.bg}` at full opacity — do not fake a secondary tone with white at 70%.
- **Default panel fill**: `{colors.blue}`. Use `{colors.blue-deep}` when the panel abuts another blue surface.
- **Default rule color**: `{colors.blue}` at 13px for structural bars; `{colors.gray-line}` at 1px for table hairlines. There is no intermediate rule weight.
- **Default bullet marker color**: `{colors.crimson}`. Always.
- **Default sequence for an alternating set**: `{colors.blue}` → `{colors.blue-deep}`, repeating. This is what the source timeline, box grids, and bar rows actually do.
- **Default sequence for a categorical set**: `{colors.blue-deep}` → `{colors.cyan}` → `{colors.indigo}` → `{colors.purple}`. Stay cool; stop as early as the content allows.

The blues carry the system. If a slide's items are not genuinely parallel categories, keep them all blue and let position do the work.

## Typography

### Font Family

The source house style is Helvetica, with **Helvetica Light** appearing at only two points in the entire deck and **Helvetica Neue Light** used solely as the East-Asian companion face (never for Latin text). The web-safe equivalent that keeps the neo-grotesque skeleton and offers a true light cut is **Inter**. Load it and use it for everything:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700&display=swap" rel="stylesheet">
```

```css
--font: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
```

**This is a single-family, essentially single-weight system.** There is no display/body split, no serif, no mono. What makes it cohere is the discipline described below.

#### The weight rule

In the source, **one weight — Helvetica Regular — runs the entire scale from 12pt to 45pt.** The title, the subhead, the body, the date, the tile copy, the block headings: all the same weight. Light is used at exactly two places, both at the *extremes* of the scale, and bold appears exactly once in the whole system.

That gives three rules:

- **400 (Regular)** — the default, and correct for nearly everything: content-slide titles, subheads, body copy, list items, dates, chips, tile copy, block headings, captions.
- **300 (Light)** — the extremes only. The 14px legal microtype at the bottom of the scale, and the 120px figures / 66px+ display tier at the top. Never in the middle of the scale.
- **700 (Bold)** — **the slide number, and nothing else.** This is not an oversight in the source; it is a single deliberate typographic accent, a small hard mark in the corner of an otherwise uniformly-weighted page. Reproduce it exactly and never extend bold to anything else.

> **Adaptation note.** Inter at 400 renders optically heavier than Helvetica at 400, and the difference becomes obvious above ~60px. So this system runs the large display tier (66px and up) at **300** rather than 400, to preserve the source's optical lightness at scale. This is a substitution to match appearance, not a different design intent — below 66px, stay at 400 exactly as the source does.

Weight 500, 600, 800, italic, and `text-transform: uppercase` are all outside the system. Emphasis comes from color and size, never from weight or case.

#### How hierarchy actually works here

Because weight is nearly constant, **color carries the hierarchy** — and it runs in a direction most systems invert:

```
Title      #404040   ← lightest
Subhead    #808080   ← lighter still
Body       #000000   ← darkest
```

The heading is a *label*; the content is the *message*. Getting this backwards — a black bold heading over gray body — is the single fastest way to make a deck stop looking like Kite.

### Type Scale

All sizes are fixed pixels on the 1920×1080 stage. The source deck's point sizes map at exactly 2× (a 960pt-wide slide becomes a 1920px stage), so a 36pt source title is a 72px stage title.

The scale is steeply weighted toward the middle. In the source, **18pt (36px) is by far the most-used size** — it is the real workhorse for copy inside any component — followed by 16pt (32px) and 20pt (40px). The large display tier is rare by design.

| Token | Size | Weight | Source freq. | Use |
|---|---|---|---|---|
| `{typography.box-figure}` | 120px | 300 | rare | Large numeral / percentage inside a multicolor box |
| `{typography.agenda-title}` | 90px | 300 | rare | Agenda and section-panel title (white on blue) |
| `{typography.quote}` | 80px | 300 | rare | Pull-quote on a full blue field |
| `{typography.title}` | 72px | 300 | common | Deck title on the title card; closing statement line |
| `{typography.box-lead}` | 72px | 300 | rare | Lead phrase inside a blue box tile |
| `{typography.divider-title}` | 66px | 300 | common | Section-divider title (photo, diagonal, or blue field) |
| `{typography.sidebar-quote}` | 56px | 300 | rare | Pull-quote inside a right-hand sidebar panel |
| `{typography.slide-title}` | 52px | 400 | **very common** | Universal content-slide title at y=74 |
| `{typography.agenda-subhead}` | 48px | 400 | rare | Subhead under an agenda title; quote attribution |
| `{typography.subhead}` | 40px | 400 | **very common** | Content-slide subhead at y=142 |
| `{typography.body}` | 40px | 400 | **very common** | Top-level bulleted list item |
| `{typography.body-md}` | 36px | 400 | **the workhorse** | Body copy inside any component — cards, panels, tiles, bars |
| `{typography.block-heading}` | 36px | 400 | common | Heading inside a block card or numbered block |
| `{typography.chip}` | 36px | 400 | common | Date chip on the timeline rail |
| `{typography.body-sm}` | 32px | 400 | common | Dense component copy; sidebar labels, icon captions |
| `{typography.body-xs}` | 28px | 400 | occasional | Footnote-level detail inside a dense card |
| `{typography.date}` | 28px | 400 | occasional | Date line on the title card |
| `{typography.slide-number}` | 24px | **700** | common | Slide number in the footer band |
| `{typography.legal}` | 14px | 300 | common | Hairline legal / copyright line in the footer band |

#### Leading

The source sets leading in absolute points, not ratios, and the values are tighter than most systems:

- **Display type is set solid.** The agenda title is 45pt on 45pt leading — a 1.0 ratio. Anything 66px and up should run between 1.0 and 1.12. This tight setting is a large part of the deck's voice.
- **Titles run ~0.9–1.23.** The master title style is 90%; the content-slide title is 26pt on 32pt (1.23).
- **Body lists use fixed leading with a paragraph gap**, not a line-height ratio: **40px leading, 20px space before each item.** This is what makes list slides breathe while individual wrapped lines stay tight.
- **Component copy runs 1.35–1.4.**

```css
.k-list li  { font-size: 40px; line-height: 40px; margin-top: 20px; }
.k-list li:first-child { margin-top: 0; }
```

#### Text insets

Every text placeholder in the source has **zero internal padding** (`lIns/tIns/rIns/bIns = 0`). All coordinates in this document are therefore true text-box edges. Set `padding: 0` on text elements and position by coordinate; do not add padding to a positioned text block or it will fall off the grid.

### Defaults
- **Default content-slide title**: `{typography.slide-title}` (52px / 400 / #404040) at (104, 74).
- **Default subhead**: `{typography.subhead}` (40px / 400 / #808080) at (104, 142).
- **Default list item**: `{typography.body}` (40px / 400 / black) with a crimson triangle marker, 40px leading, 20px before.
- **Default body inside any card, tile, panel, or bar**: `{typography.body-md}` (36px). Drop to `{typography.body-sm}` (32px) only when the component is genuinely cramped.
- **Default display size for a section divider**: `{typography.divider-title}` (66px / 300).
- **Default display size for a deck title**: `{typography.title}` (72px / 300).
- **Default weight**: 400. Go to 300 only at 66px+ or at 14px; go to 700 only for the slide number.

When unsure, reach for `{typography.slide-title}` (52px) for the slide's title, `{typography.body}` (40px) for a top-level list, and `{typography.body-md}` (36px) for anything inside a component. The 66–120px tier belongs to dividers, agendas, quotes, and box figures only.

### Signature Treatments

These are **non-optional whenever the corresponding element type is used**:

- **Hierarchy is inverted: title #404040, subhead #808080, body #000000.** Never a black heading over gray body.
- **One weight throughout, with exactly two exceptions**: light at the extremes (14px legal, 66px+ display) and bold on the slide number alone.
- **Every bulleted list uses the crimson triangle marker at 120% size, hanging 36px, with 40px fixed leading and a 20px gap before each item.** Not a disc, not a dash, not a checkmark. This is the one place crimson appears on a routine content slide.
- **Every content slide carries the 13px `{colors.blue}` left edge rule at x=0, full 1080px height.** Slides whose entire surface is already blue omit it; every other slide has it.
- **Every slide reserves y 983–1080.** The legal line sits at y=1022 and the slide number at (1816, 1005). Content that runs into that band is a defect, not a style choice.
- **Every text block starts at x=104 and stops at x=1816.** Full-bleed photos, blue fields, and the edge-bleeding bar tick are the only elements permitted to cross that boundary.
- **Every panel, card, tile, and bar is a strict rectangle.** The only radii in the system are the 24.5px end caps on the timeline rail and the 50% ordinal circles.
- **Dark text on a photograph sits over the `{colors.photo-scrim}` gradient or inside a solid card; white text sits over `{colors.scrim}`.** Never straight onto an image.

### Typography Principles

Near-uniform weight is the whole voice. Adding a bold weight to "make the title pop" is the most common way to break this system — Kite creates emphasis by scale and by color inversion (white on blue), never by weight. Similarly, uppercase eyebrows and wide letter-spacing belong to editorial systems, not this one: labels here are sentence case at weight 400.

Negative letter-spacing (-0.01em to -0.03em) is applied only at 52px and above, where a light neo-grotesque otherwise looks loose. Body copy runs at default tracking.

Numerals are lining and tabular wherever they appear in a series. Set `font-variant-numeric: tabular-nums` on timeline chips, box figures, table columns, and any metric row so digits align.

## Layout

### Canvas System

The system targets a fixed **1920×1080** canvas. Each slide is a `<section class="slide">` at exactly 1920×1080, scaled uniformly to the viewport by `deck-stage.js`. Every measurement in this document is a fixed pixel on that canvas.

```css
.slide {
  position: relative;
  width: 1920px;
  height: 1080px;
  background: #FFFFFF;
  font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  color: #000000;
  overflow: hidden;
}
```

Because the composition is anchored rather than flowed, `position: absolute` with explicit `left` / `top` / `width` is the primary layout mechanism, with flex or grid used *inside* a positioned block.

### The Anchor Grid

| Anchor | Value | Meaning |
|---|---|---|
| `{spacing.margin-x}` | 104px | Left margin for every text block |
| `{spacing.content-width}` | 1712px | Content column width (104 → 1816) |
| `{spacing.header-title-y}` | 74px | Top of the slide title |
| `{spacing.header-subhead-y}` | 142px | Top of the subhead |
| `{spacing.content-y}` | 273px | Top of the content region on a standard content slide |
| `{spacing.content-height}` | 700px | Height of the content region (273 → 973) |
| `{spacing.safe-bottom}` | 983px | Absolute floor for content; also the bottom of full-field blue panels |
| `{spacing.chrome-band}` | 97px | Reserved footer band (983 → 1080) |
| `{spacing.footer-y}` | 1022px | Top of the legal line |

Cards and panels sit slightly outside the text margin at **x=103 or x=109** — that is intentional optical alignment: a filled rectangle needs to start a few pixels left of the text baseline above it to look aligned. Use x=103 for full-width card rows and x=109 for 3-up/4-up card grids; keep pure text at x=104.

### Column Sets

| Set | Card width | X positions | Gutter |
|---|---|---|---|
| 2-up text | 817 / 828 | 104, 989 | 68px |
| 2-up panel | 792 / 797 | 103, 1025 | ~130px |
| 3-up card | 539 | 109, 693, 1272 | 45px |
| 3-up tile | 474 | 109, 725, 1343 | 142px |
| 4-up card | 402 | 109, 542, 976, 1409 | 32px |
| 4-up panel | 403 | 103, 540, 976, 1413 | 33px |
| Main + sidebar | 1008–1019 / 674 | 103 / 1246 | 64px |

### Global Chrome

Three elements repeat on nearly every slide. Implement them once and include them by default.

```css
/* 1. The left edge rule — the system's signature */
.edge-rule {
  position: absolute;
  left: 0; top: 0;
  width: 13px; height: 1080px;
  background: #0065A8;
}

/* 2. The hairline legal line — Light weight, and much paler than you expect */
.legal {
  position: absolute;
  left: 636px; top: 1022px;
  width: 648px;
  font-size: 14px; font-weight: 300; line-height: 1.5;
  color: #A6A6A6;
}

/* 3. The slide number — the ONLY bold text in the entire system */
.slide-no {
  position: absolute;
  left: 1816px; top: 1005px;
  width: 49px;
  font-size: 24px; font-weight: 700; color: #55565C;
  text-align: right;
}
```

```html
<section class="slide">
  <div class="edge-rule"></div>
  <!-- slide content, entirely above y=983 -->
  <div class="legal">© 2026 Company Name. For illustrative purposes only.</div>
  <div class="slide-no">12</div>
</section>
```

On a photo divider, the legal line moves to `left: 0; width: 961px` so it sits under the photo's left half. On a full-blue quote or divider slide, the blue field stops at y=983 and the footer band stays white with gray text.

Note the two chrome elements pull in opposite directions and that is intentional: the legal line is the *lightest* text in the system (`#A6A6A6`, weight 300) and the slide number is the *only bold* text in it. One recedes to near-invisibility; the other is a small hard mark. Do not normalize them toward each other.

Because `#A6A6A6` was chosen to survive on both white and photography, it usually needs no change over an image. If the underlying photograph is genuinely dark, switch both the legal line and the slide number to white rather than darkening them.

**Never invent legal text.** Use neutral placeholder wording — a plain copyright line, optionally plus a one-line neutral disclaimer such as `Internal use only.` or `For illustrative purposes only.` — or the user's own real footer string if they supply one.

### Slide-Header Structure

Every content slide opens the same way:

```html
<h2 class="s-title">Primary endpoint results</h2>
<p class="s-sub">Pooled analysis across three cohorts</p>
```

```css
.s-title {
  position: absolute; left: 104px; top: 74px; width: 1712px;
  font-size: 52px; font-weight: 400; line-height: 64px;
  letter-spacing: -0.01em; color: #404040;   /* NOT black */
}
.s-sub {
  position: absolute; left: 104px; top: 142px; width: 1712px;
  font-size: 40px; font-weight: 400; line-height: 64px; color: #808080;
}
```

Both lines run on the same 64px leading (32pt in the source), which is what keeps the title and subhead reading as one locked header block rather than two separately-placed lines. Both are weight 400 — the title is distinguished from the subhead by *size and darkness only*, and both are lighter than the black body copy below them.

When a slide has no subhead, the content region may start at **y=213** instead of 273. Everything below shifts up by 60px as a block; do not stretch individual elements to fill the gap.

## Component Library

Every component below is a concrete recipe. Coordinates are absolute on the 1920×1080 stage.

### Title Card (`{components.title-card}`)

A full-bleed photograph with a white card floating over its lower-left quadrant. The card carries its own 13px blue bar on its left edge — the same 13px as the global edge rule, transposed onto the card.

```css
.title-photo { position:absolute; inset:0; width:1920px; height:1080px; object-fit:cover; }
.title-card {
  position:absolute; left:88px; top:439px; width:915px; height:505px;
  background:#fff; border-left:13px solid #0065A8; box-sizing:border-box;
}
.title-card h1 { position:absolute; left:72px; top:175px; width:822px;
  font-size:72px; font-weight:300; line-height:1.1; letter-spacing:-0.015em;
  color:#404040; }
.title-card .sub { position:absolute; left:72px; top:275px; width:822px;
  font-size:40px; font-weight:400; line-height:54px; color:#808080; }
.title-card .date { position:absolute; left:72px; top:419px;
  font-size:28px; font-weight:400; color:#404040; }
```

The title block inside the card is sized for **one line** at 72px (822×95 at y=175). For a two-line title, raise the title to `top: 95px` so it still clears the subhead at y=275; for a three-line title, drop the title to `{typography.divider-title}` (66px) at `top: 60px`. Never let the title run into the subhead.

The legal line on the title slide sits over the photograph. `{colors.legal-ink}` (#A6A6A6) was chosen to hold on both white and imagery, so it usually needs no change; switch it and the slide number to white only if the underlying photograph is genuinely dark.

The title slide is the only slide without a slide number. If no photograph is available, fill the stage with `{colors.blue}` and place the same white card on it — the composition still works.

### Section Divider — Photo

Full-bleed or half-bleed photograph on the right, title block on the left, edge rule at x=0.

```
edge rule       x=0    13 × 1080          #0065A8
photo           x=960  960 × 1080         (or full-bleed with a scrim on the left half)
title           (104, 431) 711 × 212      66px / 300
subhead         (104, 643) 711 × 96       36px / 400, #808080
legal           (0, 1022) 961 × 58        14px
```

If the photo is full-bleed rather than half-bleed, apply a `linear-gradient(90deg, rgba(0,0,0,.55), rgba(0,0,0,0) 55%)` scrim and set the title and subhead to white.

### Section Divider — Diagonal (`{components.diagonal-cut}`)

Full-bleed photograph with a white wedge cut diagonally from the top-right, leaving the lower-left clear for type.

```css
.divider-diagonal .wedge {
  position:absolute; inset:0; background:#fff;
  clip-path: polygon(100% 0, 100% 100%, 47% 100%, 78% 0);
}
.divider-diagonal h2 { position:absolute; left:104px; top:630px; width:950px;
  font-size:66px; font-weight:300; line-height:1.12; color:#404040; }
.divider-diagonal .sub { position:absolute; left:104px; top:807px; width:950px;
  font-size:40px; font-weight:400; color:#808080; }
```

Use `clip-path` only. A rotated `<div>` produces antialiased edges that break the flat register.

### Section Divider — Blue Field

The typographic variant: a solid `{colors.blue}` rectangle at (0, 0) 1920×983, title at (104, 630) 1295px wide, subhead at (104, 719). Both white. The footer band below stays white with a gray legal line and slide number. No edge rule — the field is already blue.

### Agenda Panel (`{components.agenda-panel}`)

The system's table of contents: a blue panel on the left holding the section title, the list on the right.

```css
.agenda-panel { position:absolute; left:0; top:0; width:796px; height:983px; background:#0065A8; }
.agenda-panel h2 { position:absolute; left:104px; top:533px; width:663px;
  font-size:90px; font-weight:300; line-height:1.05; letter-spacing:-0.02em; color:#fff; }
.agenda-panel .sub { position:absolute; left:104px; top:767px; width:663px;
  font-size:48px; font-weight:300; color:#fff; }
.agenda-list { position:absolute; left:907px; top:162px; width:909px; }
.agenda-list li { font-size:40px; line-height:1.35; padding:22px 0;
  border-bottom:1px solid #C6CAC6; }
.agenda-list li .n { color:#0065A8; margin-right:28px; }
```

A light variant swaps the panel fill to `{colors.gray-panel}` with `{colors.ink}` type, keeping the same geometry. Use the dark variant by default.

### Bulleted List (`{components.list-bullet}`)

The workhorse. Used on the plain content list, the 2-column list, and inside list + image / list + sidebar layouts.

```css
.klist { position:absolute; left:104px; top:273px; width:1714px; }
.klist li {
  position:relative; padding-left:36px; margin-bottom:20px;
  font-size:40px; font-weight:400; line-height:1.35; color:#000;
}
.klist li::before {
  content:'\25B8'; position:absolute; left:0; top:0;   /* ▸ */
  color:#C30F3B; font-size:48px; line-height:1.15;
}
.klist li li { font-size:32px; margin-top:14px; }   /* second level */
```

Second-level items indent a further 36px and drop to 32px; the marker color stays crimson. Three levels is the practical maximum. In a 2-column layout the two lists are 817px and 828px wide at x=104 and x=989. A list paired with an image or icon column narrows to 755px (image variant) or 1008px (sidebar variant).

### Blue Box Tiles (`{components.box-tile}`)

A grid of solid blue rectangles, each holding a short lead phrase, with a description paragraph sitting *below* the tile on white.

```
6-box (3 × 2)   tile 474 × 132   x = 109, 725, 1343   y = 288, 632
                lead   (tile.x+2, tile.y+30) 472 × 95    72px / 300 white
                body   (tile.x,   tile.y+132) 474 × 181  40px / 400 black
4-box (2 × 2)   tile 792 × 132   x = 103, 1025        y = 292, 637
                lead / body follow the same +30 / +132 offsets
```

```css
.box-tile { position:absolute; height:132px; background:#0065A8; }
.box-tile .lead { position:absolute; left:2px; top:30px; width:472px;
  font-size:72px; font-weight:300; line-height:1; color:#fff; text-align:center; }
.box-body { position:absolute; font-size:40px; line-height:1.35; color:#000; }
```

Alternate `{colors.blue}` and `{colors.blue-deep}` across the grid if the tiles sit close enough to merge visually. In the multicolor variant, tiles take the categorical ladder instead and the lead becomes a 120px `{typography.box-figure}` numeral — that is the system's metric-tile pattern.

### Multicolor Vertical Panels (`{components.color-panel}`)

Four full-height columns, each a different accent, each holding a short paragraph of white copy.

```
panel  403 × 580 at y = 287,  x = 103, 540, 976, 1413
fills  #0B64A6, #40B2E1, #5080E0, #51438A
text   inset 19px / 22px, 363 × 536, 32px / 400, white
```

This is the clearest use of the categorical ladder. Keep the fills in ladder order left to right — a random color sequence loses the implied progression.

### Icon Block Lists (`{components.block-card}`, `{components.gray-block-card}`)

Two variants, both built as a header zone plus a filled body zone.

**3-up dark blue** — icon zone 539×182 at y=288 (white ground, 130px icon centered at y=315), body zone 539×490 at y=470 filled `{colors.blue-deep}`, heading 36px/500 white at y=540, body 28px white at y=608 inset to 395px. X positions: 109, 693, 1272.

**3-up multicolor** — identical geometry; body zones take `{colors.blue-deep}`, `{colors.green}`, `{colors.orange}` (or any three from the ladder).

**4-up gray** — card 402×650 at y=271 filled `{colors.gray-panel}`, sealed by a 402×13 `{colors.blue-deep}` bar at y=921. Icon 130px at y=305, heading 36px/500 black at y=473, body 28px black at y=540 inset to 315px. X positions: 109, 542, 976, 1409.

```css
.block-card { position:absolute; top:470px; width:539px; height:490px; background:#0B64A6; color:#fff; }
.block-card h3 { position:absolute; left:43px; top:70px; width:455px; font-size:36px; font-weight:500; }
.block-card p  { position:absolute; left:74px; top:138px; width:395px; font-size:28px; line-height:1.45; }
.block-foot    { position:absolute; top:921px; width:402px; height:13px; background:#0B64A6; }
```

Icons should be simple 2px-stroke line glyphs in `{colors.blue}` (or white on a filled ground) at 130×130. Draw them as inline SVG; do not import illustrated or filled icon sets.

### Numbered Block Lists (`{components.numbered-block}`)

Two side-by-side blue panels, each with three numbered rows whose ordinal circles half-overlap the panel's left edge.

```
panel head   797 × 135  at (104, 265) / (1019, 265)   #0B64A6, 40px white heading at +29px
panel body   797 × 561  at (104, 400) / (1019, 400)   #0B64A6
row text     684 × 124  at x+54,  y = 447, 620, 793   32px white
circle       78 × 78    at x-39,  y = 468, 641, 814   white fill, 36px #0B64A6 numeral
```

```css
.num-circle {
  position:absolute; width:78px; height:78px; border-radius:50%;
  background:#fff; color:#0B64A6; font-size:36px;
  display:flex; align-items:center; justify-content:center;
}
```

The half-overlap is the point — the circle must break the panel edge, not sit inside it.

### Horizontal Bars (`{components.horizontal-bar-row}`)

A four-row comparison stack. Each row is a label block on the left and a description on the right, marked by a short blue tick that bleeds off the left edge.

```
row       y = 275, 452, 630, 808        height 160
tick      160 × 7 at (26, row.y + 76)   #0065A8 (alternate rows may drop to #C6CAC6)
label     535 × 141 at (172, row.y + 9)    32px / 400
body     1030 × 141 at (767, row.y + 9)    32px / 400
```

The tick bleeding past x=0 is deliberate — it is the only element besides full-bleed media allowed to leave the stage.

### Timeline (`{components.timeline-rail}`, `{components.timeline-marker}`)

The system's most distinctive content component: a horizontal rail with rounded ends, segmented by date chips, with triangle markers alternating above and below.

```
rail        y = 611, height 49, x = 94 → 1825
  end caps  327 × 49, border-radius 24.5px on the outer side, at x = 94 and x = 1498
  segments  282 × 49, square, at x = 398, 680, 961, 1243
  fills     alternate #0065A8 / #0B64A6
chips       36px / 400 white, centered in each segment, tabular-nums
markers     106 × 69 triangles, #0065A8
  above rail  y = 569, pointing down  → text column at y = 275, 291 × 271
  below rail  y = 635, pointing up    → text column at y = 728, 291 × 240
text        28px / 400 black, 291px wide, aligned to its marker's x
```

```css
.tl-cap-l { position:absolute; left:94px; top:611px; width:327px; height:49px;
  background:#0065A8; border-radius:24.5px 0 0 24.5px; }
.tl-seg   { position:absolute; top:611px; width:282px; height:49px; background:#0B64A6; }
.tl-mark-down {
  position:absolute; top:569px; width:0; height:0;
  border-left:53px solid transparent; border-right:53px solid transparent;
  border-top:69px solid #0065A8;
}
```

Six stops is the designed capacity. Beyond that, split into two timeline slides rather than compressing the segments.

### Sidebar Panels (`{components.sidebar-panel}`)

A 674px full-height panel on the right, from x=1246 to the stage edge, paired with a 1008–1019px content column on the left starting at x=103.

**Blue icon rail** — panel filled `{colors.blue}`; four 130px icons at x=1314, y=171 / 371 / 571 / 771, each with a 32px white label at x=1463, 424px wide.

**Photo quote panel** — panel holds a photograph with a `{colors.scrim}` overlay and a 56px/300 white pull-quote at (1312, 186) 575×649.

When a sidebar is present the slide title and subhead shorten to 1018px wide so they never run beneath the panel.

### Quote Slide (`{components.quote-field}`)

```css
.quote-field { position:absolute; left:0; top:0; width:1920px; height:983px; background:#0065A8; }
.quote-field blockquote {
  position:absolute; left:254px; top:374px; width:1412px;
  font-size:80px; font-weight:300; line-height:1.2; letter-spacing:-0.015em; color:#fff;
}
.quote-field .attr {
  position:absolute; left:254px; top:766px; width:1412px;
  font-size:48px; font-weight:300; color:#fff;
}
```

The light variant inverts to a white field with `{colors.blue}` quote text and a gray attribution, keeping identical geometry. Use ordinary typographic quotation marks — no oversized decorative quote glyph. The blue field itself is the emphasis.

### Closing Slide (`{components.closing-slide}`)

```
statement   (104, 455) 1712 × 140    72px / 300
disclaimer  (103, 676) 1714 × 109    24px / 400, optional, neutral wording only
date        (105, 802) 1712 × 39     24px / 400
```

Available as white-on-`{colors.blue}` (full 1920×983 field) or blue-on-white. Keep the closing statement to a short human phrase — "Thank you", "Questions", or a one-line takeaway.

### Data Table

Not a named source layout, but implied by the system. Build it from the anchor grid:

```css
.ktable { position:absolute; left:104px; top:273px; width:1712px; border-collapse:collapse; }
.ktable th {
  background:#0065A8; color:#fff; font-size:32px; font-weight:400;
  text-align:left; padding:20px 24px;
}
.ktable td { font-size:32px; padding:20px 24px; border-bottom:1px solid #C6CAC6; }
.ktable tbody tr:nth-child(even) { background:rgba(0,101,168,0.06); }
```

Numeric columns get `text-align: right; font-variant-numeric: tabular-nums;`.

## Depth and Elevation

### Flat, With One Depth Move

There are **no shadows, gradients, blurs, or glows** anywhere in this system. Depth is expressed by exactly one move: **fill a rectangle solid `{colors.blue}` and reverse the text to white.** A blue panel on a white slide is the elevated element; a white card on a photograph is the elevated element. Nothing else lifts off the page.

Secondary separation, when a full blue fill would be too heavy, comes from `{colors.gray-panel}` (#E7E6E6) fills and 1px `{colors.gray-line}` hairlines. That is the entire elevation vocabulary: solid blue, solid gray, hairline.

Adding `box-shadow` to a card is the fastest way to make this system look like a generic slide template. Don't.

### The Edge Rule as Spatial Anchor

The 13px blue bar at x=0 does real compositional work: it gives every white slide a hard left terminus, which is what allows the 104px margin to read as a margin rather than as accidental empty space. Slides that drop the edge rule (full blue fields) compensate by having the color itself define the edge.

## Shapes and Treatment

### Border Radius

**Zero**, with two exceptions:
- The timeline rail's end caps (24.5px, i.e. half the 49px rail height).
- The numbered-block ordinal circles (50%).

Everything else — cards, panels, tiles, bars, chips, images, the title card — is a strict rectangle.

### Border and Rule Weights

| Weight | Use |
|---|---|
| 1px `{colors.gray-line}` | Table row dividers, agenda list separators |
| 7px `{colors.blue}` | The horizontal-bar row tick |
| 13px `{colors.blue}` | The global left edge rule, the title card's left bar, the gray card's bottom seal |

There is nothing in between. A 2px or 4px rule reads as a foreign object here. Rules are always solid — never dashed, dotted, or gradient.

### Photography

Photography is a first-class element — the source system is built around science, patient, and workplace imagery. Rules:

- Photographs are full-bleed, half-bleed (960px), or diagonal-clipped. Never inset with a margin, never with a border, never with a radius.
- White text over a photograph requires a `{colors.scrim}` overlay or a directional gradient scrim, or must sit inside a solid white or blue card.
- Images use `object-fit: cover` with a subject-appropriate `object-position`; never stretched.
- No duotone, no blue color-wash, no filters. The imagery stays naturalistic.
- If no photography is available, substitute a solid `{colors.blue}` field. The system reads correctly without images; it does not read correctly with decorative stock illustration.

### Icons

Simple line glyphs at 130×130, 2px stroke, single color — `{colors.blue}` on white grounds, white on filled grounds. Drawn as inline SVG. No filled shapes, no two-tone icons, no rounded "app icon" containers.

## Do's and Don'ts

### Do
- Put the 13px `{colors.blue}` edge rule on every content slide and photo divider.
- Anchor every text block to x=104 and stop every content block at y=983.
- Run every display line at 66px and above at weight 300; everything below stays at 400.
- Use the crimson triangle marker for every bulleted list, at 120% size with a 36px hang.
- Reserve the 97px footer band on every slide and put a neutral legal line plus the slide number in it.
- Reach for a full `{colors.blue}` field for agenda, divider, quote, and closing moments — that inversion is the system's ceremony.
- Alternate `{colors.blue}` and `{colors.blue-deep}` for multi-item sets by default. Reach for `{colors.cyan}` as a third tone, and only go further into the palette when items are genuinely parallel categories that demand it.
- Keep the title lighter than the body: `#404040` heading, `#808080` subhead, `#000000` copy.
- Keep tiles, cards, and panels as strict rectangles with flat fills.
- Let slides be dense. The grid is what keeps a nine-item list or a six-box summary readable.
- Set `font-variant-numeric: tabular-nums` on any numeral series.

### Don't
- Don't add box-shadow, gradient, blur, or glow to anything. The system is flat.
- Don't introduce bold or italic anywhere except the slide number, which is the system's single deliberate bold. Emphasis is size and color only.
- Don't set a black or bold heading over gray body copy. That inverts the system's defining hierarchy.
- Don't uppercase labels or add wide letter-spacing to small text — that is an editorial move, not a clinical one.
- Don't add a second typeface, and don't reach for weight 500. One neo-grotesque, essentially one weight, is the whole system.
- Don't let any element enter the 983–1080 footer band.
- Don't scatter color decoratively. If the items aren't parallel categories, make them all blue.
- Don't try to increase the contrast between `{colors.blue}` and `{colors.blue-deep}`. They are meant to be nearly identical.
- Don't build slides around `{colors.indigo}`, `{colors.purple}`, `{colors.green}`, or `{colors.orange}`. They appear in none of the source layouts.
- Don't use `{colors.crimson}` as a large fill. It is a bullet marker and an emphasis color.
- Don't round corners. The only radii are the timeline caps and the ordinal circles.
- Don't set white text directly on a photograph without a scrim or a card behind it.
- Don't use a 2px or 4px rule. The weights are 1px, 7px, and 13px.
- Don't drift the left margin. Text at x=104; full-width card rows at x=103; card grids at x=109. Nothing else.
- Don't reproduce a real organization's legal, trademark, regulatory, or product-brand text in generated slides. Use neutral placeholder wording.

## Responsive Behavior

This is a **fixed 1920×1080 presentation system** rendered through `deck-stage.js`. There are no media queries, no breakpoints, no fluid units. Every measurement is a fixed pixel.

### Scaling Behavior
`deck-stage.js` wraps each `<section class="slide">` and scales the 1920×1080 canvas uniformly to the viewport, letterboxing or pillarboxing as needed. Type, padding, rule weights, and the 13px edge rule all scale proportionally. At small scales the 14px legal line and the 1px hairlines are the first things to degrade — that is acceptable and matches how the printed original behaves.

### Presenter Behavior
Navigation is delegated to `deck-stage.js`. Each `<section class="slide">` is one frame.

### Print / Export
The fixed-pixel 1920×1080 canvas exports cleanly to 16:9 PDF. The reserved footer band means printed output has correct margin behavior without adjustment. Inter renders reliably at print resolution; if the deck must be printed without network access, self-host Inter or accept the Helvetica/Arial fallback — which is the original house face and degrades gracefully.

### Content Overflow
Because slides are dense by design, verify rendered screenshots for two failure modes specific to this system: (1) a list whose last item crosses y=983 into the footer band, and (2) a sidebar panel overlapping a title that wasn't shortened to 1018px. Both pass naive `scrollHeight` checks.

## CJK & International Content

### Recommended Chinese Pairing

Usefully, the source house style already anticipates this: every text placeholder declares a **light-weight East-Asian companion face** alongside its Latin face, used exclusively for CJK runs. So pairing a light Han grotesque with the Latin system is not an invention here — it is what the original does.

| Role | Chinese Face | Weight | Why |
|---|---|---|---|
| Display (66–120px) | 思源黑体 Noto Sans SC | 300 (Light) | Noto Sans SC's Light cut is the closest Han equivalent to a light neo-grotesque, and it mirrors the source's own light CJK companion face |
| Slide title (52px) | 思源黑体 Noto Sans SC | 400 | Matches Inter Regular's weight and grotesque skeleton |
| Subhead / body / list (28–40px) | 思源黑体 Noto Sans SC | 400 | Single-weight discipline carries over: one Han face, one weight through the middle of the scale |
| Block heading (36px) | 思源黑体 Noto Sans SC | 400 | Same weight as body — as in the Latin system, the heading separates by color and size, not weight |
| Legal (14px) | 思源黑体 Noto Sans SC | 300 | Matches the Latin legal line's light cut |
| Slide number (24px) | 思源黑体 Noto Sans SC | 700 | The system's single bold accent; keep it bold in CJK too |

### Mixed-Content Strategy

Use **Strategy A** — a single unified stack for the whole deck, since Kite is already a single-family system and Noto Sans SC mirrors its weight ladder exactly:

```css
font-family: 'Inter', 'Noto Sans SC', 'Helvetica Neue', Helvetica, Arial, sans-serif;
```

Latin glyphs render in Inter and Han glyphs fall through to Noto Sans SC. Because both are neo-grotesques with similar x-heights and both offer 300/400/500, mixed-script lines stay visually consistent — this system suffers far less mixed-script wobble than a serif-display system would. Watch the 300-weight display tier: Noto Sans SC Light at 90px can look thinner than Inter Light beside it, so bump CJK display runs to 400 if a mixed line looks uneven.

### Loading

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Noto+Sans+SC:wght@300;400;500&display=swap" rel="stylesheet">
```

### Universal CJK Adjustments

These apply to **every CJK block** in this system:

- **Loosen line-height by 0.05–0.10.** Display lines move from 1.05–1.25 to 1.2–1.35; body lines move from 1.35 to 1.5–1.6. Han glyphs are full-width squares and read as cramped at Latin leading.
- **Remove negative letter-spacing on CJK runs.** The -0.01em to -0.03em tracking on 52px+ display collides Han glyphs. Set `letter-spacing: 0`.
- **Never `text-transform: uppercase` on CJK text.** This system uses no uppercase at all, so the risk is low — but don't introduce it.
- **Use Chinese full-width punctuation** (`，。：；！？「」（）`) inside Chinese sentences, not the Latin equivalents.
- **No terminal 。 on CJK headlines or list items.** Body paragraphs keep theirs.
- **Apply Pangu spacing (盘古之白)** between Han characters and adjacent Latin words or digits — `2026 年 5 月`, not `2026年5月`. This matters here because clinical and scientific content mixes Han with Latin abbreviations and numerals constantly.
- **Keep the crimson triangle marker.** It is a geometric glyph, not a Latin one, and reads correctly in CJK lists. Widen the hang from 36px to 40px so it clears the wider Han glyphs.

### Aesthetic Notes for This System

Kite's voice — light-weight neo-grotesque, deep institutional blue, strict grid — translates to Chinese more directly than most systems in this pack, because it is not built on a culturally specific display face. The Chinese pharmaceutical and medical-affairs register uses exactly this vocabulary: Han sans-serif at light-to-regular weight, one corporate blue, dense information, hairline chrome.

The 90px agenda title at weight 300 is the moment to check: Noto Sans SC Light at that size can look under-inked on a saturated blue panel. If it does, move it to weight 400 — you lose a little of the light-cut calm but you keep the legibility, and reversed on blue the weight difference is barely perceptible anyway.

Dense CJK list slides need more vertical air than their Latin equivalents. If a nine-item list overflows y=983 in Chinese, drop the list to 36px rather than tightening the leading — this system tolerates a smaller type size far better than it tolerates crowded leading.

### Known CJK Gap

The small-text tier — the 14px legal line and 24px slide number — is the weak point. Han glyphs at 14px are effectively unreadable at projection distance and near-unreadable on screen at reduced stage scale. For Chinese decks, either raise the legal line to 18px (accepting a slightly heavier footer band) or keep the legal line in Latin while the rest of the deck runs in Chinese, which is common practice in bilingual corporate decks anyway.

## Iteration Guide

1. Any new slide starts from the anchor grid: edge rule at x=0, title at (104, 74), subhead at (104, 142), content from y=273, floor at y=983, footer band below.
2. Any new display line above 52px is weight 300 at a size from the ladder (56 / 66 / 72 / 80 / 90 / 120). Do not invent a size.
3. Any new body line is weight 400 at 28 / 32 / 36 / 40. Card interiors use 28; panels and sidebars use 32; primary lists use 40.
4. Any new list uses the crimson triangle marker with a 36px hang and 40px leading.
5. Any new panel or card is a flat rectangle filled `{colors.blue}` or `{colors.blue-deep}` with white text, or `{colors.gray-panel}` with black text. No third fill pattern.
6. Any new categorical set draws from the ladder in order and never mixes the cool set (`blue-deep / cyan / indigo / purple`) with the warm set (`green / orange / crimson`) in the same row.
7. Any new rule is 1px `{colors.gray-line}`, 7px `{colors.blue}`, or 13px `{colors.blue}`. No other weight.
8. Any new emphasis is achieved with size, `{colors.blue}`, or `{colors.crimson}` — never with a heavier weight.
9. Any new full-field moment (agenda, divider, quote, closing) fills 1920×983 in `{colors.blue}` and leaves the footer band white.
10. When a slide feels crowded, reduce the type size one step on the ladder before you reduce the content. This system is built to carry dense evidence; the grid, not the emptiness, is what makes it readable.

## Known Gaps

- The source house style is Helvetica, with a light cut used only at the extremes of the scale. Inter is the substitute — a very close neo-grotesque with a true 300 cut — but it is not identical: Inter's `a`, `g`, and `R` differ noticeably from Helvetica's, its default tracking is slightly tighter, and it renders optically heavier at large sizes. That last difference is why the 66px+ display tier is specified at 300 here while the source sets it at regular weight. If Helvetica Neue is available locally it will be used via the fallback stack, which is the intended behavior.
- The theme's indigo, purple, green, and orange are carried in the frontmatter for completeness but appear in none of the source layouts. They are effectively untested inside this system; a deck that leans on them will not look like the reference material.
- Icon artwork is not specified beyond "130×130, 2px stroke, single color, inline SVG." The system assumes an icon library exists; generated decks must draw their own glyphs.
- Photography is central to the divider and title layouts but no images ship with this design system. Substitute a solid `{colors.blue}` field when no imagery is supplied.
- The legal / copyright footer is a structural element with no prescribed content. Always use neutral placeholder wording; never reproduce a real organization's legal, trademark, or regulatory text.
- The source deck includes video-content and icon-library layouts that are not translated here. A video slide should be built as a full-bleed or 1712px-wide content region using the standard header and footer chrome.
- There is no chart specification. Build charts inside the content region using the categorical ladder for series colors, `{colors.gray-line}` for 1px gridlines, and 28px labels. Bars are flat rectangles with no radius.
- `{colors.blue}` (#0065A8) and `{colors.blue-deep}` (#0B64A6) are nearly indistinguishable in isolation — the pair only reads as intentional when the two fills are adjacent. Using `{colors.blue-deep}` alone on a slide is functionally identical to using `{colors.blue}`.
- The 14px legal line falls below WCAG's comfortable minimum. It is retained because it is structurally characteristic of the register, but it must never carry information the audience needs.
- The system depends on `deck-stage.js` for canvas scaling and navigation; that runtime is not described here.
