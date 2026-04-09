# Frontend Slides

一個 Claude Code 技能（Skill），用來製作精美、富有動畫效果的 HTML 簡報：可以從零開始建立，也可以將現有的 PowerPoint 檔案轉換成網頁簡報。

## 這個工具能做什麼？

**Frontend Slides** 幫助不擅長設計的人，在不需要懂 CSS 或 JavaScript 的情況下，製作出高品質的網頁簡報。它採用「看了再選」的方式：不用你費力描述想要的風格，而是直接產生多個視覺預覽，讓你挑選最喜歡的樣式。

以下是用這個技能製作的簡報展示影片：

https://github.com/user-attachments/assets/ef57333e-f879-432a-afb9-180388982478

### 核心特色

- **零依賴**：產出的是單一 HTML 檔案，CSS 和 JS 全部內嵌。不需要 npm、不需要建置工具、不需要任何框架。直接用瀏覽器開啟就能播放。
- **視覺化風格探索**：不知道自己喜歡什麼風格？沒關係。系統會自動產生多個視覺預覽，你只需要看圖選擇。
- **PPT 轉換**：可以將現有的 PowerPoint 檔案轉換成網頁簡報，保留所有圖片和內容，告別傳統 PPT 的侷限。
- **拒絕 AI 罐頭風格**：精心設計的獨特風格，避免千篇一律的 AI 生成美學（告別那些紫色漸層白底的老套設計）。
- **正式品質**：產出的程式碼符合無障礙標準、支援響應式設計，並附有詳細的註解，方便你後續客製化調整。

## 安裝方式

### Claude Code 使用者

將技能檔案複製到你的 Claude Code 技能目錄：

```bash
# 建立技能目錄
mkdir -p ~/.claude/skills/frontend-slides/scripts

# 複製所有檔案（或直接 clone 這個 repo）
cp SKILL.md STYLE_PRESETS.md viewport-base.css html-template.md animation-patterns.md ~/.claude/skills/frontend-slides/
cp scripts/extract-pptx.py ~/.claude/skills/frontend-slides/scripts/
```

或是直接 clone：

```bash
git clone https://github.com/zarazhangrui/frontend-slides.git ~/.claude/skills/frontend-slides
```

安裝完成後，在 Claude Code 中輸入 `/frontend-slides` 即可使用。

## 使用方式

### 從零開始建立簡報

```
/frontend-slides

> "我想為我的 AI 新創公司做一份 pitch deck"
```

技能會依序進行以下步驟：

1. **蒐集內容**：詢問你的簡報內容（投影片、想傳達的訊息、圖片素材等）
2. **了解風格偏好**：詢問你希望呈現的感覺（專業穩重？活力充沛？沈穩內斂？）
3. **產生風格預覽**：自動產生 3 個視覺風格預覽讓你比較選擇
4. **生成完整簡報**：根據你選擇的風格，生成完整的 HTML 簡報
5. **即時預覽**：自動在瀏覽器中開啟簡報

### 轉換 PowerPoint 檔案

```
/frontend-slides

> "把我的 presentation.pptx 轉換成網頁簡報"
```

技能會依序進行以下步驟：

1. **擷取內容**：從 PPT 中提取所有文字、圖片和備忘稿
2. **確認內容**：顯示擷取的內容讓你確認是否正確
3. **選擇風格**：讓你從預設風格中挑選喜歡的樣式
4. **生成網頁簡報**：使用你的原始素材，生成一份完整的 HTML 簡報

## 內建風格

### 深色主題

- **Bold Signal（大膽信號）**：自信、高衝擊力，深色背景上搭配鮮明的色彩卡片
- **Electric Studio（電力工作室）**：乾淨、專業，採用分割面板式的排版
- **Creative Voltage（創意電壓）**：充滿活力、復古與現代混搭，電藍色搭配霓虹色調
- **Dark Botanical（暗夜植物園）**：優雅、精緻，以暖色調點綴的深色系風格

### 淺色主題

- **Notebook Tabs（筆記本標籤）**：編輯風格、有組織感，像紙張搭配彩色標籤頁
- **Pastel Geometry（粉彩幾何）**：親和、平易近人，使用直式膠囊形狀的色塊
- **Split Pastel（分割粉彩）**：活潑、現代，雙色直式分割的版面配置
- **Vintage Editorial（復古編輯）**：俏皮、有個性，搭配幾何圖形裝飾

