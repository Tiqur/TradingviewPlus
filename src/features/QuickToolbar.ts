class QuickToolbar extends Feature {
  
  constructor() {
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
      Category.TVP,
      false,
      ["Keys 1-9"]
    );
  }


  onMouseDown() {};

  onMouseMove() {};
  onMouseWheel() {};
  onKeyUp() {};

  onKeyDown(e: KeyboardEvent) {
    // TODO
    // Make checkTrigger method accept an array of keys
    // Having the "key" property of this instance's hotkey as null isn't desirable

    if (this.isEnabled() && /^[0-9]$/i.test(e.key)) {
      // Favourites toolbar items only; the selected-drawing toolbar shares its CSS classes
      (document.querySelectorAll('[data-name^="FavoriteToolbar"]')[(e.key as any) -1] as HTMLElement)?.click()
    }
  }

  init() {};
}
