---
name: frontend-slides
description: Create stunning, animation-rich HTML presentations from scratch or by converting PowerPoint files. Use when the user wants to build a presentation, convert a PPT/PPTX to web, or create slides for a talk/pitch. Helps non-designers discover their aesthetic through visual exploration rather than abstract choices.
---

# Frontend Slides

Create zero-dependency, animation-rich HTML presentations that run entirely in the browser.

## Core Principles

1. **Zero Dependencies** — Single HTML files with inline CSS/JS. No npm, no build tools.
2. **Show, Don't Tell** — Generate visual previews, not abstract choices. People discover what they want by seeing it.
3. **Distinctive Design** — No generic "AI slop." Every presentation must feel custom-crafted.
4. **Progressive Disclosure** — Read lightweight style indexes first. For bold templates, use small preview cards for style previews and load the full `design.md` only after the user picks that template.
5. **Fixed 16:9 Stage (NON-NEGOTIABLE)** — Every deck uses a 1920×1080 slide canvas scaled as a whole to the viewport. Slides must stay 16:9 on every screen, including phones. Do not reflow slide content to fit the device.

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

## Fixed Stage Rules

These invariants apply to EVERY slide in EVERY presentation:

- Every deck has a viewport wrapper that fills the browser window.
- Every slide is authored inside a fixed 1920×1080 stage.
- The stage scales uniformly to fit the viewport. It may letterbox/pillarbox; it must not re-layout content.
- Do not use responsive breakpoints to rearrange slide content for phones.
- Use fixed internal slide measurements at the 1920×1080 design size.
- Slide visibility must be controlled by `.active` / `.visible` using `visibility`, `opacity`, and `pointer-events` from `viewport-base.css`. Do not use `display: none` / `display: block` for slide switching; later layout classes such as `.slide-content { display: flex; }` can override them and make every slide visible at once.
- Use `clamp()` only for non-slide UI outside the stage, or for small fallback previews where a full stage is impractical.
- Include `prefers-reduced-motion` support
- Never negate CSS functions directly (`-clamp()`, `-min()`, `-max()` are silently ignored) — use `calc(-1 * clamp(...))` instead

**When generating, read `viewport-base.css` and include its full contents in every presentation.**

### Content Density Modes

Ask the user whether this is primarily a reading deck or a speaking deck, then design around that answer:

| Density mode | Best for | Design behavior |
| ------------- | -------- | --------------- |
| **Low density / speaker-led** | Public talks, keynote-style sharing, live explanation | One idea per slide, large type, strong visual hierarchy, generous negative space, 1-3 bullets max, more slides if needed |
| **High density / reading-first** | Reports, handouts, async review, detailed internal docs | More self-contained slides, structured grids/tables/annotations, 4-8 bullets or 4-6 cards when readable, tighter but still intentional spacing |

Baseline limits still apply: no scrolling, no overflow, no overlapping panels, and no text below comfortable reading size. If content exceeds the selected density mode, split it into more slides instead of shrinking until it becomes cramped.

---

## Phase 0: Detect Mode

Determine what the user wants:

- **Mode A: New Presentation** — Create from scratch. Go to Phase 1.
- **Mode B: PPT Conversion** — Convert a .pptx file. Go to Phase 4.
- **Mode C: Enhancement** — Improve an existing HTML presentation. Read it, understand it, enhance. **Follow Mode C modification rules below.**

### Mode C: Modification Rules

When enhancing existing presentations, fixed-stage fitting is the biggest risk:

1. **Before adding content:** Count existing elements, check against density limits
2. **Adding images:** Fit them inside the 1920×1080 slide canvas. If slide already has max content, split into two slides
3. **Adding text:** Max 4-6 bullets per slide. Exceeds limits? Split into continuation slides
4. **After ANY modification, verify:** the slide stage remains 16:9, no text overflows its card, no panels overlap, and screenshots look correct at 1280×720 plus one phone viewport
5. **Proactively reorganize:** If modifications will cause overflow, automatically split content and inform the user. Don't wait to be asked

