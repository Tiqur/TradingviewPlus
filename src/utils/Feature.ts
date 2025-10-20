enum Category { 'TV', 'TVP' };

abstract class Feature {
  private name: string;
  private tooltip: string;
  private enabled: boolean;
  private hotkey: Hotkey;
  private category: Category;
  private contextMenuOptions: ContextMenuListItem[] = [];
  private config: Record<string, any> = {};
  private alternateHotkeyLabels: null | string[] = null;

  constructor(name: string, tooltip: string, enabled: boolean, hotkey: Hotkey, category: Category, editableHotkey: boolean = true, alternateHotkeyLabels: null | string[] = null) {
    this.name = name;
    this.tooltip = tooltip;
    this.enabled = enabled;
    this.hotkey = hotkey;
    this.category = category;
    this.loadConfigFromLocalStorage().then(() => this.init());
    this.alternateHotkeyLabels = alternateHotkeyLabels;

    if (editableHotkey) {
      this.addHotkeyEditContextMenuItem();
    }
  }

  public abstract init(): void;
  public abstract onKeyDown(e: KeyboardEvent): void;
  public abstract onKeyUp(e: KeyboardEvent): void;
  public abstract onMouseMove(e: MouseEvent): void;
  public abstract onMouseDown(e: MouseEvent): void;
  public abstract onMouseWheel(e: WheelEvent): void;

  public getAlternateHotkeyLabels(): null | string[] {
    return this.alternateHotkeyLabels;
  }

  private addHotkeyEditContextMenuItem() {
    const cmli = new ContextMenuListItem('Change Hotkey', () => {
      let hotkey: Hotkey = { key: '', ctrl: false, shift: false, alt: false, meta: false };

      // hint in UI
      const hotkeyLabel = document.getElementById(`${this.getName()}-hotkey-label`);
      if (hotkeyLabel) hotkeyLabel.innerText = '...';

      const CAPTURE = true;
      let capturing = true;

      const rerender = () => {
        const textBox = document.querySelector('[id="tvp-menu"] input') as HTMLInputElement | null;
        textBox?.dispatchEvent(new InputEvent('input'));
      };

      const cleanup = () => {
        capturing = false;
        document.removeEventListener('keydown', keydownListener, CAPTURE);
        document.removeEventListener('keyup', keyupListener, CAPTURE);
        document.removeEventListener('wheel', wheelListener, CAPTURE);
        document.removeEventListener('mousedown', mousedownListener, CAPTURE);
      };

      const finish = () => {
        if (!capturing) return;
        capturing = false;

        const result = checkDuplicateHotkeys(features, hotkey);
        if (!result) {
          this.setHotkey(hotkey);
        } else {
          if (result.reason === 'modifier_only')
            snackBar('Error: Modifier-only keybinds (Ctrl, Shift, Alt) are not supported');
          else if (result.reason === 'unmappable')
            snackBar('Error: This key cannot be assigned as a hotkey (Enter, Space, etc.)');
          else
            snackBar('Error: Duplicate Keybind');
        }

        rerender();
        cleanup();
      };

      const wheelListener = (event: WheelEvent) => {
        if (!capturing) return;
        event.preventDefault(); event.stopPropagation();
        hotkey.key = event.deltaY < 0 ? 'WheelUp' : 'WheelDown';
        hotkey.ctrl = event.ctrlKey;
        hotkey.shift = event.shiftKey;
        hotkey.alt = event.altKey;
        hotkey.meta = event.metaKey;
        finish(); // commit immediately on wheel
      };

      const mousedownListener = (event: MouseEvent) => {
        if (!capturing) return;
        const mapBtn = (b: number) =>
          b === 0 ? 'MouseLeft' :
          b === 1 ? 'MouseMiddle' :
          b === 2 ? 'MouseRight' :
          b === 3 ? 'Mouse4' :
          b === 4 ? 'Mouse5' : null;

        const key = mapBtn(event.button);
        if (!key) return;

        event.preventDefault(); event.stopPropagation();
        hotkey.key = key;
        hotkey.ctrl = event.ctrlKey;
        hotkey.shift = event.shiftKey;
        hotkey.alt = event.altKey;
        hotkey.meta = (event as any).metaKey;
        finish(); // commit immediately on mouse button
      };

      const keydownListener = (event: KeyboardEvent) => {
        if (!capturing) return;

        // cancel with Escape
        if (event.key === 'Escape') {
          event.preventDefault(); event.stopPropagation();
          snackBar('Keybind assignment canceled');
          rerender();
          cleanup();
          return;
        }

        // clear with Delete
        if (event.key === 'Delete') {
          event.preventDefault(); event.stopPropagation();
          const cleared: Hotkey = { key: null, ctrl: false, shift: false, alt: false, meta: false };
          this.setConfigValue('hotkey', cleared);
          this.setHotkey(cleared);
          this.saveToLocalStorage();
          snackBar('Keybind cleared');
          rerender();
          cleanup();
          return;
        }

        // normal keys (exclude pure modifiers)
        if (!['Meta', 'Shift', 'Control', 'Alt'].includes(event.key)) {
          event.preventDefault(); event.stopPropagation();
          hotkey.key = event.key;
          hotkey.ctrl = event.ctrlKey;
          hotkey.shift = event.shiftKey;
          hotkey.alt = event.altKey;
          hotkey.meta = event.metaKey;
        }
      };

      const keyupListener = () => {
        if (!capturing) return;
        finish(); // commit keyboard path on keyup
      };

      document.addEventListener('keyup', keyupListener, CAPTURE);
      document.addEventListener('keydown', keydownListener, CAPTURE);
      document.addEventListener('wheel', wheelListener, CAPTURE);
      document.addEventListener('mousedown', mousedownListener, CAPTURE);
    });

    this.contextMenuOptions.push(cmli);
  }

