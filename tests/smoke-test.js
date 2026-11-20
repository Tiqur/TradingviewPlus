// TradingView smoke test: checks that TVP still works with TradingView's current charts.
//
//   node tests/smoke-test.js <unpacked tvp-chrome folder> [results folder]
//
// Loads the extension in headless Chromium and checks:
// - TradingView's Trading Terminal demo, where drawing works without an account: once with the
//   TradingView adapter and once with the XM adapter (the demo runs the chart library XM uses)
// - tradingview.com, logged out: what TVP needs there that works without drawing
// Writes results.md and screenshots to the results folder. Exits 1 if a check failed.
// Needs Playwright (npm install --no-save playwright), which isn't one of the extension's dependencies.
import { chromium } from 'playwright';
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const [extDir, outDir = 'smoke-results'] = process.argv.slice(2);
if (!extDir) {
  console.error('Usage: node tests/smoke-test.js <unpacked tvp-chrome folder> [results folder]');
  process.exit(2);
}

const DEMO = 'https://trading-terminal.tradingview-widget.com/';
const DEMO_BLOB = 'blob:https://trading-terminal.tradingview-widget.com/';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36';
// Auto Timeframe Colors' default colours for these timeframes
const DEFAULT_COLORS = { '5': '255,152,0', '15': '76,175,80', '60': '0,188,212' };
const CUSTOM_HEX = '00ffaa';

const sleep = ms => new Promise(res => setTimeout(res, ms));
const results = [];
let section = '';

function check(name, ok, detail = '') {
  const text = typeof detail === 'string' ? detail : JSON.stringify(detail);
  results.push({ section, name, ok: !!ok, detail: text });
  console.log(`${ok ? 'PASS' : 'FAIL'} [${section}] ${name}${text ? ': ' + text : ''}`);
  return !!ok;
}

// 'rgba(76, 175, 80, 1)' or '#4caf50' -> '76,175,80'
function rgb(color) {
  const c = String(color);
  if (c.startsWith('#')) return [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16)).join(',');
  return (c.match(/\d+/g) || []).slice(0, 3).join(',');
}

async function waitFor(fn, timeout = 8000) {
  const end = Date.now() + timeout;
  let value;
  while (Date.now() < end) {
    try { value = await fn(); if (value) return value; } catch {}
    await sleep(250);
  }
  return value;
}

// A copy of the extension that runs on the demo as the platform detected by `platformUrl`
function demoCopy(name, platformUrl) {
  const dir = path.resolve(outDir, 'ext-' + name);
  rmSync(dir, { recursive: true, force: true });
  cpSync(extDir, dir, { recursive: true });

  const manifestPath = path.join(dir, 'manifest.json');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  for (const script of manifest.content_scripts) {
    if (script.matches.includes('*://my.xm.com/*')) script.matches.push('*://trading-terminal.tradingview-widget.com/*');
  }
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  const mainPath = path.join(dir, 'dist', 'main.js');
  const main = readFileSync(mainPath, 'utf8');
  if (!main.includes(platformUrl)) throw new Error(`The test needs updating: "${platformUrl}" is no longer in dist/main.js`);
  writeFileSync(mainPath, main.replace(platformUrl, DEMO_BLOB));
  return dir;
}

function launch(dir) {
  return chromium.launchPersistentContext('', {
    channel: 'chromium', // headless Chromium that can load extensions
    viewport: { width: 1600, height: 900 },
    userAgent: UA,
    args: [`--disable-extensions-except=${dir}`, `--load-extension=${dir}`],
  });
}

async function screenshot(page, name) {
  try { await page.screenshot({ path: path.join(outDir, name + '.png') }); } catch {}
}

// ─── TVP menu (DOM clicks reach the extension's listeners) ──────────────────

const ROW = `name => Array.from(document.querySelectorAll('.tvp-feature')).find(r => r.querySelector('p').textContent === name)`;

async function runSetupDefaults(frame) {
  await frame.evaluate(`(${ROW})('Setup Defaults').querySelector('input').click()`);
  await sleep(500);
  await frame.evaluate(`Array.from(document.querySelectorAll('#tvp-confirm-dialog button')).find(b => b.textContent === 'OK').click()`);
  await sleep(2500);
}

// ─── Demo ────────────────────────────────────────────────────────────────────

