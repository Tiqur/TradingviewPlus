// Applies the chart appearance defaults sent by ChartDefaults (XM and TradingView).
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

  // Volume is added once the chart's data has loaded, which on a fresh load comes after
  // this runs; dataReady calls back right away if it has already loaded
  if (defaults.removeVolume) {
    chart.dataReady(() => {
      for (const study of chart.getAllStudies()) if (study.name === 'Volume') chart.removeEntity(study.id);
    });
  }

  // Colour picker "custom colours": add missing ones in order, keep the user's.
  // The picker re-reads this each time it opens and keeps at most 29.
  const settings = page.TVSettings;
  const stored: string[] = JSON.parse(settings.getValue('pickerCustomColors') || '[]');
  const missing = (defaults.customColors as string[]).filter(c => !stored.some(s => s.toLowerCase() === c.toLowerCase()));
  settings.setValue('pickerCustomColors', JSON.stringify(stored.concat(missing).slice(-29)));

  // "Play sound for executions" is only read from settings when the chart loads,
  // so this takes effect from the next load.
  if (defaults.executionSound) {
    const trading = JSON.parse(settings.getValue('trading.chart.proterty') || '{}'); // sic: TradingView's key
    const sound = JSON.parse(trading.orderExecutedSoundParams || '{}');
    sound.enabled = 1;
    trading.orderExecutedSoundParams = JSON.stringify(sound);
    settings.setValue('trading.chart.proterty', JSON.stringify(trading));
  }
});
