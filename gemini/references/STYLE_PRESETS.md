# Style Presets for Frontend Slides

10 curated visual styles. Inspired by real design references — no generic "AI slop."

**Rules for ALL styles:**
- Abstract shapes only — no illustrations
- Every slide MUST fit exactly in the viewport
- No scrolling within slides, ever

## MANDATORY BASE CSS (include in every presentation)

```css
html, body { height: 100%; overflow-x: hidden; }
html { scroll-snap-type: y mandatory; scroll-behavior: smooth; }

.slide {
  width: 100vw; height: 100vh; height: 100dvh;
  overflow: hidden; scroll-snap-align: start;
  display: flex; flex-direction: column; position: relative;
}
.slide-content {
  flex: 1; display: flex; flex-direction: column; justify-content: center;
  max-height: 100%; overflow: hidden; padding: var(--slide-padding);
}
:root {
  --title-size: clamp(1.5rem, 5vw, 4rem);
  --h2-size: clamp(1.25rem, 3.5vw, 2.5rem);
  --body-size: clamp(0.75rem, 1.5vw, 1.125rem);
  --small-size: clamp(0.65rem, 1vw, 0.875rem);
  --slide-padding: clamp(1rem, 4vw, 4rem);
  --content-gap: clamp(0.5rem, 2vw, 2rem);
}
.card, .container { max-width: min(90vw, 1000px); max-height: min(80vh, 700px); }
img { max-width: 100%; max-height: min(50vh, 400px); object-fit: contain; }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr)); gap: clamp(0.5rem, 1.5vw, 1rem); }
@media (max-height: 700px) {
  :root { --slide-padding: clamp(0.75rem, 3vw, 2rem); --title-size: clamp(1.25rem, 4.5vw, 2.5rem); }
}
@media (max-height: 600px) { .nav-dots, .keyboard-hint, .decorative { display: none; } }
```

---

## DARK THEMES

### 1. NEON CYBER
**Vibe:** Futuristic, techy, particle effects.
**Best for:** Tech startups, developer tools, gaming, cybersecurity.

```css
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');

:root {
  --bg: #0a0a0f; --surface: #111118;
  --primary: #00ffff; --secondary: #ff00ff; --accent: #00ff88;
  --text: #e0e0ff; --text-dim: #6060a0;
  --font-display: 'Orbitron', monospace; --font-body: 'Share Tech Mono', monospace;
  --glow-cyan: 0 0 20px rgba(0,255,255,0.5); --glow-magenta: 0 0 20px rgba(255,0,255,0.5);
}
body { background: var(--bg); color: var(--text); font-family: var(--font-body); }
h1, h2 { font-family: var(--font-display); font-weight: 900; color: var(--primary); text-shadow: var(--glow-cyan); letter-spacing: 0.05em; font-size: var(--title-size); }
.slide::before {
  content: ''; position: absolute; inset: 0; pointer-events: none;
  background-image: linear-gradient(rgba(0,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.03) 1px, transparent 1px);
  background-size: 40px 40px;
}
.slide::after {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, transparent, var(--primary), transparent);
  animation: scan 3s linear infinite;
}
@keyframes scan { 0% { top: 0; } 100% { top: 100%; } }
.card { border: 1px solid rgba(0,255,255,0.3); background: rgba(0,255,255,0.05); backdrop-filter: blur(10px); padding: clamp(1rem, 2vw, 2rem); }
.tag { font-size: var(--small-size); color: var(--primary); border: 1px solid var(--primary); padding: 0.2em 0.8em; text-transform: uppercase; letter-spacing: 0.2em; }
```

---

### 2. MIDNIGHT EXECUTIVE
**Vibe:** Premium, corporate, trustworthy. Bloomberg Terminal meets luxury brand.
**Best for:** Finance, consulting, enterprise SaaS, investor decks.

```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;600&display=swap');

:root {
  --bg: #0d0d14; --surface: #161622;
  --gold: #c9a84c; --gold-light: #e8c97a;
  --text: #f0f0f8; --text-dim: #8888aa;
  --font-display: 'Playfair Display', serif; --font-body: 'Inter', sans-serif;
  --border: rgba(201,168,76,0.2);
}
body { background: var(--bg); color: var(--text); font-family: var(--font-body); }
h1 { font-family: var(--font-display); font-weight: 400; font-size: var(--title-size); }
.gold { color: var(--gold); }
.divider { width: 60px; height: 2px; background: var(--gold); margin: 1.5rem 0; }
.stat { font-family: var(--font-display); font-size: clamp(2rem, 6vw, 5rem); color: var(--gold-light); }
.stat-label { font-size: var(--small-size); color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.2em; }
.card { border: 1px solid var(--border); background: linear-gradient(135deg, rgba(201,168,76,0.05), transparent); padding: clamp(1rem, 2.5vw, 2.5rem); }
.slide-corner::before, .slide-corner::after { content: ''; position: absolute; width: 40px; height: 40px; border-color: var(--gold); border-style: solid; opacity: 0.4; }
.slide-corner::before { top: 2rem; left: 2rem; border-width: 1px 0 0 1px; }
.slide-corner::after { bottom: 2rem; right: 2rem; border-width: 0 1px 1px 0; }
```

