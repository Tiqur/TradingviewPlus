class ScrollPriceScale extends Feature {
  shiftDown = false;
  scrollDown = false;

  constructor() {
    super(
      'Scroll Price Scale',
      'Allows you to scroll the price scale using a hotkey + the scroll wheel',
      true,
      {
        key: null,
        ctrl: false,
        shift: false,
        alt: false,
        meta: false
      }, Category.TVP,
      false,
      ["Shift", "Scroll"]
    );
    this.addContextMenuOptions([
    ]);
  }

  onMouseDown() {}

  onMouseMove() {}

  onMouseWheel(e: WheelEvent) {
    if ((this.shiftDown || this.scrollDown) && e.clientX !== 0) {
      e.stopPropagation();
      document.querySelector('[class="price-axis"]')?.dispatchEvent(new WheelEvent('wheel', { "deltaY": e.deltaY*8 }));
    }
  }

  // TODO
  // Fix "checkTrigger" to allow for meta keys ( shift, ctrl, etc )
  // instead of having to hardcode it like this

  onKeyDown(e: KeyboardEvent) {
    if (e.key === "Shift") {
      this.shiftDown = true;
    } else if (e.key === "Scroll") {
      this.scrollDown = true;
    }
  }

  onKeyUp(e: KeyboardEvent) {
    if (e.key === "Shift") {
      this.shiftDown = false;
    } else if (e.key === "Scroll") {
      this.scrollDown = false;
    }
  }

  init() {};
}
