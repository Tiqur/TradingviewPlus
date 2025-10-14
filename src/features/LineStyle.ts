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
      // Click line style button
      (document.querySelector('div[data-name="style"]') as HTMLElement)?.click();

      // Line style scrolling
      const styleMenuContainer = document.querySelector('[data-name="style-menu"] [data-qa-id="menu-inner"]');
      if (styleMenuContainer) {
        const styleButtons = Array.from(styleMenuContainer.querySelectorAll('tr[data-role="menuitem"]'));
        if (styleButtons.length > 0) {
          // Try multiple methods to find the active button with fallbacks
          let activeIndex = -1;
          
          // Method 1: Check for specific active class
          activeIndex = styleButtons.findIndex(i => (i as HTMLElement).classList.contains('active-GJX1EXhk'));
          
          // Method 2: Fallback - check for any class containing 'active' or 'selected'
          if (activeIndex === -1) {
            activeIndex = styleButtons.findIndex(i => {
              const element = i as HTMLElement;
              return Array.from(element.classList).some(className =>
                className.toLowerCase().includes('active') ||
                className.toLowerCase().includes('selected')
              );
            });
          }
          
          // Method 3: Fallback - check for aria-selected attribute
          if (activeIndex === -1) {
            activeIndex = styleButtons.findIndex(i =>
              (i as HTMLElement).getAttribute('aria-selected') === 'true' ||
              (i as HTMLElement).getAttribute('aria-current') === 'true'
            );
          }
          
          // Method 4: Fallback - check for any attribute containing 'active' or 'selected'
          if (activeIndex === -1) {
            activeIndex = styleButtons.findIndex(i => {
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
          
          const nextIndex = (activeIndex + 1) % styleButtons.length;
          const nextStyleButton = styleButtons[nextIndex] as HTMLElement;
          if (nextStyleButton) {
            nextStyleButton.click();
          }
        }
      }
    }
  }

  init() {};
}