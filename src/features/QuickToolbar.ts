class QuickToolbar extends Feature {
  
  constructor(storageService: StorageService) {
    super(
      'Quick Toolbar',
      'Select tools from toolbar using keys 1-9',
      true,
      {
        key: null,
        ctrl: false,
        shift: false,
        alt: false,
        meta: false
      },
      Category.TV,
      storageService
    );
  }


  onMouseDown() {};

  onMouseMove() {};

  onKeyDown(e: KeyboardEvent) {
    // TODO
    // Make checkTrigger method accept an array of keys
    // Having the "key" property of this instance's hotkey as null isn't desirable

    if (this.isEnabled() && /^[0-9]$/i.test(e.key)) {
      (document.querySelectorAll('[class*="tv-floating-toolbar__widget"] span')[(e.key as any) -1] as HTMLElement).click()
    }
  }

  init() {};
}
