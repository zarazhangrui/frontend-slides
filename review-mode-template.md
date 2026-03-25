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
📍 [Slide N, 区域: (x1,y1)-(x2,y2)]                       // Area
```

**Rules:**
- Multiple selections append (each on new line starting with 📍)
- Coordinates relative to slide element
- Element text preview: max 30 chars, newlines removed
- Skip elements larger than 60% of slide (containers)

**Parsing & Highlight:**
```javascript
// Regex
var reElem = /@\s*\((-?\d+),\s*(-?\d+),\s*(\d+),\s*(\d+)\)/;
var reArea = /区域:\s*\((-?\d+),(-?\d+)\)-\((-?\d+),(-?\d+)\)/;

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

// === MOUSE EVENTS (when panel open) ===
// mousedown: Start drag, record position
// mousemove: If dragging >5px show selection box; else highlight hovered element
// mouseup: If dragged >10px insert area info
// click: If valid small element, insert element info
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

- Keyboard shortcuts (R, Escape, Ctrl+Enter)
- Data structure shape (for export compatibility)
- IntersectionObserver for slide detection
- Markdown export format
- Location info format (📍 prefix, coordinates)
- Skip large containers (>60% of slide)
- Clear highlights when: switching slides, closing panel, clicking outside comments