**When adding images to existing slides:** Move image to a new slide or reduce other content first. Never add images without checking if existing content already fills the 1920×1080 slide stage.

---

## Phase 1: Content Discovery (New Presentations)

**Ask ALL questions together** so the user fills everything out at once. If the current environment provides a native structured-question UI, use it; otherwise ask in one concise message with clearly numbered choices:

**Question 1 — Purpose** (header: "Purpose"):
What is this presentation for? Options: Pitch deck / Teaching-Tutorial / Conference talk / Internal presentation

**Question 2 — Length** (header: "Length"):
Approximately how many slides? Options: Short 5-10 / Medium 10-20 / Long 20+

**Question 3 — Content** (header: "Content"):
Do you have content ready? Options: All content ready / Rough notes / Topic only

**Question 4 — Density** (header: "Density"):
How dense should the deck feel? Options:

- "Low density / speaker-led" — Big ideas, fewer words, more visual breathing room
- "High density / reading-first" — More self-contained detail for async reading

**Do not ask about inline editing during Phase 1.** Users should not have to choose editing behavior before seeing a draft. Inline editing is a post-draft affordance: include it by default unless the user explicitly asks for a locked/export-only file.

**Slide count calibration:** the user's length answer is a ceiling, not a target — match the deck size to actual content volume:

| Content volume | Recommended deck size |
| -------------- | --------------------- |
| Thin source (tagline + a handful of one-line features + a few stats) | 5-10 slides |
| Product page with detailed sections, demos, FAQ | 10-15 slides |
| Rich documentation, multi-chapter talk, dense report | 15-25 slides |

Generating N nearly-empty slides to hit the requested count is a defect: a dense 8-slide deck beats a sparse 20-slide deck every time. The Phase 3.5 audit enforces this — a deck-wide average fill below 50% means the content does not justify the slide count and slides must be merged.

Remember the user's density choice. It affects slide count, typography scale, amount of text per slide, layout density, and whether to favor cinematic presenter slides or self-contained reading slides.

If user has content, ask them to share it.

### Step 1.2: Image Evaluation (if images provided)

If user selected "No images" → skip to Phase 2.

If user provides an image folder:

1. **Scan** — List all image files (.png, .jpg, .svg, .webp, etc.)
2. **Inspect each image** — Use the agent's available image-understanding capability. If image reading is unavailable, use filenames/metadata and ask the user to clarify only when needed
3. **Evaluate** — For each: what it shows, USABLE or NOT USABLE (with reason), what concept it represents, dominant colors
4. **Co-design the outline** — Curated images inform slide structure alongside text. This is NOT "plan slides then add images" — design around both from the start (e.g., 3 screenshots → 3 feature slides, 1 logo → title/closing slide)
5. **Confirm the outline** using the same structured-question mechanism when available: "Does this slide outline and image selection look right?" Options: Looks good / Adjust images / Adjust outline

**Logo in previews:** If a usable logo was identified, embed it (base64) into each style preview in Phase 2 — the user sees their brand styled three different ways.

---

## Phase 2: Style Discovery

**This is the "show, don't tell" phase.** Most people can't articulate design preferences in words.

### Step 2.0: Generate 3 Style Previews Directly

Based on purpose, audience, mood, and content density, generate 3 distinct single-slide HTML previews showing typography, colors, animation, and overall aesthetic.

Do not ask the user whether they want options or a preset picker. The default discovery experience is always visual comparison.

If the user already gave a vibe, use it. If they did not, infer the likely mood from the occasion, audience, content, and stakes. Keep the options diverse enough that the user can react visually instead of needing to articulate taste up front.

If the user explicitly names a preset or bold template, honor that as one option and generate the remaining preview slots around it.

Read [STYLE_PRESETS.md](STYLE_PRESETS.md) for safe preset candidates. If [bold-template-pack/selection-index.json](bold-template-pack/selection-index.json) exists, read that compact index too, but do not read any `design.md` files yet.

