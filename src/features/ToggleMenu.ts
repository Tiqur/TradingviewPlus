class ToggleMenu extends Feature {
  
  constructor() {
    super(
      'Toggle TVP Menu',
      'Toggles TVP\'s custom menu',
      true,
      {
        key: 'm',
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
      menu.toggle();
    }
  }

  init() {};
}
