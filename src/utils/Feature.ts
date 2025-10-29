interface TVPWheelInfo {
  axis: 'x' | 'y';
  delta: number;
  absDelta: number;
  key: 'WheelUp' | 'WheelDown' | 'WheelLeft' | 'WheelRight';
}

interface Window {
  tvpClassifyWheelEvent?: (e: WheelEvent) => TVPWheelInfo | null;
}

function tvpResolveWheelInfo(e: WheelEvent): TVPWheelInfo {
  const info = window?.tvpClassifyWheelEvent?.(e);
  if (info) return info;

  const absX = Math.abs(e.deltaX);
  const absY = Math.abs(e.deltaY);
  const axisNoise = 100;
  const minPrimary = 40;

  let axis: 'x' | 'y';
  if (absX >= absY + axisNoise) axis = 'x';
  else if (absY >= absX + axisNoise) axis = 'y';
  else axis = absY >= absX ? 'y' : 'x';

  let delta = axis === 'x' ? e.deltaX : e.deltaY;

  if (delta === 0) {
    const altDelta = axis === 'x' ? e.deltaY : e.deltaX;
    if (altDelta !== 0) {
      axis = axis === 'x' ? 'y' : 'x';
      delta = altDelta;
    } else {
      delta = axis === 'x'
        ? (e.deltaX < 0 ? -1 : 1)
        : (e.deltaY < 0 ? -1 : 1);
    }
  }

  if (Math.abs(delta) < minPrimary) {
    const altDelta = axis === 'x' ? e.deltaY : e.deltaX;
    if (Math.abs(altDelta) >= minPrimary) {
      axis = axis === 'x' ? 'y' : 'x';
      delta = altDelta;
    }
  }

  if (Math.abs(delta) < minPrimary) {
    delta = delta < 0 ? -minPrimary : minPrimary;
  }

  const key =
    axis === 'x'
      ? delta < 0 ? 'WheelLeft' : 'WheelRight'
      : delta < 0 ? 'WheelUp' : 'WheelDown';

  return { axis, delta, absDelta: Math.max(1, Math.abs(delta)), key };
}

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
      const hotkeyLabel = document.getElementById(`${this.getName()}-hotkey-label`);
      if (hotkeyLabel) hotkeyLabel.textContent = '...';

      captureHotkey((res) => {
        const rerender = () => {
          const tb = document.querySelector('[id="tvp-menu"] input') as HTMLInputElement | null;
          tb?.dispatchEvent(new InputEvent('input'));
        };

        if (res === 'cancel') {
          snackBar('Keybind assignment canceled');
          rerender();
          return;
        }

        if (res === 'clear') {
          const cleared: Hotkey = { key: null, ctrl:false, shift:false, alt:false, meta:false };
          this.setConfigValue('hotkey', cleared);
          this.setHotkey(cleared);
          this.saveToLocalStorage();
          snackBar('Keybind cleared');
          rerender();
          return;
        }

        const result = checkDuplicateHotkeys(features, res);
        if (!result) {
          this.setHotkey(res);
        } else {
          if (result.reason === 'modifier_only')
            snackBar('Error: Modifier-only keybinds (Ctrl, Shift, Alt) are not supported');
          else if (result.reason === 'unmappable')
            snackBar('Error: This key cannot be assigned as a hotkey (Enter, Space, etc.)');
          else
            snackBar('Error: Duplicate Keybind');
        }
        rerender();
      });
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

    const eventKey = Feature.normalizeEventKey(e);
    if (!eventKey) return false;

    return this.hotkey.key.toLowerCase() === eventKey.toLowerCase()
      && this.hotkey.alt === !!(e as any).altKey
      && this.hotkey.ctrl === !!(e as any).ctrlKey
      && this.hotkey.meta === !!(e as any).metaKey
      && this.hotkey.shift === !!(e as any).shiftKey;
  }

  public static normalizeEventKey(ev: KeyboardEvent | MouseEvent | WheelEvent): string | null {
    if ('key' in ev) return ev.key;
    if ('deltaY' in ev) return tvpResolveWheelInfo(ev as WheelEvent).key;
    if ('button' in ev) {
      const b = (ev as MouseEvent).button;
      return b === 0 ? 'MouseLeft'
        : b === 1 ? 'MouseMiddle'
        : b === 2 ? 'MouseRight'
        : b === 3 ? 'Mouse4'
        : b === 4 ? 'Mouse5'
        : null;
    }
    return null;
  }

  protected static wheelInfoFromEvent(ev: WheelEvent): TVPWheelInfo {
    return tvpResolveWheelInfo(ev);
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
