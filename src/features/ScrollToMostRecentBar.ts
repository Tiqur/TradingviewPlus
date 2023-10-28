class ScrollToMostRecentBar extends Feature {
  
  constructor() {
    super(
      'Scroll To Most Recent Bar',
      'Scrolls to to most recent candle',
      true,
      {
        key: 'f',
        ctrl: false,
        shift: false,
        alt: false,
        meta: false
      },
      Category.TV,
    );
    this.addContextMenuOptions([
      new ContextMenuListItem('Change Hotkey', () => {
        console.log("Change Hotkey triggered");
      })
    ]);
  }


  onMouseDown() {};

  onMouseMove() {};
  onMouseWheel() {};
  onKeyUp() {};

  onKeyDown(e: KeyboardEvent) {
    const scrollToMostRecentBarKeyboardEventObj = {
      'keyCode': 39, 'altKey': true, 'shiftKey': true, 'bubbles': true, 'code': 'custom'
    }

    if (this.checkTrigger(e) && this.isEnabled()) {
      document.dispatchEvent(new KeyboardEvent('keydown', scrollToMostRecentBarKeyboardEventObj));
      document.dispatchEvent(new KeyboardEvent('keyup', scrollToMostRecentBarKeyboardEventObj));
    }
  }

  init() {};
}
