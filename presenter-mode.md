# Presenter Mode (Phase 1)

Google Slides-style presenter view for HTML presentations: a second window shows speaker notes, next-slide preview, timer, and counter while the original window displays the slide to the audience.

## When to Include

**Default: include in every generated presentation.** Runtime cost is ~12KB inline JS+CSS, and presenter mode is dormant until the user presses `P`. No opt-in required.

Skip only if the user explicitly says "no presenter mode" or "smallest possible file".

## Phase 1 Scope

**In:**

- Two-window setup (audience + presenter), opened by pressing `P`
- BroadcastChannel sync, **bidirectional** — any window's navigation propagates to every other window (websocket-like pub/sub)
- Current + next slide preview (live iframe thumbnails)
- Speaker notes panel (scrollable, font-resizable)
- Elapsed timer (start / pause / reset)
- Slide counter (current / total)
- Single-window fallback when popup is blocked

**Out (deferred to later phases):**

- Blackout / whiteout toggle
- Pen / laser pointer
- Auto-advance / timed slides
- Q&A integration
- PDF notes export

## Data Model — Speaker Notes

Notes live as a semantic element inside each slide, **not as HTML comments**:

```html
<section class="slide">
  <h1>Title</h1>
  <p>Content</p>
  <aside class="speaker-notes" hidden>
    What to say while this slide is up. Multi-paragraph supported. Use plain
    text or basic HTML (em, strong, br).
  </aside>
</section>
```

Why `<aside hidden>`:

- `hidden` ensures notes never render in audience or normal modes
- Queryable from JS (unlike HTML comments)
- Survives round-trips through tools that strip comments
- Semantic — notes ARE supplementary content, which is what `<aside>` means

**For PPT conversions:** When `extract-pptx.py` outputs speaker notes, place them inside `<aside class="speaker-notes" hidden>` rather than HTML comments.

## URL Roles

The same HTML file behaves differently based on the `?role=` query parameter:

| Role             | Behavior                                                                                        |
| ---------------- | ----------------------------------------------------------------------------------------------- |
| (none) `normal`  | Standard view: slide + keyboard nav, no presenter UI. Also participates in sync.                |
| `audience`       | Same as `normal` but chrome hidden (cursor, hint, nav dots). Set visually via CSS class, not URL. |
| `presenter`      | Renders the presenter shell (current+next previews, notes, timer, counter)                      |
| `audience-frame` | Used by iframes inside presenter — shows ONE slide, no UI; pair with `&slide=N` to pick a slide |

**Note:** In this implementation the URL is never mutated via `history.replaceState` — all displays load at `?role=normal` and visually switch to audience mode by toggling CSS classes on `<body>` in response to a `presenter-opened` message. This avoids the classic bug where the original window's script had already finished dispatch by the time `P` was pressed, leaving no channel listener wired.

## Sync Protocol — BroadcastChannel

**Channel name:** `slides-sync-<HASH>` where HASH is `document.title` slugified. This isolates multiple presentations open in the same browser.

**Messages (bidirectional — any window can send or receive):**

| type               | payload         | trigger                                                   |
| ------------------ | --------------- | --------------------------------------------------------- |
| `goto`             | `{ slide: N }`  | any window's current slide changes (via the controller's `onChange` hook) |
| `presenter-opened` | `{}`            | presenter window finishes init — audience replies with its current `goto` so presenter catches up |
| `presenter-closed` | `{}`            | sent on `beforeunload` of presenter                       |

