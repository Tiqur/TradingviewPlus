
/**
 * ChartDefaults — default favourites and chart appearance, applied by the
 * "Setup Defaults" menu option. Shared by the XM and TradingView adapters.
 */
class ChartDefaults {
  // Interval values as in the interval menu: 1m 3m 5m 15m 1h 4h D W M 12M
  static readonly INTERVALS = ['1', '3', '5', '15', '60', '240', '1D', '1W', '1M', '12M'];
  // Drawing tools, in favourites-toolbar order
  static readonly TOOLS = ['LineToolHorzRay', 'LineToolRay', 'LineToolDateAndPriceRange', 'LineToolRiskRewardLong', 'LineToolRiskRewardShort', 'LineToolBrush'];

  private static readonly CANDLE_UP = '#fff2cc';
  private static readonly CANDLE_DOWN = '#6fa8dc';
  private static readonly TRANSPARENT = 'rgba(0, 0, 0, 0)';

  // Chart settings, applied by PageBridge inside the page
  static readonly APPEARANCE = {
    // Switch to dark mode first (a theme change resets chart colours)
    darkTheme: true,
    removeVolume: true,
    // Magnet on (its weak/strong mode is left as it is)
    magnet: true,
    // Added to the colour picker's custom colours, in this order
    customColors: [ChartDefaults.CANDLE_UP, ChartDefaults.CANDLE_DOWN, '#06090f', '#131a27'],
    // Trading tab: Play sound for executions
    executionSound: true,
    overrides: {
      // Symbol
      'mainSeriesProperties.candleStyle.barColorsOnPrevClose': true,
      'mainSeriesProperties.candleStyle.upColor': ChartDefaults.CANDLE_UP,
      'mainSeriesProperties.candleStyle.downColor': ChartDefaults.CANDLE_DOWN,
      'mainSeriesProperties.candleStyle.borderUpColor': ChartDefaults.CANDLE_UP,
      'mainSeriesProperties.candleStyle.borderDownColor': ChartDefaults.CANDLE_DOWN,
      'mainSeriesProperties.candleStyle.wickUpColor': ChartDefaults.CANDLE_UP,
      'mainSeriesProperties.candleStyle.wickDownColor': ChartDefaults.CANDLE_DOWN,
      // Status line: everything off
      'paneProperties.legendProperties.showLogo': false,
      'paneProperties.legendProperties.showSeriesTitle': false,
      'paneProperties.legendProperties.showSeriesOHLC': false,
      'paneProperties.legendProperties.showBarChange': false,
      'paneProperties.legendProperties.showLastDayChange': false,
      'paneProperties.legendProperties.showVolume': false,
      'paneProperties.legendProperties.showStudyTitles': false,
      'paneProperties.legendProperties.showStudyArguments': false,
      'paneProperties.legendProperties.showStudyValues': false,
      'paneProperties.legendProperties.showBackground': false,
      // Trading tab: Buy/sell buttons
      'paneProperties.legendProperties.showTradingButtons': false,
      // Scales and lines
      'mainSeriesProperties.showCountdown': true,
      // Canvas
      'paneProperties.backgroundType': 'gradient',
      'paneProperties.backgroundGradientStartColor': '#06090f',
      'paneProperties.backgroundGradientEndColor': '#131a27',
      'paneProperties.vertGridProperties.color': ChartDefaults.TRANSPARENT,
      'paneProperties.horzGridProperties.color': ChartDefaults.TRANSPARENT,
      'paneProperties.crossHairProperties.color': 'rgba(255, 255, 255, 0.2)',
      'scalesProperties.textColor': ChartDefaults.TRANSPARENT,
      'scalesProperties.lineColor': ChartDefaults.TRANSPARENT,
    },
  };

  // Stars the default intervals and tools, applies the appearance and hides the
  // drawing toolbar, then saves the layout if `saveLayout` (for charts that don't
  // save by themselves). Never removes the user's own favourites.
  // False if the chart's menus weren't found.
  static apply(saveLayout = false): boolean {
    const intervalButton = document.querySelector<HTMLElement>('#header-toolbar-intervals button[aria-haspopup="menu"]');
    if (!intervalButton) return false;
    // Left toolbar groups: button [0] picks the group's tool, [1] opens its list
    const groupButtons = Array.from(document.querySelectorAll('[data-name^="linetool-group-"]'),
      group => group.querySelectorAll<HTMLElement>('button')[1]).filter(Boolean);

    // These menus open and close synchronously on click, so everything below
    // runs in one task: the menus are never painted and nobody waits.
    const hasStars = ChartDefaults.inMenu(intervalButton, () =>
      Array.from(document.querySelectorAll('[data-role="menuitem"]')).some(item => ChartDefaults.starOf(item)));
    if (!hasStars) return false;

    ChartDefaults.inMenu(intervalButton, () => ChartDefaults.INTERVALS.forEach(value =>
      ChartDefaults.setStar(document.querySelector(`[data-role="menuitem"][data-value="${value}"]`), true)));

    // Un-star then re-star the default tools so they line up in this order in the
    // favourites toolbar, after the user's own favourites. Other tools are never touched.
    for (const on of [false, true]) {
      for (const tool of ChartDefaults.TOOLS) {
        groupButtons.some(button => ChartDefaults.inMenu(button, () =>
          ChartDefaults.setStar(document.querySelector(`[data-role="menuitem"][data-name="${tool}"]`), on)));
      }
    }

    // The chart's settings API is only reachable from the page's own JS, where PageBridge listens
    document.dispatchEvent(new CustomEvent('tvp-apply-chart-defaults', { detail: JSON.stringify({ ...ChartDefaults.APPEARANCE, saveLayout }) }));

    // Hide the left drawing toolbar where the chart has a toggle for it (XM). It only collapses,
    // so its menus stay in the page and the setup can run again; the favourites toolbar stays visible.
    document.querySelector<HTMLElement>('[data-name="toolbar-drawing-toggle-button"][data-value="visible"]')?.click();
    return true;
  }

  private static inMenu<T>(button: HTMLElement, fn: () => T): T {
    button.click();
    const result = fn();
    button.click();
    return result;
  }

  // A menu item's favourite star button. TradingView marks it data-qa-id="preset-menu-favorite-button";
  // XM's older chart doesn't, but has the star icon (class favorite-*) in the item's toolbar.
  private static starOf(item: Element): HTMLElement | null {
    return item.querySelector<HTMLElement>('[data-qa-id="preset-menu-favorite-button"]')
      || item.querySelector('[role="toolbar"] [class*="favorite-"]')?.closest<HTMLElement>('button')
      || null;
  }

  // By class, since aria-labels are localised: TradingView toggles favoritesIconButtonToggled-*
  // on the button, the charting library (XM, demo) checked-* on its icon.
  private static isStarred(star: Element): boolean {
    return star.matches('[class*="favoritesIconButtonToggled-"]') || !!star.querySelector('[class*="checked-"]');
  }

  // Sets a menu item's star. False if the item or its star doesn't exist.
  private static setStar(item: Element | null, on: boolean): boolean {
    const star = item && ChartDefaults.starOf(item);
    if (!star) return false;
    if (ChartDefaults.isStarred(star) !== on) star.click();
    return true;
  }
}
