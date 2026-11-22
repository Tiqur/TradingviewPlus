
/**
 * XmPlatform — Adapter for XM's embedded TradingView Trading Terminal
 * (my.xmglobal.com and my.xm.com).
 *
 * The chart runs inside a blob: iframe (blob:https://my.xmglobal.com/<uuid>).
 * Its interval header has two layouts depending on whether the user has
 * favourited any intervals in the dropdown:
 *  - no favourites: a single dropdown button labelled with the current
 *    interval ("1m", "1h", "D")
 *  - favourites:    a role="radiogroup" of buttons, the active one has
 *    aria-checked="true", followed by an unlabelled dropdown arrow
 */
class XmPlatform implements PlatformAdapter {
  readonly platformName = 'XM';

  // ─── Setup ─────────────────────────────────────────────────────────────────

  // XM's chart doesn't save its layout by itself, so the defaults are saved too: otherwise
  // a reload would lose them
  setupDefaults(): boolean {
    return ChartDefaults.apply(true);
  }

  // ─── Layout ────────────────────────────────────────────────────────────────

  // XM's chart doesn't save its layout by itself. The chart's save API is only
  // reachable from the page's own JS, where PageBridge does the work.
  setAutoSave(enabled: boolean): void {
    document.dispatchEvent(new CustomEvent('tvp-auto-save', { detail: JSON.stringify(enabled) }));
  }

  // XM's chart starts with the magnet off on every visit; PageBridge turns it on
  setAutoMagnet(enabled: boolean): void {
    document.dispatchEvent(new CustomEvent('tvp-auto-magnet', { detail: JSON.stringify(enabled) }));
  }

  // XM's chart keeps only favourites between visits, so drawing tools forget their settings;
  // PageBridge saves TVP's styles as the favourite tools' defaults
  setDrawingDefaults(enabled: boolean): void {
    if (enabled) document.dispatchEvent(new CustomEvent('tvp-drawing-defaults', { detail: JSON.stringify(ChartDefaults.DRAWINGS) }));
  }

  // ─── Fullscreen ────────────────────────────────────────────────────────────

  // Minimal Fullscreen on XM uses XM's own fullscreen (its ⛶ button, Shift + F or F11), so XM's
  // trade panel stays: XM's bar floats over the chart's top-left (styles in
  // tvp-minimal-fullscreen.scss) and the chart switches to TradingView's fullscreen layout
  // without the browser going fullscreen.
  private fullscreenObserver: MutationObserver | null = null;

  setMinimalFullscreen(enabled: boolean): void {
    window.parent.document.documentElement.classList.toggle('tvp-minimal-fullscreen', enabled);
    // Tells PageBridge to route Shift + F to XM's fullscreen
    document.documentElement.toggleAttribute('data-tvp-xm-fullscreen-key', enabled);
    // XM toggles chart-fullscreen-mode on this wrapper around the chart
    const wrapper = window.frameElement?.closest('.chart-wrapper');
    if (!wrapper) return;

    if (!this.fullscreenObserver) {
      this.fullscreenObserver = new MutationObserver(() => this.syncChartFullscreen(wrapper));
      this.fullscreenObserver.observe(wrapper, { attributes: true, attributeFilter: ['class'] });

      // Shift + F (caught by PageBridge) works XM's own fullscreen
      document.addEventListener('tvp-xm-fullscreen-key', () => this.toggleXmFullscreen(wrapper));

      // Browser fullscreen (F11) opens XM's fullscreen with it and leaving it closes XM's, as
      // F11 does with TradingView's fullscreen on tradingview.com
      const browserFullscreen = window.parent.matchMedia('(display-mode: fullscreen)');
      browserFullscreen.addEventListener('change', () => {
        const xmFullscreen = wrapper.classList.contains('chart-fullscreen-mode');
        if (document.documentElement.classList.contains('tvp-minimal-fullscreen') && browserFullscreen.matches !== xmFullscreen) {
          this.toggleXmFullscreen(wrapper);
        }
      });

      // The chart resizes when XM's trade panel opens or closes, and with the window
      window.addEventListener('resize', () => this.placePanelToggle(wrapper));
    }
    this.syncChartFullscreen(wrapper);
  }

  // XM's own fullscreen buttons: ⛶ to open it, its ✕ to leave
  private toggleXmFullscreen(wrapper: Element): void {
    const xmButton = wrapper.classList.contains('chart-fullscreen-mode')
      ? wrapper.querySelector<HTMLElement>('app-advanced-chart-header-mobile > button')
      : window.parent.document.querySelector<HTMLElement>('ion-button.maximize-btn');
    xmButton?.click();
  }

