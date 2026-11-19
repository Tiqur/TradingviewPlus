
/**
 * TradingViewPlatform — Adapter for the native TradingView website.
 *
 * Selectors here target the standard tradingview.com DOM structure.
 * Changes to this file will NOT affect any other platform adapter.
 */
class TradingViewPlatform implements PlatformAdapter {
  readonly platformName = 'TradingView';

  setupDefaults(): boolean {
    return ChartDefaults.apply();
  }

  // ─── Timeframe ─────────────────────────────────────────────────────────────

  getCurrentTimeframe(): string | null {
    // 1. Class-based active state
    const buttons = Array.from(document.querySelectorAll('#header-toolbar-intervals div button'));
    const activeBtn = buttons.find(b => {
      const cn = ' ' + (b as HTMLElement).className + ' ';
      return cn.includes(' isActive') || cn.includes(' active-') || cn.includes(' isActive-');
    });
    if (activeBtn) return (activeBtn as HTMLElement).textContent;

    // 2. ARIA attributes fallback
    return (
      (document.querySelector('#header-toolbar-intervals div button[aria-checked="true"]') as HTMLElement)?.textContent ||
      (document.querySelector('#header-toolbar-intervals div button[aria-selected="true"]') as HTMLElement)?.textContent ||
      (document.querySelector('#header-toolbar-intervals div button[aria-pressed="true"]') as HTMLElement)?.textContent ||
      null
    );
  }

  getTimeframeContainer(): Element | null {
    return document.querySelector('#header-toolbar-intervals');
  }

  // ─── Color Picker ──────────────────────────────────────────────────────────

  getLineColorButton(): HTMLElement | null {
    const colorElements = document.querySelectorAll<HTMLElement>('[data-name="line-tool-color"]');
    // Iterate backwards because TradingView appends the active floating toolbar to the end
    // of the DOM overlapping container. Old fading-out toolbars are earlier in the DOM.
    for (let i = colorElements.length - 1; i >= 0; i--) {
      const rect = colorElements[i].getBoundingClientRect();
      const style = window.getComputedStyle(colorElements[i]);
      if (rect.width > 0 && rect.height > 0 && style.opacity !== '0') {
        return colorElements[i];
      }
    }
    return null;
  }

  isColorMenuOpen(): boolean {
    return !!document.querySelector('[data-qa-id="line-tool-color-menu"]');
  }

  getColorSwatches(): HTMLElement[] {
    // Native TV uses data-qa-id / data-role attributes
    const swatches = document.querySelectorAll<HTMLElement>(
      '[data-qa-id="line-tool-color-menu"] [data-role="swatch"], ' +
      '[data-name="line-tool-color-menu"] button, ' +
      '[data-role="swatch"]'
    );
    return Array.from(swatches);
  }

  // ─── Drawing Toolbar ───────────────────────────────────────────────────────

  isClickOnDrawingToolbar(target: HTMLElement): boolean {
    if (!target || typeof target.closest !== 'function') return false;
    return !!(
      target.closest('[data-name="drawing-toolbar"]') ||
      target.closest('#drawing-toolbar') ||
      target.closest('.drawing-toolbar')
    );
  }

  isFloatingToolbarNode(node: HTMLElement): boolean {
    if (!node) return false;
    return !!(
      (node.matches && node.matches('[class*="floating-toolbar"]')) ||
      (node.querySelector && node.querySelector('[class*="floating-toolbar"]'))
    );
  }

  // ─── Fullscreen ────────────────────────────────────────────────────────────

  private minimalFullscreenReady = false;

  // The layout itself is in tvp-minimal-fullscreen.scss and only applies while
  // TradingView's own fullscreen (Shift + F) is on
  setMinimalFullscreen(enabled: boolean): void {
    const root = document.documentElement;
    root.classList.toggle('tvp-minimal-fullscreen', enabled);

    if (!this.minimalFullscreenReady) {
      this.minimalFullscreenReady = true;

      waitForElm('.layout__area--top').then(elem => {
        const top = elem as HTMLElement;

        // The pinned favourites toolbar starts where the shrunk top bar ends
        new ResizeObserver(() => {
          root.style.setProperty('--tvp-top-bar-width', top.offsetWidth + 'px');
        }).observe(top);

        // TradingView re-places the favourites toolbar on every resize from where it is drawn,
        // so resizes while it is pinned (entering/leaving browser fullscreen) would leave it in
        // the wrong place afterwards: keep its own position and put it back when fullscreen ends
        let wasFullscreen = top.classList.contains('js-hidden');
        let toolbarPosition: { left: string, top: string } | null = null;
        new MutationObserver(() => {
          const isFullscreen = top.classList.contains('js-hidden');
          const toolbar = document.querySelector<HTMLElement>('.tv-floating-toolbar:has(.tv-favorited-drawings-toolbar__widget)');
          const minimal = root.classList.contains('tvp-minimal-fullscreen');
          if (isFullscreen && !wasFullscreen) {
            toolbarPosition = minimal && toolbar ? { left: toolbar.style.left, top: toolbar.style.top } : null;
          } else if (!isFullscreen && wasFullscreen && minimal && toolbar && toolbarPosition) {
            toolbar.style.left = toolbarPosition.left;
            toolbar.style.top = toolbarPosition.top;
          }
          wasFullscreen = isFullscreen;
        }).observe(top, { attributes: true, attributeFilter: ['class'] });
      });

      // Browser fullscreen (F11) turns TradingView's fullscreen on and off with it
      const browserFullscreen = matchMedia('(display-mode: fullscreen)');
      browserFullscreen.addEventListener('change', () => {
        const tvFullscreen = !!document.querySelector('.layout__area--top.js-hidden');
        if (root.classList.contains('tvp-minimal-fullscreen') && browserFullscreen.matches !== tvFullscreen) {
          document.getElementById('header-toolbar-fullscreen')?.click();
        }
      });
    }

    // TradingView re-measures the date-range bar on resize, so a change made while
    // already in fullscreen shows at once
    window.dispatchEvent(new Event('resize'));
  }
}
