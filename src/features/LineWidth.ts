class LineWidth extends Feature {
  
  constructor() {
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
      // Click line width button
      (document.querySelector('div[data-name="line-tool-width"]') as HTMLElement)?.click();

      // Line width scrolling
      const widthMenuContainer = document.querySelector('[data-name="line-tool-width-menu"] [data-qa-id="menu-inner"]');
      if (widthMenuContainer) {
        const widthButtons = Array.from(widthMenuContainer.querySelectorAll('div.item-jFqVJoPk.item-KdWj36gM.withIcon-jFqVJoPk.withIcon-KdWj36gM'));

        if (widthButtons.length > 0) {
          // Try multiple methods to find the active button with fallbacks
          let activeIndex = -1;
          
          // Method 1: Check for specific active class
          activeIndex = widthButtons.findIndex(i => (i as HTMLElement).className.includes('isActive-jFqVJoPk'));
          
          // Method 2: Fallback - check for any class containing 'active' or 'selected'
          if (activeIndex === -1) {
            activeIndex = widthButtons.findIndex(i => {
              const element = i as HTMLElement;
              return Array.from(element.classList).some(className =>
                className.toLowerCase().includes('active') ||
                className.toLowerCase().includes('selected')
              );
            });
          }
          
          // Method 3: Fallback - check for aria-selected attribute
          if (activeIndex === -1) {
            activeIndex = widthButtons.findIndex(i =>
              (i as HTMLElement).getAttribute('aria-selected') === 'true' ||
              (i as HTMLElement).getAttribute('aria-current') === 'true'
            );
          }
          
          // Method 4: Fallback - check for any attribute containing 'active' or 'selected'
          if (activeIndex === -1) {
            activeIndex = widthButtons.findIndex(i => {
              const element = i as HTMLElement;
              for (let j = 0; j < element.attributes.length; j++) {
                const attr = element.attributes[j];
                if (attr.name.includes('active') || attr.value.includes('active') ||
                    attr.name.includes('selected') || attr.value.includes('selected')) {
                  return true;
                }
              }
              return false;
            });
          }
          
          // If no active button found, default to first button
          if (activeIndex === -1) {
            activeIndex = 0;
          }
          
          const nextIndex = (activeIndex + 1) % widthButtons.length;
          (widthButtons[nextIndex] as HTMLElement).click();
        }
      }
    }
  }

  init() {};
}