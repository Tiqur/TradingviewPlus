const colors: Record<string, number> = {
  "1m": 0,
  "3m": 49,
  "5m": 11,
  "15m": 13,
  "1h": 15,
  "4h": 12,
  "D": 10,
  "W": 18,
  "M": 16,
}

// All TV default colors
const defaultColors = ["rgb(255, 255, 255)","rgb(209, 212, 220)", /* ... long list of colors ... */];

class ToggleAutoTimeframeColors extends Feature {
  canvas!: HTMLCanvasElement;

  constructor() {
    super(
      'Auto Timeframe Colors',
      'Automatically changes tool color on click',
      true,
      {
        key: null,
        ctrl: false,
        shift: false,
        alt: false,
        meta: false
      },
      Category.TVP,
      false
    );

    // The following change addresses redundancy by checking if the 'colors' configuration exists before setting default values
    this.addContextMenuOptions([
      new ContextMenuListItem('Colors', () => {
        const colorPickerCm = new ContextMenu([0, 0]);
        let selectedTimeframe: string | null = null;
        let selectedColorPickerSquare: HTMLElement | null = null;

        const colorPickerMenu = this.createColorPickerMenu((colorIndex: number) => {
          if (!selectedTimeframe || !selectedColorPickerSquare) return;
          this.setColor(selectedTimeframe, colorIndex);
          selectedColorPickerSquare.style.background = defaultColors[colorIndex];
          colorPickerCm.hide();
        });

        colorPickerCm.renderElement(colorPickerMenu);
        colorPickerCm.hide();

        const dots = document.getElementById(`${this.getName()}-svg-dots`);
        if (!dots) return;
        const [x, y] = [dots.getBoundingClientRect().x, dots.getBoundingClientRect().y] 

        const cm = new ContextMenu([x, y]);
        const container = document.createElement('div');
        container.className = 'auto-timeframe-colors-context-menu';
        const colors = this.getConfigValue('colors');

        Object.keys(colors).forEach(key => {
          const timeframe = key;
          const colorValue = colors[key];
          const colorContainer = document.createElement('div');
          const colorText = document.createElement('p');
          colorText.innerText = timeframe;
          colorContainer.appendChild(colorText);
          const colorPickerSquare = document.createElement('div');
          colorPickerSquare.className = 'color-square';
          colorPickerSquare.style.background = defaultColors[colorValue];

          colorPickerSquare.addEventListener('click', () => {
            selectedColorPickerSquare = colorPickerSquare;
            selectedTimeframe = timeframe;
            colorPickerCm.show();
          });

          colorContainer.appendChild(colorPickerSquare);
          container.appendChild(colorContainer);
        });

        cm.renderElement(container);

        cm.setClickCallback((event: MouseEvent) => {
          if (colorPickerCm.element != null) {
            if (!(cm.element?.contains(event.target as Node) || colorPickerCm.element.contains(event.target as Node))) {
              cm.destroy();
              colorPickerCm.destroy();
            }
          } else {
            if (!(cm.element?.contains(event.target as Node))) {
              cm.destroy();
            }
          }
        });

        colorPickerCm.setClickCallback((event: MouseEvent) => {
          if (!(cm.element?.contains(event.target as Node) || colorPickerCm.element.contains(event.target as Node))) {
            colorPickerCm.destroy();
          }
        });

        const offset = cm.element.getBoundingClientRect().right - cm.element.getBoundingClientRect().left + 2;
        colorPickerCm.updatePosition([x+offset, y]);
      })
    ]);
  }

  onKeyDown() {}
  onMouseMove() {}
  onKeyUp() {}
  onMouseWheel() {}

  removeColor(key: string) {
    const colorsCopy = this.getConfigValue('colors');
    colorsCopy.delete(key);
    this.setConfigValue('colors', colorsCopy);
  }

  setColor(timeframe: string, num: number) {
    const colorsCopy = this.getConfigValue('colors');
    colorsCopy[timeframe] = num;
    this.setConfigValue('colors', colorsCopy);
  }

  // Addresses redundancy by checking if 'colors' configuration exists before setting default values
  initDefaultColors() {
    const once = this.getConfigValue('once');

    if (once === undefined) {
      console.debug("Setting initial values");
      this.setConfigValue('once', true);

      const colorsExist = this.getConfigValue('colors');
      if (!colorsExist) {
        this.setConfigValue('colors', {
          "1m": 0,
          "3m": 49,
          "5m": 11,
          "15m": 13,
          "1h": 15,
          "4h": 12,
          "D": 10,
          "W": 18,
          "M": 16,
        });
        this.saveToLocalStorage();
        this.printLocalStorage();
      }
    }
  }

  createColorPickerMenu(colorChooseCb: Function): HTMLElement {
    const colorPickerContainer = document.createElement('div');
    colorPickerContainer.className = 'color-picker-context-menu';

    defaultColors.forEach((dc, colorIndex) => {
      const colorElement = document.createElement('span');
      colorElement.style.background = dc;
      colorElement.className = 'color-square';
      colorPickerContainer.appendChild(colorElement);
      
      colorElement.addEventListener('click', () => {colorChooseCb(colorIndex)});
    });

    return colorPickerContainer;
  }

  onMouseDown(e: Event) {
    if (!this.isEnabled() || !this.canvas) return;

    const currentTimeframe = document.querySelector('#header-toolbar-intervals div button[class*="isActive"]')?.textContent;
    if (currentTimeframe == null) return;

    waitForElm('.floating-toolbar-react-widgets__button').then((e) => {
      (document.querySelector('[data-name="line-tool-color"]') as HTMLElement).click()
      const allColors = document.querySelectorAll('[data-name="line-tool-color-menu"] div:not([class]) button');
      const local_colors = this.getConfigValue('colors');
      (allColors[local_colors[currentTimeframe]] as HTMLElement).click();
    })
  }

  init() {
    this.initDefaultColors();

    waitForElm('.chart-gui-wrapper').then(async (e) => {
      this.canvas = document.querySelectorAll('.chart-gui-wrapper canvas')[1] as HTMLCanvasElement;
    })
  }
}
