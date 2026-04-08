# Style Presets Reference

Curated visual styles for Frontend Slides. Each preset is inspired by real design references — no generic "AI slop" aesthetics. **Abstract shapes only — no illustrations.**

**Viewport CSS:** For mandatory base styles, see [viewport-base.css](viewport-base.css). Include in every presentation.

---

## Dark Themes

### 1. Bold Signal

**Vibe:** Confident, bold, modern, high-impact

**Layout:** Colored card on dark gradient. Number top-left, navigation top-right, title bottom-left.

**Typography:**
- Display: `Archivo Black` (900)
- Body: `Space Grotesk` (400/500)

**Colors:**
```css
:root {
    --bg-primary: #1a1a1a;
    --bg-gradient: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%);
    --card-bg: #FF5722;
    --text-primary: #ffffff;
    --text-on-card: #1a1a1a;
}
```

**Signature Elements:**
- Bold colored card as focal point (orange, coral, or vibrant accent)
- Large section numbers (01, 02, etc.)
- Navigation breadcrumbs with active/inactive opacity states
- Grid-based layout for precise alignment

---

### 2. Electric Studio

**Vibe:** Bold, clean, professional, high contrast

**Layout:** Split panel—white top, blue bottom. Brand marks in corners.

**Typography:**
- Display: `Manrope` (800)
- Body: `Manrope` (400/500)

**Colors:**
```css
:root {
    --bg-dark: #0a0a0a;
    --bg-white: #ffffff;
    --accent-blue: #4361ee;
    --text-dark: #0a0a0a;
    --text-light: #ffffff;
}
```

**Signature Elements:**
- Two-panel vertical split
- Accent bar on panel edge
- Quote typography as hero element
- Minimal, confident spacing

---

### 3. Creative Voltage

**Vibe:** Bold, creative, energetic, retro-modern

**Layout:** Split panels—electric blue left, dark right. Script accents.

**Typography:**
- Display: `Syne` (700/800)
- Mono: `Space Mono` (400/700)

**Colors:**
```css
:root {
    --bg-primary: #0066ff;
    --bg-dark: #1a1a2e;
    --accent-neon: #d4ff00;
    --text-light: #ffffff;
}
```

**Signature Elements:**
- Electric blue + neon yellow contrast
- Halftone texture patterns
- Neon badges/callouts
- Script typography for creative flair

---

### 4. Dark Botanical

**Vibe:** Elegant, sophisticated, artistic, premium

**Layout:** Centered content on dark. Abstract soft shapes in corner.

**Typography:**
- Display: `Cormorant` (400/600) — elegant serif
- Body: `IBM Plex Sans` (300/400)

**Colors:**
```css
:root {
    --bg-primary: #0f0f0f;
    --text-primary: #e8e4df;
    --text-secondary: #9a9590;
    --accent-warm: #d4a574;
    --accent-pink: #e8b4b8;
    --accent-gold: #c9b896;
}
```

**Signature Elements:**
- Abstract soft gradient circles (blurred, overlapping)
- Warm color accents (pink, gold, terracotta)
- Thin vertical accent lines
- Italic signature typography
- **No illustrations—only abstract CSS shapes**

---

## Light Themes

### 5. Notebook Tabs

**Vibe:** Editorial, organized, elegant, tactile

**Layout:** Cream paper card on dark background. Colorful tabs on right edge.

**Typography:**
- Display: `Bodoni Moda` (400/700) — classic editorial
- Body: `DM Sans` (400/500)

**Colors:**
```css
:root {
    --bg-outer: #2d2d2d;
    --bg-page: #f8f6f1;
    --text-primary: #1a1a1a;
    --tab-1: #98d4bb; /* Mint */
    --tab-2: #c7b8ea; /* Lavender */
    --tab-3: #f4b8c5; /* Pink */
    --tab-4: #a8d8ea; /* Sky */
    --tab-5: #ffe6a7; /* Cream */
}
```

**Signature Elements:**
- Paper container with subtle shadow
- Colorful section tabs on right edge (vertical text)
- Binder hole decorations on left
- Tab text must scale with viewport: `font-size: clamp(0.5rem, 1vh, 0.7rem)`

---

### 6. Pastel Geometry

**Vibe:** Friendly, organized, modern, approachable

**Layout:** White card on pastel background. Vertical pills on right edge.

