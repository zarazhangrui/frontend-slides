# Japanese Slides Guide (日本語スライド制作ガイド)

日本語スライドを作成するときに **必ず** 読むファイル。英語向けデフォルトのままでは豆腐文字・禁則違反・可読性不足が発生する。

このドキュメントは `slide-maker` スキルの日本語ノウハウと、Web タイポグラフィのベストプラクティスを統合している。

---

## 1. 言語検出ルール (Phase 0.5)

以下のいずれかに該当したら **日本語モード**（Japanese mode）で生成する:

- ユーザーのメッセージが日本語（ひらがな・カタカナ・漢字を含む）
- ユーザーが "日本語で" "Japanese" と明示
- 提供されたコンテンツ（テキスト・PPTX）に日本語が含まれる
- `lang=ja` / 日本向けの用途（IR資料、官公庁、国内B2B 等）と明言

判断に迷ったら **AskUserQuestion** で確認する。混在（日英バイリンガル）の場合は日本語モードで生成し、英語は強調セリフ的に扱う。

---

## 2. フォント戦略

### 必須: Google Fonts で日本語ウェブフォントを読み込む

システムフォント（Hiragino, Yu Gothic, Meiryo, MS Gothic）に依存しない。OS やブラウザによって見た目が変わり、豆腐文字や崩れの原因になる。

### 推奨フォント一覧（すべて Google Fonts）

| 用途 | フォント | ウェイト | キャラクター |
|------|---------|---------|-------------|
| **汎用ゴシック（第一候補）** | `Noto Sans JP` | 300/400/500/700/900 | 無難で高品質。どのプリセットでも使える保険 |
| **モダンゴシック** | `Zen Kaku Gothic New` | 400/500/700/900 | Noto より柔らかく、プレゼン向き |
| **丸ゴシック** | `Zen Maru Gothic` | 400/500/700 | 温かみ。ヘルスケア・教育・NPO |
| **カジュアルゴシック** | `M PLUS 1p` / `M PLUS Rounded 1c` | 400/500/700/900 | 親しみやすい。スタートアップ |
| **ディスプレイゴシック** | `Murecho` | 400/700/900 | 表情のあるゴシック。エディトリアル系 |
| **ドット系** | `DotGothic16` | 400 | レトロ・ゲーミング |
| **明朝（モダン）** | `Shippori Mincho` | 400/500/700/900 | 上品・高級感。ラグジュアリー・IR |
| **明朝（クラシック）** | `Zen Old Mincho` | 400/500/700/900 | 伝統・文学・和モダン |
| **明朝（細身）** | `Noto Serif JP` | 300/400/500/700 | 読書感。長文・思想的テーマ |
| **ディスプレイ明朝** | `Reenie Beanie` ✗ → `Kaisei Decol` | 400/500/700 | 特徴的な見出し用 |

### 読み込み方（1 URL でまとめる）

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700;900&family=Shippori+Mincho:wght@400;500;700;900&display=swap" rel="stylesheet">
```

**重要**: `display=swap` を必ず付ける。付けないと日本語フォントロード中に真っ白になる。

### 英字との併用（和欧混植）

日本語フォントの英字グリフは美しくない場合が多い。欧文と和文は別フォントで組むのが基本:

```css
:root {
    --font-latin: 'Inter', 'Space Grotesk', sans-serif;
    --font-jp: 'Noto Sans JP', sans-serif;
}

