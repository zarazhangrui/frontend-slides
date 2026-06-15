/* Frontend Slides Visual Deck Editor runtime. Source baseline: 1ba9bf0. */
(function () {
  const EDITOR_HTML = `
<div class="edit-hotzone" aria-hidden="true"></div>
  <button class="edit-toggle" id="editToggle" title="Edit mode (E)" aria-label="Toggle edit mode">E</button>
  <div class="editor-shell" id="editorShell" aria-label="演示编辑器">
    <div class="editor-toolbar" role="toolbar" aria-label="编辑工具">
      <button class="editor-button" id="helpBtn" type="button">编辑器功能介绍</button>
      <button class="editor-button editor-icon-button" id="undoBtn" type="button" title="撤回 (Cmd/Ctrl+Z)" aria-label="撤回" disabled>↶</button>
      <button class="editor-button editor-icon-button" id="redoBtn" type="button" title="重做 (Cmd/Ctrl+Shift+Z)" aria-label="重做" disabled>↷</button>
      <button class="editor-button" id="addTextBtn" type="button">添加文字框</button>
      <button class="editor-button" id="addImageBtn" type="button">添加图片</button>
      <div class="shape-picker-wrap">
        <button class="editor-button" id="addShapeBtn" type="button" aria-haspopup="menu" aria-expanded="false">添加形状</button>
      </div>
      <button class="editor-button primary" id="saveBtn" type="button">保存</button>
      <button class="editor-button danger" id="exitEditBtn" type="button">退出编辑</button>
    </div>
    <div class="editor-help-modal" id="editorHelp" role="dialog" aria-modal="true" aria-labelledby="editorHelpTitle" hidden>
      <div class="editor-help-card">
        <div class="editor-help-header">
          <h2 class="editor-help-title" id="editorHelpTitle">编辑器使用介绍</h2>
          <button class="editor-help-close" id="helpCloseBtn" type="button" aria-label="关闭">×</button>
        </div>
        <div class="editor-help-body">
          <section class="editor-help-section">
            <h3>打开和选择</h3>
            <p>按 E 或点左上角按钮进入编辑。点选画面里的文字、图片、背景图或视觉块后，右侧面板会显示可编辑属性。</p>
          </section>
          <section class="editor-help-section">
            <h3>内容和图片</h3>
            <ul>
              <li>文字在右侧 Content 区修改，双击文字会自动聚焦到文字输入框。</li>
              <li>拖入图片到画面可新增图片；选中图片后拖入或选择文件会替换它。</li>
              <li>未标记的普通 HTML 也会自动识别常见文本、图片、背景图、SVG/canvas 和有边框/背景的视觉块。</li>
            </ul>
          </section>
          <section class="editor-help-section">
            <h3>布局和样式</h3>
            <p>拖动选框移动元素，拖右下角改变尺寸；右侧 Layout 可以精确输入位置和大小。拖动时会出现对齐参考线，方便和画面中心或其他元素吸附。</p>
          </section>
          <section class="editor-help-section">
            <h3>动效和保存</h3>
            <ul>
              <li>Motion 区可以设置入场方式、出现顺序、延迟和时长，并支持预览当前元素或重播本页。</li>
              <li>选中元素后可拖动、缩放，点选框右上角 × 或按 Delete/Backspace 删除；撤回用 ↶ 或 Cmd/Ctrl+Z，重做用 ↷ 或 Cmd/Ctrl+Shift+Z。</li>
              <li>保存会优先覆盖你授权的 index.html；浏览器不支持覆盖写入时，会退回为下载当前 HTML。</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
    <div class="editor-help-modal" id="resetHelp" role="dialog" aria-modal="true" aria-labelledby="resetHelpTitle" hidden>
      <div class="editor-help-card">
        <div class="editor-help-header">
          <h2 class="editor-help-title" id="resetHelpTitle">重置编辑说明</h2>
          <button class="editor-help-close" id="resetHelpCloseBtn" type="button" aria-label="关闭">×</button>
        </div>
        <div class="editor-help-body">
          <section class="editor-help-section">
            <h3>它会清除什么</h3>
            <p>重置编辑只清除当前浏览器为这份 HTML 自动保存的本地草稿，也就是 localStorage 里的编辑记录和旧版草稿记录。</p>
          </section>
          <section class="editor-help-section">
            <h3>它不会清除什么</h3>
            <p>重置本身不会删除或改写任何 HTML 文件，包括你刚保存或覆盖过的 index.html；它只动当前浏览器里的草稿记录。</p>
          </section>
          <section class="editor-help-section">
            <h3>和保存的关系</h3>
            <p>“保存”会把当前画面写入你授权的 HTML 文件；如果浏览器不支持覆盖写入，就下载新的 index.html。“重置编辑”只是清掉当前浏览器的自动草稿。刷新后页面会重新读取 HTML 文件本身，不再叠加草稿；如果这个文件之前已经被覆盖保存过，刷新后看到的仍然是已保存后的内容。如果刷新前又点保存，保存的仍然是当前屏幕上的内容。</p>
          </section>
        </div>
      </div>
    </div>
    <div class="editor-help-modal" id="editorConfirm" role="dialog" aria-modal="true" aria-labelledby="editorConfirmTitle" hidden>
      <div class="editor-help-card">
        <div class="editor-help-header">
          <h2 class="editor-help-title" id="editorConfirmTitle">确认操作</h2>
          <button class="editor-help-close" id="editorConfirmCloseBtn" type="button" aria-label="关闭">×</button>
        </div>
        <div class="editor-help-body">
          <p class="editor-confirm-message" id="editorConfirmMessage"></p>
          <div class="editor-confirm-actions">
            <button class="editor-button" id="editorConfirmCancelBtn" type="button">取消</button>
            <button class="editor-button danger" id="editorConfirmOkBtn" type="button">确认</button>
          </div>
        </div>
      </div>
    </div>
    <div class="shape-menu" id="shapeMenu" role="menu" hidden>
      <button class="shape-choice" type="button" data-shape-choice="rect">矩形</button>
      <button class="shape-choice" type="button" data-shape-choice="roundRect">圆角矩形</button>
      <button class="shape-choice" type="button" data-shape-choice="circle">圆形</button>
      <button class="shape-choice" type="button" data-shape-choice="triangle">三角形</button>
      <button class="shape-choice" type="button" data-shape-choice="line">直线</button>
      <button class="shape-choice" type="button" data-shape-choice="arrow">箭头</button>
    </div>
    <aside class="editor-slides" aria-label="幻灯片列表">
      <p class="editor-title">Slides</p>
      <div class="slide-rail-list" id="slideRail"></div>
    </aside>
    <aside class="editor-panel" aria-label="属性面板">
      <section class="inspector-section">
        <p class="editor-title">Selection</p>
        <div class="selection-name" id="selectionName">未选中元素</div>
        <div class="drop-zone" id="imageDropZone">拖图片到这里，或拖到画面里<br>可替换选中图片，也可新增图片</div>
      </section>
      <section class="inspector-section">
        <p class="editor-title">Content</p>
        <label class="field-label" for="textInput">文字</label>
        <p class="field-help">点选或双击文字后，在这里改内容；画面中不直接输入。</p>
        <textarea class="editor-textarea" id="textInput" disabled></textarea>
        <label class="field-label" for="imageInput">图片文件</label>
        <div class="file-picker-row">
          <button class="editor-button" id="imagePickBtn" type="button" disabled>选择图片</button>
          <span class="file-name" id="imageFileName">未选择图片</span>
          <input class="file-input-hidden" id="imageInput" type="file" accept="image/*" disabled tabindex="-1">
        </div>
        <label class="field-label" for="shapeInput">形状类型</label>
        <select class="editor-select" id="shapeInput" disabled>
          <option value="rect">矩形</option>
          <option value="roundRect">圆角矩形</option>
          <option value="circle">圆形</option>
          <option value="triangle">三角形</option>
          <option value="line">直线</option>
          <option value="arrow">箭头</option>
        </select>
      </section>
      <section class="inspector-section">
        <p class="editor-title">Style</p>
        <label class="field-label" for="fontFamilyInput">字体</label>
        <select class="editor-select" id="fontFamilyInput" disabled>
          <option value="">跟随原样式</option>
          <option value="var(--font-body)">正文无衬线</option>
          <option value="var(--font-display-cjk)">中文标题衬线</option>
          <option value="var(--font-display)">英文衬线</option>
          <option value="var(--font-mono)">等宽代码</option>
        </select>
        <div class="field-grid">
          <label><span class="field-label">字号</span><input class="editor-field" id="fontSizeInput" type="number" min="8" max="220" disabled></label>
          <label><span class="field-label">颜色</span><input class="editor-field" id="colorInput" type="color" disabled></label>
        </div>
        <div class="field-grid">
          <label><span class="field-label">背景</span><input class="editor-field" id="bgInput" type="color" disabled></label>
          <label><span class="field-label">透明</span><input class="editor-field" id="opacityInput" type="number" min="0" max="100" step="5" disabled></label>
        </div>
      </section>
      <section class="inspector-section">
        <p class="editor-title">Layout</p>
        <div class="field-grid">
          <label><span class="field-label">X</span><input class="editor-field" id="xInput" type="number" disabled></label>
          <label><span class="field-label">Y</span><input class="editor-field" id="yInput" type="number" disabled></label>
        </div>
        <div class="field-grid">
          <label><span class="field-label">宽</span><input class="editor-field" id="widthInput" type="number" min="10" disabled></label>
          <label><span class="field-label">高</span><input class="editor-field" id="heightInput" type="number" min="10" disabled></label>
        </div>
        <div class="inspector-actions">
          <button class="editor-button" id="bringForwardBtn" type="button" disabled>上移层级</button>
          <button class="editor-button" id="sendBackwardBtn" type="button" disabled>下移层级</button>
        </div>
      </section>
      <section class="inspector-section">
        <p class="editor-title">Motion</p>
        <p class="motion-status" id="motionStatus">未选中元素</p>
        <label class="field-label" for="animSelect">入场方式</label>
        <select class="editor-select" id="animSelect" disabled>
          <option value="">跟随原始</option>
          <option value="none">无</option>
          <option value="fade">淡入</option>
          <option value="rise">上浮</option>
          <option value="drop">下落</option>
          <option value="left">左侧滑入</option>
          <option value="right">右侧滑入</option>
          <option value="scale">缩放入场</option>
          <option value="zoom">缩小落定</option>
          <option value="pop">弹出</option>
          <option value="rotate">旋入</option>
          <option value="blur">模糊显现</option>
          <option value="flip">翻转入场</option>
        </select>
        <div class="field-grid">
          <label><span class="field-label">顺序</span><input class="editor-field" id="motionOrderInput" type="number" min="1" step="1" disabled></label>
          <label><span class="field-label">延迟 ms</span><input class="editor-field" id="delayInput" type="number" min="0" step="50" disabled></label>
        </div>
        <div class="field-grid">
          <label><span class="field-label">时长 ms</span><input class="editor-field" id="durationInput" type="number" min="100" step="50" disabled></label>
        </div>
        <div class="inspector-actions">
          <button class="editor-button" id="previewMotionBtn" type="button" disabled>预览当前</button>
          <button class="editor-button" id="previewSlideMotionBtn" type="button">重播本页</button>
        </div>
        <div class="inspector-actions">
          <button class="editor-button" id="restoreMotionBtn" type="button" disabled>恢复原始</button>
        </div>
      </section>
      <section class="inspector-section">
        <div class="inspector-actions">
          <button class="editor-button danger" id="deleteBtn" type="button" disabled>删除</button>
          <div class="reset-action-group">
            <button class="editor-button" id="resetBtn" type="button">重置编辑</button>
            <button class="reset-help-button" id="resetHelpBtn" type="button" title="重置编辑说明" aria-label="重置编辑说明">?</button>
          </div>
        </div>
      </section>
    </aside>
    <div class="editor-guide vertical" id="editorGuideV" aria-hidden="true"></div>
    <div class="editor-guide horizontal" id="editorGuideH" aria-hidden="true"></div>
    <div class="editor-frame" id="editorFrame" aria-hidden="true">
      <div class="frame-move" id="frameMove">拖动</div>
      <button class="frame-delete" id="frameDelete" type="button" title="删除选中元素 (Delete)" aria-label="删除选中元素">×</button>
      <div class="frame-resize" id="frameResize"></div>
    </div>
    <div class="editor-toast" id="editorToast" role="status" aria-live="polite"></div>
  </div>
`;

  function editorRootExists() {
    return Boolean(document.getElementById("editorShell") && document.getElementById("editToggle"));
  }

  function ensureEditorDom() {
    if (editorRootExists()) return;
    document.body.insertAdjacentHTML("beforeend", EDITOR_HTML);
  }

  function getStage() {
    return document.getElementById("deckStage") || document.querySelector(".deck-stage");
  }

  function computeCurrentSlide(slides) {
    const activeIndex = slides.findIndex((slide) => slide.classList.contains("active") || slide.classList.contains("visible"));
    return activeIndex >= 0 ? activeIndex : 0;
  }

  function defaultScaleStage(stage) {
    const editing = document.body.classList.contains("editing") || document.body.classList.contains("editor-on");
    const compactEditor = editing && window.innerWidth <= 960;
    const editorInsets = editing
      ? compactEditor
        ? { left: 12, right: 12, top: 150, bottom: 260 }
        : { left: 252, right: 354, top: 78, bottom: 20 }
      : { left: 0, right: 0, top: 0, bottom: 0 };
    const availableWidth = Math.max(320, window.innerWidth - editorInsets.left - editorInsets.right);
    const availableHeight = Math.max(240, window.innerHeight - editorInsets.top - editorInsets.bottom);
    const factor = Math.min(availableWidth / 1920, availableHeight / 1080);
    const x = editorInsets.left + (availableWidth - 1920 * factor) / 2;
    const y = editorInsets.top + (availableHeight - 1080 * factor) / 2;
    stage.style.transform = `translate(${x}px, ${y}px) scale(${factor})`;
    stage.dataset.scale = String(factor);
    stage.dataset.offsetX = String(x);
    stage.dataset.offsetY = String(y);
  }

  function normalizePresentation(input) {
    const stage = getStage();
    if (!stage) throw new Error("FrontendSlidesEditor requires #deckStage or .deck-stage");
    const presentation = input || {};
    presentation.stage = presentation.stage || stage;
    presentation.slides = Array.from(stage.querySelectorAll(".slide"));
    if (!Number.isFinite(presentation.currentSlide)) presentation.currentSlide = computeCurrentSlide(presentation.slides);

    if (typeof presentation.showSlide !== "function") {
      presentation.showSlide = function showSlide(index) {
        this.slides = Array.from(stage.querySelectorAll(".slide"));
        this.currentSlide = Math.max(0, Math.min(index, this.slides.length - 1));
        this.slides.forEach((slide, i) => {
          slide.classList.toggle("active", i === this.currentSlide);
          slide.classList.toggle("visible", i === this.currentSlide);
        });
        document.dispatchEvent(new CustomEvent("slidechange", { detail: { index: this.currentSlide } }));
      };
    }

    if (typeof presentation.scaleStage !== "function") {
      presentation.scaleStage = () => defaultScaleStage(stage);
      window.addEventListener("resize", presentation.scaleStage);
    }

    if (typeof presentation.injectChrome !== "function") presentation.injectChrome = () => {};
    return presentation;
  }

    class DeckEditor {
      constructor(presentation) {
        this.presentation = presentation;
        this.storageKey = this.makeStorageKey();
        this.legacyStorageKeys = [];
        this.isActive = false;
        this.selected = null;
        this.hideTimeout = null;
        this.dragState = null;
        this.undoStack = [];
        this.historyIndex = -1;
        this.isRestoringHistory = false;
        this.historyLimit = 40;
        this.lastInsert = { x: 720, y: 300 };
        this.snapThreshold = 12;
        this.motionFrameRaf = null;
        this.pendingConfirm = null;
        this.deleteConfirmKey = `${this.storageKey}:delete-confirm-seen`;
        this.fileHandle = null;
        this.toggle = document.getElementById("editToggle");
        this.hotzone = document.querySelector(".edit-hotzone");
        this.stage = document.getElementById("deckStage");
        this.frame = document.getElementById("editorFrame");
        this.frameMove = document.getElementById("frameMove");
        this.frameDelete = document.getElementById("frameDelete");
        this.frameResize = document.getElementById("frameResize");
        this.guideV = this.ensureOverlayElement("editorGuideV", "editor-guide vertical");
        this.guideH = this.ensureOverlayElement("editorGuideH", "editor-guide horizontal");
        this.toast = document.getElementById("editorToast");
        this.attachFrame();
        this.controls = {
          slideRail: document.getElementById("slideRail"),
          help: document.getElementById("helpBtn"),
          helpModal: document.getElementById("editorHelp"),
          helpClose: document.getElementById("helpCloseBtn"),
          resetHelp: document.getElementById("resetHelpBtn"),
          resetHelpModal: document.getElementById("resetHelp"),
          resetHelpClose: document.getElementById("resetHelpCloseBtn"),
          confirmModal: document.getElementById("editorConfirm"),
          confirmTitle: document.getElementById("editorConfirmTitle"),
          confirmMessage: document.getElementById("editorConfirmMessage"),
          confirmClose: document.getElementById("editorConfirmCloseBtn"),
          confirmCancel: document.getElementById("editorConfirmCancelBtn"),
          confirmOk: document.getElementById("editorConfirmOkBtn"),
          undo: document.getElementById("undoBtn"),
          redo: document.getElementById("redoBtn"),
          addText: document.getElementById("addTextBtn"),
          addImage: document.getElementById("addImageBtn"),
          addShape: document.getElementById("addShapeBtn"),
          shapeMenu: document.getElementById("shapeMenu"),
          save: document.getElementById("saveBtn"),
          exit: document.getElementById("exitEditBtn"),
          selectionName: document.getElementById("selectionName"),
          dropZone: document.getElementById("imageDropZone"),
          imagePick: document.getElementById("imagePickBtn"),
          imageName: document.getElementById("imageFileName"),
          text: document.getElementById("textInput"),
          image: document.getElementById("imageInput"),
          shape: document.getElementById("shapeInput"),
          fontFamily: document.getElementById("fontFamilyInput"),
          fontSize: document.getElementById("fontSizeInput"),
          color: document.getElementById("colorInput"),
          bg: document.getElementById("bgInput"),
          opacity: document.getElementById("opacityInput"),
          x: document.getElementById("xInput"),
          y: document.getElementById("yInput"),
          width: document.getElementById("widthInput"),
          height: document.getElementById("heightInput"),
          bringForward: document.getElementById("bringForwardBtn"),
          sendBackward: document.getElementById("sendBackwardBtn"),
          motionStatus: document.getElementById("motionStatus"),
          anim: document.getElementById("animSelect"),
          order: document.getElementById("motionOrderInput"),
          delay: document.getElementById("delayInput"),
          duration: document.getElementById("durationInput"),
          previewMotion: document.getElementById("previewMotionBtn"),
          previewSlideMotion: document.getElementById("previewSlideMotionBtn"),
          restoreMotion: document.getElementById("restoreMotionBtn"),
          delete: document.getElementById("deleteBtn"),
          reset: document.getElementById("resetBtn")
        };
        this.prepareEditableElements();
        this.prepareEditableIds();
        this.restore();
        this.pushHistory();
        this.renderSlideRail();
        this.bindControls();
        this.bindEditableEvents();
        this.updateInspector();
      }

      attachFrame() {
        this.stage.querySelectorAll("#editorFrame, .editor-frame, #editorGuideV, #editorGuideH, .editor-guide").forEach((node) => {
          if (node !== this.frame && node !== this.guideV && node !== this.guideH) node.remove();
        });
        this.frame.classList.remove("active");
        this.frame.removeAttribute("style");
        this.hideGuides();
        this.stage.appendChild(this.guideV);
        this.stage.appendChild(this.guideH);
        this.stage.appendChild(this.frame);
      }

      ensureOverlayElement(id, className) {
        let element = document.getElementById(id);
        if (!element) {
          element = document.createElement("div");
          element.id = id;
          element.setAttribute("aria-hidden", "true");
        }
        element.className = className;
        return element;
      }

      makeStorageKey() {
        return `frontend-slides:${location.pathname}:${document.title}:visual-edits:v1`;
      }

      getEditableElements() {
        return Array.from(new Set(this.stage.querySelectorAll("[data-editable], [data-editable-media], [data-editable-box], [data-editor-kind], .editor-layer")));
      }

      prepareEditableElements() {
        this.stage.querySelectorAll("[data-editor-auto], [data-editor-kind]").forEach((element) => {
          delete element.dataset.editorAuto;
          delete element.dataset.editorKind;
        });
        const candidates = Array.from(this.stage.querySelectorAll(".slide *")).filter((element) => !this.shouldIgnoreEditorCandidate(element));
        candidates.forEach((element) => {
          const explicitKind = this.explicitEditorKind(element);
          if (explicitKind) this.markEditorKind(element, explicitKind, false);
        });
        candidates.forEach((element) => {
          if (element.dataset.editorKind) return;
          const kind = this.inferEditorKind(element, { includeBoxes: false });
          if (kind) this.markEditorKind(element, kind, true);
        });
        candidates.slice().reverse().forEach((element) => {
          if (element.dataset.editorKind) return;
          const kind = this.inferEditorKind(element, { onlyBoxes: true });
          if (kind) this.markEditorKind(element, kind, true);
        });
        this.pruneCompositeAutoContainers();
      }

      markEditorKind(element, kind, automatic) {
        element.dataset.editorKind = kind;
        if (automatic) element.dataset.editorAuto = "true";
      }

      shouldIgnoreEditorCandidate(element) {
        if (element.closest(".editor-shell, .editor-frame, .editor-guide")) return true;
        if (element.closest("[data-generated-chrome]")) return true;
        if (element.closest("svg") && element.tagName.toLowerCase() !== "svg") return true;
        if (element.matches("script, style, template, meta, link, br, wbr, defs, clipPath, mask, pattern, linearGradient, radialGradient, stop, source, track")) return true;
        if (element.matches(".deck-progress, .deck-count, .deck-controls, .edit-hotzone, .edit-toggle")) return true;
        return false;
      }

      explicitEditorKind(element) {
        if (element.classList.contains("text-layer")) return "text";
        if (element.classList.contains("image-layer")) return "media";
        if (element.classList.contains("shape-layer")) return "box";
        if (element.classList.contains("editor-layer")) return "";
        if (element.matches("[data-editable-media]")) return "media";
        if (element.matches("[data-editable-box]")) return "box";
        if (element.matches("[data-editable]")) return "text";
        return "";
      }

      inferEditorKind(element, options = {}) {
        const onlyBoxes = options.onlyBoxes === true;
        const includeBoxes = options.includeBoxes !== false;
        if (!onlyBoxes && (element.matches(this.mediaSelector()) || this.isBackgroundMediaCandidate(element) || this.isMediaWrapperCandidate(element))) return "media";
        if (!onlyBoxes && this.isTextCandidate(element)) return "text";
        if (includeBoxes && this.isVisualBoxCandidate(element)) return "box";
        return "";
      }

      mediaSelector() {
        return "img, picture, video, canvas, svg, iframe, object, embed";
      }

      isTextCandidate(element) {
        if (!this.hasVisibleText(element)) return false;
        const rect = element.getBoundingClientRect();
        if (rect.width < 2 || rect.height < 2) return false;
        if (element.querySelector(this.mediaSelector())) return false;
        const textTags = "h1,h2,h3,h4,h5,h6,p,li,blockquote,figcaption,caption,td,th,button,a,label,span,small,strong,em,b,i,code,pre";
        if (element.matches(textTags)) return !this.hasTextBlockChild(element);
        return this.hasDirectText(element) && !this.hasTextBlockChild(element);
      }

      hasVisibleText(element) {
        return Boolean(element.textContent && element.textContent.replace(/\s+/g, "").length);
      }

      hasDirectText(element) {
        return Array.from(element.childNodes).some((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
      }

      hasTextBlockChild(element) {
        return Array.from(element.children).some((child) => {
          if (child.matches("span,small,strong,em,b,i,code")) return false;
          return this.hasVisibleText(child);
        });
      }

      isVisualBoxCandidate(element) {
        const rect = element.getBoundingClientRect();
        if (rect.width < 24 || rect.height < 18) return false;
        if (rect.width > 1700 && rect.height > 850) return false;
        if (element.matches("main, article, nav, header, footer, form, ul, ol, table, tbody, thead, tr, section.slide")) return false;
        if (this.isBroadLayoutContainer(element)) return false;
        if (this.hasCompositeEditableChildren(element)) return false;
        const style = getComputedStyle(element);
        const borderWidth = ["Top", "Right", "Bottom", "Left"].some((side) => Number.parseFloat(style[`border${side}Width`]) > 0);
        const hasBackground = style.backgroundImage !== "none" || !["rgba(0, 0, 0, 0)", "transparent"].includes(style.backgroundColor);
        const hasShape = style.clipPath !== "none" || style.boxShadow !== "none";
        const hasMedia = Boolean(element.querySelector(this.mediaSelector()));
        return borderWidth || hasBackground || hasShape || hasMedia;
      }

      hasCssBackgroundImage(element) {
        const style = getComputedStyle(element);
        return style.backgroundImage && style.backgroundImage !== "none";
      }

      isBackgroundMediaCandidate(element) {
        if (!this.hasCssBackgroundImage(element)) return false;
        const rect = element.getBoundingClientRect();
        if (rect.width < 96 || rect.height < 72) return false;
        if (element.matches("main, article, nav, header, footer, section.slide")) return false;
        return !this.isBroadLayoutContainer(element);
      }

      isMediaWrapperCandidate(element) {
        if (element.matches("main, article, nav, header, footer, ul, ol, table, section.slide")) return false;
        const rect = element.getBoundingClientRect();
        if (rect.width < 96 || rect.height < 72) return false;
        if (rect.width > 1700 && rect.height > 850) return false;
        if (this.isBroadLayoutContainer(element)) return false;
        const media = Array.from(element.querySelectorAll(this.mediaSelector())).filter((node) => !this.shouldIgnoreEditorCandidate(node));
        if (media.length !== 1) return false;
        if (this.hasDirectText(element)) return false;
        return this.boundsMostlyMatch(element, media[0]);
      }

      boundsMostlyMatch(container, child) {
        const outer = container.getBoundingClientRect();
        const inner = child.getBoundingClientRect();
        if (outer.width <= 0 || outer.height <= 0 || inner.width <= 0 || inner.height <= 0) return false;
        const areaRatio = (inner.width * inner.height) / (outer.width * outer.height);
        if (areaRatio < 0.55) return false;
        const slackX = Math.max(24, outer.width * 0.2);
        const slackY = Math.max(24, outer.height * 0.2);
        return (
          Math.abs(inner.left - outer.left) <= slackX &&
          Math.abs(inner.top - outer.top) <= slackY &&
          Math.abs(inner.right - outer.right) <= slackX &&
          Math.abs(inner.bottom - outer.bottom) <= slackY
        );
      }

      hasCompositeEditableChildren(element) {
        const rect = element.getBoundingClientRect();
        const children = Array.from(element.querySelectorAll("[data-editor-kind]")).filter((child) => {
          if (child === element || child.closest(".slide") !== element.closest(".slide")) return false;
          return this.isSubstantialDescendant(child, rect);
        });
        if (children.length > 1) return true;
        return children.length === 1 && this.isLayoutOnlyContainer(element);
      }

      pruneCompositeAutoContainers() {
        this.stage.querySelectorAll("[data-editor-auto='true'][data-editor-kind]").forEach((element) => {
          if (!this.hasCompositeEditableChildren(element)) return;
          delete element.dataset.editorAuto;
          delete element.dataset.editorKind;
        });
      }

      isSubstantialDescendant(child, parentRect) {
        const rect = child.getBoundingClientRect();
        if (rect.width < 18 || rect.height < 14) return false;
        const parentArea = Math.max(1, parentRect.width * parentRect.height);
        const childArea = rect.width * rect.height;
        if (childArea / parentArea > 0.88) return false;
        return true;
      }

      isLayoutOnlyContainer(element) {
        const style = getComputedStyle(element);
        const hasTransparentBackground = style.backgroundImage === "none" && ["rgba(0, 0, 0, 0)", "transparent"].includes(style.backgroundColor);
        const hasPlainLine = style.boxShadow === "none" && style.clipPath === "none";
        if (!hasTransparentBackground || !hasPlainLine) return false;
        const borderWidth = ["Top", "Right", "Bottom", "Left"].reduce((total, side) => total + (Number.parseFloat(style[`border${side}Width`]) || 0), 0);
        return ["block", "flex", "grid"].includes(style.display) && borderWidth <= 4;
      }

      isBroadLayoutContainer(element) {
        const style = getComputedStyle(element);
        if (!["grid", "flex"].includes(style.display)) return false;
        const substantialChildren = Array.from(element.children).filter((child) => {
          const rect = child.getBoundingClientRect();
          return rect.width >= 36 && rect.height >= 24 && this.hasVisibleText(child);
        });
        return substantialChildren.length > 2;
      }

      prepareEditableIds() {
        this.getEditableElements().forEach((element, index) => {
          if (!element.dataset.editId) element.dataset.editId = `edit-${index}`;
        });
      }

      bindControls() {
        this.controls.help.addEventListener("click", () => this.openHelp());
        this.controls.helpClose.addEventListener("click", () => this.closeHelp());
        this.controls.helpModal.addEventListener("click", (event) => {
          if (event.target === this.controls.helpModal) this.closeHelp();
        });
        this.controls.resetHelp.addEventListener("click", () => this.openResetHelp());
        this.controls.resetHelpClose.addEventListener("click", () => this.closeResetHelp());
        this.controls.resetHelpModal.addEventListener("click", (event) => {
          if (event.target === this.controls.resetHelpModal) this.closeResetHelp();
        });
        this.controls.confirmClose.addEventListener("click", () => this.closeConfirm());
        this.controls.confirmCancel.addEventListener("click", () => this.closeConfirm());
        this.controls.confirmModal.addEventListener("click", (event) => {
          if (event.target === this.controls.confirmModal) this.closeConfirm();
        });
        this.controls.confirmOk.addEventListener("click", () => this.runConfirmedAction());
        this.toggle.addEventListener("click", () => this.toggleEditMode());
        this.hotzone.addEventListener("mouseenter", () => this.showButtons());
        this.hotzone.addEventListener("mouseleave", () => this.scheduleHide());
        this.hotzone.addEventListener("click", () => this.toggleEditMode());
        this.toggle.addEventListener("mouseenter", () => this.showButtons());
        this.toggle.addEventListener("mouseleave", () => this.scheduleHide());

        this.controls.undo.addEventListener("click", () => this.undo());
        this.controls.redo.addEventListener("click", () => this.redo());
        this.controls.addText.addEventListener("click", () => this.addText());
        this.controls.addImage.addEventListener("click", () => {
          this.openImagePicker();
        });
        this.controls.imagePick.addEventListener("click", () => this.openImagePicker());
        this.controls.addShape.addEventListener("click", () => this.toggleShapeMenu());
        this.controls.shapeMenu.querySelectorAll("[data-shape-choice]").forEach((button) => {
          button.addEventListener("click", () => {
            this.addShape(button.dataset.shapeChoice || "rect");
            this.closeShapeMenu();
          });
        });
        this.controls.save.addEventListener("click", () => this.exportHtml());
        this.controls.exit.addEventListener("click", () => this.toggleEditMode(false));
        this.controls.reset.addEventListener("click", () => this.confirmResetDraft());
        this.controls.image.addEventListener("change", (event) => this.handleFileInput(event));
        this.controls.delete.addEventListener("click", () => this.confirmDeleteSelected());
        this.controls.bringForward.addEventListener("click", () => this.bumpZIndex(1));
        this.controls.sendBackward.addEventListener("click", () => this.bumpZIndex(-1));
        this.controls.previewMotion.addEventListener("click", () => this.previewMotion());
        this.controls.previewSlideMotion.addEventListener("click", () => this.replayActiveSlideMotion());
        this.controls.restoreMotion.addEventListener("click", () => this.restoreOriginalMotion(this.selected, true));

        ["text", "shape", "fontFamily", "fontSize", "color", "bg", "opacity", "x", "y", "width", "height", "anim", "order", "delay", "duration"].forEach((name) => {
          const control = this.controls[name];
          control.addEventListener("input", () => this.applyInspectorValue(name));
          control.addEventListener("change", () => this.applyInspectorValue(name));
        });

        document.addEventListener("keydown", (event) => this.handleKeydown(event));
        document.addEventListener("click", (event) => {
          if (!event.target.closest(".shape-picker-wrap") && !event.target.closest("#shapeMenu")) this.closeShapeMenu();
        });
        document.addEventListener("pointerdown", (event) => this.handleDocumentPointerDown(event), true);
        document.addEventListener("pointermove", (event) => this.handlePointerMove(event));
        document.addEventListener("pointerup", () => this.finishPointerAction());
        document.addEventListener("pointercancel", () => this.finishPointerAction());
        window.addEventListener("blur", () => this.finishPointerAction());

        this.frameMove.addEventListener("pointerdown", (event) => this.startPointerAction(event, "move"));
        this.frameDelete.addEventListener("pointerdown", (event) => {
          event.preventDefault();
          event.stopPropagation();
        });
        this.frameDelete.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          this.confirmDeleteSelected();
        });
        this.frameResize.addEventListener("pointerdown", (event) => this.startPointerAction(event, "resize"));

        ["dragenter", "dragover"].forEach((eventName) => {
          window.addEventListener(eventName, (event) => this.handleDrag(event));
          this.controls.dropZone.addEventListener(eventName, (event) => this.handleDrag(event));
        });
        ["dragleave", "drop"].forEach((eventName) => {
          window.addEventListener(eventName, (event) => this.clearDrag(event));
          this.controls.dropZone.addEventListener(eventName, (event) => this.clearDrag(event));
        });
        window.addEventListener("drop", (event) => this.handleDrop(event));
        window.addEventListener("resize", () => this.updateFrame());
      }

      bindEditableEvents() {
        this.getEditableElements().forEach((element) => this.bindElement(element));
      }

      bindElement(element) {
        if (element.dataset.editorBound) return;
        element.dataset.editorBound = "true";
        element.addEventListener("pointerdown", (event) => {
          if (!this.isActive) return;
          const target = this.getEditableTarget(event.target);
          const canDragBody = target && (target.classList.contains("editor-layer") || target.matches("[data-editable-media], [data-editable-box], [data-editor-kind='media'], [data-editor-kind='box']"));
          if (!canDragBody) return;
          event.preventDefault();
          event.stopPropagation();
          this.select(target);
          this.startPointerAction(event, "move");
        });
        element.addEventListener("click", (event) => {
          if (!this.isActive) return;
          event.preventDefault();
          event.stopPropagation();
          this.select(this.getEditableTarget(event.target) || element);
        });
        element.addEventListener("dblclick", (event) => {
          if (!this.isActive) return;
          const target = this.getEditableTarget(event.target) || element;
          event.preventDefault();
          event.stopPropagation();
          this.select(target);
          if (this.isTextElement(target)) {
            this.focusTextEditor();
          }
        });
        element.addEventListener("input", () => {
          if (!this.isActive) return;
          this.save(false);
          this.updateInspector();
          this.updateFrame();
        });
      }

      renderSlideRail() {
        this.controls.slideRail.innerHTML = "";
        this.presentation.slides.forEach((slide, index) => {
          const button = document.createElement("button");
          button.type = "button";
          button.className = `slide-chip${index === this.presentation.currentSlide ? " active" : ""}`;
          const title = slide.dataset.title || slide.getAttribute("aria-label") || `Slide ${index + 1}`;
          button.innerHTML = `<span class="slide-chip-num">${String(index + 1).padStart(2, "0")}</span><span class="slide-chip-title">${title}</span>`;
          button.addEventListener("click", () => {
            this.presentation.showSlide(index);
            this.renderSlideRail();
            this.clearSelection();
          });
          this.controls.slideRail.appendChild(button);
        });
      }

      handleKeydown(event) {
        if (event.key === "Escape" && !this.controls.confirmModal.hidden) {
          event.preventDefault();
          this.closeConfirm();
          return;
        }
        if (event.key === "Escape" && !this.controls.resetHelpModal.hidden) {
          event.preventDefault();
          this.closeResetHelp();
          return;
        }
        if (event.key === "Escape" && !this.controls.helpModal.hidden) {
          event.preventDefault();
          this.closeHelp();
          return;
        }
        if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z" && this.isActive && event.shiftKey) {
          event.preventDefault();
          this.redo();
          return;
        }
        if ((event.ctrlKey && !event.metaKey) && event.key.toLowerCase() === "y" && this.isActive) {
          event.preventDefault();
          this.redo();
          return;
        }
        if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z" && this.isActive && !event.shiftKey) {
          event.preventDefault();
          this.undo();
          return;
        }
        if ((event.key === "e" || event.key === "E") && !this.isFormTarget(event.target)) {
          event.preventDefault();
          this.toggleEditMode();
        }
        if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
          event.preventDefault();
          this.exportHtml();
        }
        if (!this.isActive || this.isFormTarget(event.target)) return;
        if (event.key === "Delete" || event.key === "Backspace") {
          event.preventDefault();
          this.confirmDeleteSelected();
        }
        if (this.selected && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
          event.preventDefault();
          const step = event.shiftKey ? 10 : 1;
          const box = this.getStageBox(this.selected);
          const dx = event.key === "ArrowLeft" ? -step : event.key === "ArrowRight" ? step : 0;
          const dy = event.key === "ArrowUp" ? -step : event.key === "ArrowDown" ? step : 0;
          this.setStagePosition(this.selected, box.x + dx, box.y + dy, box.width, box.height);
          this.updateInspector();
          this.save(false, true);
        }
      }

      openHelp() {
        this.controls.helpModal.hidden = false;
      }

      closeHelp() {
        this.controls.helpModal.hidden = true;
      }

      openResetHelp() {
        this.controls.resetHelpModal.hidden = false;
      }

      closeResetHelp() {
        this.controls.resetHelpModal.hidden = true;
      }

      openConfirm({ title, message, okText, action }) {
        this.pendingConfirm = action;
        this.controls.confirmTitle.textContent = title;
        this.controls.confirmMessage.textContent = message;
        this.controls.confirmOk.textContent = okText;
        this.controls.confirmModal.hidden = false;
        this.controls.confirmCancel.focus({ preventScroll: true });
      }

      closeConfirm() {
        this.pendingConfirm = null;
        this.controls.confirmModal.hidden = true;
      }

      runConfirmedAction() {
        const action = this.pendingConfirm;
        this.closeConfirm();
        if (typeof action === "function") action();
      }

      isFormTarget(target) {
        return target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
      }

      showButtons() {
        window.clearTimeout(this.hideTimeout);
        this.toggle.classList.add("show");
      }

      scheduleHide() {
        this.hideTimeout = window.setTimeout(() => {
          if (!this.isActive) {
            this.toggle.classList.remove("show");
          }
        }, 400);
      }

      toggleEditMode(force) {
        this.isActive = typeof force === "boolean" ? force : !this.isActive;
        document.body.classList.toggle("editing", this.isActive);
        document.body.classList.toggle("editor-on", this.isActive);
        this.toggle.classList.toggle("active", this.isActive);
        this.showButtons();
        this.getEditableElements().forEach((element) => {
          element.removeAttribute("contenteditable");
        });
        this.presentation.scaleStage?.();
        this.updateFrame();
        if (!this.isActive) {
          this.hideGuides();
          this.save(false);
          this.clearSelection();
        }
        this.renderSlideRail();
      }

      handleDocumentPointerDown(event) {
        if (!this.isActive) return;
        if (event.target.closest(".editor-shell") || event.target.closest(".editor-frame") || event.target.closest(".edit-toggle")) return;
        const target = this.getEditableTarget(event.target);
        if (target) return;
        this.clearSelection();
      }

      getEditableTarget(target) {
        let element = target && target.closest("[data-editable], [data-editable-media], [data-editable-box], [data-editor-kind], .editor-layer");
        if (!element || !this.stage.contains(element)) return null;
        if (element.closest(".editor-shell") || element.closest(".editor-frame")) return null;
        element = this.preferExplicitEditableAncestor(element);
        return element.closest(".slide") ? element : null;
      }

      preferExplicitEditableAncestor(element) {
        if (!element || element.classList.contains("editor-layer")) return element;
        if (element.dataset.editorAuto !== "true") return element;
        const explicitParent = element.parentElement?.closest("[data-editable], [data-editable-media], [data-editable-box], .editor-layer");
        if (explicitParent && this.stage.contains(explicitParent) && explicitParent.closest(".slide") === element.closest(".slide")) {
          return explicitParent;
        }
        const mediaParent = element.parentElement?.closest("[data-editor-auto='true'][data-editor-kind='media']");
        if (
          mediaParent &&
          mediaParent !== element &&
          this.stage.contains(mediaParent) &&
          mediaParent.closest(".slide") === element.closest(".slide") &&
          this.isMediaWrapperCandidate(mediaParent)
        ) {
          return mediaParent;
        }
        return element;
      }

      select(element) {
        if (this.selected === element) {
          this.updateFrame();
          return;
        }
        this.clearSelection(false);
        this.selected = element;
        element.classList.add("editor-selected");
        this.updateFrame();
        this.updateInspector();
      }

      clearSelection(update = true) {
        this.stopMotionFrameTracking();
        if (this.selected) this.selected.classList.remove("editor-selected");
        this.selected = null;
        this.frame.classList.remove("active");
        if (update) this.updateInspector();
      }

      updateInspector() {
        const element = this.selected;
        const hasSelection = Boolean(element);
        const canUseImage = hasSelection && this.isImageElement(element);
        const canDelete = this.canDeleteElement(element);
        const textCapable = hasSelection && this.isTextElement(element);
        const shapeCapable = hasSelection && element.classList.contains("shape-layer");

        this.controls.selectionName.textContent = hasSelection ? this.getSelectionLabel(element) : "未选中元素";
        this.controls.text.disabled = !textCapable;
        this.controls.image.disabled = false;
        this.controls.shape.disabled = !shapeCapable;
        this.controls.fontFamily.disabled = !textCapable;
        this.controls.fontSize.disabled = !textCapable;
        this.controls.color.disabled = !hasSelection;
        this.controls.bg.disabled = !hasSelection;
        this.controls.opacity.disabled = !hasSelection;
        this.controls.x.disabled = !hasSelection;
        this.controls.y.disabled = !hasSelection;
        this.controls.width.disabled = !hasSelection;
        this.controls.height.disabled = !hasSelection;
        this.controls.bringForward.disabled = !hasSelection;
        this.controls.sendBackward.disabled = !hasSelection;
        this.controls.anim.disabled = !hasSelection;
        this.controls.order.disabled = !hasSelection || !this.usesCustomMotion(element);
        this.controls.delay.disabled = !hasSelection || !this.usesCustomMotion(element);
        this.controls.duration.disabled = !hasSelection || !this.usesCustomMotion(element);
        this.controls.previewMotion.disabled = !hasSelection;
        this.controls.restoreMotion.disabled = !hasSelection || !this.hasStoredOriginalMotion(element);
        this.controls.delete.disabled = !canDelete;
        this.controls.image.disabled = false;
        this.controls.imagePick.disabled = false;
        this.controls.imagePick.textContent = canUseImage ? "替换图片" : "选择图片";
        this.controls.imageName.textContent = canUseImage ? "将替换选中图片" : "未选择图片";

        if (!hasSelection) {
          this.controls.text.value = "";
          this.controls.image.value = "";
          this.controls.shape.value = "rect";
          ["fontFamily", "fontSize", "color", "bg", "opacity", "x", "y", "width", "height", "anim", "order", "delay", "duration"].forEach((name) => {
            this.controls[name].value = "";
          });
          this.controls.motionStatus.textContent = "未选中元素";
          return;
        }

        const computed = window.getComputedStyle(element);
        const box = this.getStageBox(element);
        this.controls.text.value = textCapable ? element.innerText : "";
        this.controls.shape.value = shapeCapable ? (element.dataset.shape || "rect") : "rect";
        this.controls.fontFamily.value = textCapable ? this.matchFontFamilyValue(computed.fontFamily) : "";
        this.controls.fontSize.value = Math.round(Number.parseFloat(computed.fontSize)) || "";
        this.controls.color.value = this.toHex(computed.color);
        this.controls.bg.value = this.toHex(computed.backgroundColor);
        this.controls.opacity.value = Math.round((Number.parseFloat(computed.opacity) || 1) * 100);
        this.controls.x.value = Math.round(box.x);
        this.controls.y.value = Math.round(box.y);
        this.controls.width.value = Math.round(box.width);
        this.controls.height.value = Math.round(box.height);
        this.controls.anim.value = this.getMotionSelectValue(element);
        this.controls.order.value = element.dataset.editOrder || "";
        this.controls.delay.value = Number.parseInt(element.dataset.editDelay || "0", 10);
        this.controls.duration.value = Number.parseInt(element.dataset.editDuration || "640", 10);
        this.controls.order.disabled = !this.usesCustomMotion(element);
        this.controls.delay.disabled = !this.usesCustomMotion(element);
        this.controls.duration.disabled = !this.usesCustomMotion(element);
        this.controls.restoreMotion.disabled = !this.hasStoredOriginalMotion(element);
        this.controls.motionStatus.textContent = this.getMotionStatus(element);
        this.controls.image.value = "";
      }

      focusTextEditor() {
        const section = this.controls.text.closest(".inspector-section");
        if (section) {
          section.scrollIntoView({ block: "nearest" });
          section.classList.add("edit-attention");
          window.clearTimeout(this.textFocusTimer);
          this.textFocusTimer = window.setTimeout(() => section.classList.remove("edit-attention"), 900);
        }
        this.controls.text.focus({ preventScroll: true });
        this.controls.text.select();
      }

      applyInspectorValue(name) {
        const element = this.selected;
        if (!element) return;
        if (name === "text") {
          element.innerText = this.controls.text.value;
        }
        if (name === "shape" && element.classList.contains("shape-layer")) {
          this.applyShape(element, this.controls.shape.value);
        }
        if (name === "fontFamily" && this.isTextElement(element)) {
          const value = this.controls.fontFamily.value;
          if (value) {
            element.style.fontFamily = value;
          } else {
            element.style.removeProperty("font-family");
          }
        }
        if (name === "fontSize") element.style.fontSize = `${this.controls.fontSize.value}px`;
        if (name === "color") element.style.color = this.controls.color.value;
        if (name === "bg") element.style.backgroundColor = this.controls.bg.value;
        if (name === "opacity") element.style.opacity = String((Number(this.controls.opacity.value) || 0) / 100);
        if (["x", "y", "width", "height"].includes(name)) {
          const box = this.getStageBox(element);
          const numberOrFallback = (value, fallback) => {
            if (value === "") return fallback;
            const number = Number(value);
            return Number.isFinite(number) ? number : fallback;
          };
          const x = numberOrFallback(this.controls.x.value, box.x);
          const y = numberOrFallback(this.controls.y.value, box.y);
          const width = Math.max(10, numberOrFallback(this.controls.width.value, box.width));
          const height = Math.max(10, numberOrFallback(this.controls.height.value, box.height));
          this.setStagePosition(element, x, y, width, height);
        }
        if (name === "anim") this.applyAnimation(element, this.controls.anim.value, true);
        if (name === "order") {
          if (!this.usesCustomMotion(element)) return;
          const order = this.setMotionOrder(element, this.controls.order.value, true);
          this.controls.order.value = order;
          this.scheduleMotionPreview();
        }
        if (name === "delay") {
          if (!this.usesCustomMotion(element)) return;
          element.dataset.editDelay = String(Math.max(0, Number(this.controls.delay.value) || 0));
          element.style.setProperty("--edit-delay", `${element.dataset.editDelay}ms`);
          this.scheduleMotionPreview();
        }
        if (name === "duration") {
          if (!this.usesCustomMotion(element)) return;
          element.dataset.editDuration = String(Math.max(100, Number(this.controls.duration.value) || 640));
          element.style.setProperty("--edit-duration", `${element.dataset.editDuration}ms`);
          this.scheduleMotionPreview();
        }
        this.updateFrame();
        this.updateInspector();
        this.save(false);
      }

      getSelectionLabel(element) {
        if (this.isImageElement(element)) return "图片";
        if (element.classList.contains("shape-layer")) return `形状：${this.shapeLabel(element.dataset.shape || "rect")}`;
        if (element.classList.contains("text-layer")) return "文字层";
        if (this.isTextElement(element)) return `文字：${element.tagName.toLowerCase()}`;
        if (element.matches("[data-editable-box], [data-editor-kind='box']")) return `视觉块：${element.tagName.toLowerCase()}`;
        return element.tagName.toLowerCase();
      }

      isImageElement(element) {
        return Boolean(element && (element.tagName === "IMG" || element.classList.contains("image-layer") || element.matches("[data-editable-media], [data-editor-kind='media']") || element.querySelector?.("img")));
      }

      isTextElement(element) {
        return element && element.matches("[data-editable], [data-editor-kind='text'], .text-layer");
      }

      matchFontFamilyValue(value) {
        const normalized = (value || "").toLowerCase();
        const presets = [
          { value: "var(--font-body)", tokens: ["hanken grotesk"] },
          { value: "var(--font-display-cjk)", tokens: ["noto serif sc"] },
          { value: "var(--font-display)", tokens: ["newsreader"] },
          { value: "var(--font-mono)", tokens: ["dm mono", "ui-monospace"] }
        ];
        const match = presets.find((preset) => preset.tokens.some((token) => normalized.includes(token)));
        return match ? match.value : "";
      }

      openImagePicker() {
        this.controls.image.disabled = false;
        this.controls.image.click();
      }

      toggleShapeMenu() {
        const willOpen = this.controls.shapeMenu.hidden;
        this.controls.shapeMenu.hidden = !willOpen;
        this.controls.addShape.setAttribute("aria-expanded", String(willOpen));
      }

      closeShapeMenu() {
        this.controls.shapeMenu.hidden = true;
        this.controls.addShape.setAttribute("aria-expanded", "false");
      }

      activeSlide() {
        return this.presentation.slides[this.presentation.currentSlide];
      }

      nextInsertPoint(width = 320, height = 180) {
        const slide = this.activeSlide().getBoundingClientRect();
        const panel = document.querySelector(".editor-panel").getBoundingClientRect();
        const rail = document.querySelector(".editor-slides").getBoundingClientRect();
        const compactEditor = window.innerWidth <= 960;
        const visibleLeft = compactEditor ? slide.left : Math.max(slide.left, rail.right + 18);
        const visibleRight = compactEditor ? slide.right : Math.min(slide.right, panel.left - 18);
        const visibleTop = compactEditor ? Math.max(slide.top, rail.bottom + 16) : Math.max(slide.top, 92);
        const visibleBottom = compactEditor ? Math.min(slide.bottom, panel.top - 16) : Math.min(slide.bottom, window.innerHeight - 22);
        const scale = slide.width / 1920;
        if (visibleRight > visibleLeft + 40 && visibleBottom > visibleTop + 40) {
          return {
            x: Math.max(0, Math.min(1920 - width, ((visibleLeft + visibleRight) / 2 - slide.left) / scale - width / 2)),
            y: Math.max(0, Math.min(1080 - height, ((visibleTop + visibleBottom) / 2 - slide.top) / scale - height / 2))
          };
        }
        return {
          x: Math.max(0, Math.min(1920 - width, this.lastInsert.x)),
          y: Math.max(0, Math.min(1080 - height, this.lastInsert.y))
        };
      }

      stagePointFromClient(clientX, clientY) {
        const rect = this.stage.getBoundingClientRect();
        const scale = rect.width / 1920;
        return {
          x: (clientX - rect.left) / scale,
          y: (clientY - rect.top) / scale,
          scale
        };
      }

      getStageBox(element) {
        const stageRect = this.stage.getBoundingClientRect();
        const rect = element.getBoundingClientRect();
        const scale = stageRect.width / 1920;
        return {
          x: (rect.left - stageRect.left) / scale,
          y: (rect.top - stageRect.top) / scale,
          width: rect.width / scale,
          height: rect.height / scale
        };
      }

      clampStageBox(box, keepVisible = 24) {
        const width = Math.max(10, Math.min(1920, box.width || 10));
        const height = Math.max(10, Math.min(1080, box.height || 10));
        const visibleX = Math.min(keepVisible, width);
        const visibleY = Math.min(keepVisible, height);
        return {
          x: Math.max(-width + visibleX, Math.min(1920 - visibleX, box.x)),
          y: Math.max(-height + visibleY, Math.min(1080 - visibleY, box.y)),
          width,
          height
        };
      }

      clampInsertPoint(x, y, width, height) {
        const box = this.clampStageBox({ x, y, width, height }, Math.min(24, width, height));
        return { x: box.x, y: box.y };
      }

      rememberBaseTransform(element) {
        if (element.classList.contains("edit-moved")) return;
        const computed = getComputedStyle(element);
        const inlineTransform = element.style.transform && element.style.transform.trim();
        const motionTransform = element.matches(`.reveal, .reveal-left, .reveal-scale, ${this.editorMotionClasses().map((className) => `.${className}`).join(", ")}`) || computed.animationName !== "none";
        const computedTransform = motionTransform ? "" : computed.transform;
        const baseTransform = inlineTransform && inlineTransform !== "none"
          ? inlineTransform
          : computedTransform && computedTransform !== "none"
            ? computedTransform
            : "";
        if (baseTransform) {
          element.style.setProperty("--edit-base-transform", baseTransform);
        } else {
          element.style.removeProperty("--edit-base-transform");
        }
      }

      setStagePosition(element, x, y, width, height) {
        if (!element.classList.contains("editor-layer")) {
          this.rememberBaseTransform(element);
          const safe = this.clampStageBox({ x, y, width, height });
          const box = this.getStageBox(element);
          const dx = Math.round(safe.x - box.x);
          const dy = Math.round(safe.y - box.y);
          const scaleX = safe.width > 0 && box.width > 0 ? safe.width / box.width : 1;
          const scaleY = safe.height > 0 && box.height > 0 ? safe.height / box.height : 1;
          if (dx || dy) {
            const currentX = Number.parseFloat(element.style.getPropertyValue("--edit-x")) || 0;
            const currentY = Number.parseFloat(element.style.getPropertyValue("--edit-y")) || 0;
            element.classList.add("edit-moved");
            element.style.setProperty("--edit-x", `${Math.round(currentX + dx)}px`);
            element.style.setProperty("--edit-y", `${Math.round(currentY + dy)}px`);
          }
          if (Math.abs(scaleX - 1) > 0.01 || Math.abs(scaleY - 1) > 0.01) {
            const currentScaleX = Number.parseFloat(element.style.getPropertyValue("--edit-scale-x")) || 1;
            const currentScaleY = Number.parseFloat(element.style.getPropertyValue("--edit-scale-y")) || 1;
            element.classList.add("edit-moved");
            element.style.setProperty("--edit-scale-x", `${Math.max(0.05, currentScaleX * scaleX).toFixed(3)}`);
            element.style.setProperty("--edit-scale-y", `${Math.max(0.05, currentScaleY * scaleY).toFixed(3)}`);
          }
          return;
        }
        const slide = element.closest(".slide");
        if (!slide) return;
        const slideBox = slide.getBoundingClientRect();
        const parent = element.offsetParent || slide;
        const parentBox = parent.getBoundingClientRect();
        const scale = slideBox.width / 1920;
        const left = (parentBox.left - slideBox.left) / scale;
        const top = (parentBox.top - slideBox.top) / scale;
        const safeWidth = Math.min(1920, Math.max(10, width));
        const safeHeight = Math.min(1080, Math.max(10, height));
        const safeX = Math.max(0, Math.min(1920 - safeWidth, x));
        const safeY = Math.max(0, Math.min(1080 - safeHeight, y));
        element.style.position = "absolute";
        element.style.left = `${Math.round(safeX - left)}px`;
        element.style.top = `${Math.round(safeY - top)}px`;
        element.style.width = `${Math.round(safeWidth)}px`;
        element.style.height = `${Math.round(safeHeight)}px`;
        element.style.margin = "0";
        element.classList.remove("edit-moved");
        element.style.removeProperty("--edit-x");
        element.style.removeProperty("--edit-y");
        element.style.removeProperty("--edit-scale");
        element.style.removeProperty("--edit-scale-x");
        element.style.removeProperty("--edit-scale-y");
        element.style.removeProperty("--edit-base-transform");
      }

      updateFrame() {
        if (!this.selected || !this.isActive || !this.selected.closest(".slide")) {
          this.frame.classList.remove("active");
          return;
        }
        const box = this.getStageBox(this.selected);
        this.frame.style.left = `${box.x}px`;
        this.frame.style.top = `${box.y}px`;
        this.frame.style.width = `${box.width}px`;
        this.frame.style.height = `${box.height}px`;
        this.frame.classList.add("active");
      }

      stopMotionFrameTracking() {
        if (!this.motionFrameRaf) return;
        window.cancelAnimationFrame(this.motionFrameRaf);
        this.motionFrameRaf = null;
      }

      trackFrameDuringMotion(element, totalMs) {
        this.stopMotionFrameTracking();
        if (!element || !this.isActive || this.selected !== element) return;
        const endAt = performance.now() + Math.max(160, totalMs);
        const tick = () => {
          if (!this.isActive || this.selected !== element || !element.isConnected) {
            this.motionFrameRaf = null;
            this.updateFrame();
            return;
          }
          this.updateFrame();
          if (performance.now() < endAt) {
            this.motionFrameRaf = window.requestAnimationFrame(tick);
          } else {
            this.motionFrameRaf = null;
            this.updateFrame();
          }
        };
        this.motionFrameRaf = window.requestAnimationFrame(tick);
      }

      cssTimeListToMs(value) {
        return String(value || "0s").split(",").map((item) => {
          const time = item.trim();
          const number = Number.parseFloat(time);
          if (!Number.isFinite(number)) return 0;
          return time.endsWith("ms") ? number : number * 1000;
        });
      }

      motionFrameTrackDuration(element, fallback = 900) {
        const computed = window.getComputedStyle(element);
        const durations = [
          ...this.cssTimeListToMs(computed.transitionDuration),
          ...this.cssTimeListToMs(computed.animationDuration)
        ];
        const delays = [
          ...this.cssTimeListToMs(computed.transitionDelay),
          ...this.cssTimeListToMs(computed.animationDelay)
        ];
        const max = durations.reduce((total, duration, index) => {
          const delay = delays[index % Math.max(1, delays.length)] || 0;
          return Math.max(total, duration + delay);
        }, 0);
        return Math.max(fallback, max + 160);
      }

      getSnapTargets(element) {
        const active = this.activeSlide();
        const targets = {
          x: [
            { value: 0, bias: -6 },
            { value: 960, bias: -8 },
            { value: 1920, bias: -6 }
          ],
          y: [
            { value: 0, bias: -6 },
            { value: 540, bias: -8 },
            { value: 1080, bias: -6 }
          ]
        };
        this.getEditableElements().forEach((candidate) => {
          if (candidate === element || candidate.closest(".slide") !== active) return;
          if (element.contains(candidate) || candidate.contains(element)) return;
          if (candidate.closest(".editor-frame") || candidate.closest(".editor-guide")) return;
          const box = this.getStageBox(candidate);
          if (box.width <= 0 || box.height <= 0) return;
          const bias = this.getSnapTargetBias(candidate);
          targets.x.push(
            { value: box.x, bias },
            { value: box.x + box.width / 2, bias },
            { value: box.x + box.width, bias }
          );
          targets.y.push(
            { value: box.y, bias },
            { value: box.y + box.height / 2, bias },
            { value: box.y + box.height, bias }
          );
        });
        return targets;
      }

      getSnapTargetBias(element) {
        if (this.isNestedSnapTarget(element)) return 4;
        if (element.matches("[data-editable-media], [data-editable-box], [data-editor-kind='media'], [data-editor-kind='box'], .editor-layer")) return 0;
        return 1;
      }

      isNestedSnapTarget(element) {
        const parentEditable = element.parentElement?.closest("[data-editable], [data-editable-media], [data-editable-box], [data-editor-kind], .editor-layer");
        return Boolean(parentEditable && parentEditable !== element && this.stage.contains(parentEditable));
      }

      snapBox(box, mode) {
        const next = { ...box };
        const targets = this.getSnapTargets(this.selected);
        const guides = { x: null, y: null };
        const threshold = this.snapThreshold;
        const best = {
          x: { score: Infinity, delta: 0, guide: null },
          y: { score: Infinity, delta: 0, guide: null }
        };

        const testAxis = (axis, sources) => {
          targets[axis].forEach((target) => {
            sources.forEach((source) => {
              const distance = Math.abs(source.value - target.value);
              const score = distance + target.bias;
              if (distance <= threshold && score < best[axis].score) {
                best[axis] = { score, delta: target.value - source.value, guide: target.value };
              }
            });
          });
        };

        if (mode === "move") {
          testAxis("x", [
            { value: next.x },
            { value: next.x + next.width / 2 },
            { value: next.x + next.width }
          ]);
          testAxis("y", [
            { value: next.y },
            { value: next.y + next.height / 2 },
            { value: next.y + next.height }
          ]);
          if (best.x.guide !== null) {
            next.x += best.x.delta;
            guides.x = best.x.guide;
          }
          if (best.y.guide !== null) {
            next.y += best.y.delta;
            guides.y = best.y.guide;
          }
        } else {
          testAxis("x", [{ value: next.x + next.width }]);
          testAxis("y", [{ value: next.y + next.height }]);
          if (best.x.guide !== null) {
            next.width = Math.max(24, next.width + best.x.delta);
            guides.x = best.x.guide;
          }
          if (best.y.guide !== null) {
            next.height = Math.max(24, next.height + best.y.delta);
            guides.y = best.y.guide;
          }
        }

        return { box: next, guides };
      }

      showGuides(guides) {
        if (guides.x !== null) {
          this.guideV.style.left = `${Math.round(guides.x)}px`;
          this.guideV.classList.add("active");
        } else {
          this.guideV.classList.remove("active");
        }
        if (guides.y !== null) {
          this.guideH.style.top = `${Math.round(guides.y)}px`;
          this.guideH.classList.add("active");
        } else {
          this.guideH.classList.remove("active");
        }
      }

      hideGuides() {
        this.guideV.classList.remove("active");
        this.guideH.classList.remove("active");
      }

      startPointerAction(event, mode) {
        if (!this.selected) return;
        event.preventDefault();
        event.stopPropagation();
        const box = this.getStageBox(this.selected);
        const point = this.stagePointFromClient(event.clientX, event.clientY);
        this.dragState = {
          mode,
          startX: point.x,
          startY: point.y,
          box
        };
        if (event.target.setPointerCapture && event.pointerId !== undefined) {
          event.target.setPointerCapture(event.pointerId);
        }
      }

      handlePointerMove(event) {
        if (!this.dragState || !this.selected) return;
        if (event.pointerType === "mouse" && event.buttons === 0) {
          this.finishPointerAction();
          return;
        }
        const point = this.stagePointFromClient(event.clientX, event.clientY);
        const dx = point.x - this.dragState.startX;
        const dy = point.y - this.dragState.startY;
        const next = { ...this.dragState.box };
        if (this.dragState.mode === "move") {
          next.x += dx;
          next.y += dy;
        } else {
          next.width = Math.max(24, next.width + dx);
          next.height = Math.max(24, next.height + dy);
        }
        const snapped = this.snapBox(next, this.dragState.mode);
        const safe = this.clampStageBox(snapped.box);
        this.setStagePosition(this.selected, safe.x, safe.y, safe.width, safe.height);
        this.showGuides(snapped.guides);
        this.updateFrame();
        this.updateInspector();
      }

      finishPointerAction() {
        if (!this.dragState) return;
        this.dragState = null;
        this.hideGuides();
        this.save(false, true);
      }

      addText() {
        const layer = document.createElement("div");
        const point = this.nextInsertPoint(460, 110);
        layer.className = "editor-layer text-layer editor-anim-rise";
        layer.dataset.editable = "";
        layer.dataset.editId = `layer-${Date.now()}`;
        layer.dataset.editAnim = "rise";
        layer.dataset.editDelay = "0";
        layer.dataset.editDuration = "640";
        layer.style.left = `${Math.round(point.x)}px`;
        layer.style.top = `${Math.round(point.y)}px`;
        layer.style.setProperty("--edit-delay", "0ms");
        layer.style.setProperty("--edit-duration", "640ms");
        layer.textContent = "双击编辑文字";
        this.activeSlide().appendChild(layer);
        this.bindElement(layer);
        this.select(layer);
        this.save();
      }

      addShape(shape = "rect") {
        const layer = document.createElement("div");
        const point = this.nextInsertPoint(280, 180);
        layer.className = "editor-layer shape-layer editor-anim-scale";
        layer.dataset.editId = `shape-${Date.now()}`;
        layer.dataset.editAnim = "scale";
        layer.dataset.editDelay = "0";
        layer.dataset.editDuration = "640";
        this.applyShape(layer, shape);
        layer.style.left = `${Math.round(point.x)}px`;
        layer.style.top = `${Math.round(point.y)}px`;
        layer.style.setProperty("--edit-delay", "0ms");
        layer.style.setProperty("--edit-duration", "640ms");
        this.activeSlide().appendChild(layer);
        this.bindElement(layer);
        this.select(layer);
        this.save();
      }

      addImage(dataUrl, x = this.lastInsert.x, y = this.lastInsert.y) {
        const point = arguments.length > 1 ? this.clampInsertPoint(x, y, 520, 320) : this.nextInsertPoint(520, 320);
        const wrapper = document.createElement("div");
        wrapper.className = "editor-layer image-layer editor-anim-scale";
        wrapper.dataset.editId = `image-${Date.now()}`;
        wrapper.dataset.editAnim = "scale";
        wrapper.dataset.editDelay = "0";
        wrapper.dataset.editDuration = "640";
        wrapper.style.left = `${Math.round(point.x)}px`;
        wrapper.style.top = `${Math.round(point.y)}px`;
        wrapper.style.setProperty("--edit-delay", "0ms");
        wrapper.style.setProperty("--edit-duration", "640ms");
        const image = document.createElement("img");
        image.src = dataUrl;
        image.alt = "用户添加的图片";
        wrapper.appendChild(image);
        this.activeSlide().appendChild(wrapper);
        this.bindElement(wrapper);
        this.select(wrapper);
        this.lastInsert = point;
        this.save();
      }

      applyShape(element, value) {
        element.dataset.shape = value || "rect";
        if (element.dataset.shape === "line") {
          element.style.height = `${Math.max(8, Number.parseInt(element.style.height || "14", 10) || 14)}px`;
        }
        if (!element.style.backgroundColor) element.style.backgroundColor = "rgba(31, 43, 224, 0.16)";
        this.updateInspector();
        this.updateFrame();
      }

      shapeLabel(value) {
        return {
          rect: "矩形",
          roundRect: "圆角矩形",
          circle: "圆形",
          triangle: "三角形",
          line: "直线",
          arrow: "箭头"
        }[value] || "矩形";
      }

      handleFileInput(event) {
        const file = event.target.files && event.target.files[0];
        if (!file) return;
        this.controls.imageName.textContent = file.name;
        this.readImageFile(file, (dataUrl) => {
          if (this.selected && this.isImageElement(this.selected)) {
            this.replaceImage(this.selected, dataUrl);
          } else {
            this.addImage(dataUrl);
          }
          this.controls.image.value = "";
          this.updateInspector();
        });
      }

      handleDrag(event) {
        if (!this.isActive) return;
        const hasImage = Array.from(event.dataTransfer?.items || []).some((item) => item.type.startsWith("image/"));
        if (!hasImage) return;
        event.preventDefault();
        document.body.classList.add("dragging-file");
        this.controls.dropZone.classList.add("dragging");
      }

      clearDrag(event) {
        if (event.type === "drop") return;
        document.body.classList.remove("dragging-file");
        this.controls.dropZone.classList.remove("dragging");
      }

      handleDrop(event) {
        if (!this.isActive) return;
        const file = Array.from(event.dataTransfer?.files || []).find((item) => item.type.startsWith("image/"));
        if (!file) return;
        event.preventDefault();
        document.body.classList.remove("dragging-file");
        this.controls.dropZone.classList.remove("dragging");
        const isDropZone = Boolean(event.target.closest(".drop-zone"));
        const isStageDrop = Boolean(event.target.closest(".deck-stage"));
        if (!isDropZone && !isStageDrop) {
          this.toastMessage("把图片拖到画布或图片区来添加");
          return;
        }
        const rawPoint = this.stagePointFromClient(event.clientX, event.clientY);
        const point = this.clampInsertPoint(rawPoint.x, rawPoint.y, 520, 320);
        this.lastInsert = { x: point.x, y: point.y };
        const target = this.getEditableTarget(event.target);
        this.readImageFile(file, (dataUrl) => {
          if (target && this.isImageElement(target)) {
            this.replaceImage(target, dataUrl);
            this.select(target);
          } else if (this.selected && this.isImageElement(this.selected) && event.target.closest(".drop-zone")) {
            this.replaceImage(this.selected, dataUrl);
          } else {
            this.addImage(dataUrl, point.x, point.y);
          }
        });
      }

      readImageFile(file, callback) {
        const reader = new FileReader();
        reader.addEventListener("load", () => callback(reader.result));
        reader.readAsDataURL(file);
      }

      replaceImage(element, dataUrl) {
        const image = element.tagName === "IMG" ? element : element.querySelector("img");
        if (image) {
          image.src = dataUrl;
          image.dataset.inlineImage = "true";
        } else {
          element.style.backgroundImage = `url("${dataUrl}")`;
          element.style.backgroundSize = "cover";
          element.style.backgroundPosition = "center";
          element.style.backgroundRepeat = "no-repeat";
          element.dataset.inlineImage = "true";
        }
        this.save();
        this.updateInspector();
        this.toastMessage("图片已替换");
      }

      motionClasses() {
        return ["reveal", "reveal-left", "reveal-scale"];
      }

      editorMotionClasses() {
        return ["editor-anim-none", "editor-anim-fade", "editor-anim-rise", "editor-anim-drop", "editor-anim-left", "editor-anim-right", "editor-anim-scale", "editor-anim-zoom", "editor-anim-pop", "editor-anim-rotate", "editor-anim-blur", "editor-anim-flip"];
      }

      ensureOriginalMotion(element) {
        if (!element || element.dataset.originalMotionClasses !== undefined) return;
        element.dataset.originalMotionClasses = this.motionClasses().filter((className) => element.classList.contains(className)).join(" ");
      }

      hasStoredOriginalMotion(element) {
        return Boolean(element && element.dataset.originalMotionClasses !== undefined);
      }

      originalMotionValue(element) {
        const classes = (element?.dataset.originalMotionClasses || "").split(/\s+/).filter(Boolean);
        if (classes.includes("reveal-left")) return "left";
        if (classes.includes("reveal-scale")) return "scale";
        if (classes.includes("reveal")) return "rise";
        return "";
      }

      currentMotionValue(element) {
        if (!element) return "";
        const custom = element.dataset.editAnim;
        if (custom) return custom;
        if (element.classList.contains("editor-anim-none")) return "none";
        if (element.classList.contains("editor-anim-fade")) return "fade";
        if (element.classList.contains("editor-anim-rise")) return "rise";
        if (element.classList.contains("editor-anim-drop")) return "drop";
        if (element.classList.contains("editor-anim-left")) return "left";
        if (element.classList.contains("editor-anim-right")) return "right";
        if (element.classList.contains("editor-anim-scale")) return "scale";
        if (element.classList.contains("editor-anim-zoom")) return "zoom";
        if (element.classList.contains("editor-anim-pop")) return "pop";
        if (element.classList.contains("editor-anim-rotate")) return "rotate";
        if (element.classList.contains("editor-anim-blur")) return "blur";
        if (element.classList.contains("editor-anim-flip")) return "flip";
        if (element.classList.contains("reveal-left")) return "left";
        if (element.classList.contains("reveal-scale")) return "scale";
        if (element.classList.contains("reveal")) return "rise";
        return "";
      }

      getMotionSelectValue(element) {
        return element?.dataset.editAnim || "";
      }

      usesCustomMotion(element) {
        return Boolean(element && element.dataset.editAnim && element.dataset.editAnim !== "none");
      }

      motionLabel(value) {
        return {
          none: "无动效",
          fade: "淡入",
          rise: "上浮入场",
          drop: "下落入场",
          left: "左侧滑入",
          right: "右侧滑入",
          scale: "缩放入场",
          zoom: "缩小落定",
          pop: "弹出入场",
          rotate: "旋入",
          blur: "模糊显现",
          flip: "翻转入场"
        }[value] || "无原始动效";
      }

      getMotionStatus(element) {
        const custom = element.dataset.editAnim;
        if (custom) {
          if (custom === "none") return "自定义：无动效";
          const order = element.dataset.editOrder ? `，本页第 ${element.dataset.editOrder} 个出现` : "";
          return `自定义：${this.motionLabel(custom)}${order}，延迟 ${element.dataset.editDelay || 0}ms，时长 ${element.dataset.editDuration || 640}ms`;
        }
        return `原始：${this.motionLabel(this.currentMotionValue(element))}`;
      }

      motionDelayForOrder(order) {
        return Math.max(0, (Math.max(1, order) - 1) * 180);
      }

      normalizeMotionOrder(value, fallback = 1) {
        const number = Number.parseInt(value, 10);
        return Number.isFinite(number) ? Math.max(1, number) : Math.max(1, fallback);
      }

      nextMotionOrder(element) {
        const slide = element?.closest(".slide");
        if (!slide) return 1;
        const orders = Array.from(slide.querySelectorAll("[data-edit-anim]"))
          .filter((node) => node !== element && node.dataset.editAnim && node.dataset.editAnim !== "none")
          .map((node) => this.normalizeMotionOrder(node.dataset.editOrder, 0));
        return orders.length ? Math.max(...orders) + 1 : 1;
      }

      setMotionOrder(element, value, updateDelay = false) {
        const order = this.normalizeMotionOrder(value, this.nextMotionOrder(element));
        element.dataset.editOrder = String(order);
        element.style.setProperty("--edit-order", String(order));
        if (updateDelay) {
          const delay = this.motionDelayForOrder(order);
          element.dataset.editDelay = String(delay);
          element.style.setProperty("--edit-delay", `${delay}ms`);
          this.controls.delay.value = delay;
        }
        return order;
      }

      applyAnimation(element, value, preview = false) {
        if (!element) return;
        this.ensureOriginalMotion(element);
        this.editorMotionClasses().forEach((className) => {
          element.classList.remove(className);
        });
        this.motionClasses().forEach((className) => element.classList.remove(className));

        if (!value) {
          this.restoreOriginalMotion(element, false);
          if (preview) this.previewMotion(element);
          return;
        }

        element.dataset.editAnim = value;
        if (value === "none") {
          element.classList.add("editor-anim-none");
          delete element.dataset.editOrder;
          delete element.dataset.editDelay;
          delete element.dataset.editDuration;
          element.style.removeProperty("--edit-order");
          element.style.removeProperty("--edit-delay");
          element.style.removeProperty("--edit-duration");
          this.toastMessage("已关闭选中元素动效");
          return;
        }

        const hasSavedDelay = element.dataset.editDelay !== undefined;
        const order = this.setMotionOrder(element, element.dataset.editOrder || this.nextMotionOrder(element), false);
        const delay = hasSavedDelay
          ? Math.max(0, Number(element.dataset.editDelay) || 0)
          : this.motionDelayForOrder(order);
        const duration = Math.max(100, Number(this.controls.duration.value) || Number(element.dataset.editDuration) || 640);
        element.dataset.editDelay = String(delay);
        element.dataset.editDuration = String(duration);
        element.classList.add(`editor-anim-${value}`);
        element.style.setProperty("--edit-delay", `${delay}ms`);
        element.style.setProperty("--edit-duration", `${duration}ms`);
        if (preview) this.previewMotion(element);
      }

      restoreOriginalMotion(element, shouldSave = true) {
        if (!element) return;
        const original = (element.dataset.originalMotionClasses || "").split(/\s+/).filter(Boolean);
        this.editorMotionClasses().forEach((className) => element.classList.remove(className));
        this.motionClasses().forEach((className) => element.classList.remove(className));
        original.forEach((className) => element.classList.add(className));
        delete element.dataset.editAnim;
        delete element.dataset.editOrder;
        delete element.dataset.editDelay;
        delete element.dataset.editDuration;
        delete element.dataset.originalMotionClasses;
        element.style.removeProperty("--edit-order");
        element.style.removeProperty("--edit-delay");
        element.style.removeProperty("--edit-duration");
        this.updateInspector();
        if (shouldSave) {
          this.save();
          this.previewMotion(element);
        }
      }

      scheduleMotionPreview() {
        window.clearTimeout(this.motionPreviewTimer);
        this.motionPreviewTimer = window.setTimeout(() => this.previewMotion(), 180);
      }

      previewMotion(element = this.selected) {
        if (!element) return;
        const value = this.currentMotionValue(element);
        if (!value || value === "none") {
          this.toastMessage("当前元素没有可预览的入场动效");
          return;
        }
        const previewClass = `editor-anim-${value}`;
        const hadClass = element.classList.contains(previewClass);
        const duration = Math.max(100, Number(element.dataset.editDuration) || Number(this.controls.duration.value) || 640);
        const delay = Math.max(0, Number(element.dataset.editDelay) || Number(this.controls.delay.value) || 0);
        element.style.setProperty("--edit-delay", `${delay}ms`);
        element.style.setProperty("--edit-duration", `${duration}ms`);
        element.classList.remove("editor-motion-preview");
        void element.offsetWidth;
        element.classList.add(previewClass, "editor-motion-preview");
        this.trackFrameDuringMotion(element, delay + duration + 160);
        window.clearTimeout(this.previewCleanupTimer);
        this.previewCleanupTimer = window.setTimeout(() => {
          element.classList.remove("editor-motion-preview");
          if (!hadClass && !element.dataset.editAnim) element.classList.remove(previewClass);
        }, delay + duration + 120);
      }

      replayActiveSlideMotion(showToast = true) {
        const slide = this.presentation.slides[this.presentation.currentSlide];
        if (!slide) return;
        slide.querySelectorAll(".editor-motion-preview").forEach((node) => node.classList.remove("editor-motion-preview"));
        slide.classList.remove("visible");
        void slide.offsetWidth;
        slide.classList.add("visible");
        if (this.selected && this.selected.closest(".slide") === slide) {
          this.trackFrameDuringMotion(this.selected, this.motionFrameTrackDuration(this.selected));
        }
        if (showToast) this.toastMessage("已重播本页动效");
      }

      bumpZIndex(delta) {
        if (!this.selected) return;
        const current = Number.parseInt(window.getComputedStyle(this.selected).zIndex, 10);
        const next = Number.isFinite(current) ? current + delta : 20 + delta;
        this.selected.style.zIndex = String(Math.max(1, next));
        this.save();
      }

      canDeleteElement(element) {
        return Boolean(
          element &&
          element.isConnected &&
          this.stage.contains(element) &&
          element.closest(".slide") &&
          !element.matches(".slide, .deck-stage, #deckStage, .editor-frame, .editor-guide, .editor-shell")
        );
      }

      confirmDeleteSelected() {
        if (!this.canDeleteElement(this.selected)) return;
        if (this.hasSeenDeleteConfirm()) {
          this.deleteSelected();
          return;
        }
        this.openConfirm({
          title: "确认删除",
          message: "删除后会从当前页面移除这个选中元素，并写入自动草稿。后续删除不再弹窗；你仍然可以立刻用撤回恢复。",
          okText: "删除",
          action: () => {
            this.markDeleteConfirmSeen();
            this.deleteSelected();
          }
        });
      }

      hasSeenDeleteConfirm() {
        return localStorage.getItem(this.deleteConfirmKey) === "true";
      }

      markDeleteConfirmSeen() {
        localStorage.setItem(this.deleteConfirmKey, "true");
      }

      deleteSelected() {
        if (!this.canDeleteElement(this.selected)) return;
        const element = this.selected;
        element.remove();
        this.clearSelection();
        this.save();
      }

      cleanEditorArtifacts(root) {
        root.querySelectorAll("#editorFrame, #editorToast, #editorGuideV, #editorGuideH, .editor-guide, .editor-shell").forEach((node) => node.remove());
        root.querySelectorAll(".editor-selected").forEach((node) => node.classList.remove("editor-selected"));
        root.querySelectorAll(".editor-motion-preview").forEach((node) => {
          node.classList.remove("editor-motion-preview");
          if (!node.dataset.editAnim) this.editorMotionClasses().forEach((className) => node.classList.remove(className));
        });
        root.querySelectorAll("[contenteditable]").forEach((node) => node.removeAttribute("contenteditable"));
        root.querySelectorAll("[data-editor-bound]").forEach((node) => delete node.dataset.editorBound);
        root.querySelectorAll("[data-editor-auto], [data-editor-kind]").forEach((node) => {
          delete node.dataset.editorAuto;
          delete node.dataset.editorKind;
        });
      }

      serialize() {
        const items = {};
        this.getEditableElements().forEach((element) => {
          const key = element.dataset.editId;
          if (!key) return;
          items[key] = {
            html: element.innerHTML,
            text: element.innerText,
            attrs: {
              class: element.getAttribute("class") || "",
              style: element.getAttribute("style") || "",
              src: element.getAttribute("src") || "",
              alt: element.getAttribute("alt") || "",
              shape: element.dataset.shape || "",
              editAnim: element.dataset.editAnim || "",
              editOrder: element.dataset.editOrder || "",
              editDelay: element.dataset.editDelay || "",
              editDuration: element.dataset.editDuration || ""
            }
          };
        });
        const stageClone = this.stage.cloneNode(true);
        this.cleanEditorArtifacts(stageClone);
        return { stage: stageClone.innerHTML, items };
      }

      save(showToast = true, recordHistory = true) {
        const data = this.serialize();
        localStorage.setItem(this.storageKey, JSON.stringify(data));
        if (recordHistory) this.pushHistory(data);
        if (showToast) this.toastMessage("已自动保存，可点“保存”写入 HTML");
      }

      restore() {
        const raw = this.readStoredDraft();
        if (!raw) return;
        try {
          const data = JSON.parse(raw);
          if (data.stage) this.restoreSnapshot(data);
          localStorage.setItem(this.storageKey, raw);
        } catch (error) {
          localStorage.removeItem(this.storageKey);
        }
      }

      readStoredDraft() {
        const current = localStorage.getItem(this.storageKey);
        if (current) return current;
        for (const key of this.legacyStorageKeys) {
          const legacy = localStorage.getItem(key);
          if (legacy) return legacy;
        }
        return "";
      }

      resetDraft() {
        localStorage.removeItem(this.storageKey);
        localStorage.removeItem(this.deleteConfirmKey);
        this.legacyStorageKeys.forEach((key) => localStorage.removeItem(key));
        this.toastMessage("本地草稿已清除，刷新后读取 HTML 文件本身");
      }

      confirmResetDraft() {
        this.openConfirm({
          title: "确认重置编辑",
          message: "这只会清除当前浏览器里的自动保存草稿和旧版草稿记录，不会删除或改写 HTML 文件。刷新后会重新读取文件本身；如果文件已经被覆盖保存过，看到的仍然是保存后的内容。",
          okText: "重置",
          action: () => this.resetDraft()
        });
      }

      pushHistory(data = this.serialize()) {
        if (this.isRestoringHistory) return;
        const snapshot = JSON.stringify(data);
        if (this.undoStack[this.historyIndex] === snapshot) {
          this.updateHistoryButtons();
          return;
        }
        if (this.historyIndex < this.undoStack.length - 1) {
          this.undoStack = this.undoStack.slice(0, this.historyIndex + 1);
        }
        this.undoStack.push(snapshot);
        if (this.undoStack.length > this.historyLimit) this.undoStack.shift();
        this.historyIndex = this.undoStack.length - 1;
        this.updateHistoryButtons();
      }

      undo() {
        if (this.historyIndex <= 0) return;
        this.historyIndex -= 1;
        const snapshot = this.undoStack[this.historyIndex];
        this.isRestoringHistory = true;
        try {
          this.restoreSnapshot(JSON.parse(snapshot));
          localStorage.setItem(this.storageKey, snapshot);
        } finally {
          this.isRestoringHistory = false;
          this.updateHistoryButtons();
        }
        this.toastMessage("已撤回");
      }

      redo() {
        if (this.historyIndex >= this.undoStack.length - 1) return;
        this.historyIndex += 1;
        const snapshot = this.undoStack[this.historyIndex];
        this.isRestoringHistory = true;
        try {
          this.restoreSnapshot(JSON.parse(snapshot));
          localStorage.setItem(this.storageKey, snapshot);
        } finally {
          this.isRestoringHistory = false;
          this.updateHistoryButtons();
        }
        this.toastMessage("已重做");
      }

      updateHistoryButtons() {
        this.controls.undo.disabled = this.historyIndex <= 0;
        this.controls.redo.disabled = this.historyIndex >= this.undoStack.length - 1;
      }

      restoreSnapshot(data) {
        this.stage.innerHTML = data.stage;
        this.cleanEditorArtifacts(this.stage);
        this.attachFrame();
        this.selected = null;
        this.presentation.slides = Array.from(this.stage.querySelectorAll(".slide"));
        this.presentation.injectChrome?.();
        this.prepareEditableElements();
        this.prepareEditableIds();
        this.bindEditableEvents();
        const page = Number.parseInt(window.location.hash.replace("#", ""), 10);
        this.presentation.showSlide(Number.isFinite(page) ? page - 1 : this.presentation.currentSlide);
        this.renderSlideRail();
        this.updateInspector();
      }

      cleanCloneForExport(clone) {
        clone.querySelectorAll("[data-generated-chrome]").forEach((node) => node.remove());
        clone.querySelectorAll(".editor-selected").forEach((node) => node.classList.remove("editor-selected"));
        clone.querySelectorAll("[contenteditable]").forEach((node) => node.removeAttribute("contenteditable"));
        clone.querySelectorAll("[data-editor-bound], [data-edit-id], [data-inline-image], [data-original-motion-classes]").forEach((node) => {
          delete node.dataset.editorBound;
          delete node.dataset.editId;
          delete node.dataset.inlineImage;
          delete node.dataset.originalMotionClasses;
        });
        clone.querySelectorAll("[data-editor-auto], [data-editor-kind]").forEach((node) => {
          delete node.dataset.editorAuto;
          delete node.dataset.editorKind;
        });
        clone.querySelectorAll(".editor-motion-preview").forEach((node) => {
          node.classList.remove("editor-motion-preview");
          if (!node.dataset.editAnim) this.editorMotionClasses().forEach((className) => node.classList.remove(className));
        });
        clone.querySelectorAll(".edit-toggle").forEach((node) => {
          node.classList.remove("active", "show");
        });
        clone.querySelectorAll(".editor-help-modal").forEach((node) => {
          node.hidden = true;
        });
        clone.querySelectorAll("#editorFrame, #editorGuideV, #editorGuideH, .editor-guide").forEach((node) => node.classList.remove("active"));
        clone.querySelectorAll("#editorToast").forEach((node) => {
          node.classList.remove("show");
          node.textContent = "";
        });
        const body = clone.querySelector("body");
        if (body) body.classList.remove("editing", "dragging-file");
      }

      buildExportHtml() {
        const clone = document.documentElement.cloneNode(true);
        this.cleanCloneForExport(clone);
        return "<!doctype html>\n" + clone.outerHTML;
      }

      async exportHtml() {
        this.save(false, false);
        const html = this.buildExportHtml();
        if (this.canWriteFile()) {
          try {
            await this.writeHtmlFile(html);
            this.toastMessage("已覆盖保存 HTML");
            return;
          } catch (error) {
            if (error && error.name === "AbortError") {
              this.toastMessage("已取消保存");
              return;
            }
          }
        }
        this.downloadHtml(html);
        this.toastMessage("已下载 HTML");
      }

      canWriteFile() {
        return window.isSecureContext && typeof window.showSaveFilePicker === "function";
      }

      async writeHtmlFile(html) {
        if (!this.fileHandle) {
          this.fileHandle = await window.showSaveFilePicker({
            suggestedName: "index.html",
            types: [
              {
                description: "HTML 文件",
                accept: { "text/html": [".html"] }
              }
            ]
          });
        }
        const writable = await this.fileHandle.createWritable();
        await writable.write(html);
        await writable.close();
      }

      downloadHtml(html) {
        const blob = new Blob([html], { type: "text/html;charset=utf-8" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "index.html";
        link.click();
        URL.revokeObjectURL(link.href);
      }

      toHex(value) {
        if (!value || value === "transparent" || value === "rgba(0, 0, 0, 0)") return "#ffffff";
        const match = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (!match) return value.startsWith("#") ? value : "#111111";
        return [1, 2, 3].map((index) => Number(match[index]).toString(16).padStart(2, "0")).join("").replace(/^/, "#");
      }

      toastMessage(message) {
        this.toast.textContent = message;
        this.toast.classList.add("show");
        window.clearTimeout(this.toastTimer);
        this.toastTimer = window.setTimeout(() => this.toast.classList.remove("show"), 1400);
      }
    }

  function mount(options = {}) {
    ensureEditorDom();
    const presentation = normalizePresentation(options.presentation || window.presentation);
    window.presentation = presentation;
    const editor = new DeckEditor(presentation);
    window.editor = editor;
    return editor;
  }

  window.FrontendSlidesEditor = { mount, DeckEditor };
})();
