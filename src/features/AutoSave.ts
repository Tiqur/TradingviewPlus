class AutoSave extends Feature {

  constructor() {
    super(
      'Auto Save & Restore Layout',
      'Reopens your last layout (instrument, timeframe, drawings) after a browser restart and saves every change',
      true,
      {
        key: null,
        ctrl: false,
        shift: false,
        alt: false,
        meta: false
      },
      Category.XM,
      false
    );
  }

  onMouseDown() {};
  onMouseMove() {};
  onKeyDown() {};
  onMouseWheel() {};
  onKeyUp() {};

  init() {
    window.TVP_Platform?.setAutoSave?.(this.isEnabled());
  }

  public toggleEnabled() {
    super.toggleEnabled();
    window.TVP_Platform?.setAutoSave?.(this.isEnabled());
  }
}