body {
    /* 英字は Inter、日本語は Noto Sans JP にフォールバック */
    font-family: var(--font-latin), var(--font-jp);
    font-feature-settings: "palt" 1; /* 和文プロポーショナル */
}
```

この順序だと、英数字は Inter で描画され、日本語はブラウザが自動的に Noto Sans JP で描画する。

---

## 3. タイポグラフィ規定

### フォントサイズ（1920×1080 想定・最低値）

英語スライドよりも **大きめ** に設定する。日本語は字面が複雑で、小さくすると一気に読めなくなる。

| 要素 | 最小 | 推奨 | 備考 |
|------|-----|------|------|
| スライドタイトル (h1/h2) | `clamp(1.75rem, 4.5vw, 3.5rem)` | 48-64px | 太字 700-900 |
| セクションラベル | `clamp(0.75rem, 1.2vw, 1rem)` | 12-16px | uppercase 英字 or 日本語カタカナ、letter-spacing 0.15em |
| カード見出し (h3) | `clamp(1.1rem, 2vw, 1.5rem)` | 18-24px | 太字 700 |
| 本文 | `clamp(1rem, 1.5vw, 1.25rem)` | **18-20px 以上** | これ未満は禁止 |
| 注釈・タグ | `clamp(0.85rem, 1vw, 1rem)` | 14-16px | **14px 未満禁止** |
| **絶対最小** | `14px` | — | ユーザー注記含めこれ未満は NG |

英語版のデフォルト `--body-size: clamp(0.75rem, 1.5vw, 1.125rem)` (12-18px) は日本語では **小さすぎる**。日本語モードでは下記にオーバーライドする:

```css
:root[lang="ja"], [lang="ja"] {
    --title-size: clamp(1.75rem, 4.5vw, 3.5rem);
    --h2-size: clamp(1.4rem, 3.2vw, 2.5rem);
    --h3-size: clamp(1.1rem, 2vw, 1.5rem);
    --body-size: clamp(1rem, 1.5vw, 1.25rem);
    --small-size: clamp(0.85rem, 1vw, 1rem);
}
```

### 行間（line-height）

日本語は英語より行間を広げる。字面が詰まるため:

| 要素 | line-height |
|------|-------------|
| 見出し（大） | 1.2〜1.35 |
| 見出し（小） | 1.35〜1.5 |
| 本文 | **1.7〜1.9** |
| 注釈 | 1.5〜1.65 |

### letter-spacing（字間）

- **日本語本文**: `letter-spacing: 0.02em`〜`0.05em`（ゆったり）
- **日本語見出し**: `letter-spacing: 0.05em`〜`0.1em`（「ブランド感」を出す）
- **カタカナのみの見出し**: `letter-spacing: 0.1em`〜`0.2em`（特にタイト）
- **英字 uppercase**: `letter-spacing: 0.08em`〜`0.15em`

`palt` 機能（プロポーショナルメトリクス）を有効にすると、自動的に字詰めされる:

```css
body {
    font-feature-settings: "palt" 1;
}
```

見出しだけに使いたい場合:

```css
h1, h2, h3, .section-label {
    font-feature-settings: "palt" 1;
}
```

---

## 4. 禁則処理・改行制御

### word-break と line-break

日本語のデフォルト（`word-break: normal`）は長い英単語を折り返さないため、コンテナから溢れる。

```css
/* 日本語コンテンツ全般のデフォルト */
.slide[lang="ja"], [lang="ja"] p, [lang="ja"] li, [lang="ja"] h1, [lang="ja"] h2, [lang="ja"] h3 {
    /* 文節単位で改行（Safari 17+, Chrome 119+ で対応、未対応環境では normal にフォールバック） */
    word-break: auto-phrase;
    line-break: strict;        /* 禁則を厳しめに */
    overflow-wrap: anywhere;   /* 超長URL対策 */
    hanging-punctuation: allow-end; /* 行末句読点のぶら下げ（Safari のみ） */
}
```

**`word-break: auto-phrase` の効果**: 「AIスタートアップの」「ピッチデッキ」のような自然な文節で改行される。未対応ブラウザでは `normal` と同じ挙動（単語境界優先）になるので安全。

### 禁則文字の扱い

CSS の `line-break: strict` を指定すれば、以下が自動的に守られる:

- 行頭禁則: `、。）」』〉》〕］｝・…゛゜ゝゞ々ー`
- 行末禁則: `（「『〈《〔［｛`

### 手動の改行（`<br>` / `<wbr>`）

- 見出しで意図的に 2 行にしたいときは `<br>` を使う
- 長い固有名詞で折り返しを許可したい箇所には `<wbr>` を入れる

```html
<h2>AI<wbr>スタートアップの<br>ピッチデッキ</h2>
```

### 句読点のぶら下げ

Safari のみ `hanging-punctuation: allow-end` が効く。Chrome はまだ未対応だが、指定しておけば将来的に有効化される。

---

## 5. コンテンツ密度（Japanese Content Density Limits）

日本語は英語より **情報密度が高い** ため、1スライドあたりの要素数を減らす。英語版の上限をそのまま使うと詰め込みになる。

| スライド種別 | 英語デフォルト | **日本語推奨** |
|------------|---------------|--------------|
| タイトル | 見出し1 + サブ1 + タグ | 見出し1 + サブ1（タグ任意） |
| 箇条書き | 4-6 項目 | **3-5 項目** |
| 項目あたりの文字数 | — | **全角 25 字以内を強く推奨**（超えたら2行 or 分割） |
| 特徴グリッド | 6 カード | **4 カード**（2x2）が上限 |
| コードスライド | 8-10 行 | 8-10 行（変更なし） |
| 引用 | 3 行 | **2 行、40字以内** |
| 画像スライド | 見出し1 + 画像1 | 見出し1 + 画像1（キャプション任意） |

**原則**: 「情報量 > 視認性」は絶対 NG。情報が多ければ **スライドを増やす**。字を小さくするのは最終手段ですらない。

### 見出しの長さ

- スライドタイトル: **全角 20 字以内**（超えるなら2行に分ける）
- セクションラベル: **全角 10 字以内** or 英字短縮

### 英数字の混在

「DX」「SaaS」「ROI」などの略語は英字（半角）で OK。全角英数字は読みづらいので避ける。

---

## 6. よくある失敗と対策

| 症状 | 原因 | 対策 |
|------|------|------|
| **豆腐文字 (□□□)** | 日本語フォントが読み込まれていない | Google Fonts の `Noto Sans JP` を必ず読み込む |
| **見出しが中途半端に改行** | `word-break` 未指定 | `word-break: auto-phrase; line-break: strict;` |
| **本文が小さくて読めない** | 英語用 `clamp()` のまま | 日本語用オーバーライドを適用 |
| **英字と和文でバランス崩れ** | 単一フォントスタック | 欧文先、和文後のフォントスタック |
| **カタカナ見出しが詰まる** | letter-spacing なし | `letter-spacing: 0.08em` 以上 |
| **句読点で変な改行** | line-break 未指定 | `line-break: strict` |
| **長い固有名詞で溢れる** | overflow-wrap 未指定 | `overflow-wrap: anywhere` |
| **明朝体が細すぎて投影で消える** | ウェイト 400 使用 | 投影・プレゼン用は **500 以上** |

### フォント読み込みの検証

プレゼン生成後、`.slide` に次のような CSS を仕込んで豆腐化していないか検知できる（任意）:

```css
/* 日本語フォントが読み込めなかったときにわかる警告 */
body {
    font-family: 'Noto Sans JP', 'Source Han Sans JP', 'Hiragino Sans', 'Yu Gothic', sans-serif;
}
```

フォールバックを段階的に記述することで、万一の時にも崩壊を防ぐ。

---

## 7. 日本語特有のビジュアル要素

### 縦書き（`writing-mode: vertical-rl`）

タイトルスライドで縦書きを使うと一気に「和」の雰囲気が出る。ただし多用は禁物:

```css
.vertical-title {
    writing-mode: vertical-rl;
    text-orientation: mixed;
    letter-spacing: 0.2em;
    font-family: 'Shippori Mincho', serif;
    font-weight: 700;
}
```

**推奨プリセット**: Shippori Mincho, Zen Old Mincho, Noto Serif JP

### 和モダンな装飾

- **墨流し**: SVG feTurbulence で墨のゆらぎを表現
- **朱色アクセント**: `#c8102e`（伝統的な朱）、`#ad002d`（深朱）
- **金箔感**: `linear-gradient(135deg, #c9a961, #e8d794, #c9a961)` + subtle shadow
- **和紙テクスチャ**: 淡いノイズ + warm cream 背景（`#f5f1e8`, `#faf7f0`）

