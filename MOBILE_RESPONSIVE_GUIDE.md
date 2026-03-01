# Mobile Responsive Layout Guide

This repository is a slide-generation skill, so the "mobile responsive version" is best represented as:

1. explicit mobile-first generation guidance, and
2. a runnable HTML example that proves those rules work.

This guide summarizes the approach used in `examples/mobile-responsive-slides.html`.

## 1. Viewport Sizing Strategy

Use all three viewport units in fallback order:

```css
.slide {
    height: 100vh;
    height: 100svh;
    height: 100dvh;
    overflow: hidden;
}
```

- `100vh`: baseline fallback.
- `100svh`: stable viewport to avoid jumps.
- `100dvh`: dynamic viewport for modern mobile browsers.

Rule: keep `overflow: hidden` and split content into additional slides instead of scrolling inside a slide.

## 2. Safe Area Insets (Notch/Home Indicator)

For full-screen mobile behavior, include `viewport-fit=cover` and safe-area padding:

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
```

```css
:root {
    --safe-top: env(safe-area-inset-top, 0px);
    --safe-right: env(safe-area-inset-right, 0px);
    --safe-bottom: env(safe-area-inset-bottom, 0px);
    --safe-left: env(safe-area-inset-left, 0px);
}

.slide {
    padding-top: calc(var(--slide-padding) + var(--safe-top));
    padding-right: calc(var(--slide-padding) + var(--safe-right));
    padding-bottom: calc(var(--slide-padding) + var(--safe-bottom));
    padding-left: calc(var(--slide-padding) + var(--safe-left));
}
```

## 3. Content Density + Clamp Scaling

Keep slide content short and let typography/spacing scale:

```css
:root {
    --title-size: clamp(1.6rem, 6.6vw, 3.9rem);
    --body-size: clamp(0.84rem, 2.3vw, 1.08rem);
    --slide-padding: clamp(1rem, 4.5vw, 3.2rem);
}
```

If content does not fit at `390x844` and `844x390`, split the slide.

## 4. Touch-First Interactions

Apply mobile interaction defaults:

- `touch-action: pan-y` to reduce accidental horizontal gesture conflicts.
- Navigation controls with 44-48px minimum target size.
- Swipe gesture support (`touchstart` + `touchend`) in addition to keyboard and wheel.

Also reduce hover-only effects on coarse pointers:

```css
@media (hover: none) and (pointer: coarse) {
    .feature-card {
        backdrop-filter: none;
    }
}
```

## 5. Height-Aware Breakpoints

Short viewports usually break before narrow viewports do. Add height breakpoints:

```css
@media (max-height: 620px) {
    :root {
        --slide-padding: clamp(0.75rem, 3vw, 1.25rem);
        --title-size: clamp(1.3rem, 5.8vw, 2.1rem);
    }
}
```

## 6. Accessibility and Motion

- Keep semantic sections and `aria-label` for controls.
- Respect reduced motion with `prefers-reduced-motion`.
- Keep keyboard navigation enabled (`ArrowUp`, `ArrowDown`, `PageUp`, `PageDown`, `Space`).

## 7. Verification Matrix

Before shipping, validate at minimum:

- `390 x 844` (portrait phone)
- `844 x 390` (landscape phone)
- `768 x 1024` (tablet portrait)
- `1366 x 768` (small laptop)

Pass condition: no internal slide scrolling, no clipped controls, no unreachable navigation UI.
