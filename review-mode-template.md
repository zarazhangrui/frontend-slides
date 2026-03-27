# Review Mode Template

Opt-in review system. Generate adapted to presentation style.

## Interaction Contract

| Action | Trigger | Behavior |
|--------|---------|----------|
| Toggle panel | `R` key or click button | Open/close review panel |
| Close | `Escape` | Close if open |
| Save | `Ctrl+Enter` in textarea | Save comment to current slide |
| Export | Click export button | Download markdown file |
| Select element | Click on slide element | Insert location info into textarea |
| Select area | Drag on slide | Insert region coordinates into textarea |
| Select comment | Click saved comment | Mark comment as selected + show highlight at saved location |
| Deselect | Click outside comments | Remove selected state + clear all highlights |
| Delete comment | Click delete comment | Delete selected comment + clear all highlights |
| Edit comment | Double Click comment | Edit selected comment again |


## Data Structure (Required)

```javascript
// Comments keyed by slide index
var comments = {
  0: [{ id: 1, text: "...", timestamp: "ISO8601", location: [...] }],
  2: [{ id: 2, text: "...", timestamp: "ISO8601", location: null }]
};
```

## Core JS (Copy & Adapt Styling)

```javascript
(function(){
  // === STATE ===
  var state = { comments: {}, currentSlide: 0, nextId: 1, open: false };

  // === SLIDE DETECTION (required) ===
  document.querySelectorAll('.slide').forEach(function(slide, i){
    new IntersectionObserver(function(entries){
      if(entries[0].isIntersecting && entries[0].intersectionRatio >= 0.5){
        state.currentSlide = i;
        onSlideChange(i);  // Update UI
      }
    }, {threshold: 0.5}).observe(slide);
  });

  // === KEYBOARD (required) ===
  document.addEventListener('keydown', function(e){
    if(e.target.matches('input,textarea,[contenteditable]')){
      e.stopPropagation();  // Block space/arrows from triggering slide navigation
      if(e.key === 'Escape') togglePanel();
      if(e.ctrlKey && e.key === 'Enter') saveComment();
      return;
    }
    if(e.key === 'r' || e.key === 'R') togglePanel();
  });

  // === ACTIONS (required logic, adapt UI calls) ===
  function togglePanel(){
    state.open = !state.open;
    // → Update panel visibility
  }

  function saveComment(){
    var text = /* get textarea value */;
    if(!text.trim()) return;

    var idx = state.currentSlide;
    if(!state.comments[idx]) state.comments[idx] = [];
    state.comments[idx].push({
      id: state.nextId++,
      text: text.trim(),
      timestamp: new Date().toISOString()
    });
    // → Clear textarea, update list
  }

  function onSlideChange(idx){
    // → Update slide indicator, render comments for idx
  }

  function exportMarkdown(){
    var lines = ['# Review', ''];
    Object.keys(state.comments).sort((a,b)=>a-b).forEach(function(idx){
      lines.push('## Slide ' + (+idx+1), '');
      state.comments[idx].forEach(function(c){
        lines.push('- ' + c.text);
      });
      lines.push('');
    });

    var blob = new Blob([lines.join('\n')], {type: 'text/markdown'});
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'review-' + new Date().toISOString().slice(0,10) + '.md';
    a.click();
  }
})();
```

## Location Info Format (Required)

When user selects element or area, insert at textarea start:

```
📍 [Slide N, <tag.class> "text preview" @ (x,y,w,h)]     // Element
📍 [Slide N, area: (x1,y1)-(x2,y2)]                        // Area
```

**Rules:**
- Multiple selections append (each on new line starting with 📍)
- Coordinates relative to slide element
- Element text preview: max 30 chars, newlines removed
- Skip elements larger than 60% of slide (containers)
- One comment may contain multiple 📍 locations
- Click comment → show highlights for ALL locations (not just first)
- These 📍 locations should be draggable, removable text fields

**Parsing & Highlight:**

```javascript
// Regex
var reElem = /@\s*\((-?\d+),\s*(-?\d+),\s*(\d+),\s*(\d+)\)/g;  // global flag
var reArea = /area:\s*\((-?\d+),(-?\d+)\)-\((-?\d+),(-?\d+)\)/g;  // global flag

// Selection state
var selectedComment = null;

// Click comment → select it + show highlight
function selectComment(commentEl, comment, slideIdx) {
  clearSelection();
  selectedComment = commentEl;
  commentEl.classList.add('selected');
  showHighlight(comment, slideIdx);
}

// Click outside → clear both
function clearSelection() {
  if (selectedComment) selectedComment.classList.remove('selected');
  selectedComment = null;
  clearHighlights();
}
```

