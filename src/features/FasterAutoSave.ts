class FasterAutoSave extends Feature {

  constructor() {
    super(
      'Faster Auto Save',
      'Saves your layout 15 s after a change instead of TradingView\'s 5 minutes, and when you scroll timeframes',
      true,
      {
        key: null,
        ctrl: false,
        shift: false,
        alt: false,
        meta: false
      },
      Category.TV,
      false
    );
  }

  onMouseDown() {};
  onMouseMove() {};
  onKeyDown() {};
  onMouseWheel() {};
  onKeyUp() {};

  init() {
    window.TVP_Platform?.setFasterAutoSave?.(this.isEnabled());
  }

  public toggleEnabled() {
    super.toggleEnabled();
    window.TVP_Platform?.setFasterAutoSave?.(this.isEnabled());
  }

  // tradingview.com only: XM's chart has Auto Save & Restore Layout
  public isAvailable(): boolean {
    return !!window.TVP_Platform?.setFasterAutoSave;
  }
}
