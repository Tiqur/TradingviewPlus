class SymbolSearch extends Feature {
  
  constructor() {
    super(
      'Open Symbol Search',
      'Opens the symbol search menu',
      true,
      {
        key: 't',
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
      (document.getElementById('header-toolbar-symbol-search') as HTMLElement).click();
    }
  }

  init() {};
}
