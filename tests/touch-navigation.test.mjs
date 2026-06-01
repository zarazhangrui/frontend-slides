import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');

test('html template includes concrete touch swipe and wheel navigation', async () => {
  const template = await readFile(resolve(rootDir, 'html-template.md'), 'utf8');

  assert.match(template, /this\.setupWheelNav\(\)/);
  assert.match(template, /setupWheelNav\(\)\s*\{[\s\S]*wheel/);
  assert.match(template, /setupWheelNav\(\)\s*\{[\s\S]*WHEEL_THRESHOLD/);
  assert.match(template, /setupWheelNav\(\)\s*\{[\s\S]*this\.showSlide\(this\.currentSlide \+ direction\)/);
  assert.match(template, /setupTouchNav\(\)\s*\{[\s\S]*touchstart/);
  assert.match(template, /setupTouchNav\(\)\s*\{[\s\S]*const touchSurface = window/);
  assert.match(template, /setupTouchNav\(\)\s*\{[\s\S]*data-swipe-zone/);
  assert.match(template, /setupTouchNav\(\)\s*\{[\s\S]*touchend/);
  assert.match(template, /setupTouchNav\(\)\s*\{[\s\S]*SWIPE_THRESHOLD/);
  assert.match(template, /setupTouchNav\(\)\s*\{[\s\S]*this\.showSlide\(this\.currentSlide \+ 1\)/);
  assert.match(template, /setupTouchNav\(\)\s*\{[\s\S]*this\.showSlide\(this\.currentSlide - 1\)/);
});

test('deck-stage changes slides on horizontal touch swipes', async (t) => {
  const nodeMajor = Number(process.versions.node.split('.')[0]);
  if (nodeMajor < 18) {
    t.skip('Playwright requires Node.js 18 or newer');
    return;
  }

  let chromium;
  try {
    ({ chromium } = await import('playwright'));
  } catch (error) {
    t.skip(`Playwright is unavailable: ${error.message}`);
    return;
  }

  const deckStageScript = await readFile(resolve(rootDir, 'bold-template-pack/deck-stage.js'), 'utf8');
  const html = `<!doctype html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          html, body { margin: 0; width: 100%; height: 100%; overflow: hidden; }
          section { background: white; color: black; font: 80px sans-serif; }
        </style>
      </head>
      <body>
        <script>${deckStageScript}</script>
        <deck-stage>
          <section data-label="One">One</section>
          <section data-label="Two">Two</section>
          <section data-label="Three">Three</section>
        </deck-stage>
      </body>
    </html>`;

  const browser = await chromium.launch({ headless: true });
  t.after(async () => {
    await browser.close();
  });

  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  const client = await context.newCDPSession(page);

  await page.setContent(html, { waitUntil: 'load' });
  await page.waitForFunction(() => {
    const deck = document.querySelector('deck-stage');
    return deck && deck.length === 3 && deck.index === 0;
  });

  const swipe = async (fromX, toX, y = 420) => {
    await client.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ x: fromX, y }],
    });
    await page.waitForTimeout(40);
    await client.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x: (fromX + toX) / 2, y }],
    });
    await page.waitForTimeout(40);
    await client.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x: toX, y }],
    });
    await page.waitForTimeout(40);
    await client.send('Input.dispatchTouchEvent', {
      type: 'touchEnd',
      touchPoints: [],
    });
    await page.waitForTimeout(80);
  };

  await swipe(330, 80);
  assert.equal(await page.$eval('deck-stage', (deck) => deck.index), 1);

  await swipe(80, 330);
  assert.equal(await page.$eval('deck-stage', (deck) => deck.index), 0);

  await swipe(330, 300);
  assert.equal(await page.$eval('deck-stage', (deck) => deck.index), 0);
});

test('deck-stage changes slides on short mouse wheel gestures', async (t) => {
  const nodeMajor = Number(process.versions.node.split('.')[0]);
  if (nodeMajor < 18) {
    t.skip('Playwright requires Node.js 18 or newer');
    return;
  }

  let chromium;
  try {
    ({ chromium } = await import('playwright'));
  } catch (error) {
    t.skip(`Playwright is unavailable: ${error.message}`);
    return;
  }

  const deckStageScript = await readFile(resolve(rootDir, 'bold-template-pack/deck-stage.js'), 'utf8');
  const html = `<!doctype html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          html, body { margin: 0; width: 100%; height: 100%; overflow: hidden; }
          section { background: white; color: black; font: 80px sans-serif; }
        </style>
      </head>
      <body>
        <script>${deckStageScript}</script>
        <deck-stage>
          <section data-label="One">One</section>
          <section data-label="Two">Two</section>
          <section data-label="Three">Three</section>
        </deck-stage>
      </body>
    </html>`;

  const browser = await chromium.launch({ headless: true });
  t.after(async () => {
    await browser.close();
  });

  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.setContent(html, { waitUntil: 'load' });
  await page.waitForFunction(() => {
    const deck = document.querySelector('deck-stage');
    return deck && deck.length === 3 && deck.index === 0;
  });

  await page.mouse.wheel(0, 60);
  await page.waitForTimeout(120);
  assert.equal(await page.$eval('deck-stage', (deck) => deck.index), 1);

  await page.waitForTimeout(520);
  await page.mouse.wheel(0, -60);
  await page.waitForTimeout(120);
  assert.equal(await page.$eval('deck-stage', (deck) => deck.index), 0);

  await page.waitForTimeout(520);
  await page.mouse.wheel(0, 10);
  await page.waitForTimeout(120);
  assert.equal(await page.$eval('deck-stage', (deck) => deck.index), 0);
});
