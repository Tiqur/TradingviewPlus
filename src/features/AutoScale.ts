class ToggleAutoScale extends Feature {
  
  constructor(storageService: StorageService) {
    super(
      'Toggle Auto Scale',
      'Toggles the chart\'s "Auto" scale',
      true,
      {
        key: 'a',
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


  onMouseDown() {};

  onMouseWheel() {};

  onMouseMove() {};

  onKeyUp() {};

  onKeyDown(e: KeyboardEvent) {
    if (this.checkTrigger(e) && this.isEnabled()) {
      (document.querySelector('[aria-label="Toggle auto scale"]') as HTMLElement).click();
    }
  }

  init() {};
}
