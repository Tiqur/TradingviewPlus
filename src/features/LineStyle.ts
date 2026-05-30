class LineStyle extends Feature {
  
  constructor() {
    super(
      'Change Line Style',
      'Scrolls line styles ( solid, dashed, dotted )',
      true,
      {
        key: 'q',
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
      (document.querySelector('div[data-name="style"]') as HTMLElement)?.click();

      waitForElm('[data-qa-id="style-menu"] [data-qa-id="menu-inner"]').then((styleMenuContainer) => {
        if (!styleMenuContainer) { console.warn('[TVP LineStyle] Menu container not found'); return; }

        // Primary: tr[data-role="menuitem"] (stable semantic attribute)
        let styleButtons = Array.from(styleMenuContainer.querySelectorAll('tr[data-role="menuitem"]'));
        const usingFallback = !styleButtons.length;
        if (usingFallback) styleButtons = Array.from(styleMenuContainer.querySelectorAll('[data-role="menuitem"]'));
        if (!styleButtons.length) { console.warn('[TVP LineStyle] No style buttons found'); return; }

        let activeIndex = findActiveMenuItem(styleButtons);
        if (activeIndex === -1) activeIndex = 0;
        const nextIndex = (activeIndex + 1) % styleButtons.length;
        (styleButtons[nextIndex] as HTMLElement)?.click();
      });
    }
  }

  init() {};
}