async function chartFrame(page) {
  return waitFor(async () => {
    for (const f of page.frames()) {
      if (!f.url().startsWith('blob:')) continue;
      const ready = await f.evaluate(() => !!document.getElementById('tvp-menu') && !!window.tradingViewApi?.activeChart
        && window.tradingViewApi.activeChart().dataReady(() => {})).catch(() => false);
      if (ready) return f;
    }
  }, 90000);
}

// A trend line across the middle of the chart, selected (as after drawing it)
async function newLine(frame) {
  await frame.evaluate(async () => {
    const c = window.tradingViewApi.activeChart();
    c.getAllShapes().forEach(s => c.removeEntity(s.id));
    const r = c.getVisibleRange();
    const pr = c.getPanes()[0].getMainSourcePriceScale().getVisiblePriceRange();
    const mid = (pr.from + pr.to) / 2;
    window.__tvpLine = await c.createMultipointShape(
      [{ time: r.from + (r.to - r.from) * 0.3, price: mid }, { time: r.from + (r.to - r.from) * 0.6, price: mid * 1.001 }],
      { shape: 'trend_line' });
    c.selection().add(window.__tvpLine);
  });
  await sleep(2500);
}

const lineProps = frame => frame.evaluate(() => {
  const c = window.tradingViewApi.activeChart();
  const s = c.getAllShapes().find(x => x.id === window.__tvpLine);
  return s ? c.getShapeById(s.id).getProperties() : null;
});

async function setResolution(frame, res) {
  await frame.evaluate(r => window.tradingViewApi.activeChart().setResolution(r), res);
}

// Clicks the chart (so it has the keyboard), then selects the line again and presses `key`
async function pressOnLine(page, frame, key) {
  const box = await frame.frameElement().then(e => e.boundingBox());
  await page.mouse.click(box.x + box.width * 0.75, box.y + box.height * 0.8);
  await frame.evaluate(() => window.tradingViewApi.activeChart().selection().add(window.__tvpLine));
  await sleep(1500);
  await page.keyboard.press(key);
  await sleep(1500);
}

