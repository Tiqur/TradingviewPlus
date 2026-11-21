// Applies the chart appearance defaults sent by ChartDefaults (XM and TradingView),
// adds Auto Timeframe Colors' custom colours to the colour picker, and runs Auto Save
// Layout and Auto Magnet (XM).
//
// The chart's settings API lives in the page's own JavaScript, which content
// scripts can't call. In Chrome/Opera this file is injected into the page itself
// ("world": "MAIN" in the manifest). Firefox has no such option, so there it
// runs as a normal content script and reaches the page through wrappedJSObject.
document.addEventListener('tvp-apply-chart-defaults', async (e: Event) => {
  const page = (window as any).wrappedJSObject || window;
  // Charting library (XM) exposes its API as tradingViewApi (it also has an unrelated
  // TradingViewApi object); tradingview.com only has TradingViewApi
  const api = page.tradingViewApi || page.TradingViewApi;
  if (!api) return; // not a chart page

  const defaults = JSON.parse((e as CustomEvent).detail);
  const chart = api.activeChart();

  // A theme change resets chart colours to the theme's, so switch first
  const themes = api.themes?.();
  if (defaults.darkTheme && themes && themes.getCurrentThemeName() !== 'dark') await themes.setStdTheme('dark');

  // The library's window.applyOverrides is what XM's widget calls; TradingView only has the chart's
  const overrides = page.JSON.parse(JSON.stringify(defaults.overrides));
  if (typeof page.applyOverrides === 'function') page.applyOverrides(overrides);
  else chart.applyOverrides(overrides);

  if (defaults.magnet) api.magnetEnabled().setValue(true);

  // Volume is added once the chart's data has loaded, which on a fresh load comes after
  // this runs; dataReady calls back right away if it has already loaded
  if (defaults.removeVolume) {
    chart.dataReady(() => {
      for (const study of chart.getAllStudies()) if (study.name === 'Volume') chart.removeEntity(study.id);
    });
  }

  tvpAddCustomColors(page, defaults.customColors);

  // "Play sound for executions" is only read from settings when the chart loads,
  // so this takes effect from the next load.
  if (defaults.executionSound) {
    const settings = page.TVSettings;
    const trading = JSON.parse(settings.getValue('trading.chart.proterty') || '{}'); // sic: TradingView's key
    const sound = JSON.parse(trading.orderExecutedSoundParams || '{}');
    sound.enabled = 1;
    trading.orderExecutedSoundParams = JSON.stringify(sound);
    settings.setValue('trading.chart.proterty', JSON.stringify(trading));
  }

  // XM: save the layout too (creating one if the chart has none), or a reload loses the
  // defaults. dataReady calls back in order, so this comes after the Volume removal.
  if (defaults.saveLayout) chart.dataReady(() => tvpSaveLayout(page, api));
});

// Saves the chart's layout under its name, or as "Save" if it has none (which creates the
// layout), as Ctrl + S does but without asking for a name
function tvpSaveLayout(page: any, api: any) {
  // Firefox: functions the page calls back have to be exported to it
  const noop = typeof exportFunction === 'function' ? exportFunction(() => {}, page) : () => {};
  api.saveChartToServer(noop, noop, page.JSON.parse(JSON.stringify({ chartName: api.layoutName() || 'Save' })));
}

// Colour picker "custom colours": add missing ones in order, keep the user's.
// The picker re-reads this each time it opens and keeps at most 29.
function tvpAddCustomColors(page: any, colors: string[]) {
  const settings = page.TVSettings;
  const stored: string[] = JSON.parse(settings.getValue('pickerCustomColors') || '[]');
  const missing = colors.filter(c => !stored.some(s => s.toLowerCase() === c.toLowerCase()));
  if (missing.length) settings.setValue('pickerCustomColors', JSON.stringify(stored.concat(missing).slice(-29)));
}

// Auto Timeframe Colors: a custom colour can only be picked from the chart's colour menu
// while it is one of the picker's custom colours
document.addEventListener('tvp-add-custom-colors', (e: Event) => {
  const page = (window as any).wrappedJSObject || window;
  if (page.TVSettings) tvpAddCustomColors(page, JSON.parse((e as CustomEvent).detail));
});

// Auto Timeframe Colors' picker shows the picker's custom colours (the reply is sent while
// the request is still being dispatched) and removes them on right-click
document.addEventListener('tvp-get-custom-colors', () => {
  const page = (window as any).wrappedJSObject || window;
  const colors = page.TVSettings ? page.TVSettings.getValue('pickerCustomColors') || '[]' : '[]';
  document.dispatchEvent(new CustomEvent('tvp-custom-colors', { detail: String(colors) }));
});

document.addEventListener('tvp-remove-custom-color', (e: Event) => {
  const page = (window as any).wrappedJSObject || window;
  if (!page.TVSettings) return;
  const color = String((e as CustomEvent).detail).toLowerCase();
  const stored: string[] = JSON.parse(page.TVSettings.getValue('pickerCustomColors') || '[]');
  page.TVSettings.setValue('pickerCustomColors', JSON.stringify(stored.filter(c => c.toLowerCase() !== color)));
});

