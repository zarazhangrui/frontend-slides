---
name: frontend-slides
description: Create stunning, animation-rich HTML presentations from scratch or by converting PowerPoint files. Use when the user wants to build a presentation, convert a PPT/PPTX to web, or create slides for a talk/pitch. Helps non-designers discover their aesthetic through visual exploration rather than abstract choices.
---

# Frontend Slides

Create zero-dependency, animation-rich HTML presentations that run entirely in the browser.

## Distillery Defaults (READ FIRST)

This is a Distillery-customized fork of the skill. The following defaults apply to **every** deck unless the user explicitly opts out:

1. **House style is the Distillery Brand preset.** See [DISTILLERY_BRAND.md](DISTILLERY_BRAND.md). Treat it as the default style and only generate the 3-preview style picker if the user says they want a non-Distillery look.
2. **Default author identity** for any contact block, byline, or "presenting myself" slide:
   - Name: **Francisco Maurici**
   - Role: **Head of Delivery Department**
   - Email: **[francisco.maurici@distillery.com](mailto:francisco.maurici@distillery.com)** — use this exact `mailto:` markup whenever an email is shown.
   - Headshot: `assets/fran-maurici.png` (already in the repo)
3. **Always ask the deck's goal first** — sales proposal, head-of-department deck, internal team update, conference talk, training, or other. The goal shapes tone, slide count, and which template archetypes (T1–T9 in DISTILLERY_BRAND.md) to use.
4. **Always offer a "presenting myself" intro slide** as slide 2 (after the cover). Use template T7 from DISTILLERY_BRAND.md with Fran's headshot.

These three questions (goal, intro slide, content) are the new Phase 1 — see below.

## When to Use This Skill vs. `frontend-design`

This skill is one of two surfaces Distillery uses for HTML output. Pick the right one before you start:

| If the user wants…                                                          | Use this skill        |
| --------------------------------------------------------------------------- | --------------------- |
| Slide deck, presentation, sales proposal, conference talk, training content | **`frontend-slides`** (this one) |
| Bento landing page, animated marketing site, single-page scrolling site, hero + sections + cards layout | **`frontend-design`** |
| Component gallery, motion library, dashboard-style page                     | **`frontend-design`** |

**Defining traits of a slide deck (this skill):**
- Page-by-page; each "slide" is a discrete unit at exactly `100vh`
- Keyboard navigation (arrow keys advance)
- Designed to be presented or exported to PDF
- Reads top-to-bottom one screen at a time, not as a continuous scroll

**Defining traits of a bento site (`frontend-design`):**
- Continuous scroll, sections of varying heights
- Bento-grid layouts (asymmetric tiles, mixed sizes)
- Lots of inline animation, scroll-driven effects, micro-interactions
- Designed for the web, not for projection or PDF
- Reference Distillery example: `/Users/distillery/Documents/Decks/distillery-motion-library/index.html`

**If unsure, ask the user:** "Is this a slide deck (page-by-page, keyboard navigation, exportable to PDF) or a scrolling site (bento, landing page, marketing)?"

## Core Principles

1. **Zero Dependencies** — Single HTML files with inline CSS/JS. No npm, no build tools.
2. **Show, Don't Tell** — Generate visual previews, not abstract choices. People discover what they want by seeing it.
3. **Distinctive Design** — No generic "AI slop." Every presentation must feel custom-crafted.
4. **Viewport Fitting (NON-NEGOTIABLE)** — Every slide MUST fit exactly within 100vh. No scrolling within slides, ever. Content overflows? Split into multiple slides.

## Design Aesthetics

You tend to converge toward generic, "on distribution" outputs. In frontend design, this creates what users call the "AI slop" aesthetic. Avoid this: make creative, distinctive frontends that surprise and delight.

Focus on:

- Typography: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics.
- Color & Theme: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes. Draw from IDE themes and cultural aesthetics for inspiration.
- Motion: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions.
- Backgrounds: Create atmosphere and depth rather than defaulting to solid colors. Layer CSS gradients, use geometric patterns, or add contextual effects that match the overall aesthetic.

