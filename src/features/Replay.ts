class ToggleReplay extends Feature {
  
  constructor() {
    super(
      'Toggle Replay Mode',
      'Toggles replay mode ( must have pro plan or higher )',
      true,
      {
        key: 'r',
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


  onMouseDown() {};

  onMouseMove() {};
  onMouseWheel() {};
  onKeyUp() {};

  onKeyDown(e: KeyboardEvent) {
    if (this.checkTrigger(e) && this.isEnabled()) {
      (document.getElementById('header-toolbar-replay') as HTMLElement).click();
    }
  }

  init() {};
}