**Typography:**
- Display: `Plus Jakarta Sans` (700/800)
- Body: `Plus Jakarta Sans` (400/500)

**Colors:**
```css
:root {
    --bg-primary: #c8d9e6;
    --card-bg: #faf9f7;
    --pill-pink: #f0b4d4;
    --pill-mint: #a8d4c4;
    --pill-sage: #5a7c6a;
    --pill-lavender: #9b8dc4;
    --pill-violet: #7c6aad;
}
```

**Signature Elements:**
- Rounded card with soft shadow
- **Vertical pills on right edge** with varying heights (like tabs)
- Consistent pill width, heights: short → medium → tall → medium → short
- Download/action icon in corner

---

### 7. Split Pastel

**Vibe:** Playful, modern, friendly, creative

**Layout:** Two-color vertical split (peach left, lavender right).

**Typography:**
- Display: `Outfit` (700/800)
- Body: `Outfit` (400/500)

**Colors:**
```css
:root {
    --bg-peach: #f5e6dc;
    --bg-lavender: #e4dff0;
    --text-dark: #1a1a1a;
    --badge-mint: #c8f0d8;
    --badge-yellow: #f0f0c8;
    --badge-pink: #f0d4e0;
}
```

**Signature Elements:**
- Split background colors
- Playful badge pills with icons
- Grid pattern overlay on right panel
- Rounded CTA buttons

---

### 8. Vintage Editorial

**Vibe:** Witty, confident, editorial, personality-driven

**Layout:** Centered content on cream. Abstract geometric shapes as accent.

**Typography:**
- Display: `Fraunces` (700/900) — distinctive serif
- Body: `Work Sans` (400/500)

**Colors:**
```css
:root {
    --bg-cream: #f5f3ee;
    --text-primary: #1a1a1a;
    --text-secondary: #555;
    --accent-warm: #e8d4c0;
}
```

**Signature Elements:**
- Abstract geometric shapes (circle outline + line + dot)
- Bold bordered CTA boxes
- Witty, conversational copy style
- **No illustrations—only geometric CSS shapes**

---

## Specialty Themes

### 9. Neon Cyber

**Vibe:** Futuristic, techy, confident

**Typography:** `Clash Display` + `Satoshi` (Fontshare)