| Mood                | Suggested Presets                                  |
| ------------------- | -------------------------------------------------- |
| Impressed/Confident | Bold Signal, Electric Studio, Dark Botanical       |
| Excited/Energized   | Creative Voltage, Neon Cyber, Split Pastel         |
| Calm/Focused        | Notebook Tabs, Paper & Ink, Swiss Modern           |
| Inspired/Moved      | Dark Botanical, Vintage Editorial, Pastel Geometry |

**Preview mix rules:**

- Generate 3 previews by default: 1 safe preset from `STYLE_PRESETS.md`, at least 1 bold template from `bold-template-pack/selection-index.json`, and 1 wildcard.
- The wildcard may be either a second bold template or a self-generated custom design. Choose whichever creates the strongest, most useful contrast for the user's occasion, audience, mood, and content.
- Do not force every expressive option to come from the template library. If the brief has a sharper, more specific design opportunity than the available templates, use the wildcard slot to design freely.
- For conservative or high-stakes decks, make the safe preset especially restrained; choose a calm, higher-formality bold template; make the wildcard either another restrained template or a custom design that feels authoritative rather than decorative.
- For expressive decks, keep the safe preset as a readable fallback; choose one strong bold template; make the wildcard adventurous, context-specific, and clearly different from both other previews.
- If bold template matches feel weak, use the wildcard as a custom design or fall back to another safe preset instead of forcing a template.

**Custom wildcard design rules:**

- Follow the Design Aesthetics section above: no generic "AI slop", no default font/color/layout choices, no purple-gradient-on-white clichés, no cookie-cutter dashboard/card look.
- Match the user's stated occasion, audience, mood/vibe, and content density. The custom design should feel authored for this deck, not merely "stylish."
- Make a deliberate visual thesis: distinctive typography, a committed palette, a recognizable layout system, and one strong atmospheric or graphic device.
- Keep it feasible for a full deck. The preview must imply a design system that can expand into section, content, quote, comparison, and closing slides.
- Use fixed 1920×1080 stage rules and pass the same preview authenticity checks as every other option.
- Never render "custom", "wildcard", "AI-generated", or design-process labels on the slide itself.

**Bold template selection rules:**

- Match user purpose and mood against `mood`, `tone`, `best_for`, `avoid_for`, `formality`, `density`, and `scheme`.
- Treat `best_for` examples as soft signals, not strict industry filters.
- Keep the three previews genuinely different from each other.
- After choosing bold template candidate(s), read only those candidate(s)' `preview.md` files from the `preview_md` paths in the selection index.
- Use `preview.md` only for title-slide previews. Do not read full `design.md` files until the user picks the final template.
- Do not read or copy `template.html` unless the selected final `design.md` is missing a critical implementation detail.

**Preview authenticity rules (NON-NEGOTIABLE):**

- Every style preview must look like a real first slide from the user's deck, not a diagnostic card.
- Never render internal workflow text on a slide: no `preview`, `generated from`, `preview.md`, `template`, `preset`, `style option`, `Option A/B/C`, file names, paths, or source-doc labels.
- Never render template names or slug names on the slide itself. Template/style names belong only in the message to the user.
- Never render user requirement notes as slide content, such as "sharp and provocative", "safe option", "bold option", "for internal sharing", or "audience: ...", unless the user explicitly wants that exact phrase to appear in the deck.
- If the slide needs chrome, use real deck chrome only: the deck title, section title, date, author, company, page number, or a genuine content phrase from the user's material.
- Before opening previews, inspect the visible text and revise if any internal metadata appears.

Save previews to `.frontend-slides/slide-previews/` (style-a.html, style-b.html, style-c.html). Each should be self-contained and compact, showing one animated title slide.

Open each preview automatically for the user.

### Step 2.1: User Picks

Ask (header: "Style"):
Which style preview do you prefer? Options: Style A: [Name] / Style B: [Name] / Style C: [Name] / Mix elements

If "Mix elements", ask for specifics.

---

## Phase 3: Generate Presentation

Generate the full presentation using content from Phase 1 (text, or text + curated images) and style from Phase 2.

If images were provided, the slide outline already incorporates them from Step 1.2. If not, CSS-generated visuals (gradients, shapes, patterns) provide visual interest — this is a fully supported first-class path.

