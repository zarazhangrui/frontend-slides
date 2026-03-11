---
title: "feat: Simple Todo List"
type: feat
status: completed
date: 2026-03-11
---

## Enhancement Summary

**Deepened on:** 2026-03-11
**Sections enhanced:** 4 (Acceptance Criteria, Key Behaviors, Design Direction, MVP Code)
**Research agents used:** Security Sentinel, Code Simplicity Reviewer, Frontend Races Reviewer, Performance Oracle, Accessibility Best Practices Researcher, SpecFlow Analyzer, Repo Research Analyst

### Key Improvements
1. **Simplified DOM structure** — nest checkbox inside `<label>` to eliminate ID generation entirely
2. **Event delegation** — single `change` listener on `<ul>` instead of per-checkbox listeners
3. **Accessibility** — add `aria-live` region for screen reader announcements, `aria-label` on list, 44px touch targets

### New Considerations Discovered
- `Date.now()` IDs can collide on rapid entry — eliminated by nesting checkbox in label
- Remove redundant `input.focus()` calls — `autofocus` attribute handles it, re-focus after Enter is unnecessary since input never loses focus
- Add `.sr-only` live region so screen readers announce when items are added/completed

---

# Simple Todo List

A minimal, zero-dependency todo list as a single HTML file. Auto-focuses the input so you can start typing immediately, and lets you check off items when done.

## Acceptance Criteria

