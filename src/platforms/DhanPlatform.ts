
/**
 * DhanPlatform — Adapter for the DHAN broker website.
 *
 * This adapter uses the standard template baseline. Dhan-specific 
 * overrides should be added here logically after verification.
 */
class DhanPlatform implements PlatformAdapter {
  readonly platformName = 'Dhan';

  // ─── Timeframe ─────────────────────────────────────────────────────────────

  getCurrentTimeframe(): string | null {
    const buttons = Array.from(document.querySelectorAll('#header-toolbar-intervals div button'));
    const activeBtn = buttons.find(b => {
      const cn = ' ' + (b as HTMLElement).className + ' ';
      return cn.includes(' isActive') || cn.includes(' active-');
    });
    if (activeBtn) return (activeBtn as HTMLElement).textContent;

    return (
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
    return !!(
      document.querySelector('[data-qa-id="line-tool-color-menu"]') ||
      document.querySelector('[data-name="line-tool-color-menu"]')
    );
  }

  getColorSwatches(): HTMLElement[] {
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
}
