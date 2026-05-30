// All TV default colors
const defaultColors = ["rgb(255, 255, 255)", "rgb(209, 212, 220)", "rgb(178, 181, 190)", "rgb(149, 152, 161)", "rgb(120, 123, 134)", "rgb(93, 96, 107)", "rgb(67, 70, 81)", "rgb(42, 46, 57)", "rgb(19, 23, 34)", "rgb(0, 0, 0)", "rgb(242, 54, 69)", "rgb(255, 152, 0)", "rgb(255, 235, 59)", "rgb(76, 175, 80)", "rgb(8, 153, 129)", "rgb(0, 188, 212)", "rgb(41, 98, 255)", "rgb(103, 58, 183)", "rgb(156, 39, 176)", "rgb(233, 30, 99)", "rgb(252, 203, 205)", "rgb(255, 224, 178)", "rgb(255, 249, 196)", "rgb(200, 230, 201)", "rgb(172, 229, 220)", "rgb(178, 235, 242)", "rgb(187, 217, 251)", "rgb(209, 196, 233)", "rgb(225, 190, 231)", "rgb(248, 187, 208)", "rgb(250, 161, 164)", "rgb(255, 204, 128)", "rgb(255, 245, 157)", "rgb(165, 214, 167)", "rgb(112, 204, 189)", "rgb(128, 222, 234)", "rgb(144, 191, 249)", "rgb(179, 157, 219)", "rgb(206, 147, 216)", "rgb(244, 143, 177)", "rgb(247, 124, 128)", "rgb(255, 183, 77)", "rgb(255, 241, 118)", "rgb(129, 199, 132)", "rgb(66, 189, 168)", "rgb(77, 208, 225)", "rgb(91, 156, 246)", "rgb(149, 117, 205)", "rgb(186, 104, 200)", "rgb(240, 98, 146)", "rgb(247, 82, 95)", "rgb(255, 167, 38)", "rgb(255, 238, 88)", "rgb(102, 187, 106)", "rgb(34, 171, 148)", "rgb(38, 198, 218)", "rgb(49, 121, 245)", "rgb(126, 87, 194)", "rgb(171, 71, 188)", "rgb(236, 64, 122)", "rgb(178, 40, 51)", "rgb(245, 124, 0)", "rgb(251, 192, 45)", "rgb(56, 142, 60)", "rgb(5, 102, 86)", "rgb(0, 151, 167)", "rgb(24, 72, 204)", "rgb(81, 45, 168)", "rgb(123, 31, 162)", "rgb(194, 24, 91)", "rgb(128, 25, 34)", "rgb(230, 81, 0)", "rgb(245, 127, 23)", "rgb(27, 94, 32)", "rgb(0, 51, 42)", "rgb(0, 96, 100)", "rgb(12, 50, 153)", "rgb(49, 27, 146)", "rgb(74, 20, 140)", "rgb(136, 14, 79)"]

class AutoTimeframeColors extends Feature {
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