Apply the user's density choice throughout the deck:

- **Low density / speaker-led:** Use more slides with fewer ideas per slide. Favor large headings, short phrases, visual metaphors, section beats, quote/statement slides, and presenter-friendly pacing.
- **High density / reading-first:** Make slides more self-contained. Use structured grids, comparison tables, annotated diagrams, captions, and concise explanatory copy. Keep hierarchy strong so it feels designed, not like a document pasted onto slides.

If the user's stated needs are mixed, choose the closer of the two modes instead of inventing a middle option: live audience persuasion defaults low-density; async circulation or detailed review defaults high-density.

Never let high density become visual clutter. If a high-density slide starts to overflow, split it or redesign it into a clearer structure.

If the user selected a bold template from `bold-template-pack`, read that one template's full `design.md` before generating. Do not read the other bold templates. Treat `design.md` as the design recipe:

- Preserve its fonts, palette, decorative vocabulary, spacing rhythm, and component grammar.
- Generate the final deck as a fixed 1920×1080 stage scaled uniformly to the viewport, regardless of whether the source template originally used `deck-stage.js` or viewport-fluid CSS.
- Treat viewport-fluid values in `design.md` as design proportions to translate into 1920×1080 stage coordinates. Do not keep them as live viewport reflow rules in the final deck.
- Keep the output as a single self-contained Frontend Slides HTML file.
- Do not copy demo slide content or mimic the source template too literally.
- Use `template.html` only as a last-resort implementation reference for the selected template.
- After generating, verify both content overflow and panel overlap in rendered browser screenshots. `scrollHeight` checks alone are not enough because grid panels can visually cover each other.

If the user selected a self-generated custom wildcard, treat that preview's CSS and layout as the design recipe:

- Preserve its fonts, palette, decorative vocabulary, spacing rhythm, grid logic, and component grammar.
- Expand the same visual system across the full deck. Do not switch to a preset or bold template after the user has chosen the custom direction.
- Design any missing slide layouts from that system rather than importing patterns from another style.
- Keep the output fixed-stage, single-file, and visually verified like every other deck.

**Before generating, read these supporting files:**

- [html-template.md](html-template.md) — HTML architecture and JS features
- [viewport-base.css](viewport-base.css) — Mandatory CSS (include in full)
- [animation-patterns.md](animation-patterns.md) — Animation reference for the chosen feeling

**Key requirements:**

- Single self-contained HTML file, all CSS/JS inline
- Include the FULL contents of viewport-base.css in the `<style>` block
- Use fonts from Fontshare or Google Fonts — never system fonts
- Add detailed comments explaining each section
- Every section needs a clear `/* === SECTION NAME === */` comment block

**Layout quality rules (mandatory):**

These encode real defects observed in generated decks. The Phase 3.5 audit catches them mechanically, but avoid creating them in the first place:

- **No floating navigation controls over the slide stage.** Fixed-position Prev/Next/counter bars collide with the slide chrome at the bottom edge. Slide chrome already carries pagination; keyboard, swipe, and click-zone navigation are sufficient. If controls are kept anyway, they must sit entirely in the letterbox area outside the scaled stage.
- **Watch CSS rule order.** A more specific layout rule placed after a shared rule silently overrides it (e.g., a per-slide-type `justify-content: center` overriding the shared rule). Keep exactly one canonical layout rule per slide type.
- **Stage centering:** with `transform-origin: 0 0`, never combine `translate(-50%, -50%)` with `scale()` — the percentages resolve against the element's unscaled size and the stage lands off-center. Position the scaled stage with computed left/top offsets, exactly as in [html-template.md](html-template.md).
- **Every chrome slide needs a dominant element.** A chrome slide without a large headline reads as empty regardless of the fill ratio. If a slide only holds small elements (e.g., stat cards), add the section headline above them.

**Vertical rhythm rules (universal proportion system):**

These apply to every slide type, regardless of content volume, text length, or typeface. The goal: every slide of the deck breathes with the same spacing logic, so the deck reads as one designed object.