  public getConfig() {
    return this.config;
  }

  public getConfigValue(key: string): any {
    return this.config[key];
  }

  public setConfigValue(key: string, value: any) {
    this.config[key] = value;
    this.saveToLocalStorage();
  }

  async loadConfigFromLocalStorage() {
    const configObject = (await browser.storage.local.get(this.getName())) as Record<string, string> | undefined;

    if (configObject != undefined && Object.keys(configObject).length > 0) {
      const configJSON = configObject[this.getName()];
      const configObj = JSON.parse(configJSON);

      this.name = 'name' in configObj ? configObj.name : this.name;
      this.tooltip = 'tooltip' in configObj ? configObj.tooltip : this.tooltip;
      this.enabled = 'enabled' in configObj ? configObj.enabled : this.enabled;
      this.hotkey = 'hotkey' in configObj ? configObj.hotkey : this.hotkey;
      this.category = 'category' in configObj ? configObj.category : this.category;
      this.config = 'config' in configObj ? configObj.config : this.config;
    } else {
      // Handle the case where the data is not found in storage.
      this.saveToLocalStorage();
    }

  }


  public addContextMenuOptions(cmlis: ContextMenuListItem[]) {
    for (const cmli of cmlis) {
      this.contextMenuOptions.push(cmli);
    }
  }
  
  public getContextMenuOptions(): ContextMenuListItem[] {
    return this.contextMenuOptions;
  }

  public getCategory(): Category {
    return this.category;
  }

  public getName(): string {
    return this.name;
  }

  public setHotkey(newHotkey: Hotkey): boolean {
    // Check for conflicts
      features.forEach(f => {
        if (f.hotkey === newHotkey) {
          // Return false if conflicts
          return false;
        }
      })

    // Set new hotkey
    this.hotkey = newHotkey;

    // Set to local storage
    this.saveToLocalStorage();

    // Return true if successfully set
    return true;
  }

  public getHotkey(): Hotkey {
    return this.hotkey;
  }

  public toggleEnabled() {
    this.enabled = !this.enabled;

    snackBar(`${this.getName()} is now ${this.isEnabled() ? 'enabled' : 'disabled'}`);
    this.saveToLocalStorage();

    // Resets checkboxes.  Very indirect but it works
    menu.injectFeatures(Array.from(features.values()));
  }

  public async saveToLocalStorage() {
    // Set to local storage
    await browser.storage.local.set({[this.getName()]: this.getJson()});
  }

  public checkTrigger(e: KeyboardEvent | MouseEvent | WheelEvent): boolean {
    if (!this.hotkey || !this.hotkey.key) return false;

    // normalize event → token
    let eventKey: string | null = null;
    if ('key' in e) {
      eventKey = e.key;
    } else if ('deltaY' in e) {
      eventKey = e.deltaY < 0 ? 'WheelUp' : 'WheelDown';
    } else if ('button' in e) {
      eventKey = e.button === 0 ? 'MouseLeft'
        : e.button === 1 ? 'MouseMiddle'
        : e.button === 2 ? 'MouseRight'
        : e.button === 3 ? 'Mouse4'
        : e.button === 4 ? 'Mouse5'
        : null;
    }

    if (!eventKey) return false;

    return this.hotkey.key.toLowerCase() === eventKey.toLowerCase()
      && this.hotkey.alt === !!(e as any).altKey
      && this.hotkey.ctrl === !!(e as any).ctrlKey
      && this.hotkey.meta === !!(e as any).metaKey
      && this.hotkey.shift === !!(e as any).shiftKey;
  }


  public isEnabled(): boolean {
    return this.enabled;
  }

  public getJson() {
    return JSON.stringify({
      name: this.name,
      tooltip: this.tooltip,
      enabled: this.enabled,
      hotkey: this.hotkey,
      category: this.category,
      config: this.config
    });
  }
}
