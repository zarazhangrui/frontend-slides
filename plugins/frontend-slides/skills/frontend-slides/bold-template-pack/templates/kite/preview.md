# Kite Preview Card

Use this small file for title-slide previews only. For final deck generation, read the full design doc listed below.

## Files

- Full design doc: `bold-template-pack/templates/kite/design.md`
- Preview card: `bold-template-pack/templates/kite/preview.md`

## Selection Metadata

- Slug: `kite`
- Tagline: Clinical corporate system in deep blue — one weight of neo-grotesque type, hierarchy carried by gray value, a 13px blue spine down the left edge, and a reserved footnote band.
- Mood: clinical, corporate, institutional, calm, evidence-led, scientific
- Tone: precise, restrained, authoritative, plain-spoken, regulated
- Formality: high
- Density: high
- Scheme: light (white canvas, with full dark-blue field variants for agenda, divider, quote, and closing slides)
- Best for: Biotech and pharmaceutical communication, clinical and scientific data presentations, medical affairs and congress decks, corporate and investor updates in regulated industries, R&D pipeline reviews, and any deck that must carry dense evidence while reading as institutionally credible.
- Avoid for: Consumer brand work, creative or editorial storytelling, playful internal culture decks, and anything that needs warmth or personality — the single-blue discipline and footnote chrome will read as clinical and cold.

## Visual Snapshot

A clinical-corporate presentation system in the register of a life-sciences house style. One neo-grotesque family (Inter, standing in for Helvetica) runs at essentially one weight across the whole scale — light appears only at the extremes (14px legal type, 66px+ display), and bold appears exactly once, on the slide number. Hierarchy is carried by gray value instead, and it runs in a direction most systems invert: a #404040 title sits above a #808080 subhead sits above pure black body copy, so the content is the darkest thing on the slide and its label recedes. A single deep clinical blue (#0065A8) owns the structure: it fills agenda panels, quote fields, block-list bodies, box tiles, and timeline rails, and it appears on every other slide as a 13px full-height bar pinned to the left edge of the stage. A near-identical companion blue (#0B64A6) and one cyan (#40B2E1) are the only other colors in regular use. Every slide reserves a 97px bottom band holding a 14px hairline footer line and a right-aligned slide number, which is what makes the deck read as a document produced inside a regulated industry. Bullets are crimson ▸ triangles hanging 36px from a 40px line — the only warm color on a content slide.

Kite is built for density. Nine-item lists, six-box summaries, and four-stage timelines with text above and below the rail all work, because every element snaps to the same anchors: a 104px left margin, a 1712px content column, a title at y=74, a subhead at y=142, content from y=273, and an absolute floor at y=983. Depth is completely flat — no shadows, no gradients, no rounded corners except the timeline's end caps. Elevation means filling a rectangle solid blue and reversing the text to white.

## Preview Ingredients

- Palette: white #FFFFFF; blue #0065A8; blue-deep #0B64A6; cyan #40B2E1; crimson #C30F3B (bullets only); title #404040; subhead #808080; body #000000; legal #A6A6A6; chrome gray #55565C; panel tint #F2F2F2
- Typography: Inter at weight 400 throughout, 300 at the extremes of the scale (14px, 66px+), 700 on the slide number alone (Helvetica Neue / Helvetica / Arial fallback)
- Signature move: The 13px `{colors.blue}` bar pinned to the left edge of the stage, full height.
- Signature move: The title-slide white card (915×505 at 88,439) floating on a photograph, with its own 13px blue left bar.
- Signature move: A 97px reserved footer band — a 14px light #A6A6A6 legal line at y=1022 and the slide number at (1816, 1005), which is the one bold element in the entire system.
- Signature move: Inverted type hierarchy — #404040 title, #808080 subhead, #000000 body, all at the same weight.
- Signature move: Crimson ▸ triangle bullets at 120% size with a 36px hang.
- Signature move: Strict rectangles and flat fills — elevation is a solid blue block with reversed white text.

## International / CJK Preview Note

- If the preview uses Chinese or other CJK text, keep CJK letter-spacing at 0, loosen line-height, and avoid uppercase transforms on CJK runs.
- Use the full `design.md` CJK section after selection for exact font pairings and script-specific adjustments.

## Preview Rules

- Build exactly one title slide at 1920x1080 inside the fixed-stage model.
- Preserve the palette, type roles, surface rhythm, and decorative vocabulary described above.
- Use the user's real title/subtitle/context; do not copy demo slide content.
- The rendered preview must look like a real first slide, not a template-selection card.
- Never place internal workflow text on the slide: no `preview`, `generated from`, `preview.md`, `template`, `preset`, `style option`, `Option A/B/C`, file names, paths, or source-doc labels.
- Never place the template name or slug on the slide itself; mention it only in the chat message.
- Never place user requirement notes such as desired vibe, audience, or internal-use labels on the slide unless the user explicitly wants those exact words in the deck.
- Use only real deck content for visible chrome: deck title, real section title, date, author, company, page number, or genuine content phrases from the user material.
- Never render a real organization's legal, trademark, or regulatory footer text. Use a neutral placeholder copyright line or the user's own supplied footer string.
- Do not read `template.html` for preview generation.
- Do not read other templates' `design.md` files.
- After the user picks this template for the full deck, read the full design doc before generating final slides.