- [x] Single self-contained HTML file (inline CSS + JS, no dependencies)
- [x] Text input auto-focuses on page load so user can type immediately
- [x] Pressing Enter adds the typed text as a new todo item
- [x] Empty/whitespace-only input is silently ignored (no blank todos)
- [x] Each todo has a checkbox — clicking checkbox or label text strikes through the item
- [x] Checking/unchecking toggles completion state (bidirectional)
- [x] Clean, minimal visual design (follows project's zero-dependency philosophy)
- [x] Accessible: semantic HTML, label-wrapped checkboxes, `aria-live` announcements
- [x] Responsive: works on mobile with 44px minimum touch targets
- [x] Reduced motion support via `prefers-reduced-motion`
- [x] XSS-safe: uses `textContent` for user input, never `innerHTML`

## Context

This project ("frontend-slides") produces zero-dependency, single-file HTML applications with inline CSS/JS. The todo list follows the same pattern — no npm, no build tools, no frameworks. Just one `.html` file you can open in any browser.

### Key Behaviors

1. **Auto-focus**: The `<input>` element receives focus on page load via the `autofocus` attribute. No JS `focus()` fallback needed — `autofocus` has universal browser support and the script runs after the DOM is ready (bottom of `<body>`)
2. **Add todo**: Listen for `keydown` → Enter on the input. Trim and reject empty. Create a `<li>` with a `<label>` wrapping a checkbox and text. Append to list
3. **Complete todo**: Use event delegation — a single `change` listener on the `<ul>` toggles `.completed` on the parent `<li>` via `e.target.closest('li')`

### Research Insights: Behavior

**Simplification (from Code Simplicity Review):**
- Nest `<input type="checkbox">` inside `<label>` — eliminates need for ID generation, `htmlFor`, and the `Date.now()` collision bug. Clicking the label text toggles the checkbox for free
- Remove `.input-row` wrapper div — single-child flex container adds nothing
- Remove redundant `input.focus()` calls — input never loses focus during Enter keydown

**Race Condition Prevention (from Frontend Races Review):**
- `Date.now()` has millisecond resolution; rapid Enter presses can produce duplicate IDs causing label/checkbox misassociation. Fixed by eliminating IDs entirely (checkbox nested in label)
- `keydown` with trim-check is safe against held-Enter rapid-fire — second event sees empty input and bails

**Event Delegation (from Performance Review):**
- Single `change` listener on `<ul>` instead of per-checkbox listeners
- Eliminates memory cleanup concerns if delete functionality is ever added
- Structurally cleaner with no per-item listener overhead

### Design Direction

- Light, clean aesthetic — white background, subtle borders
- Single accent color (`#4a90d9`) for focus states and checkbox `accent-color`
- Smooth fade-in animation when items are added (0.25s)
- Comfortable spacing, readable typography (system font stack)
- Minimum 44px touch targets on list items (WCAG 2.2 AAA)

### Research Insights: Accessibility

**From Accessibility Best Practices Research:**
- Use native `<input type="checkbox">` — no ARIA roles needed (first rule of ARIA: don't use ARIA when native semantics work)
- `accent-color` is the simplest, most accessible checkbox color customization
- Add `aria-live="polite"` region for screen reader announcements when items are added
- Add `aria-label="Todo list"` on `<ul>` to distinguish it from other lists
- Use `text-decoration: line-through` for completed items (not `<del>` or `<s>` — those mean "removed from document")
- `:focus-visible` for keyboard-only focus indicators
- 44px `min-height` on list items for WCAG 2.2 AAA touch targets

**From SpecFlow Analysis:**
- Autofocus is appropriate here — the page's sole purpose is the todo list
- No persistence (localStorage) in v1 — intentionally ephemeral
- No delete mechanism in v1 — intentional simplicity

### Research Insights: Security

**From Security Sentinel Review:**
- `textContent` usage is correct and prevents XSS — user input is never parsed as HTML
- No persistence layer means no stored XSS risk
- No server interaction means no CSRF, no injection vectors
- Optional hardening: cap input length at 500 chars to prevent layout abuse

## MVP

### todo.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Todo</title>
    <style>
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            background: #fafafa;
            color: #1a1a1a;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            padding: 3rem 1rem;
        }

        .container { width: 100%; max-width: 480px; }

        h1 {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1.5rem;
            color: #333;
        }

        #todo-input {
            width: 100%;
            padding: 0.75rem 1rem;
            font-size: 1rem;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            outline: none;
            transition: border-color 0.2s;
            font-family: inherit;
            margin-bottom: 1.5rem;
        }

        #todo-input:focus { border-color: #4a90d9; }

        ul { list-style: none; }

        li {
            display: flex;
            align-items: center;
            min-height: 44px;
            border-bottom: 1px solid #eee;
            animation: fadeIn 0.25s ease;
        }

        li.completed label {
            text-decoration: line-through;
            opacity: 0.5;
        }

        li label {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            width: 100%;
            padding: 0.75rem 0;
            font-size: 1rem;
            cursor: pointer;
            transition: opacity 0.2s;
            word-break: break-word;
        }

        li input[type="checkbox"] {
            width: 1.15rem;
            height: 1.15rem;
            cursor: pointer;
            accent-color: #4a90d9;
            flex-shrink: 0;
        }

        input:focus-visible {
            outline: 2px solid #4a90d9;
            outline-offset: 2px;
        }

        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-4px); }
            to   { opacity: 1; transform: translateY(0); }
        }

        @media (prefers-reduced-motion: reduce) {
            li { animation: none; }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Todo</h1>
        <input id="todo-input" type="text" placeholder="What needs doing?" autofocus />
        <ul id="todo-list" aria-label="Todo list"></ul>
        <div id="status" aria-live="polite" aria-atomic="true" class="sr-only"></div>
    </div>

    <script>
        const input = document.getElementById('todo-input');
        const list  = document.getElementById('todo-list');
        const status = document.getElementById('status');

        input.addEventListener('keydown', (e) => {
            if (e.key !== 'Enter') return;
            const text = input.value.trim();
            if (!text) return;

            addTodo(text);
            input.value = '';
        });

        /* Event delegation — one listener handles all checkboxes */
        list.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox') {
                const li = e.target.closest('li');
                li.classList.toggle('completed', e.target.checked);
                status.textContent = e.target.checked ? 'Completed' : 'Uncompleted';
            }
        });

        function addTodo(text) {
            const li = document.createElement('li');
            const label = document.createElement('label');
            const cb = document.createElement('input');
            cb.type = 'checkbox';

            label.append(cb, ' ', text);
            li.appendChild(label);
            list.appendChild(li);

            status.textContent = `"${text}" added`;
        }
    </script>
</body>
</html>
```

## Sources

- Project philosophy: zero-dependency single HTML files (see `SKILL.md`, `README.md`)
- [WCAG 2.2 SC 2.5.5 Target Size (Enhanced)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html)
- [WAI-ARIA Checkbox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/)
- [MDN: ARIA live regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions)
- [MDN: accent-color](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/accent-color)
