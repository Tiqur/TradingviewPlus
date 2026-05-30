
/**
 * BinancePlatform — Adapter for Binance's embedded TradingView chart.
 *
 * ⚠️  WORK IN PROGRESS
 * This skeleton exists so Binance support can be added without touching
 * any other adapter or feature file. Open the Binance chart in DevTools,
 * inspect the toolbar / color-picker elements, then fill in the selectors
 * below and enable the URL match in main.ts + the platform manifests.
 *
 * Known integration notes:
 *  - Binance embeds TV inside an <iframe> at https://www.binance.com/en/trade/*
 *  - The iframe origin may change by region; verify `window.location.href`
 *    patterns before adding them to detectPlatform() in main.ts.
 */
class BinancePlatform implements PlatformAdapter {
  readonly platformName = 'Binance';

  // ─── Timeframe ─────────────────────────────────────────────────────────────

  getCurrentTimeframe(): string | null {
    // TODO: inspect Binance's toolbar and add selectors.
    // The charting library header might use a different container ID.
    return null;
  }

  getTimeframeContainer(): Element | null {
    // TODO
    return null;
  }

  // ─── Color Picker ──────────────────────────────────────────────────────────

  getLineColorButton(): HTMLElement | null {
    // TODO: may match native TV's data-name attribute — verify in DevTools.
    return document.querySelector('[data-name="line-tool-color"]');
  }

  isColorMenuOpen(): boolean {
    // TODO
    return false;
  }

  getColorSwatches(): HTMLElement[] {
    // TODO
    return [];
  }

  // ─── Drawing Toolbar ───────────────────────────────────────────────────────

  isClickOnDrawingToolbar(_target: HTMLElement): boolean {
    // TODO
    return false;
  }

  isFloatingToolbarNode(_node: HTMLElement): boolean {
    // TODO
    return false;
  }
}