    this.addContextMenuOptions([
      new ContextMenuListItem('Colors', () => {
        // Create new context menu for color picker
        const colorPickerCm = new ContextMenu([0, 0]);

        let selectedTimeframe: string | null = null;
        let selectedColorPickerSquare: HTMLElement | null = null;

        // Callback for color choose
        const colorPickerMenu = this.createColorPickerMenu((colorIndex: number) => {
          if (!selectedTimeframe || !selectedColorPickerSquare) return;
          this.setColor(selectedTimeframe, colorIndex);
          selectedColorPickerSquare.style.background = defaultColors[colorIndex];
          colorPickerCm.hide();
        });

        // Render color picker container
        colorPickerCm.renderElement(colorPickerMenu);

        // Hide initially on open
        colorPickerCm.hide();


        // Get position of dots
        const dots = document.getElementById(`${this.getName()}-svg-dots`);
        if (!dots) return;
        const [x, y] = [dots.getBoundingClientRect().x, dots.getBoundingClientRect().y]


        // Launch timeframe colors config
        const cm = new ContextMenu([x, y]);

        // Create menu content elment
        const container = document.createElement('div');
        container.className = 'auto-timeframe-colors-context-menu';

        // Get colors from config
        const local_colors = this.getConfigValue('colors');

        // Get all timeframes as array
        const favoritedTimeframeElements = Array.from(document.querySelectorAll('#header-toolbar-intervals div button'));

        if (favoritedTimeframeElements.length > 0) {
          // Create each element containing timeframe and color square
          favoritedTimeframeElements.forEach(element => {
            const timeframe = element.textContent as string;
            const colorValue = local_colors[timeframe] || local_colors[0];


            // Container to hold each color square for their respective timeframe
            const colorContainer = document.createElement('div');

            // Text containing the timeframe
            const colorText = document.createElement('p');
            colorText.innerText = timeframe;
            colorText.className = 'timeframe-text';
            colorContainer.appendChild(colorText);

            // The color square itself
            const colorPickerSquare = document.createElement('div');
            colorPickerSquare.className = 'color-square';
            colorPickerSquare.style.background = defaultColors[colorValue];

            // On click, open / create color picker menu
            colorPickerSquare.addEventListener('click', () => {
              selectedColorPickerSquare = colorPickerSquare;
              selectedTimeframe = timeframe;
              colorPickerCm.show();
            });

            colorContainer.appendChild(colorPickerSquare);


            // Append color container
            container.appendChild(colorContainer);
          });
        } else {

          const textNode = document.createElement('p');
          textNode.innerText = "Please favorite some timeframes to use this feature"
          container.appendChild(textNode);
        }

        cm.renderElement(container);

        // Make it so the main color config menu doesn't close if
        // the user clicks within the color picker menu
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

        // Make it so ColorPickerMenu doesn't close if clicking within cm
        colorPickerCm.setClickCallback((event: MouseEvent) => {
          if (!(cm.element?.contains(event.target as Node) || colorPickerCm.element.contains(event.target as Node))) {
            colorPickerCm.destroy();
          }
        });

        /* Update ColorPickerMenu position */
        // Calculate position
        const cmWidth = cm.element.getBoundingClientRect().right - cm.element.getBoundingClientRect().left;
        let targetX = x + cmWidth + 2;

        const menu = document.getElementById('tvp-menu');
        if (menu && colorPickerCm.element) {
          colorPickerCm.element.hidden = false;
          colorPickerCm.element.style.visibility = 'hidden';

          const pickerWidth = colorPickerCm.element.offsetWidth;
          const menuWidth = window.innerWidth;

          // If it flows off screen to the right, open to the left instead
          if (targetX + pickerWidth > menuWidth) {
            targetX = x - pickerWidth - 2;
          }

          colorPickerCm.element.style.visibility = 'visible';
          colorPickerCm.element.hidden = true;
        }

        colorPickerCm.updatePosition([targetX, y]);
      })
    ]);
  }

  onKeyDown() { };
  onMouseMove() { };
  onKeyUp() { };
  onMouseWheel() { };


  removeColor(key: string) {
    const colorsCopy = this.getConfigValue('colors');
    colorsCopy.delete(key);
    this.setConfigValue('colors', colorsCopy);
  }

  setColor(timeframe: string, num: number) {
    const colorsCopy = this.getConfigValue('colors');
    colorsCopy[timeframe] = num;
    this.setConfigValue('colors', colorsCopy);
    this.saveToLocalStorage();
  }

  initDefaultColors() {
    const once = this.getConfigValue('once');

    // Do stuff if it doesn't exist.  
    // Once done, it will save to local storage and won't execute again
    // as long as cookies aren't cleared
    if (once == undefined) {
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
        "M": 16,
        "12M": 3,
      });
    }
  }

  createColorPickerMenu(colorChooseCb: Function): HTMLElement {
    // Inject color picker into menu, replace current element
    const colorPickerContainer = document.createElement('div');
    colorPickerContainer.className = 'color-picker-context-menu';

    // Create and initialize click even for each color square
    defaultColors.forEach((dc, colorIndex) => {
      const colorElement = document.createElement('span');
      colorElement.style.background = dc;
      colorElement.className = 'color-square';
      colorPickerContainer.appendChild(colorElement);

      colorElement.addEventListener('click', () => { colorChooseCb(colorIndex) });
    });

    return colorPickerContainer;
  }

  private isApplying = false;
  private isMouseDown = false;
  private lastSyncedTF: string | null = null;

  // Resolves the current active timeframe label via the platform adapter.
  private getCurrentTimeframe(): string | null {
    return window.TVP_Platform?.getCurrentTimeframe() ?? null;
  }

  // Dispatches a high-fidelity sequence of events to simulate a perfect human click.
  // This is much more reliable than el.click() because it triggers React listeners
  // that might be specifically watching for pointerdown or mouseup.
  private dispatchSequentialClick(el: HTMLElement) {
    const events = ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'];
    events.forEach(type => {
      const MouseEventClass = type.startsWith('pointer') ? window.PointerEvent || window.MouseEvent : window.MouseEvent;
      const event = new MouseEventClass(type, {
        bubbles: true,
        cancelable: true,
        view: window,
        detail: 1,
        button: 0,
        buttons: 1,
        clientX: el.getBoundingClientRect().left + el.offsetWidth / 2,
        clientY: el.getBoundingClientRect().top + el.offsetHeight / 2,
        // @ts-ignore - pointerType is valid for PointerEvent
        pointerType: 'mouse',
        isPrimary: true
      });
      el.dispatchEvent(event);
    });
  }

  // Uses requestAnimationFrame to wait until the toolbar's position has stabilized.
  // TV often animates the toolbar into position; clicking too early fails.
  private waitForStability(el: HTMLElement, callback: () => void, maxFrames = 60) {
    let lastRect = el.getBoundingClientRect();
    let frameCount = 0;
    let stableFrames = 0;

    const check = () => {
      const currentRect = el.getBoundingClientRect();
      const isPositionSame = 
        Math.abs(currentRect.left - lastRect.left) < 0.1 && 
        Math.abs(currentRect.top - lastRect.top) < 0.1;

      if (isPositionSame) {
        stableFrames++;
      } else {
        stableFrames = 0;
      }

      lastRect = currentRect;
      frameCount++;

      // Minimal stability: 1 frame is enough for "instant" feel.
      if (stableFrames >= 1) {
        callback();
      } else if (frameCount < maxFrames) {
        requestAnimationFrame(check);
      } else {
        callback();
      }
    };

    requestAnimationFrame(check);
  }

  // Frame-Locked Polling: Uses requestAnimationFrame to check for TF changes
  // at the monitor's refresh rate. This is much faster than setInterval.
  private waitForTimeframeChange(callback: (newTF: string) => void, maxFrames = 180) {
    let frames = 0;
    const check = () => {
      const currentTF = this.getCurrentTimeframe();
      if (currentTF && currentTF !== this.lastSyncedTF) {
        callback(currentTF);
      } else if (frames < maxFrames) {
        frames++;
        requestAnimationFrame(check);
      } else if (currentTF) {
        callback(currentTF);
      }
    };
    requestAnimationFrame(check);
  }

  // Applies the current TF's configured color to the open color picker menu.
  private processColorMenu(menu: HTMLElement, currentTimeframe: string) {
    try {
      const local_colors = this.getConfigValue('colors');
      const colorIdx = local_colors[currentTimeframe];

      if (colorIdx === undefined) {
        document.body.click();
        return;
      }

      // Use platform adapter to get swatches — handles Dhan hash classes, Binance custom menus etc.
      const allColors = window.TVP_Platform?.getColorSwatches() ?? [];

      if (allColors.length === 0) {
        document.body.click();
        return;
      }

      const targetRgb = defaultColors[colorIdx];
      if (!targetRgb) {
        document.body.click();
        return;
      }
      const norm = (s: string) => (s || '').toLowerCase().replace(/\s+/g, '');
      const targetNorm = norm(targetRgb);

      const exactSwatch = allColors.find(el => {
        if (!el) return false;
        if (norm(el.style.backgroundColor) === targetNorm) return true;
        if (norm(el.style.color) === targetNorm) return true;
        if (norm(el.style.background) === targetNorm) return true;
        const child = el.querySelector<HTMLElement>('[style*="rgb"]');
        if (child) {
          return norm(child.style.backgroundColor) === targetNorm ||
                 norm(child.style.color) === targetNorm ||
                 norm(child.style.background) === targetNorm;
        }
        return false;
      });

      if (exactSwatch) {
        exactSwatch.click();
      } else if (allColors[colorIdx]) {
        allColors[colorIdx].click();
      } else {
        document.body.click();
      }
    } catch (err) {
      console.error('[AutoTimeframeColors] Error in processColorMenu:', err);
      try { document.body.click(); } catch {}
    } finally {
      // Unlock almost immediately to allow rapid-fire changes (e.g. multi-selection).
      setTimeout(() => {
        this.isApplying = false;
      }, 50);
    }
  }

  private applyColorToButton(colorButton: HTMLElement, currentTimeframe: string) {
    if (this.isApplying) return;

    try {
      if (window.TVP_Platform?.isColorMenuOpen()) {
        const existingMenu = document.querySelector<HTMLElement>('[data-qa-id="line-tool-color-menu"]');
        if (existingMenu) {
          this.isApplying = true;
          this.processColorMenu(existingMenu, currentTimeframe);
          return;
        }
      }

      this.isApplying = true;
      this.lastSyncedTF = currentTimeframe;

      let menuFound = false;
      let hammerFrame: number;

      // Watch for the color picker menu to appear in response to our interaction.
      const menuObserver = new MutationObserver(() => {
        try {
          if (window.TVP_Platform?.isColorMenuOpen()) {
            const menu = document.querySelector<HTMLElement>('[data-qa-id="line-tool-color-menu"]');
            if (menu) {
              menuFound = true;
              menuObserver.disconnect();
              clearTimeout(failsafe);
              this.processColorMenu(menu, currentTimeframe);
            }
          }
        } catch (err) {
          console.error('[AutoTimeframeColors] Error in menuObserver:', err);
          menuObserver.disconnect();
          clearTimeout(failsafe);
          this.isApplying = false;
          cancelAnimationFrame(hammerFrame);
        }
      });
      menuObserver.observe(document.body, { childList: true, subtree: true });

      // Failsafe: unlock after 2 seconds no matter what.
      const failsafe = setTimeout(() => {
        try {
          if (!menuFound) {
            console.warn('[AutoTimeframeColors] Failsafe hit, unlocking isApplying');
            menuObserver.disconnect();
            this.isApplying = false;
            cancelAnimationFrame(hammerFrame);
          }
        } catch (err) {
          console.error('[AutoTimeframeColors] Error in failsafe:', err);
          this.isApplying = false;
        }
      }, 2000);

      // Frame-Locked Hammer: Re-dispatch every frame until the menu opens.
      // This is the fastest way to pierce the UI on slow systems.
      const hammer = () => {
        try {
          if (menuFound || !this.isApplying) {
            clearTimeout(failsafe);
            return;
          }

          // Abort hammer entirely ONLY if the button is removed from the DOM
          if (!colorButton.isConnected) {
            this.isApplying = false;
            menuObserver.disconnect();
            clearTimeout(failsafe);
            return;
          }

          this.dispatchSequentialClick(colorButton);
          hammerFrame = requestAnimationFrame(hammer);
        } catch (err) {
          console.error('[AutoTimeframeColors] Error in hammer:', err);
          this.isApplying = false;
          menuObserver.disconnect();
          clearTimeout(failsafe);
        }
      };
      hammerFrame = requestAnimationFrame(hammer);
    } catch (err) {
      console.error('[AutoTimeframeColors] Error in applyColorToButton:', err);
      this.isApplying = false;
    }
  }

  // ─── Scenario 3: Timeframe change while a tool is already selected ───────────
  // The floating toolbar is already fully stable. We can click the color button
  // immediately with no timing concerns.
  private handleTFChange() {
    if (!this.isEnabled()) return;

    const sync = (tf: string) => {
      const colorButton = window.TVP_Platform?.getLineColorButton();
      if (colorButton) {
        this.applyColorToButton(colorButton, tf);
      }
    };

    const immediateTF = this.getCurrentTimeframe();
    // If we have a new TF already, sync instantly. Else, wait for up to 3s.
    if (immediateTF && immediateTF !== this.lastSyncedTF) {
      sync(immediateTF);
    } else {
      this.waitForTimeframeChange((newTF) => sync(newTF), 150);
    }
  }

  // ─── Scenarios 1, 2, 4: floating toolbar was just mounted by TradingView ────
  // The MutationObserver fires every time TV adds a [data-name="line-tool-color"]
  // element to the DOM. We debounce so that multiple insertions (tool by tool)
  // collapse into a single applyColor call.
  private syncTimeout: ReturnType<typeof setTimeout> | null = null;

  private handleToolbarMounted() {
    if (!this.isEnabled() || this.isApplying) return;

    const executeSync = () => {
      // Clear any pending sync to avoid double-firings
      if (this.syncTimeout) {
        clearTimeout(this.syncTimeout);
        this.syncTimeout = null;
      }

      if (!this.isEnabled() || this.isApplying) return;

      const currentTimeframe = this.getCurrentTimeframe();
      if (!currentTimeframe) return;

      const colorButton = window.TVP_Platform?.getLineColorButton();
      if (!colorButton) return;

      this.applyColorToButton(colorButton, currentTimeframe);
    };

    if (this.isMouseDown) {
      const onMouseUp = () => {
        document.removeEventListener('mouseup', onMouseUp, { capture: true });
        
        // Wait 50ms before executing. If TV destroys the toolbar and makes a new one 
        // after a drag, the new toolbar's 'handleToolbarMounted' will fire and 
        // cancel this timeout, applying color perfectly to the new UI.
        this.syncTimeout = setTimeout(executeSync, 50);
      };
      document.addEventListener('mouseup', onMouseUp, { capture: true, once: true });
    } else {
      executeSync();
    }
  }

  setupObservers() {
    // ─── Scenario 3: Timeframe change ──────────────────────────────────────────
    // Use platform adapter to get the container to observe.
    waitForElm('#header-toolbar-intervals').then(() => {
      const container = window.TVP_Platform?.getTimeframeContainer();
      if (!container) return;
      new MutationObserver(() => this.handleTFChange()).observe(container, {
        attributes: true,
        subtree: true,
        attributeFilter: ['class', 'aria-selected', 'aria-pressed']
      });
    });

    // ─── Scenarios 1, 2, 4: toolbar mounted ────────────────────────────────────
    // Watch for any floating toolbar element being added to the DOM.
    // Uses isFloatingToolbarNode() from the platform adapter so each platform
    // can define what constitutes a "floating toolbar" in its own DOM structure.
    const toolbarObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of Array.from(mutation.addedNodes)) {
          if (node.nodeType !== Node.ELEMENT_NODE) continue;
          const el = node as HTMLElement;
          if (window.TVP_Platform?.isFloatingToolbarNode(el) ||
              el.matches?.('[data-name="line-tool-color"]') ||
              el.querySelector?.('[data-name="line-tool-color"]')) {
            this.handleToolbarMounted();
            return;
          }
        }
      }
    });
    toolbarObserver.observe(document.body, { childList: true, subtree: true });

    // ─── Selection Capture & Predictive Hunting ───────────────────────────────
    // We use capturing listeners to track the mouse state globally. 
    document.addEventListener('mousedown', (e: MouseEvent) => { 
      this.isMouseDown = true;

      // PREDICTIVE HUNT: If clicking on the left toolbar, a floating toolbar is coming.
      // We start a high-speed rAF loop to 'catch' it the microsecond it exists.
      const target = e.target as HTMLElement;
      if (window.TVP_Platform?.isClickOnDrawingToolbar(target)) {
        let frames = 0;
        const hunt = () => {
          const btn = window.TVP_Platform?.getLineColorButton();
          if (btn) {
            // Found it! Trigger the sync immediately while mouse is still down.
            this.handleToolbarMounted();
          } else if (frames < 30 && this.isMouseDown) {
            frames++;
            requestAnimationFrame(hunt);
          }
        };
        requestAnimationFrame(hunt);
      }
    }, { capture: true });

    document.addEventListener('mouseup', () => { 
      this.isMouseDown = false;
    }, { capture: true });
  }

  // Required by the Feature interface — canvas mousedown is no longer used for color triggering.
  // Color triggering is now fully event-driven via the toolbar mount observer.
  onMouseDown(e: Event) {
    return;
  }

  init() {
    this.initDefaultColors();
    this.setupObservers();
  }
}