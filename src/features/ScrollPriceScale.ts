class ScrollPriceScale extends Feature {
  triggerDown = false;
  
  constructor() {
    super(
      'Scroll Price Scale',
      'Allows you to scroll the price scale using a hotkey + the scroll wheel',
      true,
      {
        key: null,
        ctrl: false,
        shift: true,
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

  onMouseWheel(e: WheelEvent) {
    console.log(this.triggerDown);
    if (this.triggerDown && (e as WheelEvent).clientX !== 0) {
      // Stop x axis froms scrolling
      e.stopPropagation();

      // Scroll price axis
      document.querySelector('[class="price-axis"]')?.dispatchEvent(new WheelEvent('wheel', {"deltaY": (e as WheelEvent).deltaY*8}));
    }
  }

  // TODO
  // Fix "checkTrigger" to allow for meta keys ( shift, ctrl, etc )
  // instead of having to hardcode it like this

  onKeyDown(e: KeyboardEvent) {
    if (e.key == "Shift" && this.isEnabled()) {
      this.triggerDown = true;
    }
  }

  onKeyUp(e: KeyboardEvent) {
    if (e.key == "Shift") {
      this.triggerDown = false;
    }
  }

  init() {};
}
