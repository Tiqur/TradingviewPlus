class DrawingDefaults extends Feature {

  constructor() {
    super(
      'Drawing Defaults',
      'Applies TVP\'s styles to new rays, date & price ranges and long / short positions each time the chart loads',
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
    window.TVP_Platform?.setDrawingDefaults?.(this.isEnabled());
  }

  public toggleEnabled() {
    super.toggleEnabled();
    window.TVP_Platform?.setDrawingDefaults?.(this.isEnabled());
  }
}