- **One gap value per deck.** Pick a single title-to-content gap (72px at the 1920×1080 stage is a proven default) and apply it to every slide — chrome and chromeless alike. Never let one slide use 24px while another uses 48px; inconsistent gaps are the #1 reason a deck feels "off" even when each slide alone looks acceptable.
- **Compact centered block, never stretched.** Group title + content as ONE block, vertically centered, with the fixed gap between elements. The margins above and below the block must be roughly symmetric. NEVER distribute title to the top edge and content to the bottom edge (`justify-content: space-between` on the title/content container): that punches a mid-slide hole whose size varies with content, so every slide ends up with a differently-sized void.
- **Fill by grouping or scaling, never by distributing.** If a slide feels empty: increase type sizes, merge content from adjacent slides, or add a section headline. Never stretch elements apart to occupy height — gaps are for separating related things, not for filling space.
- **Same rhythm across slide types.** Cover, statement, feature grids, stat cards, quote, end slide: all use the same vertical gap logic. A deck where feature slides breathe one way and quote slides another reads as assembled, not designed.
- **The audit enforces this mechanically:** `scripts/audit-deck.py` measures the title-to-content gap on every slide and flags decks whose gaps are inconsistent (see Phase 3.5).

---

## Phase 3.5: Automated Layout Audit (MANDATORY)

Never deliver a presentation without running the audit:

```bash
python scripts/audit-deck.py <path-to-presentation.html>
```

The script loads the deck in headless Chromium and checks every slide for:

- Content overflow (text clipped by slide bounds)
- Text-on-text overlap between sibling elements
- Fixed-position chrome colliding with the slide stage
- 16:9 stage ratio and viewport centering
- Vertical fill ratio per slide and deck-wide (empty-space detection)
- Vertical rhythm: gap consistency between major blocks across the whole deck (one deck-wide gap value)

**Delivery gate:** the audit must exit 0 with zero critical issues. Fix the deck and re-run until it passes. Do not eyeball screenshots as a substitute — run the script.

**Warnings:** every warning (e.g., a slide below 40% fill) must be either fixed — bigger type, more content per slide, or merge slides — or explicitly justified as a breathing slide (cover, statement, quote, chapter divider, end). A deck-wide average fill below 50% means the content does not justify the slide count: go back to Phase 3 and merge slides.

---

## Phase 4: PPT Conversion

When converting PowerPoint files:

1. **Extract content** — Run `python scripts/extract-pptx.py <input.pptx> <output_dir>` (install python-pptx if needed: `pip install python-pptx`)
2. **Confirm with user** — Present extracted slide titles, content summaries, and image counts
3. **Style selection** — Proceed to Phase 2 for style discovery
4. **Generate HTML** — Convert to chosen style, preserving all text, images (from assets/), slide order, and speaker notes (as HTML comments)

---

## Phase 5: Delivery

1. **Clean up** — Delete `.frontend-slides/slide-previews/` if it exists
2. **Open** — Use `open [filename].html` to launch in browser
3. **Summarize** — Tell the user:
   - File location, style name, slide count
   - Navigation: Arrow keys, Space, swipe/tap if enabled
   - How to customize: `:root` CSS variables for colors, font link for typography, `.reveal` class for animations
   - Inline text editing is available: Hover top-left corner or press E to enter edit mode, click any text to edit, Ctrl+S to save
   - Offer the natural post-draft actions: ask for revisions, edit text directly in the browser, or export/share

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

### 6B: Export to PDF and PowerPoint

Capture every slide as a 1920×1080 screenshot and assemble a PDF (one page per slide) and/or a PowerPoint (one slide per screenshot). Perfect for email, printing, sharing, or giving a slide deck to someone who uses PowerPoint.

**Note:** Animations and interactivity are not preserved — exports are static snapshots. PowerPoint slides are images, so text is not natively editable there. Both are normal and expected; mention it so the user isn't surprised.

The recommended, cross-platform script (Python) handles **both formats** and works identically on macOS, Linux, and Windows:

```bash
python scripts/export-deck.py <path-to-html>                 # PDF + PPTX beside the HTML
python scripts/export-deck.py <path-to-html> --pdf           # PDF only
python scripts/export-deck.py <path-to-html> --pptx          # PPTX only
python scripts/export-deck.py <path-to-html> --compact       # 1280x720, smaller files
python scripts/export-deck.py <path-to-html> --out <dir>     # explicit output directory
```

**Requirements** (Python): `pip install playwright pillow python-pptx pymupdf`, then `python -m playwright install chromium`. If Playwright's Chromium fails to download, it may be a network/firewall issue.

A legacy bash/Node export (`scripts/export-pdf.sh`) is also shipped for PDF-only environments that prefer it, but the Python script is preferred.

**Automatic integrity check:** `export-deck.py` verifies after capture that every slide is a distinct image. If two captures are identical (a real bug where a PDF end up showing the first slide on every page), the export refuses to assemble and fails.

**Verify the result:** after exporting, confirm the PDF/PPTX is not broken:

```bash
python scripts/verify-export.py <file.pdf|file.pptx> [expected_count]
```

This reports the page/slide count and confirms the pages are genuinely distinct (PyMuPDF for PDF, python-pptx for PPTX). Always run it before delivery.

**⚠ Export gotchas:**

- **Slides must use `class="slide"`.** The export finds slides via `.slide` elements. All decks generated by this skill use it; externally-created HTML may not.
- **Local images must be loadable via HTTP.** The script serves the HTML's parent directory over HTTP (so Google Fonts and relative assets work) — it should never use absolute `file://` paths.
- **Large presentations produce large files.** Use `--compact` (1280×720) to cut size by roughly 50-70% with minimal visual difference.
- **Output file may be locked.** If the target PDF/PPTX already exists and is open in a viewer, saving fails with "Permission denied". Close the file first, or pick another output with `--out`.

---

## Supporting Files

| File                                               | Purpose                                                              | When to Read              |
| -------------------------------------------------- | -------------------------------------------------------------------- | ------------------------- |
| [STYLE_PRESETS.md](STYLE_PRESETS.md)               | 12 curated visual presets with colors, fonts, and signature elements | Phase 2 (style selection) |
| [bold-template-pack/selection-index.json](bold-template-pack/selection-index.json) | Compact bold template metadata for candidate selection | Phase 2 (style selection) |
| [bold-template-pack/templates/*/preview.md](bold-template-pack/templates/) | Lightweight style cards for shortlisted bold title previews | Phase 2 after shortlisting |
| [bold-template-pack/templates/*/design.md](bold-template-pack/templates/) | Detailed design-system docs for the selected bold template only | Phase 3 after user selection |
| [viewport-base.css](viewport-base.css)             | Mandatory fixed-stage CSS — copy into every presentation             | Phase 3 (generation)      |
| [html-template.md](html-template.md)               | HTML structure, JS features, code quality standards                  | Phase 3 (generation)      |
| [animation-patterns.md](animation-patterns.md)     | CSS/JS animation snippets and effect-to-feeling guide                | Phase 3 (generation)      |
| [scripts/extract-pptx.py](scripts/extract-pptx.py) | Python script for PPT content extraction                             | Phase 4 (conversion)      |
| [scripts/audit-deck.py](scripts/audit-deck.py)     | Automated layout audit (overflow, overlap, chrome collision, fill)   | Phase 3.5 (mandatory)    |
| [scripts/deploy.sh](scripts/deploy.sh)             | Deploy slides to Vercel for instant sharing                          | Phase 6 (sharing)         |
| [scripts/export-deck.py](scripts/export-deck.py)   | Export slides to PDF and PPTX (Python, cross-platform)               | Phase 6 (sharing)         |
| [scripts/verify-export.py](scripts/verify-export.py) | Verify exported PDF/PPTX (page count + distinct pages)              | Phase 6 (sharing)         |
| [scripts/export-pdf.sh](scripts/export-pdf.sh)     | Legacy bash/Node export slides to PDF                                | Phase 6 (sharing)         |
