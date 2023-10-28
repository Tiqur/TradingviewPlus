class DeleteDrawing extends Feature {
  
  constructor() {
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
      Category.TV,
    );
    this.addContextMenuOptions([
      new ContextMenuListItem('Change Hotkey', () => {
        console.log("Change Hotkey triggered");
      })
    ]);
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
