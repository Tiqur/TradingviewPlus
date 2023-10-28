class InvertScale extends Feature {
  
  constructor(storageService: StorageService) {
    super(
      'Invert Scale',
      'Inverts the chart\'s scale (y-axis)',
      true,
      {
        key: 'i',
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

  onMouseMove() {};

  onKeyUp() {};
  onMouseWheel() {};

  onKeyDown(e: KeyboardEvent) {
    if (this.checkTrigger(e) && this.isEnabled()) {
      // TODO
      // Dispatching keyboard events is better, but for now ill just stick to what works
      //const chartPage = document.querySelector('[class*=chart-page]');
      //const newEvent = new KeyboardEvent('keydown', {'keyCode': 105, 'altKey': true, 'bubbles': true, 'code': 'custom'});


      const element = document.querySelector('[class=price-axis]');
      const boundingRect = element?.getBoundingClientRect();

      element?.dispatchEvent(new MouseEvent('contextmenu', {"clientX": boundingRect?.x, "clientY": boundingRect?.y}));

      // Wait for context menu to pop up
      waitForElm('[data-label="true"]').then(e => {
        // All elements in menu
        const elements = document.querySelectorAll('[data-label="true"]');

        // Loop through context menu to find "Invert scale"
        for (var i = 0; i < elements.length; i++) {
          const el = elements[i] as HTMLElement;
          if (el.innerText === "Invert scale") {
            // Click element
            el.click();
            break;
          }
        }
      });
    }
  }

  init() {};
}
