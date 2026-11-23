# Verification Checklist — HTML Slides

Use this checklist before delivery and after every enhancement. The authoritative rules remain in `../SKILL.md` and `../viewport-base.css`. Do not claim that a check passed unless it was actually performed.

## 1. File and runtime

- [ ] The output opens as a standalone HTML file without a build process, package manager or required CDN dependency.
- [ ] Required CSS and JS are embedded, including the **full** `viewport-base.css` stage rules.
- [ ] Linked local assets are included with the deliverable or embedded appropriately.
- [ ] No missing resources, console exceptions or broken interactions were observed.

## 2. Fixed-stage layout

- [ ] Every slide has an authored **1920×1080** stage with uniform scaling to fit the viewport.
- [ ] The stage letterboxes/pillarboxes rather than reflowing slide content.
- [ ] At **1280×720**, titles, captions, diagrams and navigation are fully within stage bounds.
- [ ] At a phone-sized viewport, the same 16:9 canvas is scaled, not rearranged.
- [ ] No text truncates, overlaps panels, extends beyond cards or becomes unreadably small.
- [ ] Visibility follows the required `.active`/`.visible` behavior (not fragile `display: none` overrides).

## 3. Content and data quality

- [ ] Each slide communicates a single primary message, with clear hierarchy.
- [ ] Charts have titles, units, meaningful axes and visible labeling.
- [ ] Statistics, quotations and sourced images have verifiable attribution.
- [ ] Example figures are explicitly labeled illustrative; no data is invented as fact.
- [ ] Dense slides are split instead of shrinking typography below comfortable reading size.
- [ ] Source material from a PPT conversion remains accurate and complete.

## 4. Motion and interactions

- [ ] Forward and backward navigation works by keyboard and on-screen controls.
- [ ] All interactive elements are keyboard operable and have a visible focus indicator.
- [ ] Reveal animations reach a meaningful stable final state; no unexpected autoplay loops persist off-slide.
- [ ] Revisiting a slide does not produce broken state, duplicate timers or overlapping transitions.
- [ ] With `prefers-reduced-motion: reduce`, all content is still readable and controls still work.
- [ ] Interactions are understandable without hover and do not steal keyboard input unexpectedly.

## 5. Accessibility and visual QA

- [ ] Text contrast has been checked against actual rendered backgrounds.
- [ ] Images have appropriate alternative text, or are marked decorative.
- [ ] Nontrivial diagrams have a text explanation; chart values are not color-only.
- [ ] Focus order is logical; slide controls have accessible names.
- [ ] Font fallback is tested when a preferred font is unavailable.

## 6. Repeatable acceptance pass

1. Open the standalone file in a browser with developer tools visible.
2. Capture the first, a middle and the final slide at **1280×720**; review clipping, overlap and typography.
3. Repeat at a phone-sized viewport and verify whole-stage scaling.
4. Navigate every slide forward and backward, activating every interactive control.
5. Enable reduced motion and recheck key content/interaction states.
6. Review console and missing-resource errors; fix before sign-off.
7. Report what was **verified**, what remains **untested**, and any known trade-offs.

For a modified existing deck, also compare representative before/after screenshots and check the slides most likely to overflow.
