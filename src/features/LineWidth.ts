class LineWidth extends Feature {
  
  constructor() {
    super(
      'Change Line Width',
      'Cycles the selected drawing\'s line width (1–4 px)',
      true,
      {
        key: 'w',
        ctrl: false,
        shift: false,
        alt: false,
        meta: false
      },
      Category.TVP,
      true
    );
    this.addContextMenuOptions([
    ]);
  }


  onMouseDown() {};

  onMouseMove() {};
  onMouseWheel() {};
  onKeyUp() {};

  onKeyDown(e: KeyboardEvent) {
    if (this.checkTrigger(e) && this.isEnabled()) {
      (document.querySelector('[data-name="line-tool-width"]') as HTMLElement)?.click();

      // Older chart versions (e.g. XM's) use data-name instead of data-qa-id
      waitForElm('[data-qa-id="line-tool-width-menu"] [data-qa-id="menu-inner"], [data-name="line-tool-width-menu"] [data-name="menu-inner"]').then((widthMenuContainer) => {
        if (!widthMenuContainer) { console.warn('[TVP LineWidth] Menu container not found'); return; }

        // Primary: data-role="menuitem" (stable). Fallback: div with 'item' in class (React-generated)
        let widthButtons = Array.from(widthMenuContainer.querySelectorAll('[data-role="menuitem"]'));
        const usingFallback = !widthButtons.length;
        if (usingFallback) {
          widthButtons = Array.from(widthMenuContainer.querySelectorAll('div')).filter(div =>
            div.className && typeof div.className === 'string' && div.className.includes('item')
          );
        }
        if (!widthButtons.length) { console.warn('[TVP LineWidth] No width buttons found'); return; }

        let activeIndex = findActiveMenuItem(widthButtons);
        if (activeIndex === -1) activeIndex = 0;
        const nextIndex = (activeIndex + 1) % widthButtons.length;
        (widthButtons[nextIndex] as HTMLElement)?.click();
      });
    }
  }

  init() {};
}