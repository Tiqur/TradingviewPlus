class DeleteDrawing extends Feature {
  
  constructor(storageService: StorageService) {
    super(
      'Delete Drawing',
      'Deletes currently selected drawing',
      true,
      {
        key: 'd',
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

  onKeyUp() {};
  onMouseWheel() {};

  onKeyDown(e: KeyboardEvent) {
    if (this.checkTrigger(e) && this.isEnabled()) {
      (document.querySelector('[data-name="remove"]') as HTMLElement).click()
    }
  }

  init() {};
}
