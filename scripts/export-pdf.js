#!/usr/bin/env node
/**
 * export-pdf.js — Export HTML slide presentations to PDF
 *
 * Handles three issues that break naive PDF export:
 * 1. Fontshare fonts have broken PostScript names ("false") — patches them
 * 2. Scroll-snap 100vh layouts don't paginate — rewrites DOM before export
 * 3. Transparent gradient overlays are expensive in Preview — strips them
 *
 * Usage:
 *   npx -p playwright node export-pdf.js <input.html> [output.pdf]
 *
 * Prerequisites:
 *   - Node.js 18+
 *   - Playwright: npx playwright install chromium
 *   - Python 3 + fonttools: pip3 install fonttools (only if Fontshare fonts detected)
 *   - qpdf: brew install qpdf (optional, for linearization)
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const https = require('https');

// --- Config ---
const WIDTH = 1280;   // CSS pixels → 960 PDF points (standard widescreen)
const HEIGHT = 720;   // CSS pixels → 540 PDF points
const FONT_LOAD_WAIT = 2000; // ms after font injection
const SETTLE_WAIT = 500;     // ms after DOM rewrite

// --- Helpers ---

function fetchBinary(url) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('http:') ? require('http') : https;
        protocol.get(url, res => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                return fetchBinary(res.headers.location).then(resolve).catch(reject);
            }
            const chunks = [];
            res.on('data', c => chunks.push(c));
            res.on('end', () => resolve(Buffer.concat(chunks)));
        }).on('error', reject);
    });
}

/**
 * Detect Fontshare fonts in the HTML file.
 * Returns an array of { family, weight, url } for each @font-face using Fontshare CDN.
 */
function detectFontshare(htmlContent) {
    const fontshareLink = htmlContent.match(/fontshare\.com[^"']*/);
    if (!fontshareLink) return null;

    // Parse the Fontshare CSS URL to extract font specs
    const url = fontshareLink[0].startsWith('//') ? 'https:' + fontshareLink[0] :
                fontshareLink[0].startsWith('http') ? fontshareLink[0] :
                'https://' + fontshareLink[0];
    return url;
}

/**
 * Patch Fontshare font name tables using Python fonttools.
 * Fontshare ships fonts with PostScript name "false" — this fixes it.
 */
async function patchFontshareCSS(fontshareUrl) {
    console.log('  Fetching Fontshare CSS...');
    const css = await fetchBinary(fontshareUrl).then(b => b.toString('utf-8'));

    // Parse @font-face blocks
    const faceRegex = /@font-face\s*\{([^}]+)\}/g;
    const fonts = [];
    let match;

    while ((match = faceRegex.exec(css)) !== null) {
        const block = match[1];
        const family = block.match(/font-family:\s*'([^']+)'/)?.[1];
        const weight = block.match(/font-weight:\s*(\d+)/)?.[1];
        const ttfUrl = block.match(/url\('([^']+\.ttf)'\)/)?.[1];

        if (family && weight && ttfUrl) {
            const fullUrl = ttfUrl.startsWith('//') ? 'https:' + ttfUrl : ttfUrl;
            fonts.push({ family, weight, url: fullUrl });
        }
    }

    if (fonts.length === 0) {
        console.log('  No TTF fonts found in Fontshare CSS');
        return null;
    }

    // Download and patch each font
    console.log(`  Found ${fonts.length} Fontshare fonts, downloading and patching...`);
    const patchedFonts = [];

    for (const font of fonts) {
        const weightName = { '300': 'Light', '400': 'Regular', '500': 'Medium', '700': 'Bold', '900': 'Black' }[font.weight] || font.weight;
        const psName = `${font.family}-${weightName}`;

        // Download TTF
        const ttfBuffer = await fetchBinary(font.url);
        const tmpPath = `/tmp/fontshare-${psName}-raw.ttf`;
        const patchedPath = `/tmp/fontshare-${psName}.ttf`;
        fs.writeFileSync(tmpPath, ttfBuffer);

        // Patch with fonttools
        try {
            execSync(`python3 -c "
from fontTools.ttLib import TTFont
font = TTFont('${tmpPath}')
name_table = font['name']
for record in name_table.names:
    nid = record.nameID
    if nid == 1: record.string = '${font.family}'
    elif nid == 2: record.string = '${weightName}'
    elif nid == 4: record.string = '${font.family} ${weightName}'
    elif nid == 6: record.string = '${psName}'
font.save('${patchedPath}')
"`, { stdio: 'pipe' });
        } catch (e) {
            console.error(`  ERROR: fonttools failed for ${psName}. Install with: pip3 install fonttools`);
            console.error(`  Falling back to unpatched font (PDF may have blurry text in Preview)`);
            fs.copyFileSync(tmpPath, patchedPath);
        }

        const patchedBuffer = fs.readFileSync(patchedPath);
        patchedFonts.push({
            family: font.family,
            weight: font.weight,
            base64: patchedBuffer.toString('base64'),
            psName,
        });
        console.log(`    ${psName}: ${(patchedBuffer.length / 1024).toFixed(0)} KB`);
    }

    // Build CSS with base64-inlined patched fonts
    const cssBlocks = patchedFonts.map(f =>
        `@font-face { font-family: '${f.family}'; src: url('data:font/truetype;base64,${f.base64}') format('truetype'); font-weight: ${f.weight}; font-style: normal; }`
    ).join('\n');

    return cssBlocks;
}

// --- Main ---