  // XM's trade-panel toggle is shown at the start of the panel's "One Click Order" row
  // (see tvp-minimal-fullscreen.scss), wherever that row is
  private placePanelToggle(wrapper: Element): void {
    const row = wrapper.querySelector('app-order-form app-one-click-order')?.getBoundingClientRect();
    if (!row?.width) return;
    const host = window.parent.document.documentElement;
    host.style.setProperty('--tvp-xm-toggle-left', row.left + 'px');
    host.style.setProperty('--tvp-xm-toggle-top', (row.top + row.height / 2) + 'px');
  }

  private syncChartFullscreen(wrapper: Element): void {
    const xmFullscreen = wrapper.classList.contains('chart-fullscreen-mode');
    const wanted = xmFullscreen && document.documentElement.classList.contains('tvp-minimal-fullscreen');

    // The minimal top bar starts where XM's bar (exit button and instrument picker) ends
    const xmBar = wrapper.querySelector('app-advanced-chart-header-mobile');
    const barLeft = xmBar ? xmBar.getBoundingClientRect().right - window.frameElement!.getBoundingClientRect().left : 0;
    document.documentElement.style.setProperty('--tvp-top-bar-left', Math.max(0, Math.round(barLeft)) + 'px');

    // The active timeframe takes the instrument picker's text colour (and so its tint) and the
    // exit button's rounded corners
    const picker = xmBar?.querySelector('.xm-ion-input');
    if (picker) document.documentElement.style.setProperty('--tvp-ticker-color', getComputedStyle(picker).color);
    const exit = xmBar?.querySelector(':scope > button');
    if (exit) document.documentElement.style.setProperty('--tvp-ticker-radius', getComputedStyle(exit).borderRadius);
    this.placePanelToggle(wrapper);

    const chartFullscreen = !!document.querySelector('.layout__area--top.js-hidden');
    if (wanted !== chartFullscreen) document.dispatchEvent(new CustomEvent('tvp-toggle-chart-fullscreen'));
  }

  // ─── Watchlist ─────────────────────────────────────────────────────────────

  // XM's watchlist is its own list in the host page (the same one in its maximized
  // chart view). Space / Shift + Space pick the next / previous instrument, as on
  // TradingView, whether the chart or XM's page has the keyboard focus.
  private watchlistKeyListener: ((e: KeyboardEvent) => void) | null = null;

