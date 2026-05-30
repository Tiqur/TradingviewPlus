
/**
 * TopstepXPlatform — Adapter for TopstepX's embedded TradingView chart.
 *
 * ⚠️  WORK IN PROGRESS
 * This skeleton exists so TopstepX support can be added without touching
 * any other adapter or feature file. Open the TopstepX chart in DevTools,
 * inspect the toolbar / color-picker elements, then fill in the selectors
 * below and enable the URL match in main.ts + the platform manifests.
 *
 * Known integration notes:
 *  - TopstepX may render the chart in a direct <iframe> rather than blob:
 *    so `match_origin_as_fallback` might not be required in the manifest.
 *  - Verify whether the iframe is same-origin or cross-origin; same-origin
 *    iframes do NOT need `match_origin_as_fallback`.
 */
class TopstepXPlatform implements PlatformAdapter {
  readonly platformName = 'TopstepX';

  // ─── Timeframe ─────────────────────────────────────────────────────────────

  getCurrentTimeframe(): string | null {
    // TODO: inspect TopstepX's toolbar and add selectors.
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
