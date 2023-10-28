class ToggleLogScale extends Feature {
  
  constructor(storageService: StorageService) {
    super(
      'Toggle Log Scale',
      'Toggles the chart\'s "Log" scale',
      true,
      {
        key: 'l',
        ctrl: false,
        shift: false,
        alt: false,
        meta: false
      },
      Category.TV,
      storageService
    );
    this.addContextMenuOptions([
      new ContextMenuListItem('Change Hotkey', () => {
        console.log("Change Hotkey triggered");
      })
    ]);
  }


  onMouseMove() {};

  onMouseDown() {};

  onMouseWheel() {};
  onKeyUp() {};

  onKeyDown(e: KeyboardEvent) {
    if (this.checkTrigger(e) && this.isEnabled()) {
      (document.querySelector('[aria-label="Toggle log scale"]') as HTMLElement).click();
    }
  };

  init() {}
}