async function demoChecks(platform, dir) {
  section = `Demo (${platform} adapter)`;
  const context = await launch(dir);
  const page = context.pages()[0] || await context.newPage();
  try {
    await page.goto(DEMO, { waitUntil: 'domcontentloaded', timeout: 60000 });
    const frame = await chartFrame(page);
    if (!check('demo chart loads with TVP in it', frame, frame ? '' : 'no chart frame with the TVP menu after 90 s')) return;

    await runSetupDefaults(frame);
    const defaults = await frame.evaluate(() => ({
      timeframes: document.querySelectorAll('#header-toolbar-intervals div button').length,
      magnet: window.tradingViewApi.magnetEnabled().value(),
    }));
    check('Setup Defaults stars timeframes and turns on the magnet', defaults.timeframes >= 10 && defaults.magnet, defaults);

    // Auto Timeframe Colors: the selected line takes each timeframe's colour
    await setResolution(frame, '5');
    await sleep(2000);
    await newLine(frame);
    for (const res of ['15', '60', '5']) {
      await setResolution(frame, res);
      const color = await waitFor(async () => {
        const p = await lineProps(frame);
        return p && rgb(p.linecolor) === DEFAULT_COLORS[res] ? p.linecolor : null;
      });
      check(`Auto Timeframe Colors: line turns the ${res === '60' ? '1h' : res + 'm'} colour`, color, color || (await lineProps(frame))?.linecolor);
      // At a person's pace: TVP skips a switch that comes while it's still applying the last colour
      await sleep(2000);
    }

    // Custom colour, added with the picker's + and hex field for 15m
    await frame.evaluate(() => document.getElementById('Auto Timeframe Colors-svg-dots').closest('button').click());
    await sleep(400);
    await frame.evaluate(() => Array.from(document.querySelectorAll('.contextMenu p')).find(p => p.textContent === 'Colors').click());
    await sleep(400);
    const picked = await frame.evaluate(hex => {
      const row = Array.from(document.querySelectorAll('.auto-timeframe-colors-context-menu > div')).find(d => d.querySelector('p').textContent === '15m');
      if (!row) return 'no 15m row in the Colors menu';
      row.querySelector('.color-square').click();
      const picker = document.querySelector('.tvp-color-picker');
      picker.querySelector('.tvp-picker-plus').click();
      const input = picker.querySelector('.tvp-picker-hex input');
      if (!input) return 'no hex field after +';
      input.value = hex;
      picker.querySelector('.tvp-picker-form').requestSubmit();
      return JSON.parse(window.TVSettings?.getValue('pickerCustomColors') || '[]').includes('#' + hex) ? 'ok' : 'not added to TradingView\'s custom colours';
    }, CUSTOM_HEX);
    check('custom colour added with + goes into TradingView\'s custom colours', picked === 'ok', picked === 'ok' ? '' : picked);
    // Escape closes the menus but also deselects the line, so select it again
    await page.keyboard.press('Escape');
    await frame.evaluate(() => window.tradingViewApi.activeChart().selection().add(window.__tvpLine));
    await sleep(1500);
    await setResolution(frame, '60');
    await sleep(3000);
    await setResolution(frame, '15');
    const custom = await waitFor(async () => {
      const p = await lineProps(frame);
      return p && rgb(p.linecolor) === rgb('#' + CUSTOM_HEX) ? p.linecolor : null;
    });
    check('Auto Timeframe Colors: line turns the custom colour', custom, custom || (await lineProps(frame))?.linecolor);

    // Hotkeys on the selected line: W (width), Q (style), D (delete)
    const before = await lineProps(frame);
    await pressOnLine(page, frame, 'w');
    const width = (await lineProps(frame))?.linewidth;
    check('W changes the line width', before && width !== before.linewidth, { before: before?.linewidth, after: width });
    await pressOnLine(page, frame, 'q');
    const style = (await lineProps(frame))?.linestyle;
    check('Q changes the line style', before && style !== before.linestyle, { before: before?.linestyle, after: style });
    await pressOnLine(page, frame, 'd');
    const left = await waitFor(() => frame.evaluate(() => window.tradingViewApi.activeChart().getAllShapes().length === 0));
    check('D deletes the selected drawing', left);

    // Quick Toolbar: 1 picks the first favourite drawing tool
    await frame.evaluate(() => window.tradingViewApi.selectLineTool('cursor'));
    await page.keyboard.press('1');
    const tool = await waitFor(() => frame.evaluate(() => { const t = window.tradingViewApi.selectedLineTool(); return t !== 'cursor' ? t : null; }), 4000);
    check('Quick Toolbar: 1 picks a favourite drawing tool', tool, tool || 'still the cursor');
    await frame.evaluate(() => window.tradingViewApi.selectLineTool('cursor'));

    // TVP menu opens with M
    await page.keyboard.press('Escape');
    await page.keyboard.press('m');
    const menuOpen = await waitFor(() => frame.evaluate(() => document.getElementById('tvp-menu').style.left === '0px'), 3000);
    check('M opens the TVP menu', menuOpen);
    await screenshot(page, `demo-${platform.toLowerCase()}`);
  } catch (e) {
    check('test ran to the end', false, e.message.split('\n')[0]);
    await screenshot(page, `demo-${platform.toLowerCase()}-error`);
  } finally {
    await context.close();
  }
}

// ─── tradingview.com (logged out) ────────────────────────────────────────────

