class ToggleAutoTimeframeColors extends Feature {
  
  constructor() {
    super(
      'Toggle AutoTimeframeColors',
      'Toggles AutoTimeframeColors',
      true,
      {
        key: 'g',
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
      console.log(features.get('Auto Timeframe Colors'));
      features.get('Auto Timeframe Colors')?.toggleEnabled();
    }
  }

  init() {};
}
