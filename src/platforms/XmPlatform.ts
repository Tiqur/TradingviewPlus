
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

  setupDefaults(): boolean {
    return ChartDefaults.apply();
  }

  // ─── Layout ────────────────────────────────────────────────────────────────

  // XM's chart doesn't save its layout by itself. The chart's save API is only
  // reachable from the page's own JS, where PageBridge does the work.
  setAutoSave(enabled: boolean): void {
    document.dispatchEvent(new CustomEvent('tvp-auto-save', { detail: JSON.stringify(enabled) }));
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
