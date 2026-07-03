# Local Presenter Runtime

Every generated Frontend Slides deck must ship as a self-contained local presenter deck. The runtime is browser-only: it uses DOM state and `localStorage`, works from a local file or local static server, and deploys as static files through Vercel. Do not add or reference a project-specific server, private domain, or unauthenticated write endpoint.

## Required Chrome

Place controls outside the 1920x1080 slide stage so the stage remains fixed and exportable.

- Bottom controls are minimal: previous, editable slide count, next, and `E`.
- The first number in the slide count is editable/clickable and jumps to a 1-based visible slide position.
- The total count reflects the currently visible, non-deleted slides.
- Add a progress rail only when the selected visual style needs it; hide it in fullscreen.
- In fullscreen, hide deck controls, progress, active-media status chrome, and the browser cursor over the slide area.

## Keyboard Contract

Implement these shortcuts in every generated deck:

- `ArrowRight`, `ArrowDown`, `PageDown`, `Space`: next slide.
- `ArrowLeft`, `ArrowUp`, `PageUp`, `Backspace`: previous slide.
- `Home` / `End`: first / last visible slide.
- `E`: open or close the slide menu.
- `F`: toggle fullscreen.
- `M`: mute/unmute media only when the deck contains audible video or audio.
- `?`: open a compact help overlay, or close it if open.

Do not trigger navigation shortcuts while focus is inside an input, textarea, select, or contenteditable element. `Space` should pause/resume an active started video instead of advancing when the current slide has a started video.

## Slide Data Attributes

Every generated slide must include stable metadata:

```html
<section
  class="slide"
  data-slide-id="slide-001"
  data-slide-index="0"
  data-title="Opening"
  data-original-skipped="false"
>
  ...
</section>
```

Use `data-original-skipped="true"` only for source slides that should be hidden by default after PPT conversion. For net-new decks, use `false` unless the user explicitly requests skipped/backup slides.

## Slide Menu

The `E` button and `E` key open a modal slide menu. The menu must work entirely in the browser and persist changes only when the user clicks Save.

Required top actions:

- `All`: show all non-deleted slides.
- `Selection`: use the custom selected subset.
- `Save`: persist the current menu state to `localStorage`; style it as active only when all current menu changes are saved.
- `+ Slide`: add a plain text slide after the currently previewed slide, or after the active slide when nothing is previewed.

Localize these labels to the deck language when obvious. For Dutch decks use `Alles aan`, `Selectie`, `Opslaan`, and `+ Slide`.

Required row behavior:

- Render one row per slide with slide number, visibility checkbox, editable title, media/content tags, and delete button.
- Clicking a row previews that slide in the background without saving state.
- Title edits update the menu immediately but persist only on Save.
- Delete hides a slide from all modes; do not allow deleting the last remaining visible slide.
- Show `video` tags for slides with video, `image` tags for image-only slides, and `text` tags for user-added text slides. Do not show a `hidden` tag.
- Keep menu labels, delete buttons, media tags, and progress accents monochrome unless the deck's selected style already requires a stricter accessible variant.

## User Text Slides

The `+ Slide` action creates a user text slide with:

- black background by default;
- text in Space Grotesk Light when that font is loaded, with a clean sans-serif fallback;
- editable text content;
- editable text color;
- editable X and Y position in percentages;
- editable font size in pixels;
- drag handles in the slide menu so user-added text slides can move up or down.

Only user-added text slides are draggable. Original slides keep their order unless the user explicitly asked for a reorder feature.

## Persistence Model

Use a deterministic, presentation-specific storage prefix, for example:

```js
const storagePrefix = `frontend-slides:${document.title || location.pathname}`;
```

Persist these keys only when Save is clicked:

- `visibility-mode`: `all` or `custom`.
- `custom-visible-slides`: boolean array keyed by stable slide id/order.
- `custom-slide-titles`: title map keyed by slide id.
- `deleted-slides`: deleted-state map keyed by slide id.
- `user-text-slides`: array of user-created text slide objects.

Keep unsaved menu edits in memory and show clear dirty/saved state. Browser page-menu edits are local to that browser; do not imply that Vercel or any static host will share them across devices.

## Media Behavior

For decks with native video/audio:

- Media is visible but paused on slide entry by default.
- The next forward action starts the active slide video with audio.
- Space pauses/resumes the active video after it has started.
- `M` toggles mute across active media.
- Videos do not loop unless the slide content explicitly requires it.
- Moving away from a slide pauses and resets that slide's media.
- A video may opt into immediate slide-entry playback with `data-autoplay-on-entry="true"`.

## Static Hosting

Generated decks must work as static files:

- local `open presentation.html` for self-contained decks;
- local static server when relative media paths or browser restrictions require it;
- `scripts/deploy.sh` for Vercel deployment.

Do not include private deployment domains or server-specific save APIs. If a future project needs browser-to-server saves, document it as a separate authenticated admin-token feature, not as the default generated output.

## Handoff Requirements

Before final delivery, verify:

- arrow keys, space, `E`, `F`, and slide-count jump work;
- menu All/Selection/Save state works;
- title edits, delete, and `+ Slide` persist only after Save;
- a reload restores saved menu state from `localStorage`;
- fullscreen hides controls and cursor over the slide area;
- deployed/static output does not reference private domains or non-local save endpoints.
