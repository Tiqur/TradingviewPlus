class SymbolSearch extends Feature {
  
  constructor(storageService: StorageService) {
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
      Category.TVP,
      storageService
    );
  }


  onMouseDown() {};

  onMouseMove() {};

  onKeyDown(e: KeyboardEvent) {
    if (this.checkTrigger(e) && this.isEnabled()) {
      (document.getElementById('header-toolbar-symbol-search') as HTMLElement).click();
    }
  }

  init() {};
}
