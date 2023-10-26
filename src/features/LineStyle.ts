class LineStyle extends Feature {
  
  constructor(storageService: StorageService) {
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
      storageService
    );
  }


  onMouseDown() {};

  onMouseMove() {};
  onMouseWheel() {};
  onKeyUp() {};

  onKeyDown(e: KeyboardEvent) {
    if (this.checkTrigger(e) && this.isEnabled()) {
      // Click line style button
      (document.querySelector('[data-name="style"]') as HTMLElement).click()

      // Line style scrolling
      const styleButtons = Array.from(document.querySelectorAll('[data-name="menu-inner"] tr[tabindex]'));

      if (styleButtons.length > 0) {
        const activeIndex = styleButtons.findIndex(i => (i as HTMLElement).className.includes(' active-')) as number;
        const nextIndex = (activeIndex + 1) % styleButtons.length;
        (styleButtons[nextIndex] as HTMLElement).click();
      }


    }
  }

  init() {};
}
