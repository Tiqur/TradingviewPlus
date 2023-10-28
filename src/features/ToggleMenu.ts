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
    );
    this.addContextMenuOptions([
      new ContextMenuListItem('Change Hotkey', () => {
        console.log("Change Hotkey triggered");
      })
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
