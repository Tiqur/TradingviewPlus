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

class AutoTimeframeColors extends FeatureClass {
  init() {
    // Wait for chart to exist
    waitForElm('.chart-gui-wrapper').then(async (e) => {
      // On canvas click
      document.getElementsByClassName("chart-gui-wrapper")[0].children[1].addEventListener('mousedown', async (e) => {
        if (!this.isEnabled()) return;

        // Get current timeframe
        const currentTimeframe = ([].slice.call(document.querySelector('[id="header-toolbar-intervals"]')?.children[0].children)
          .filter(e => (e as HTMLElement).className.includes('isActive'))[0] as HTMLElement).innerText;

        // Wait for toolbar
        waitForElm('.floating-toolbar-react-widgets__button').then((e) => {
          // Click Line tool colors on toolbar
          (document.querySelector('[data-name="line-tool-color"]') as HTMLElement).click()
          const colorBox = document.querySelectorAll('[data-name="menu-inner"]')[0].children[0].children;
          const allColors: HTMLElement[] = [...[].slice.call(colorBox[0].children), ...[].slice.call(colorBox[1].children)];
          (allColors[colors[currentTimeframe]] as HTMLElement).click();
        })
      });
    })
  }
}

features['Auto Timeframe Colors'] = new AutoTimeframeColors({
  name: 'Auto Timeframe Colors',
  tooltip: 'Automatically changes tool color on click',
  enabled: true,
  hotkey: {
    key: 's',
    alt: false,
    shift: false,
    ctrl: false,
    meta: false
  },
  category: 'Features',
});

