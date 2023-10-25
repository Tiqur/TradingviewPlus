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
  }

  init() {
    // Wait for chart to exist
    waitForElm('.chart-gui-wrapper').then(async (e) => {
      const canvas = document.querySelectorAll('.chart-gui-wrapper canvas')[1];

      // On canvas click
      canvas.addEventListener('mousedown', async (e) => {
        if (!this.isEnabled()) return;

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
      });
    })

    document.addEventListener('keydown', e => {
      if (this.checkTrigger(e) && this.isEnabled()) {
        (document.querySelector('[aria-label="Toggle auto scale"]') as HTMLElement).click();
      }
    });
  }
}
