# Kite Preview Card

Use this small file for title-slide previews only. For final deck generation, read the full design doc listed below.

## Files

- Full design doc: `bold-template-pack/templates/kite/design.md`
- Preview card: `bold-template-pack/templates/kite/preview.md`

## Selection Metadata

- Slug: `kite`
- Tagline: Clinical corporate system in deep blue — light neo-grotesque type, a 13px blue spine down the left edge, and a reserved footnote band.
- Mood: clinical, corporate, institutional, calm, evidence-led, scientific
- Tone: precise, restrained, authoritative, plain-spoken, regulated
- Formality: high
- Density: high
- Scheme: light (white canvas, with full dark-blue field variants for agenda, divider, quote, and closing slides)
- Best for: Biotech and pharmaceutical communication, clinical and scientific data presentations, medical affairs and congress decks, corporate and investor updates in regulated industries, R&D pipeline reviews, and any deck that must carry dense evidence while reading as institutionally credible.
- Avoid for: Consumer brand work, creative or editorial storytelling, playful internal culture decks, and anything that needs warmth or personality — the single-blue discipline and footnote chrome will read as clinical and cold.

## Visual Snapshot

A clinical-corporate presentation system in the register of a life-sciences house style. One neo-grotesque family (Inter, standing in for Helvetica) runs at weight 300 for every display moment and 400 for body — there is no bold weight anywhere. A single deep clinical blue (#0065A8) owns the structure: it fills agenda panels, quote fields, block-list bodies, box tiles, and timeline rails, and it appears on every other slide as a 13px full-height bar pinned to the left edge of the stage. A six-hue accent ladder (cyan, indigo, purple, green, crimson, orange) exists only for categorical coding. Every slide reserves a 97px bottom band holding a 14px hairline footer line and a right-aligned slide number, which is what makes the deck read as a document produced inside a regulated industry. Bullets are crimson ▸ triangles hanging 36px from a 40px line.

Kite is built for density. Nine-item lists, six-box summaries, and four-stage timelines with text above and below the rail all work, because every element snaps to the same anchors: a 104px left margin, a 1712px content column, a title at y=74, a subhead at y=142, content from y=273, and an absolute floor at y=983. Depth is completely flat — no shadows, no gradients, no rounded corners except the timeline's end caps. Elevation means filling a rectangle solid blue and reversing the text to white.

## Preview Ingredients

- Palette: white #FFFFFF; blue #0065A8; blue-deep #0B64A6; cyan #40B2E1; indigo #5080E0; purple #51438A; green #71BC51; crimson #C30F3B; orange #F26B43; gray #55565C; gray-panel #E7E6E6
- Typography: Inter at weights 300 / 400 / 500 only (Helvetica Neue / Arial fallback)
- Signature move: The 13px `{colors.blue}` bar pinned to the left edge of the stage, full height.
- Signature move: The title-slide white card (915×505 at 88,439) floating on a photograph, with its own 13px blue left bar.
- Signature move: A 97px reserved footer band — 14px gray legal line at y=1022, slide number at (1816, 1005).
- Signature move: Display type at weight 300 only; no bold weight exists in the system.
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