  setWatchlistSpaceKey(enabled: boolean): void {
    const docs = [document, window.parent.document];
    if (this.watchlistKeyListener) docs.forEach(doc => doc.removeEventListener('keydown', this.watchlistKeyListener!, true));
    this.watchlistKeyListener = null;
    if (!enabled) return;

    this.watchlistKeyListener = (e: KeyboardEvent) => {
      if (e.key !== ' ' || e.ctrlKey || e.altKey || e.metaKey) return;
      // Leave Space to text fields and to buttons and switches (e.g. XM's order controls)
      const target = e.target as Element;
      if (target.closest?.('input, textarea, select, button, [contenteditable="true"], [role="button"], [role="switch"], [role="checkbox"], ion-input, ion-textarea, ion-button, ion-toggle, ion-select')) return;
      if ((window as any).tvp_suppressHotkeysNow?.()) return;
      if (this.selectWatchlistRow(e.shiftKey ? -1 : 1)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    docs.forEach(doc => doc.addEventListener('keydown', this.watchlistKeyListener!, true));
  }

  // Clicks the watchlist row after (step 1) or before (step -1) the chart's instrument,
  // wrapping around. False if the watchlist isn't on the page.
  private selectWatchlistRow(step: number): boolean {
    const doc = window.parent.document;
    const rows = Array.from(doc.querySelectorAll<HTMLElement>('ion-item[data-testid="qa-test-watchlist-symbol"]'));
    if (!rows.length) return false;

    // XM wraps symbol names in invisible direction marks (U+2066..U+2069)
    const nameOf = (el: Element | null) => (el?.textContent || '').replace(/[⁦-⁩]/g, '').trim().toLowerCase();
    // XM doesn't mark the selected row; its chart header shows the current instrument
    const current = nameOf(doc.querySelector('.symbol-name'));
    const i = rows.findIndex(row => nameOf(row.querySelector('span.font-semibold')) === current);
    const next = i === -1
      ? rows[step > 0 ? 0 : rows.length - 1]
      : rows[(i + step + rows.length) % rows.length];

    // The watchlist is in XM's side panel, which is open while ion-tabs.chart-split-view has
    // "expanded". Clicking a row opens that panel, so if it was closed it's closed again
    const splitView = doc.querySelector('ion-tabs.chart-split-view');
    const panelOpen = !splitView || splitView.classList.contains('expanded');
    if (!panelOpen) this.keepPanelClosed(splitView!);

    next.click();
    // The list only renders rows near its scroll position, so keep it following the chart
    if (panelOpen) next.scrollIntoView({ block: 'nearest' });
    return true;
  }

  // Closes XM's side panel with its own close button as soon as it opens (within a few
  // seconds), before it's drawn. By its label, or its place if the label is translated.
  private keepPanelClosed(splitView: Element): void {
    const observer = new MutationObserver(() => {
      if (!splitView.classList.contains('expanded')) return;
      observer.disconnect();
      clearTimeout(timer);
      splitView.querySelector<HTMLElement>('app-watchlists-header-desktop button[aria-label="Close"], ' +
        'app-watchlists-header-desktop ion-buttons.buttons-last-slot > button:last-of-type')?.click();
    });
    observer.observe(splitView, { attributes: true, attributeFilter: ['class'] });
    const timer = setTimeout(() => observer.disconnect(), 3000);
  }

  // ─── Timeframe ─────────────────────────────────────────────────────────────

  getCurrentTimeframe(): string | null {
    // Favourites layout
    const active = document.querySelector<HTMLElement>('#header-toolbar-intervals [role="radio"][aria-checked="true"]');
    if (active) return active.textContent;

    // No-favourites layout: the dropdown button shows the current interval
    const dropdown = document.querySelector<HTMLElement>('#header-toolbar-intervals button[aria-haspopup="menu"]');
    return dropdown?.textContent || null;
  }

  getTimeframeContainer(): Element | null {
    return document.querySelector('#header-toolbar-intervals');
  }

  // ─── Color Picker ──────────────────────────────────────────────────────────

  getLineColorButton(): HTMLElement | null {
    const colorElements = document.querySelectorAll<HTMLElement>('[data-name="line-tool-color"]');
    // The active floating toolbar is appended last; earlier ones may be fading out.
    for (let i = colorElements.length - 1; i >= 0; i--) {
      const rect = colorElements[i].getBoundingClientRect();
      const style = window.getComputedStyle(colorElements[i]);
      if (rect.width > 0 && rect.height > 0 && style.opacity !== '0') {
        return colorElements[i];
      }
    }
    return null;
  }

  // XM's chart version labels menus with data-name; newer ones use data-qa-id
  isColorMenuOpen(): boolean {
    return !!document.querySelector('[data-name="line-tool-color-menu"], [data-qa-id="line-tool-color-menu"]');
  }

  getColorSwatches(): HTMLElement[] {
    return Array.from(document.querySelectorAll<HTMLElement>(
      '[data-name="line-tool-color-menu"] [data-role="swatch"], [data-qa-id="line-tool-color-menu"] [data-role="swatch"]'));
  }

  // ─── Drawing Toolbar ───────────────────────────────────────────────────────

  isClickOnDrawingToolbar(target: HTMLElement): boolean {
    if (!target || typeof target.closest !== 'function') return false;
    return !!(
      target.closest('[data-name="drawing-toolbar"]') ||
      target.closest('#drawing-toolbar')
    );
  }

  isFloatingToolbarNode(node: HTMLElement): boolean {
    if (!node) return false;
    return !!(
      (node.matches && node.matches('[class*="floating-toolbar"]')) ||
      (node.querySelector && node.querySelector('[class*="floating-toolbar"]'))
    );
  }

  // ─── Trading ───────────────────────────────────────────────────────────────

  // XM's order ticket is XM's own (Angular) UI in the host page. The blob:
  // chart frame is same-origin with it, so it can be reached via window.parent.
  getOrderTicketRoot(): Node | null {
    return window.parent.document.body;
  }

  // Limit-only on XM: the ticket's pending-order toggle ("Buy/Sell When Price is")
  // is switched on, greyed out and can't be switched off.
  enforceLimitOrderOnly(enabled: boolean): void {
    const toggles = window.parent.document.querySelectorAll<HTMLElement>('app-pending-order xm-ion-toggle');
    toggles.forEach(toggle => {
      toggle.style.pointerEvents = enabled ? 'none' : '';
      toggle.style.opacity = enabled ? '0.5' : '';
      const input = toggle.querySelector<HTMLInputElement>('input[type="checkbox"]');
      // click() rather than setting .checked so XM's form sees the change
      if (enabled && input && !input.checked && !input.disabled) input.click();
    });
  }
}