### 英語ではしないこと

- 絵文字はプレゼンで使わない（カジュアル過ぎる・環境依存で崩れる）
- 「！」「？」の全角は避け、文脈に応じて半角に（見出しは全角でも可）

---

## 8. 適用チェックリスト

日本語スライドを生成したら、以下をすべて満たしているか自己確認:

- [ ] `<html lang="ja">` が指定されている
- [ ] Google Fonts で日本語フォントを読み込んでいる（`Noto Sans JP` 等）
- [ ] `display=swap` 付き
- [ ] `font-family` のスタックで欧文→和文の順に指定している
- [ ] `font-feature-settings: "palt" 1` が body か見出しに指定されている
- [ ] `word-break: auto-phrase` と `line-break: strict` が指定されている
- [ ] `overflow-wrap: anywhere` が長文要素に指定されている
- [ ] 本文 `font-size` が 18px 以上（clamp min 1rem 以上）
- [ ] 注釈 `font-size` が 14px 以上
- [ ] line-height が 1.7 以上（本文）
- [ ] 箇条書きが 1 スライド 5 項目以下
- [ ] 見出しが全角 20 字以内
- [ ] タイトル・見出しにだけウェイト 700 以上を使っている
- [ ] 豆腐文字が出ていない（生成後に目視 or Playwright で確認）

---

## 9. 英日バイリンガル対応

国際会議・投資家向けピッチで日英併記が必要な場合:

```html
<h1 class="bilingual">
    <span class="lang-jp">AIスタートアップの未来</span>
    <span class="lang-en">The Future of AI Startups</span>
</h1>
```

```css
.bilingual .lang-jp {
    font-family: 'Shippori Mincho', serif;
    font-size: clamp(1.75rem, 4vw, 3rem);
    font-weight: 700;
    display: block;
}

.bilingual .lang-en {
    font-family: 'Cormorant', serif;
    font-size: clamp(1rem, 2vw, 1.5rem);
    font-weight: 400;
    font-style: italic;
    opacity: 0.7;
    display: block;
    margin-top: 0.5em;
}
```

日本語を「主」、英語を「従」として扱うと上品に収まる。逆に英語を主にしたい場合は順序とサイズを逆転させる。

---

## 10. 関連ファイル

- [STYLE_PRESETS.md](STYLE_PRESETS.md) — "Japanese Presets" セクションに日本語最適化プリセットあり
- [viewport-base.css](viewport-base.css) — `[lang="ja"]` セレクタで日本語向けオーバーライド済み
- [html-template.md](html-template.md) — "Japanese Mode" セクションにテンプレートあり
- [SKILL.md](SKILL.md) — Phase 0.5 で言語検出ロジック定義
