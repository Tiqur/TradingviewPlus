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
      Category.TVP,
      storageService
    );
  }

  init() {
    document.addEventListener('keydown', e => {
      if (this.checkTrigger(e) && this.isEnabled()) {
        (document.querySelector('[aria-label="Toggle auto scale"]') as HTMLElement).click();
      }
    });
  }
}