async function tradingViewChecks(dir) {
  section = 'tradingview.com (logged out)';
  const context = await launch(dir);
  const page = context.pages()[0] || await context.newPage();
  const closePopups = () => page.evaluate(() => document.querySelectorAll('[data-dialog-name]').forEach(d => d.remove())).catch(() => {});
  try {
    await page.goto('https://www.tradingview.com/chart/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    const loaded = await waitFor(() => page.evaluate(() => !!document.querySelector('.chart-gui-wrapper canvas') && !!document.getElementById('tvp-menu')
      && !!window.TradingViewApi?.activeChart), 90000);
    if (!check('chart loads with TVP in it', loaded, loaded ? '' : 'no chart or no TVP menu after 90 s (the site may have blocked the test)')) {
      await screenshot(page, 'tradingview-error');
      return;
    }
    await sleep(3000);
    await closePopups();

    const api = await page.evaluate(() => ({
      chart: typeof window.TradingViewApi.activeChart === 'function',
      settings: typeof window.TVSettings?.getValue === 'function',
      magnet: typeof window.TradingViewApi.magnetEnabled === 'function',
    }));
    check('chart functions TVP uses exist (chart, settings, magnet)', api.chart && api.settings && api.magnet, api);

    const elements = await page.evaluate(() => Object.fromEntries([
      ['#header-toolbar-intervals', 1], ['#header-toolbar-symbol-search', 1], ['#header-toolbar-undo-redo button', 2],
      ['#header-toolbar-fullscreen', 1], ['.layout__area--top', 1], ['[data-name^="linetool-group-"]', 5],
    ].map(([sel, min]) => [sel, document.querySelectorAll(sel).length >= min])));
    check('page elements TVP uses exist', Object.values(elements).every(Boolean), Object.entries(elements).filter(([, ok]) => !ok).map(([sel]) => sel).join(', ') || '');

    await runSetupDefaults(page.mainFrame());
    await closePopups();
    const defaults = await waitFor(() => page.evaluate(() => {
      const d = { timeframes: document.querySelectorAll('#header-toolbar-intervals div button').length,
        favouriteTools: document.querySelectorAll('[data-name^="FavoriteToolbar"]').length, magnet: window.TradingViewApi.magnetEnabled().value() };
      return d.timeframes >= 10 && d.favouriteTools >= 6 && d.magnet ? d : null;
    }), 8000);
    check('Setup Defaults stars timeframes and tools, turns on the magnet', defaults, defaults || await page.evaluate(() => ({
      timeframes: document.querySelectorAll('#header-toolbar-intervals div button').length,
      favouriteTools: document.querySelectorAll('[data-name^="FavoriteToolbar"]').length, magnet: window.TradingViewApi.magnetEnabled().value() })));

    // Minimal Fullscreen: Shift + F keeps a compact bar (symbol, timeframe, Undo) and pins the favourites
    await page.mouse.click(700, 450);
    await closePopups();
    await page.keyboard.press('Shift+F');
    const bar = await waitFor(() => page.evaluate(() => {
      if (!document.querySelector('.layout__area--top.js-hidden') || !document.documentElement.classList.contains('tvp-minimal-fullscreen')) return null;
      const shown = sel => { const e = document.querySelector(sel); const r = e?.getBoundingClientRect(); return !!r && r.width > 0 && r.height > 0; };
      return { symbol: shown('#header-toolbar-symbol-search'), timeframe: shown('#header-toolbar-intervals'),
        undo: shown('#header-toolbar-undo-redo button'), redoHidden: !shown('#header-toolbar-undo-redo button ~ button'),
        favourites: shown('.tv-floating-toolbar .tv-favorited-drawings-toolbar__widget') };
    }), 8000);
    check('Minimal Fullscreen bar: symbol, timeframe, Undo, favourites (no Redo)', bar && Object.values(bar).every(Boolean), bar || 'fullscreen layout not on after Shift + F');
    await screenshot(page, 'tradingview-fullscreen');
    await page.keyboard.press('Shift+F');
    const exited = await waitFor(() => page.evaluate(() => !document.querySelector('.layout__area--top.js-hidden')), 5000);
    check('Shift + F again leaves fullscreen', exited);

    await page.keyboard.press('m');
    const menuOpen = await waitFor(() => page.evaluate(() => document.getElementById('tvp-menu').style.left === '0px'), 3000);
    check('M opens the TVP menu', menuOpen);
    await screenshot(page, 'tradingview');
  } catch (e) {
    check('test ran to the end', false, e.message.split('\n')[0]);
    await screenshot(page, 'tradingview-error');
  } finally {
    await context.close();
  }
}

// ─── Run ─────────────────────────────────────────────────────────────────────

mkdirSync(outDir, { recursive: true });
try {
  await demoChecks('TradingView', demoCopy('tradingview', 'tradingview.com/chart'));
  await demoChecks('XM', demoCopy('xm', 'blob:https://my.xmglobal.com/'));
} catch (e) {
  section = 'Setup';
  check('test copies of the extension', false, e.message);
}
await tradingViewChecks(path.resolve(extDir));

const failed = results.filter(r => !r.ok);
const lines = [`### TradingView smoke test: ${failed.length ? `${failed.length} of ${results.length} checks failed` : `all ${results.length} checks passed`}`, ''];
for (const name of [...new Set(results.map(r => r.section))]) {
  lines.push(`**${name}**`, '');
  for (const r of results.filter(x => x.section === name)) lines.push(`- ${r.ok ? '✅' : '❌'} ${r.name}${!r.ok && r.detail ? ` (${r.detail})` : ''}`);
  lines.push('');
}
writeFileSync(path.join(outDir, 'results.md'), lines.join('\n'));
console.log('\n' + lines.join('\n'));
process.exit(failed.length ? 1 : 0);
