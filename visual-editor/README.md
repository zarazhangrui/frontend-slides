# Portable Visual Deck Editor

The Visual Deck Editor is currently incubated inside Frontend Slides rather than published as a separate project.

This is intentional. The editor's strongest proving ground is real generated decks: fixed-stage HTML presentations with local assets, authored motion, and a clean `index.html` handoff. Keeping it here for now lets the runtime mature against practical decks before it becomes a standalone repository.

## Current Role

- Bundled into generated Frontend Slides decks by default.
- Activated after draft generation through the edit toggle or `E` key.
- Edits text, media, visual boxes, simple shapes, font choices, layout, and entrance motion.
- Saves a clean, portable `index.html` with editor chrome and temporary detection markers removed.
- Works without npm, a framework, a backend, or a cloud account.

## Stable Contract

The editor should stay deck-neutral but not pretend to be a generic web page builder.

- Input: a fixed-stage HTML deck using `#deckStage` or `.deck-stage`, `.slide`, and 1920x1080 stage coordinates.
- Detection: infer editable text, media, SVG/canvas content, and shape-like boxes from ordinary DOM first.
- Hints: treat `data-editable`, `data-editable-media`, and `data-editable-box` as optional improvements, not requirements.
- Storage: derive browser draft keys from file identity rather than a deck-specific project name.
- Output: preserve the deck as a portable folder with root `index.html` and relative assets.

## Extraction Path

The editor should become its own GitHub repository only after these are true:

1. Its integration contract is stable enough to document as an API.
2. At least two demo decks outside the main Frontend Slides flow can use it.
3. Basic browser regression checks cover detection, drag/move, media replacement, undo/redo, reset, and clean save/export.
4. The runtime can be consumed by this fork as a bundled file or release artifact without copying unrelated skill code.

Until then, editor changes belong in this fork. When editor behavior changes, update this document, `SKILL.md`, the plugin copy of `SKILL.md`, `html-template.md`, and the plugin copy of `html-template.md` together.

## Out Of Scope For Now

- A general website/page builder.
- A cloud editing product with accounts or hosted storage.
- Exact PowerPoint animation import. The editor can edit authored HTML entrance motion, but exact PPT animation fidelity belongs to the PPT extraction pipeline.