**Colors:** Deep navy (#0a0f1c), cyan accent (#00ffcc), magenta (#ff00aa)

**Signature:** Particle backgrounds, neon glow, grid patterns

---

### 10. Terminal Green

**Vibe:** Developer-focused, hacker aesthetic

**Typography:** `JetBrains Mono` (monospace only)

**Colors:** GitHub dark (#0d1117), terminal green (#39d353)

**Signature:** Scan lines, blinking cursor, code syntax styling

---

### 11. Swiss Modern

**Vibe:** Clean, precise, Bauhaus-inspired

**Typography:** `Archivo` (800) + `Nunito` (400)

**Colors:** Pure white, pure black, red accent (#ff3300)

**Signature:** Visible grid, asymmetric layouts, geometric shapes

---

### 12. Paper & Ink

**Vibe:** Editorial, literary, thoughtful

**Typography:** `Cormorant Garamond` + `Source Serif 4`

**Colors:** Warm cream (#faf9f7), charcoal (#1a1a1a), crimson accent (#c41e3a)

**Signature:** Drop caps, pull quotes, elegant horizontal rules

---

## Font Pairing Quick Reference

| Preset | Display Font | Body Font | Source |
|--------|--------------|-----------|--------|
| Bold Signal | Archivo Black | Space Grotesk | Google |
| Electric Studio | Manrope | Manrope | Google |
| Creative Voltage | Syne | Space Mono | Google |
| Dark Botanical | Cormorant | IBM Plex Sans | Google |
| Notebook Tabs | Bodoni Moda | DM Sans | Google |
| Pastel Geometry | Plus Jakarta Sans | Plus Jakarta Sans | Google |
| Split Pastel | Outfit | Outfit | Google |
| Vintage Editorial | Fraunces | Work Sans | Google |
| Neon Cyber | Clash Display | Satoshi | Fontshare |
| Terminal Green | JetBrains Mono | JetBrains Mono | JetBrains |

---

## Japanese Presets (日本語最適化プリセット)

日本語スライドを作る場合、下記の 6 プリセットから選ぶ。どれも `slide-maker` スキルで検証済みの「日本のプレゼン現場で使える」構成。**必ず [JAPANESE.md](JAPANESE.md) を先に読んでから適用すること。**

各プリセットは欧文フォント + 日本語フォントのペアで構成される。`font-family` スタックは欧文→和文の順で記述する。

### JP-1. Dark Luxury 深紺 × ゴールド

**Vibe:** 高級感、重厚、IR資料、ラグジュアリーブランド、ファッション

**Typography:**
- Display: `Shippori Mincho` (700/900) — 和モダン明朝
- Body: `Noto Sans JP` (400/500)
- Latin: `Cormorant` (400/600)

**Colors:**
```css
:root {
    --bg-primary: #070710;
    --bg-secondary: #1a1a2e;
    --text-primary: #ffffff;
    --text-secondary: #e8e0d0;
    --text-muted: #9a9590;
    --accent-gold: #c9a961;
    --accent-teal: #2a9d8f;
}
```

**Signature:** 多層メッシュグラデーション背景、ノイズテクスチャ、ゴールド装飾ライン、Glassmorphism カード、縦書きタイトル可

---

### JP-2. Dark Tech 深青 × シアン × マゼンタ

**Vibe:** SaaS、DX、スタートアップ、テクノロジー、データドリブン

**Typography:**
- Display: `Zen Kaku Gothic New` (900)
- Body: `Zen Kaku Gothic New` (400/500)
- Latin: `Space Grotesk` (500/700)
- Mono: `JetBrains Mono` (400)

**Colors:**
```css
:root {
    --bg-primary: #05080f;
    --bg-secondary: #0d1b2a;
    --text-primary: #ffffff;
    --text-secondary: #c5d1e0;
    --text-muted: #7a8999;
    --accent-cyan: #00d4ff;
    --accent-magenta: #ff2d9a;
}
```

**Signature:** グリッドパターン背景、ネオングロー、モノスペース数値、シアン/マゼンタのコントラスト、グラデーションライン

---

### JP-3. Light Clean オフホワイト × ネイビー

**Vibe:** コンサル、マッキンゼー風、公的機関、B2B 提案

**Typography:**
- Display: `Noto Sans JP` (700/900)
- Body: `Noto Sans JP` (400/500)
- Latin: `Inter` (400/600/700)

**Colors:**
```css
:root {
    --bg-primary: #fafaf7;
    --bg-secondary: #ffffff;
    --text-primary: #0a1628;
    --text-secondary: #334155;
    --text-muted: #64748b;
    --accent-navy: #1e3a8a;
    --accent-red: #dc2626;
    --border-subtle: rgba(10, 22, 40, 0.08);
}
```

**Signature:** クリーンなカード、1px の薄いボーダー、8pt グリッド厳守、余白 40% 以上、アクセントレッド（警告・強調のみ）

---

### JP-4. Light Warm ベージュ × テラコッタ

**Vibe:** ヘルスケア、教育、NPO、食品、生活提案

**Typography:**
- Display: `Zen Maru Gothic` (700/900) — 温かい丸ゴシック
- Body: `Noto Sans JP` (400/500)
- Latin: `Work Sans` (400/500)

**Colors:**
```css
:root {
    --bg-primary: #faf7f0;
    --bg-secondary: #f5f1e8;
    --text-primary: #2d2420;
    --text-secondary: #5c4d42;
    --text-muted: #8a7968;
    --accent-terracotta: #c65d3a;
    --accent-olive: #7a8b3f;
}
```

**Signature:** 和紙風テクスチャ、角丸大きめ（16-24px）、手書き風ストローク、柔らかい影、ウォームトーン写真

---

### JP-5. Corporate Royal ライトグレー × ロイヤルブルー

**Vibe:** 企業報告書、IR、B2B 事業計画、年次報告

**Typography:**
- Display: `Noto Sans JP` (700)
- Body: `Noto Sans JP` (400)
- Latin: `Inter` (400/500/700)
- Numeric: `Inter` tabular-nums

**Colors:**
```css
:root {
    --bg-primary: #f0f2f5;
    --bg-secondary: #ffffff;
    --text-primary: #1a1a2e;
    --text-secondary: #4a5568;
    --text-muted: #8a95a5;
    --accent-royal: #1e40af;
    --accent-gray: #64748b;
    --grid-line: rgba(26, 26, 46, 0.06);
}
```

**Signature:** 精密なデータビジュアライゼーション、タブラー数字、控えめなシャドウ、縦書きセクション番号、垂直グリッド、凡例揃え

---

### JP-6. Dark Creative ダークパープル × ピンク

**Vibe:** メディア、エンタメ、クリエイティブエージェンシー、カルチャーイベント

**Typography:**
- Display: `Murecho` (900) or `Zen Kaku Gothic New` (900)
- Body: `Noto Sans JP` (500)
- Latin: `Syne` (700/800)

**Colors:**
```css
:root {
    --bg-primary: #0f0a1a;
    --bg-secondary: #1a1030;
    --text-primary: #ffffff;
    --text-secondary: #e0d0f0;
    --text-muted: #9a85b8;
    --accent-pink: #ff3d8a;
    --accent-orange: #ff9040;
    --accent-violet: #8b5cf6;
}
```

**Signature:** ビビッドなグラデーション、大胆なタイポグラフィ（全角 60px 超も可）、非対称レイアウト、ブラーリーク、ピンク/オレンジのダブルアクセント

---

## Japanese Font Pairing Reference

| Preset | Display (見出し) | Body (本文) | Latin | Google Fonts URL |
|--------|------|------|-------|------------------|
| JP-1 Dark Luxury | Shippori Mincho 900 | Noto Sans JP 400 | Cormorant | `family=Shippori+Mincho:wght@400;700;900&family=Noto+Sans+JP:wght@400;500;700&family=Cormorant:wght@400;600` |
| JP-2 Dark Tech | Zen Kaku Gothic New 900 | Zen Kaku Gothic New 500 | Space Grotesk + JetBrains Mono | `family=Zen+Kaku+Gothic+New:wght@400;500;700;900&family=Space+Grotesk:wght@500;700&family=JetBrains+Mono:wght@400` |
| JP-3 Light Clean | Noto Sans JP 900 | Noto Sans JP 400 | Inter | `family=Noto+Sans+JP:wght@400;500;700;900&family=Inter:wght@400;500;700` |
| JP-4 Light Warm | Zen Maru Gothic 700 | Noto Sans JP 400 | Work Sans | `family=Zen+Maru+Gothic:wght@400;500;700;900&family=Noto+Sans+JP:wght@400;500&family=Work+Sans:wght@400;500` |
| JP-5 Corporate | Noto Sans JP 700 | Noto Sans JP 400 | Inter | `family=Noto+Sans+JP:wght@400;500;700&family=Inter:wght@400;500;700` |
| JP-6 Dark Creative | Murecho 900 | Noto Sans JP 500 | Syne | `family=Murecho:wght@400;700;900&family=Noto+Sans+JP:wght@400;500;700&family=Syne:wght@700;800` |

**自動選択ロジック（ユーザーが選ばなかったとき）:**

| コンテンツの性質 | 推奨プリセット |
|---------------|-------------|
| 技術・DX・リサーチレポート | JP-2 Dark Tech |
| IR・高級ブランド・投資家向け | JP-1 Dark Luxury |
| コンサル・提案書・官公庁 | JP-3 Light Clean |
| ヘルスケア・教育・NPO | JP-4 Light Warm |
| 企業年次報告・財務 | JP-5 Corporate Royal |
| クリエイティブ・メディア | JP-6 Dark Creative |

---

## DO NOT USE (Generic AI Patterns)

**Fonts:** Inter, Roboto, Arial, system fonts as display

**Colors:** `#6366f1` (generic indigo), purple gradients on white

**Layouts:** Everything centered, generic hero sections, identical card grids

**Decorations:** Realistic illustrations, gratuitous glassmorphism, drop shadows without purpose

---

## CSS Gotchas

### Negating CSS Functions

**WRONG — silently ignored by browsers (no console error):**
```css
right: -clamp(28px, 3.5vw, 44px);   /* Browser ignores this */
margin-left: -min(10vw, 100px);      /* Browser ignores this */
```

**CORRECT — wrap in `calc()`:**
```css
right: calc(-1 * clamp(28px, 3.5vw, 44px));  /* Works */
margin-left: calc(-1 * min(10vw, 100px));     /* Works */
```

CSS does not allow a leading `-` before function names. The browser silently discards the entire declaration — no error, the element just appears in the wrong position. **Always use `calc(-1 * ...)` to negate CSS function values.**