## HTML Structure (Minimal Required)

```html
<!-- Append before </body> -->
<button class="review-toggle">...</button>
<aside class="review-panel">
  <header><!-- title, slide indicator, close button --></header>
  <textarea></textarea>
  <button class="save">Save</button>
  <div class="comment-list">
    <!-- Each comment: clickable, add .selected class when active -->
  </div>
  <button class="export">Export</button>
</aside>
<div class="review-selection-box"></div>  <!-- For drag selection visual -->
<div class="review-highlights"></div>     <!-- Container for highlight boxes -->
```

## Selection Logic (Required)

```javascript
// === SELECTION STATE ===
var selState = { dragging: false, startX: 0, startY: 0, lastHighlight: null };

// === HELPERS ===
function isValidTarget(el) {
  if (!el) return false;
  if (el.closest('.review-panel')) return false;  // Exclude review UI
  return el.closest('.slide') !== null;
}

function getElementDesc(el) {
  var tag = el.tagName.toLowerCase();
  var cls = el.className ? '.' + el.className.split(' ').filter(c => c && !c.startsWith('review-')).join('.') : '';
  var text = (el.textContent || '').replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 30);
  return '<' + tag + cls + '>' + (text ? ' "' + text + (text.length >= 30 ? '...' : '') + '"' : '');
}

function insertLocationInfo(info) {
  var val = textarea.value;
  if (val.startsWith('📍')) {
    // Append after existing location lines
    var lines = val.split('\n');
    var i = 0;
    while (i < lines.length && lines[i].startsWith('📍')) i++;
    lines.splice(i, 0, info);
    textarea.value = lines.join('\n');
  } else {
    textarea.value = info + '\n' + val;
  }
}
```

## Content Shift (Required)

Slides must shrink horizontally when panel opens (width only, height stays 100vh).

**CSS:**
```css
:root {
  --review-panel-width: min(400px, 90vw);
}

.slide.review-open {
  transform-origin: top left;
  transition: transform 0.4s var(--ease-out-expo);
}
```

**JS (in togglePanel):**
```javascript
var panelWidth = Math.min(400, window.innerWidth * 0.9);
var scaleX = state.open ? (window.innerWidth - panelWidth) / window.innerWidth : 1;

document.querySelectorAll('.slide').forEach(function(slide){
  slide.classList.toggle('review-open', state.open);
  slide.style.transform = state.open ? 'scaleX(' + scaleX + ')' : '';
});
```

**Rules:**
- Use `transform: scaleX()` for width-only scaling (not `scale()` which affects both dimensions)
- Scale factor = `(viewport - panel) / viewport`
- Recalculate on window resize if panel open

**Coordinate Conversion (Required):**

When panel is open, `getBoundingClientRect()` returns scaled coordinates. Store original (unscaled) coordinates so highlights work correctly regardless of panel state:

```javascript
// When saving coordinates (panel open, scaleX active):
var x = Math.round((elRect.left - slideRect.left) / scaleX);
var w = Math.round(elRect.width / scaleX);
// y, h unchanged (scaleX doesn't affect height)

// When showing highlights:
var displayX = slideRect.left + (state.open ? loc.x * scaleX : loc.x);
var displayW = state.open ? loc.w * scaleX : loc.w;
```

## Skill Decides

- Panel position (side/bottom/modal/floating)
- All colors, fonts, spacing, borders, shadows
- Animation style and timing
- Button icons and labels
- Comment display format
- Highlight colors (element hover, selection box, saved location)
- Whether clicking comment shows its highlight on slide


## Must Preserve

- Review Mode button visibility control same as Edit Mode (see html-template.md section **Inline Editing Implementation**)
- Keyboard shortcuts (R, Escape, Ctrl+Enter)
- Data structure shape (for export compatibility)
- IntersectionObserver for slide detection
- Markdown export format
- Location info format (📍 prefix, coordinates)
- Skip large containers (>60% of slide)
- Clear highlights when: switching slides, closing panel, clicking outside comments
- Horizontal content scaling when panel opens (transform: scaleX, not scale or margin-right)