### 特殊主題

- **Neon Cyber（霓虹賽博）**：未來感十足，粒子效果背景搭配霓虹光暈
- **Terminal Green（終端綠）**：面向開發者，模擬終端機的駭客美學風格
- **Swiss Modern（瑞士現代）**：極簡風格，靈感來自包浩斯設計，強調幾何構成
- **Paper & Ink（紙與墨）**：文學氣息，使用首字放大、抽言引用等排版技巧

## 架構設計

這個技能採用**漸進式揭露（Progressive Disclosure）**的設計模式。主檔案 `SKILL.md` 是一份精簡的地圖（約 180 行），其他支援檔案只在需要時才動態載入：

| 檔案 | 用途 | 載入時機 |
| ------------------------- | ------------------------------ | ------------------------- |
| `SKILL.md` | 核心工作流程與規則 | 永遠載入（技能啟動時） |
| `STYLE_PRESETS.md` | 12 種精選視覺風格預設 | 第 2 階段（風格選擇） |
| `viewport-base.css` | 必要的響應式 CSS 基礎樣式 | 第 3 階段（簡報生成） |
| `html-template.md` | HTML 結構與 JS 功能說明 | 第 3 階段（簡報生成） |
| `animation-patterns.md` | CSS/JS 動畫效果參考 | 第 3 階段（簡報生成） |
| `scripts/extract-pptx.py` | PPT 內容擷取腳本 | 第 4 階段（PPT 轉換） |
| `scripts/deploy.sh` | 部署到 Vercel | 第 6 階段（分享） |
| `scripts/export-pdf.sh` | 匯出為 PDF | 第 6 階段（分享） |

這個設計理念遵循了 [OpenAI 的 Harness Engineering](https://openai.com/index/harness-engineering/) 原則：「給 Agent 一張地圖，而不是一本千頁的操作手冊。」

## 設計哲學

這個技能誕生於以下信念：

1. **你不需要是設計師也能做出漂亮的東西。** 你只需要看到成品後，選出自己喜歡的就好。設計直覺人人都有，差別只在工具是否夠好用。

2. **依賴就是負債。** 一個單一的 HTML 檔案，10 年後照樣能開。一個 2019 年的 React 專案？祝你好運搞定那些過時的套件。

3. **通用等於平庸。** 每一份簡報都應該像是量身打造，而不是套模板產出的罐頭貨。

4. **註解是一種善良。** 程式碼應該能夠自我解釋，對未來的自己（或任何打開這份檔案的人）都友善。

## 分享你的簡報

簡報製作完成後，提供兩種分享方式：

### 部署為線上網址

一個指令就能把簡報部署成永久的線上網址，在手機、平板、筆電上都能正常瀏覽：

```bash
bash scripts/deploy.sh ./my-deck/
# 或
bash scripts/deploy.sh ./presentation.html
```

使用 [Vercel](https://vercel.com) 平台（免費方案即可）。如果你是第一次使用，技能會引導你完成註冊和登入流程。

### 匯出為 PDF

將簡報轉換為 PDF 檔案，方便透過 Email、Slack、Notion 分享，或是直接列印：

```bash
bash scripts/export-pdf.sh ./my-deck/index.html
bash scripts/export-pdf.sh ./presentation.html ./output.pdf
```

使用 [Playwright](https://playwright.dev) 對每一張投影片以 1920×1080 解析度截圖，再合併成 PDF。Playwright 會在需要時自動安裝。注意：動畫效果不會被保留（PDF 是靜態截圖）。

## 系統需求

- [Claude Code](https://claude.ai/claude-code) CLI（必要）
- PPT 轉換功能：需要 Python 並安裝 `python-pptx` 套件
- 線上部署功能：需要 Node.js 和 Vercel 帳號（免費方案即可）
- PDF 匯出功能：需要 Node.js（Playwright 會自動安裝）

## 致謝

由 [@zarazhangrui](https://github.com/zarazhangrui) 使用 Claude Code 建立。

繁體中文翻譯由 [@hanslin](https://github.com/hanslin) 貢獻。

靈感來自「Vibe Coding」哲學：不需要是傳統的軟體工程師，也能打造出美麗的作品。

## 授權條款

MIT 授權：自由使用、修改、分享。