---

### 3. DEEP SPACE
**Vibe:** Cinematic, inspiring, vast. NASA mission briefing meets science documentary.
**Best for:** Science, exploration, moonshot projects, aspirational narratives.

```css
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;700&family=Space+Mono:wght@400;700&display=swap');

:root {
  --bg: #020408; --primary: #7eb8f7; --accent: #f7c27e;
  --text: #ccdeff; --text-dim: #6688aa;
  --nebula-1: rgba(60, 20, 120, 0.4); --nebula-2: rgba(20, 60, 120, 0.3);
  --font-display: 'Space Grotesk', sans-serif; --font-mono: 'Space Mono', monospace;
}
body { background: var(--bg); color: var(--text); font-family: var(--font-display); }
h1 { font-size: var(--title-size); font-weight: 700; color: #fff; letter-spacing: -0.02em; }
.mono { font-family: var(--font-mono); color: var(--primary); font-size: var(--small-size); }
.slide {
  background:
    radial-gradient(ellipse at 20% 50%, var(--nebula-1), transparent 50%),
    radial-gradient(ellipse at 80% 20%, var(--nebula-2), transparent 50%),
    var(--bg);
}
```

---

### 4. TERMINAL GREEN
**Vibe:** Developer-focused, hacker aesthetic. Old-school terminal meets modern CLI.
**Best for:** Dev tools, open source, technical deep dives, CLI products.

```css
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');

:root {
  --bg: #0c120c; --green: #00ff41; --green-dim: #00aa2a;
  --green-dark: rgba(0,255,65,0.1); --text-dim: #005514;
  --font: 'JetBrains Mono', monospace;
}
body { background: var(--bg); color: var(--green); font-family: var(--font); }
h1 { font-size: var(--title-size); font-weight: 700; }
h1::before { content: '> '; color: var(--green-dim); }
.slide::after {
  content: ''; position: absolute; inset: 0; pointer-events: none;
  background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.02) 2px, rgba(0,255,65,0.02) 4px);
}
.prompt::before { content: '$ '; color: var(--green-dim); }
.card { border: 1px solid var(--green-dim); background: var(--green-dark); padding: clamp(1rem, 2vw, 2rem); }
.cursor::after { content: '█'; animation: blink 1s step-end infinite; }
@keyframes blink { 50% { opacity: 0; } }
```

---

## LIGHT THEMES

### 5. PAPER & INK
**Vibe:** Editorial, literary, refined. The New Yorker meets high-end book design.
**Best for:** Publishing, research, thought leadership, academia, journalism.

```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=EB+Garamond:ital,wght@0,400;1,400&display=swap');

:root {
  --bg: #f5f0e8; --ink: #1a1208; --ink-light: #4a4030;
  --red: #8b1a1a; --rule: #c8b89a;
  --font-display: 'Playfair Display', serif; --font-body: 'EB Garamond', serif;
}
body { background: var(--bg); color: var(--ink); font-family: var(--font-body); font-size: var(--body-size); line-height: 1.7; }
h1 { font-family: var(--font-display); font-size: var(--title-size); font-weight: 700; }
.red { color: var(--red); }
hr { border: none; border-top: 1px solid var(--rule); }
.pullquote { font-family: var(--font-display); font-size: clamp(1.2rem, 3vw, 2rem); font-style: italic; color: var(--ink-light); border-left: 3px solid var(--red); padding-left: 1.5rem; }
```

---

### 6. SWISS MODERN
**Vibe:** Clean, Bauhaus-inspired, geometric. International Typographic Style.
**Best for:** Design agencies, architecture, product design, anything disciplined.

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700;900&display=swap');

:root {
  --white: #ffffff; --black: #0a0a0a; --red: #e63329;
  --gray-1: #f5f5f5; --gray-2: #e0e0e0; --gray-3: #999999;
  --font: 'Inter', sans-serif;
}
body { background: var(--white); color: var(--black); font-family: var(--font); }
h1 { font-size: var(--title-size); font-weight: 900; line-height: 0.95; letter-spacing: -0.03em; text-transform: uppercase; }
.red { color: var(--red); }
.rule { height: 4px; background: var(--black); }
.rule-red { background: var(--red); }
.label { font-size: var(--small-size); font-weight: 700; text-transform: uppercase; letter-spacing: 0.2em; color: var(--gray-3); }
.number { font-size: clamp(4rem, 15vw, 12rem); font-weight: 900; line-height: 1; color: var(--gray-2); }
```

---

### 7. SOFT PASTEL
**Vibe:** Friendly, playful, creative. Modern SaaS meets children's book.
**Best for:** Education, consumer apps, wellness, creative tools, broad audiences.

```css
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;800;900&family=Nunito+Sans:wght@400;600&display=swap');