Avoid generic AI-generated aesthetics:

- Overused font families (Inter, Roboto, Arial, system fonts)
- Cliched color schemes (particularly purple gradients on white backgrounds)
- Predictable layouts and component patterns
- Cookie-cutter design that lacks context-specific character

Interpret creatively and make unexpected choices that feel genuinely designed for the context. Vary between light and dark themes, different fonts, different aesthetics. You still tend to converge on common choices (Space Grotesk, for example) across generations. Avoid this: it is critical that you think outside the box!

## Viewport Fitting Rules

These invariants apply to EVERY slide in EVERY presentation:

- Every `.slide` must have `height: 100vh; height: 100dvh; overflow: hidden;`
- ALL font sizes and spacing must use `clamp(min, preferred, max)` — never fixed px/rem
- Content containers need `max-height` constraints
- Images: `max-height: min(50vh, 400px)`
- Breakpoints required for heights: 700px, 600px, 500px
- Include `prefers-reduced-motion` support
- Never negate CSS functions directly (`-clamp()`, `-min()`, `-max()` are silently ignored) — use `calc(-1 * clamp(...))` instead

**When generating, read `viewport-base.css` and include its full contents in every presentation.**

### Content Density Limits Per Slide

| Slide Type    | Maximum Content                                           |
| ------------- | --------------------------------------------------------- |
| Title slide   | 1 heading + 1 subtitle + optional tagline                 |
| Content slide | 1 heading + 4-6 bullet points OR 1 heading + 2 paragraphs |
| Feature grid  | 1 heading + 6 cards maximum (2x3 or 3x2)                  |
| Code slide    | 1 heading + 8-10 lines of code                            |
| Quote slide   | 1 quote (max 3 lines) + attribution                       |
| Image slide   | 1 heading + 1 image (max 60vh height)                     |

**Content exceeds limits? Split into multiple slides. Never cram, never scroll.**

### Layout Discipline — Don't Waste Space

Distillery decks have a strict bias toward **paired layouts** (text + visual, or column-vs-column). Centered single-column slides are the exception, not the default.

| If the slide has…                                                          | Use this template                |
| -------------------------------------------------------------------------- | -------------------------------- |
| ≤4 short bullets or 1–2 paragraphs                                         | **T10 Split** (text + visual)    |
| "X vs Y" content (in scope vs out of scope, before/after, option A vs B)   | **T11 Compare** (mandatory)      |
| 5–6 cards / features                                                       | T5 (3-up cards) or 2×3 grid      |
| 1 pull quote                                                               | T3                               |
| 2–4 large numbers                                                          | T6 (stats)                       |
| 1 image filling the slide                                                  | Image slide with `.image-photo` or `.image-diagram` |

**T10 vary-the-side rule:** when the deck uses T10 multiple times, alternate `.split` and `.split.reverse` so the visual side flips between left and right. Never put the visual on the same side three slides in a row.

**Forbidden:** centered single-column with empty space above/below the bullets. If the content is sparse, the right answer is to add a visual (T10) — not to leave the slide empty.

### Icons — Lucide

