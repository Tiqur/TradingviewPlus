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

          if (!checkDuplicateHotkeys(features, hotkey)) {
            // Update 'this.hotkey' with the newly selected hotkey
            this.setHotkey(hotkey)
          } else {
            snackBar('Error: Duplicate Keybind');
          }
        
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
    await this.printLocalStorage();
  }

  public async printLocalStorage() {
    console.log(JSON.parse((await browser.storage.local.get(this.getName()))[this.getName()]));
  }

  public checkTrigger(e: KeyboardEvent): boolean {
    return (this.hotkey.key == null || this.hotkey.key?.toLowerCase() == e.key.toLowerCase())
      && this.hotkey.alt == e.altKey
      && this.hotkey.ctrl == e.ctrlKey
      && this.hotkey.meta == e.metaKey
      && this.hotkey.shift == e.shiftKey;
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
