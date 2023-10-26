enum Category { 'TV', 'TVP' };

abstract class Feature {
  private name: string;
  private tooltip: string;
  private enabled: boolean;
  private hotkey: Hotkey;
  private category: Category;
  private storageService: StorageService;

  constructor(name: string, tooltip: string, enabled: boolean, hotkey: Hotkey, category: Category, storageService: StorageService) {
    this.name = name;
    this.tooltip = tooltip;
    this.enabled = enabled;
    this.hotkey = hotkey;
    this.category = category;
    this.storageService = storageService;
    this.init();
  }

  getCategory(): Category {
    return this.category;
  }

  getName(): string {
    return this.name;
  }

  setHotkey(newHotkey: Hotkey): boolean {
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
    this.storageService.setValue(this.name, this.getJson());
    console.log(this.getJson())
    this.storageService.printStorage();

    // Return true if successfully set
    return true;
  }

  getHotkey(): Hotkey {
    return this.hotkey;
  }

  toggleEnabled() {
    this.enabled = !this.enabled;
  }

  checkTrigger(e: KeyboardEvent): boolean {
    return this.hotkey.key?.toLowerCase() == e.key.toLowerCase()
      && this.hotkey.alt == e.altKey
      && this.hotkey.ctrl == e.ctrlKey
      && this.hotkey.meta == e.metaKey
      && this.hotkey.shift == e.shiftKey;
  }

  abstract init(): void;

  isEnabled(): boolean {
    return this.enabled;
  }

  getJson() {
    return JSON.stringify({
      name: this.name,
      tooltip: this.tooltip,
      enabled: this.enabled,
      hotkey: this.hotkey,
      category: this.category,
    });
  }
}