The skill ships with a curated subset of [Lucide](https://lucide.dev) icons in `assets/icons/`. They are the **only** icon system the skill should use; do not hand-draw or invent SVG icons.

**Available icons** (~30): `arrow-right`, `check`, `x`, `chevron-right`, `circle`, `square`, `triangle`, `shield`, `zap`, `cpu`, `database`, `cloud`, `users`, `user`, `mail`, `phone`, `calendar`, `clock`, `target`, `trending-up`, `bar-chart-3`, `pie-chart`, `lock`, `key`, `code`, `terminal`, `layers`, `settings`, `search`, `plus`.

**How to use** — paste the SVG inline so it inherits `currentColor` (no CDN, no build step):

```html
<!-- Read assets/icons/check.svg and inline its <svg> markup -->
<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
     stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M20 6 9 17l-5-5"/>
</svg>
```

The `.icon` class (defined in `viewport-base.css`) gives consistent sizing (`clamp(18px, 1.6vw, 24px)`), `currentColor` stroke, and stroke-width 1.6 for a minimalist look. Use `.icon.lg` (~32px) for card headlines and `.icon.xl` (~48px) for hero callouts.

**Need an icon that isn't in the curated set?** Pull it from `https://lucide.dev/icons/<name>` and add the SVG to `assets/icons/`. Stay minimalist — don't grab outline+filled variants of the same shape.

**Where to use icons:**
- Card headers (one icon per card, top-left of the card)
- Numbered/lettered list markers (replace bullet squares with topic-relevant icons)
- Inline emphasis in flows (security pillars, capability matrix, role rows)
- Section dividers (large `.icon.xl` next to the section number)

**Where NOT to use icons:**
- Decorating every paragraph (kills hierarchy)
- Replacing typography that should be a real heading
- As a substitute for a chart when numbers should speak

### Charts — ApexCharts

Distillery decks use [ApexCharts](https://apexcharts.com) (MIT, CDN, no build step) for any data visualization. Load the runtime once in `<head>`:

```html
<script src="https://cdn.jsdelivr.net/npm/apexcharts@4.4.0/dist/apexcharts.min.js"></script>
```

**When to add a chart (not optional):**
- The slide compares **≥3 numeric values** → use a chart, not a bullet list of numbers
- The slide shows a trend over time → line/area chart
- The slide breaks down a total (cost mix, role mix, time mix) → donut chart
- The slide tracks a single KPI (NPS, accuracy %, uptime) → radial chart

**When NOT to add a chart:** when the slide already conveys the comparison visually (e.g. T11 compare with matching shapes), when there are only 2 numbers (use T6 stats instead), or when the data is qualitative.

**Theme palette** — every chart uses these colors against the dark slide:

```js
const distilleryChartTheme = {
  chart: { background: 'transparent', foreColor: '#ffffff' },
  colors: ['#61E9EE', '#19B8E8', '#5070E1', '#124EC6', '#C621EF'],
  grid:   { borderColor: 'rgba(255,255,255,0.10)' },
  legend: { labels: { colors: '#ffffff' } },
  dataLabels: { style: { colors: ['#0B2051'] } },
  tooltip: { theme: 'dark' },
};
```

**Four ready-to-paste presets** (drop the runtime in `<head>`, then in a slide):

```js
// 1. Horizontal bar — categorical comparison (e.g. role costs)
new ApexCharts(document.querySelector('#chart-bar'), {
  ...distilleryChartTheme,
  chart: { ...distilleryChartTheme.chart, type: 'bar', height: 360, toolbar: { show: false } },
  series: [{ name: 'Weeks', data: [3, 6, 4, 2] }],
  xaxis:  { categories: ['Discovery','Build','Pilot','Hardening'] },
  plotOptions: { bar: { horizontal: true, borderRadius: 4, barHeight: '60%' } },
  dataLabels: { enabled: true, formatter: (v) => v + 'w' },
}).render();

// 2. Donut — proportion of a whole (e.g. role mix)
new ApexCharts(document.querySelector('#chart-donut'), {
  ...distilleryChartTheme,
  chart: { ...distilleryChartTheme.chart, type: 'donut', height: 320 },
  series: [40, 25, 20, 15],
  labels: ['Engineering','Design','PM','QA'],
  plotOptions: { pie: { donut: { size: '68%' } } },
  legend:   { position: 'bottom' },
}).render();

// 3. Area — trend over time
new ApexCharts(document.querySelector('#chart-area'), {
  ...distilleryChartTheme,
  chart: { ...distilleryChartTheme.chart, type: 'area', height: 320, toolbar: { show: false } },
  series: [{ name: 'Adoption', data: [12, 28, 41, 58, 72, 84] }],
  xaxis:  { categories: ['W1','W2','W3','W4','W5','W6'] },
  stroke: { curve: 'smooth', width: 2 },
  fill:   { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05 } },
}).render();

// 4. Radial — single KPI
new ApexCharts(document.querySelector('#chart-radial'), {
  ...distilleryChartTheme,
  chart: { ...distilleryChartTheme.chart, type: 'radialBar', height: 320 },
  series: [87],
  labels: ['Accuracy'],
  plotOptions: { radialBar: { hollow: { size: '64%' }, dataLabels: { name: { color: '#fff' }, value: { color: '#61E9EE', fontSize: '2rem' } } } },
}).render();
```

Charts always render inside the visual side of a T10 split or as a single full-width chart on a dedicated data slide.

### Image Rendering — Avoid the White-Rectangle Bug

Image frames are the #1 source of visual bugs in Distillery decks. The rule is simple:

- **Photos / screenshots** → `class="image-photo"` (transparent background, subtle border + shadow)
- **Diagrams / architecture renders** → `class="image-diagram"` (dark plate that blends with the slide)
- **Centered logos** → `class="slide-image logo"`

**NEVER** set `background: white` (or `var(--d-white)`) on an image frame on a dark slide. With `object-fit: contain`, an image smaller than its frame will leave the frame's white background showing — a bordered rectangle that doesn't match the image. This is the bug to watch for in Mode C enhancement work; if you find it, replace with `.image-diagram`.

If a source diagram has a white background baked in: either re-export with a transparent background, or accept the dark plate from `.image-diagram` — never paint the frame white.

See `html-template.md` "Image Placement" for full CSS.

---

## Phase 0: Detect Mode

Determine what the user wants:

- **Mode A: New Presentation** — Create from scratch. Go to Phase 1.
- **Mode B: PPT Conversion** — Convert a .pptx file. Go to Phase 4.
- **Mode C: Enhancement** — Improve an existing HTML presentation. Read it, understand it, enhance. **Follow Mode C modification rules below.**

### Mode C: Modification Rules

When enhancing existing presentations, viewport fitting is the biggest risk:

1. **Before adding content:** Count existing elements, check against density limits
2. **Adding images:** Must have `max-height: min(50vh, 400px)`. If slide already has max content, split into two slides
3. **Adding text:** Max 4-6 bullets per slide. Exceeds limits? Split into continuation slides
4. **After ANY modification, verify:** `.slide` has `overflow: hidden`, new elements use `clamp()`, images have viewport-relative max-height, content fits at 1280x720
5. **Proactively reorganize:** If modifications will cause overflow, automatically split content and inform the user. Don't wait to be asked

**When adding images to existing slides:** Move image to new slide or reduce other content first. Never add images without checking if existing content already fills the viewport.

---

## Phase 1: Content Discovery (New Presentations)

**Ask ALL questions in a single AskUserQuestion call** so the user fills everything out at once. The first question (Goal) is mandatory — its answer drives tone, slide count, and template selection in DISTILLERY_BRAND.md.

**Question 1 — Goal** (header: "Goal", REQUIRED):
What is the goal of this deck? This shapes the structure and tone. Options:

- **Sales proposal** — external client, persuasive, pricing/scope/timeline. Use templates T1, T7 (intro), T4, T5, T6, T8.
- **Head-of-department deck** — internal leadership update, status + asks. Use T1, T2, T6, T9, T8.
- **Internal team update** — same-team status, lighter chrome, can use the light-paper variant (T9).
- **Conference talk** — external audience, narrative-driven, fewer words per slide. Use T1, T3, T4, T8.
- **Training / onboarding** — instructional, more density allowed. Use T1, T4, T5, T9.
- **Other** — ask the user to describe the goal in one sentence.

**Question 2 — Intro slide** (header: "Intro", REQUIRED):
Should I include a "presenting myself" intro slide as slide 2? Options:

- **Yes** — Insert template T7 (people slide) using `assets/fran-maurici.png`, name "Francisco Maurici", role "Head of Delivery Department", email `francisco.maurici@distillery.com`. Bio is one sentence the user provides or a sensible default ("Leading delivery at Distillery, helping technical leaders ship purpose-fit projects.").
- **No** — Skip the intro slide; deck starts straight with content after the cover.

**Question 3 — Length** (header: "Length"):
Approximately how many slides? Options: Short 5-10 / Medium 10-20 / Long 20+

**Question 4 — Content** (header: "Content"):
Do you have content ready? Options: All content ready / Rough notes / Topic only

**Question 5 — Inline Editing** (header: "Editing"):
Do you need to edit text directly in the browser after generation? Options:

- "Yes (Recommended)" — Can edit text in-browser, auto-save to localStorage, export file
- "No" — Presentation only, keeps file smaller

**Remember the user's editing choice — it determines whether edit-related code is included in Phase 3. Remember the goal — it determines which T1–T9 templates to mix.**

If user has content, ask them to share it.

### Step 1.1: Confirm contact details

If the deck includes any contact block (sales proposals, closing slides, intro slide), default to:

| Field   | Value                                                            |
| ------- | ---------------------------------------------------------------- |
| Name    | Francisco Maurici                                                |
| Role    | Head of Delivery Department                                      |
| Email   | `[francisco.maurici@distillery.com](mailto:francisco.maurici@distillery.com)` |
| Photo   | `assets/fran-maurici.png`                                        |

Only ask the user to confirm if the deck is being delivered by someone other than Fran.

### Step 1.2: Image Evaluation (if images provided)

If user selected "No images" → skip to Phase 2.

If user provides an image folder:

1. **Scan** — List all image files (.png, .jpg, .svg, .webp, etc.)
2. **View each image** — Use the Read tool (Claude is multimodal)
3. **Evaluate** — For each: what it shows, USABLE or NOT USABLE (with reason), what concept it represents, dominant colors
4. **Co-design the outline** — Curated images inform slide structure alongside text. This is NOT "plan slides then add images" — design around both from the start (e.g., 3 screenshots → 3 feature slides, 1 logo → title/closing slide)
5. **Confirm via AskUserQuestion** (header: "Outline"): "Does this slide outline and image selection look right?" Options: Looks good / Adjust images / Adjust outline

**Logo in previews:** If a usable logo was identified, embed it (base64) into each style preview in Phase 2 — the user sees their brand styled three different ways.

---

## Phase 2: Style Discovery

**This is the "show, don't tell" phase.** Most people can't articulate design preferences in words.

### Step 2.0: Style Path

For Distillery decks, the **Distillery Brand** preset is the default. Ask (header: "Style"):

- "Use Distillery Brand (recommended)" — DEFAULT. Locked to [DISTILLERY_BRAND.md](DISTILLERY_BRAND.md). Skip directly to Phase 3.
- "Show me options" — Generate 3 previews based on mood (only if the user wants a non-Distillery look)
- "I know what I want" — Pick from preset list directly

**If the user picks "Use Distillery Brand":** Skip steps 2.1–2.3 entirely. Read [DISTILLERY_BRAND.md](DISTILLERY_BRAND.md) and proceed to Phase 3.

**If direct selection of a non-Distillery preset:** Show preset picker and skip to Phase 3. Available presets are defined in [STYLE_PRESETS.md](STYLE_PRESETS.md).

### Step 2.1: Mood Selection (Guided Discovery)

Ask (header: "Vibe", multiSelect: true, max 2):
What feeling should the audience have? Options:

- Impressed/Confident — Professional, trustworthy
- Excited/Energized — Innovative, bold
- Calm/Focused — Clear, thoughtful
- Inspired/Moved — Emotional, memorable

### Step 2.2: Generate 3 Style Previews

Based on mood, generate 3 distinct single-slide HTML previews showing typography, colors, animation, and overall aesthetic. Read [STYLE_PRESETS.md](STYLE_PRESETS.md) for available presets and their specifications.

| Mood                | Suggested Presets                                  |
| ------------------- | -------------------------------------------------- |
| Impressed/Confident | Bold Signal, Electric Studio, Dark Botanical       |
| Excited/Energized   | Creative Voltage, Neon Cyber, Split Pastel         |
| Calm/Focused        | Notebook Tabs, Paper & Ink, Swiss Modern           |
| Inspired/Moved      | Dark Botanical, Vintage Editorial, Pastel Geometry |

Save previews to `.claude-design/slide-previews/` (style-a.html, style-b.html, style-c.html). Each should be self-contained, ~50-100 lines, showing one animated title slide.

Open each preview automatically for the user.

### Step 2.3: User Picks

Ask (header: "Style"):
Which style preview do you prefer? Options: Style A: [Name] / Style B: [Name] / Style C: [Name] / Mix elements

If "Mix elements", ask for specifics.

---

## Phase 3: Generate Presentation

Generate the full presentation using content from Phase 1 (text, or text + curated images) and style from Phase 2.

If images were provided, the slide outline already incorporates them from Step 1.2. If not, CSS-generated visuals (gradients, shapes, patterns) provide visual interest — this is a fully supported first-class path.

**Before generating, read these supporting files:**

- [html-template.md](html-template.md) — HTML architecture and JS features
- [viewport-base.css](viewport-base.css) — Mandatory CSS (include in full)
- [animation-patterns.md](animation-patterns.md) — Animation reference for the chosen feeling
- **If style = Distillery Brand:** also read [DISTILLERY_BRAND.md](DISTILLERY_BRAND.md) in full. Its colors, type scale, layout chrome, arc motif, and templates T1–T9 are mandatory.

**Distillery deck assembly rules:**

- Slide 1 is always template T1 (cover) — eyebrow shows the deck goal in uppercase (e.g. `SALES PROPOSAL · 2026`).
- Slide 2 is template T7 (presenting myself) **only if** the user said yes in Phase 1 Q2. Use `assets/fran-maurici.png`, name "Francisco Maurici", role "Head of Delivery Department", email `[francisco.maurici@distillery.com](mailto:francisco.maurici@distillery.com)`.
- Last slide is always template T8 (closing) with Fran's contact block.
- Section dividers (T2) every 4–6 content slides.
- Every slide must include the layered curved-arcs SVG and the logo top-left + page number bottom-right (see DISTILLERY_BRAND.md → Layout Anatomy).

**Key requirements:**

- Single self-contained HTML file, all CSS/JS inline
- Include the FULL contents of viewport-base.css in the `<style>` block
- Use fonts from Fontshare or Google Fonts — never system fonts (for Distillery: Hanken Grotesk + Inter Tight from Google Fonts)
- Any displayed email **must** use `[francisco.maurici@distillery.com](mailto:francisco.maurici@distillery.com)` rendered as a real `<a href="mailto:...">` link
- Add detailed comments explaining each section
- Every section needs a clear `/* === SECTION NAME === */` comment block

---

## Phase 4: PPT Conversion

When converting PowerPoint files:

1. **Extract content** — Run `python scripts/extract-pptx.py <input.pptx> <output_dir>` (install python-pptx if needed: `pip install python-pptx`)
2. **Confirm with user** — Present extracted slide titles, content summaries, and image counts
3. **Style selection** — Proceed to Phase 2 for style discovery
4. **Generate HTML** — Convert to chosen style, preserving all text, images (from assets/), slide order, and speaker notes (as HTML comments)

---

## Phase 5: Delivery

1. **Clean up** — Delete `.claude-design/slide-previews/` if it exists
2. **Open** — Use `open [filename].html` to launch in browser
3. **Summarize** — Tell the user:
   - File location, style name, slide count
   - Navigation: Arrow keys, Space, scroll/swipe, click nav dots
   - How to customize: `:root` CSS variables for colors, font link for typography, `.reveal` class for animations
   - If inline editing was enabled: Hover top-left corner or press E to enter edit mode, click any text to edit, Ctrl+S to save

---

## Phase 6: Share & Export (Optional)

After delivery, **ask the user:** _"Would you like to share this presentation? I can deploy it to a live URL (works on any device including phones) or export it as a PDF."_

Options:

- **Deploy to URL** — Shareable link that works on any device
- **Export to PDF** — Universal file for email, Slack, print
- **Both**
- **No thanks**

If the user declines, stop here. If they choose one or both, proceed below.

### 6A: Deploy to a Live URL (Vercel)

This deploys the presentation to Vercel — a free hosting platform. The link works on any device (phones, tablets, laptops) and stays live until the user takes it down.

**If the user has never deployed before, guide them step by step:**

1. **Check if Vercel CLI is installed** — Run `npx vercel --version`. If not found, install Node.js first (`brew install node` on macOS, or download from https://nodejs.org).

2. **Check if user is logged in** — Run `npx vercel whoami`.
   - If NOT logged in, explain: _"Vercel is a free hosting service. You need an account to deploy. Let me walk you through it:"_
     - Step 1: Ask user to go to https://vercel.com/signup in their browser
     - Step 2: They can sign up with GitHub, Google, email — whatever is easiest
     - Step 3: Once signed up, run `vercel login` and follow the prompts (it opens a browser window to authorize)
     - Step 4: Confirm login with `vercel whoami`
   - Wait for the user to confirm they're logged in before proceeding.

3. **Deploy** — Run the deploy script:

   ```bash
   bash scripts/deploy.sh <path-to-presentation>
   ```

   The script accepts either a folder (with index.html) or a single HTML file.

4. **Share the URL** — Tell the user:
   - The live URL (from the script output)
   - That it works on any device — they can text it, Slack it, email it
   - To take it down later: visit https://vercel.com/dashboard and delete the project
   - The Vercel free tier is generous — they won't be charged

**⚠ Deployment gotchas:**

- **Local images/videos must travel with the HTML.** The deploy script auto-detects files referenced via `src="..."` in the HTML and bundles them. But if the presentation references files via CSS `background-image` or unusual paths, those may be missed. **Before deploying, verify:** open the deployed URL and check that all images load. If any are broken, the safest fix is to put the HTML and all its assets into a single folder and deploy the folder instead of a standalone HTML file.
- **Prefer folder deployments when the presentation has many assets.** If the presentation lives in a folder with images alongside it (e.g., `my-deck/index.html` + `my-deck/logo.png`), deploy the folder directly: `bash scripts/deploy.sh ./my-deck/`. This is more reliable than deploying a single HTML file because the entire folder contents are uploaded as-is.
- **Filenames with spaces work but can cause issues.** The script handles spaces in filenames, but Vercel URLs encode spaces as `%20`. If possible, avoid spaces in image filenames. If the user's images have spaces, the script handles it — but if images still break, renaming files to use hyphens instead of spaces is the fix.
- **Redeploying updates the same URL.** Running the deploy script again on the same presentation overwrites the previous deployment. The URL stays the same — no need to share a new link.

### 6B: Export to PDF

This captures each slide as a screenshot and combines them into a PDF. Perfect for email attachments, embedding in documents, or printing.

**Note:** Animations and interactivity are not preserved — the PDF is a static snapshot. This is normal and expected; mention it to the user so they're not surprised.

1. **Run the export script:**

   ```bash
   bash scripts/export-pdf.sh <path-to-html> [output.pdf]
   ```

   If no output path is given, the PDF is saved next to the HTML file.

2. **What happens behind the scenes** (explain briefly to the user):
   - A headless browser opens the presentation at 1920×1080 (standard widescreen)
   - It screenshots each slide one by one
   - All screenshots are combined into a single PDF
   - The script needs Playwright (a browser automation tool) — it will install automatically if missing

3. **If Playwright installation fails:**
   - The most common issue is Chromium not downloading. Run: `npx playwright install chromium`
   - If that fails too, it may be a network/firewall issue. Ask the user to try on a different network.

4. **Deliver the PDF** — The script auto-opens it. Tell the user:
   - The file location and size
   - That it works everywhere — email, Slack, Notion, Google Docs, print
   - Animations are replaced by their final visual state (still looks great, just static)

**⚠ PDF export gotchas:**

- **First run is slow.** The script installs Playwright and downloads a Chromium browser (~150MB) into a temp directory. This happens once per run. Warn the user it may take 30-60 seconds the first time — subsequent exports within the same session are faster.
- **Slides must use `class="slide"`.** The export script finds slides by querying `.slide` elements. If the presentation uses a different class name, the script will report "0 slides found" and fail. All presentations generated by this skill use `.slide`, so this only matters for externally-created HTML.
- **Local images must be loadable via HTTP.** The script starts a local server and loads the HTML through it (so Google Fonts and relative image paths work). If images use absolute filesystem paths (e.g., `src="/Users/name/photo.png"`) instead of relative paths (e.g., `src="photo.png"`), they won't load. Generated presentations always use relative paths, but converted or user-provided decks might not — check and fix if needed.
- **Local images appear in the PDF** as long as they are in the same directory as (or relative to) the HTML file. The export script serves the HTML's parent directory over HTTP, so relative paths like `src="photo.png"` resolve correctly — including filenames with spaces. If images still don't appear, check: (1) the image files actually exist at the referenced path, (2) the paths are relative, not absolute filesystem paths like `/Users/name/photo.png`.
- **Large presentations produce large PDFs.** Each slide is captured as a full 1920×1080 PNG screenshot. An 18-slide deck can produce a ~20MB PDF. If the PDF exceeds 10MB, ask the user: _"The PDF is [size]. Would you like me to compress it? It'll look slightly less sharp but the file will be much smaller."_ If yes, re-run the export with the `--compact` flag:
  ```bash
  bash scripts/export-pdf.sh <path-to-html> [output.pdf] --compact
  ```
  This renders at 1280×720 instead of 1920×1080, typically cutting file size by 50-70% with minimal visual difference.

---

## Supporting Files

| File                                               | Purpose                                                              | When to Read              |
| -------------------------------------------------- | -------------------------------------------------------------------- | ------------------------- |
| [DISTILLERY_BRAND.md](DISTILLERY_BRAND.md)         | Mandatory Distillery brand spec — colors, type, arcs, templates T1–T9 | Phase 3 (Distillery decks) |
| [STYLE_PRESETS.md](STYLE_PRESETS.md)               | Curated visual presets (Distillery Brand + 12 alternatives)          | Phase 2 (style selection) |
| [viewport-base.css](viewport-base.css)             | Mandatory responsive CSS — copy into every presentation              | Phase 3 (generation)      |
| [html-template.md](html-template.md)               | HTML structure, JS features, code quality standards                  | Phase 3 (generation)      |
| [animation-patterns.md](animation-patterns.md)     | CSS/JS animation snippets and effect-to-feeling guide                | Phase 3 (generation)      |
| [assets/distillery-logo.png](assets/distillery-logo.png) | Full-color Distillery logo                                      | Phase 3 (Distillery decks) |
| [assets/fran-maurici.png](assets/fran-maurici.png) | Default headshot for the "presenting myself" intro slide             | Phase 3 (intro slide)     |
| [scripts/extract-pptx.py](scripts/extract-pptx.py) | Python script for PPT content extraction                             | Phase 4 (conversion)      |
| [scripts/deploy.sh](scripts/deploy.sh)             | Deploy slides to Vercel for instant sharing                          | Phase 6 (sharing)         |
| [scripts/export-pdf.sh](scripts/export-pdf.sh)     | Export slides to PDF                                                 | Phase 6 (sharing)         |