async function exportPDF(inputPath, outputPath) {
    const t0 = Date.now();
    const htmlContent = fs.readFileSync(inputPath, 'utf-8');

    // Step 1: Detect and patch Fontshare fonts
    let patchedFontCSS = null;
    const fontshareUrl = detectFontshare(htmlContent);
    if (fontshareUrl) {
        console.log('Fontshare fonts detected — patching PostScript names...');
        patchedFontCSS = await patchFontshareCSS(fontshareUrl);
    } else {
        console.log('No Fontshare fonts detected (using Google Fonts — good)');
    }

    // Step 2: Launch browser at standard widescreen dimensions
    console.log(`Launching browser at ${WIDTH}×${HEIGHT}...`);
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.setViewportSize({ width: WIDTH, height: HEIGHT });

    const fileUrl = inputPath.startsWith('/') ? `file://${inputPath}` : `file://${path.resolve(inputPath)}`;
    await page.goto(fileUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(FONT_LOAD_WAIT);

    // Step 3: Inject patched fonts (if Fontshare was detected)
    if (patchedFontCSS) {
        await page.evaluate(() => {
            const link = document.querySelector('link[href*="fontshare"]');
            if (link) link.remove();
        });
        await page.addStyleTag({ content: patchedFontCSS });
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(FONT_LOAD_WAIT);
        console.log('Patched fonts injected');
    } else {
        await page.evaluate(() => document.fonts.ready);
    }

    // Step 4: Flatten transparency (strip gradient ::before pseudo-elements)
    await page.addStyleTag({ content: '.slide::before { display: none !important; content: none !important; }' });

    // Step 5: DOM rewrite for pagination
    const slideCount = await page.evaluate((h) => {
        document.documentElement.style.scrollSnapType = 'none';
        document.documentElement.style.scrollBehavior = 'auto';
        document.documentElement.style.overflow = 'visible';
        document.documentElement.style.height = 'auto';
        document.body.style.overflow = 'visible';
        document.body.style.height = 'auto';

        document.querySelectorAll('.slide').forEach(slide => {
            slide.style.height = h + 'px';
            slide.style.minHeight = h + 'px';
            slide.style.maxHeight = h + 'px';
            slide.style.overflow = 'hidden';
            slide.style.pageBreakAfter = 'always';
            slide.style.breakAfter = 'page';
            slide.style.scrollSnapAlign = 'none';
            slide.classList.add('visible');
        });

        document.querySelectorAll('.reveal, .reveal-scale, .title-reveal, .reveal-fade').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
            el.style.transition = 'none';
        });
        document.querySelectorAll('.accent-line').forEach(el => {
            el.style.transform = 'scaleX(1)';
            el.style.transition = 'none';
        });
        document.querySelectorAll('.nav-dots, .progress-bar, .edit-hotzone, .edit-toggle, .save-indicator').forEach(el => {
            el.style.display = 'none';
        });

        return document.querySelectorAll('.slide').length;
    }, HEIGHT);

    await page.waitForTimeout(SETTLE_WAIT);
    console.log(`${slideCount} slides prepared for export`);

    // Step 6: Generate PDF
    await page.pdf({
        path: outputPath,
        width: WIDTH + 'px',
        height: HEIGHT + 'px',
        printBackground: true,
        margin: { top: '0', right: '0', bottom: '0', left: '0' },
    });
    await browser.close();

    // Step 7: Linearize with qpdf (if available)
    try {
        execSync(`qpdf --linearize "${outputPath}" "${outputPath}.tmp" && mv "${outputPath}.tmp" "${outputPath}"`, { stdio: 'pipe' });
        console.log('PDF linearized (qpdf)');
    } catch {
        console.log('qpdf not found — skipping linearization (install with: brew install qpdf)');
    }

    // Step 8: Report
    const stat = fs.statSync(outputPath);
    const sizeKB = (stat.size / 1024).toFixed(0);
    console.log(`\nDone: ${outputPath}`);
    console.log(`  ${slideCount} slides, ${sizeKB} KB, ${Date.now() - t0}ms`);
    console.log(`  Page size: 960 × 540 pts (standard widescreen)`);

    // Verify fonts if pdffonts is available
    try {
        const fonts = execSync(`pdffonts "${outputPath}" 2>/dev/null`, { encoding: 'utf-8' });
        const hasFalse = fonts.includes('+false');
        if (hasFalse) {
            console.log('\n  ⚠ WARNING: Font names contain "+false" — Preview may be sluggish.');
            console.log('  Install fonttools (pip3 install fonttools) to fix this.');
        } else {
            console.log('  Fonts: ✓ all names correct');
        }
    } catch {
        // pdffonts not available — skip
    }
}

// --- CLI ---

const args = process.argv.slice(2);
if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage: npx -p playwright node export-pdf.js <input.html> [output.pdf]

Exports an HTML slide presentation to PDF with:
  - Correct font embedding (patches Fontshare font names if detected)
  - Standard widescreen page dimensions (960×540 pts)
  - Flattened transparency (no gradient overlays in PDF)
  - Linearized output (progressive loading in Preview)

Prerequisites:
  npx playwright install chromium     # Browser engine
  pip3 install fonttools              # Font patching (only for Fontshare fonts)
  brew install qpdf                   # PDF linearization (optional)
`);
    process.exit(0);
}

const input = path.resolve(args[0]);
const output = args[1] ? path.resolve(args[1]) : input.replace(/\.html$/, '.pdf');

if (!fs.existsSync(input)) {
    console.error(`Error: ${input} not found`);
    process.exit(1);
}

exportPDF(input, output).catch(e => {
    console.error(e);
    process.exit(1);
});
