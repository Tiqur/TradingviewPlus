class AutoMagnet extends Feature {

  constructor() {
    super(
      'Auto Magnet',
      'Turns the magnet on each time the chart loads. Turning it off lasts until you reload',
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
    window.TVP_Platform?.setAutoMagnet?.(this.isEnabled());
  }

  public toggleEnabled() {
    super.toggleEnabled();
    window.TVP_Platform?.setAutoMagnet?.(this.isEnabled());
  }
}
