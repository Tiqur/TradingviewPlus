class TimeframeScroll extends Feature {
  // Separating hotkeys into individual variables
  triggerDown = false;
  hotkey = 'Tab';
  ctrl = false;
  shift = false;
  alt = false;
  meta = false;

  constructor() {
    super(
      'Scroll Timeframes',
      'Allows you to scroll timeframes using a modifier + scroll wheel',
      true,
      {
        key: this.hotkey,
        ctrl: this.ctrl,
        shift: this.shift,
        alt: this.alt,
        meta: this.meta
      },
      Category.TVP,
      false,
      [this.hotkey, 'Scroll']
    );
    this.addContextMenuOptions([]);
  }

  onMouseDown() {};

  onMouseMove() {};

  onMouseWheel(e: WheelEvent) {
    if (this.triggerDown) {
      document.getElementsByClassName('chart-page')[0].dispatchEvent(new KeyboardEvent('keydown', {'bubbles': true, 'keyCode': 27}));

      // Get each individual timeframe button and convert NodeList to array
      const timeframeButtons = Array.from(document.querySelectorAll('#header-toolbar-intervals > div button'));

      // Get current timeframe
      const currentTimeframe = document.querySelector('#header-toolbar-intervals div button[class*="isActive"]')?.textContent;
      if (currentTimeframe == null) return;

      // Get direction of scroll wheel
      const direction = e.deltaY < 0 ? -1 : 1;

      // Get index of current active timeframe in array
      const currentTimeframeIndex = timeframeButtons.findIndex(e => e.classList.contains('isActive'));

      // Calculate new timeframe index based on scroll delta
      const newTimeframeIndex = currentTimeframeIndex + direction;

      // Click the calculated button
      if (newTimeframeIndex > -1 && newTimeframeIndex < timeframeButtons.length) {
        (timeframeButtons[newTimeframeIndex] as HTMLElement).click();
      } 
    }
  }

  // TODO
  // Updated comment to reflect changes made
  // Separated out trigger key conditions for flexibility
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

  // Updated comment to reflect that there's no code change here
  init() {};
}