**Echo prevention:** `BroadcastChannel` does not deliver a message to its own sender (per spec), so a window never hears its own broadcasts. For the ping-pong case between two peers (A broadcasts → B navigates → B's IO fires → B broadcasts → A receives), the receiving side guards with `if (slide !== currentSlide) goTo(slide)` — once both windows are on the same slide, further `goto` messages are no-ops and the loop terminates.

## Activation Flow

1. User in normal mode presses `P`
2. JS calls `window.open(location.pathname + '?role=presenter', 'presenter', 'width=1280,height=800')`
3. If the call returns a window reference, the original window keeps its URL unchanged and waits for a `presenter-opened` message
4. Presenter window initializes, then:
   - Emits `presenter-opened`
   - Renders slide 0 in its shell
5. Original window receives `presenter-opened`, toggles `role-normal` → `role-audience` CSS class (hides cursor/hints), and replies with its current slide via `goto`
6. Presenter receives the reply and catches up if the user had already navigated past slide 0
7. Sync begins — **any window can drive navigation**. Navigating in the presenter window moves the audience; navigating in the audience window (keyboard, tap zones, swipe) moves the presenter's current+next previews and notes
8. When the user closes the presenter window, `beforeunload` emits `presenter-closed` → audience window toggles back to `role-normal`

## Presenter View Layout

```
┌─────────────────────────────┬──────────────────────┐
│                             │  NEXT  (slide N+1)    │
│                             │  [iframe thumbnail]   │
│   CURRENT  (slide N)        │                       │
│   [iframe live preview]     ├──────────────────────┤
│                             │  ⏱ 12:34    3 / 24   │
│                             │  [pause] [reset]      │
├─────────────────────────────┴──────────────────────┤
│  📝 Speaker Notes                                   │
│  (scrollable, A+ / A− to resize)                    │
└────────────────────────────────────────────────────┘
```

CSS Grid:

```css
.presenter-shell {
  display: grid;
  grid-template-columns: 65fr 35fr;
  grid-template-rows: minmax(0, 1fr) auto minmax(160px, 30vh);
  grid-template-areas:
    "current next"
    "current meta"
    "notes   notes";
  gap: 12px;
  padding: 12px;
  height: 100vh;
  background: #0f0f10;
  color: #e8e8e8;
  font-family: ui-sans-serif, system-ui, sans-serif;
}
.presenter-current {
  grid-area: current;
}
.presenter-next {
  grid-area: next;
}
.presenter-meta {
  grid-area: meta;
}
.presenter-notes {
  grid-area: notes;
  overflow-y: auto;
  padding: 16px 24px;
  line-height: 1.6;
}

.presenter-current iframe,
.presenter-next iframe {
  width: 100%;
  height: 100%;
  border: 0;
  border-radius: 8px;
  background: #000;
}
```

**Why iframes for thumbnails:** loading the same file with `?role=audience-frame&slide=N` lets the slide render at full fidelity. The iframe's viewport units (`vw`/`vh`) resolve against the iframe's own box, so `clamp()` sizes content correctly at thumbnail scale — no manual transform/scale math needed, and the existing viewport-base.css rules just work.

## Keyboard

All displays (normal, audience, presenter) accept navigation input — every keystroke that moves a slide broadcasts a `goto` to the other windows.

| Key                          | Normal / Audience        | Presenter                |
| ---------------------------- | ------------------------ | ------------------------ |
| `←` `↑` `PgUp`               | prev (broadcast)         | prev (broadcast)         |
| `→` `↓` `Space` `PgDn`       | next (broadcast)         | next (broadcast)         |
| `Home` `End`                 | first / last (broadcast) | first / last (broadcast) |
| `P`                          | open presenter / dismiss fallback | (no-op)         |
| `Esc`                        | (none)                   | close presenter window   |
| `+` `=`                      | (none)                   | increase notes font      |
| `-`                          | (none)                   | decrease notes font      |

## Single-Window Fallback

If `window.open()` returns `null` (popup blocked, popups disabled, or running inside a sandboxed iframe):

- Do NOT switch the original window to audience mode
- Instead overlay a notes drawer at the bottom 30% of the viewport:
  - Semi-transparent dark background
  - Speaker notes for the current slide
  - Timer + counter
  - "Press P to hide" hint
- Press `P` again to dismiss

This covers solo rehearsal and single-monitor setups.

## Implementation Pattern

Inline these into every generated presentation:

1. **HTML** — append a single hidden `<div class="presenter-shell" hidden>` template at the end of `<body>`. JS unhides and populates it when `?role=presenter`.
2. **CSS** — append a `/* === PRESENTER MODE === */` block to the inline `<style>`.
3. **JS** — append a `/* === PRESENTER MODE === */` IIFE to the inline `<script>`.

**Key pattern for bidirectional sync:** expose an `onChange(idx)` hook on the `SlidePresentation` controller, fired inside `showSlide()` whenever the active slide actually changes (regardless of whether the change came from keyboard, touch, a tap zone, or a programmatic `goTo()` in response to a remote `goto` message). The sync layer wires `onChange` to `broadcast('goto', { slide: idx })` and, separately, listens for remote `goto` messages to call `sp.goTo(slide, { silent: true })` — silent so the applied remote change is not re-broadcast.

On the fixed 16:9 stage all slides are stacked absolutely and toggled with `.active`; there is no scrolling, so the current index is the controller's own state, not something observed from the DOM.

Skeleton (~260 LoC when fully written; abbreviated here):

```js
class SlidePresentation {
  constructor() {
    this.slides = [...document.querySelectorAll('.slide')];
    this.currentSlide = 0;
    this.onChange = null; // sync layer sets this
    // ...stage scaling, keyboard, touch
  }
  showSlide(index, opts = {}) {
    const i = Math.max(0, Math.min(index, this.slides.length - 1));
    if (i === this.currentSlide && !opts.force) return;
    this.currentSlide = i;
    this.slides.forEach((s, n) => s.classList.toggle('active', n === i));
    if (!opts.silent && typeof this.onChange === 'function') this.onChange(i);
  }
  goTo(i, opts) { this.showSlide(i, opts); }
}

(function presenterSync() {
  const params = new URLSearchParams(location.search);
  const role = params.get('role') || 'normal';
  const channelName = 'slides-sync-' + (document.title || 'untitled')
    .toLowerCase().replace(/\W+/g, '-');
  const channel = new BroadcastChannel(channelName);

  function broadcast(type, data = {}) {
    try { channel.postMessage({ type, ...data }); } catch (e) {}
  }

  // Shared wiring used by normal + audience displays
  function wireDisplay(sp) {
    sp.onChange = (idx) => broadcast('goto', { slide: idx });
    channel.addEventListener('message', (e) => {
      const d = e.data || {};
      if (d.type === 'goto' && typeof d.slide === 'number') {
        if (d.slide !== sp.currentSlide) sp.goTo(d.slide, { silent: true }); // echo guard
      } else if (d.type === 'presenter-opened') {
        document.body.classList.replace('role-normal', 'role-audience');
        broadcast('goto', { slide: sp.currentSlide });       // catch-up
      } else if (d.type === 'presenter-closed') {
        document.body.classList.replace('role-audience', 'role-normal');
      }
    });
  }

  if (role === 'presenter')           initPresenter();
  else if (role === 'audience-frame') initAudienceFrame();
  else                                initDisplay();   // 'normal' and any other

  // initDisplay()       — new SlidePresentation + wireDisplay + `P` opens presenter
  // initPresenter()     — build shell, two iframes, notes, timer, counter;
  //                       listens for 'goto' and calls setSlide(s, { silent: true })
  // initAudienceFrame() — show only slides[current], strip all chrome
})();
```

## Edge Cases

- **Popup blocked** → inline overlay (see fallback above)
- **Presenter window closed unexpectedly** → audience receives `presenter-closed` and returns to normal mode
- **Audience window closed** → presenter still works solo (just no second display)
- **Both windows reload** → state is lost; both restart at slide 0 (Phase 2 may persist via `localStorage`)
- **Slide with no `<aside>`** → notes panel shows "(no notes for this slide)" placeholder
- **Multiple presentations open** → each uses its own channel (hashed by title) so they don't cross-talk
- **`file://` protocol** → BroadcastChannel works for same-origin tabs even on `file://`. Tested in Chrome and Firefox; Safari may require serving via `http://` (note this in the user-facing delivery message if the deck will be opened in Safari)

## Delivery Note for Users

When telling the user how to navigate (Phase 5), add:

> **Presenter mode:** Press `P` to open the speaker view in a separate window. Drag it to your laptop screen and keep the audience window on the projector. Speaker notes, next-slide preview, and a timer travel with you.
