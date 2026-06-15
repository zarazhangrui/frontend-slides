# Visual Deck Editor Runtime Contract

The Visual Deck Editor is a built-in runtime capability for generated Frontend Slides decks.

This directory contains the fixed Visual Deck Editor runtime and its contract. Generated decks should copy or reference this runtime; they should not regenerate a fresh editor implementation per deck.

## Current Status

The editor is a repo-local runtime, not a separate npm package or application.

What exists today:

- `editor-runtime.css` contains the fixed editor UI, selection, guide, modal, and motion-preview styles.
- `editor-runtime.js` injects the fixed editor shell and exposes `FrontendSlidesEditor.mount(...)`.
- Generated decks include these runtime files in their portable output folder and mount them from `index.html`.
- `html-template.md` defines how generated decks must wire this fixed runtime.
- This document defines the runtime contract and maintenance boundaries.
- The plugin copy keeps the same contract for installed Claude Code plugin users.

What this directory is not:

- It is not an npm package.
- It is not a separate web app.
- It is not a claim that the editor can run on arbitrary HTML pages.

## Runtime Goals

- Work on generated fixed-stage HTML decks.
- Keep the final deck portable: root `index.html` plus relative local assets.
- Infer editable objects from normal slide DOM where possible.
- Treat explicit `data-editable*` attributes as optional hints, not hard requirements.
- It keeps editor-generated state temporary and removes editing chrome from saved/exported HTML.
- It avoids npm, backend services, hosted storage, user accounts, and framework lock-in.

## Current Role

- Bundled as local runtime files in generated Frontend Slides decks by default.
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
- Output: preserve the deck as a portable folder with root `index.html`, relative assets, and local `visual-editor/editor-runtime.*` files.

## Maintenance Rules

- Keep behavior aligned with `html-template.md`.
- Keep this root document and the plugin copy in sync.
- Treat `editor-runtime.css` and `editor-runtime.js` as the source of truth for editor behavior.
- Do not inline a newly generated editor into individual decks.
- Do not broaden claims beyond the fixed-stage deck contract without implementation and verification.
- If editor implementation is later packaged separately, update this document to describe the new layout.

## Out Of Scope For Now

- A general website/page builder.
- A cloud editing product with accounts or hosted storage.
- Arbitrary HTML page editing.
- Exact PowerPoint animation import. The editor can edit authored HTML entrance motion, but exact PPT animation fidelity belongs to the PPT extraction pipeline.
