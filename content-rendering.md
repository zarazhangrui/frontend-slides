# Content Rendering (Math & Code)

Optional module for presentations that need math equations or syntax-highlighted code blocks. Uses native HTML standards with zero external dependencies.

## MathML (No External Dependencies)

Use native HTML MathML for math equations - no KaTeX or external libraries required.

### Inline Math

```html
<p>The famous equation <math><mi>E</mi><mo>=</mo><mi>m</mi><msup><mi>c</mi><mn>2</mn></msup></math> shows mass-energy equivalence.</p>
```

### Block Math

```html
<div class="math-block">
    <math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
        <mrow>
            <msubsup>
                <mo>&#8747;</mo>
                <mrow><mo>&#8722;</mo><mi>&#8734;</mi></mrow>
                <mi>&#8734;</mi>
            </msubsup>
            <msup>
                <mi>e</mi>
                <mrow><mo>&#8722;</mo><msup><mi>x</mi><mn>2</mn></msup></mrow>
            </msup>
            <mi>dx</mi>
            <mo>=</mo>
            <msqrt>
                <mi>&#960;</mi>
            </msqrt>
        </mrow>
    </math>
</div>
```

### Common MathML Examples

| Description | MathML |
|-------------|--------|
| Fractions | `<mfrac><mi>a</mi><mi>b</mi></mfrac>` |
| Square root | `<msqrt><mi>x</mi></msqrt>` |
| Superscript | `<msup><mi>x</mi><mn>2</mn></msup>` |
| Subscript | `<msub><mi>x</mi><mn>i</mn></msub>` |
| Sum | `<munderover><mo>&#8721;</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow><mi>n</mi></munderover>` |
| Integral | `<msubsup><mo>&#8747;</mo><mi>a</mi><mi>b</mi></msubsup>` |
| Greek letters | `<mi>&#960;</mi>`, `<mi>&#945;</mi>`, `<mi>&#946;</mi>` |

### CSS for MathML

```css
.math-block {
    margin: 1em 0;
    overflow-x: auto;
}

math {
    font-size: 1.1em;
}

.math-block math {
    display: block;
    text-align: center;
}
```

---

## Syntax Highlighting (Local PrismJS)

For code blocks with syntax highlighting, use the local PrismJS files from the `syntax-highlight/` folder.

### Including PrismJS

Add these to your HTML head (using local files):

```html
<!-- Syntax highlighting CSS -->
<link rel="stylesheet" href="syntax-highlight/prism-tomorrow.css">

<!-- Syntax highlighting JS -->
<script src="syntax-highlight/prism-core.js"></script>
<script src="syntax-highlight/prism-javascript.js"></script>
<script src="syntax-highlight/prism-python.js"></script>
<!-- Add more languages as needed -->
```

### Code Block Usage

```html
<pre><code class="language-javascript">function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}</code></pre>
```

### Available Languages

The `syntax-highlight/` folder includes:
- `prism-core.js` - Core library
- `prism-clike.js` - C-like base grammar (required by C and C++)
- `prism-javascript.js` - JavaScript
- `prism-typescript.js` - TypeScript
- `prism-python.js` - Python
- `prism-css.js` - CSS
- `prism-bash.js` - Bash/Shell
- `prism-go.js` - Go
- `prism-sql.js` - SQL
- `prism-c.js` - C (requires `prism-clike.js`)
- `prism-cpp.js` - C++ (requires `prism-clike.js` and `prism-c.js`)
- `prism-rust.js` - Rust
- `prism-pseudocode.js` - Pseudocode (`language-pseudocode`, `language-pseudo`, `language-pso`)

**Load order matters for C/C++** — include dependencies before the language file:

```html
<script src="syntax-highlight/prism-core.js"></script>
<script src="syntax-highlight/prism-clike.js"></script>  <!-- required by C/C++ -->
<script src="syntax-highlight/prism-c.js"></script>
<script src="syntax-highlight/prism-cpp.js"></script>    <!-- requires C -->
<script src="syntax-highlight/prism-rust.js"></script>
<script src="syntax-highlight/prism-pseudocode.js"></script>
```

### CSS Styles for Code Blocks

```css
.markdown-content pre {
    margin: 1em 0;
    border-radius: 8px;
    overflow-x: auto;
    background: var(--bg-secondary, #1d1f21);
}

.markdown-content pre code {
    font-size: var(--small-size, clamp(0.65rem, 1vw, 0.875rem));
    line-height: 1.5;
    color: var(--text-primary);
    font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace;
}

/* Ensure Prism tokens are visible on both light and dark themes */
.markdown-content pre code .token.comment,
.markdown-content pre code .token.prolog,
.markdown-content pre code .token.doctype,
.markdown-content pre code .token.cdata { color: #969896; }
.markdown-content pre code .token.punctuation { color: var(--text-secondary); }
.markdown-content pre code .token.property,
.markdown-content pre code .token.tag,
.markdown-content pre code .token.boolean,
.markdown-content pre code .token.number,
.markdown-content pre code .token.constant,
.markdown-content pre code .token.symbol,
.markdown-content pre code .token.deleted { color: #f99157; }
.markdown-content pre code .token.selector,
.markdown-content pre code .token.attr-name,
.markdown-content pre code .token.string,
.markdown-content pre code .token.char,
.markdown-content pre code .token.builtin,
.markdown-content pre code .token.inserted { color: #99cc99; }
.markdown-content pre code .token.operator,
.markdown-content pre code .token.entity,
.markdown-content pre code .token.url { color: #71b7be; }
.markdown-content pre code .token.atrule,
.markdown-content pre code .token.attr-value,
.markdown-content pre code .token.keyword { color: #cc99cc; }
.markdown-content pre code .token.function,
.markdown-content pre code .token.class-name { color: #6699cc; }
.markdown-content pre code .token.regex,
.markdown-content pre code .token.important,
.markdown-content pre code .token.variable { color: #f99157; }
```

---

## Complete Example

```html
<section class="slide">
    <div class="slide-content">
        <h1>Math & Code Example</h1>

        <p>The quadratic formula: <math><mi>x</mi><mo>=</mo><mfrac><mrow><mo>&#8722;</mo><mi>b</mi><mo>&#177;</mo><msqrt><mrow><msup><mi>b</mi><mn>2</mn></msup><mo>&#8722;</mo><mn>4</mn><mi>a</mi><mi>c</mi></mrow></msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac></math></p>

        <h2>Code Example</h2>
        <pre><code class="language-python">def greet(name):
    return f"Hello, {name}!"

print(greet("World"))</code></pre>
    </div>
</section>
```

---

## Notes

- **MathML** is supported natively in all modern browsers (Chrome, Firefox, Safari, Edge)
- **No external dependencies** - all required files are included locally in the `syntax-highlight/` folder
- **Theme-aware** - CSS uses CSS custom properties to work with both light and dark themes
- Only include PrismJS languages that are actually needed to keep file size minimal
