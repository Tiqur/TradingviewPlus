class LineWidth extends Feature {
  
  constructor(storageService: StorageService) {
    super(
      'Change Line Width',
      'Scrolls line width ( 1px, 2px, 3px, 4px )',
      true,
      {
        key: 'w',
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
      // Click line width button
      (document.querySelector('[data-name="line-tool-width"]') as HTMLElement).click()

      // Line width scrolling
      const widthButtons = Array.from(document.querySelectorAll('[data-name="menu-inner"] div'));

      if (widthButtons.length > 0) {
        const activeIndex = widthButtons.findIndex(i => (i as HTMLElement).className.includes('isActive')) as number;
        console.log(activeIndex);
        const nextIndex = (activeIndex + 1) % widthButtons.length;
        (widthButtons[nextIndex] as HTMLElement).click();
      }


    }
  }

  init() {};
}
