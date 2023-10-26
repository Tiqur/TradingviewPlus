class ToggleMenu extends Feature {
  
  constructor(storageService: StorageService) {
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
      storageService
    );
  }


  onMouseDown() {};

  onMouseMove() {};
  onMouseWheel() {};
  onKeyUp() {};

  onKeyDown(e: KeyboardEvent) {
    if (this.checkTrigger(e) && this.isEnabled()) {
      const container = document.getElementById('tvp-menu');
      if (!container) return;

      container.style.right = container.style.right == '0px' ? -container.getBoundingClientRect().width+'px': '0px';
    }
  }

  init() {};
}