// Auto Save Layout (XM). XM's chart doesn't save its layout by itself, and opens a fresh,
// unnamed chart on every visit. When the page loads, the most recently saved layout is
// reopened; if there is none (or the feature is switched on later on an unnamed chart),
// the chart is saved as "Save". From then on the chart signals onAutoSaveNeeded a few
// seconds after each change to a named layout, as TradingView's own autosave does, and
// the layout is saved under its name.
declare const exportFunction: ((fn: Function, target: object) => any) | undefined;
let autoSaveWanted = false;
let autoSaveStarted = false;
let autoSave: { api: any, onChange: any } | null = null;

document.addEventListener('tvp-auto-save', (e: Event) => {
  const page = (window as any).wrappedJSObject || window;
  // Firefox: functions the page calls back have to be exported to it
  const toPage = (fn: Function) => typeof exportFunction === 'function' ? exportFunction(fn, page) : fn;
  const atPageLoad = !autoSaveStarted;
  autoSaveStarted = true;
  autoSaveWanted = JSON.parse((e as CustomEvent).detail);

  if (!autoSaveWanted && autoSave) {
    autoSave.api.unsubscribe('onAutoSaveNeeded', autoSave.onChange);
    autoSave = null;
  }
  if (!autoSaveWanted || autoSave) return;

  // Wait until the chart has loaded its data. The chart is replaced while the page
  // starts, so the current one is checked each time rather than waiting on the first.
  const noop = toPage(() => {});
  const timer = setInterval(() => {
    const api = page.tradingViewApi;
    try { if (!api?.activeChart().dataReady(noop)) return; } catch { return; }
    clearInterval(timer);
    if (!autoSaveWanted || autoSave) return;

    const save = () => tvpSaveLayout(page, api);

    if (!api.layoutName()) {
      if (atPageLoad) {
        api.getSavedCharts(toPage((charts: any[]) => {
          const latest = Array.from(charts).sort((a: any, b: any) => b.modified_iso - a.modified_iso)[0];
          if (latest) api.loadChartFromServer(latest);
          else save();
        }));
      } else {
        save();
      }
    }

    autoSave = { api, onChange: toPage(save) };
    api.subscribe('onAutoSaveNeeded', autoSave.onChange);
  }, 500);
});

// Auto Magnet (XM). XM's chart starts with the magnet off on every visit. Each time the
// feature is switched on (including at page load), the magnet is turned on once the chart
// has loaded; its weak / strong mode is left as it is. Turning the magnet off by hand
// lasts until the next load.
document.addEventListener('tvp-auto-magnet', (e: Event) => {
  if (!JSON.parse((e as CustomEvent).detail)) return;
  const page = (window as any).wrappedJSObject || window;
  const noop = typeof exportFunction === 'function' ? exportFunction(() => {}, page) : () => {};
  // As for Auto Save: the chart is replaced while the page starts, so check the current one
  const timer = setInterval(() => {
    const api = page.tradingViewApi;
    try { if (!api?.activeChart().dataReady(noop)) return; } catch { return; }
    clearInterval(timer);
    api.magnetEnabled().setValue(true);
  }, 500);
});

// Minimal Fullscreen on XM: Shift + F on the chart opens XM's own fullscreen (as its ⛶ button
// does) rather than TradingView's. This file runs before TradingView's scripts, so this listener
// comes first. Only real key presses are taken; the extension's own Shift + F (below) gets through.
window.addEventListener('keydown', (e: KeyboardEvent) => {
  if (!e.isTrusted || e.code !== 'KeyF' || !e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) return;
  if (!document.documentElement.hasAttribute('data-tvp-xm-fullscreen-key')) return;
  if ((e.target as Element).closest?.('input, textarea, [contenteditable="true"]')) return;
  e.preventDefault();
  e.stopImmediatePropagation();
  document.dispatchEvent(new CustomEvent('tvp-xm-fullscreen-key'));
}, true);

// Minimal Fullscreen on XM: switches the chart to TradingView's own fullscreen layout (as
// Shift + F does) without the browser going fullscreen, so XM's page and trade panel stay.
// TradingView asks for browser fullscreen while handling the key, so that request is
// answered with a no-op for the moment the key is handled.
document.addEventListener('tvp-toggle-chart-fullscreen', () => {
  const page = (window as any).wrappedJSObject || window;
  const root = page.document.documentElement;
  const noFullscreen = () => Promise.resolve();
  root.requestFullscreen = typeof exportFunction === 'function' ? exportFunction(noFullscreen, page) : noFullscreen;
  const key = { key: 'F', code: 'KeyF', keyCode: 70, shiftKey: true, bubbles: true, cancelable: true };
  document.dispatchEvent(new KeyboardEvent('keydown', key));
  document.dispatchEvent(new KeyboardEvent('keyup', key));
  delete root.requestFullscreen;
});
