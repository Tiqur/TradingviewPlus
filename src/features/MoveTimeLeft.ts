class MoveTimeLeft extends Feature {
  
  constructor() {
    super(
      'Move Time Left',
      'Moves Time Left',
      true,
      {
        key: 'z',
        ctrl: false,
        shift: false,
        alt: false,
        meta: false
      },
      Category.TV,
      true
    );
    this.addContextMenuOptions([
    ]);
  }

  onKey(e: KeyboardEvent) {
    if (this.checkTrigger(e) && this.isEnabled())
      document.querySelector('.chart-page')?.dispatchEvent(new KeyboardEvent(e.type, {'keyCode': 37, 'altKey': true, 'bubbles': true, 'code': 'custom'}));
  }

  onMouseDown() {};

  onMouseMove() {};

  onKeyDown(e: KeyboardEvent) {
    this.onKey(e);
  };

  onMouseWheel() {};

  onKeyUp(e: KeyboardEvent) {
    this.onKey(e);
  };

  init() {}
}
