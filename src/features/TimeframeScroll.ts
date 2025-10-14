class TimeframeScroll extends Feature {
  triggerDown = false;
  private scrollTimeout: number | null = null;
  
  constructor() {
    super(
      'Scroll Timeframes',
      'Allows you to scroll timeframes using a modifier + scroll wheel',
      true,
      {
        key: 'Tab',
        ctrl: false,
        shift: false,
        alt: false,
        meta: false
      },
      Category.TVP,
      false,
      ["Tab", "Scroll"]
    );
    this.addContextMenuOptions([
    ]);
  }


  onMouseDown() {};

  onMouseMove() {};

  onMouseWheel(e: WheelEvent) {
    if (this.triggerDown) {
      // Prevent multiple scroll events from processing simultaneously
      if (this.scrollTimeout) {
        window.clearTimeout(this.scrollTimeout);
      }

      // Debounce the scroll events to ensure DOM has time to update
      this.scrollTimeout = window.setTimeout(() => {
        this.processScroll(e);
        this.scrollTimeout = null;
      }, 50); // Reduced delay for faster response
    }
  }

  private processScroll(e: WheelEvent) {
    // Get each individual timeframe button and convert NodeList to array
    const timeframeButtons = Array.from(document.querySelectorAll('#header-toolbar-intervals div[role="radiogroup"] button'));
    
    if (timeframeButtons.length === 0) {
      return;
    }

    // Get current timeframe - try to find the active button by looking for 'isActive' in classList
    const activeButton = document.querySelector('#header-toolbar-intervals div[role="radiogroup"] button.isActive-GwQQdU8S') as HTMLElement;
    if (!activeButton) {
      return;
    }

    // Get direction of scroll wheel
    // Negative deltaY = scroll up = move to next timeframe (higher index)
    // Positive deltaY = scroll down = move to previous timeframe (lower index)
    const direction = e.deltaY < 0 ? 1 : -1;

    // Get index of current active timeframe in the DOM array (no sorting needed, use natural order)
    const currentTimeframeIndex = timeframeButtons.indexOf(activeButton);

    if (currentTimeframeIndex === -1) {
      return;
    }

    // Calculate new timeframe index based on scroll delta without wraparound
    const newTimeframeIndex = currentTimeframeIndex + direction;
    
    // Only click if we're within valid range (no wraparound)
    if (newTimeframeIndex >= 0 && newTimeframeIndex < timeframeButtons.length) {
      const targetButton = timeframeButtons[newTimeframeIndex];
      if (targetButton) {
        (targetButton as HTMLElement).click();
      }
    }
 }

  // TODO
  // Fix "checkTrigger" to allow for meta keys ( shift, ctrl, etc )
  // instead of having to hardcode it like this
  onKeyDown(e: KeyboardEvent) {
    if (this.checkTrigger(e)) {
      this.triggerDown = true;
    }
  }

  onKeyUp(e: KeyboardEvent) {
    if (this.checkTrigger(e)) {
      this.triggerDown = false;
    }
  }

  init() {
    // Initialization is not required for this feature as it works on scroll events
  }
}