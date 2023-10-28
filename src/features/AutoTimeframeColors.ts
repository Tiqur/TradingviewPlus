const colors: Record<string, number> = {
  "1m": 0,
  "3m": 49,
  "5m": 11,
  "15m": 13,
  "1h": 15,
  "4h": 12,
  "D": 10,
  "W": 18,
}

class ToggleAutoTimeframeColors extends Feature {
  canvas!: HTMLCanvasElement;

  constructor(storageService: StorageService) {
    super(
      'Toggle Auto Timeframe Colors',
      'Automatically changes tool color on click',
      true,
      {
        key: 's',
        ctrl: false,
        shift: false,
        alt: false,
        meta: false
      },
      Category.TVP,
      storageService
    );

    this.addContextMenuOptions([
      new ContextMenuListItem('Change Hotkey', () => {
        console.log("Change Hotkey triggered");
      }),
      new ContextMenuListItem('Colors', () => {
        console.log("Colors triggered");
      })
    ]);
  }

  onKeyDown() {};
  onMouseMove() {};
  onKeyUp() {};
  onMouseWheel() {};

  // On canvas click
  onMouseDown(e: Event) {
    if (!this.isEnabled() || !this.canvas) return;

    // Get current timeframe
    const currentTimeframe = document.querySelector('#header-toolbar-intervals div button[class*="isActive"]')?.textContent;
    if (currentTimeframe == null) return;

    // Wait for toolbar
    waitForElm('.floating-toolbar-react-widgets__button').then((e) => {
      // Click Line tool colors on toolbar
      (document.querySelector('[data-name="line-tool-color"]') as HTMLElement).click()
      const allColors = document.querySelectorAll('[data-name="line-tool-color-menu"] div:not([class]) button');
      (allColors[colors[currentTimeframe]] as HTMLElement).click();
    })
  }

  init() {
    // Wait for chart to exist
    waitForElm('.chart-gui-wrapper').then(async (e) => {
      this.canvas = document.querySelectorAll('.chart-gui-wrapper canvas')[1] as HTMLCanvasElement;
    })
  }
}
