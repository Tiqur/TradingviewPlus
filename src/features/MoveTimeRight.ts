class MoveTimeRight extends Feature {
  
  constructor() {
    super(
      'Move Time Right',
      'Moves Time Right',
      true,
      {
        key: 'x',
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
      document.querySelector('.chart-page')?.dispatchEvent(new KeyboardEvent(e.type, {'keyCode': 39, 'altKey': true, 'bubbles': true, 'code': 'custom'}));
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
