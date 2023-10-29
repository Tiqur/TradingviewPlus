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

  constructor() {
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
    );

    this.addContextMenuOptions([
      new ContextMenuListItem('Change Hotkey', () => {
       let hotkey = {
          key: '',
          ctrl: false,
          shift: false,
          alt: false,
          meta: false,
        };

        // Get label element
        const hotkeyLabel = document.getElementById(`${this.getName()}-hotkey-label`);
        if (!hotkeyLabel) return;

        // Wait for key to be pressed
        hotkeyLabel.innerText = '...';

        const keydownListener = (event: KeyboardEvent) => {
          if (event.key !== 'Meta' && event.key !== 'Shift' && event.key !== 'Control' && event.key !== 'Alt') {
            hotkey.key = event.key;
            hotkey.ctrl = event.ctrlKey;
            hotkey.shift = event.shiftKey;
            hotkey.alt = event.altKey;
            hotkey.meta = event.metaKey;

            event.preventDefault();
          }
        }

        const keyupListener = () => {
          // Update 'this.hotkey' with the newly selected hotkey
          console.log("new hotkey:", hotkey);
          this.setHotkey(hotkey)

          // Re-render menu while maintaining fuzzy search results
          // This is kinda hacky
          const textBox: HTMLInputElement = document.querySelector('[id="tvp-menu"] input') as HTMLInputElement;
          textBox.dispatchEvent(new InputEvent('input'));

          // Remove event listeners to stop listening for hotkey input
          document.removeEventListener('keydown', keydownListener);
          document.removeEventListener('keyup', keyupListener);
        }

        document.addEventListener('keyup', keyupListener);
        document.addEventListener('keydown', keydownListener);
      }),
      new ContextMenuListItem('Colors', () => {
        // Launch timeframe colors config
        const cm = new ContextMenu([0, 0]);

        console.log(this.getConfigValue(''))
        
        // Create menu content elment
        const container = document.createElement('div');
        container.innerText = 'test';
        cm.renderElement(container);
      })
    ]);
  }

  onKeyDown() {};
  onMouseMove() {};
  onKeyUp() {};
  onMouseWheel() {};


  removeColor(key: string) {
    const colorsCopy = this.getConfigValue('colors');
    colorsCopy.delete(key);
    this.setConfigValue('colors', colorsCopy);
  }

  addColor(timeframe: string, num: number) {
    const colorsCopy = this.getConfigValue('colors');
    colorsCopy[timeframe] = num;
    this.setConfigValue('colors', colorsCopy);
  }

  initDefaultColors() {
    const once = this.getConfigValue('once');

    // Do stuff if it doesn't exist.  
    // Once done, it will save to local storage and won't execute again
    // as long as cookies aren't cleared
    if (once == undefined) {
      console.debug("setting initial values");
      this.setConfigValue('once', true);

      // Default colors
      this.setConfigValue('colors', {
        "1m": 0,
        "3m": 49,
        "5m": 11,
        "15m": 13,
        "1h": 15,
        "4h": 12,
        "D": 10,
        "W": 18,
      });
      this.saveToLocalStorage();
      this.printLocalStorage();
    }
  }

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
    this.initDefaultColors();

    // Wait for chart to exist
    waitForElm('.chart-gui-wrapper').then(async (e) => {
      this.canvas = document.querySelectorAll('.chart-gui-wrapper canvas')[1] as HTMLCanvasElement;
    })
  }
}