:root {
  --bg: #fef9f5; --coral: #ff8c7a; --sky: #7ac5e8; --mint: #7ae8c5;
  --lavender: #b07ae8; --yellow: #f7d87c;
  --text: #2d2233; --text-dim: #8877aa;
  --font-display: 'Nunito', sans-serif; --font-body: 'Nunito Sans', sans-serif;
}
body { background: var(--bg); color: var(--text); font-family: var(--font-body); }
h1 { font-family: var(--font-display); font-weight: 900; font-size: var(--title-size); }
.blob { position: absolute; border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%; opacity: 0.15; filter: blur(40px); }
.card { background: white; border-radius: 1.5rem; box-shadow: 0 4px 24px rgba(0,0,0,0.06); padding: clamp(1rem, 2.5vw, 2rem); }
.tag { border-radius: 999px; padding: 0.3em 1em; font-weight: 800; font-size: var(--small-size); font-family: var(--font-display); }
.tag-coral { background: rgba(255,140,122,0.15); color: var(--coral); }
.tag-sky { background: rgba(122,197,232,0.15); color: var(--sky); }
```

---

### 8. WARM EDITORIAL
**Vibe:** Magazine-style, photographic, tactile. Monocle meets Kinfolk.
**Best for:** Lifestyle, travel, food, culture, brand stories, human narratives.

```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300&family=DM+Sans:wght@300;400&display=swap');

:root {
  --cream: #f8f3ec; --warm-dark: #1c1510; --terracotta: #c4633a;
  --sage: #7a8c6e; --text: #2a1f15; --text-dim: #8a7060;
  --font-display: 'Cormorant Garamond', serif; --font-body: 'DM Sans', sans-serif;
}
body { background: var(--cream); color: var(--text); font-family: var(--font-body); font-weight: 300; }
h1 { font-family: var(--font-display); font-weight: 600; font-size: var(--title-size); letter-spacing: -0.01em; }
.overline { font-size: var(--small-size); text-transform: uppercase; letter-spacing: 0.25em; color: var(--text-dim); }
.full-bleed { position: absolute; inset: 0; background-size: cover; background-position: center; }
.full-bleed::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to right, rgba(28,21,16,0.85), transparent); }
```

---

## SPECIALTY

### 9. BRUTALIST
**Vibe:** Raw, bold, attention-grabbing. Anti-design that demands to be noticed.
**Best for:** Arts, activism, disruptive brands, anything that should provoke.

```css
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&family=IBM+Plex+Mono:wght@400;700&display=swap');

:root {
  --bg: #f0e800; --black: #000000; --white: #ffffff; --red: #ff0000;
  --font-display: 'Space Grotesk', sans-serif; --font-mono: 'IBM Plex Mono', monospace;
}
body { background: var(--bg); color: var(--black); font-family: var(--font-display); }
h1 { font-size: var(--title-size); font-weight: 700; line-height: 0.9; text-transform: uppercase; letter-spacing: -0.05em; }
.slide { border: 3px solid var(--black); }
.card { border: 3px solid var(--black); padding: 1rem; box-shadow: 6px 6px 0 var(--black); }
.invert { background: var(--black); color: var(--bg); padding: 0.2em 0.4em; }
.stripe { position: absolute; inset: 0; pointer-events: none; opacity: 0.08; background-image: repeating-linear-gradient(-45deg, var(--black) 0, var(--black) 1px, transparent 0, transparent 50%); background-size: 10px 10px; }
```

---

### 10. GRADIENT WAVE
**Vibe:** Modern SaaS — polished, energetic, optimistic.
**Best for:** B2B SaaS, product launches, growth-stage startups.

```css
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;800&display=swap');

:root {
  --bg: #0f0b1e; --purple: #7c3aed; --blue: #2563eb; --pink: #ec4899; --cyan: #06b6d4;
  --text: #f8fafc; --text-dim: #94a3b8;
  --font: 'Plus Jakarta Sans', sans-serif;
}
body { background: var(--bg); color: var(--text); font-family: var(--font); }
h1 { font-size: var(--title-size); font-weight: 800; }
.gradient-text { background: linear-gradient(135deg, var(--purple), var(--cyan)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.slide { background: radial-gradient(ellipse at top left, rgba(124,58,237,0.3), transparent 50%), radial-gradient(ellipse at bottom right, rgba(6,182,212,0.2), transparent 50%), var(--bg); }
.card { background: rgba(255,255,255,0.05); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.1); border-radius: 1rem; padding: clamp(1rem, 2.5vw, 2.5rem); }
.pill { background: linear-gradient(135deg, var(--purple), var(--blue)); border-radius: 999px; padding: 0.4em 1.2em; font-weight: 600; font-size: var(--small-size); }
```
